import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Loader2, Store } from "lucide-react";
import BarberShopCard from "./BarberShopCard";
import { IBarberShop } from "../types/barberShop";
import { getBarberShops } from "../services/api";

// ─── Component ────────────────────────────────────────────────────────
const BarberShopList: React.FC = () => {
  const navigate = useNavigate();
  const [shops, setShops]     = useState<IBarberShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [query, setQuery]     = useState("");

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setIsLoading(true);
        const res = await getBarberShops();
        setShops(res.data);
      } catch {
        setError("Dükkanlar yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShops();
  }, []);

  const filtered = shops.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    (s.address ?? "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090b] px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Page header ── */}
      <div className="mb-8 animate-fade-in">
        <p className="text-[#c5a880] text-xs tracking-[0.2em] uppercase font-medium mb-1">Keşfet</p>
        <h1 className="font-serif text-[#f4f4f5] text-3xl font-semibold">Berber Dükkanları</h1>
        <p className="text-[#52525b] text-sm mt-1">
          {shops.length} dükkan listeleniyor
        </p>
      </div>

      {/* ── Search + filter bar ── */}
      <div className="mb-8 flex items-center gap-3 animate-fade-in" style={{ animationDelay: "0.05s" }}>
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525b] pointer-events-none" />
          <input
            id="shop-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Dükkan adı veya adres ara..."
            className="
              w-full bg-[#111113] border border-[#2a2a2e] rounded-xl
              pl-10 pr-4 py-2.5 text-sm text-[#f4f4f5] placeholder:text-[#3f3f46]
              focus:outline-none focus:border-[#c5a880]/50 focus:bg-[#13120e]
              transition-all duration-200
            "
          />
        </div>
        <button
          id="shop-filter"
          className="
            flex items-center gap-2 rounded-xl border border-[#2a2a2e] bg-[#111113]
            px-4 py-2.5 text-sm text-[#a1a1aa]
            hover:border-[#c5a880]/40 hover:text-[#c5a880]
            transition-all duration-200
          "
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filtrele</span>
        </button>
      </div>

      {/* ── States ── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 size={28} className="text-[#c5a880] animate-spin" />
          <p className="text-[#52525b] text-sm">Dükkanlar yükleniyor…</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Store size={36} className="text-[#2a2a2e]" />
          <p className="text-[#52525b] text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Search size={32} className="text-[#2a2a2e]" />
          <p className="text-[#f4f4f5] text-sm font-medium">Sonuç bulunamadı</p>
          <p className="text-[#52525b] text-xs">Farklı bir arama terimi deneyin.</p>
        </div>
      )}

      {/* ── Grid ── */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((shop, i) => (
            <div
              key={shop.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <BarberShopCard
                shop={shop}
                rating={4.5}
                reviewCount={Math.floor(Math.random() * 200 + 20)}
                onBookClick={(shopId) => navigate(`/book/${shopId}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BarberShopList;
