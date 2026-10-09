"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { SPRINGS } from "@/lib/motion";

export function Cursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Magnetic spring physics for the outer ring
  const ringX = useSpring(mouseX, SPRINGS.magnetic);
  const ringY = useSpring(mouseY, SPRINGS.magnetic);

  useEffect(() => {
    // Only enable custom cursor if fine pointer is available (desktop mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const updateFinePointer = () => {
      setIsFinePointer(mediaQuery.matches);
      if (mediaQuery.matches) {
        document.body.classList.add("custom-cursor-active");
      } else {
        document.body.classList.remove("custom-cursor-active");
      }
    };

    updateFinePointer();
    mediaQuery.addEventListener("change", updateFinePointer);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, input, textarea, [data-interactive="true"], [role="button"], [data-magnetic]'
      );
      setIsHovered(Boolean(interactive));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", updateFinePointer);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isFinePointer || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Central 4px dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[99999] h-1 w-1 bg-white"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* 32px hollow reactive ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[99998] border"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: 32,
          height: 32,
          borderColor: isHovered ? "#00F0FF" : "rgba(0, 240, 255, 0.4)",
          backgroundColor: isHovered ? "rgba(0, 240, 255, 0.08)" : "transparent",
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
