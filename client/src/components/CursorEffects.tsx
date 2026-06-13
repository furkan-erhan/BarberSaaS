import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

// ─── Particle for canvas stardust trail ──────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;       // 0..1
  decay: number;
  size: number;
  hue: number;        // slight colour variation around gold
}

// ─── Canvas Stardust Trail ────────────────────────────────────────────
function useCursorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const lastPos = useRef({ x: -200, y: -200 });

  const spawnParticles = useCallback((x: number, y: number) => {
    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    const speed = Math.hypot(dx, dy);

    // Only spawn if the cursor is moving
    if (speed < 2) return;

    const count = Math.min(Math.floor(speed * 0.4), 6);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const mag = Math.random() * 1.2 + 0.2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * mag + dx * 0.08,
        vy: Math.sin(angle) * mag + dy * 0.08,
        life: 1,
        decay: 0.04 + Math.random() * 0.04,
        size: Math.random() * 2.5 + 0.8,
        hue: Math.random() * 20 - 10, // ±10 deg from gold ~43°
      });
    }
    lastPos.current = { x, y };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.93;   // friction
        p.vy *= 0.93;
        p.life -= p.decay;

        const alpha = Math.max(0, p.life);
        // Gold hue: ~43 deg in HSL
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${43 + p.hue}, 70%, 65%, ${alpha * 0.75})`;
        ctx.fill();

        // tiny glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${43 + p.hue}, 80%, 70%, ${alpha * 0.08})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return { canvasRef, spawnParticles };
}

// ─── Main Component ───────────────────────────────────────────────────
export default function CursorEffects() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Raw motion values for instant inner dot tracking
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  // Outer ring follows with a slight lag (spring)
  const ringX = useSpring(rawX, { stiffness: 130, damping: 22, mass: 0.5 });
  const ringY = useSpring(rawY, { stiffness: 130, damping: 22, mass: 0.5 });

  const { canvasRef, spawnParticles } = useCursorCanvas();

  useEffect(() => {
    const HOVER_SELECTORS = "a, button, select, input, textarea, label, [role='button'], .cursor-pointer, [tabindex]";

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
      spawnParticles(e.clientX, e.clientY);

      // Detect hovering over interactive elements
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setIsHovering(!!el?.closest(HOVER_SELECTORS));
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
  }, [isVisible, rawX, rawY, spawnParticles]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const dotScale = isHovering ? 0 : 1;
  const ringScale = isHovering ? 1.7 : 1;
  const ringOpacity = isVisible ? (isHovering ? 0.85 : 0.5) : 0;
  const dotOpacity = isVisible ? (isHovering ? 0 : 1) : 0;

  return (
    <>
      {/* Canvas stardust trail — below everything but above bg */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9995]"
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-[9998] pointer-events-none" aria-hidden="true">
        {/* ── Outer luxury ring (slow spring follower) ── */}
        <motion.div
          style={{
            x: ringX,
            y: ringY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            width: isHovering ? 48 : 32,
            height: isHovering ? 48 : 32,
            opacity: ringOpacity,
            background: isHovering
              ? "radial-gradient(circle, rgba(197,168,128,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(197,168,128,0.04) 0%, transparent 70%)",
            borderColor: isHovering
              ? "rgba(197,168,128,0.7)"
              : "rgba(197,168,128,0.25)",
            scale: ringScale,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute rounded-full border"
        />

        {/* ── Second inner accent ring ── */}
        <motion.div
          style={{
            x: ringX,
            y: ringY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            width: isHovering ? 20 : 14,
            height: isHovering ? 20 : 14,
            opacity: isVisible ? (isHovering ? 0.35 : 0.15) : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute rounded-full border border-[#c5a880]/40"
        />

        {/* ── Inner precise dot (instant tracking) ── */}
        <motion.div
          style={{
            x: rawX,
            y: rawY,
            translateX: "-50%",
            translateY: "-50%",
            background: "rgba(197, 168, 128, 0.9)",
            boxShadow: "0 0 8px rgba(197,168,128,0.6), 0 0 18px rgba(197,168,128,0.2)",
            position: "absolute",
            borderRadius: "50%",
          }}
          animate={{
            width: isHovering ? 3 : 5,
            height: isHovering ? 3 : 5,
            opacity: dotOpacity,
            scale: dotScale,
          }}
          transition={{ duration: 0.15 }}
        />
      </div>
    </>
  );
}
