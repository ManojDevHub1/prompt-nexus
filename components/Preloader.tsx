"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { APP_CONTENT } from "@/lib/content";
import { EASES } from "@/lib/motion";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const completeBoot = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setShouldRender(false);
      onComplete();
      sessionStorage.setItem("promptnexus_boot_completed", "true");
    }, 450);
  }, [onComplete]);

  useEffect(() => {
    // If user has already seen preloader in this session, skip unless forced
    const hasBooted = sessionStorage.getItem("promptnexus_boot_completed");
    if (hasBooted === "true") {
      setShouldRender(false);
      onComplete();
      return;
    }

    // Step through boot lines rapidly to finish within ~1.2s
    const lines = APP_CONTENT.intro.terminalSteps;
    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => {
        if (prev < lines.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(completeBoot, 350);
          return prev;
        }
      });
    }, 280);

    const handleKeyDown = () => {
      completeBoot();
    };

    window.addEventListener("keydown", handleKeyDown, { once: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [completeBoot, onComplete]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="preloader-overlay"
        onClick={completeBoot}
        className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#050507] text-[#FFFFFF] select-none"
        animate={{
          clipPath: isExiting
            ? "circle(0% at 50% 50%)"
            : "circle(150% at 50% 50%)",
          opacity: isExiting ? 0 : 1,
        }}
        transition={{
          duration: 0.45,
          ease: EASES.expoOut,
        }}
      >
        {/* Flash white backdrop during exit */}
        {isExiting && (
          <motion.div
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-0 bg-white"
          />
        )}

        <div className="w-full max-w-xl px-6">
          {/* Header indicator */}
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-3 text-xs tracking-wider text-[#8A8A93]">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 animate-ping bg-[#00F0FF]" />
              <span className="text-[#00F0FF]">CORE KERNEL</span>
              <span>// 0.9.4-BETA</span>
            </div>
            <span>LOC: MANOJ-CLIENT</span>
          </div>

          {/* Terminal log steps */}
          <div className="space-y-2 font-mono text-sm">
            {APP_CONTENT.intro.terminalSteps.slice(0, currentLineIndex + 1).map((step, idx) => {
              const isCurrent = idx === currentLineIndex;
              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 transition-opacity ${
                    isCurrent ? "text-white" : "text-[#8A8A93]"
                  }`}
                >
                  <span className="text-[#00F0FF]">{`>`}</span>
                  <span>{step}</span>
                  {isCurrent && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="inline-block h-4 w-2 bg-[#00F0FF]"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Skip prompt */}
          <div className="mt-12 flex items-center justify-between text-[11px] text-[#8A8A93]/60 tracking-wider">
            <span>{APP_CONTENT.intro.subtext}</span>
            <span className="hover:text-[#00F0FF] transition-colors cursor-pointer">
              [{APP_CONTENT.intro.skipPrompt}]
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
