import type { Transition, Variants } from "motion/react";

// MOTION TOKENS - Strictly aligned with Motion System specifications
export const EASES = {
  expoOut: [0.16, 1, 0.3, 1] as const,
  quartInOut: [0.76, 0, 0.24, 1] as const,
  softOut: [0.22, 1, 0.36, 1] as const,
} as const;

export const SPRINGS = {
  snappy: {
    type: "spring",
    stiffness: 400,
    damping: 32,
    mass: 0.6,
  } as const,
  soft: {
    type: "spring",
    stiffness: 120,
    damping: 22,
    mass: 1,
  } as const,
  magnetic: {
    type: "spring",
    stiffness: 180,
    damping: 14,
    mass: 0.15,
  } as const,
} as const;

export const DURATIONS = {
  micro: 0.25,
  element: 0.8,
  scene: 1.4,
} as const;

export const STAGGERS = {
  char: 0.025,
  word: 0.05,
  line: 0.08,
} as const;

// MOTION RECIPES & VARIANTS

export const maskedLineVariants: Variants = {
  hidden: {
    y: "110%",
    opacity: 0,
  },
  visible: (i: number = 0) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATIONS.element,
      ease: EASES.expoOut,
      delay: i * STAGGERS.line,
    },
  }),
};

export const clipRevealVariants: Variants = {
  hidden: {
    clipPath: "inset(100% 0 0 0)",
    opacity: 0,
  },
  visible: {
    clipPath: "inset(0% 0 0 0)",
    opacity: 1,
    transition: {
      duration: DURATIONS.element,
      ease: EASES.expoOut,
    },
  },
};

export const blurInVariants: Variants = {
  hidden: {
    filter: "blur(12px)",
    opacity: 0,
    transform: "translate3d(0, 20px, 0)",
  },
  visible: (delay: number = 0) => ({
    filter: "blur(0px)",
    opacity: 1,
    transform: "translate3d(0, 0px, 0)",
    transition: {
      duration: DURATIONS.element,
      ease: EASES.expoOut,
      delay,
    },
  }),
};

export const scaleSettleVariants: Variants = {
  hidden: {
    scale: 1.08,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: DURATIONS.scene,
      ease: EASES.expoOut,
    },
  },
};

export const curtainRevealTransition: Transition = {
  duration: DURATIONS.scene,
  ease: EASES.quartInOut,
};

export const fadeTransition: Transition = {
  duration: DURATIONS.element,
  ease: EASES.softOut,
};
