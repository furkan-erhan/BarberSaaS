import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────
interface ClickBurst {
  id: number;
  x: number;
  y: number;
}

// ─── Cursor Trail Component ───────────────────────────────────────────
export default function CursorEffects() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [clicks, setClicks] = useState<ClickBurst[]>([]);
  const idCounter = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  const handleClick = useCallback((e: MouseEvent) => {
    const id = ++idCounter.current;
    setClicks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setClicks((prev) => prev.filter((c) => c.id !== id));
    }, 600);
  }, []);

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [handleClick]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none" aria-hidden="true">
      {/* Outer glow ring follower */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 36,
          height: 36,
          border: "1.5px solid rgba(197, 168, 128, 0.15)",
          background: "radial-gradient(circle, rgba(197,168,128,0.04) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 22,
          mass: 0.4,
        }}
      />

      {/* Inner dot follower */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 5,
          height: 5,
          background: "rgba(197, 168, 128, 0.5)",
          boxShadow: "0 0 8px rgba(197,168,128,0.3)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 28,
          mass: 0.2,
        }}
      />

      {/* Click burst particles */}
      <AnimatePresence>
        {clicks.map((click) => (
          <ClickBurstEffect key={click.id} x={click.x} y={click.y} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Click Burst Ring + Particles ─────────────────────────────────────
function ClickBurstEffect({ x, y }: { x: number; y: number }) {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 8,
  }));

  return (
    <>
      {/* Expanding ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: x,
          top: y,
          transform: "translate(-50%, -50%)",
          border: "1.5px solid rgba(197, 168, 128, 0.4)",
        }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 60, height: 60, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* Tiny gold particles radiating outward */}
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const dist = 28;
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#c5a880]"
            style={{
              width: 3,
              height: 3,
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        );
      })}
    </>
  );
}
