"use client";

import { useState, useCallback, useEffect } from "react";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { HeroScene } from "@/components/HeroScene";
import { ManifestoScene } from "@/components/ManifestoScene";
import { VaultScene } from "@/components/VaultScene";
import { WorkbenchScene } from "@/components/WorkbenchScene";
import { FinaleScene } from "@/components/FinaleScene";
import { CommandPalette } from "@/components/CommandPalette";
import { PromptItem } from "@/store/usePromptStore";

export default function HomePage() {
  const [bootCompleted, setBootCompleted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeSelectedPrompt, setActiveSelectedPrompt] = useState<PromptItem | null>(null);

  const handlePreloaderComplete = useCallback(() => {
    setBootCompleted(true);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleOpenCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(true);
  }, []);

  const handleCloseCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false);
  }, []);

  const handleExploreVault = useCallback(() => {
    const el = document.getElementById("vault");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleSelectPromptForWorkbench = useCallback((prompt: PromptItem) => {
    setActiveSelectedPrompt(prompt);
    const el = document.getElementById("workbench");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="relative min-h-svh w-full bg-[#050507]">
      {/* Boot sequence preloader */}
      <Preloader onComplete={handlePreloaderComplete} />

      {/* Global Command Palette (Ctrl/Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={handleCloseCommandPalette}
        onSelectPrompt={handleSelectPromptForWorkbench}
      />

      {/* Top navigation */}
      <Nav
        onOpenAddModal={handleOpenAddModal}
        onOpenCommandPalette={handleOpenCommandPalette}
      />

      {/* 01. Hero Scene: The Grid & WebGL Neural Lattice */}
      <HeroScene
        onOpenAddModal={handleOpenAddModal}
        onExploreVault={handleExploreVault}
      />

      {/* 02. Manifesto Scene: Scroll-scrubbed word opacity */}
      <ManifestoScene />

      {/* 03. Core Feature: The Vault (Pinned 400vh Stage) */}
      <VaultScene
        onSelectPromptForWorkbench={handleSelectPromptForWorkbench}
      />

      {/* 04. The Workbench: Interactive App Area & Variable Injector */}
      <WorkbenchScene
        isAddModalOpen={isAddModalOpen}
        onCloseAddModal={handleCloseAddModal}
        onOpenAddModal={handleOpenAddModal}
        activeSelectedPrompt={activeSelectedPrompt}
        onClearSelectedPrompt={() => setActiveSelectedPrompt(null)}
      />

      {/* 05. Finale: Data Sovereignty & Curtain Footer */}
      <FinaleScene />
    </main>
  );
}
