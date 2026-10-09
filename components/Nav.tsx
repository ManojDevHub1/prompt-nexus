"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { usePromptStore, downloadVaultJson, importVaultFromFile } from "@/store/usePromptStore";
import { toast } from "@/store/useToastStore";
import { EASES } from "@/lib/motion";

interface NavProps {
  onOpenAddModal: () => void;
  onOpenCommandPalette: () => void;
}

export function Nav({ onOpenAddModal, onOpenCommandPalette }: NavProps) {
  const [isHidden, setIsHidden] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { scrollY } = useScroll();
  const prompts = usePromptStore((state) => state.prompts);

  const totalCopies = prompts.reduce((acc, p) => acc + p.copiedCount, 0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;

    // Only hide if scrolled past top buffer and scrolling downwards with momentum
    if (latest > 120 && diff > 10) {
      setIsHidden(true);
    } else if (diff < -8) {
      setIsHidden(false);
    }
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExport = () => {
    downloadVaultJson();
    toast("VAULT EXPORTED", "Downloaded prompt-vault.json successfully.");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importVaultFromFile(file, (res) => {
      if (res.success) {
        toast("VAULT IMPORTED", `Restored ${res.count} prompt nodes.`);
      } else {
        toast("IMPORT FAILED", res.error || "Malformed JSON");
      }
    });
    e.target.value = "";
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 pointer-events-none"
      animate={{
        y: isHidden ? "-100%" : "0%",
      }}
      transition={{
        duration: 0.35,
        ease: EASES.expoOut,
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="pointer-events-auto flex items-center justify-between border border-white/10 bg-[#050507]/90 px-4 py-2.5 backdrop-blur-md chamfer-card">
          {/* Brand mark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-2 text-left focus-visible:outline-none"
              data-magnetic="true"
            >
              <div className="h-4 w-4 bg-[#00F0FF] chamfer-tag flex items-center justify-center">
                <span className="block h-1.5 w-1.5 bg-[#050507]" />
              </div>
              <span className="font-display text-sm font-bold tracking-tight text-white">
                PROMPTNEXUS
              </span>
            </button>
            <span className="border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-1.5 py-0.5 text-[10px] font-mono text-[#00F0FF]">
              BETA // MANOJ
            </span>
          </div>

          {/* Quick jump navigation */}
          <nav className="hidden items-center gap-5 font-mono text-xs text-[#8A8A93] md:flex">
            <button
              onClick={() => scrollToSection("hero")}
              className="hover:text-white transition-colors"
              data-magnetic="true"
            >
              [01_GRID]
            </button>
            <button
              onClick={() => scrollToSection("manifesto")}
              className="hover:text-white transition-colors"
              data-magnetic="true"
            >
              [02_MANIFESTO]
            </button>
            <button
              onClick={() => scrollToSection("vault")}
              className="hover:text-white transition-colors"
              data-magnetic="true"
            >
              [03_VAULT]
            </button>
            <button
              onClick={() => scrollToSection("workbench")}
              className="hover:text-[#00F0FF] transition-colors"
              data-magnetic="true"
            >
              [04_WORKBENCH]
            </button>
          </nav>

          {/* Actions: Command Palette, Export/Import, Add Prompt */}
          <div className="flex items-center gap-3">
            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              data-magnetic="true"
              className="flex items-center gap-2 border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-[#8A8A93] hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors chamfer-button"
              title="Global Command Palette (Ctrl+K / Cmd+K)"
            >
              <span className="hidden sm:inline">PALETTE</span>
              <kbd className="border border-white/20 bg-black/40 px-1 py-0.2 text-[10px] text-white">
                ⌘K
              </kbd>
            </button>

            {/* Quick Export / Import for zero-cloud sovereignty */}
            <div className="hidden lg:flex items-center gap-1.5 border-l border-white/10 pl-3">
              <button
                type="button"
                onClick={handleExport}
                className="border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-[#8A8A93] hover:text-white hover:border-white/30 transition-colors chamfer-tag"
                title="Download prompt-vault.json"
              >
                EXPORT
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-[#8A8A93] hover:text-[#00F0FF] hover:border-[#00F0FF]/40 transition-colors chamfer-tag"
                title="Import JSON Vault"
              >
                IMPORT
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>

            {/* Telemetry Indicator */}
            <div className="hidden items-center gap-2 border-l border-white/10 pl-3 font-mono text-[11px] text-[#8A8A93] xl:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
              <span>NODES: <strong className="text-white">{prompts.length}</strong></span>
            </div>

            {/* Add Prompt CTA */}
            <button
              onClick={onOpenAddModal}
              data-magnetic="true"
              className="group relative flex items-center gap-2 border border-[#00F0FF] bg-[#00F0FF]/10 px-3 py-1.5 font-mono text-xs font-medium text-[#00F0FF] hover:bg-[#00F0FF] hover:text-[#050507] transition-colors chamfer-button"
            >
              <span className="text-base leading-none group-hover:rotate-90 transition-transform duration-200">
                +
              </span>
              <span>ADD PROMPT</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
