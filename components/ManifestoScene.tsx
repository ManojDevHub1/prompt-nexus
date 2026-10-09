"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "motion/react";
import { APP_CONTENT } from "@/lib/content";

function ManifestoWord({
  word,
  index,
  total,
  progress,
  isReduced,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  isReduced: boolean | null;
}) {
  // Stagger the activation window across scroll progress
  const step = 0.65 / total;
  const start = 0.15 + index * step;
  const end = start + step * 0.9;

  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const y = useTransform(progress, [start, end], [12, 0]);

  if (isReduced) {
    return (
      <span className="inline-block mr-[0.22em] text-white">
        {word}
      </span>
    );
  }

  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block mr-[0.22em] transition-colors ${
        word === "BEST" || word === "PROMPTS" ? "text-[#00F0FF]" : "text-white"
      }`}
    >
      {word}
    </motion.span>
  );
}

export function ManifestoScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const words = APP_CONTENT.manifesto.words;

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="relative h-[220vh] w-full bg-[#050507]"
    >
      {/* Sticky viewport frame */}
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden px-6 md:px-12">
        {/* Subtle grid pattern background */}
        <div className="pointer-events-none absolute inset-0 lattice-grid-bg opacity-20" />

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          {/* Section Eyebrow */}
          <div className="mb-8 inline-flex items-center gap-2 border border-white/10 bg-[#121216] px-3 py-1 font-mono text-xs text-[#8A8A93] chamfer-tag">
            <span className="h-1.5 w-1.5 bg-[#00F0FF]" />
            <span>02 // THE MANIFESTO</span>
          </div>

          {/* Giant Word-Scrub Text */}
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.03em] leading-[1.05]">
            {words.map((word, idx) => (
              <ManifestoWord
                key={`${word}-${idx}`}
                word={word}
                index={idx}
                total={words.length}
                progress={scrollYProgress}
                isReduced={isReduced}
              />
            ))}
          </h2>

          {/* Supporting Manifesto Context */}
          <motion.div
            style={{
              opacity: isReduced
                ? 1
                : useTransform(scrollYProgress, [0.65, 0.9], [0.2, 1]),
            }}
            className="mt-12 mx-auto max-w-2xl border-t border-white/10 pt-6"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-[#00F0FF]">
              {APP_CONTENT.manifesto.tagline}
            </p>
            <p className="mt-3 font-mono text-sm leading-relaxed text-[#8A8A93]">
              {APP_CONTENT.manifesto.subtext}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
