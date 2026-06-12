import { CalendarDays, Clock, Scissors, AlertCircle, History } from "lucide-react";
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
    Pending: { label: "Bekliyor", className: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
    Confirmed: { label: "Onaylandı", className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
    Completed: { label: "Tamamlandı", className: "bg-[#c5a880]/10 border-[#c5a880]/20 text-[#c5a880]" },
    Cancelled: { label: "İptal Edildi", className: "bg-red-500/10 border-red-500/20 text-red-400" },
  };
  const style = map[status] ?? { label: status, className: "bg-[#18181b] border-[#2a2a2e] text-[#a1a1aa]" };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wide ${style.className}`}
    >
      {style.label}
    </span>
  );
}

function AppointmentCard({
  appointment,
  isUpcoming,
  onCancel,
}: {
  appointment: IAppointment;
  isUpcoming: boolean;
  onCancel: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 hover:border-[#c5a880]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#c5a880]/5 group">
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

      {/* Column 4: Price, Status, & Action */}
      <div className="flex items-center justify-between md:justify-end gap-6 w-full">
        <div className="flex flex-col items-end">
          <StatusBadge status={appointment.status} />
          <span className="text-lg font-extrabold text-[#c5a880] mt-1.5">{appointment.price} ₺</span>
        </div>
        {isUpcoming && appointment.status !== "Cancelled" && (
          <button
            onClick={() => onCancel(appointment.id)}
            className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer"
          >
            İptal Et
          </button>
        )}
      </div>

      {/* Review System for Completed Appointments */}
      {!isUpcoming && appointment.status === "Completed" && (
        <div className="md:col-span-4">
          <ReviewSystem
            appointmentId={appointment.id}
            shopName={appointment.barberShopName}
            onSubmitReview={() => {}}
          />
        </div>
      )}
    </div>
  );
}

export default function AppointmentsPage({
  upcomingAppointments,
  pastAppointments,
  onCancelAppointment,
}: AppointmentsPageProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Randevularım
        </h1>
        <p className="text-[#a1a1aa] text-base font-medium">Tüm yaklaşan ve geçmiş randevularınızı buradan yönetin.</p>
      </div>

      <div className="space-y-10">
        {/* Upcoming */}
        <div>
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            Yaklaşan Randevular
            <span className="bg-[#c5a880]/10 text-[#c5a880] border border-[#c5a880]/20 py-0.5 px-2.5 rounded-full text-xs font-extrabold">
              {upcomingAppointments.length}
            </span>
          </h2>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  isUpcoming={true}
                  onCancel={onCancelAppointment}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#111113]/80 border border-dashed border-[#2a2a2e] rounded-3xl">
              <CalendarDays className="w-12 h-12 text-[#52525b] mb-4" />
              <p className="text-[#a1a1aa] text-sm font-semibold">Yaklaşan randevunuz bulunmuyor.</p>
            </div>
          )}
        </div>

        {/* Past */}
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
                  onCancel={onCancelAppointment}
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
    </div>
  );
}
