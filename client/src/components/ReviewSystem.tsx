import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, Check, Sparkles } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
interface ReviewSystemProps {
  appointmentId: string;
  shopName: string;
  onSubmitReview?: (appointmentId: string, rating: number, comment: string) => void;
}

// ─── Main Component ───────────────────────────────────────────────────
export default function ReviewSystem({ appointmentId, shopName, onSubmitReview }: ReviewSystemProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    setIsSubmitted(true);
    onSubmitReview?.(appointmentId, rating, comment);
  };

  const displayRating = hoverRating || rating;

  const ratingLabels: Record<number, string> = {
    1: "Kötü",
    2: "Vasat",
    3: "İdare Eder",
    4: "İyi",
    5: "Mükemmel",
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#2a2a2e]/30">
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-400">Değerlendirmeniz Gönderildi!</p>
              <p className="text-[9px] text-[#a1a1aa] font-semibold mt-0.5">
                {shopName} için {rating} yıldız değerlendirmeniz kaydedildi.
              </p>
            </div>
          </motion.div>
        ) : !isExpanded ? (
          <motion.button
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 text-[10px] font-extrabold text-[#c5a880] hover:text-[#e8d5b5] transition-colors cursor-pointer group"
          >
            <Sparkles className="w-3 h-3 group-hover:scale-110 transition-transform" />
            Bu deneyimi değerlendir
          </motion.button>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Stars */}
            <div className="space-y-2">
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#52525b]">Puanınız</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="cursor-pointer p-0.5 transition-colors"
                    >
                      <Star
                        size={20}
                        className={`transition-colors duration-150 ${
                          star <= displayRating
                            ? "text-[#c5a880] fill-[#c5a880] drop-shadow-[0_0_4px_rgba(197,168,128,0.4)]"
                            : "text-[#2a2a2e] fill-[#2a2a2e]"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                {displayRating > 0 && (
                  <motion.span
                    key={displayRating}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-[#c5a880]"
                  >
                    {ratingLabels[displayRating]}
                  </motion.span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Deneyiminizi paylaşın (opsiyonel)..."
                rows={2}
                className="w-full px-4 py-3 bg-[#09090b] border border-white/5 rounded-xl text-xs text-white placeholder-[#3f3f46] focus:border-[#c5a880]/30 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="px-3 py-2 text-[10px] font-bold text-[#52525b] hover:text-[#a1a1aa] transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#c5a880]/10 border border-[#c5a880]/20 rounded-xl text-[10px] font-extrabold text-[#c5a880] hover:bg-[#c5a880] hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-3 h-3" />
                Gönder
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
