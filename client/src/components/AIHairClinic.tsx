import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Sparkles, Tag, Pill, Star, ShieldCheck, ChevronRight, Leaf, Droplets, FlaskConical, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
interface ChatMessage {
  id: number;
  type: "user" | "ai";
  text: string;
}

interface SolutionCard {
  diagnosis: string;
  ingredients: { name: string; desc: string; icon: React.ReactNode }[];
  products: { name: string; price: string; rating: number }[];
  tips: string[];
}

// ─── Quick Tags ───────────────────────────────────────────────────────
const QUICK_TAGS = [
  { label: "Saç Dökülmesi", emoji: "💇" },
  { label: "Kepek Sorunu", emoji: "❄️" },
  { label: "Aşırı Yağlanma", emoji: "💧" },
  { label: "Kuru & Kırılgan Saçlar", emoji: "🌵" },
  { label: "Saç Uçları Kırıkları", emoji: "✂️" },
  { label: "İnce Telli Saç", emoji: "🧵" },
];

// ─── Mock AI Responses ────────────────────────────────────────────────
const AI_SOLUTIONS: Record<string, SolutionCard> = {
  "Saç Dökülmesi": {
    diagnosis:
      "Saç dökülmesi genellikle genetik faktörler, stres, hormonal değişiklikler veya beslenme eksiklikleri nedeniyle oluşabilir. Erken müdahale ile saç follüküllerinin sağlığı korunabilir ve dökülme yavaşlatılabilir.",
    ingredients: [
      { name: "Biotin (B7 Vitamini)", desc: "Saç keratin yapısını güçlendirir, kök hücrelerini besler.", icon: <Pill className="w-4 h-4" /> },
      { name: "Kafein Kompleksi", desc: "Saç derisinde kan dolaşımını artırarak büyümeyi hızlandırır.", icon: <FlaskConical className="w-4 h-4" /> },
      { name: "Çinko & Demir", desc: "Mineral eksikliğine bağlı dökülmeleri durdurur.", icon: <Leaf className="w-4 h-4" /> },
    ],
    products: [
      { name: "BarberSaaS Pro Saç Serumu", price: "189 ₺", rating: 5 },
      { name: "Keratin Güçlendirici Şampuan", price: "129 ₺", rating: 4 },
      { name: "Biotin Takviyesi (60 Kapsül)", price: "249 ₺", rating: 5 },
    ],
    tips: [
      "Günde en az 2 litre su tüketin.",
      "Saçınızı yıkarken ılık su kullanın, sıcak su kök yapısına zarar verir.",
      "Haftada 2 kez saç derisine masaj yaparak kan dolaşımını artırın.",
    ],
  },
  "Kepek Sorunu": {
    diagnosis:
      "Kepek, saç derisinde aşırı hücre yenilenmesi sonucu ortaya çıkan yaygın bir sorundur. Mantar (Malassezia) aktivitesi, kuru hava veya yanlış ürün kullanımı tetikleyici olabilir.",
    ingredients: [
      { name: "Çinko Pirition", desc: "Antifungal etki ile kepek mantarını kontrol altına alır.", icon: <FlaskConical className="w-4 h-4" /> },
      { name: "Salisilik Asit", desc: "Ölü deri hücrelerini nazikçe soyarak kepeklenmeyi azaltır.", icon: <Droplets className="w-4 h-4" /> },
      { name: "Çay Ağacı Yağı", desc: "Doğal antiseptik ve anti-enflamatuar özelliklere sahiptir.", icon: <Leaf className="w-4 h-4" /> },
    ],
    products: [
      { name: "Anti-Kepek Premium Şampuan", price: "149 ₺", rating: 5 },
      { name: "Saç Derisi Dengeleyici Tonik", price: "119 ₺", rating: 4 },
      { name: "Çay Ağacı Yağı (Saf)", price: "79 ₺", rating: 4 },
    ],
    tips: [
      "Saçınızı her gün yıkamaktan kaçının; haftada 3-4 kez yeterlidir.",
      "Şampuanı doğrudan saç derisine uygulayıp 2-3 dakika bekletin.",
      "Sıcak saç kurutma makinesinden kaçının.",
    ],
  },
  default: {
    diagnosis:
      "Saç ve saç derisi sağlığı birçok faktörden etkilenir: beslenme, stres düzeyi, kullanılan ürünler ve çevresel koşullar. Doğru bakım rutini ve profesyonel rehberlik ile sorunların büyük çoğunluğu çözülebilir.",
    ingredients: [
      { name: "Argan Yağı", desc: "Doğal nem ve parlama verir, kırıkları önler.", icon: <Droplets className="w-4 h-4" /> },
      { name: "Keratin Proteini", desc: "Saç telinin yapısal bütünlüğünü onarır ve güçlendirir.", icon: <FlaskConical className="w-4 h-4" /> },
      { name: "E Vitamini", desc: "Antioksidan etkisiyle saç derisini korur.", icon: <Leaf className="w-4 h-4" /> },
    ],
    products: [
      { name: "Onarıcı Saç Maskesi", price: "159 ₺", rating: 5 },
      { name: "Besleyici Saç Yağı", price: "99 ₺", rating: 4 },
      { name: "Multivitamin Saç Spreyi", price: "139 ₺", rating: 4 },
    ],
    tips: [
      "Dengeli beslenmeye özen gösterin; protein, demir ve çinko alımınızı artırın.",
      "Saçınızı yıkadıktan sonra doğal yollarla kurumasını bekleyin.",
      "Düzenli saç kesimi saç sağlığını korur.",
    ],
  },
};

// ─── Main Component ───────────────────────────────────────────────────
export default function AIHairClinic() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentSolution, setCurrentSolution] = useState<SolutionCard | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: Date.now(), type: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const solution = AI_SOLUTIONS[text.trim()] ?? AI_SOLUTIONS["default"];
      setCurrentSolution(solution);

      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        type: "ai",
        text: solution.diagnosis,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleTagClick = (label: string) => {
    handleSubmit(label);
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentSolution(null);
    setInputValue("");
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Saç Kliniği</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Saç Sorunlarınıza <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">Akıllı Çözümler</span>
          </h1>
          <p className="text-sm text-[#a1a1aa] font-semibold max-w-xl">
            Saç ve saç derisi sorunlarınızı yazın, yapay zeka destekli klinik motorumuz size kişiselleştirilmiş bakım önerileri sunsun.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Chat Interface */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Tags */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-[10px] text-[#52525b] font-extrabold uppercase tracking-wider mb-3">Hızlı Seçim</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => handleTagClick(tag.label)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111113] border border-white/5 text-[10px] font-bold text-[#a1a1aa] hover:border-emerald-500/30 hover:text-emerald-400 transition-all cursor-pointer"
                >
                  <span>{tag.emoji}</span>
                  <span>{tag.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden flex flex-col"
            style={{ minHeight: "400px" }}
          >
            {/* Chat header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2e]/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">AI Saç Danışmanı</p>
                  <p className="text-[9px] text-emerald-400 font-bold">Çevrimiçi</p>
                </div>
              </div>
              {messages.length > 0 && (
                <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer">
                  <X className="w-3.5 h-3.5 text-[#52525b] hover:text-red-400" />
                </button>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-5 space-y-4 overflow-y-auto custom-scrollbar min-h-[250px] max-h-[350px]">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-emerald-400/40" />
                  </div>
                  <p className="text-xs text-[#52525b] font-bold">Saç sorununuzu yazın veya yukarıdaki etiketlerden seçin.</p>
                </div>
              )}

              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed ${
                        msg.type === "user"
                          ? "bg-[#c5a880]/15 border border-[#c5a880]/20 text-white rounded-br-md"
                          : "bg-[#111113] border border-emerald-500/10 text-[#a1a1aa] rounded-bl-md"
                      }`}
                    >
                      {msg.type === "ai" && (
                        <div className="flex items-center gap-1 mb-1.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span className="text-[8px] font-extrabold text-emerald-400 uppercase tracking-wider">AI Analiz</span>
                        </div>
                      )}
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#111113] border border-emerald-500/10 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400/60"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="px-5 py-4 border-t border-[#2a2a2e]/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(inputValue)}
                  placeholder="Saç sorununuzu yazın..."
                  className="flex-1 px-4 py-3 bg-[#09090b] border border-white/5 rounded-xl text-xs text-white placeholder-[#3f3f46] focus:border-emerald-500/30 focus:outline-none transition-colors"
                />
                <button
                  onClick={() => handleSubmit(inputValue)}
                  disabled={!inputValue.trim()}
                  className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Solution Card */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {currentSolution ? (
              <motion.div
                key="solution"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Active Ingredients */}
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#52525b] flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    Önerilen Aktif Bileşenler
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {currentSolution.ingredients.map((ing, i) => (
                      <motion.div
                        key={ing.name}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-all duration-300 hover:translate-y-[-2px] group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                          {ing.icon}
                        </div>
                        <h4 className="text-xs font-bold text-white mb-1">{ing.name}</h4>
                        <p className="text-[10px] text-[#a1a1aa] font-medium leading-relaxed">{ing.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recommended Products */}
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#52525b]">Önerilen Bakım Ürünleri</h3>
                  <div className="space-y-3">
                    {currentSolution.products.map((prod, i) => (
                      <motion.div
                        key={prod.name}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="bg-[#111113]/80 border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-[#c5a880]/20 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <FlaskConical className="w-5 h-5 text-[#c5a880]" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{prod.name}</p>
                            <div className="flex items-center gap-0.5 mt-1">
                              {Array.from({ length: 5 }).map((_, s) => (
                                <Star key={s} size={9} className={s < prod.rating ? "text-[#c5a880] fill-[#c5a880]" : "text-[#2a2a2e] fill-[#2a2a2e]"} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-[#c5a880]">{prod.price}</span>
                          <button className="flex items-center gap-1 text-[9px] font-bold text-[#a1a1aa] hover:text-[#c5a880] transition-colors cursor-pointer">
                            İncele <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-r from-emerald-500/5 to-[#111113]/80 border border-emerald-500/10 rounded-3xl p-6 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Uzman Tavsiyeleri
                  </h3>
                  <ul className="space-y-2">
                    {currentSolution.tips.map((tip, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        className="flex items-start gap-2 text-xs text-[#a1a1aa] font-medium leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        {tip}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#111113]/50 border border-dashed border-[#2a2a2e]/50 rounded-3xl py-20 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-4">
                  <MessageCircle className="w-7 h-7 text-emerald-400/30" />
                </div>
                <p className="text-sm font-bold text-[#3f3f46]">Henüz bir analiz yapılmadı.</p>
                <p className="text-[10px] text-[#2a2a2e] font-semibold mt-1">Saç sorununuzu yazarak AI klinik analizi başlatın.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
