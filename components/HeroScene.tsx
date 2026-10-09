"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { APP_CONTENT } from "@/lib/content";
import { EASES, SPRINGS, DURATIONS } from "@/lib/motion";
import { usePromptStore } from "@/store/usePromptStore";

// Dynamically import Three.js Neural Lattice canvas with client-side only rendering
const NeuralLatticeCanvas = dynamic(
  () => import("@/components/NeuralLatticeCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-radial from-[#00F0FF]/10 via-transparent to-transparent opacity-30" />
    ),
  }
);

interface HeroSceneProps {
  onOpenAddModal: () => void;
  onExploreVault: () => void;
}

export function HeroScene({ onOpenAddModal, onExploreVault }: HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prompts = usePromptStore((state) => state.prompts);
  const prefersReducedMotion = useReducedMotion();

  // Normalized pointer coordinates [0, 1]
  const rawPointerX = useMotionValue(0.5);
  const rawPointerY = useMotionValue(0.5);

  const smoothPointerX = useSpring(rawPointerX, SPRINGS.magnetic);
  const smoothPointerY = useSpring(rawPointerY, SPRINGS.magnetic);

  // 3D Tilt transforms (max 5 degrees)
  const rotateX = useTransform(smoothPointerY, [0, 1], [4, -4]);
  const rotateY = useTransform(smoothPointerX, [0, 1], [-4, 4]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || prefersReducedMotion) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - left) / width, 0), 1);
    const y = Math.min(Math.max((e.clientY - top) / height, 0), 1);
    rawPointerX.set(x);
    rawPointerY.set(y);
  };

  const headlineWords = `${APP_CONTENT.hero.headlinePart1} ${APP_CONTENT.hero.headlinePart2}`.split(" ");

  return (
    <section
      id="hero"
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-svh w-full overflow-hidden bg-[#050507] pt-24 pb-16 flex flex-col justify-between"
      style={{ perspective: 1200 }}
    >
      {/* Background WebGL Neural Lattice */}
      <div className="absolute inset-0 z-0 opacity-80 transition-opacity duration-1000">
        <NeuralLatticeCanvas />
      </div>

      {/* Dark vignette overlays */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#050507]/90 via-transparent to-[#050507]" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#050507]/80 via-transparent to-[#050507]/80" />

      {/* Hero Content with 3D tilt */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-12 my-auto">
        <motion.div
          style={{
            rotateX: prefersReducedMotion ? 0 : rotateX,
            rotateY: prefersReducedMotion ? 0 : rotateY,
            transformStyle: "preserve-3d",
          }}
          className="max-w-4xl"
        >
          {/* Top Beta Chip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATIONS.element, ease: EASES.expoOut }}
            className="mb-6 inline-flex items-center gap-2.5 border border-[#00F0FF]/30 bg-[#00F0FF]/5 px-3 py-1 chamfer-tag"
          >
            <span className="h-1.5 w-1.5 animate-pulse bg-[#00F0FF]" />
            <span className="font-mono text-xs tracking-wider text-[#00F0FF]">
              {APP_CONTENT.hero.badge}
            </span>
          </motion.div>

          {/* Masked Headline Reveal Word-by-Word */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.03em] leading-[0.95] text-white">
            {headlineWords.map((word, idx) => (
              <span
                key={`${word}-${idx}`}
                className="inline-block overflow-hidden mr-[0.25em] last:mr-0 align-top"
              >
                <motion.span
                  initial={{ y: "115%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: DURATIONS.element,
                    ease: EASES.expoOut,
                    delay: 0.15 + idx * 0.05,
                  }}
                  className={`inline-block ${
                    word.includes("LATENCY") || word.includes("ARSENAL")
                      ? "text-white"
                      : "text-white/90"
                  }`}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Support Line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: DURATIONS.element,
              ease: EASES.expoOut,
              delay: 0.45,
            }}
            className="mt-6 max-w-xl font-mono text-base sm:text-lg text-[#8A8A93]"
          >
            {APP_CONTENT.hero.supportLine}
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: DURATIONS.element,
              ease: EASES.expoOut,
              delay: 0.55,
            }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={onExploreVault}
              data-magnetic="true"
              className="group relative flex items-center gap-3 border border-[#00F0FF] bg-[#00F0FF] px-6 py-3.5 font-mono text-xs sm:text-sm font-bold tracking-wider text-[#050507] hover:bg-white hover:border-white transition-colors chamfer-button"
            >
              <span>{APP_CONTENT.hero.primaryCta}</span>
              <span className="text-base font-mono group-hover:translate-x-1 transition-transform">
                ↓
              </span>
            </button>

            <button
              onClick={onOpenAddModal}
              data-magnetic="true"
              className="flex items-center gap-3 border border-white/20 bg-[#121216]/80 px-6 py-3.5 font-mono text-xs sm:text-sm font-medium tracking-wider text-white hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors backdrop-blur-sm chamfer-button"
            >
              <span className="text-[#00F0FF]">+</span>
              <span>{APP_CONTENT.hero.secondaryCta}</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Real-time Telemetry Bar */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-12 mt-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATIONS.element, delay: 0.7 }}
          className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4 font-mono text-xs md:grid-cols-4 md:gap-6"
        >
          {APP_CONTENT.hero.telemetry.map((item, idx) => (
            <div
              key={item.label}
              className="border border-white/5 bg-[#121216]/60 p-3 backdrop-blur-sm chamfer-card"
            >
              <div className="flex items-center justify-between text-[10px] text-[#8A8A93]">
                <span>{item.label}</span>
                <span
                  className={`h-1.5 w-1.5 ${
                    item.indicator === "active"
                      ? "bg-[#00F0FF] animate-pulse"
                      : "bg-emerald-400"
                  }`}
                />
              </div>
              <div className="mt-1 font-mono text-sm font-bold tracking-wide text-white">
                {idx === 0 ? `${prompts.length} PROMPTS LOADED` : item.value}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
