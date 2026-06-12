import { useState, useEffect } from "react";
import { CalendarDays, AlertCircle, CheckCircle2, X, Plus, Clock, Scissors, CreditCard, Sparkles, Bell, BellOff, MapPin, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IAppointment } from "../types/appointment";
import ReviewSystem from "./ReviewSystem";

// ─── Timer Digit Cell Component for Flipping/Ticking Visuals ───
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
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a880]/10 to-transparent" />
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

// ─── Dynamic Welcome Message Helper ───
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return "İyi Geceler";
  if (hour < 12) return "Günaydın";
  if (hour < 18) return "Tünaydın";
  return "İyi Akşamlar";
};

export default function CustomerDashboard({
  upcomingAppointments,
  pastAppointments,
  onCancelAppointment,
  onBookNewShop,
  isLoading = false,
}: CustomerDashboardProps) {
  const navigate = useNavigate();
  const nextAppointment = upcomingAppointments[0];
  const totalSpent = pastAppointments
    .filter((a) => a.status === "Completed")
    .reduce((sum, a) => sum + (a.price || 0), 0);

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  useEffect(() => {
    if (!nextAppointment) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(nextAppointment.startTime) - +new Date();
      if (difference <= 0) {
        return null;
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

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
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] hover:from-[#d5b890] hover:to-[#f8e5c5] text-black font-extrabold text-xs rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#c5a880]/15 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Yeni Randevu Al
        </button>
      </div>

      {/* Main Grid: Stats on Left (Spans 2), Ticket on Right (Spans 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
        
        {/* Left Column: Stats Cards (Spans 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#52525b]">Hızlı İstatistikler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Stat 1: Aktif Randevular */}
            <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-[#c5a880]/30 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(197,168,128,0.12)] group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#a1a1aa]">Aktif Randevular</span>
                <div className="w-10 h-10 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center group-hover:bg-[#c5a880]/20 transition-colors">
                  <CalendarDays className="w-5 h-5 text-[#c5a880]" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{upcomingAppointments.length}</p>
            </div>

            {/* Stat 2: Tamamlanan Randevular */}
            <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#a1a1aa]">Tamamlanan Randevular</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{pastAppointments.filter(a => a.status === "Completed").length}</p>
            </div>

            {/* Stat 3: İptal Edilen Randevular */}
            <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-red-500/30 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(239,68,68,0.12)] group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#a1a1aa]">İptal Edilen Randevular</span>
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <X className="w-5 h-5 text-red-400" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{pastAppointments.filter(a => a.status === "Cancelled").length}</p>
            </div>

            {/* Stat 4: Toplam Harcama */}
            <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-[#c5a880]/30 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(197,168,128,0.12)] group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#a1a1aa]">Toplam Harcama</span>
                <div className="w-10 h-10 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center group-hover:bg-[#c5a880]/20 transition-colors">
                  <CreditCard className="w-5 h-5 text-[#c5a880]" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#c5a880] tracking-tight">{totalSpent.toLocaleString("tr-TR")} ₺</p>
            </div>

            {/* Premium Grooming Tip Card */}
            <div className="bg-gradient-to-r from-[#1a1714] to-[#111113]/90 border border-[#c5a880]/15 rounded-3xl p-6 sm:col-span-2 hover:border-[#c5a880]/30 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-[#c5a880]/5 group flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-[#c5a880]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#c5a880]">Günün Premium Bakım Tavsiyesi</h4>
                <p className="text-xs text-[#a1a1aa] font-medium leading-relaxed">
                  Saç ve saç derisi sağlığınız için haftada en az bir kez doğal yağlar (tatlı badem veya argan yağı) ile masaj yapın. Ayrıca fön çektirmeden önce mutlaka ısı koruyucu serum kullanarak saç tellerinizin kırılmasını önleyebilirsiniz.
                </p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Column: Ticket Card (Spans 1 column on large screens) */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#52525b]">Sıradaki Randevunuz</h2>
          {nextAppointment ? (
            <div className="relative bg-[#18181b]/95 border border-white/5 rounded-3xl p-6 shadow-xl overflow-hidden group flex flex-col justify-between hover:border-[#c5a880]/50 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(197,168,128,0.15)] transition-all duration-500 h-auto min-h-[300px]">
              
              {/* Notches */}
              <div className="absolute left-[-10px] top-[55%] w-5 h-5 rounded-full bg-[#09090b] border-r border-white/5 z-20" />
              <div className="absolute right-[-10px] top-[55%] w-5 h-5 rounded-full bg-[#09090b] border-l border-white/5 z-20" />

              {/* Decorative Scissors Icon */}
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none">
                <Scissors className="w-56 h-56 rotate-[-15deg] transform translate-x-12 -translate-y-12 text-[#c5a880]" />
              </div>

              <div className="z-10 flex flex-col h-full justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] tracking-[0.2em] font-extrabold text-[#c5a880] uppercase">Randevu Bileti</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                      Aktif
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight truncate">{nextAppointment.barberShopName}</h3>
                  <p className="text-[10px] text-[#a1a1aa] font-semibold mt-1">Premium Kuaför Hizmeti</p>
                  
                  {/* Remaining Time Countdown */}
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
                    className="text-[9px] font-bold text-red-400 hover:text-red-300 hover:underline transition-colors cursor-pointer"
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
        </div>
        
      </div>

      {/* ─── Automated Reminders Toggle ─── */}
      <div className="relative z-10">
        <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-[#c5a880]/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                remindersEnabled 
                  ? "bg-[#c5a880]/15 border border-[#c5a880]/20" 
                  : "bg-[#18181b] border border-white/5"
              }`}>
                {remindersEnabled ? (
                  <Bell className="w-5 h-5 text-[#c5a880]" />
                ) : (
                  <BellOff className="w-5 h-5 text-[#52525b]" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Otomatik Hatırlatmalar</h3>
                <p className="text-[10px] text-[#a1a1aa] font-semibold mt-0.5">
                  {remindersEnabled 
                    ? "Randevularınızdan önce SMS ve e-posta ile hatırlatma alacaksınız." 
                    : "Hatırlatma bildirimleri kapalı."
                  }
                </p>
              </div>
            </div>
            
            {/* Premium Toggle Switch */}
            <button
              onClick={() => setRemindersEnabled(!remindersEnabled)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
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

      {/* ─── Geçmiş Randevular (Past Appointments with Reviews) ─── */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#c5a880]" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#52525b]">Geçmiş Randevular ve Değerlendirme</h2>
        </div>
        
        {pastAppointments.filter(a => a.status === "Completed").length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastAppointments
              .filter(a => a.status === "Completed")
              .slice(0, 2)
              .map((appt) => (
                <div key={appt.id} className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-[#c5a880]/20 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">{appt.barberShopName}</h3>
                      <p className="text-[10px] text-[#a1a1aa] font-semibold mt-0.5">{formatDate(appt.startTime)} - {formatTime(appt.startTime)}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] text-[9px] font-bold">
                      Tamamlandı
                    </span>
                  </div>
                  <ReviewSystem
                    appointmentId={appt.id}
                    shopName={appt.barberShopName}
                    onSubmitReview={() => {}}
                  />
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-[#111113]/80 border border-dashed border-[#2a2a2e] rounded-3xl p-6 text-center">
            <p className="text-[#a1a1aa] text-xs font-semibold">Değerlendirilecek geçmiş randevunuz bulunmuyor.</p>
          </div>
        )}
      </div>

      {/* ─── Yakınımdaki Berberler (Nearby Barbers with Dark Map) ─── */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#c5a880]" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#52525b]">Yakınımdaki Berberler</h2>
        </div>
        <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-[#c5a880]/20 transition-all duration-300">
          <iframe
            title="Yakınımdaki Berberler Haritası"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d24075.67!2d29.0!3d41.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2str!4v1700000000000"
            width="100%"
            height="280"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.1)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
          <div className="p-4 flex items-center justify-between">
            <p className="text-[10px] text-[#a1a1aa] font-semibold">Harita yakın konumdaki berber dükkanlarını göstermektedir.</p>
            <button
              onClick={() => navigate("/shops")}
              className="text-[10px] text-[#c5a880] font-extrabold hover:text-[#d5b890] transition-colors cursor-pointer"
            >
              Tüm Salonları Gör →
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
