"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
} from "motion/react";
import {
  usePromptStore,
  PromptItem,
  PromptCategory,
  downloadVaultJson,
  importVaultFromFile,
} from "@/store/usePromptStore";
import { toast } from "@/store/useToastStore";
import { extractVariables, replaceVariables } from "@/lib/parser";
import { APP_CONTENT } from "@/lib/content";
import {
  SpotlightCard,
  CopyInjectionButton,
  TagBadge,
} from "@/components/ui";
import { EASES, SPRINGS } from "@/lib/motion";

interface WorkbenchSceneProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
  activeSelectedPrompt: PromptItem | null;
  onClearSelectedPrompt: () => void;
}

export function WorkbenchScene({
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal,
  activeSelectedPrompt,
  onClearSelectedPrompt,
}: WorkbenchSceneProps) {
  const {
    prompts,
    selectedCategory,
    searchQuery,
    activeTag,
    addPrompt,
    updatePrompt,
    deletePrompt,
    togglePin,
    recordCopy,
    setSelectedCategory,
    setSearchQuery,
    setActiveTag,
  } = usePromptStore();

  const [editingPrompt, setEditingPrompt] = useState<PromptItem | null>(null);
  const [compressingCardId, setCompressingCardId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active variable injection playground state
  const [activePlaygroundPromptId, setActivePlaygroundPromptId] = useState<string | null>(
    prompts[0]?.id || null
  );
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // When activeSelectedPrompt from outside is provided, switch to it
  useEffect(() => {
    if (activeSelectedPrompt) {
      setActivePlaygroundPromptId(activeSelectedPrompt.id);
      // Pre-fill variable keys
      const initialVars: Record<string, string> = {};
      const vars = extractVariables(activeSelectedPrompt.content);
      vars.forEach((v) => {
        initialVars[v] = "";
      });
      setVariableValues(initialVars);
    }
  }, [activeSelectedPrompt]);

  const activePlaygroundPrompt = useMemo(() => {
    return prompts.find((p) => p.id === activePlaygroundPromptId) || prompts[0] || null;
  }, [prompts, activePlaygroundPromptId]);

  // Detected variables in current active prompt (matches [Topic] and {{Topic}})
  const detectedPlaygroundVariables = useMemo(() => {
    if (!activePlaygroundPrompt) return [];
    return extractVariables(activePlaygroundPrompt.content);
  }, [activePlaygroundPrompt]);

  // Compute resolved prompt text with injected variables
  const resolvedPlaygroundText = useMemo(() => {
    if (!activePlaygroundPrompt) return "";
    return replaceVariables(activePlaygroundPrompt.content, variableValues);
  }, [activePlaygroundPrompt, variableValues]);

  const handleExport = () => {
    downloadVaultJson();
    toast("VAULT EXPORTED", "Downloaded prompt-vault.json successfully.");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importVaultFromFile(file, (res) => {
      if (res.success) {
        toast("VAULT IMPORTED", `Restored ${res.count} prompt nodes.`);
      } else {
        toast("IMPORT FAILED", res.error || "Malformed JSON syntax");
      }
    });
    e.target.value = "";
  };

  // Filtered prompt list
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchesCategory =
        selectedCategory === "ALL" || p.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = !activeTag || p.tags.includes(activeTag);

      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [prompts, selectedCategory, searchQuery, activeTag]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    prompts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [prompts]);

  const handleCopyTrigger = (promptId: string) => {
    setCompressingCardId(promptId);
    recordCopy(promptId);
    setTimeout(() => {
      setCompressingCardId(null);
    }, 550);
  };

  const categories: ("ALL" | PromptCategory)[] = [
    "ALL",
    "Coding",
    "Design",
    "Copywriting",
    "Marketing",
    "System Prompts",
  ];

  return (
    <section
      id="workbench"
      className="relative min-h-svh w-full bg-[#050507] py-20 px-6 md:px-12"
    >
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 lattice-grid-bg opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#00F0FF]/30 bg-[#00F0FF]/5 px-3 py-1 font-mono text-xs text-[#00F0FF] chamfer-tag">
              <span className="h-1.5 w-1.5 bg-[#00F0FF]" />
              <span>{APP_CONTENT.workbench.badge}</span>
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              {APP_CONTENT.workbench.title}
            </h2>
            <p className="mt-2 font-mono text-xs sm:text-sm text-[#8A8A93] max-w-2xl">
              {APP_CONTENT.workbench.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExport}
              data-magnetic="true"
              className="border border-white/20 bg-white/5 px-4 py-3 font-mono text-xs text-white hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors chamfer-button"
            >
              EXPORT VAULT (JSON)
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              data-magnetic="true"
              className="border border-white/20 bg-white/5 px-4 py-3 font-mono text-xs text-white hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors chamfer-button"
            >
              IMPORT VAULT (JSON)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={onOpenAddModal}
              data-magnetic="true"
              className="flex items-center gap-2 border border-[#00F0FF] bg-[#00F0FF] px-5 py-3 font-mono text-xs font-bold tracking-wider text-[#050507] hover:bg-white hover:border-white transition-colors chamfer-button"
            >
              <span className="text-base leading-none">+</span>
              <span>{APP_CONTENT.workbench.addCta}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-8 flex flex-col gap-4 border border-white/10 bg-[#121216]/60 p-4 backdrop-blur-md chamfer-card lg:flex-row lg:items-center lg:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                data-magnetic="true"
                className={`border px-3 py-1.5 font-mono text-xs tracking-wider transition-colors chamfer-button ${
                  selectedCategory === cat
                    ? "border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF] font-bold"
                    : "border-white/10 bg-white/5 text-[#8A8A93] hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px] lg:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={APP_CONTENT.workbench.searchPlaceholder}
              className="w-full border border-white/15 bg-[#050507] px-3.5 py-2 font-mono text-xs text-white placeholder-[#8A8A93]/60 focus:border-[#00F0FF] focus:outline-none chamfer-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-[#8A8A93] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tags Row */}
        {allTags.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <span className="text-[#8A8A93] text-[10px] mr-1">INDEXED TAGS:</span>
            {allTags.slice(0, 10).map((tag) => (
              <TagBadge
                key={tag}
                label={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              />
            ))}
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="ml-2 font-mono text-[10px] text-[#00F0FF] hover:underline"
              >
                CLEAR FILTER
              </button>
            )}
          </div>
        )}

        {/* Bento Grid: 2-Column interactive setup (Left: Prompt Cards Bento, Right: Variable Injector Studio) */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Prompts List */}
          <div className="space-y-4 lg:col-span-7">
            <div className="flex items-center justify-between text-xs font-mono text-[#8A8A93]">
              <span>ACTIVE VAULT ENTRIES ({filteredPrompts.length})</span>
              <span>CLICK TO LOAD INJECTOR</span>
            </div>

            {filteredPrompts.length === 0 ? (
              <div className="border border-white/10 bg-[#121216] p-12 text-center chamfer-card">
                <p className="font-mono text-sm text-[#8A8A93]">
                  No matching prompts found in current sector.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("ALL");
                    setSearchQuery("");
                    setActiveTag(null);
                  }}
                  className="mt-4 border border-[#00F0FF] bg-[#00F0FF]/10 px-4 py-2 font-mono text-xs text-[#00F0FF] chamfer-button"
                >
                  RESET SECTOR FILTERS
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPrompts.map((prompt) => {
                  const isSelected = activePlaygroundPrompt?.id === prompt.id;
                  const isCompressing = compressingCardId === prompt.id;

                  return (
                    <motion.div
                      key={prompt.id}
                      layoutId={`card-${prompt.id}`}
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
                      className="cursor-pointer contain-content"
                      onClick={() => {
                        setActivePlaygroundPromptId(prompt.id);
                        const newVars: Record<string, string> = {};
                        prompt.variables.forEach((v) => {
                          newVars[v] = variableValues[v] || "";
                        });
                        setVariableValues(newVars);
                      }}
                    >
                      <SpotlightCard
                        className={`p-5 transition-all ${
                          isSelected
                            ? "border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        {/* Header bar */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 ${
                                isSelected ? "bg-[#00F0FF] animate-pulse" : "bg-white/20"
                              }`}
                            />
                            <span className="font-mono text-[10px] font-bold text-[#00F0FF]">
                              {prompt.category}
                            </span>
                            {prompt.isPinned && (
                              <span className="border border-white/20 bg-white/5 px-1.5 py-0.2 font-mono text-[9px] text-white">
                                PIN
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-[#8A8A93]">
                              {prompt.copiedCount} COPIES
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPrompt(prompt);
                              }}
                              className="font-mono text-xs text-[#8A8A93] hover:text-[#00F0FF] transition-colors"
                              title="Edit Prompt"
                            >
                              EDIT
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="mt-2 font-display text-lg font-bold text-white tracking-tight">
                          {prompt.title}
                        </h4>

                        {/* Snippet preview */}
                        <p className="mt-2 font-mono text-xs text-[#8A8A93] line-clamp-2 select-text">
                          {prompt.content}
                        </p>

                        {/* Bottom Row */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                          <div className="flex flex-wrap gap-1">
                            {prompt.tags.map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-[9px] text-[#8A8A93] border border-white/5 bg-white/5 px-1.5 py-0.5"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            {prompt.variables.length > 0 && (
                              <span className="font-mono text-[10px] text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5">
                                {prompt.variables.length} VARS
                              </span>
                            )}
                            <CopyInjectionButton
                              textToCopy={prompt.content}
                              onCopySuccess={() => handleCopyTrigger(prompt.id)}
                            />
                          </div>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Variable Injector Studio & Live Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-20">
              <div className="border border-white/10 bg-[#121216] p-6 chamfer-card">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-[#00F0FF]" />
                    <span className="font-mono text-xs font-bold text-white">
                      VARIABLE INJECTION ENGINE
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#00F0FF]">
                    LIVE SYNTHESIZER
                  </span>
                </div>

                {activePlaygroundPrompt ? (
                  <div className="mt-4 space-y-5">
                    <div>
                      <h4 className="font-display text-lg font-bold text-white">
                        {activePlaygroundPrompt.title}
                      </h4>
                      <p className="mt-1 font-mono text-xs text-[#8A8A93]">
                        {activePlaygroundPrompt.description}
                      </p>
                    </div>

                    {/* Detected Variables Inputs */}
                    {detectedPlaygroundVariables.length > 0 ? (
                      <div className="space-y-3 border-t border-white/10 pt-4">
                        <label className="block font-mono text-xs font-bold text-[#00F0FF]">
                          DYNAMIC BRACKETS ({detectedPlaygroundVariables.length})
                        </label>
                        {detectedPlaygroundVariables.map((variable) => (
                          <div key={variable} className="space-y-1">
                            <span className="font-mono text-[11px] text-[#8A8A93]">
                              [{variable}]
                            </span>
                            <input
                              type="text"
                              value={variableValues[variable] || ""}
                              onChange={(e) =>
                                setVariableValues((prev) => ({
                                  ...prev,
                                  [variable]: e.target.value,
                                }))
                              }
                              placeholder={`Input for [${variable}]...`}
                              className="w-full border border-white/10 bg-[#050507] px-3 py-1.5 font-mono text-xs text-white focus:border-[#00F0FF] focus:outline-none chamfer-input"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-white/5 bg-[#050507] p-3 font-mono text-xs text-[#8A8A93]">
                        No dynamic variables detected in this prompt. Use syntax like{" "}
                        <code className="text-[#00F0FF]">[Topic]</code> or{" "}
                        <code className="text-[#00F0FF]">[Audience]</code> when
                        editing to unlock dynamic injection.
                      </div>
                    )}

                    {/* Synthesized Live Output Preview */}
                    <div className="space-y-2 border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-xs font-bold text-white">
                          SYNTHESIZED PAYLOAD
                        </label>
                        <span className="font-mono text-[10px] text-[#8A8A93]">
                          READY TO INJECT
                        </span>
                      </div>

                      <div className="max-h-64 overflow-y-auto border border-[#00F0FF]/30 bg-[#050507] p-4 font-mono text-xs leading-relaxed text-white/90 select-text">
                        {resolvedPlaygroundText}
                      </div>
                    </div>

                    {/* Signature Moment Execution Button */}
                    <div className="pt-2 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setEditingPrompt(activePlaygroundPrompt)}
                        className="border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs text-[#8A8A93] hover:text-white hover:border-white transition-colors chamfer-button"
                      >
                        EDIT TEMPLATE
                      </button>

                      <CopyInjectionButton
                        textToCopy={resolvedPlaygroundText}
                        label="EXECUTE COPY"
                        className="bg-[#00F0FF] text-[#050507] font-bold border-[#00F0FF] hover:bg-white"
                        onCopySuccess={() =>
                          handleCopyTrigger(activePlaygroundPrompt.id)
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center font-mono text-xs text-[#8A8A93]">
                    Select or create a prompt to load the Variable Injection Engine.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Prompt Modal */}
      <PromptEditorModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        title="ADD NEW PROMPT NODE"
        initialData={null}
        onSave={(data) => {
          addPrompt(data);
          onCloseAddModal();
        }}
      />

      {/* Edit Prompt Modal (with layoutId expansion) */}
      {editingPrompt && (
        <PromptEditorModal
          isOpen={Boolean(editingPrompt)}
          onClose={() => setEditingPrompt(null)}
          title="EDIT PROMPT NODE"
          initialData={editingPrompt}
          onDelete={(id) => {
            deletePrompt(id);
            setEditingPrompt(null);
          }}
          onSave={(data) => {
            updatePrompt(editingPrompt.id, data);
            setEditingPrompt(null);
          }}
        />
      )}
    </section>
  );
}

/* ==========================================================================
   PROMPT EDITOR MODAL
   ========================================================================== */
interface PromptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData: PromptItem | null;
  onSave: (data: {
    title: string;
    category: PromptCategory;
    tags: string[];
    description: string;
    content: string;
    variables: string[];
  }) => void;
  onDelete?: (id: string) => void;
}

function PromptEditorModal({
  isOpen,
  onClose,
  title,
  initialData,
  onSave,
  onDelete,
}: PromptEditorModalProps) {
  const [promptTitle, setPromptTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState<PromptCategory>(
    initialData?.category || "Coding"
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags.join(", ") || ""
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [content, setContent] = useState(initialData?.content || "");

  // Auto-detect variables inside [bracket] and {{curly}}
  const detectedVariables = useMemo(() => {
    return extractVariables(content);
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptTitle.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    onSave({
      title: promptTitle.trim(),
      category,
      tags,
      description: description.trim(),
      content: content.trim(),
      variables: detectedVariables,
    });
  };

  const categories: PromptCategory[] = [
    "Coding",
    "Design",
    "Copywriting",
    "Marketing",
    "System Prompts",
  ];

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-[#050507]/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASES.expoOut }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl border border-white/20 bg-[#121216] p-6 md:p-8 chamfer-card-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] max-h-[90svh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#00F0FF]" />
            <h3 className="font-mono text-sm font-bold text-white tracking-wider">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-sm text-[#8A8A93] hover:text-white transition-colors"
          >
            [ESC]
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block font-mono text-xs text-[#8A8A93] mb-1">
              PROMPT TITLE *
            </label>
            <input
              type="text"
              required
              value={promptTitle}
              onChange={(e) => setPromptTitle(e.target.value)}
              placeholder="e.g. Next.js 16 High-Performance Server Action"
              className="w-full border border-white/15 bg-[#050507] p-3 font-mono text-xs text-white focus:border-[#00F0FF] focus:outline-none"
            />
          </div>

          {/* Category & Tags Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs text-[#8A8A93] mb-1">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PromptCategory)}
                className="w-full border border-white/15 bg-[#050507] p-3 font-mono text-xs text-white focus:border-[#00F0FF] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#121216]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs text-[#8A8A93] mb-1">
                TAGS (COMMA SEPARATED)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="TypeScript, Turbopack, Cache"
                className="w-full border border-white/15 bg-[#050507] p-3 font-mono text-xs text-white focus:border-[#00F0FF] focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-xs text-[#8A8A93] mb-1">
              SHORT SPECIFICATION / DESCRIPTION
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Operational intent and parameters..."
              className="w-full border border-white/15 bg-[#050507] p-3 font-mono text-xs text-white focus:border-[#00F0FF] focus:outline-none"
            />
          </div>

          {/* Prompt Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-mono text-xs text-[#8A8A93]">
                PROMPT PAYLOAD *
              </label>
              <span className="font-mono text-[10px] text-[#00F0FF]">
                TIP: USE {"{{variable}}"} FOR DYNAMIC SLOTS
              </span>
            </div>
            <textarea
              required
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or write your raw prompt text here. Any {{bracketedVariable}} will become an interactive slot..."
              className="w-full border border-white/15 bg-[#050507] p-3 font-mono text-xs text-white focus:border-[#00F0FF] focus:outline-none"
            />
          </div>

          {/* Detected Variables Feedback */}
          {detectedVariables.length > 0 && (
            <div className="border border-[#00F0FF]/30 bg-[#00F0FF]/5 p-3 chamfer-card font-mono text-xs">
              <span className="text-[#00F0FF] font-bold">DETECTED SLOTS: </span>
              <span className="text-white">
                {detectedVariables.map((v) => `{{${v}}}`).join(", ")}
              </span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            {initialData && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(initialData.id)}
                className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                DELETE NODE
              </button>
            ) : <span />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs text-[#8A8A93] hover:text-white chamfer-button"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="border border-[#00F0FF] bg-[#00F0FF] px-6 py-2 font-mono text-xs font-bold text-[#050507] hover:bg-white chamfer-button"
              >
                COMMIT TO VAULT
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
