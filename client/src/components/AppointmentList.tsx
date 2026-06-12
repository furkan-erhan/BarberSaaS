import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, Store, Trash2, Plus, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { IAppointment } from "../types/appointment";
import { getAppointments, deleteAppointment } from "../services/api";

// ─── Status badge ─────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; icon: React.ReactNode; classes: string }> = {
    Confirmed:  { label: "Onaylı",    icon: <CheckCircle2 size={11} />, classes: "text-emerald-400 bg-emerald-400/[0.08] border-emerald-400/20" },
    Pending:    { label: "Beklemede", icon: <AlertCircle size={11} />,  classes: "text-amber-400   bg-amber-400/[0.08]   border-amber-400/20"   },
    Cancelled:  { label: "İptal",     icon: <XCircle size={11} />,      classes: "text-red-400     bg-red-400/[0.08]     border-red-400/20"     },
  };
  const cfg = map[status] ?? { label: status, icon: null, classes: "text-[#a1a1aa] bg-[#18181b] border-[#2a2a2e]" };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${cfg.classes}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

// ─── Single appointment card ──────────────────────────────────────────
const AppointmentCard: React.FC<{
  appointment: IAppointment;
  onDelete: (id: string) => void;
}> = ({ appointment, onDelete }) => {
  const startDate = new Date(appointment.startTime);
  const endDate   = new Date(appointment.endTime);

  const dateStr = startDate.toLocaleDateString("tr-TR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const timeStr = `${startDate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })} – ${endDate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <article
      id={`appointment-${appointment.id}`}
      className="
        group flex flex-col sm:flex-row sm:items-center gap-4
        rounded-2xl bg-[#111113] border border-[#1f1f23] p-5
        transition-all duration-200 hover:border-[#c5a880]/20 hover:bg-[#13120e]
      "
    >
      {/* Date column */}
      <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-[#18181b] border border-[#2a2a2e] shrink-0">
        <span className="text-[#c5a880] text-xl font-bold leading-none">
          {startDate.getDate()}
        </span>
        <span className="text-[#52525b] text-[10px] tracking-widest uppercase mt-0.5">
          {startDate.toLocaleDateString("tr-TR", { month: "short" })}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[#f4f4f5] text-sm font-semibold font-serif leading-snug truncate">
            {appointment.barberShopName}
          </h3>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#52525b]">
          <span className="flex items-center gap-1">
            <CalendarDays size={11} className="text-[#3f3f46]" />
            {dateStr}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-[#3f3f46]" />
            {timeStr}
          </span>
          {appointment.price !== null && (
            <span className="text-[#c5a880] font-medium">₺{appointment.price}</span>
          )}
        </div>
      </div>

      {/* Delete */}
      {appointment.status !== "Cancelled" && (
        <button
          id={`delete-appointment-${appointment.id}`}
          onClick={() => onDelete(appointment.id)}
          className="
            flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-2 text-xs
            text-[#52525b] hover:border-[#ef4444]/30 hover:bg-[#ef4444]/[0.06] hover:text-[#ef4444]
            transition-all duration-200 shrink-0
          "
        >
          <Trash2 size={13} />
          <span className="hidden sm:inline">İptal Et</span>
        </button>
      )}
    </article>
  );
};

// ─── Page component ───────────────────────────────────────────────────
const AppointmentList: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    getAppointments()
      .then((r) => setAppointments(r.data))
      .catch(() => setError("Randevular yüklenirken bir hata oluştu."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // error handling for consumer
    }
  };

  const upcoming = appointments.filter((a) => new Date(a.startTime) >= new Date());
  const past     = appointments.filter((a) => new Date(a.startTime) <  new Date());

  return (
    <div className="min-h-screen bg-[#09090b] px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between animate-fade-in">
        <div>
          <p className="text-[#c5a880] text-xs tracking-[0.2em] uppercase font-medium mb-1">Takvim</p>
          <h1 className="font-serif text-[#f4f4f5] text-3xl font-semibold">Randevularım</h1>
          <p className="text-[#52525b] text-sm mt-1">{upcoming.length} yaklaşan randevu</p>
        </div>
        <button
          id="new-appointment-btn"
          onClick={() => navigate("/shops")}
          className="
            flex items-center gap-2 rounded-xl bg-[#c5a880] text-[#09090b] px-4 py-2.5 text-sm font-semibold
            hover:bg-[#d4a96a] hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(197,168,128,0.2)]
            transition-all duration-200
          "
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Randevu Al</span>
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 size={28} className="text-[#c5a880] animate-spin" />
          <p className="text-[#52525b] text-sm">Randevular yükleniyor…</p>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <CalendarDays size={36} className="text-[#2a2a2e]" />
          <p className="text-[#52525b] text-sm">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && appointments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[#18181b] border border-[#2a2a2e] flex items-center justify-center">
            <Store size={30} className="text-[#3f3f46]" />
          </div>
          <div>
            <p className="text-[#f4f4f5] text-sm font-semibold">Henüz randevunuz yok</p>
            <p className="text-[#52525b] text-xs mt-1">Bir berber dükkanı seçerek ilk randevunuzu alın.</p>
          </div>
          <button
            onClick={() => navigate("/shops")}
            className="
              mt-2 rounded-xl bg-[#c5a880] text-[#09090b] px-6 py-2.5 text-sm font-semibold
              hover:bg-[#d4a96a] transition-all duration-200 hover:scale-[1.02]
            "
          >
            Dükkanları Keşfet
          </button>
        </div>
      )}

      {/* Upcoming */}
      {!isLoading && !error && upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs tracking-[0.15em] uppercase text-[#52525b] font-medium mb-4">
            Yaklaşan
          </h2>
          <div className="space-y-3">
            {upcoming.map((a, i) => (
              <div key={a.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                <AppointmentCard appointment={a} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {!isLoading && !error && past.length > 0 && (
        <section>
          <h2 className="text-xs tracking-[0.15em] uppercase text-[#52525b] font-medium mb-4">
            Geçmiş
          </h2>
          <div className="space-y-3 opacity-60">
            {past.map((a, i) => (
              <div key={a.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                <AppointmentCard appointment={a} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AppointmentList;
