"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePromptStore, PromptItem } from "@/store/usePromptStore";
import { toast } from "@/store/useToastStore";
import { extractVariables, replaceVariables } from "@/lib/parser";
import { EASES } from "@/lib/motion";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt?: (prompt: PromptItem) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectPrompt }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeVariables, setActiveVariables] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const prompts = usePromptStore((state) => state.prompts);
  const recordCopy = usePromptStore((state) => state.recordCopy);

  // Filter prompts by title, tags, or content
  const filteredPrompts = useMemo(() => {
    if (!query.trim()) return prompts.slice(0, 8); // Top results when empty
    const q = query.toLowerCase().trim();
    return prompts.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchContent = p.content.toLowerCase().includes(q);
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
      const matchCategory = p.category.toLowerCase().includes(q);
      return matchTitle || matchContent || matchTag || matchCategory;
    });
  }, [prompts, query]);

  const selectedPrompt = filteredPrompts[selectedIndex] || null;

  // Extract variables for current selected prompt
  const detectedVariables = useMemo(() => {
    if (!selectedPrompt) return [];
    return extractVariables(selectedPrompt.content);
  }, [selectedPrompt]);

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveVariables({});
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredPrompts.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : Math.max(0, filteredPrompts.length - 1)
        );
      } else if (e.key === "Enter" && selectedPrompt) {
        // Execute copy with dynamic variables replaced
        e.preventDefault();
        executeCopy(selectedPrompt);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredPrompts, selectedIndex, selectedPrompt]);

  const executeCopy = async (prompt: PromptItem) => {
    const finalContent = replaceVariables(prompt.content, activeVariables);
    try {
      await navigator.clipboard.writeText(finalContent);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = finalContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    recordCopy(prompt.id);
    toast("PROMPT COPIED TO CLIPBOARD", prompt.title);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent="true"
        onClick={onClose}
        className="fixed inset-0 z-[100005] flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 bg-[#050507]/85 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: EASES.expoOut }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl border border-[#00F0FF]/40 bg-[#121216] shadow-[0_0_50px_rgba(0,240,255,0.18)] chamfer-card-lg overflow-hidden flex flex-col max-h-[80svh]"
        >
          {/* Top Search Bar */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 bg-[#050507]">
            <span className="font-mono text-sm text-[#00F0FF]">⌘K</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 38 prompts by title, syntax, tags, or domain..."
              className="w-full bg-transparent font-mono text-sm text-white placeholder-[#8A8A93]/60 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="font-mono text-xs text-[#8A8A93] hover:text-white"
              >
                CLEAR
              </button>
            )}
            <span className="border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-[#8A8A93] chamfer-tag">
              ESC
            </span>
          </div>

          {/* Body: Split View (Results on Left, Details & Dynamic Variables on Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 overflow-hidden flex-1">
            {/* Results List */}
            <div
              ref={listRef}
              className="md:col-span-6 border-r border-white/10 max-h-[50svh] overflow-y-auto divide-y divide-white/5"
            >
              {filteredPrompts.length === 0 ? (
                <div className="p-8 text-center font-mono text-xs text-[#8A8A93]">
                  No matching prompts in vault.
                </div>
              ) : (
                filteredPrompts.map((prompt, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={prompt.id}
                      onClick={() => setSelectedIndex(idx)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`cursor-pointer p-3.5 font-mono text-xs transition-colors ${
                        isSelected
                          ? "bg-[#00F0FF]/15 border-l-2 border-[#00F0FF] text-white"
                          : "text-[#8A8A93] hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white truncate">
                          {prompt.title}
                        </span>
                        <span className="text-[10px] text-[#00F0FF] shrink-0 border border-[#00F0FF]/30 px-1 py-0.2">
                          {prompt.category}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-[#8A8A93]">
                        <span>{prompt.copiedCount} COPIES</span>
                        <span>•</span>
                        <span className="truncate">
                          #{prompt.tags.join(" #")}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Preview & Variables Inspector */}
            <div className="md:col-span-6 p-4 max-h-[50svh] overflow-y-auto bg-[#0e0e12] flex flex-col justify-between">
              {selectedPrompt ? (
                <div className="space-y-3">
                  <div>
                    <span className="border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#00F0FF]">
                      {selectedPrompt.category}
                    </span>
                    <h4 className="mt-2 font-display text-base font-bold text-white">
                      {selectedPrompt.title}
                    </h4>
                    <p className="mt-1 font-mono text-[11px] text-[#8A8A93]">
                      {selectedPrompt.description}
                    </p>
                  </div>

                  {/* Dynamic Variables Inputs */}
                  {detectedVariables.length > 0 && (
                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <span className="block font-mono text-[10px] font-bold text-[#00F0FF]">
                        DYNAMIC PARAMETERS ({detectedVariables.length}):
                      </span>
                      {detectedVariables.map((v) => (
                        <div key={v} className="space-y-1">
                          <label className="block font-mono text-[10px] text-[#8A8A93]">
                            [{v}]
                          </label>
                          <input
                            type="text"
                            value={activeVariables[v] || ""}
                            onChange={(e) =>
                              setActiveVariables((prev) => ({
                                ...prev,
                                [v]: e.target.value,
                              }))
                            }
                            placeholder={`Value for ${v}...`}
                            className="w-full border border-white/10 bg-[#050507] px-2 py-1 font-mono text-xs text-white focus:border-[#00F0FF] focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Prompt Preview */}
                  <div className="border border-white/10 bg-[#050507] p-2.5 font-mono text-[11px] text-white/90 line-clamp-4 select-text">
                    {replaceVariables(selectedPrompt.content, activeVariables)}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center font-mono text-xs text-[#8A8A93]">
                  Select a prompt to preview
                </div>
              )}

              {/* Action buttons footer */}
              {selectedPrompt && (
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  {onSelectPrompt && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPrompt(selectedPrompt);
                        onClose();
                      }}
                      className="border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-white hover:border-[#00F0FF] chamfer-button"
                    >
                      OPEN IN WORKBENCH
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => executeCopy(selectedPrompt)}
                    className="border border-[#00F0FF] bg-[#00F0FF] px-4 py-1.5 font-mono text-xs font-bold text-[#050507] hover:bg-white chamfer-button"
                  >
                    COPY [↵]
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Shortcuts Bar */}
          <div className="flex items-center justify-between border-t border-white/10 bg-[#050507] px-4 py-2 font-mono text-[10px] text-[#8A8A93]">
            <div className="flex items-center gap-4">
              <span><kbd className="text-white">↑↓</kbd> NAVIGATE</span>
              <span><kbd className="text-white">↵</kbd> EXECUTE COPY</span>
              <span><kbd className="text-white">ESC</kbd> CLOSE</span>
            </div>
            <span className="text-[#00F0FF]">AIR-GAPPED INSTANT SEARCH</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
