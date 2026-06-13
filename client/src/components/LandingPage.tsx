import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Scissors, CalendarCheck, TrendingUp, Star, Sparkles, ShieldCheck, Smartphone, Users, ChevronDown, ChevronRight, Check, Zap, HelpCircle, Clock, UserCheck, MousePointerClick, HeartPulse, MessageSquare } from "lucide-react";

// ─── Golden Confetti Particle Explosion for Demo Booking ───
const ConfettiSparkles = () => {
  const particles = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    angle: (i * 360) / 18 + Math.random() * 20,
    distance: Math.random() * 70 + 60,
    size: Math.random() * 5 + 3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const targetX = Math.cos(rad) * p.distance;
        const targetY = Math.sin(rad) * p.distance;

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-r from-[#c5a880] to-[#e8d5b5]"
            style={{ width: p.size, height: p.size }}
            initial={{ opacity: 1, scale: 0.1, x: 0, y: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0.1, 1.4, 0],
              x: targetX,
              y: targetY,
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Animated Section Wrapper with InView ───
const RevealSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── FAQ Accordion Item Component ───
function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#111113]/80 border border-white/5 rounded-2xl overflow-hidden transition-colors hover:border-[#c5a880]/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
      >
        <span className="font-bold text-sm text-white pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-[#c5a880] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[200px] opacity-100 border-t border-[#2a2a2e]/30" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 text-xs text-[#a1a1aa] leading-relaxed">
          {a}
        </div>
      </div>
    </div>
  );
}

// ─── Splitting Splash Screen Component ───
const SplittingSplash = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"cutting" | "splitting" | "done">("cutting");

  useEffect(() => {
    const cutTimer = setTimeout(() => setPhase("splitting"), 1200);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(cutTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Left wing */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-[#09090b] flex items-center justify-end pr-4 z-[9999]"
        animate={phase === "splitting" ? { x: "-100%" } : { x: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.span
          className="font-serif text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] tracking-wider"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Barber
        </motion.span>
      </motion.div>

      {/* Right wing */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-[#09090b] flex items-center justify-start pl-4 z-[9999]"
        animate={phase === "splitting" ? { x: "100%" } : { x: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.span
          className="font-serif text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e8d5b5] to-[#c5a880] tracking-wider"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          SaaS
        </motion.span>
      </motion.div>

      {/* Center cut line with scissors */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] bg-gradient-to-b from-transparent via-[#c5a880] to-transparent z-[10000] flex items-end justify-center"
        initial={{ height: "0%" }}
        animate={phase === "cutting" ? { height: "100%" } : { opacity: 0 }}
        transition={phase === "cutting" ? { duration: 1.1, ease: "easeInOut" } : { duration: 0.3 }}
      >
        <motion.div
          className="absolute bottom-0"
          initial={{ bottom: "0%" }}
          animate={{ bottom: phase === "cutting" ? "100%" : "100%" }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          <Scissors className="w-8 h-8 text-[#c5a880] rotate-90 drop-shadow-[0_0_15px_rgba(197,168,128,0.6)]" />
        </motion.div>
      </motion.div>
    </div>
  );
};

// ─── Marquee Testimonials Data ───
const TESTIMONIALS = [
  { name: "Emre K.", text: "Artık berbere gitmek çok daha kolay! 3 saniyede randevu alıyorum.", rating: 5 },
  { name: "Burak S.", text: "En iyi berber uygulaması. Arayüzü müthiş güzel ve kullanışlı.", rating: 5 },
  { name: "Ahmet Y.", text: "Berberlerin takvimini görmek harika bir özellik.", rating: 4 },
  { name: "Mert D.", text: "Fiyat ve saat karşılaştırma yapmak artık çok kolay.", rating: 5 },
  { name: "Kerem A.", text: "Hızlı, güvenilir ve göz alıcı bir platform.", rating: 5 },
  { name: "Ozan T.", text: "Bu uygulamayı keşfetmem hayatımı kolaylaştırdı.", rating: 4 },
  { name: "Serkan B.", text: "Sakal tasarımı için en iyi berberleri bulmak artık çok kolay.", rating: 5 },
  { name: "Ali V.", text: "Mobil uyumlu olması büyük artı. Her yerden erişebiliyorum.", rating: 5 },
];

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  
  // Interactive Phone Simulator State
  const [demoBarber, setDemoBarber] = useState("e1");
  const [demoTime, setDemoTime] = useState<string | null>(null);
  const [demoSuccess, setDemoSuccess] = useState(false);

  // B2B Demo Price State
  const [b2bPrice, setB2bPrice] = useState(250);
  
  // B2B Form State
  const [b2bForm, setB2bForm] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    employees: "1-5",
  });
  const [b2bFormErrors, setB2bFormErrors] = useState<Record<string, string>>({});
  const [b2bFormSubmitted, setB2bFormSubmitted] = useState(false);

  const handleB2bSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!b2bForm.shopName) errors.shopName = "Salon adı zorunludur";
    if (!b2bForm.ownerName) errors.ownerName = "İsim zorunludur";
    if (!b2bForm.phone) errors.phone = "Telefon numarası zorunludur";
    
    if (Object.keys(errors).length > 0) {
      setB2bFormErrors(errors);
      return;
    }
    setB2bFormErrors({});
    setB2bFormSubmitted(true);
  };

  // Splash & Scroll States
  const [showSplash, setShowSplash] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(scrollTop / docHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resetDemo = () => {
    setDemoTime(null);
    setDemoSuccess(false);
  };

  const handleBookDemo = () => {
    if (demoTime) {
      setDemoSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-[#c5a880]/30 font-sans relative">
      {/* ─── Splitting Splash Intro ─── */}
      {showSplash && <SplittingSplash onComplete={() => setShowSplash(false)} />}

      {/* ─── Horizontal Scissor Progress Bar (Bottom of Viewport) ─── */}
      <div className="fixed bottom-0 left-0 right-0 h-8 z-50 pointer-events-none select-none">
        {/* Gold ribbon track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-[#2a2a2e]/40" />
        {/* Cut ribbon (left part, already cut) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-[3px] bg-gradient-to-r from-[#b38f53] via-[#e5c185] to-[#c5a880]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
        {/* Scissors icon at the cut point */}
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `calc(${scrollProgress * 100}% - 10px)` }}
        >
          <Scissors className="w-5 h-5 text-[#c5a880] animate-glow-pulse" />
        </div>
      </div>

      {/* Background glow meshes */}
      <div className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] rounded-full bg-[#c5a880]/[0.015] blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[#c5a880]/[0.01] blur-[150px] pointer-events-none z-0" />

      {/* Floating Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-[#2a2a2e]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c5a880]/15 border border-[#c5a880]/20 flex items-center justify-center shadow-md">
              <Scissors className="w-4.5 h-4.5 text-[#c5a880] transform -rotate-45" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">
              Barber<span className="text-[#c5a880]">SaaS</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-xs font-bold text-[#a1a1aa] hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
            >
              Giriş Yap
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] hover:from-[#d5b890] hover:to-[#f8e5c5] text-black text-xs font-extrabold transition-all duration-300 shadow-lg shadow-[#c5a880]/15 hover:scale-[1.02] cursor-pointer"
            >
              Hemen Başla
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section (Split layout) ─── */}
      <header className="pt-36 pb-20 sm:pt-44 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Hero text panel */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] text-[10px] font-extrabold uppercase tracking-widest"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grooming Teknolojisinin Zirvesi</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.4 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
            >
              <span className="font-serif italic">Randevu</span> Yönetiminin <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a880] to-[#e8d5b5]">
                En Premium
              </span>{" "}
              <span className="font-serif">Hali</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.7 }}
              className="text-sm sm:text-base text-[#a1a1aa] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Salonunuzu modernize edin. Müşterilerinize pürüzsüz bir rezervasyon akışı sunarken, tüm berber ve kazanç tablolarınızı <span className="font-serif italic text-white/80">Apple kalitesinde</span> bir arayüzle izleyin.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.9 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] hover:from-[#d5b890] hover:to-[#f8e5c5] text-black text-xs font-extrabold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-xl shadow-[#c5a880]/10"
              >
                Hemen Ücretsiz Başla <Scissors className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#111113] border border-white/5 text-white hover:bg-[#18181b] hover:border-[#c5a880]/30 text-xs font-bold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-1"
              >
                Özellikleri Keşfet
              </a>
            </motion.div>
          </div>

          {/* Hero Right: Interactive iPhone Mockup — pushed down */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 3.1 }}
            className="lg:col-span-5 flex justify-center mt-8 lg:mt-12"
          >
            <div className="relative w-[310px] h-[610px] select-none">
              
              {/* 1. Outer Metallic Titanium Chassis */}
              <div className="absolute inset-0 rounded-[52px] bg-gradient-to-b from-[#e8d5b5] via-[#c5a880] to-[#9a7a54] p-[3.5px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
                
                {/* 2. Inner Shiny Bezel Ring */}
                <div className="w-full h-full bg-[#09090b] rounded-[49px] p-[10px] relative">
                  
                  {/* Glass Sheen overlay */}
                  <div className="absolute inset-2 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.08] pointer-events-none z-30 rounded-[40px]" />
                  
                  {/* Home Indicator Bar */}
                  <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/35 rounded-full z-30 pointer-events-none" />

                  {/* Inside Screen Content Container */}
                  <div className="w-full h-full bg-[#09090b] rounded-[40px] overflow-hidden relative border border-white/5 flex flex-col justify-between pt-12 pb-5 px-5">
                    
                    {/* iOS Status Bar */}
                    <div className="absolute top-3.5 inset-x-5 flex justify-between items-center pointer-events-none text-white text-[9px] font-extrabold z-30 select-none">
                      {/* Left: Time */}
                      <span>19:24</span>
                      
                      {/* Right: Cellular, Wifi, Battery */}
                      <div className="flex items-center gap-1">
                        {/* Cellular Signal Icon */}
                        <svg className="w-3.5 h-3.5 text-white/90" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M2 22h20V2z" />
                        </svg>
                        {/* Wifi Icon */}
                        <svg className="w-3.5 h-3.5 text-white/90" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21l-12-12c5-5 19-5 24 0z" />
                        </svg>
                        {/* Battery Container */}
                        <div className="w-5 h-2.5 border border-white/40 rounded-sm p-[1px] flex items-center relative">
                          <div className="h-full bg-emerald-400 rounded-2xs" style={{ width: "85%" }} />
                          <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1px] h-1 bg-white/40 rounded-r-3xs" />
                        </div>
                      </div>
                    </div>

                    {/* Simulated App Header */}
                    <div className="flex items-center justify-between mb-3 border-b border-[#2a2a2e]/30 pb-3">
                      <div className="flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-[#c5a880] rotate-45" />
                        <span className="text-[10px] font-extrabold text-white">BarberKaya</span>
                      </div>
                      <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide">MÜSAİT</span>
                    </div>

                    <AnimatePresence mode="wait">
                      {!demoSuccess ? (
                        <motion.div
                          key="demo-form"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex-1 flex flex-col justify-between space-y-4"
                        >
                          {/* Barber Selection */}
                          <div className="space-y-2">
                            <p className="text-[9px] font-extrabold text-[#52525b] uppercase tracking-wider">Uzman Seçin</p>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: "e1", name: "Mehmet Usta", initial: "MY" },
                                { id: "e2", name: "Burak Usta", initial: "BD" },
                              ].map((b) => (
                                <button
                                  key={b.id}
                                  onClick={() => setDemoBarber(b.id)}
                                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                    demoBarber === b.id
                                      ? "bg-[#c5a880]/15 border-[#c5a880] text-white"
                                      : "bg-[#111113] border-white/5 text-[#52525b] hover:text-white"
                                  }`}
                                >
                                  <div className="w-6 h-6 rounded-full bg-[#2a2a2e] flex items-center justify-center text-[8px] font-bold text-white mb-1">
                                    {b.initial}
                                  </div>
                                  <p className="text-[10px] font-bold truncate">{b.name}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Time Slots */}
                          <div className="space-y-2">
                            <p className="text-[9px] font-extrabold text-[#52525b] uppercase tracking-wider">Saat Seçin</p>
                            <div className="grid grid-cols-3 gap-1.5">
                              {["09:00", "10:20", "11:40", "14:20", "15:00", "16:20"].map((t) => {
                                const isSelected = demoTime === t;
                                return (
                                  <button
                                    key={t}
                                    onClick={() => setDemoTime(t)}
                                    className={`py-2 rounded-lg border text-[9px] font-bold transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-[#c5a880] border-transparent text-black"
                                        : "bg-[#111113] border-white/5 text-[#a1a1aa]"
                                    }`}
                                  >
                                    {t}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Simulator CTA Button */}
                          <button
                            onClick={handleBookDemo}
                            disabled={!demoTime}
                            className="w-full py-3.5 bg-[#c5a880] disabled:bg-[#1f1f23] disabled:text-[#52525b] text-black font-extrabold text-[10px] rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#c5a880]/10 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            Randevu Al <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="demo-success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex-1 flex flex-col justify-between items-center text-center py-4 relative"
                        >
                          {/* Exploding Sparkles Confetti */}
                          <ConfettiSparkles />

                          <Check className="w-10 h-10 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full p-2 mb-2 animate-bounce" />
                          <h4 className="text-xs font-bold text-white">Simülasyon Başarılı!</h4>
                          <p className="text-[9px] text-[#a1a1aa] max-w-[150px] mt-1">Saniyeler içinde rezervasyon yapmanın hazzını yaşayın.</p>
                          
                          {/* Ticket Mock Stub */}
                          <div className="w-full bg-[#111113] rounded-xl p-3 border border-white/5 text-left text-[9px] space-y-1.5 my-3 relative">
                            <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#09090b] border-r border-white/5" />
                            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#09090b] border-l border-white/5" />
                            <p className="text-[#52525b] font-bold uppercase tracking-wider text-[7px]">ONAY BELGESİ</p>
                            <p className="text-white font-bold">BarberKaya</p>
                            <div className="flex justify-between font-medium text-[#a1a1aa]">
                              <span>Saat: {demoTime}</span>
                              <span>Fiyat: 150 ₺</span>
                            </div>
                          </div>

                          <button
                            onClick={resetDemo}
                            className="w-full py-2.5 bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] text-black font-extrabold text-[9px] rounded-lg cursor-pointer"
                          >
                            Tekrar Dene
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>
              </div>

              {/* 3. Physical External Chassis Buttons */}
              {/* Left side: Action Button, Volume buttons */}
              <div className="absolute top-[80px] -left-[2px] w-[3px] h-[15px] bg-[#c5a880] rounded-l-xs shadow-md" />
              <div className="absolute top-[110px] -left-[2px] w-[3px] h-[30px] bg-[#c5a880] rounded-l-xs shadow-md" />
              <div className="absolute top-[150px] -left-[2px] w-[3px] h-[30px] bg-[#c5a880] rounded-l-xs shadow-md" />
              {/* Right side: Power Button */}
              <div className="absolute top-[125px] -right-[2px] w-[3px] h-[45px] bg-[#c5a880] rounded-r-xs shadow-md" />

              {/* 4. Interactive Dynamic Island */}
              <motion.div
                animate={demoSuccess ? { width: "190px", height: "34px", borderRadius: "17px" } : { width: "95px", height: "24px", borderRadius: "12px" }}
                className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-black z-40 flex items-center justify-between px-3 overflow-hidden border border-white/5 shadow-lg shadow-black/80"
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
              >
                {demoSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 text-[8px] text-white font-extrabold w-full justify-between"
                  >
                    <div className="flex items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                      <span>Randevu Alındı!</span>
                    </div>
                    <span className="text-[7px] text-[#c5a880] uppercase tracking-wider">Kaya Kuaför</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    {/* Camera sensor ring */}
                    <div className="w-2 h-2 rounded-full bg-[#0d0d0f] border border-white/5 relative flex items-center justify-center shrink-0">
                      <div className="w-1 h-1 rounded-full bg-[#18181c]" />
                    </div>
                    {/* Proximity / status LED indicator */}
                    <div className="w-1 h-1 rounded-full bg-emerald-500/60" />
                  </div>
                )}
              </motion.div>

            </div>
          </motion.div>
        </div>
      </header>

      {/* ─── "Nasıl Çalışır" (How It Works) Section ─── */}
      <section className="py-24 border-t border-[#2a2a2e]/30 bg-[#0a0a0c]/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <RevealSection className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#c5a880]">Nasıl Çalışır?</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              <span className="font-serif italic">Üç Adımda</span> Randevunuz Hazır
            </p>
            <p className="text-xs text-[#a1a1aa] font-semibold leading-relaxed">Kayıt olun, berberinizi seçin, randevunuzu alın. Bu kadar basit.</p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: UserCheck,
                title: "Ücretsiz Kayıt Olun",
                desc: "E-posta adresinizle saniyeler içinde hesap oluşturun. Kredi kartı gerekmez.",
              },
              {
                step: 2,
                icon: MousePointerClick,
                title: "Berber & Saat Seçin",
                desc: "Yakınızdaki premium dükkanları keşfedin, uygun saati seçin ve hemen onaylayın.",
              },
              {
                step: 3,
                icon: CalendarCheck,
                title: "Randevunuz Hazır!",
                desc: "Otomatik hatırlatma ile randevunuza zamanında gidin. Memnun kalmadıysanız iptal edin.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <RevealSection key={i} delay={i * 0.15}>
                  <div className="relative bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 border border-white/5 rounded-3xl p-8 text-center hover:border-[#c5a880]/30 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_0_30px_rgba(197,168,128,0.12)] group">
                    {/* Step number */}
                    <div className="absolute top-4 left-4 text-[10px] font-extrabold text-[#c5a880]/40 uppercase tracking-wider">
                      Adım {item.step}
                    </div>
                    
                    {/* Connector line (hidden on mobile, hidden on last) */}
                    {i < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[1px] bg-gradient-to-r from-[#c5a880]/30 to-transparent" />
                    )}
                    
                    <div className="w-16 h-16 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-[#c5a880]" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Features Showcase Section ─── */}
      <section id="features" className="py-24 border-t border-[#2a2a2e]/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <RevealSection className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#c5a880]">Eksiksiz Özellik Seti</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Salon <span className="font-serif italic">Yönetimini</span> Otomatize Edin
            </p>
            <p className="text-xs text-[#a1a1aa] font-semibold leading-relaxed">Artık kağıt takvimler, kaybolan müşteri telefonları yok. İhtiyacınız olan her şey tek bir platformda.</p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CalendarCheck,
                title: "Akıllı Randevu Takvimi",
                desc: "Çift tıklama ile randevu alın, otomatik çakışma korumasıyla takviminizi hatasız düzenleyin.",
                tag: "Popüler",
              },
              {
                icon: TrendingUp,
                title: "Gelişmiş Gelir Analizi",
                desc: "Hangi berberin ne kadar ciro yaptığını, dükkanın aylık kar-zarar tablosunu grafiklerle görün.",
                tag: "Analiz",
              },
              {
                icon: Star,
                title: "Müşteri Değerlendirmeleri",
                desc: "Tıraş sonrası müşterilerden otomatik puan ve yorum alın, hizmet kalitenizi sürekli izleyin.",
                tag: "Geribildirim",
              },
              {
                icon: Smartphone,
                title: "%100 Mobil Uyumlu",
                desc: "Telefon, tablet veya bilgisayar üzerinden dilediğiniz zaman sisteme bağlanıp yönetin.",
                tag: "Heryerde",
              },
              {
                icon: Users,
                title: "Berber Yetkilendirme",
                desc: "Her çalışana kendi randevu çizelgesini görebileceği kısıtlı panel erişimleri atayın.",
                tag: "Yönetim",
              },
              {
                icon: Zap,
                title: "Hızlı Rezervasyon",
                desc: "Müşterileriniz üyelik oluşturup 3 saniyede müsait berberlerden randevu alsın.",
                tag: "Hızlı",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <RevealSection key={i} delay={i * 0.08}>
                  <div
                    className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 border border-white/5 rounded-3xl p-8 hover:border-[#c5a880]/30 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(197,168,128,0.12)] relative overflow-hidden group shadow-xl h-full"
                  >
                    <div className="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-[#c5a880]/15 text-[#c5a880] text-[8px] font-bold uppercase tracking-wider">
                      {f.tag}
                    </div>
                    
                    <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-[#c5a880]" />
                    </div>
                    
                    <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed font-semibold">{f.desc}</p>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── B2B Owner Panel Showcase & Demo ─── */}
      <section className="py-24 border-t border-[#2a2a2e]/30 bg-[#0a0a0c]/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <RevealSection className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#c5a880]">DÜKKAN SAHİPLERİ İÇİN (B2B)</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Salonunuzu <span className="font-serif italic">Yapay Zeka & Akıllı Takvim</span> ile Yönetin
            </p>
            <p className="text-xs text-[#a1a1aa] font-semibold leading-relaxed">
              Biz dilediğiniz berber salonunu keşfedip ücretsiz randevu oluşturabileceğiniz kolaylaştırıcı bir köprüyüz. Dükkan sahipleri ise bu köprü üzerinde kendi fiyatlarını, berberlerini ve gelirlerini kolayca yönetebilir.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Interactive Demo Panel: 7 Cols */}
            <div className="lg:col-span-7 bg-[#111113]/90 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-8 hover:border-[#c5a880]/20 transition-all duration-300 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
                <TrendingUp className="w-64 h-64 text-[#c5a880]" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2a2e]/30 pb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">İnteraktif Berber Paneli Demosu</h3>
                  <p className="text-[10px] text-[#a1a1aa] font-semibold mt-1">Fiyat değiştiğinde tahmini aylık gelirinizin nasıl ölçeklendiğini görün.</p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] font-extrabold text-sm flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                  <TrendingUp className="w-4 h-4" />
                  Tahmini Ciro
                </div>
              </div>

              {/* Stats & Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Sliders */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#a1a1aa]">Ortalama Tıraş Ücreti</span>
                      <span className="text-[#c5a880]">{b2bPrice} ₺</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="600"
                      step="10"
                      value={b2bPrice}
                      onChange={(e) => setB2bPrice(Number(e.target.value))}
                      className="w-full accent-[#c5a880] h-1.5 bg-[#1f1f23] rounded-lg cursor-pointer appearance-none"
                    />
                    <div className="flex justify-between text-[8px] text-[#52525b] font-bold">
                      <span>100 ₺</span>
                      <span>350 ₺</span>
                      <span>600 ₺</span>
                    </div>
                  </div>

                  <div className="bg-[#09090b]/80 border border-white/5 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-[#a1a1aa]">Aylık Randevu Sayısı</span>
                      <span className="text-white">124 Randevu</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold border-t border-[#2a2a2e]/20 pt-2">
                      <span className="text-[#a1a1aa]">Hesaplanan Gelir</span>
                      <span className="text-[#c5a880] text-sm font-extrabold">{(b2bPrice * 124).toLocaleString("tr-TR")} ₺</span>
                    </div>
                  </div>
                </div>

                {/* Animated Chart */}
                <div className="bg-[#09090b]/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-[180px]">
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#52525b] mb-2">Aylık Kazanç Grafiği</p>
                  
                  {/* Bars */}
                  <div className="flex items-end justify-between h-full gap-2 px-2 pb-1 pt-4">
                    {[
                      { month: "Oca", appts: 90 },
                      { month: "Şub", appts: 95 },
                      { month: "Mar", appts: 110 },
                      { month: "Nis", appts: 105 },
                      { month: "May", appts: 120 },
                      { month: "Haz", appts: 124 },
                    ].map((data, idx) => {
                      const calculatedRevenue = data.appts * b2bPrice;
                      const maxPossible = 124 * 600;
                      const heightPercent = Math.max(10, Math.min(100, (calculatedRevenue / maxPossible) * 100));

                      return (
                        <div key={idx} className="flex-grow flex flex-col items-center gap-1.5 h-full justify-end group/bar relative">
                          <div className="absolute bottom-full mb-1 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-black border border-white/10 px-2 py-1 rounded text-[8px] font-extrabold text-[#c5a880] pointer-events-none whitespace-nowrap z-30">
                            {calculatedRevenue.toLocaleString("tr-TR")} ₺
                          </div>
                          
                          <div className="w-full bg-gradient-to-t from-[#c5a880]/40 to-[#c5a880] rounded-t-md relative overflow-hidden transition-all duration-500 ease-out" style={{ height: `${heightPercent}%` }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-white/[0.05] to-transparent" />
                          </div>
                          <span className="text-[8px] font-extrabold text-[#52525b] group-hover/bar:text-white transition-colors">{data.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* B2B Application Form: 5 Cols */}
            <div className="lg:col-span-5 bg-[#111113]/90 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 hover:border-[#c5a880]/20 transition-all duration-300 shadow-2xl relative">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">İşletmenizi Ekleyin</h3>
                <p className="text-[10px] text-[#a1a1aa] font-semibold">BerberSaaS kolaylaştırıcı platformuna katılarak dükkanınızı binlerce müşteriye açın.</p>
              </div>

              {b2bFormSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center space-y-3"
                >
                  <Check className="w-8 h-8 text-emerald-400 mx-auto bg-emerald-500/10 rounded-full p-1.5 border border-emerald-500/20" />
                  <h4 className="text-sm font-bold text-white">Başvurunuz Alındı!</h4>
                  <p className="text-[10px] text-[#a1a1aa] leading-relaxed font-semibold">
                    Dükkan kaydınız başarıyla oluşturuldu. Ekibimiz en kısa sürede profilinizi onaylayarak sizinle iletişime geçecektir.
                  </p>
                  <button
                    onClick={() => {
                      setB2bFormSubmitted(false);
                      setB2bForm({ shopName: "", ownerName: "", phone: "", employees: "1-5" });
                    }}
                    className="px-4 py-2 bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] text-[9px] font-extrabold rounded-lg hover:bg-[#c5a880] hover:text-black transition-all"
                  >
                    Yeni Kayıt Ekle
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleB2bSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-[#52525b]">Salon / Dükkan Adı</label>
                    <input
                      type="text"
                      value={b2bForm.shopName}
                      onChange={(e) => setB2bForm({ ...b2bForm, shopName: e.target.value })}
                      placeholder="Örn: Klasik Kesim Salonu"
                      className={`w-full px-4 py-3 bg-[#09090b] border rounded-xl text-xs text-white placeholder-[#3f3f46] focus:border-[#c5a880]/30 focus:outline-none transition-colors ${
                        b2bFormErrors.shopName ? "border-red-500/40 focus:border-red-500/50" : "border-white/5"
                      }`}
                    />
                    {b2bFormErrors.shopName && <p className="text-[8px] text-red-400 font-bold">{b2bFormErrors.shopName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-[#52525b]">Yetkili Ad Soyad</label>
                    <input
                      type="text"
                      value={b2bForm.ownerName}
                      onChange={(e) => setB2bForm({ ...b2bForm, ownerName: e.target.value })}
                      placeholder="Örn: Ahmet Yılmaz"
                      className={`w-full px-4 py-3 bg-[#09090b] border rounded-xl text-xs text-white placeholder-[#3f3f46] focus:border-[#c5a880]/30 focus:outline-none transition-colors ${
                        b2bFormErrors.ownerName ? "border-red-500/40 focus:border-red-500/50" : "border-white/5"
                      }`}
                    />
                    {b2bFormErrors.ownerName && <p className="text-[8px] text-red-400 font-bold">{b2bFormErrors.ownerName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-[#52525b]">Telefon Numarası</label>
                    <input
                      type="tel"
                      value={b2bForm.phone}
                      onChange={(e) => setB2bForm({ ...b2bForm, phone: e.target.value })}
                      placeholder="Örn: +90 555 123 4567"
                      className={`w-full px-4 py-3 bg-[#09090b] border rounded-xl text-xs text-white placeholder-[#3f3f46] focus:border-[#c5a880]/30 focus:outline-none transition-colors ${
                        b2bFormErrors.phone ? "border-red-500/40 focus:border-red-500/50" : "border-white/5"
                      }`}
                    />
                    {b2bFormErrors.phone && <p className="text-[8px] text-red-400 font-bold">{b2bFormErrors.phone}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-[#52525b]">Çalışan Sayısı</label>
                    <select
                      value={b2bForm.employees}
                      onChange={(e) => setB2bForm({ ...b2bForm, employees: e.target.value })}
                      className="w-full px-4 py-3 bg-[#09090b] border border-white/5 rounded-xl text-xs text-white focus:border-[#c5a880]/30 focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="1-5">1 - 5 Kişi</option>
                      <option value="6-10">6 - 10 Kişi</option>
                      <option value="10+">10+ Kişi</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#c5a880] text-black font-extrabold text-xs rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#c5a880]/15 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Başvuru Yap <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── AI Consultations & Community Forum Promo ─── */}
      <section className="py-24 border-t border-[#2a2a2e]/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <RevealSection className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#c5a880]">YAPAY ZEKA VE SOSYAL KEŞİF</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Güzellik Deneyiminde <span className="font-serif italic">Yeni Çağ</span>
            </p>
            <p className="text-xs text-[#a1a1aa] font-semibold leading-relaxed">
              Sadece randevu almakla kalmayın. Yapay zeka ile kendinize en yakışan stili bulun ve berber topluluğuna katılarak saç bakımı hakkında bilgi edinin.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI Yüz Tipi Analizi",
                desc: "Yapay zeka algoritmamız yüklediğiniz fotoğrafı veya kamera görüntüsünü analiz ederek yüz tipinizi çıkarır. Oval, yuvarlak veya kare yüz şeklinize en uygun saç/sakal kesim modellerini ve uzunluklarını görselleştirir.",
                action: "AI Stil'i Keşfet →",
                path: "/ai-recommendation",
              },
              {
                icon: HeartPulse,
                title: "AI Saç Sağlığı Kliniği",
                desc: "Saç dökülmesi, kepek veya yağlanma gibi problemleriniz mi var? AI saç sağlığı danışmanımıza sorun. Hangi aktif bileşenlerin (Biotin, Keratin vb.) size iyi geleceğini ve hangi bakım ürünlerini kullanmanız gerektiğini öğrenin.",
                action: "AI Klinik'e Sor →",
                path: "/ai-clinic",
              },
              {
                icon: MessageSquare,
                title: "Soru-Cevap & Topluluk Forumu",
                desc: "Kafanızdaki tüm saç/sakal bakım sorularını topluluğumuza sorun. Forumda yer alan doğrulanmış uzman berberlerin (altın rozetli) verdiği profesyonel cevaplar sayesinde en doğru bilgiye doğrudan ulaşın.",
                action: "Topluluğa Katıl →",
                path: "/forum",
              },
            ].map((promo, idx) => {
              const Icon = promo.icon;
              return (
                <RevealSection key={idx} delay={idx * 0.1}>
                  <div className="bg-gradient-to-b from-[#18181b]/95 to-[#111113]/95 border border-white/5 rounded-3xl p-8 hover:border-[#c5a880]/30 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.02] flex flex-col justify-between h-full group">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-[#c5a880]" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-3">{promo.title}</h3>
                      <p className="text-xs text-[#a1a1aa] leading-relaxed font-semibold mb-6">{promo.desc}</p>
                    </div>
                    <div>
                      <Link
                        to={promo.path}
                        className="text-xs text-[#c5a880] font-extrabold hover:text-[#e8d5b5] transition-colors"
                      >
                        {promo.action}
                      </Link>
                    </div>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Infinite Marquee Testimonials ─── */}
      <section className="py-20 border-t border-[#2a2a2e]/30 bg-[#0a0a0c]/80 relative z-10 overflow-hidden">
        <RevealSection className="text-center max-w-2xl mx-auto space-y-3 mb-12 px-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#c5a880]">Yorumlar</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Kullanıcılarımız <span className="font-serif italic">Ne Diyor?</span>
          </p>
        </RevealSection>

        {/* Marquee track */}
        <div className="relative w-full overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0c] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0c] to-transparent z-10 pointer-events-none" />
          
          <div className="flex animate-marquee">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[320px] mx-3 bg-[#111113]/90 border border-white/5 rounded-2xl p-5 hover:border-[#c5a880]/20 transition-colors"
              >
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={11}
                      className={s < t.rating ? "text-[#c5a880] fill-[#c5a880]" : "text-[#2a2a2e] fill-[#2a2a2e]"}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#a1a1aa] font-medium leading-relaxed mb-3 font-serif italic">"{t.text}"</p>
                <p className="text-[10px] font-extrabold text-[#c5a880] uppercase tracking-wider">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─── */}
      <section className="py-24 border-t border-[#2a2a2e]/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <RevealSection className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#c5a880]">Şeffaf Fiyatlandırma</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              <span className="font-serif italic">Kullanıcı Dostu</span> Paketler
            </p>
            
            {/* Toggle Billing */}
            <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-[#111113] border border-white/5 mt-4">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer ${
                  !isAnnual ? "bg-[#c5a880] text-black" : "text-[#a1a1aa]"
                }`}
              >
                Aylık Ödeme
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                  isAnnual ? "bg-[#c5a880] text-black" : "text-[#a1a1aa]"
                }`}
              >
                Yıllık Ödeme
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-extrabold">%20 TASARRUF</span>
              </button>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Başlangıç",
                price: "0 ₺",
                desc: "Bireysel berberler veya test etmek isteyen butik dükkanlar için.",
                features: ["1 Berber Kaydı", "Sınırsız Randevu", "Temel Raporlar", "Mobil Arayüz"],
                pop: false,
              },
              {
                title: "Profesyonel",
                price: isAnnual ? "239 ₺" : "299 ₺",
                desc: "Büyümekte olan ve işini profesyonelce yönetmek isteyen salonlar için.",
                features: ["Sınırsız Berber", "Detaylı Finansal Grafik", "Müşteri Geri Bildirimi", "Öncelikli Randevular", "Şube Raporları"],
                pop: true,
              },
              {
                title: "Kurumsal",
                price: isAnnual ? "479 ₺" : "599 ₺",
                desc: "Çoklu dükkan şubesi olan kurumsal salon zincirleri için.",
                features: ["Her Şey Dahil", "Şube Yönetim Paneli", "API & Webhook Entegrasyonu", "7/24 Özel Temsilci", "Grafik Tasarım Desteği"],
                pop: false,
              },
            ].map((plan, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div
                  className={`bg-gradient-to-b from-[#18181b]/90 to-[#111113]/90 border rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(197,168,128,0.12)] h-full ${
                    plan.pop ? "border-[#c5a880] ring-1 ring-[#c5a880]" : "border-white/5"
                  }`}
                >
                  {plan.pop && (
                    <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] text-black text-[8px] font-extrabold uppercase tracking-widest">
                      Önerilen
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.title}</h3>
                      <p className="text-[10px] text-[#a1a1aa] font-semibold mt-1">{plan.desc}</p>
                    </div>
                    
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white tracking-tight">{plan.price}</span>
                      {plan.price !== "0 ₺" && <span className="text-[10px] text-[#52525b] font-bold">/ ay</span>}
                    </div>
                    
                    <div className="h-px bg-[#2a2a2e]/30" />
                    
                    <ul className="space-y-3">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-[#a1a1aa] font-semibold">
                          <Check className="w-4 h-4 text-[#c5a880] shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-2">
                    <Link
                      to="/login"
                      className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all duration-300 hover:scale-[1.02] flex items-center justify-center cursor-pointer ${
                        plan.pop
                          ? "bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] text-black shadow-lg shadow-[#c5a880]/15"
                          : "bg-[#111113] border border-white/5 text-white hover:border-[#c5a880]/30"
                      }`}
                    >
                      Başla
                    </Link>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-24 border-t border-[#2a2a2e]/30 relative z-10 bg-[#0a0a0c]/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <RevealSection className="text-center max-w-2xl mx-auto space-y-3">
            <HelpCircle className="w-10 h-10 text-[#c5a880] mx-auto mb-2" />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#c5a880]">Sıkça Sorulan Sorular</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Kafanıza <span className="font-serif italic">Takılanlar</span>
            </p>
          </RevealSection>

          <RevealSection className="space-y-4">
            <FAQItem
              q="BarberSaaS kurulumu ne kadar zaman alır?"
              a="Yalnızca 2-3 dakika! Hesabınızı oluşturduktan sonra berberlerinizi ve çalışma saatlerinizi kaydedip hemen online randevu almaya başlayabilirsiniz."
            />
            <FAQItem
              q="Müşteriler randevu alırken komisyon veya ücret öder mi?"
              a="Hayır! Müşterileriniz için randevu alma işlemi tamamen ücretsizdir. Diledikleri berberden saniyeler içinde rezervasyon yapabilirler."
            />
            <FAQItem
              q="Randevu hatırlatmaları otomatik mi gidiyor?"
              a="Evet, sistem yaklaşan randevulardan önce hem e-posta hem de SMS (opsiyonel) yoluyla hatırlatma bildirimi gönderir, böylece iptalleri minimuma indirir."
            />
            <FAQItem
              q="Yıllık ödemelerde ek avantaj var mı?"
              a="Evet! Yıllık ödeme planını seçtiğinizde net %20 oranında indirim alırsınız ve abonelik faturanız yıllık olarak tek seferde kesilir."
            />
          </RevealSection>
        </div>
      </section>

      {/* ─── Footer Section ─── */}
      <footer className="border-t border-[#2a2a2e]/40 bg-[#09090b] py-16 relative z-10 text-center sm:text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#c5a880]/15 flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-[#c5a880] rotate-45" />
                </div>
                <span className="text-base font-extrabold text-white">BarberSaaS</span>
              </div>
              <p className="text-[10px] text-[#52525b] font-extrabold max-w-xs leading-relaxed uppercase tracking-wider">
                Apple standartlarında modern berber randevu yönetim altyapısı.
              </p>
            </div>
            
            {[
              { title: "Ürün", links: ["Özellikler", "Fiyatlar", "Mobil Uygulama", "Güncellemeler"] },
              { title: "Şirket", links: ["Hakkımızda", "Kariyer", "İletişim", "Basın Kiti"] },
              { title: "Yasal", links: ["Gizlilik Sözleşmesi", "Kullanım Koşulları", "KVKK Açıklaması", "Çerez Politikası"] },
            ].map((menu, i) => (
              <div key={i} className="space-y-3">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#52525b]">{menu.title}</h4>
                <ul className="space-y-2">
                  {menu.links.map((lnk) => (
                    <li key={lnk}>
                      <a href="#" className="text-xs font-semibold text-[#a1a1aa] hover:text-[#c5a880] transition-colors">{lnk}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="h-px bg-[#2a2a2e]/30 my-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-semibold text-[#52525b]">© 2026 BarberSaaS. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-4 text-xs font-semibold text-[#52525b]">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
