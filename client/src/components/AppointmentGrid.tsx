import React from "react";
import { Clock } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
export interface TimeSlot {
  time: string;       // e.g. "10:00"
  isAvailable: boolean;
}

interface AppointmentGridProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  /** Optional label shown above the grid */
  label?: string;
}

// ─── Component ────────────────────────────────────────────────────────
const AppointmentGrid: React.FC<AppointmentGridProps> = ({
  slots,
  selectedTime,
  onSelectTime,
  label = "Saat Seçin",
}) => {
  const availableCount = slots.filter((s) => s.isAvailable).length;

  return (
    <section aria-label="Randevu saati seçimi">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-[#c5a880]" />
          <h3 className="text-[#f4f4f5] text-sm font-semibold tracking-wide">{label}</h3>
        </div>
        <span className="text-[10px] tracking-widest uppercase text-[#52525b]">
          {availableCount} müsait slot
        </span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-5">
        <LegendItem color="bg-[#c5a880]" textColor="text-[#09090b]" label="Seçili" />
        <LegendItem color="bg-[#18181b] border border-[#2a2a2e]" textColor="text-[#f4f4f5]" label="Müsait" />
        <LegendItem color="bg-[#111113] border border-[#1f1f23]" textColor="text-[#3f3f46]" label="Dolu" />
      </div>

      {/* Time grid */}
      {slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock size={28} className="text-[#2a2a2e] mb-3" />
          <p className="text-[#52525b] text-sm">Bu gün için müsait saat bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            const isDisabled = !slot.isAvailable;

            return (
              <button
                key={slot.time}
                id={`timeslot-${slot.time.replace(":", "")}`}
                onClick={() => !isDisabled && onSelectTime(slot.time)}
                disabled={isDisabled}
                aria-selected={isSelected}
                aria-label={`${slot.time} ${isDisabled ? "— dolu" : isSelected ? "— seçili" : "— müsait"}`}
                className={`
                  relative flex flex-col items-center justify-center
                  rounded-xl py-2.5 px-2 text-xs font-medium
                  border transition-all duration-200
                  ${isSelected
                    ? "bg-[#c5a880] border-[#c5a880] text-[#09090b] shadow-[0_4px_16px_rgba(197,168,128,0.3)] scale-[1.04]"
                    : isDisabled
                    ? "bg-[#111113] border-[#1a1a1d] text-[#2a2a2e] cursor-not-allowed"
                    : "bg-[#18181b] border-[#2a2a2e] text-[#a1a1aa] hover:border-[#c5a880]/50 hover:text-[#f4f4f5] hover:bg-[#1f1c14] hover:scale-[1.03] cursor-pointer"
                  }
                `}
              >
                {/* Subtle top accent line for selected */}
                {isSelected && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-b bg-[#09090b]/20" />
                )}

                <span className="text-sm font-semibold tabular-nums">{slot.time}</span>

                {/* Available / Booked micro-label */}
                <span
                  className={`mt-0.5 text-[9px] tracking-wide ${
                    isSelected
                      ? "text-[#09090b]/60"
                      : isDisabled
                      ? "text-[#2a2a2e]"
                      : "text-[#52525b]"
                  }`}
                >
                  {isDisabled ? "Dolu" : isSelected ? "Seçildi" : "Müsait"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected summary */}
      {selectedTime && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#c5a880]/20 bg-[#c5a880]/[0.06] px-4 py-3 animate-fade-in">
          <Clock size={14} className="text-[#c5a880] shrink-0" />
          <p className="text-sm text-[#f4f4f5]">
            Seçilen saat:{" "}
            <span className="font-semibold text-[#c5a880]">{selectedTime}</span>
          </p>
        </div>
      )}
    </section>
  );
};

// ─── Legend item ──────────────────────────────────────────────────────
const LegendItem: React.FC<{ color: string; textColor: string; label: string }> = ({
  color,
  textColor,
  label,
}) => (
  <div className="flex items-center gap-1.5">
    <span className={`w-3 h-3 rounded ${color} ${textColor} shrink-0`} />
    <span className="text-[10px] text-[#52525b] tracking-wide">{label}</span>
  </div>
);

export default AppointmentGrid;
