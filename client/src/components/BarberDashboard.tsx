import { useState } from "react";
import { CheckCircle2, X, Clock, CalendarDays, Scissors, LayoutList, CalendarRange, TrendingUp, DollarSign, Edit3, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IAppointment } from "../types/appointment";

// ─── Mock Revenue Data ────────────────────────────────────────────────
const MONTHLY_REVENUE = [
  { month: "Oca", value: 4200 },
  { month: "Şub", value: 5100 },
  { month: "Mar", value: 4800 },
  { month: "Nis", value: 6300 },
  { month: "May", value: 7100 },
  { month: "Haz", value: 8400 },
];

const MAX_REVENUE = Math.max(...MONTHLY_REVENUE.map((r) => r.value));

// ─── Mock Services Data ───────────────────────────────────────────────
const INITIAL_SERVICES = [
  { id: "s1", name: "Saç Kesimi", price: 150 },
  { id: "s2", name: "Sakal Tıraşı", price: 100 },
  { id: "s3", name: "Saç + Sakal Kombo", price: 220 },
  { id: "s4", name: "Fön & Şekillendirme", price: 80 },
  { id: "s5", name: "Premium Bakım Paketi", price: 350 },
];
interface BarberDashboardProps {
  appointments: IAppointment[];
  currentDate: string;
  onCompleteAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  isLoading?: boolean;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    Pending: { label: "Bekliyor", cls: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
    Confirmed: { label: "Onaylandı", cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
    Completed: { label: "Tamamlandı", cls: "bg-[#c5a880]/15 border-[#c5a880]/20 text-[#c5a880]" },
    Cancelled: { label: "İptal", cls: "bg-red-500/10 border-red-500/20 text-red-400" },
  };
  return map[status] ?? { label: status, cls: "bg-[#18181b] border-white/5 text-[#a1a1aa]" };
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

// ─── Timeline Card (existing list view) ───
function TimelineCard({
  appointment,
  onComplete,
  onCancel,
}: {
  appointment: IAppointment;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const isActive = appointment.status === "Pending" || appointment.status === "Confirmed";
  const badge = getStatusBadge(appointment.status);

  return (
    <motion.div variants={itemVariants} className="flex gap-6 group relative">
      
      {/* Time column left (desktop) */}
      <div className="hidden sm:flex flex-col items-end w-20 shrink-0 pt-2">
        <span className="text-sm font-extrabold text-white">{formatTime(appointment.startTime)}</span>
        <span className="text-[10px] text-[#52525b] font-bold uppercase tracking-wider">{formatTime(appointment.endTime)}</span>
      </div>

      {/* Axis separator */}
      <div className="flex flex-col items-center gap-2 shrink-0 mt-2.5">
        <div
          className={`w-4 h-4 rounded-full border-[2.5px] shadow-md transition-colors duration-300 ${isActive
              ? "border-[#c5a880] bg-[#09090b]"
              : "border-[#2a2a2e] bg-[#111113]"
            }`}
        >
          {isActive && <div className="w-full h-full rounded-full bg-[#c5a880] animate-ping opacity-15" />}
        </div>
        <div className="w-[1.5px] flex-1 bg-gradient-to-b from-[#2a2a2e] to-transparent group-last:from-transparent group-last:to-transparent" />
      </div>

      {/* Detail Card container */}
      <div
        className={`flex-1 mb-6 bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border rounded-3xl p-5 sm:p-6 space-y-4 transition-all duration-300 ${isActive
            ? "border-white/5 hover:border-[#c5a880]/30 shadow-xl hover:shadow-[#c5a880]/5"
            : "border-[#2a2a2e]/30 opacity-60 hover:opacity-100"
          }`}
      >
        {/* Top Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${isActive
                  ? "bg-[#c5a880] text-black"
                  : "bg-[#18181b] border border-[#2a2a2e] text-[#52525b]"
                }`}
            >
              {appointment.customerId.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-white text-base leading-tight">Müşteri #{appointment.customerId.slice(-4)}</p>
              <p className="text-xs text-[#a1a1aa] font-semibold mt-0.5">{appointment.barberShopName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Show time on mobile */}
            <span className="sm:hidden text-xs font-bold text-white bg-[#09090b] px-2.5 py-1 rounded-lg border border-white/5">
              {formatTime(appointment.startTime)}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[9px] font-extrabold uppercase tracking-wider ${badge.cls}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#2a2a2e]/30" />

        {/* Price & Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#52525b] font-bold uppercase">HİZMET ÜCRETİ</span>
            <span className="text-sm font-extrabold text-[#c5a880]">
              {appointment.price != null ? `${appointment.price} ₺` : "—"}
            </span>
          </div>

          {isActive && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onComplete(appointment.id)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 text-emerald-400 hover:text-black rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                Tamamlandı
              </button>
              <button
                onClick={() => onCancel(appointment.id)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-white rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
                İptal Et
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Calendar Scheduler View ───
const HOURS = Array.from({ length: 12 }, (_, i) => i + 9); // 09:00 - 20:00

function CalendarScheduler({
  appointments,
  onComplete,
  onCancel,
}: {
  appointments: IAppointment[];
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  // Map appointments by hour
  const getAppointmentForHour = (hour: number) => {
    return appointments.filter((appt) => {
      const apptHour = new Date(appt.startTime).getHours();
      return apptHour === hour;
    });
  };

  return (
    <div className="space-y-1">
      {HOURS.map((hour) => {
        const hourAppts = getAppointmentForHour(hour);
        const timeLabel = `${String(hour).padStart(2, "0")}:00`;
        const hasAppointment = hourAppts.length > 0;

        return (
          <div key={hour} className="flex gap-4 group min-h-[72px]">
            {/* Time label */}
            <div className="w-14 shrink-0 flex items-start justify-end pt-2">
              <span className="text-[11px] font-bold text-[#52525b] tabular-nums">{timeLabel}</span>
            </div>

            {/* Slot content */}
            <div className="flex-1 border-t border-[#2a2a2e]/30 py-2">
              {hasAppointment ? (
                <div className="space-y-2">
                  {hourAppts.map((appt) => {
                    const isActive = appt.status === "Pending" || appt.status === "Confirmed";
                    const badge = getStatusBadge(appt.status);
                    return (
                      <motion.div
                        key={appt.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`rounded-2xl p-3.5 border transition-all duration-300 ${
                          isActive
                            ? "bg-[#c5a880]/5 border-[#c5a880]/20 hover:border-[#c5a880]/40 hover:shadow-lg hover:shadow-[#c5a880]/5"
                            : "bg-[#111113]/60 border-[#2a2a2e]/30 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                              isActive ? "bg-[#c5a880] text-black" : "bg-[#18181b] border border-[#2a2a2e] text-[#52525b]"
                            }`}>
                              {appt.customerId.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">Müşteri #{appt.customerId.slice(-4)}</p>
                              <p className="text-[9px] text-[#a1a1aa] font-medium">
                                {formatTime(appt.startTime)} — {formatTime(appt.endTime)}
                                {appt.price != null && <span className="text-[#c5a880] ml-2 font-bold">{appt.price} ₺</span>}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[8px] font-extrabold uppercase tracking-wider ${badge.cls}`}>
                              {badge.label}
                            </span>
                          </div>
                        </div>

                        {isActive && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#2a2a2e]/20">
                            <button
                              onClick={() => onComplete(appt.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 text-emerald-400 hover:text-black rounded-lg font-bold text-[10px] transition-all duration-300 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Tamamla
                            </button>
                            <button
                              onClick={() => onCancel(appt.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-white rounded-lg font-bold text-[10px] transition-all duration-300 cursor-pointer"
                            >
                              <X className="w-3 h-3" /> İptal
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full min-h-[48px] flex items-center justify-center border border-dashed border-[#2a2a2e]/20 rounded-xl hover:border-[#c5a880]/15 transition-colors group/slot">
                  <span className="text-[9px] font-bold text-[#2a2a2e] group-hover/slot:text-[#52525b] transition-colors uppercase tracking-wider">
                    + Boş Slot (Müsait)
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function BarberDashboard({
  appointments,
  currentDate,
  onCompleteAppointment,
  onCancelAppointment,
  isLoading = false,
}: BarberDashboardProps) {
  const [viewMode, setViewMode] = useState<"timeline" | "calendar">("timeline");
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const pending = appointments.filter(
    (a) => a.status === "Pending" || a.status === "Confirmed"
  );
  const completed = appointments.filter((a) => a.status === "Completed");
  const cancelled = appointments.filter((a) => a.status === "Cancelled");

  const sortedAppointments = appointments
    .slice()
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div className="max-w-5xl mx-auto space-y-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Background decoration blurs */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-[#c5a880]/[0.015] blur-[150px] pointer-events-none z-0" />

      {/* Header */}
      <div className="space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111113] border border-[#2a2a2e]/50 text-[#a1a1aa] text-xs font-bold shadow-md">
          <CalendarDays className="w-4 h-4 text-[#c5a880]" />
          <span>{formatFullDate(currentDate)}</span>
        </div>
        
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Günlük Program
          </h1>
          <p className="text-[#a1a1aa] text-sm font-semibold mt-1.5">
            Bugünkü randevularınızı yönetin ve durumlarını güncelleyin.
          </p>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
        {[
          { label: "Bekleyen İşlem", value: pending.length, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          { label: "Tamamlanan", value: completed.length, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "İptal Edilen", value: cancelled.length, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-[#111113]/85 backdrop-blur-md ${stat.border} border rounded-2xl p-6 text-center shadow-xl hover:translate-y-[-2px] transition-all duration-300`}
          >
            <p className={`text-4xl font-extrabold mb-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] font-extrabold text-[#a1a1aa] uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ─── Revenue Chart ─── */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#52525b] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#c5a880]" />
            Aylık Kazanç Grafiği
          </h2>
          <span className="text-xs font-bold text-[#c5a880]">
            Toplam: {MONTHLY_REVENUE.reduce((s, r) => s + r.value, 0).toLocaleString('tr-TR')} ₺
          </span>
        </div>
        <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-[#c5a880]/20 transition-all duration-300">
          <div className="flex items-end justify-between gap-3 h-44">
            {MONTHLY_REVENUE.map((rev, i) => {
              const heightPercent = (rev.value / MAX_REVENUE) * 100;
              return (
                <motion.div
                  key={rev.month}
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                  style={{ transformOrigin: 'bottom' }}
                >
                  <span className="text-[9px] font-extrabold text-[#c5a880]">
                    {(rev.value / 1000).toFixed(1)}K
                  </span>
                  <div
                    className="w-full rounded-xl bg-gradient-to-t from-[#c5a880]/20 to-[#c5a880]/5 border border-[#c5a880]/10 hover:from-[#c5a880]/30 hover:to-[#c5a880]/10 transition-all duration-300 relative group cursor-pointer"
                    style={{ height: `${heightPercent}%`, minHeight: '16px' }}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#c5a880]/15 to-transparent rounded-b-xl" />
                  </div>
                  <span className="text-[9px] font-bold text-[#52525b] uppercase tracking-wider">{rev.month}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Price Management ─── */}
      <div className="relative z-10 space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#52525b] flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#c5a880]" />
          Hizmet & Fiyat Yönetimi
        </h2>
        <div className="bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-[#c5a880]/20 transition-all duration-300">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center justify-between px-6 py-4 group hover:bg-[#c5a880]/[0.03] transition-colors ${i > 0 ? 'border-t border-[#2a2a2e]/20' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center shrink-0">
                  <Scissors className="w-3.5 h-3.5 text-[#c5a880]" />
                </div>
                <span className="text-xs font-bold text-white">{service.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <AnimatePresence mode="wait">
                  {editingServiceId === service.id ? (
                    <motion.div
                      key="editing"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-20 px-3 py-1.5 bg-[#09090b] border border-[#c5a880]/30 rounded-lg text-xs text-[#c5a880] font-bold text-right focus:outline-none"
                      />
                      <span className="text-xs text-[#52525b] font-bold">₺</span>
                      <button
                        onClick={() => {
                          setServices(prev => prev.map(s => s.id === service.id ? { ...s, price: editPrice } : s));
                          setEditingServiceId(null);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
                      >
                        <Save className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="display"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-sm font-extrabold text-[#c5a880]">{service.price} ₺</span>
                      <button
                        onClick={() => {
                          setEditingServiceId(service.id);
                          setEditPrice(service.price);
                        }}
                        className="p-1.5 rounded-lg bg-[#18181b] border border-white/5 text-[#52525b] hover:text-[#c5a880] hover:border-[#c5a880]/30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View Mode Toggle + Timeline/Calendar Section */}
      <div className="pt-8 border-t border-[#2a2a2e]/50 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-[#c5a880]" />
            </div>
            {viewMode === "timeline" ? "Zaman Çizelgesi" : "Takvim Görünümü"}
          </h2>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#111113] border border-white/5">
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                viewMode === "timeline"
                  ? "bg-[#c5a880] text-black"
                  : "text-[#a1a1aa] hover:text-white"
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              Liste
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-[#c5a880] text-black"
                  : "text-[#a1a1aa] hover:text-white"
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              Takvim
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-[#111113]/80 border border-[#2a2a2e]/30 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center py-20 space-y-4 bg-[#111113]/30 border border-white/5 rounded-3xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#18181b] border border-[#2a2a2e]/50 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-[#52525b]" />
            </div>
            <div>
              <p className="text-lg font-bold text-white tracking-tight">Bugün randevu yok</p>
              <p className="text-[#a1a1aa] text-xs font-semibold mt-1">Bugün için planlanmış bir randevunuz bulunmuyor.</p>
            </div>
          </div>
        ) : viewMode === "timeline" ? (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.08 } }
            }}
            className="space-y-2"
          >
            {sortedAppointments.map((appt) => (
              <TimelineCard
                key={appt.id}
                appointment={appt}
                onComplete={onCompleteAppointment}
                onCancel={onCancelAppointment}
              />
            ))}
          </motion.div>
        ) : (
          <div className="bg-[#111113]/60 border border-white/5 rounded-3xl p-6 overflow-hidden">
            <CalendarScheduler
              appointments={sortedAppointments}
              onComplete={onCompleteAppointment}
              onCancel={onCancelAppointment}
            />
          </div>
        )}
      </div>
    </div>
  );
}
