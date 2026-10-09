"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useInView,
  AnimatePresence,
} from "motion/react";
import { EASES, SPRINGS } from "@/lib/motion";
import { toast } from "@/store/useToastStore";

/* ==========================================================================
   NOISE GRAIN COMPONENT (feTurbulence SVG filter)
   ========================================================================== */
export function NoiseGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9990] h-full w-full opacity-15 mix-blend-overlay"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="promptnexus-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#promptnexus-grain)" />
      </svg>
    </div>
  );
}

/* ==========================================================================
   MAGNETIC WRAPPER
   ========================================================================== */
interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength = 0.25, className = "" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, SPRINGS.magnetic);
  const springY = useSpring(y, SPRINGS.magnetic);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   SPOTLIGHT CARD (flashlight cursor tracking via useMotionTemplate)
   ========================================================================== */
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  chamfer?: boolean;
}

export function SpotlightCard({
  children,
  className = "",
  onClick,
  chamfer = true,
}: SpotlightCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={isHovered ? handleMouseMove : undefined}
      onClick={onClick}
      className={`group relative overflow-hidden bg-[#121216] transition-colors p-[1px] contain-content ${
        chamfer ? "chamfer-card" : ""
      } ${className}`}
    >
      {/* Spotlight dynamic border: ONLY mounted and calculated when card is actively hovered */}
      {isHovered && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-150"
          style={{
            background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 240, 255, 0.45), rgba(255, 255, 255, 0.06) 60%, transparent 100%)`,
          }}
        />
      )}

      {/* Card body with inner spotlight glow: ONLY active on hover */}
      <div
        className={`relative h-full w-full bg-[#121216] ${
          chamfer ? "chamfer-card" : ""
        }`}
      >
        {isHovered && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-150"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 240, 255, 0.08), transparent 80%)`,
            }}
          />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

/* ==========================================================================
   IN-VIEW REVEAL PRIMITIVE
   ========================================================================== */
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
        transition={{
          duration: 0.8,
          ease: EASES.expoOut,
          delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ==========================================================================
   SIGNATURE MOMENT: THE INJECTION COPY BUTTON & CARD WRAPPER
   ========================================================================== */
interface CopyInjectionTriggerProps {
  textToCopy: string;
  onCopySuccess?: () => void;
  className?: string;
  label?: string;
  toastTitle?: string;
}

export function CopyInjectionButton({
  textToCopy,
  onCopySuccess,
  className = "",
  label = "COPY",
  toastTitle = "PROMPT COPIED TO CLIPBOARD",
}: CopyInjectionTriggerProps) {
  const [copied, setCopied] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setFlashActive(true);
    setCopied(true);
    onCopySuccess?.();

    // Trigger global cyan toast notification
    toast(toastTitle);

    setTimeout(() => {
      setFlashActive(false);
    }, 600);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative inline-block">
      {/* Element 2: Text Flash that shoots upward as stark white, blurs and fades */}
      <AnimatePresence>
        {flashActive && (
          <motion.div
            key="flash-text"
            aria-hidden="true"
            initial={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
            animate={{
              y: -50,
              opacity: 0,
              filter: "blur(8px)",
              scale: 1.05,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.55,
              ease: EASES.expoOut,
            }}
            className="pointer-events-none absolute -top-2 left-0 right-0 z-50 flex items-center justify-center font-mono text-xs font-bold text-white shadow-cyan-400 drop-shadow-[0_0_12px_#00F0FF]"
          >
            FLASH INJECTED
          </motion.div>
        )}
      </AnimatePresence>

      {/* Element 3: Button whose border shifts to neon-cyan & changes label */}
      <motion.button
        type="button"
        onClick={handleCopy}
        data-magnetic="true"
        whileTap={{ scale: 0.94 }}
        animate={{
          borderColor: copied ? "#00F0FF" : "rgba(255, 255, 255, 0.15)",
          color: copied ? "#00F0FF" : "#FFFFFF",
          backgroundColor: copied ? "rgba(0, 240, 255, 0.12)" : "rgba(18, 18, 22, 0.8)",
        }}
        transition={{ duration: 0.2 }}
        className={`relative flex items-center gap-2 border px-3 py-1.5 font-mono text-xs font-semibold tracking-wider chamfer-button ${className}`}
      >
        <span
          className={`h-1.5 w-1.5 transition-colors ${
            copied ? "bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" : "bg-white/40"
          }`}
        />
        <span>{copied ? "COPIED" : label}</span>
      </motion.button>
    </div>
  );
}

/* ==========================================================================
   TAG BADGE
   ========================================================================== */
interface TagBadgeProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function TagBadge({ label, active = false, onClick }: TagBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-2 py-0.5 font-mono text-[10px] tracking-wider transition-colors chamfer-tag ${
        active
          ? "border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF]"
          : "border-white/10 bg-white/5 text-[#8A8A93] hover:border-white/30 hover:text-white"
      }`}
    >
      #{label}
    </button>
  );
}
