import { useState } from "react";
import { ArrowLeft, User, Clock, ChevronRight, CheckCircle2, Calendar, Sparkles, MapPin, Scissors } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IBarberShop } from "../types/barberShop";
import { IEmployee } from "../types/employee";

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface BookingFlowPageProps {
  shop: IBarberShop | null;
  employees: IEmployee[];
  slots: TimeSlot[];
  selectedEmployeeId: string | null;
  selectedDate: string;
  selectedTime: string | null;
  onSelectEmployee: (id: string) => void;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onSubmitBooking: () => void;
  onBackToShops: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

const STEP_LABELS = ["Berber Seçimi", "Tarih & Saat", "Onay"];

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StepIndicator({ current }: { current: number }) {
  // Clamp current step labels to 2 max for indexing indicator
  const clampedCurrent = Math.min(current, 2);
  
  return (
    <div className="flex items-center justify-between mb-12 relative">
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#2a2a2e]/50 -translate-y-1/2 z-0 rounded-full" />
      <motion.div
        className="absolute top-1/2 left-0 h-[2px] bg-[#c5a880] -translate-y-1/2 z-0 rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${(clampedCurrent / (STEP_LABELS.length - 1)) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      {STEP_LABELS.map((label, i) => {
        const isCompleted = i < clampedCurrent;
        const isCurrent = i === clampedCurrent;
        return (
          <div key={label} className="relative z-10 flex flex-col items-center gap-3">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: isCompleted || isCurrent ? "#c5a880" : "#18181b",
                borderColor: isCompleted || isCurrent ? "#c5a880" : "#2a2a2e",
                scale: isCurrent ? 1.15 : 1,
              }}
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-xl transition-colors duration-300"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-black stroke-[3]" />
              ) : (
                <span className={`text-xs font-extrabold ${isCurrent ? "text-black" : "text-[#52525b]"}`}>{i + 1}</span>
              )}
            </motion.div>
            <span className={`text-[10px] font-extrabold uppercase tracking-wider absolute top-12 whitespace-nowrap ${isCurrent ? "text-[#c5a880]" : isCompleted ? "text-white" : "text-[#52525b]"}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Golden Particle Explosion Component ───
const ParticleExplosion = () => {
  const particles = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    angle: (i * 360) / 24 + Math.random() * 15,
    distance: Math.random() * 100 + 80,
    size: Math.random() * 6 + 4,
    delay: Math.random() * 0.2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
      {particles.map((p) => {
        const radian = (p.angle * Math.PI) / 180;
        const targetX = Math.cos(radian) * p.distance;
        const targetY = Math.sin(radian) * p.distance;

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-r from-[#c5a880] to-[#e8d5b5]"
            style={{ width: p.size, height: p.size }}
            initial={{ opacity: 1, scale: 0.1, x: 0, y: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0.1, 1.5, 0],
              x: targetX,
              y: targetY,
            }}
            transition={{
              duration: 1.2,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
};

export default function BookingFlowPage({
  shop,
  employees,
  slots,
  selectedEmployeeId,
  selectedDate,
  selectedTime,
  onSelectEmployee,
  onSelectDate,
  onSelectTime,
  onSubmitBooking,
  onBackToShops,
  isLoading = false,
  isSubmitting = false,
}: BookingFlowPageProps) {
  const [successStep, setSuccessStep] = useState(false);
  const currentStep = successStep ? 3 : !selectedEmployeeId ? 0 : !selectedTime ? 1 : 2;

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      isoDate: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("tr-TR", { weekday: "short" }),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString("tr-TR", { month: "short" }),
      isToday: i === 0,
    };
  });

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  const handleConfirmBooking = async () => {
    // Show local success flow first, then navigate
    setSuccessStep(true);
  };

  const handleFinish = () => {
    onSubmitBooking();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Background decoration blurs */}
      <div className="absolute top-[20%] right-[-15%] w-[450px] h-[450px] rounded-full bg-[#c5a880]/[0.015] blur-[150px] pointer-events-none z-0" />

      {/* Back + Header */}
      {!successStep && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 relative z-10"
        >
          <button
            onClick={onBackToShops}
            className="flex items-center gap-2 text-[#a1a1aa] hover:text-[#c5a880] font-bold text-xs transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Dükkanlara Geri Dön
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                {shop?.name ?? "Randevu Al"}
              </h1>
              <p className="text-[#a1a1aa] mt-2 text-sm font-semibold">
                Adımları takip ederek randevunuzu oluşturun.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-[#c5a880]/15 text-[#c5a880] px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider border border-[#c5a880]/20 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Seçim</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step Indicator */}
      {!successStep && (
        <div className="py-4 relative z-10">
          <StepIndicator current={currentStep} />
        </div>
      )}

      <div>
        {/* ── Step 0: Employee Selection ── */}
        {currentStep === 0 && (
          <div
            className="animate-fade-in bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center">
                <User className="w-5 h-5 text-[#c5a880]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Berber Seçin</h2>
                <p className="text-[#a1a1aa] text-xs font-semibold">Hizmet almak istediğiniz uzmanı belirleyin</p>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-[#1f1f23]/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {employees.map((emp) => {
                  const isSelected = selectedEmployeeId === emp.id;
                  return (
                    <button
                      key={emp.id}
                      onClick={() => onSelectEmployee(emp.id)}
                      className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-[#c5a880]/10 border-[#c5a880] shadow-xl shadow-[#c5a880]/10 ring-1 ring-[#c5a880]"
                          : "bg-[#18181b] border-white/5 hover:border-[#c5a880]/50 hover:bg-[#1f1f23]/60"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0 border transition-colors ${
                          isSelected
                            ? "bg-gradient-to-br from-[#c5a880] to-[#e8d5b5] border-transparent text-black"
                            : "bg-[#2a2a2e]/50 border-white/5 text-[#a1a1aa]"
                        }`}
                      >
                        {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-base truncate transition-colors ${isSelected ? "text-[#c5a880]" : "text-white"}`}>
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-[10px] text-[#52525b] font-extrabold uppercase mt-0.5 tracking-wider">Uzman Berber</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-[#c5a880] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Date & Time Selection ── */}
        {currentStep === 1 && (
          <div
            className="animate-fade-in bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10 relative z-10"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#c5a880]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Tarih & Saat</h2>
                  <p className="text-[#a1a1aa] text-xs font-semibold">
                    {selectedEmployee?.firstName} ile randevunuz için uygun zamanı seçin
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onSelectEmployee("")} 
                className="text-[10px] font-extrabold uppercase tracking-wide text-[#c5a880] hover:underline"
              >
                Berberi Değiştir
              </button>
            </div>

            {/* Date Row */}
            <div>
              <p className="text-[10px] font-extrabold text-[#52525b] uppercase tracking-widest mb-4">Tarih Seçin</p>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {dates.map((d) => {
                  const isSelected = selectedDate === d.isoDate;
                  return (
                    <button
                      key={d.isoDate}
                      onClick={() => onSelectDate(d.isoDate)}
                      className={`flex-shrink-0 flex flex-col items-center py-4 px-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] border-transparent text-black shadow-lg shadow-[#c5a880]/20 scale-[1.03]"
                          : "bg-[#18181b] border-white/5 text-[#a1a1aa] hover:border-[#c5a880]/50 hover:bg-[#1f1f23]/60"
                      }`}
                    >
                      <span className={`text-[9px] font-bold uppercase mb-1 ${isSelected ? "text-black/70" : "text-[#52525b]"}`}>
                        {d.dayName}
                      </span>
                      <span className={`text-2xl font-extrabold mb-1 ${isSelected ? "text-black" : "text-white"}`}>
                        {d.dayNum}
                      </span>
                      <span className={`text-[9px] font-bold ${isSelected ? "text-black/70" : "text-[#52525b]"}`}>
                        {d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <p className="text-[10px] font-extrabold text-[#52525b] uppercase tracking-widest mb-4">Saat Seçin</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {slots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      onClick={() => slot.isAvailable && onSelectTime(slot.time)}
                      disabled={!slot.isAvailable}
                      className={`py-3.5 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                        !slot.isAvailable
                          ? "bg-[#111113] border-transparent text-[#2a2a2e] cursor-not-allowed"
                          : isSelected
                            ? "bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] border-transparent text-black shadow-lg shadow-[#c5a880]/25 scale-[1.03]"
                            : "bg-[#18181b] border-white/5 text-[#e4e4e7] hover:border-[#c5a880]/50 hover:bg-[#1f1f23]/60"
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Confirmation ── */}
        {currentStep === 2 && (
          <div
            className="animate-fade-in bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-xl mx-auto relative z-10"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/25 flex items-center justify-center mb-5">
                <Clock className="w-8 h-8 text-[#c5a880]" />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Randevu Özeti</h2>
              <p className="text-[#a1a1aa] mt-1 text-xs font-semibold">Lütfen bilgilerinizi kontrol edip onaylayın</p>
            </div>

            <div className="bg-[#111113]/90 border border-white/5 rounded-2xl p-5 sm:p-6 space-y-3 mb-8">
              {[
                { label: "Dükkan", value: shop?.name ?? "—" },
                {
                  label: "Berber",
                  value: selectedEmployee
                    ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                    : "—",
                },
                { label: "Tarih", value: selectedDate ? formatDate(selectedDate) : "—" },
                { label: "Saat", value: selectedTime || "—" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-[#2a2a2e]/30 last:border-0 last:pb-0 gap-4">
                  <span className="text-[10px] font-bold text-[#52525b] uppercase tracking-wider">{row.label}</span>
                  <span className="text-sm font-bold text-white text-right truncate">{row.value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] hover:from-[#d5b890] hover:to-[#f8e5c5] text-black font-extrabold text-sm rounded-2xl transition-all duration-300 shadow-xl shadow-[#c5a880]/20 hover:scale-[1.02] cursor-pointer"
            >
              {isSubmitting ? (
                <span className="inline-block w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Randevuyu Onayla
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
            
            <button 
              onClick={() => onSelectTime("")} 
              className="w-full mt-4 text-[10px] font-extrabold uppercase tracking-wide text-[#a1a1aa] hover:text-white transition-colors py-2 cursor-pointer"
            >
              Geri Dön ve Düzenle
            </button>
          </div>
        )}

        {/* ── Step 3: Booking Success ── */}
        {currentStep === 3 && (
          <div
            className="animate-fade-in bg-gradient-to-b from-[#18181b]/80 to-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-md mx-auto text-center relative z-10 overflow-hidden"
          >
            {/* Particle explosion effect */}
            <ParticleExplosion />

            <div className="flex flex-col items-center mb-8 relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-400 stroke-[2.5]" />
              </motion.div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Rezervasyon Başarılı!</h2>
              <p className="text-[#a1a1aa] mt-2 text-sm font-semibold max-w-xs mx-auto">Randevunuz onaylandı. Detaylar aşağıdadır.</p>
            </div>

            {/* Premium success ticket display */}
            <div className="relative bg-[#111113]/90 border border-white/5 rounded-2xl p-6 text-left space-y-4 mb-10 z-10">
              {/* Notches for stubs */}
              <div className="absolute left-[-8px] top-[45%] w-4 h-4 rounded-full bg-[#0a0a0b] border-r border-white/5" />
              <div className="absolute right-[-8px] top-[45%] w-4 h-4 rounded-full bg-[#0a0a0b] border-l border-white/5" />
              
              <div>
                <span className="text-[8px] font-extrabold text-[#c5a880] tracking-widest uppercase">REZERVASYON BELGESİ</span>
                <h4 className="text-lg font-bold text-white mt-1">{shop?.name}</h4>
              </div>
              
              <div className="border-t border-dashed border-[#2a2a2e]/60 my-2" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[8px] text-[#52525b] font-bold uppercase tracking-wider">BERBER</span>
                  <p className="text-xs font-bold text-white">{selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : "—"}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] text-[#52525b] font-bold uppercase tracking-wider">ÜCRET</span>
                  <p className="text-xs font-bold text-[#c5a880]">150 ₺</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] text-[#52525b] font-bold uppercase tracking-wider">TARİH</span>
                  <p className="text-xs font-bold text-white">{selectedDate ? formatDate(selectedDate) : "—"}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] text-[#52525b] font-bold uppercase tracking-wider">SAAT</span>
                  <p className="text-xs font-bold text-white">{selectedTime}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] hover:from-[#d5b890] hover:to-[#f8e5c5] text-black font-extrabold text-sm rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-[#c5a880]/15 relative z-10 cursor-pointer"
            >
              Ana Sayfaya Git
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
