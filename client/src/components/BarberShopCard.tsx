import React from "react";
import { MapPin, Phone, Star, ArrowRight, Scissors } from "lucide-react";
import { IBarberShop } from "../types/barberShop";

// ─── Props ────────────────────────────────────────────────────────────
interface BarberShopCardProps {
  shop: IBarberShop;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  onBookClick: (shopId: string) => void;
  onSelectClick?: (shop: IBarberShop) => void;
}

// ─── Star rating display ──────────────────────────────────────────────
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={11}
          className={
            star <= Math.round(rating)
              ? "text-[#c5a880] fill-[#c5a880]"
              : "text-[#2a2a2e] fill-[#2a2a2e]"
          }
        />
      ))}
    </div>
  );
};

// ─── Placeholder image (gradient + scissors icon + stripes) ───────────
const PlaceholderImage: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#1c1917] via-[#09090b] to-[#1e1b18] relative overflow-hidden">
    {/* Diagonal striped background line accents */}
    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(45deg,#c5a880_25%,transparent_25%,transparent_50%,#c5a880_50%,#c5a880_75%,transparent_75%,transparent)] bg-[length:24px_24px] pointer-events-none" />
    
    {/* Decorative circle glow */}
    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#c5a880]/10 rounded-full blur-xl pointer-events-none" />
    
    <div className="w-12 h-12 rounded-2xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center shadow-lg relative group-hover:scale-105 transition-transform duration-500">
      <Scissors size={20} className="text-[#c5a880] rotate-45" />
    </div>
    
    <div className="text-center space-y-0.5">
      <span className="text-[#c5a880] text-[8px] tracking-[0.2em] font-extrabold uppercase block">SALON</span>
      <span className="text-[#f4f4f5] text-xs font-serif font-semibold italic">Luxury Grooming</span>
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────
const BarberShopCard: React.FC<BarberShopCardProps> = ({
  shop,
  imageUrl,
  rating = 4.8, // Fallback rating for premium presentation
  reviewCount = 120, // Fallback reviews
  onBookClick,
  onSelectClick,
}) => {
  const handleCardClick = () => {
    if (onSelectClick) {
      onSelectClick(shop);
    }
  };

  return (
    <article
      id={`barbershop-card-${shop.id}`}
      onClick={handleCardClick}
      className={`
        group relative flex flex-col
        bg-gradient-to-b from-[#18181b]/90 to-[#111113]/90 border border-white/5 rounded-3xl
        overflow-hidden h-full
        transition-all duration-300
        hover:border-[#c5a880]/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1
        ${onSelectClick ? "cursor-pointer" : ""}
      `}
    >
      {/* ── Cover image ── */}
      <div className="relative h-48 overflow-hidden bg-[#0d0d10] shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={shop.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage />
        )}

        {/* Rating badge (top-right) */}
        {rating !== undefined && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-[#c5a880] to-[#e8d5b5] text-black px-2.5 py-1 text-[10px] font-extrabold shadow-lg shadow-black/30">
            <Star size={10} className="fill-current stroke-[2.5]" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Gold shimmer bar at bottom of image */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(90deg, transparent, #c5a880, transparent)" }}
        />
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Shop name */}
        <h3 className="text-[#f4f4f5] text-lg font-bold tracking-tight mb-2 group-hover:text-[#c5a880] transition-colors duration-200">
          {shop.name}
        </h3>

        {/* Star rating (text form) */}
        {rating !== undefined && (
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={rating} />
            <span className="text-[#52525b] text-[10px] font-bold">({reviewCount} Yorum)</span>
          </div>
        )}

        {/* Info rows */}
        <div className="space-y-2 mb-5">
          {shop.address && (
            <div className="flex items-start gap-2">
              <MapPin size={13} className="text-[#52525b] shrink-0 mt-0.5" />
              <p className="text-[#a1a1aa] text-xs font-medium leading-normal">{shop.address}</p>
            </div>
          )}

          {shop.phoneNumber && (
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-[#52525b] shrink-0" />
              <p className="text-[#a1a1aa] text-xs font-medium">{shop.phoneNumber}</p>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Divider */}
        <div className="h-px bg-[#2a2a2e]/30 mb-4" />

        {/* Book button */}
        <button
          id={`book-btn-${shop.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onBookClick(shop.id);
          }}
          className="
            group/btn w-full flex items-center justify-center gap-2
            rounded-xl py-3 px-5 text-xs font-bold
            bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880]
            transition-all duration-300 cursor-pointer
            hover:bg-gradient-to-r hover:from-[#c5a880] hover:to-[#e8d5b5] hover:text-black hover:border-transparent
            hover:shadow-[0_6px_20px_rgba(197,168,128,0.2)]
          "
        >
          Randevu Al
          <ArrowRight
            size={13}
            className="transition-transform duration-300 group-hover/btn:translate-x-1 stroke-[2.5]"
          />
        </button>
      </div>
    </article>
  );
};

export default BarberShopCard;
