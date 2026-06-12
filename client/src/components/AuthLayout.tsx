import React from "react";
import { Scissors, Store } from "lucide-react";
import { motion } from "framer-motion";

// ─── Props ───────────────────────────────────────────────────────────
interface AuthLayoutProps {
  children: React.ReactNode;
  panelTitle?: string;
  panelSubtitle?: string;
}

// ─── Decorative testimonials / pull-quotes for the left panel ────────
const QUOTES = [
  { text: "Her kesim bir sanat eseridir.", author: "Usta Berber" },
  { text: "Tıraş olmak bir ritüeldir, bir deneyimdir.", author: "Modern Erkek" },
];

// ─── Partner Barber Shop Logos ────────
const PARTNER_SHOPS = [
  { name: "Kaya Kuaför", initials: "KK" },
  { name: "Sultan Berber", initials: "SB" },
  { name: "Elite Grooming", initials: "EG" },
  { name: "Usta Berber", initials: "UB" },
  { name: "Royal Salon", initials: "RS" },
  { name: "Prime Cut", initials: "PC" },
];

const FallingScissors = () => {
  const scissors = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 8 + 12}s`,
    animationDelay: `${Math.random() * 8}s`,
    size: Math.random() * 16 + 18,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {scissors.map((s) => (
        <motion.div
          key={s.id}
          className="absolute text-[#c5a880] opacity-25 filter drop-shadow-[0_0_8px_rgba(197,168,128,0.2)]"
          style={{
            left: s.left,
            top: "-10%",
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [s.rotation, s.rotation + 360],
          }}
          transition={{
            duration: parseFloat(s.animationDuration),
            delay: parseFloat(s.animationDelay),
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Scissors size={s.size} className="transform -rotate-45" />
        </motion.div>
      ))}
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────────────
const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  panelTitle = "Zamanın En İyi\nBerberine Kavuş.",
  panelSubtitle = "Premium berber dükkanlarını ve güncel hizmet fiyatlarını incele, dilediğin salona kolayca rezervasyon yap — tamamen ücretsiz bir kolaylaştırıcı köprü.",
}) => {
  return (
    <div className="min-h-screen flex font-sans bg-[#09090b] relative overflow-hidden">
      {/* Background glow blobs */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-[0.05] blur-3xl pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, #c5a880 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.03] blur-3xl pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, #c5a880 0%, transparent 70%)" }}
      />

      {/* ── Left decorative panel (hidden on mobile) ── */}
      <aside className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden z-10 border-r border-[#2a2a2e]/30 bg-[#09090b]/40 backdrop-blur-3xl">
        {/* Falling scissors inside the panel (on top of blur, behind text) */}
        <FallingScissors />

        {/* Content — sits above the decorative layers */}
        <div className="relative z-10">
          {/* Brand mark */}
          <div className="flex items-center gap-3 mb-16 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c5a880] to-[#e8d5b5] flex items-center justify-center shadow-lg shadow-[#c5a880]/20 group-hover:scale-110 transition-transform duration-500">
              <Scissors size={20} className="text-[#09090b] rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <span className="text-white font-extrabold tracking-tight text-xl">
              Barber<span className="text-[#c5a880]">SaaS</span>
            </span>
          </div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-serif text-white leading-tight"
            style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", whiteSpace: "pre-line" }}
          >
            {panelTitle}
          </motion.h1>

          {/* Gold divider */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "3rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 mb-6 h-1 bg-[#c5a880] rounded-full" 
          />

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[#a1a1aa] text-base leading-relaxed max-w-md"
          >
            {panelSubtitle}
          </motion.p>
        </div>

        {/* ── Partner Barber Shops Logo Wall ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 mt-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-4 h-4 text-[#c5a880]" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#52525b]">Beraber Çalıştığımız Berberler</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {PARTNER_SHOPS.map((shop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#111113]/60 border border-white/5 hover:border-[#c5a880]/20 transition-colors group/partner"
              >
                <div className="w-8 h-8 rounded-lg bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center text-[10px] font-extrabold text-[#c5a880] shrink-0 group-hover/partner:bg-[#c5a880]/20 transition-colors">
                  {shop.initials}
                </div>
                <span className="text-[10px] font-bold text-[#a1a1aa] truncate">{shop.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial cards */}
        <div className="relative z-10 space-y-6 mt-8">
          {QUOTES.map((q, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 + i * 0.2 }}
              className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#111113]/40 to-[#0a0a0b]/40 backdrop-blur-md p-6 hover:border-[#c5a880]/30 transition-colors"
            >
              <p className="text-[#e4e4e7] text-sm font-serif italic leading-relaxed">
                &ldquo;{q.text}&rdquo;
              </p>
              <footer className="mt-3 text-[#c5a880] text-xs font-semibold tracking-wide">— {q.author}</footer>
            </motion.blockquote>
          ))}
        </div>
      </aside>

      {/* ── Right form panel ── */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#0a0a0b]/50 backdrop-blur-xl">
        {/* Falling scissors inside the right panel (on top of blur, behind form) */}
        <FallingScissors />

        {/* Mobile brand mark */}
        <div className="absolute top-8 left-8 flex items-center gap-2 lg:hidden z-20">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5a880] to-[#e8d5b5] flex items-center justify-center">
            <Scissors size={18} className="text-[#09090b] rotate-45" />
          </div>
          <span className="text-white font-extrabold text-base tracking-tight">
            Barber<span className="text-[#c5a880]">SaaS</span>
          </span>
        </div>

        {/* The form itself */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-20"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AuthLayout;
