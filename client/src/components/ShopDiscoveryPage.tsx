import { useState, useMemo } from "react";
import { Search, Sparkles, Star, X, MapPin, Phone, Clock, MessageSquare, SortAsc, Navigation, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IBarberShop } from "../types/barberShop";
import BarberShopCard from "./BarberShopCard";

interface ShopDiscoveryPageProps {
  shops: IBarberShop[];
  onBookShop: (shopId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
}

const TAGS = ["Tümü", "Saç Kesimi", "Sakal Tasarımı", "Cilt Bakımı", "Premium Hizmet"];

type SortOption = "recommended" | "price_asc" | "price_desc" | "proximity" | "rating";

// ─── Istanbul Districts with approximate coordinates ────────────────
interface District {
  name: string;
  latitude: number;
  longitude: number;
}

const ISTANBUL_DISTRICTS: District[] = [
  { name: "Beşiktaş", latitude: 41.0422, longitude: 29.0082 },
  { name: "Kadıköy", latitude: 40.9901, longitude: 29.0280 },
  { name: "Şişli", latitude: 41.0602, longitude: 28.9877 },
  { name: "Üsküdar", latitude: 41.0264, longitude: 29.0151 },
  { name: "Bakırköy", latitude: 40.9782, longitude: 28.7946 },
  { name: "Ataşehir", latitude: 40.9847, longitude: 29.1064 },
  { name: "Fatih", latitude: 41.0186, longitude: 28.9400 },
  { name: "Beyoğlu", latitude: 41.0335, longitude: 28.9770 },
  { name: "Sarıyer", latitude: 41.1670, longitude: 29.0574 },
  { name: "Maltepe", latitude: 40.9332, longitude: 29.1305 },
];

// ─── Haversine formula for distance in km ─────────────────────────
function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Mock reviews for the detail modal ────────────────────────────
const MOCK_REVIEWS = [
  { name: "Emre K.", rating: 5, text: "Harika bir deneyimdi, kesinlikle tekrar geleceğim!", date: "2 gün önce" },
  { name: "Burak S.", rating: 4, text: "Sakal tasarımı mükemmeldi. Bekleme süresi biraz uzun.", date: "1 hafta önce" },
  { name: "Mert D.", rating: 5, text: "En iyi berbere gidiyorum, çok memnunum. Fiyatlar da makul.", date: "2 hafta önce" },
  { name: "Ali V.", rating: 5, text: "Temiz, hızlı ve profesyonel. Tavsiye ederim!", date: "3 hafta önce" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "⭐ Önerilen" },
  { value: "price_asc",   label: "↑ Fiyat (Düşükten Yükseğe)" },
  { value: "price_desc",  label: "↓ Fiyat (Yüksekten Düşüğe)" },
  { value: "proximity",   label: "📍 Yakınlığa Göre" },
  { value: "rating",      label: "🏆 En Yüksek Puan" },
];

// ─── Shop Details Modal ────────────────────────────────────────────
const ShopDetailModal = ({ shop, distance, onClose, onBook }: {
  shop: IBarberShop;
  distance?: number;
  onClose: () => void;
  onBook: (id: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
      className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#111113]/96 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/60"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#09090b]/80 border border-white/10 flex items-center justify-center text-[#a1a1aa] hover:text-white hover:border-[#c5a880]/30 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="p-6 pb-0">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center shrink-0">
            <span className="text-lg font-extrabold text-[#c5a880]">{shop.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-extrabold text-white tracking-tight truncate">{shop.name}</h2>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} className={s <= Math.round(shop.rating ?? 5) ? "text-[#c5a880] fill-[#c5a880]" : "text-[#2a2a2e]"} />
                ))}
                <span className="text-[10px] font-bold text-[#a1a1aa] ml-1">
                  {shop.rating?.toFixed(1)} ({shop.reviewCount} Yorum)
                </span>
              </div>
              <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                Açık
              </span>
              {distance !== undefined && (
                <span className="text-[8px] bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] px-2 py-0.5 rounded-full font-extrabold">
                  📍 {distance.toFixed(1)} km
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shop.address && (
          <div className="bg-[#09090b]/60 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#c5a880]" />
            </div>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#52525b] mb-1">Konum</p>
              <p className="text-xs font-medium text-[#a1a1aa] leading-relaxed">{shop.address}</p>
            </div>
          </div>
        )}
        {shop.phoneNumber && (
          <div className="bg-[#09090b]/60 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-[#c5a880]" />
            </div>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#52525b] mb-1">Telefon</p>
              <p className="text-xs font-medium text-[#a1a1aa]">{shop.phoneNumber}</p>
            </div>
          </div>
        )}
        {shop.price !== undefined && (
          <div className="bg-[#09090b]/60 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-extrabold text-[#c5a880]">₺</span>
            </div>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#52525b] mb-1">Başlangıç Fiyatı</p>
              <p className="text-sm font-extrabold text-[#c5a880]">{shop.price} ₺</p>
            </div>
          </div>
        )}
        <div className="bg-[#09090b]/60 border border-white/5 rounded-2xl p-4 flex items-start gap-3 sm:col-span-2">
          <div className="w-9 h-9 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-[#c5a880]" />
          </div>
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#52525b] mb-1">Çalışma Saatleri</p>
            <p className="text-xs font-medium text-[#a1a1aa]">Pazartesi - Cumartesi: 09:00 - 20:00 | Pazar: Kapalı</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        <div className="rounded-2xl overflow-hidden border border-white/5">
          <iframe
            title={`${shop.name} Konum Haritası`}
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12037.83!2d29.0!3d41.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2str!4v1700000000000"
            width="100%"
            height="200"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.1)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#c5a880]" />
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Müşteri Yorumları</h3>
        </div>
        <div className="space-y-3">
          {MOCK_REVIEWS.map((review, i) => (
            <div key={i} className="bg-[#09090b]/60 border border-white/5 rounded-2xl p-4 hover:border-[#c5a880]/15 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#c5a880]/15 flex items-center justify-center text-[9px] font-extrabold text-[#c5a880]">
                    {review.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-white">{review.name}</span>
                </div>
                <span className="text-[9px] font-medium text-[#52525b]">{review.date}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={10} className={s <= review.rating ? "text-[#c5a880] fill-[#c5a880]" : "text-[#2a2a2e]"} />
                ))}
              </div>
              <p className="text-xs text-[#a1a1aa] font-medium leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 pt-2">
        <button
          onClick={() => { onBook(shop.id); onClose(); }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] hover:from-[#d5b890] hover:to-[#f8e5c5] text-black font-extrabold text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#c5a880]/15"
        >
          Randevu Al
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Main Page ─────────────────────────────────────────────────────
export default function ShopDiscoveryPage({
  shops,
  onBookShop,
  searchQuery,
  onSearchChange,
  isLoading = false,
}: ShopDiscoveryPageProps) {
  const [activeTag, setActiveTag] = useState("Tümü");
  const [selectedShop, setSelectedShop] = useState<IBarberShop | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<District>(ISTANBUL_DISTRICTS[0]);
  const [districtOpen, setDistrictOpen] = useState(false);

  // Compute distance map for all shops from the selected district
  const distanceMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const shop of shops) {
      if (shop.latitude !== undefined && shop.longitude !== undefined) {
        map[shop.id] = haversineDistance(
          selectedDistrict.latitude, selectedDistrict.longitude,
          shop.latitude, shop.longitude
        );
      }
    }
    return map;
  }, [shops, selectedDistrict]);

  // Filter & sort
  const filteredAndSorted = useMemo(() => {
    let result = shops.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.address ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      if (activeTag === "Tümü") return matchesSearch;
      if (activeTag === "Saç Kesimi") return matchesSearch && ["1","2","4","5","6"].includes(s.id);
      if (activeTag === "Sakal Tasarımı") return matchesSearch && ["1","3","4","5"].includes(s.id);
      if (activeTag === "Cilt Bakımı") return matchesSearch && ["2","3","5","6"].includes(s.id);
      if (activeTag === "Premium Hizmet") return matchesSearch && ["1","2","6"].includes(s.id);
      return matchesSearch;
    });

    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "price_asc":  return (a.price ?? 0) - (b.price ?? 0);
        case "price_desc": return (b.price ?? 0) - (a.price ?? 0);
        case "proximity":  return (distanceMap[a.id] ?? 999) - (distanceMap[b.id] ?? 999);
        case "rating":     return (b.rating ?? 0) - (a.rating ?? 0);
        default:           return 0;
      }
    });

    return result;
  }, [shops, searchQuery, activeTag, sortOption, distanceMap]);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortOption)?.label ?? "Önerilen";

  return (
    <div className="w-full space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Background glow blobs */}
      <div className="absolute top-[15%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#c5a880]/[0.015] blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[#c5a880]/[0.01] blur-[130px] pointer-events-none z-0" />

      {/* Page Header */}
      <div className="space-y-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c5a880] animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c5a880]">Keşfet ve Rezervasyon Yap</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Berber Salonları</h1>
        <p className="text-[#a1a1aa] text-sm font-semibold leading-relaxed">
          Size en yakın premium berber dükkanlarını keşfedin, randevunuzu saniyeler içinde oluşturun.
        </p>
      </div>

      {/* ── Location Selector ── */}
      <div className="relative z-10 bg-gradient-to-r from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-[#c5a880]/15 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center">
            <Navigation className="w-4 h-4 text-[#c5a880]" />
          </div>
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#52525b]">Başlangıç Konumunuz</p>
            <p className="text-[11px] font-bold text-[#a1a1aa] mt-0.5">İstanbul, Türkiye</p>
          </div>
        </div>

        {/* District picker */}
        <div className="relative flex-1 min-w-[200px]">
          <button
            onClick={() => setDistrictOpen(!districtOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-[#09090b]/60 border border-white/8 rounded-xl text-sm font-bold text-white hover:border-[#c5a880]/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
              <span>{selectedDistrict.name}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#52525b] transition-transform duration-200 ${districtOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {districtOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute top-full mt-2 left-0 right-0 z-50 bg-[#111113]/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                {ISTANBUL_DISTRICTS.map((d) => (
                  <button
                    key={d.name}
                    onClick={() => { setSelectedDistrict(d); setDistrictOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-xs font-semibold transition-colors flex items-center gap-2
                      ${selectedDistrict.name === d.name
                        ? "bg-[#c5a880]/15 text-[#c5a880]"
                        : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-white"}`}
                  >
                    <MapPin className="w-3 h-3 shrink-0 opacity-60" />
                    {d.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-[10px] text-[#52525b] font-medium sm:ml-auto shrink-0">
          Mesafeler bu konumdan hesaplanır
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 relative z-10">
        {/* Search Input */}
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b] group-focus-within:text-[#c5a880] transition-colors" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Salon adı veya konum ara..."
            className="w-full bg-[#111113]/90 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-white placeholder-[#52525b] text-xs font-semibold focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] transition-all duration-300 shadow-xl shadow-black/20"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2.5 px-4 py-3.5 bg-[#111113]/90 border border-white/5 rounded-2xl text-xs font-bold text-[#a1a1aa] hover:border-[#c5a880]/30 hover:text-white transition-all shadow-xl shadow-black/20 min-w-[220px] justify-between"
          >
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-[#c5a880]" />
              <span>{activeSortLabel}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#52525b] transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute top-full mt-2 right-0 z-50 bg-[#111113]/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[240px]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortOption(opt.value); setSortOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-xs font-semibold transition-colors
                      ${sortOption === opt.value
                        ? "bg-[#c5a880]/15 text-[#c5a880] font-bold"
                        : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-white"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap items-center gap-2 relative z-10">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`
              px-4 py-2.5 rounded-xl text-[10px] font-extrabold tracking-wide transition-all duration-300 whitespace-nowrap
              ${activeTag === tag
                ? "bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] text-black shadow-md shadow-[#c5a880]/10"
                : "bg-[#111113]/95 border border-white/5 text-[#a1a1aa] hover:text-white hover:border-[#c5a880]/30"}
            `}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results Count */}
      {!isLoading && (
        <p className="text-[10px] font-bold text-[#52525b] relative z-10 tracking-wide uppercase">
          <span className="text-white">{filteredAndSorted.length}</span> SALON BULUNDU
          {activeTag !== "Tümü" && (
            <span> — <span className="text-[#c5a880]">{activeTag}</span> kategorisinde</span>
          )}
          {sortOption === "proximity" && (
            <span className="ml-2 text-[#c5a880]">• {selectedDistrict.name} ilçesinden sıralandı</span>
          )}
        </p>
      )}

      {/* Shop Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#111113]/85 border border-[#2a2a2e]/30 rounded-3xl overflow-hidden animate-pulse">
              <div className="h-48 bg-[#1f1f23]/40" />
              <div className="p-6 space-y-4">
                <div className="h-5 bg-[#1f1f23]/40 rounded-lg w-3/4" />
                <div className="h-3 bg-[#1f1f23]/40 rounded-lg w-1/2" />
                <div className="h-px bg-[#2a2a2e]/20 my-4" />
                <div className="h-10 bg-[#1f1f23]/50 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSorted.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
        >
          {filteredAndSorted.map((shop) => (
            <motion.div key={shop.id} variants={cardVariants} className="h-full">
              <BarberShopCard
                shop={shop}
                distance={distanceMap[shop.id]}
                onBookClick={onBookShop}
                onSelectClick={(s) => setSelectedShop(s)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 space-y-6 bg-[#111113]/30 border border-white/5 rounded-3xl relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#18181b] flex items-center justify-center border border-[#2a2a2e]/50">
            <Search className="w-6 h-6 text-[#52525b]" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white tracking-tight">Dükkan bulunamadı</p>
            <p className="text-[#a1a1aa] text-xs font-semibold mt-2">
              Arama terimini değiştirmeyi deneyin veya filtre kategorisini sıfırlayın.
            </p>
          </div>
        </div>
      )}

      {/* Shop Details Modal */}
      <AnimatePresence>
        {selectedShop && (
          <ShopDetailModal
            shop={selectedShop}
            distance={distanceMap[selectedShop.id]}
            onClose={() => setSelectedShop(null)}
            onBook={onBookShop}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
