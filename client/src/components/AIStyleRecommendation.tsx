import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Sparkles, ChevronRight, Scissors, Star, Check, RefreshCw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
interface FaceType {
  id: string;
  label: string;
  emoji: string;
}

interface HairstyleRec {
  name: string;
  match: number;
  note: string;
  tags: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────
const FACE_TYPES: FaceType[] = [
  { id: "oval", label: "Oval", emoji: "🥚" },
  { id: "round", label: "Yuvarlak", emoji: "🔵" },
  { id: "square", label: "Kare", emoji: "⬛" },
  { id: "heart", label: "Kalp", emoji: "💛" },
  { id: "rectangle", label: "Dikdörtgen", emoji: "📐" },
];

const RECOMMENDATIONS: Record<string, HairstyleRec[]> = {
  oval: [
    { name: "Textured Quiff", match: 97, note: "Oval yüz için en ideal kesim. Üst kısımda hacim ve doku vererek dengeyi korur.", tags: ["Modern", "Günlük", "Şık"] },
    { name: "Side Part Classic", match: 92, note: "Klasik ama asla modası geçmeyen bir stil. Formal görünüm arayanlar için mükemmel.", tags: ["Klasik", "İş", "Elegant"] },
    { name: "Buzz Cut Fade", match: 88, note: "Kısa ve bakımı kolay. Oval yüzün doğal oranlarını ön plana çıkarır.", tags: ["Kısa", "Temiz", "Sportif"] },
    { name: "Uzun Dalgalı", match: 85, note: "Doğal bir hava yaratır. Saç dokusu kalın olan oval yüzler için idealdir.", tags: ["Doğal", "Rahat", "Trend"] },
  ],
  round: [
    { name: "High Fade Pompadour", match: 95, note: "Yuvarlak yüzü uzatma etkisi yapar. Üstteki yükseklik yüze dikey bir boyut katar.", tags: ["Hacimli", "Şık", "Dikkat Çekici"] },
    { name: "Angular Fringe", match: 91, note: "Açılı saç perçemleri yuvarlak yüze keskin çizgiler kazandırır.", tags: ["Asimetrik", "Modern", "Trend"] },
    { name: "Spiky Textured Top", match: 87, note: "Dikleştirilen üst kısım yüzü optik olarak uzatır.", tags: ["Enerjik", "Genç", "Dinamik"] },
  ],
  square: [
    { name: "Crew Cut", match: 96, note: "Kare yüzün güçlü çene hattını vurgular. Erkeksi ve kendinden emin bir görünüm.", tags: ["Maskülen", "Temiz", "Zamansız"] },
    { name: "Slicked Back", match: 93, note: "Geriye taranmış saç, güçlü yüz hatlarıyla uyumlu premium bir görünüm sunar.", tags: ["Premium", "Şık", "Güçlü"] },
    { name: "Short Textured Crop", match: 89, note: "Hafif doku ile sert çizgileri yumuşatır.", tags: ["Dengeli", "Modern", "Bakımlı"] },
  ],
  heart: [
    { name: "Orta Boy Dalgalı", match: 94, note: "Kalp yüzlerde dar çeneyi dengeler, hacmi yanlara dağıtır.", tags: ["Dengeli", "Yumuşak", "Doğal"] },
    { name: "Side Swept Bangs", match: 90, note: "Geniş alını gizler ve yüze orantılı bir görünüm kazandırır.", tags: ["Zarif", "Karizmatik", "Sofistike"] },
    { name: "Medium Length Layers", match: 86, note: "Katmanlı kesim yüz oranlarını dengeler.", tags: ["Katmanlı", "Hacimli", "Trend"] },
  ],
  rectangle: [
    { name: "Messy Fringe", match: 93, note: "Uzun alnı kısmen örterek yüzü daha kısa ve dengeli gösterir.", tags: ["Rahat", "Günlük", "Stil Sahibi"] },
    { name: "Curly Medium", match: 89, note: "Kıvırcık saçlar yanlara hacim vererek uzun yüzü genişletir.", tags: ["Hacimli", "Doğal", "Kıvırcık"] },
    { name: "Textured Bob", match: 85, note: "Kulak hizasına kadar uzanan bir kesim ile oranları dengeye getirir.", tags: ["Cesur", "Farklı", "Yaratıcı"] },
  ],
};

// ─── Reveal Animation Wrapper ─────────────────────────────────────────
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Scanner Line Effect ──────────────────────────────────────────────
const ScannerLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a880] to-transparent z-20 pointer-events-none"
    animate={{ top: ["0%", "100%", "0%"] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    style={{ boxShadow: "0 0 20px rgba(197,168,128,0.5), 0 0 40px rgba(197,168,128,0.2)" }}
  />
);

// ─── Main Component ───────────────────────────────────────────────────
export default function AIStyleRecommendation() {
  const [selectedFace, setSelectedFace] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSelectFace = (id: string) => {
    setSelectedFace(id);
    setShowResults(false);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
    }, 2000);
  };

  const handleReset = () => {
    setSelectedFace(null);
    setIsScanning(false);
    setShowResults(false);
  };

  const results = selectedFace ? RECOMMENDATIONS[selectedFace] ?? [] : [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
      {/* Header */}
      <FadeIn>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] text-[10px] font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Yapay Zeka Destekli</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Yüz Tipine Göre <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#c5a880] to-[#e8d5b5]">Saç Önerisi</span>
          </h1>
          <p className="text-sm text-[#a1a1aa] font-semibold max-w-xl">
            Yüz tipinizi seçin, yapay zeka motorumuz size en uygun saç ve sakal modellerini anında önersin.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Face Scanner Area */}
        <FadeIn delay={0.1} className="lg:col-span-5">
          <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden relative">
            {/* Camera / Upload zone */}
            <div className="relative aspect-square bg-[#0d0d10] flex items-center justify-center overflow-hidden">
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(rgba(197,168,128,1) 1px, transparent 1px), linear-gradient(90deg, rgba(197,168,128,1) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Scanner line */}
              {isScanning && <ScannerLine />}

              {/* Face outline SVG */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <motion.div
                  animate={isScanning ? { scale: [1, 1.03, 1], opacity: [0.5, 0.8, 0.5] } : { scale: 1, opacity: 0.35 }}
                  transition={isScanning ? { duration: 1.5, repeat: Infinity } : {}}
                >
                  <svg width="140" height="180" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Circle grid backdrop */}
                    <circle cx="50" cy="60" r="45" stroke="#c5a880" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.3" />
                    
                    {/* Human Head Silhouette */}
                    {/* Hair outline */}
                    <path d="M25 45 C25 25, 35 15, 50 15 C65 15, 75 25, 75 45 C78 45, 78 55, 75 58 C75 72, 70 95, 50 102 C30 95, 25 72, 25 58 C22 55, 22 45, 25 45 Z" stroke="#c5a880" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M25 45 C32 40, 42 38, 50 42 C58 38, 68 40, 75 45" stroke="#c5a880" strokeWidth="1.8" strokeLinecap="round" /> {/* Hairline */}
                    <path d="M30 28 C42 24, 58 24, 70 28" stroke="#c5a880" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" /> {/* Top hair detail */}
                    
                    {/* Ears */}
                    <path d="M23 55 C21 55, 20 58, 22 62 C23 64, 25 64, 25 61" stroke="#c5a880" strokeWidth="1.5" />
                    <path d="M77 55 C79 55, 80 58, 78 62 C77 64, 75 64, 75 61" stroke="#c5a880" strokeWidth="1.5" />
                    
                    {/* Eyes (closed, eyelashes) */}
                    <path d="M36 60 Q 40 64 44 60" stroke="#c5a880" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M56 60 Q 60 64 64 60" stroke="#c5a880" strokeWidth="1.5" strokeLinecap="round" />
                    
                    {/* Eyebrows */}
                    <path d="M34 54 Q 40 52 45 55" stroke="#c5a880" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M66 54 Q 60 52 55 55" stroke="#c5a880" strokeWidth="1.2" strokeLinecap="round" />
                    
                    {/* Nose */}
                    <path d="M50 59 L50 72 Q50 75 47 75" stroke="#c5a880" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    
                    {/* Lips */}
                    <path d="M42 85 Q 50 89 58 85" stroke="#c5a880" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M46 85 Q 50 83 54 85" stroke="#c5a880" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.div>

                {!isScanning && !showResults && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-[#52525b] font-bold uppercase tracking-widest"
                  >
                    Yüz Tipinizi Seçin
                  </motion.p>
                )}

                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#c5a880] animate-pulse" />
                    <span className="text-xs font-extrabold text-[#c5a880] uppercase tracking-widest">Analiz Ediliyor...</span>
                  </motion.div>
                )}

                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Analiz Tamamlandı</span>
                  </motion.div>
                )}
              </div>

              {/* Corner frame brackets */}
              {["top-4 left-4 border-t border-l", "top-4 right-4 border-t border-r", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-6 h-6 border-[#c5a880]/30 pointer-events-none`} />
              ))}
            </div>

            {/* Action buttons */}
            <div className="p-5 space-y-3">
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#111113] border border-white/5 rounded-xl text-xs font-bold text-[#a1a1aa] hover:border-[#c5a880]/30 hover:text-white transition-all cursor-pointer">
                  <Camera className="w-4 h-4 text-[#c5a880]" />
                  Kamera Aç
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#111113] border border-white/5 rounded-xl text-xs font-bold text-[#a1a1aa] hover:border-[#c5a880]/30 hover:text-white transition-all cursor-pointer">
                  <Upload className="w-4 h-4 text-[#c5a880]" />
                  Fotoğraf Yükle
                </button>
              </div>
              <p className="text-[9px] text-center text-[#3f3f46] font-semibold">
                Fotoğraf yükleme ve kamera özellikleri yakında aktifleşecektir.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Right Column: Face type selectors + Results */}
        <div className="lg:col-span-7 space-y-8">
          {/* Face Type Selector */}
          <FadeIn delay={0.2}>
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#52525b]">Yüz Tipinizi Seçin</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {FACE_TYPES.map((face) => {
                  const isSelected = selectedFace === face.id;
                  return (
                    <motion.button
                      key={face.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectFace(face.id)}
                      className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-[#c5a880]/15 border-[#c5a880] shadow-lg shadow-[#c5a880]/10"
                          : "bg-[#111113]/80 border-white/5 hover:border-[#c5a880]/30"
                      }`}
                    >
                      <span className="text-2xl">{face.emoji}</span>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? "text-[#c5a880]" : "text-[#a1a1aa]"}`}>
                        {face.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          {/* Results */}
          <AnimatePresence mode="wait">
            {showResults && results.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#52525b]">Önerilen Modeller</h2>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-[#a1a1aa] hover:text-[#c5a880] transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Sıfırla
                  </button>
                </div>

                <div className="space-y-4">
                  {results.map((rec, i) => (
                    <motion.div
                      key={rec.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-[#c5a880]/30 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-[#c5a880]/5 group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Scissors className="w-5 h-5 text-[#c5a880]" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">{rec.name}</h3>
                            <div className="flex items-center gap-1 mt-0.5">
                              {Array.from({ length: 5 }).map((_, s) => (
                                <Star key={s} size={10} className={s < Math.round(rec.match / 20) ? "text-[#c5a880] fill-[#c5a880]" : "text-[#2a2a2e] fill-[#2a2a2e]"} />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Match % badge */}
                        <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                          <span className="text-xs font-extrabold text-emerald-400">%{rec.match}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#a1a1aa] font-medium leading-relaxed mb-4">{rec.note}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {rec.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-lg bg-[#09090b] border border-white/5 text-[9px] font-bold text-[#a1a1aa] uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="mt-4 pt-4 border-t border-[#2a2a2e]/30 flex items-center justify-between">
                        <span className="text-[9px] text-[#52525b] font-bold uppercase tracking-wider">Bu stili isteyin</span>
                        <button className="flex items-center gap-1 text-[10px] font-extrabold text-[#c5a880] hover:text-[#e8d5b5] transition-colors cursor-pointer">
                          Berber Bul <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {!showResults && !isScanning && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#111113]/50 border border-dashed border-[#2a2a2e]/50 rounded-3xl py-16 flex flex-col items-center justify-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#c5a880]/5 border border-[#c5a880]/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-[#c5a880]/40" />
                </div>
                <p className="text-xs text-[#52525b] font-bold">Yüz tipinizi seçtikten sonra AI önerileri burada görünecek.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
