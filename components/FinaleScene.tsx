"use client";

import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { usePromptStore } from "@/store/usePromptStore";
import { APP_CONTENT } from "@/lib/content";
import { EASES } from "@/lib/motion";
import { toast } from "@/store/useToastStore";

export function FinaleScene() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const { exportVault, importVault, resetToDefaults, prompts } = usePromptStore();

  const handleExport = () => {
    const jsonString = exportVault();
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "prompt-vault.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast("VAULT EXPORTED", "Downloaded prompt-vault.json successfully.");
    setNotification("VAULT EXPORTED AS prompt-vault.json");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importVault(content);
      if (res.success) {
        toast("VAULT RESTORED", `Imported ${res.count} prompt nodes.`);
        setNotification(`SUCCESSFULLY RESTORED ${res.count} NODES`);
      } else {
        toast("IMPORT FAILED", res.error || "Malformed JSON syntax");
        setNotification(`IMPORT FAILED: ${res.error}`);
      }
      setTimeout(() => setNotification(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <footer className="relative min-h-svh w-full overflow-hidden bg-[#050507] pt-24 pb-0 flex flex-col justify-between border-t border-white/10">
      {/* Background ambient dark matter mesh */}
      <div className="pointer-events-none absolute inset-0 lattice-grid-bg opacity-15" />

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 border border-[#00F0FF]/30 bg-[#00F0FF]/5 px-3 py-1 font-mono text-xs text-[#00F0FF] chamfer-tag">
            <span className="h-1.5 w-1.5 bg-[#00F0FF]" />
            <span>{APP_CONTENT.finale.badge}</span>
          </div>

          {/* Heading */}
          <h2 className="mt-4 font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            {APP_CONTENT.finale.headline}
          </h2>

          {/* Subtext */}
          <p className="mt-4 font-mono text-sm sm:text-base leading-relaxed text-[#8A8A93]">
            {APP_CONTENT.finale.subtext}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={handleExport}
              data-magnetic="true"
              className="flex items-center gap-3 border border-[#00F0FF] bg-[#00F0FF] px-6 py-3.5 font-mono text-xs sm:text-sm font-bold tracking-wider text-[#050507] hover:bg-white hover:border-white transition-colors chamfer-button shadow-[0_0_25px_rgba(0,240,255,0.25)]"
            >
              <span>{APP_CONTENT.finale.exportCta}</span>
              <span className="text-base font-mono">↓</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              data-magnetic="true"
              className="flex items-center gap-3 border border-white/20 bg-[#121216] px-6 py-3.5 font-mono text-xs sm:text-sm font-medium tracking-wider text-white hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors chamfer-button"
            >
              <span>{APP_CONTENT.finale.importCta}</span>
              <span className="text-base font-mono">↑</span>
            </button>

            <button
              onClick={() => {
                if (confirm("Reset vault to initial curated default prompts?")) {
                  resetToDefaults();
                  setNotification("VAULT RESTORED TO DEFAULT CURATION");
                  setTimeout(() => setNotification(null), 3000);
                }
              }}
              className="font-mono text-xs text-[#8A8A93] hover:text-white underline underline-offset-4 ml-2"
            >
              RESTORE FACTORY DEFAULTS
            </button>

            {/* Hidden JSON file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>

          {/* Toast feedback */}
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 inline-block border border-[#00F0FF] bg-[#00F0FF]/15 px-4 py-2 font-mono text-xs text-[#00F0FF]"
            >
              {`> ${notification}`}
            </motion.div>
          )}

          {/* Quick Enclave Telemetry */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 font-mono text-xs sm:grid-cols-3">
            <div>
              <span className="text-[10px] text-[#8A8A93]">PERSISTENCE</span>
              <p className="mt-1 font-bold text-white">BROWSER LOCAL STORAGE</p>
            </div>
            <div>
              <span className="text-[10px] text-[#8A8A93]">TOTAL ACTIVE NODES</span>
              <p className="mt-1 font-bold text-[#00F0FF]">{prompts.length} PROMPTS</p>
            </div>
            <div>
              <span className="text-[10px] text-[#8A8A93]">TARGET SESSION</span>
              <p className="mt-1 font-bold text-white">MANOJ BETA // AIR-GAPPED</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom oversized wordmark cropped by viewport */}
      <div className="relative mt-16 w-full select-none overflow-hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12 pb-4 font-mono text-[11px] text-[#8A8A93]">
          <span>{APP_CONTENT.finale.legal}</span>
          <span className="text-[#00F0FF]">ZERO CLOUD LEAKAGE</span>
        </div>

        {/* Oversized cropped PROMPTNEXUS typography */}
        <div className="w-full text-center leading-[0.75] overflow-hidden -mb-4 sm:-mb-8 md:-mb-12">
          <span className="block font-display text-[16vw] font-black tracking-[-0.05em] text-[#121216] select-none hover:text-white/10 transition-colors">
            {APP_CONTENT.finale.wordmark}
          </span>
        </div>
      </div>
    </footer>
  );
}
