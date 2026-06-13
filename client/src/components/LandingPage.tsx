import { useState, useEffect, useRef, useCallback } from "react";
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
    const cutTimer = setTimeout(() => setPhase("splitting"), 400);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 900);

    return () => {
      clearTimeout(cutTimer);
      clearTimeout(doneTimer);
    };
  }, []);

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

// ─── Step 1 Demo: Registration ───
const Step1Demo = () => {
  const [nameText, setNameText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const timers: NodeJS.Timeout[] = [];

    const startAnimation = () => {
      if (!isMounted) return;
      setNameText("");
      setEmailText("");
      setIsValidated(false);

      // Type Name: "Can Yılmaz"
      const name = "Can Yılmaz";
      for (let i = 0; i <= name.length; i++) {
        const t = setTimeout(() => {
          if (isMounted) setNameText(name.slice(0, i));
        }, i * 100);
        timers.push(t);
      }

      // Type Email: "can@email.com" after name finishes (1.2s)
      const email = "can@email.com";
      const emailStartDelay = 1300;
      for (let i = 0; i <= email.length; i++) {
        const t = setTimeout(() => {
          if (isMounted) setEmailText(email.slice(0, i));
        }, emailStartDelay + i * 80);
        timers.push(t);
      }

      // Validate after email finishes (2.5s)
      const validateDelay = 2700;
      const tVal = setTimeout(() => {
        if (isMounted) setIsValidated(true);
      }, validateDelay);
      timers.push(tVal);

      // Reset after 6s
      const resetDelay = 6000;
      const tReset = setTimeout(() => {
        if (isMounted) startAnimation();
      }, resetDelay);
      timers.push(tReset);
    };

    startAnimation();

    return () => {
      isMounted = false;
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="w-full h-24 bg-[#09090b]/80 border border-white/5 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden select-none my-4">
      <div className="space-y-1.5">
        {/* Name input simulation */}
        <div className="h-5 bg-[#111113] border border-white/5 rounded-lg px-2 flex items-center justify-between text-[8px] font-semibold text-[#a1a1aa]">
          <span className="truncate">{nameText || "Ad Soyad..."}</span>
          {nameText && nameText.length < 10 && <span className="w-1 h-3 bg-[#c5a880] animate-pulse" />}
          {isValidated && <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />}
        </div>
        {/* Email input simulation */}
        <div className="h-5 bg-[#111113] border border-white/5 rounded-lg px-2 flex items-center justify-between text-[8px] font-semibold text-[#a1a1aa]">
          <span className="truncate">{emailText || "E-posta adresi..."}</span>
          {emailText && emailText.length < 13 && nameText.length >= 10 && <span className="w-1 h-3 bg-[#c5a880] animate-pulse" />}
          {isValidated && <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isValidated ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="h-5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center gap-1 text-[8px] font-bold text-emerald-400"
          >
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Kayıt Başarılı!</span>
          </motion.div>
        ) : (
          <div className="h-5 bg-[#c5a880] text-black rounded-lg flex items-center justify-center text-[8px] font-extrabold uppercase tracking-wide">
            Kayıt Ol
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Step 2 Demo: Calendar Booking ───
const Step2Demo = () => {
  const [selectedBarber, setSelectedBarber] = useState(false);
  const [selectedDate, setSelectedDate] = useState(false);
  const [selectedTime, setSelectedTime] = useState(false);
  const [clickCoord, setClickCoord] = useState<{ x: number; y: number; opacity: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const timers: NodeJS.Timeout[] = [];

    const runBookingCycle = () => {
      if (!isMounted) return;
      setSelectedBarber(false);
      setSelectedDate(false);
      setSelectedTime(false);
      setClickCoord(null);

      // Select Barber after 1s
      const t1 = setTimeout(() => {
        if (!isMounted) return;
        setClickCoord({ x: 40, y: 15, opacity: 1 });
        // Fade out click ripple
        const t1_ripple = setTimeout(() => {
          if (isMounted) {
            setSelectedBarber(true);
            setClickCoord(null);
          }
        }, 300);
        timers.push(t1_ripple);
      }, 1000);
      timers.push(t1);

      // Select Date after 2.5s
      const t2 = setTimeout(() => {
        if (!isMounted) return;
        setClickCoord({ x: 80, y: 40, opacity: 1 });
        const t2_ripple = setTimeout(() => {
          if (isMounted) {
            setSelectedDate(true);
            setClickCoord(null);
          }
        }, 300);
        timers.push(t2_ripple);
      }, 2500);
      timers.push(t2);

      // Select Time after 4s
      const t3 = setTimeout(() => {
        if (!isMounted) return;
        setClickCoord({ x: 130, y: 65, opacity: 1 });
        const t3_ripple = setTimeout(() => {
          if (isMounted) {
            setSelectedTime(true);
            setClickCoord(null);
          }
        }, 300);
        timers.push(t3_ripple);
      }, 4000);
      timers.push(t3);

      // Reset after 6.5s
      const tReset = setTimeout(() => {
        if (isMounted) runBookingCycle();
      }, 6500);
      timers.push(tReset);
    };

    runBookingCycle();

    return () => {
      isMounted = false;
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="w-full h-24 bg-[#09090b]/80 border border-white/5 rounded-2xl p-2.5 flex flex-col justify-between relative overflow-hidden select-none my-4">
      {/* Click ripple animation helper */}
      {clickCoord && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute w-4 h-4 rounded-full border border-[#c5a880] pointer-events-none z-30"
          style={{ left: clickCoord.x, top: clickCoord.y }}
        />
      )}

      {/* Row 1: Select Barber */}
      <div className="flex justify-between items-center gap-1">
        <span className="text-[7px] text-[#52525b] font-bold uppercase tracking-wider">Uzman:</span>
        <div className="flex gap-1 flex-1 justify-end">
          <div className={`px-2 py-0.5 rounded text-[7px] font-bold border ${selectedBarber ? "bg-[#c5a880]/15 border-[#c5a880] text-white" : "bg-[#111113] border-white/5 text-[#a1a1aa]"}`}>
            Burak Usta
          </div>
          <div className="px-2 py-0.5 rounded text-[7px] font-bold bg-[#111113] border border-white/5 text-[#52525b]">
            Ali Usta
          </div>
        </div>
      </div>

      {/* Row 2: Select Date */}
      <div className="flex justify-between items-center gap-1">
        <span className="text-[7px] text-[#52525b] font-bold uppercase tracking-wider">Tarih:</span>
        <div className="flex gap-1 justify-end flex-1">
          {[12, 13, 14, 15].map((d) => {
            const isSelected = d === 14 && selectedDate;
            return (
              <div key={d} className={`w-4 h-4 rounded flex items-center justify-center text-[7px] font-extrabold border transition-all ${isSelected ? "bg-[#c5a880] border-transparent text-black" : "bg-[#111113] border-white/5 text-[#a1a1aa]"}`}>
                {d}
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 3: Select Time */}
      <div className="flex justify-between items-center gap-1">
        <span className="text-[7px] text-[#52525b] font-bold uppercase tracking-wider">Saat:</span>
        <div className="flex gap-1 justify-end flex-1">
          {["11:00", "14:20", "16:40"].map((t) => {
            const isSelected = t === "14:20" && selectedTime;
            return (
              <div key={t} className={`px-1.5 py-0.5 rounded text-[6px] font-bold border transition-all ${isSelected ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-[#111113] border-white/5 text-[#a1a1aa]"}`}>
                {t}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Reddit-Style Community Forum Demo ───
const CommunityForumDemo = () => {
  interface ForumComment {
    id: number;
    author: string;
    avatar: string;
    badge?: string;
    text: string;
    time: string;
  }

  const [comments, setComments] = useState<ForumComment[]>([]);
  const [upvotes, setUpvotes] = useState(42);
  const [isUpvoted, setIsUpvoted] = useState(false);

  const script = [
    {
      action: "upvote",
      delay: 1200,
    },
    {
      action: "comment",
      delay: 2500,
      comment: {
        id: 1,
        author: "Berber Ali (Uzman)",
        avatar: "💇‍♂️",
        badge: "Altın Berber",
        text: "İlk 15 gün kimyasal şampuanlardan uzak durun. Bebek şampuanı veya hekiminizin verdiği ph dengeleyici losyonu kullanın.",
        time: "1s önce"
      }
    },
    {
      action: "comment",
      delay: 5500,
      comment: {
        id: 2,
        author: "Kullanıcı Can",
        avatar: "🧔",
        text: "Aynı süreci geçirdim, katılıyorum! Ek olarak hekimin tavsiye ettiği köpüğü kullanmak kabuklanmayı çok hızlı döküyor.",
        time: "30dk önce"
      }
    }
  ];

  useEffect(() => {
    let isMounted = true;
    const timers: NodeJS.Timeout[] = [];

    const startDemo = () => {
      if (!isMounted) return;
      setComments([]);
      setUpvotes(42);
      setIsUpvoted(false);

      script.forEach((step) => {
        const t = setTimeout(() => {
          if (!isMounted) return;
          if (step.action === "upvote") {
            setUpvotes(43);
            setIsUpvoted(true);
          } else if (step.action === "comment" && step.comment) {
            setComments((prev) => [...prev, step.comment as ForumComment]);
          }
        }, step.delay);
        timers.push(t);
      });

      // Restart cycle after 10s
      const tRestart = setTimeout(() => {
        if (isMounted) startDemo();
      }, 10000);
      timers.push(tRestart);
    };

    startDemo();

    return () => {
      isMounted = false;
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="w-full bg-[#111113]/90 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-[400px] relative overflow-hidden group hover:border-[#c5a880]/20 transition-all duration-300 shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#c5a880]/5 blur-2xl pointer-events-none" />

      <div className="text-center w-full z-10 border-b border-[#2a2a2e]/30 pb-3">
        <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#c5a880] bg-[#c5a880]/10 px-2.5 py-1 rounded-full">Topluluk Forumu</span>
        <h4 className="text-base font-extrabold text-white mt-3">Soru, Cevap & Ürün Önerileri</h4>
      </div>

      {/* Main Forum Post Card */}
      <div className="flex-1 my-3 space-y-3.5 overflow-hidden">
        {/* OP Post */}
        <div className="bg-[#09090b]/80 border border-white/5 rounded-2xl p-3 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-semibold text-[#52525b]">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[10px]">🧔</span>
              @sacsever_99
            </span>
            <span>2sa önce • Saç Ekimi</span>
          </div>
          <h5 className="text-xs font-extrabold text-white leading-tight">
            Saç ektirdikten sonra ilk hafta hangi şampuanı kullanmalıyım?
          </h5>
          <div className="flex items-center gap-3">
            <div className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold flex items-center gap-1 transition-all ${isUpvoted ? "bg-[#c5a880]/10 border-[#c5a880]/30 text-[#c5a880]" : "bg-[#111113]/50 border-white/5 text-[#52525b]"}`}>
              ▲ {upvotes}
            </div>
            <span className="text-[10px] text-[#52525b] font-bold">💬 {comments.length} Yorum</span>
          </div>
        </div>

        {/* Comment stream */}
        <div className="space-y-2.5 pl-3 border-l border-[#2a2a2e]/40">
          <AnimatePresence>
            {comments.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#09090b]/55 border border-white/5 rounded-xl p-2.5 space-y-1 relative"
              >
                <div className="flex justify-between items-center text-[10px] font-semibold">
                  <div className="flex items-center gap-1">
                    <span>{c.avatar}</span>
                    <span className="text-white font-bold">{c.author}</span>
                    {c.badge && (
                      <span className="bg-[#c5a880]/10 text-[#c5a880] border border-[#c5a880]/20 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold">
                        {c.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[#52525b]">{c.time}</span>
                </div>
                <p className="text-xs text-[#a1a1aa] font-medium leading-normal">{c.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full bg-[#09090b]/80 border border-white/5 rounded-xl p-2.5 flex items-center justify-between z-10">
        <span className="text-[10px] font-bold text-[#52525b]">Topluluğa soru sorun veya tartışın...</span>
        <div className="w-6 h-6 rounded-lg bg-[#c5a880] flex items-center justify-center text-black shrink-0">
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </div>
      </div>
    </div>
  );
};

// ─── Step 3 Demo: Receipt Ticket ───
const Step3Demo = () => (
  <div className="w-full h-24 bg-[#09090b]/80 border border-white/5 rounded-2xl p-3 flex items-center justify-between relative overflow-hidden select-none my-4">
    <div className="space-y-1.5 text-left flex-1 min-w-0">
      <div className="h-1.5 w-16 bg-[#c5a880]/30 rounded-full" />
      <div className="text-[10px] font-bold text-white truncate leading-tight">Barber Kaya</div>
      <div className="text-[8px] text-[#a1a1aa] font-semibold flex items-center gap-1">
        <Clock className="w-2.5 h-2.5 text-[#c5a880]" /> 14:20
      </div>
    </div>
    <div className="relative shrink-0 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"
      >
        <Check className="w-5 h-5 stroke-[3]" />
      </motion.div>
      <div className="absolute top-[-4px] right-[-4px]">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
    </div>
  </div>
);

// ─── AI Face Shape Scanner Demo ───
const AIFaceScannerDemo = () => {
  const [phase, setPhase] = useState<"scanning" | "results">("scanning");

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((prev) => (prev === "scanning" ? "results" : "scanning"));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#111113]/90 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between h-[400px] relative overflow-hidden group hover:border-[#c5a880]/20 transition-all duration-300 shadow-2xl">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-[#c5a880]/5 blur-2xl pointer-events-none" />

      <div className="text-center w-full z-10">
        <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#c5a880] bg-[#c5a880]/10 px-2.5 py-1 rounded-full">AI Stil Analizi</span>
        <h4 className="text-base font-extrabold text-white mt-3">Yüz Şekline Göre Saç Önerisi</h4>
      </div>

      <div className="relative w-40 h-40 my-3 flex items-center justify-center">
        {/* Human Face Line-Art Silhouette */}
        <svg className="w-28 h-28 text-[#c5a880]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Hair outline */}
          <path d="M25 35 C25 20, 35 12, 50 12 C65 12, 75 20, 75 35 C78 35, 78 45, 75 48 C75 60, 70 82, 50 88 C30 82, 25 60, 25 48 C22 45, 22 35, 25 35 Z" />
          <path d="M25 35 C32 30, 42 28, 50 32 C58 28, 68 30, 75 35" /> {/* Hairline */}
          <path d="M30 20 C42 16, 58 16, 70 20" strokeWidth="1.2" /> {/* Top hair detail */}
          {/* Ears */}
          <path d="M23 45 C21 45, 20 48, 22 52 C23 54, 25 54, 25 51" />
          <path d="M77 45 C79 45, 80 48, 78 52 C77 54, 75 54, 75 51" />
          {/* Eyes (closed, eyelashes) */}
          <path d="M36 50 Q 40 54 44 50" strokeWidth="1.5" />
          <path d="M56 50 Q 60 54 64 50" strokeWidth="1.5" />
          {/* Eyebrows */}
          <path d="M34 44 Q 40 42 45 45" strokeWidth="1.2" />
          <path d="M66 44 Q 60 42 55 45" strokeWidth="1.2" />
          {/* Nose */}
          <path d="M50 49 L50 62 Q50 65 47 65" />
          {/* Lips */}
          <path d="M42 74 Q 50 78 58 74" />
          <path d="M46 74 Q 50 72 54 74" />
        </svg>

        <AnimatePresence>
          {phase === "scanning" ? (
            <motion.div
              key="scan-line"
              initial={{ top: "15%" }}
              animate={{ top: "85%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#c5a880] to-transparent shadow-[0_0_12px_#c5a880] z-20"
            />
          ) : (
            <motion.div
              key="results-dots"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="absolute top-[38%] left-[34%] w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-ping" />
              <div className="absolute top-[38%] right-[34%] w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-ping" />
              <div className="absolute top-[66%] left-[48%] w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-ping" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full z-10 min-h-[80px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === "scanning" ? (
            <motion.div
              key="scanning-txt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <p className="text-xs font-bold text-[#a1a1aa] flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-ping" />
                Kamera Taraması Yapılıyor...
              </p>
              <p className="text-[10px] text-[#52525b] font-semibold mt-1">Yüz hatları ve simetri analiz ediliyor</p>
            </motion.div>
          ) : (
            <motion.div
              key="results-list"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full space-y-2"
            >
              <div className="flex justify-between items-center bg-[#09090b]/60 border border-white/5 px-3 py-1.5 rounded-xl">
                <span className="text-[10px] font-extrabold text-white">Tespit Edilen Yüz:</span>
                <span className="text-[10px] font-extrabold text-[#c5a880]">Oval Şekil (%98)</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { name: "Pompadour", match: "%95" },
                  { name: "Buzz Cut", match: "%88" },
                  { name: "Fade Cut", match: "%85" },
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#09090b]/80 border border-[#c5a880]/10 rounded-lg p-1.5 text-center">
                    <p className="text-[9px] font-bold text-[#a1a1aa] truncate">{s.name}</p>
                    <p className="text-[10px] font-extrabold text-[#c5a880] mt-0.5">{s.match}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── AI Hair Clinic Demo (Berberine Sor) ───
const AIClinicDemo = () => {
  interface DemoMessage {
    id: number;
    sender: "user" | "ai";
    text: string;
  }

  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const timers: NodeJS.Timeout[] = [];

    const runDemo = () => {
      if (!isMounted) return;
      setMessages([]);
      setIsAiTyping(false);

      // Step 1: User sends first message after 1.5s
      const t1 = setTimeout(() => {
        if (!isMounted) return;
        setMessages([
          { id: 1, sender: "user", text: "Saç dökülmesini azaltmak için ne yapmalıyım?" }
        ]);
      }, 1500);
      timers.push(t1);

      // Step 2: AI starts typing after 3.5s
      const t2 = setTimeout(() => {
        if (!isMounted) return;
        setIsAiTyping(true);
      }, 3500);
      timers.push(t2);

      // Step 3: AI sends reply after 5.5s
      const t3 = setTimeout(() => {
        if (!isMounted) return;
        setIsAiTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: 2, sender: "ai", text: "Grooming AI: Öncelikle sülfatsız şampuanlar kullanın, kan akışını artırmak için haftada iki kez argan yağı ile saç derisine masaj yapın. 💆‍♂️" }
        ]);
      }, 5500);
      timers.push(t3);

      // Step 4: User sends second message after 8.5s
      const t4 = setTimeout(() => {
        if (!isMounted) return;
        setMessages((prev) => [
          ...prev,
          { id: 3, sender: "user", text: "Teşekkürler, hemen deneyeceğim!" }
        ]);
      }, 8500);
      timers.push(t4);

      // Step 5: AI starts typing after 10s
      const t5 = setTimeout(() => {
        if (!isMounted) return;
        setIsAiTyping(true);
      }, 10000);
      timers.push(t5);

      // Step 6: AI sends second reply after 11.5s
      const t6 = setTimeout(() => {
        if (!isMounted) return;
        setIsAiTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: 4, sender: "ai", text: "Rica ederim! Saç analizinizin detaylı sonuçlarını profilinizden takip edebilirsiniz." }
        ]);
      }, 11500);
      timers.push(t6);

      // Step 7: Restart loop after 16s
      const tRestart = setTimeout(() => {
        if (!isMounted) return;
        runDemo();
      }, 16000);
      timers.push(tRestart);
    };

    runDemo();

    return () => {
      isMounted = false;
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="w-full bg-[#111113]/90 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-[400px] relative overflow-hidden group hover:border-[#c5a880]/20 transition-all duration-300 shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#c5a880]/5 blur-2xl pointer-events-none" />

      <div className="text-center w-full z-10 border-b border-[#2a2a2e]/30 pb-3">
        <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#c5a880] bg-[#c5a880]/10 px-2.5 py-1 rounded-full">AI Klinik</span>
        <h4 className="text-base font-extrabold text-white mt-3">Berberine Sor / AI Klinik Asistanı</h4>
      </div>

      <div className="flex-1 flex flex-col justify-end space-y-2.5 my-4 px-1 min-h-[160px] max-h-[200px] overflow-hidden">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "ai" && (
                <div className="w-6 h-6 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880] text-[9px] font-bold shrink-0 mt-0.5">AI</div>
              )}
              <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] font-semibold border ${
                m.sender === "user"
                  ? "bg-[#c5a880] text-black border-transparent rounded-tr-none"
                  : "bg-[#09090b] text-[#fafafa] border-white/5 rounded-tl-none"
              }`}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {isAiTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2.5 justify-start"
            >
              <div className="w-6 h-6 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880] text-[9px] font-bold shrink-0 mt-0.5">AI</div>
              <div className="bg-[#09090b] border border-white/5 rounded-2xl rounded-tl-none px-3 py-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full bg-[#09090b]/80 border border-white/5 rounded-xl p-2.5 flex items-center justify-between z-10">
        <span className="text-[10px] font-bold text-[#52525b]">Asistana mesaj gönderin...</span>
        <div className="w-6 h-6 rounded-lg bg-[#c5a880] flex items-center justify-center text-black shrink-0">
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </div>
      </div>
    </div>
  );
};

// ─── Marquee Testimonials Data ───
const TESTIMONIALS = [
  { name: "Emre K.", text: "Artık berbere gitmek çok daha kolay! 3 saniyede randevu alıyorum.", rating: 5 },
  { name: "Burak S.", text: "En iyi berber uygulaması. Arayüzü müthiş güzel ve kullanışlı.", rating: 5 },
  { name: "Ahmet Y.", text: "Berberlerin takvimini görmek harika bir özellik.", rating: 4 },
  { name: "Mert D.", text: "Randevu ve saat karşılaştırması yapmak artık çok kolay.", rating: 5 },
  { name: "Kerem A.", text: "Hızlı, güvenilir ve göz alıcı bir platform.", rating: 5 },
  { name: "Ozan T.", text: "Bu uygulamayı keşfetmem hayatımı kolaylaştırdı.", rating: 4 },
  { name: "Serkan B.", text: "Sakal tasarımı için en iyi berberleri bulmak artık çok kolay.", rating: 5 },
  { name: "Ali V.", text: "Mobil uyumlu olması büyük artı. Her yerden erişebiliyorum.", rating: 5 },
];

// ─── Nearby Barbers Map Discovery Demo ───
interface MapShop {
  id: string;
  name: string;
  distance: string;
  rating: number;
  openUntil: string;
  slots: number;
  x: number; // percentage coordinate on map X
  y: number; // percentage coordinate on map Y
}

const MAP_SHOPS: MapShop[] = [
  { id: "s1", name: "Gold Cut Premium", distance: "250m", rating: 4.9, openUntil: "21:00", slots: 3, x: 35, y: 45 },
  { id: "s2", name: "Usta Makaslar", distance: "550m", rating: 4.8, openUntil: "20:00", slots: 1, x: 72, y: 28 },
  { id: "s3", name: "Vintage Grooming", distance: "900m", rating: 4.7, openUntil: "22:00", slots: 5, x: 22, y: 78 },
];

const MapDiscoveryDemo = () => {
  const [activeShopId, setActiveShopId] = useState("s1");
  const [hoveredShopId, setHoveredShopId] = useState<string | null>(null);

  // Auto-cycle through shops every 4 seconds unless hovered/clicked
  useEffect(() => {
    if (hoveredShopId) return;
    const interval = setInterval(() => {
      setActiveShopId((prev) => {
        if (prev === "s1") return "s2";
        if (prev === "s2") return "s3";
        return "s1";
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [hoveredShopId]);

  const activeShop = MAP_SHOPS.find(s => s.id === activeShopId) || MAP_SHOPS[0];

  return (
    <div className="w-full bg-[#111113]/90 border border-white/5 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative overflow-hidden group hover:border-[#c5a880]/20 transition-all duration-300 shadow-2xl">
      {/* Left panel: list of shops */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#c5a880] bg-[#c5a880]/10 px-2.5 py-1 rounded-full">AKILLI HARİTA KEŞFİ</span>
          <h4 className="text-xl font-extrabold text-white leading-tight">
            Yakınınızdaki Berberleri <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a880] to-[#e8d5b5]">
              Haritada Keşfedin
            </span>
          </h4>
          <p className="text-xs text-[#a1a1aa] font-medium leading-relaxed">
            Konumunuza en yakın premium dükkanları ve anlık müsait koltuk adetlerini gerçek zamanlı takip edin.
          </p>
        </div>

        <div className="space-y-2.5">
          {MAP_SHOPS.map((shop) => {
            const isActive = shop.id === activeShopId;
            return (
              <button
                key={shop.id}
                onClick={() => setActiveShopId(shop.id)}
                onMouseEnter={() => setHoveredShopId(shop.id)}
                onMouseLeave={() => setHoveredShopId(null)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${
                  isActive
                    ? "bg-[#c5a880]/10 border-[#c5a880] text-white shadow-lg shadow-[#c5a880]/5"
                    : "bg-[#09090b]/60 border-white/5 text-[#a1a1aa] hover:border-white/10 hover:text-white"
                }`}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-white truncate">{shop.name}</span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                      shop.slots === 1
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {shop.slots} Müsait Koltuk
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-[#52525b]">
                    <span>📍 {shop.distance}</span>
                    <span className="text-[#c5a880] flex items-center gap-0.5">⭐ {shop.rating}</span>
                    <span>🕒 {shop.openUntil}'a kadar açık</span>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? "bg-[#c5a880] border-transparent text-black" : "bg-[#111113] border-white/5 text-[#52525b]"
                }`}>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right panel: Dark map mockup */}
      <div className="lg:col-span-7 h-[340px] lg:h-auto min-h-[340px] bg-[#0c0c0e] border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner">
        {/* Dark Map Grid & Coordinates grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px]" />
        
        {/* Map Vector Layer (Parks, Water, Buildings, Streets) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none select-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Water body (River / Bosphorus simulation) */}
          <path d="M -10,10 C 20,15 30,30 45,55 C 60,80 80,90 110,95 L 110,110 L -10,110 Z" fill="rgba(59, 130, 246, 0.03)" />
          <path d="M -10,10 C 20,15 30,30 45,55 C 60,80 80,90 110,95" stroke="rgba(59, 130, 246, 0.05)" strokeWidth="3" fill="none" />

          {/* Park (Greenery simulation) */}
          <path d="M 5,25 L 25,25 L 30,10 L 15,5 Z" fill="rgba(34, 197, 94, 0.03)" />
          <path d="M 65,70 L 95,65 L 85,85 L 60,80 Z" fill="rgba(34, 197, 94, 0.03)" />

          {/* Building footprints (Simulated blocks) */}
          {/* Top Left Area */}
          <rect x="8" y="28" width="12" height="8" rx="1" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2" />
          <rect x="22" y="28" width="8" height="8" rx="1" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2" />
          {/* Center Area */}
          <rect x="42" y="10" width="14" height="12" rx="1" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2" />
          <rect x="42" y="26" width="14" height="8" rx="1" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2" />
          {/* Bottom Left Area */}
          <rect x="8" y="58" width="10" height="14" rx="1" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2" />
          <rect x="22" y="58" width="10" height="8" rx="1" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2" />
          {/* Bottom Right Area */}
          <rect x="78" y="42" width="14" height="14" rx="1" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2" />
          <rect x="62" y="42" width="12" height="10" rx="1" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2" />

          {/* Urban Streets Grid (Dark gray semi-transparent lines) */}
          {/* Vertical roads */}
          <line x1="15" y1="0" x2="15" y2="100" stroke="rgba(255,255,255,0.02)" strokeWidth="1.2" />
          <line x1="35" y1="0" x2="35" y2="100" stroke="rgba(255,255,255,0.02)" strokeWidth="1.2" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="2.0" /> {/* Main Boulevard */}
          <line x1="72" y1="0" x2="72" y2="100" stroke="rgba(255,255,255,0.02)" strokeWidth="1.2" />
          
          {/* Horizontal roads */}
          <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.02)" strokeWidth="1.2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="2.0" /> {/* Main Avenue */}
          <line x1="0" y1="78" x2="100" y2="78" stroke="rgba(255,255,255,0.02)" strokeWidth="1.2" />

          {/* Active Navigation Route (Drawing along streets instead of direct diagonal) */}
          <path
            d={
              activeShopId === "s1"
                ? "M 50,50 L 35,50 L 35,45"
                : activeShopId === "s2"
                ? "M 50,50 L 72,50 L 72,28"
                : "M 50,50 L 22,50 L 22,78"
            }
            stroke="rgba(197, 168, 128, 0.15)"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <motion.path
            key={activeShopId}
            d={
              activeShopId === "s1"
                ? "M 50,50 L 35,50 L 35,45"
                : activeShopId === "s2"
                ? "M 50,50 L 72,50 L 72,28"
                : "M 50,50 L 22,50 L 22,78"
            }
            stroke="#c5a880"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="6, 3"
            initial={{ strokeDashoffset: 18 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {/* Real Street Labels */}
        <div className="absolute left-[52%] top-[8%] text-[7px] font-extrabold uppercase tracking-wider text-[#3f3f46] select-none pointer-events-none transform rotate-90 origin-left">Nişantaşı Bulvarı</div>
        <div className="absolute left-[38%] top-[52%] text-[7px] font-extrabold uppercase tracking-wider text-[#3f3f46] select-none pointer-events-none">İstiklal Caddesi</div>
        <div className="absolute left-[5%] top-[79%] text-[7px] font-extrabold uppercase tracking-wider text-[#3f3f46] select-none pointer-events-none">Moda Yolu</div>
        <div className="absolute left-[17%] top-[14%] text-[7px] font-bold text-[#22c55e]/30 select-none pointer-events-none">Cumhuriyet Parkı</div>
        <div className="absolute left-[65%] top-[82%] text-[7px] font-bold text-[#22c55e]/30 select-none pointer-events-none">Atatürk Korusu</div>

        {/* User Current Location Dot */}
        <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-[0_0_12px_#3b82f6]">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          {/* Pulsing Radar Ring */}
          <div className="absolute w-12 h-12 rounded-full border border-blue-500/40 animate-ping pointer-events-none" />
        </div>

        {/* Pins for Barber Shops */}
        {MAP_SHOPS.map((shop) => {
          const isActive = shop.id === activeShopId;
          return (
            <button
              key={shop.id}
              onClick={() => setActiveShopId(shop.id)}
              className="absolute group/pin cursor-pointer transition-transform duration-300 hover:scale-110"
              style={{ left: `${shop.x}%`, top: `${shop.y}%`, transform: "translate(-50%, -50%)" }}
            >
              {/* Pin Icon / Dot */}
              <div className="relative flex items-center justify-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isActive
                    ? "bg-[#c5a880] border-transparent text-black shadow-[0_0_15px_#c5a880]"
                    : "bg-[#111113] border-[#c5a880]/30 text-[#c5a880] hover:bg-[#c5a880]/15"
                }`}>
                  <Scissors className="w-3.5 h-3.5 transform -rotate-45" />
                </div>
                {/* Active Indicator Pulse */}
                {isActive && (
                  <div className="absolute -inset-2 rounded-full border border-[#c5a880]/50 animate-ping pointer-events-none" />
                )}
              </div>

              {/* Popup label */}
              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 border border-white/10 px-2 py-1 rounded-lg text-[9px] font-extrabold whitespace-nowrap text-white pointer-events-none transition-all duration-300 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 group-hover/pin:opacity-100 group-hover/pin:translate-y-0"
              }`}>
                <span>{shop.name}</span>
                <span className="text-[#c5a880] ml-1">★{shop.rating}</span>
              </div>
            </button>
          );
        })}

        {/* Map HUD Overlay */}
        <div className="absolute bottom-3 left-3 bg-black/75 border border-white/5 px-2.5 py-1.5 rounded-lg text-[9px] font-bold text-[#a1a1aa] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Grooming GPS Aktif</span>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Harita", target: "#map-discovery" },
    { label: "Özellikler", target: "#features" },
    { label: "Nasıl Çalışır", target: "#how-it-works" },
    { label: "Yapay Zeka & Sosyal", target: "#ai-showcase" },
    { label: "İşletmeler", target: "#b2b-section" },
    { label: "S.S.S.", target: "#faq" },
  ];
  
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
  const progressRibbonRef = useRef<HTMLDivElement>(null);
  const scissorsContainerRef = useRef<HTMLDivElement>(null);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Lock scroll during splash screen loading
  useEffect(() => {
    if (showSplash) {
      document.documentElement.style.overflow = "hidden";
      (window as any).lenis?.stop();
    } else {
      document.documentElement.style.overflow = "";
      (window as any).lenis?.start();
    }
    return () => {
      document.documentElement.style.overflow = "";
      (window as any).lenis?.start();
    };
  }, [showSplash]);

  useEffect(() => {
    if (showSplash) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = scrollTop / docHeight;
        if (progressRibbonRef.current) {
          progressRibbonRef.current.style.width = `${progress * 100}%`;
        }
        if (scissorsContainerRef.current) {
          scissorsContainerRef.current.style.left = `calc(${progress * 100}% - 10px)`;
        }
      }
    };

    // Run once to initialize
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showSplash]);

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
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-[#c5a880]/30 font-sans relative overflow-x-hidden w-full">
      {/* ─── Splitting Splash Intro ─── */}
      {showSplash && <SplittingSplash onComplete={handleSplashComplete} />}

      {/* ─── Horizontal Scissor Progress Bar (Bottom of Viewport) ─── */}
      <div className="fixed bottom-0 left-0 right-0 h-8 z-50 pointer-events-none select-none">
        {/* Gold ribbon track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-[#2a2a2e]/40" />
        {/* Cut ribbon (left part, already cut) */}
        <div
          ref={progressRibbonRef}
          className="absolute top-1/2 -translate-y-1/2 left-0 h-[3px] bg-gradient-to-r from-[#b38f53] via-[#e5c185] to-[#c5a880]"
          style={{ width: "0%" }}
        />
        {/* Scissors icon at the cut point */}
        <div
          ref={scissorsContainerRef}
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: "calc(0% - 10px)" }}
        >
          <Scissors className="w-5 h-5 text-[#c5a880] animate-glow-pulse" />
        </div>
      </div>

      {/* Background glow meshes */}
      <div className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] rounded-full bg-[#c5a880]/[0.015] blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[#c5a880]/[0.01] blur-[150px] pointer-events-none z-0" />

      {/* Floating Glassmorphic Header */}
      <nav className="fixed top-4 inset-x-4 max-w-6xl mx-auto z-50 transition-all duration-300">
        <div className="w-full bg-black/60 backdrop-blur-2xl border border-white/5 rounded-2xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-2xl shadow-black/80 hover:border-[#c5a880]/25 transition-colors">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#c5a880]/15 border border-[#c5a880]/25 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-[#c5a880] transform -rotate-45" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white">
              Barber<span className="text-[#c5a880]">SaaS</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => (window as any).lenis?.scrollTo(link.target, { duration: 1.6 })}
                className="text-[10px] font-extrabold uppercase tracking-widest text-[#a1a1aa] hover:text-[#c5a880] transition-colors relative py-1 cursor-pointer group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#c5a880] transition-all group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-[10px] font-extrabold text-[#a1a1aa] hover:text-white transition-colors cursor-pointer uppercase tracking-widest"
            >
              Giriş Yap
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] hover:from-[#d5b890] hover:to-[#f8e5c5] text-black text-[10px] font-extrabold transition-all duration-300 shadow-md shadow-[#c5a880]/10 hover:scale-[1.02] cursor-pointer uppercase tracking-wider"
            >
              Hemen Başla
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-[#111113]/80 border border-white/5 text-[#c5a880] cursor-pointer"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-2xl border border-white/5 rounded-2xl p-5 flex flex-col gap-4 shadow-2xl z-40 md:hidden"
            >
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      (window as any).lenis?.scrollTo(link.target, { duration: 1.6 });
                    }}
                    className="w-full text-left text-xs font-extrabold uppercase tracking-widest text-[#a1a1aa] hover:text-[#c5a880] py-2 border-b border-[#2a2a2e]/30 transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-[#111113] border border-white/5 rounded-xl text-center text-xs font-bold text-white uppercase tracking-wider cursor-pointer"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] rounded-xl text-center text-xs font-extrabold text-black uppercase tracking-wider cursor-pointer shadow-lg shadow-[#c5a880]/15"
                >
                  Hemen Başla
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Hero Section (Split layout) ─── */}
      <header className="pt-36 pb-20 sm:pt-44 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Hero text panel */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] text-[10px] font-extrabold uppercase tracking-widest"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grooming Teknolojisinin Zirvesi</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
            >
              <span className="font-editorial italic">Randevu</span> Yönetiminin <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a880] to-[#e8d5b5]">
                En Premium
              </span>{" "}
              <span className="font-editorial">Hali</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.4 }}
              className="text-sm sm:text-base text-[#a1a1aa] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Salonunuzu modernize edin. Müşterilerinize pürüzsüz bir rezervasyon akışı sunarken, tüm berber ve kazanç tablolarınızı <span className="font-editorial italic text-white/80">Apple kalitesinde</span> bir arayüzle izleyin.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.6 }}
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 w-full"
            >
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] hover:from-[#d5b890] hover:to-[#f8e5c5] text-black text-xs font-extrabold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-xl shadow-[#c5a880]/15"
              >
                Hemen Ücretsiz Başla <Scissors className="w-4 h-4" />
              </Link>
              <button
                onClick={() => (window as any).lenis?.scrollTo('#features', { duration: 1.6 })}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#111113] border border-white/5 text-white hover:bg-[#18181b] hover:border-[#c5a880]/30 text-xs font-bold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-1 cursor-pointer"
              >
                Özellikleri Keşfet
              </button>
              <button
                onClick={() => (window as any).lenis?.scrollTo('#b2b-section', { duration: 1.6 })}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#c5a880]/10 to-[#c5a880]/5 border border-[#c5a880]/20 text-[#c5a880] hover:bg-[#c5a880]/15 hover:border-[#c5a880]/40 text-xs font-bold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-1 cursor-pointer"
              >
                İşletmenizi Ekleyin
              </button>
            </motion.div>
          </div>

          {/* Hero Right: Interactive iPhone Mockup — pushed down */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
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
                              <span>Tutar: 150 ₺</span>
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
      <section id="how-it-works" className="py-24 border-t border-[#2a2a2e]/30 bg-[#0a0a0c]/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <RevealSection className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#c5a880]">Nasıl Çalışır?</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              <span className="font-editorial italic">Üç Adımda</span> Randevunuz Hazır
            </p>
            <p className="text-xs text-[#a1a1aa] font-normal leading-relaxed">Kayıt olun, berberinizi seçin, randevunuzu alın. Bu kadar basit.</p>
          </RevealSection>

          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4 lg:gap-6">
            {/* Step 1 */}
            <RevealSection className="flex-1 w-full" delay={0.1}>
              <div className="relative bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 border border-white/5 rounded-3xl p-8 text-center hover:border-[#c5a880]/30 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_0_30px_rgba(197,168,128,0.12)] group h-full flex flex-col justify-between">
                <div>
                  <div className="absolute top-4 left-4 text-[10px] font-extrabold text-[#c5a880]/40 uppercase tracking-wider">
                    Adım 1
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="w-7 h-7 text-[#c5a880]" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Ücretsiz Kayıt Olun</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed font-normal">E-posta adresinizle saniyeler içinde hesap oluşturun. Kredi kartı gerekmez.</p>
                </div>
                <Step1Demo />
              </div>
            </RevealSection>

            {/* Arrow 1 */}
            <div className="flex items-center justify-center shrink-0 self-center py-2 lg:py-0">
              <ChevronRight className="w-6 h-6 text-[#c5a880]/40 rotate-90 lg:rotate-0 animate-pulse" />
            </div>

            {/* Step 2 */}
            <RevealSection className="flex-1 w-full" delay={0.25}>
              <div className="relative bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 border border-white/5 rounded-3xl p-8 text-center hover:border-[#c5a880]/30 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_0_30px_rgba(197,168,128,0.12)] group h-full flex flex-col justify-between">
                <div>
                  <div className="absolute top-4 left-4 text-[10px] font-extrabold text-[#c5a880]/40 uppercase tracking-wider">
                    Adım 2
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MousePointerClick className="w-7 h-7 text-[#c5a880]" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Berber & Saat Seçin</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed font-normal">Yakınızdaki premium dükkanları keşfedin, uygun saati seçin ve hemen onaylayın.</p>
                </div>
                <Step2Demo />
              </div>
            </RevealSection>

            {/* Arrow 2 */}
            <div className="flex items-center justify-center shrink-0 self-center py-2 lg:py-0">
              <ChevronRight className="w-6 h-6 text-[#c5a880]/40 rotate-90 lg:rotate-0 animate-pulse" />
            </div>

            {/* Step 3 */}
            <RevealSection className="flex-1 w-full" delay={0.4}>
              <div className="relative bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 border border-white/5 rounded-3xl p-8 text-center hover:border-[#c5a880]/30 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_0_30px_rgba(197,168,128,0.12)] group h-full flex flex-col justify-between">
                <div>
                  <div className="absolute top-4 left-4 text-[10px] font-extrabold text-[#c5a880]/40 uppercase tracking-wider">
                    Adım 3
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <CalendarCheck className="w-7 h-7 text-[#c5a880]" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Randevunuz Hazır!</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed font-normal">Otomatik hatırlatma ile randevunuza zamanında gidin. Memnun kalmadıysanız iptal edin.</p>
                </div>
                <Step3Demo />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ─── Nearby Barbers Map Discovery Section ─── */}
      <section id="map-discovery" className="py-24 border-t border-[#2a2a2e]/30 bg-[#0a0a0c]/85 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <MapDiscoveryDemo />
          </RevealSection>
        </div>
      </section>

      {/* ─── AI & Community Showcase Section ─── */}
      <section id="ai-showcase" className="py-24 border-t border-[#2a2a2e]/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <RevealSection className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#c5a880]">Akıllı Teknolojiler ve Sosyal Keşif</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Saç Tasarımı ve Bakımında <span className="font-editorial italic">Yeni Çağ</span>
            </p>
            <p className="text-xs text-[#a1a1aa] font-normal leading-relaxed">
              Kişiselleştirilmiş Yapay Zeka analizleriyle tarzınızı oluşturun, saç sağlığınızla ilgili uzman asistanlara danışın ve topluluk forumumuzda diğer kullanıcılarla tartışın.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RevealSection delay={0.15}>
              <AIFaceScannerDemo />
            </RevealSection>
            <RevealSection delay={0.3}>
              <AIClinicDemo />
            </RevealSection>
            <RevealSection delay={0.45}>
              <CommunityForumDemo />
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ─── Features Showcase Section ─── */}
      <section id="features" className="py-24 border-t border-[#2a2a2e]/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <RevealSection className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#c5a880]">Eksiksiz Özellik Seti</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Salon <span className="font-editorial italic">Yönetimini</span> Otomatize Edin
            </p>
            <p className="text-xs text-[#a1a1aa] font-normal leading-relaxed">Artık kağıt takvimler, kaybolan müşteri telefonları yok. İhtiyacınız olan her şey tek bir platformda.</p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => (window as any).lenis?.scrollTo('#b2b-section', { duration: 1.2 })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] hover:bg-[#c5a880]/20 text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                İşletmeniz mi Var? Salonunuzu Ekleyin <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
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
                    <p className="text-xs text-[#a1a1aa] leading-relaxed font-normal">{f.desc}</p>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── B2B Owner Panel Showcase & Demo ─── */}
      <section id="b2b-section" className="py-24 border-t border-[#2a2a2e]/30 bg-[#0a0a0c]/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <RevealSection className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#c5a880]">DÜKKAN SAHİPLERİ İÇİN (B2B)</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Salonunuzu <span className="font-editorial italic">Yapay Zeka & Akıllı Takvim</span> ile Yönetin
            </p>
            <p className="text-xs text-[#a1a1aa] font-normal leading-relaxed">
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
                <p className="text-[10px] text-[#a1a1aa] font-normal">BerberSaaS kolaylaştırıcı platformuna katılarak dükkanınızı binlerce müşteriye açın.</p>
              </div>

              {b2bFormSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center space-y-3"
                >
                  <Check className="w-8 h-8 text-emerald-400 mx-auto bg-emerald-500/10 rounded-full p-1.5 border border-emerald-500/20" />
                  <h4 className="text-sm font-bold text-white">Başvurunuz Alındı!</h4>
                  <p className="text-[10px] text-[#a1a1aa] leading-relaxed font-normal">
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
              Güzellik Deneyiminde <span className="font-editorial italic">Yeni Çağ</span>
            </p>
            <p className="text-xs text-[#a1a1aa] font-normal leading-relaxed">
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
                      <p className="text-xs text-[#a1a1aa] leading-relaxed font-normal mb-6">{promo.desc}</p>
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
            Kullanıcılarımız <span className="font-editorial italic">Ne Diyor?</span>
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
                <p className="text-xs text-[#a1a1aa] font-normal leading-relaxed mb-3 font-editorial italic">"{t.text}"</p>
                <p className="text-[10px] font-extrabold text-[#c5a880] uppercase tracking-wider">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section id="faq" className="py-24 border-t border-[#2a2a2e]/30 relative z-10 bg-[#0a0a0c]/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <RevealSection className="text-center max-w-2xl mx-auto space-y-3">
            <HelpCircle className="w-10 h-10 text-[#c5a880] mx-auto mb-2" />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#c5a880]">Sıkça Sorulan Sorular</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Kafanıza <span className="font-editorial italic">Takılanlar</span>
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
              { title: "Ürün", links: ["Özellikler", "Mobil Uygulama", "Güncellemeler"] },
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
