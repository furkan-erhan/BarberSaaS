import { useState, useEffect } from "react";
import {
  CalendarDays, AlertCircle, CheckCircle2, X, Plus, Clock, Scissors,
  CreditCard, Sparkles, Bell, BellOff, Flame, Crown, Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IAppointment } from "../types/appointment";

// ─── Timer Digit Cell ─────────────────────────────────────────────────
const TimerDigit = ({ value, label }: { value: number; label: string }) => {
  const formatted = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1">
        {formatted.split("").map((digit, idx) => (
          <div
            key={idx}
            className="w-8 h-12 rounded-xl bg-[#09090b] border border-white/10 flex items-center justify-center font-mono text-lg font-black text-[#c5a880] shadow-lg shadow-black/40 relative overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
            <span
              key={`${idx}-${digit}`}
              className="relative z-10 inline-block animate-roll-digit drop-shadow-[0_0_6px_rgba(197,168,128,0.45)]"
            >
              {digit}
            </span>
            <div className="absolute top-0 left-0 right-0 h-[50%] bg-white/[0.01] border-b border-white/[0.06]" />
          </div>
        ))}
      </div>
      <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#52525b] mt-1.5">
        {label}
      </span>
    </div>
  );
};

interface CustomerDashboardProps {
  upcomingAppointments: IAppointment[];
  pastAppointments: IAppointment[];
  onCancelAppointment: (id: string) => void;
  onBookNewShop: () => void;
  isLoading?: boolean;
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return "İyi Geceler";
  if (hour < 12) return "Günaydın";
  if (hour < 18) return "Tünaydın";
  return "İyi Akşamlar";
};

// ─── VIP Loyalty Card ─────────────────────────────────────────────────
function VIPLoyaltyCard({ completedCount }: { completedCount: number }) {
  const GOAL = 10;
  const progress = Math.min(completedCount, GOAL);
  const percent = (progress / GOAL) * 100;
  const isElite = completedCount >= 20;
  const tier = isElite ? "ELITE" : completedCount >= 10 ? "GOLD" : "PLATINUM";

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1a1710] via-[#141210] to-[#0d0c09] border border-[#c5a880]/20 shadow-2xl shadow-black/50 group hover:border-[#c5a880]/40 transition-all duration-500">
      {/* Animated shimmer sweep */}
      <div className="absolute top-0 left-0 h-full w-[35%] bg-gradient-to-r from-transparent via-[#c5a880]/8 to-transparent skew-x-12 animate-vip-shimmer pointer-events-none" />

      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#c5a880]/[0.03] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#c5a880]/[0.02] blur-[60px] pointer-events-none" />
      <div className="absolute bottom-4 right-6 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
        <Scissors className="w-40 h-40 rotate-[-20deg] text-[#c5a880]" />
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-[#c5a880]" />
              <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#c5a880]">
                VIP ÜYELİK
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              BarberSaaS <span className="text-[#c5a880]">{tier}</span>
            </h2>
            <p className="text-[10px] text-[#a1a1aa] mt-0.5 font-medium">Ahmet Kaya · #BSV-20240001</p>
          </div>

          {/* Tier badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider ${
            isElite
              ? "bg-purple-500/10 border-purple-500/25 text-purple-400"
              : completedCount >= 10
              ? "bg-[#c5a880]/15 border-[#c5a880]/30 text-[#c5a880]"
              : "bg-slate-500/10 border-slate-500/20 text-slate-400"
          }`}>
            {isElite ? <Zap className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
            {tier}
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#52525b]">
              Sadakat İlerlemesi
            </span>
            <span className="text-[11px] font-extrabold text-[#c5a880]">
              {progress}/{GOAL} Kesim
            </span>
          </div>

          {/* Progress bar with individual pip markers */}
          <div className="relative">
            <div className="h-2 bg-[#09090b] rounded-full border border-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] rounded-full transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Pip dots */}
            <div className="absolute inset-0 flex items-center justify-between px-0">
              {Array.from({ length: GOAL + 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full border transition-colors duration-300 ${
                    i === 0 ? "opacity-0" : i <= progress
                      ? "bg-[#c5a880] border-[#c5a880]"
                      : "bg-[#09090b] border-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Reward label */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#c5a880]/5 border border-[#c5a880]/10">
            <Flame className="w-4 h-4 text-[#c5a880] shrink-0" />
            <p className="text-[10px] text-[#a1a1aa] font-semibold leading-snug">
              {progress < GOAL ? (
                <>
                  <span className="text-[#c5a880] font-extrabold">{GOAL - progress} kesim</span> sonra{" "}
                  <span className="text-white font-extrabold">Ücretsiz Premium Bakım</span> kazanıyorsunuz! 🎁
                </>
              ) : (
                <>
                  Tebrikler! <span className="text-[#c5a880] font-extrabold">Ücretsiz Premium Bakım</span> hakkınız mevcut. 🎉
                </>
              )}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
          <div className="text-center">
            <p className="text-[18px] font-extrabold text-white">{completedCount}</p>
            <p className="text-[9px] text-[#52525b] uppercase font-bold tracking-wider mt-0.5">Tamamlanan</p>
          </div>
          <div className="text-center border-x border-white/5">
            <p className="text-[18px] font-extrabold text-[#c5a880]">{(completedCount * 150).toLocaleString("tr-TR")} ₺</p>
            <p className="text-[9px] text-[#52525b] uppercase font-bold tracking-wider mt-0.5">Harcama</p>
          </div>
          <div className="text-center">
            <p className="text-[18px] font-extrabold text-white">{Math.floor(completedCount * 15)}</p>
            <p className="text-[9px] text-[#52525b] uppercase font-bold tracking-wider mt-0.5">Puan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hair Wellness Cycle Tracker ──────────────────────────────────────
function HairWellnessTracker({ daysSinceLastCut }: { daysSinceLastCut: number }) {
  const IDEAL_CYCLE = 28;
  const percent = Math.min((daysSinceLastCut / IDEAL_CYCLE) * 100, 100);
  const isOverdue = daysSinceLastCut > IDEAL_CYCLE;
  const urgency = isOverdue ? "critical" : daysSinceLastCut > 21 ? "soon" : "good";

  const urgencyColors = {
    good:     { text: "text-emerald-400", border: "border-emerald-400/20", bg: "bg-emerald-400/5", ring: "#22c55e" },
    soon:     { text: "text-amber-400",   border: "border-amber-400/20",   bg: "bg-amber-400/5",   ring: "#f59e0b" },
    critical: { text: "text-red-400",     border: "border-red-400/20",     bg: "bg-red-400/5",     ring: "#ef4444" },
  }[urgency];

  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className={`relative bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border ${urgencyColors.border} rounded-3xl p-6 hover:border-opacity-50 transition-all duration-300`}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#c5a880]" />
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#52525b]">
          Saç Sağlığı Takibi
        </h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular gauge */}
        <div className="relative shrink-0">
          <svg width="104" height="104" className="-rotate-90">
            <circle
              cx="52" cy="52" r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="7"
            />
            <circle
              cx="52" cy="52" r={radius}
              fill="none"
              stroke={urgencyColors.ring}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-extrabold ${urgencyColors.text}`}>{daysSinceLastCut}</span>
            <span className="text-[8px] font-bold text-[#52525b] uppercase tracking-wider">gün</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm font-bold text-white">
              {urgency === "good" && "Saçınız Bakımlı ✓"}
              {urgency === "soon" && "Kesim Zamanı Yaklaşıyor"}
              {urgency === "critical" && "Kesim Gecikmesi!"}
            </p>
            <p className="text-[10px] text-[#a1a1aa] font-medium mt-0.5 leading-relaxed">
              {urgency === "good" && `Son kesimden ${daysSinceLastCut} gün geçti. İdeal ritimdesiniz.`}
              {urgency === "soon" && `${IDEAL_CYCLE - daysSinceLastCut} gün içinde kesim önerilir.`}
              {urgency === "critical" && `İdeal periyot ${daysSinceLastCut - IDEAL_CYCLE} gün geçti.`}
            </p>
          </div>

          <div className={`flex items-start gap-2 p-2.5 rounded-xl ${urgencyColors.bg} border ${urgencyColors.border}`}>
            <Sparkles className={`w-3 h-3 ${urgencyColors.text} shrink-0 mt-0.5`} />
            <p className="text-[9px] text-[#a1a1aa] font-semibold leading-relaxed">
              {urgency === "good" && "Argan yağlı bakım serumu kullanmaya devam edin."}
              {urgency === "soon" && "Bu hafta randevu almanızı tavsiye ederiz."}
              {urgency === "critical" && "Uzamış saç dökülmeyi hızlandırabilir, hemen randevu alın!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────
export default function CustomerDashboard({
  upcomingAppointments,
  pastAppointments,
  onCancelAppointment,
  isLoading = false,
}: CustomerDashboardProps) {
  const navigate = useNavigate();
  const nextAppointment = upcomingAppointments[0];
  const completedCount = pastAppointments.filter((a) => a.status === "Completed").length;

  // Days since last completed appointment (mock: 28 days for demo)
  const daysSinceLastCut = (() => {
    const last = pastAppointments.find((a) => a.status === "Completed");
    if (!last) return 0;
    return Math.floor((Date.now() - new Date(last.startTime).getTime()) / 86400000);
  })();

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  useEffect(() => {
    if (!nextAppointment) return;
    const calculateTimeLeft = () => {
      const difference = +new Date(nextAppointment.startTime) - +new Date();
      if (difference <= 0) return null;
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [nextAppointment]);

  const greeting = getGreeting();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c5a880] animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c5a880]">Kişisel Kontrol Paneli</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {greeting}, Ahmet
          </h1>
          <p className="text-[#a1a1aa] text-sm font-semibold">
            İstatistiklerinizi ve yaklaşan randevularınızı buradan takip edebilirsiniz.
          </p>
        </div>

        <button
          onClick={() => navigate("/shops")}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] hover:from-[#d5b890] hover:to-[#f8e5c5] text-black font-extrabold text-xs rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#c5a880]/15 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Yeni Randevu Al
        </button>
      </div>

      {/* ── Main Grid: VIP Card + Ticket ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 relative z-10">

        {/* Left: VIP Loyalty Card + Hair Wellness — spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <VIPLoyaltyCard completedCount={completedCount} />
          <HairWellnessTracker daysSinceLastCut={daysSinceLastCut || 28} />

          {/* Mini stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 hover:border-[#c5a880]/20 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-[#a1a1aa]">Aktif</span>
                <div className="w-7 h-7 rounded-lg bg-[#c5a880]/10 flex items-center justify-center">
                  <CalendarDays className="w-3.5 h-3.5 text-[#c5a880]" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white">{upcomingAppointments.length}</p>
              <p className="text-[8px] text-[#52525b] mt-1 uppercase font-bold">Randevu</p>
            </div>

            <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 hover:border-emerald-500/20 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-[#a1a1aa]">Tamamlanan</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white">{completedCount}</p>
              <p className="text-[8px] text-[#52525b] mt-1 uppercase font-bold">Kesim</p>
            </div>

            <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 hover:border-red-500/20 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-[#a1a1aa]">İptal</span>
                <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-red-400" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white">{pastAppointments.filter((a) => a.status === "Cancelled").length}</p>
              <p className="text-[8px] text-[#52525b] mt-1 uppercase font-bold">Randevu</p>
            </div>
          </div>
        </div>

        {/* Right: Next Appointment Ticket */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#52525b]">Sıradaki Randevunuz</h2>
          {nextAppointment ? (
            <div className="relative bg-[#18181b]/95 border border-white/5 rounded-3xl p-6 shadow-xl overflow-hidden group flex flex-col justify-between hover:border-[#c5a880]/50 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(197,168,128,0.15)] transition-all duration-500 min-h-[300px]">

              {/* Notches */}
              <div className="absolute left-[-10px] top-[55%] w-5 h-5 rounded-full bg-[#09090b] border-r border-white/5 z-20" />
              <div className="absolute right-[-10px] top-[55%] w-5 h-5 rounded-full bg-[#09090b] border-l border-white/5 z-20" />

              {/* Decorative */}
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none">
                <Scissors className="w-56 h-56 rotate-[-15deg] transform translate-x-12 -translate-y-12 text-[#c5a880]" />
              </div>

              <div className="z-10 flex flex-col h-full justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] tracking-[0.2em] font-extrabold text-[#c5a880] uppercase">Randevu Bileti</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold">Aktif</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight truncate">{nextAppointment.barberShopName}</h3>
                  <p className="text-[10px] text-[#a1a1aa] font-semibold mt-1">Premium Kuaför Hizmeti</p>

                  {timeLeft ? (
                    <div className="mt-4 bg-[#09090b]/40 border border-[#c5a880]/15 rounded-2xl p-4 flex justify-around items-center gap-1 shadow-lg relative select-none">
                      {timeLeft.days > 0 && (
                        <>
                          <TimerDigit value={timeLeft.days} label="GÜN" />
                          <span className="text-xs font-bold text-[#52525b] -mt-3.5">:</span>
                        </>
                      )}
                      <TimerDigit value={timeLeft.hours} label="SAAT" />
                      <span className="text-xs font-bold text-[#52525b] -mt-3.5">:</span>
                      <TimerDigit value={timeLeft.minutes} label="DK" />
                      <span className="text-xs font-bold text-[#52525b] -mt-3.5">:</span>
                      <TimerDigit value={timeLeft.seconds} label="SN" />
                    </div>
                  ) : (
                    <p className="text-[10px] text-emerald-400 font-extrabold mt-3 bg-emerald-400/5 border border-emerald-400/10 rounded-lg px-2.5 py-1.5 inline-block">
                      ⏱️ Randevu Zamanı Geldi!
                    </p>
                  )}
                </div>

                {/* Dashed separator */}
                <div className="border-t border-dashed border-[#2a2a2e] my-2 relative">
                  <span className="absolute left-[-24px] top-[-6px] w-3 h-3 rounded-full bg-[#09090b]" />
                  <span className="absolute right-[-24px] top-[-6px] w-3 h-3 rounded-full bg-[#09090b]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 min-w-0">
                    <p className="text-[9px] text-[#52525b] uppercase font-bold tracking-wider flex items-center gap-1">
                      <CalendarDays className="w-3 h-3 text-[#c5a880] shrink-0" /> Tarih
                    </p>
                    <p className="text-xs font-bold text-white truncate">{formatDate(nextAppointment.startTime)}</p>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-[9px] text-[#52525b] uppercase font-bold tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#c5a880] shrink-0" /> Saat
                    </p>
                    <p className="text-xs font-bold text-white truncate">{formatTime(nextAppointment.startTime)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2e]/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#c5a880]/15 flex items-center justify-center text-[9px] text-[#c5a880] font-bold shrink-0">₺</div>
                    <span className="text-sm font-extrabold text-[#c5a880]">{nextAppointment.price} ₺</span>
                  </div>
                  <button
                    onClick={() => onCancelAppointment(nextAppointment.id)}
                    className="text-[9px] font-bold text-red-400 hover:text-red-300 hover:underline transition-colors"
                  >
                    İptal Et
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#18181b] to-[#111113] border border-white/5 rounded-3xl p-8 h-full flex flex-col justify-center items-center text-center relative overflow-hidden group py-12 min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-[#2a2a2e]/30 flex items-center justify-center mb-4 border border-white/5">
                <AlertCircle className="w-8 h-8 text-[#52525b]" />
              </div>
              <p className="text-[#a1a1aa] text-xs font-bold mb-2">Yaklaşan randevunuz bulunmuyor.</p>
              <button
                onClick={() => navigate("/shops")}
                className="text-xs text-[#c5a880] font-extrabold hover:text-[#d5b890] flex items-center gap-1 hover:underline transition-all"
              >
                Randevu Oluştur <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Spending card */}
          <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-[#c5a880]/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-[#52525b] uppercase tracking-wider">Toplam Harcama</p>
                <p className="text-2xl font-extrabold text-[#c5a880] mt-1">
                  {pastAppointments.filter((a) => a.status === "Completed").reduce((s, a) => s + (a.price || 0), 0).toLocaleString("tr-TR")} ₺
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#c5a880]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Automated Reminders Toggle ── */}
      <div className="relative z-10">
        <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-[#c5a880]/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                remindersEnabled ? "bg-[#c5a880]/15 border border-[#c5a880]/20" : "bg-[#18181b] border border-white/5"
              }`}>
                {remindersEnabled
                  ? <Bell className="w-5 h-5 text-[#c5a880]" />
                  : <BellOff className="w-5 h-5 text-[#52525b]" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Otomatik Hatırlatmalar</h3>
                <p className="text-[10px] text-[#a1a1aa] font-semibold mt-0.5">
                  {remindersEnabled
                    ? "Randevularınızdan önce SMS ve e-posta ile hatırlatma alacaksınız."
                    : "Hatırlatma bildirimleri kapalı."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setRemindersEnabled(!remindersEnabled)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 shrink-0 ${
                remindersEnabled
                  ? "bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] shadow-md shadow-[#c5a880]/20"
                  : "bg-[#2a2a2e]"
              }`}
            >
              <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                remindersEnabled ? "left-[calc(100%-1.625rem)]" : "left-0.5"
              }`} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
