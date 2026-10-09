"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import { frame, cancelFrame } from "motion/react";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    let active = true;

    const updateRaf = ({ timestamp }: { timestamp: number }) => {
      if (!active) return;
      lenisRef.current?.lenis?.raf(timestamp);
    };

    frame.update(updateRaf, true);

    return () => {
      active = false;
      cancelFrame(updateRaf);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        duration: 1.0,
        lerp: 0.1,
        smoothWheel: true,
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
}
