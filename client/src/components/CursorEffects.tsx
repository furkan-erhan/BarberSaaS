import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CursorEffects() {
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      setClicks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== id));
      }, 500);
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <AnimatePresence>
      {clicks.map((click) => (
        <motion.div
          key={click.id}
          initial={{ opacity: 0.8, scale: 0 }}
          animate={{ opacity: 0, scale: 3.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: "fixed",
            left: click.x,
            top: click.y,
            width: 16,
            height: 16,
            translateX: "-50%",
            translateY: "-50%",
            borderRadius: "50%",
            border: "1.5px solid #c5a880",
            boxShadow: "0 0 12px rgba(197, 168, 128, 0.4)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      ))}
    </AnimatePresence>
  );
}
