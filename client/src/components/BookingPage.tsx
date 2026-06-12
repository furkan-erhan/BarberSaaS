import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, User2, CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import AppointmentGrid, { TimeSlot } from "./AppointmentGrid";
import { IEmployee } from "../types/employee";
import { getBarbersByShops, createAppointment } from "../services/api";

// ── Helpers ──────────────────────────────────────────────────────────
const generateSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let h = 9; h <= 18; h++) {
    for (const m of [0, 40]) {
      if (h === 18 && m === 40) break;
      const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      slots.push({ time, isAvailable: Math.random() > 0.35 });
    }
  }
  return slots;
};

// ─── Component ────────────────────────────────────────────────────────
const BookingPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate   = useNavigate();

  const [employees, setEmployees]       = useState<IEmployee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [slots]                         = useState<TimeSlot[]>(generateSlots);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoadingBarbers, setIsLoadingBarbers] = useState(true);
  const [isBooking, setIsBooking]       = useState(false);
  const [booked, setBooked]             = useState(false);

  useEffect(() => {
    if (!shopId) return;
    getBarbersByShops(shopId)
      .then((r) => setEmployees(r.data))
      .catch(() => setEmployees([]))
      .finally(() => setIsLoadingBarbers(false));
  }, [shopId]);

  const handleBook = async () => {
    if (!shopId || !selectedEmployee || !selectedTime) return;
    setIsBooking(true);
    try {
      const startTime = `${selectedDate}T${selectedTime}:00`;
      await createAppointment({ barberShopId: shopId, employeeId: selectedEmployee, startTime });
      setBooked(true);
    } catch {
      // error handling would be added by the consumer
    } finally {
      setIsBooking(false);
    }
  };

  // ── Success screen ──
  if (booked) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="w-20 h-20 rounded-full bg-[#c5a880]/[0.12] border border-[#c5a880]/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-[#c5a880]" />
          </div>
          <h2 className="font-serif text-[#f4f4f5] text-2xl font-semibold mb-2">Randevunuz Alındı!</h2>
          <p className="text-[#52525b] text-sm mb-8">
            {selectedDate} tarihli <span className="text-[#c5a880]">{selectedTime}</span> saatindeki randevunuz başarıyla oluşturuldu.
          </p>
          <button
            onClick={() => navigate("/my-appointments")}
            className="
              rounded-xl bg-[#c5a880] text-[#09090b] px-8 py-3 text-sm font-semibold
              hover:bg-[#d4a96a] transition-all duration-200 hover:scale-[1.02]
            "
          >
            Randevularımı Gör
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Back button ── */}
      <button
        id="booking-back"
        onClick={() => navigate("/shops")}
        className="flex items-center gap-1.5 text-sm text-[#52525b] hover:text-[#c5a880] transition-colors duration-200 mb-6"
      >
        <ChevronLeft size={16} />
        Dükkanlar
      </button>

      <div className="mb-8 animate-fade-in">
        <p className="text-[#c5a880] text-xs tracking-[0.2em] uppercase font-medium mb-1">Randevu</p>
        <h1 className="font-serif text-[#f4f4f5] text-3xl font-semibold">Randevu Al</h1>
      </div>

      <div className="max-w-2xl space-y-8">

        {/* ── Step 1: Barber select ── */}
        <section className="rounded-2xl bg-[#111113] border border-[#1f1f23] p-6 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <SectionHeading icon={<User2 size={15} className="text-[#c5a880]" />} title="Berber Seçin" step={1} />

          {isLoadingBarbers ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 size={16} className="text-[#c5a880] animate-spin" />
              <span className="text-[#52525b] text-sm">Berberler yükleniyor…</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {employees.length === 0 ? (
                <p className="text-[#52525b] text-sm col-span-2">Bu dükkan için berber bulunamadı.</p>
              ) : (
                employees.map((emp) => (
                  <button
                    key={emp.id}
                    id={`select-barber-${emp.id}`}
                    onClick={() => setSelectedEmployee(emp.id)}
                    className={`
                      flex items-center gap-3 rounded-xl border p-3.5 text-left
                      transition-all duration-200
                      ${selectedEmployee === emp.id
                        ? "border-[#c5a880]/50 bg-[#c5a880]/[0.08] text-[#c5a880]"
                        : "border-[#2a2a2e] bg-[#18181b] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-[#f4f4f5]"
                      }
                    `}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#c5a880]/[0.15] border border-[#c5a880]/20 flex items-center justify-center shrink-0">
                      <span className="text-[#c5a880] text-xs font-bold">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{emp.firstName} {emp.lastName}</p>
                      <p className="text-[10px] text-[#52525b] mt-0.5">Berber</p>
                    </div>
                    {selectedEmployee === emp.id && (
                      <CheckCircle2 size={16} className="ml-auto text-[#c5a880]" />
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </section>

        {/* ── Step 2: Date select ── */}
        <section className="rounded-2xl bg-[#111113] border border-[#1f1f23] p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <SectionHeading icon={<CalendarDays size={15} className="text-[#c5a880]" />} title="Tarih Seçin" step={2} />
          <input
            id="booking-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="
              mt-4 w-full sm:w-auto bg-[#18181b] border border-[#2a2a2e] rounded-xl
              px-4 py-3 text-sm text-[#f4f4f5]
              focus:outline-none focus:border-[#c5a880]/50
              transition-all duration-200
              [color-scheme:dark]
            "
          />
        </section>

        {/* ── Step 3: Time slot grid ── */}
        <section className="rounded-2xl bg-[#111113] border border-[#1f1f23] p-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <SectionHeading icon={null} title="" step={3} />
          <AppointmentGrid
            slots={slots}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            label="Saat Seçin"
          />
        </section>

        {/* ── Confirm button ── */}
        <button
          id="booking-confirm"
          onClick={handleBook}
          disabled={!selectedEmployee || !selectedTime || isBooking}
          className="
            w-full flex items-center justify-center gap-2
            rounded-2xl py-4 px-6 text-sm font-semibold
            bg-[#c5a880] text-[#09090b]
            transition-all duration-200
            hover:bg-[#d4a96a] hover:scale-[1.01] hover:shadow-[0_8px_32px_rgba(197,168,128,0.25)]
            active:scale-[0.99]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            animate-fade-in
          "
          style={{ animationDelay: "0.2s" }}
        >
          {isBooking ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Randevuyu Onayla"
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Section heading helper ───────────────────────────────────────────
const SectionHeading: React.FC<{
  icon: React.ReactNode;
  title: string;
  step: number;
}> = ({ icon, title, step }) => (
  <div className="flex items-center gap-3">
    <span className="w-6 h-6 rounded-full bg-[#c5a880]/[0.15] border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] text-[11px] font-bold shrink-0">
      {step}
    </span>
    {icon}
    {title && <h2 className="text-[#f4f4f5] text-sm font-semibold">{title}</h2>}
  </div>
);

export default BookingPage;
