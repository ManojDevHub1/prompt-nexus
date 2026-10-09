"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useToastStore } from "@/store/useToastStore";
import { EASES } from "@/lib/motion";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-6 right-6 z-[100000] flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              duration: 0.35,
              ease: EASES.expoOut,
            }}
            className="pointer-events-auto relative border border-[#00F0FF] bg-[#121216]/95 p-4 text-white shadow-[0_0_25px_rgba(0,240,255,0.28)] backdrop-blur-md chamfer-card"
          >
            {/* Top Cyan Status Line */}
            <div className="flex items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#00F0FF] animate-pulse shadow-[0_0_8px_#00F0FF]" />
                <span className="font-bold text-[#00F0FF] tracking-wider uppercase">
                  {toast.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-[#8A8A93] hover:text-white transition-colors"
                aria-label="Dismiss toast"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            {toast.description && (
              <p className="mt-2 font-mono text-xs text-[#8A8A93] leading-relaxed line-clamp-2">
                {toast.description}
              </p>
            )}

            {/* Progress indicator bar (2.5s) */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: (toast.durationMs || 2500) / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00F0FF] origin-left"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
