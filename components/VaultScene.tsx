"use client";

import React, { useRef, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { usePromptStore, PromptItem } from "@/store/usePromptStore";
import { APP_CONTENT } from "@/lib/content";
import { SpotlightCard, CopyInjectionButton, TagBadge } from "@/components/ui";
import { EASES, SPRINGS } from "@/lib/motion";
import { extractVariables, replaceVariables } from "@/lib/parser";

interface VaultSceneProps {
  onSelectPromptForWorkbench: (prompt: PromptItem) => void;
}

export function VaultScene({ onSelectPromptForWorkbench }: VaultSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prompts = usePromptStore((state) => state.prompts);
  const recordCopy = usePromptStore((state) => state.recordCopy);
  const isReduced = useReducedMotion();

  // Track which card is executing the physical compression injection
  const [compressingCardId, setCompressingCardId] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, SPRINGS.soft);

  // Map progress to active category index (0 to 5)
  const categories = APP_CONTENT.vault.categories;
  const activeCategoryIndex = useTransform(
    smoothProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 1, 2, 3, 4, 5]
  );

  // Translate cards column upwards as user scrolls down the stage
  const cardStreamY = useTransform(
    smoothProgress,
    [0, 0.95],
    ["0%", "-85%"]
  );

  const handleCopyTrigger = (prompt: PromptItem) => {
    setCompressingCardId(prompt.id);
    recordCopy(prompt.id);
    setTimeout(() => {
      setCompressingCardId(null);
    }, 550);
  };

  return (
    <section
      id="vault"
      ref={containerRef}
      className="relative h-[360vh] w-full bg-[#050507]"
    >
      {/* Sticky Top-0 h-svh Stage */}
      <div className="sticky top-0 flex h-svh w-full flex-col justify-between overflow-clip px-6 py-12 md:px-12">
        {/* Subtle grid backdrop */}
        <div className="pointer-events-none absolute inset-0 lattice-grid-bg opacity-15" />

        {/* Top header */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-[#00F0FF]" />
            <span className="font-mono text-xs tracking-wider text-[#00F0FF]">
              {APP_CONTENT.vault.badge}
            </span>
          </div>
          <span className="font-mono text-xs text-[#8A8A93]">
            SECTOR STREAM // 03 ({prompts.length} PROMPTS)
          </span>
        </div>

        {/* Two-Column Pinned Architecture */}
        <div className="relative z-10 mx-auto grid h-[calc(100svh-160px)] w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-12 md:gap-12 pt-6">
          {/* Left Column: Fixed Category Navigation Rail */}
          <div className="hidden h-full flex-col justify-between md:col-span-4 md:flex">
            <div>
              <h3 className="font-display text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
                {APP_CONTENT.vault.title}
              </h3>
              <p className="mt-2 font-mono text-xs leading-relaxed text-[#8A8A93]">
                {APP_CONTENT.vault.description}
              </p>

              {/* Category sectors rail */}
              <div className="mt-8 space-y-3">
                {categories.map((cat, idx) => {
                  return (
                    <CategoryRailItem
                      key={cat.id}
                      category={cat}
                      index={idx}
                      activeProgressIndex={activeCategoryIndex}
                    />
                  );
                })}
              </div>
            </div>

            {/* Bottom Enclave Status */}
            <div className="border border-white/10 bg-[#121216]/80 p-4 chamfer-card font-mono text-xs text-[#8A8A93]">
              <div className="flex items-center justify-between text-white">
                <span className="text-[#00F0FF]">LOCAL SYNC</span>
                <span>AIR-GAPPED (38 NODES)</span>
              </div>
              <p className="mt-1 text-[11px] text-[#8A8A93]/70">
                Lattice automatically indexes bracket variables like [Topic] or [Audience] for instant keystroke retrieval.
              </p>
            </div>
          </div>

          {/* Right Column: Staggered Vertical Card Stream */}
          <div className="relative h-full overflow-hidden md:col-span-8">
            <motion.div
              style={{
                y: isReduced ? "0%" : cardStreamY,
              }}
              className="space-y-6 pb-24"
            >
              {prompts.map((prompt) => (
                <VaultPromptCard
                  key={prompt.id}
                  prompt={prompt}
                  isCompressing={compressingCardId === prompt.id}
                  onCopyTrigger={handleCopyTrigger}
                  onSelectPromptForWorkbench={onSelectPromptForWorkbench}
                />
              ))}
            </motion.div>

            {/* Top and Bottom Fade Gradients */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#050507] to-transparent z-20" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050507] to-transparent z-20" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Subcomponent: VaultPromptCard with inline Dynamic Variable [Bracket] inputs
function VaultPromptCard({
  prompt,
  isCompressing,
  onCopyTrigger,
  onSelectPromptForWorkbench,
}: {
  prompt: PromptItem;
  isCompressing: boolean;
  onCopyTrigger: (prompt: PromptItem) => void;
  onSelectPromptForWorkbench: (prompt: PromptItem) => void;
}) {
  const [variableInputs, setVariableInputs] = useState<Record<string, string>>({});
  const [isVariablesExpanded, setIsVariablesExpanded] = useState(false);

  // Automatically extract brackets like [Topic], [Audience], etc.
  const detectedVars = useMemo(
    () => extractVariables(prompt.content),
    [prompt.content]
  );

  // Dynamically replace brackets in the prompt string
  const resolvedContent = useMemo(
    () => replaceVariables(prompt.content, variableInputs),
    [prompt.content, variableInputs]
  );

  return (
    <motion.div
      animate={
        isCompressing
          ? {
              scale: [1, 0.95, 1.02, 1],
              transition: {
                duration: 0.55,
                times: [0, 0.25, 0.65, 1],
                ease: EASES.expoOut,
              },
            }
          : { scale: 1 }
      }
      className="relative transition-shadow contain-content"
    >
      <SpotlightCard className="p-6 md:p-8">
        {/* Top card metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="border border-[#00F0FF]/40 bg-[#00F0FF]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#00F0FF] chamfer-tag">
              {prompt.category}
            </span>
            {prompt.isPinned && (
              <span className="border border-white/20 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white">
                PINNED
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-[#8A8A93]">
              EXECUTED: <strong className="text-white">{prompt.copiedCount}x</strong>
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="mt-4 font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
          {prompt.title}
        </h4>
        <p className="mt-2 font-mono text-xs text-[#8A8A93] line-clamp-2">
          {prompt.description}
        </p>

        {/* Dynamic Variables Inputs Bar */}
        {detectedVars.length > 0 && (
          <div className="mt-4 border border-white/10 bg-[#0b0b0e] p-3 chamfer-card">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#00F0FF] mb-2">
              <span className="font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-[#00F0FF] rounded-full animate-pulse" />
                DYNAMIC BRACKETS ({detectedVars.length})
              </span>
              <button
                type="button"
                onClick={() => setIsVariablesExpanded(!isVariablesExpanded)}
                className="text-[#8A8A93] hover:text-white"
              >
                {isVariablesExpanded ? "[COLLAPSE]" : "[INJECT PARAMS]"}
              </button>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-2 transition-all ${
                !isVariablesExpanded && detectedVars.length > 2
                  ? "max-h-24 overflow-hidden"
                  : ""
              }`}
            >
              {detectedVars.map((v) => (
                <div key={v} className="space-y-0.5">
                  <span className="block font-mono text-[10px] text-[#8A8A93]">
                    [{v}]
                  </span>
                  <input
                    type="text"
                    value={variableInputs[v] || ""}
                    onChange={(e) =>
                      setVariableInputs((prev) => ({
                        ...prev,
                        [v]: e.target.value,
                      }))
                    }
                    placeholder={`Input for ${v}...`}
                    className="w-full border border-white/10 bg-[#050507] px-2.5 py-1 font-mono text-xs text-white focus:border-[#00F0FF] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Content Monospace Box */}
        <div className="mt-4 relative overflow-hidden border border-white/10 bg-[#050507] p-4 font-mono text-xs text-white/90">
          <div className="line-clamp-4 select-text leading-relaxed">
            {resolvedContent}
          </div>
        </div>

        {/* Variables & Tags */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {prompt.tags.map((tag) => (
              <TagBadge key={tag} label={tag} />
            ))}
          </div>

          {/* Card Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectPromptForWorkbench(prompt)}
              data-magnetic="true"
              className="border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs text-white hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors chamfer-button"
            >
              INJECT / EDIT
            </button>

            {/* Copy button replaces brackets in clipboard with user's input */}
            <CopyInjectionButton
              textToCopy={resolvedContent}
              toastTitle={`COPIED: ${prompt.title.slice(0, 32)}`}
              onCopySuccess={() => onCopyTrigger(prompt)}
            />
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

// Subcomponent to smoothly highlight active category in the left rail
function CategoryRailItem({
  category,
  index,
  activeProgressIndex,
}: {
  category: { id: string; label: string; countHint: string; description: string };
  index: number;
  activeProgressIndex: any;
}) {
  const [isActive, setIsActive] = useState(false);

  React.useEffect(() => {
    return activeProgressIndex.on("change", (val: number) => {
      const rounded = Math.round(val);
      setIsActive(rounded === index);
    });
  }, [activeProgressIndex, index]);

  return (
    <div
      className={`border p-3 transition-colors duration-300 chamfer-card ${
        isActive
          ? "border-[#00F0FF] bg-[#00F0FF]/10 text-white"
          : "border-white/5 bg-[#121216]/40 text-[#8A8A93]"
      }`}
    >
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="font-bold">{category.label}</span>
        <span className={`text-[10px] ${isActive ? "text-[#00F0FF]" : "text-[#8A8A93]"}`}>
          {category.countHint}
        </span>
      </div>
      <p className="mt-1 text-[11px] leading-tight text-[#8A8A93]">
        {category.description}
      </p>
    </div>
  );
}
