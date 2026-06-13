import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, Scissors, AlertCircle, History, X, RefreshCw, AlertTriangle } from "lucide-react";
import { IAppointment } from "../types/appointment";
import ReviewSystem from "./ReviewSystem";

interface AppointmentsPageProps {
  upcomingAppointments: IAppointment[];
  pastAppointments: IAppointment[];
  onCancelAppointment: (id: string) => void;
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    Pending:   { label: "Bekliyor",    className: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
    Confirmed: { label: "Onaylandı",  className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
    Completed: { label: "Tamamlandı", className: "bg-[#c5a880]/10 border-[#c5a880]/20 text-[#c5a880]" },
    Cancelled: { label: "İptal Edildi", className: "bg-red-500/10 border-red-500/20 text-red-400" },
  };
  const style = map[status] ?? { label: status, className: "bg-[#18181b] border-[#2a2a2e] text-[#a1a1aa]" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wide ${style.className}`}>
      {style.label}
    </span>
  );
}

// ─── Cancel Confirmation Modal ────────────────────────────────────────
function CancelModal({
  appointment,
  onConfirm,
  onDismiss,
}: {
  appointment: IAppointment;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      key="cancel-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
      onClick={onDismiss}
    >
      {/* Frosted backdrop */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />

      <motion.div
        key="cancel-modal-card"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md bg-[#111113]/98 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/60 p-8 overflow-hidden"
      >
        {/* Red glow at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-64 h-32 bg-red-500/8 blur-[60px] pointer-events-none" />

        {/* Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Randevu İptal Edilsin Mi?</h2>
          <p className="text-xs text-[#a1a1aa] font-medium mt-2 leading-relaxed max-w-xs">
            Bu işlem geri alınamaz. Randevunuz kalıcı olarak iptal edilecektir.
          </p>
        </div>

        {/* Appointment summary */}
        <div className="bg-[#09090b]/60 border border-white/5 rounded-2xl p-4 mb-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center shrink-0">
              <Scissors className="w-4 h-4 text-[#c5a880]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{appointment.barberShopName}</p>
              <p className="text-[10px] text-[#a1a1aa] font-medium">Premium Erkek Kuaförü</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
              <CalendarDays className="w-3.5 h-3.5 text-[#52525b] shrink-0" />
              <span>{formatDate(appointment.startTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
              <Clock className="w-3.5 h-3.5 text-[#52525b] shrink-0" />
              <span>{formatTime(appointment.startTime)}</span>
            </div>
          </div>
          <div className="pt-1">
            <span className="text-sm font-extrabold text-[#c5a880]">{appointment.price} ₺</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-extrabold text-sm transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4 stroke-[3]" />
            Evet, İptal Et
          </button>
          <button
            onClick={onDismiss}
            className="w-full py-3 rounded-xl bg-[#18181b] border border-white/5 hover:border-[#c5a880]/20 text-[#a1a1aa] hover:text-white font-bold text-sm transition-all duration-200"
          >
            Hayır, Geri Dön
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Appointment Card ─────────────────────────────────────────────────
function AppointmentCard({
  appointment,
  isUpcoming,
  onCancelRequest,
  onBookAgain,
  isExiting,
}: {
  appointment: IAppointment;
  isUpcoming: boolean;
  onCancelRequest: (appt: IAppointment) => void;
  onBookAgain: (barberShopId: string) => void;
  isExiting: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 1, scale: 1 }}
      animate={isExiting ? { opacity: 0, scale: 0.93, y: -12, filter: "blur(4px)" } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      transition={isExiting ? { duration: 0.42, ease: [0.4, 0, 0.6, 1] } : { duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 hover:border-[#c5a880]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#c5a880]/5 group"
    >
      {/* Column 1 & 2: Barber Details */}
      <div className="md:col-span-2 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
          <Scissors className="w-6 h-6 text-[#c5a880]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white tracking-tight truncate">{appointment.barberShopName}</h3>
          <p className="text-xs text-[#a1a1aa] mt-0.5">Premium Erkek Kuaförü</p>
        </div>
      </div>

      {/* Column 3: Date & Time */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-[#e4e4e7] font-semibold">
          <CalendarDays className="w-4 h-4 text-[#c5a880]" />
          <span>{formatDate(appointment.startTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#a1a1aa] font-medium">
          <Clock className="w-4 h-4 text-[#52525b]" />
          <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
        </div>
      </div>

      {/* Column 4: Price, Status, Action */}
      <div className="flex items-center justify-between md:justify-end gap-6 w-full">
        <div className="flex flex-col items-end">
          <StatusBadge status={appointment.status} />
          <span className="text-lg font-extrabold text-[#c5a880] mt-1.5">{appointment.price} ₺</span>
        </div>

        {isUpcoming && appointment.status !== "Cancelled" && (
          <button
            onClick={() => onCancelRequest(appointment)}
            className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold rounded-xl transition-all duration-300"
          >
            İptal Et
          </button>
        )}

        {!isUpcoming && appointment.status === "Completed" && (
          <button
            onClick={() => onBookAgain(appointment.barberShopId)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] hover:bg-gradient-to-r hover:from-[#c5a880] hover:to-[#e8d5b5] hover:text-black hover:border-transparent text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-[#c5a880]/20 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tekrar Randevu Al
          </button>
        )}
      </div>

      {/* Review System for Completed past appointments */}
      {!isUpcoming && appointment.status === "Completed" && (
        <div className="md:col-span-4">
          <ReviewSystem
            appointmentId={appointment.id}
            shopName={appointment.barberShopName}
            onSubmitReview={() => {}}
          />
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function AppointmentsPage({
  upcomingAppointments,
  pastAppointments,
  onCancelAppointment,
}: AppointmentsPageProps) {
  const navigate = useNavigate();
  const [pendingCancelAppt, setPendingCancelAppt] = useState<IAppointment | null>(null);
  const [exitingId, setExitingId] = useState<string | null>(null);

  const handleCancelRequest = (appt: IAppointment) => {
    setPendingCancelAppt(appt);
  };

  const handleConfirmCancel = () => {
    if (!pendingCancelAppt) return;
    setExitingId(pendingCancelAppt.id);
    setPendingCancelAppt(null);

    // Wait for exit animation before calling the parent
    setTimeout(() => {
      onCancelAppointment(pendingCancelAppt.id);
      setExitingId(null);
    }, 450);
  };

  const handleBookAgain = (barberShopId: string) => {
    navigate(`/book/${barberShopId}`);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Randevularım</h1>
        <p className="text-[#a1a1aa] text-base font-medium">Tüm yaklaşan ve geçmiş randevularınızı buradan yönetin.</p>
      </div>

      <div className="space-y-10">
        {/* ── Upcoming Appointments ── */}
        <div>
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            Yaklaşan Randevular
            <span className="bg-[#c5a880]/10 text-[#c5a880] border border-[#c5a880]/20 py-0.5 px-2.5 rounded-full text-xs font-extrabold">
              {upcomingAppointments.length}
            </span>
          </h2>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {upcomingAppointments.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    isUpcoming={true}
                    onCancelRequest={handleCancelRequest}
                    onBookAgain={handleBookAgain}
                    isExiting={exitingId === appt.id}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#111113]/80 border border-dashed border-[#2a2a2e] rounded-3xl">
              <CalendarDays className="w-12 h-12 text-[#52525b] mb-4" />
              <p className="text-[#a1a1aa] text-sm font-semibold">Yaklaşan randevunuz bulunmuyor.</p>
            </div>
          )}
        </div>

        {/* ── Past Appointments ── */}
        <div>
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            Geçmiş Randevular
            <span className="bg-[#52525b]/20 text-[#a1a1aa] border border-[#52525b]/20 py-0.5 px-2.5 rounded-full text-xs font-extrabold">
              {pastAppointments.length}
            </span>
          </h2>
          {pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  isUpcoming={false}
                  onCancelRequest={handleCancelRequest}
                  onBookAgain={handleBookAgain}
                  isExiting={false}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-[#111113]/80 border border-dashed border-[#2a2a2e] rounded-3xl">
              <History className="w-10 h-10 text-[#52525b] mb-3" />
              <p className="text-[#a1a1aa] text-xs font-semibold">Geçmiş randevu kaydınız yok.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Cancel Confirmation Modal ── */}
      <AnimatePresence>
        {pendingCancelAppt && (
          <CancelModal
            appointment={pendingCancelAppt}
            onConfirm={handleConfirmCancel}
            onDismiss={() => setPendingCancelAppt(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
