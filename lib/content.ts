export interface SceneContent {
  intro: {
    terminalSteps: string[];
    subtext: string;
    skipPrompt: string;
  };
  hero: {
    badge: string;
    headlinePart1: string;
    headlinePart2: string;
    supportLine: string;
    primaryCta: string;
    secondaryCta: string;
    telemetry: {
      label: string;
      value: string;
      indicator: "active" | "standby" | "stable";
    }[];
  };
  manifesto: {
    words: string[];
    tagline: string;
    subtext: string;
  };
  vault: {
    badge: string;
    title: string;
    description: string;
    categories: {
      id: string;
      label: string;
      countHint: string;
      description: string;
    }[];
  };
  workbench: {
    badge: string;
    title: string;
    subtitle: string;
    addCta: string;
    searchPlaceholder: string;
    filterLabel: string;
  };
  finale: {
    headline: string;
    subtext: string;
    exportCta: string;
    importCta: string;
    wordmark: string;
    legal: string;
    badge: string;
  };
}

export const APP_CONTENT = {
  intro: {
    terminalSteps: [
      "INITIALIZING LOCAL STORAGE...",
      "VERIFYING CLIENT-SIDE ENCLAVE...",
      "LOADING NEURAL LATTICE...",
      "ZERO LATENCY ESTABLISHED.",
    ],
    subtext: "PromptNexus Core // Manoj Beta Session",
    skipPrompt: "PRESS ANY KEY OR CLICK TO BYPASS",
  },
  hero: {
    badge: "NEURAL LATTICE PROTOCOL v2.4 // BETA FOR MANOJ",
    headlinePart1: "YOUR AI ARSENAL.",
    headlinePart2: "ZERO LATENCY.",
    supportLine: "100% local. Zero database. Lightning fast.",
    primaryCta: "INITIALIZE VAULT",
    secondaryCta: "ADD FIRST PROMPT",
    telemetry: [
      { label: "STORAGE ENCLAVE", value: "LOCAL PERSIST", indicator: "active" },
      { label: "COPY LATENCY", value: "0.04 MS", indicator: "stable" },
      { label: "LATTICE DENSITY", value: "38 PROMPTS", indicator: "active" },
      { label: "SECURITY TIER", value: "AIR-GAPPED", indicator: "stable" },
    ],
  },
  manifesto: {
    words: [
      "STOP",
      "LOSING",
      "YOUR",
      "BEST",
      "PROMPTS",
      "IN",
      "CHAT",
      "HISTORIES.",
    ],
    tagline: "DATA FRAGMENTATION IS THE ENEMY OF EXPONENTIAL OUTPUT.",
    subtext:
      "Every top-tier engineer, prompter, and researcher wastes hours digging through fragmented LLM tabs. PromptNexus suspends your battle-tested prompts in a local dark-matter grid. One click. Zero network hops. Pure execution speed.",
  },
  vault: {
    badge: "PINNED ARCHITECTURE // CONTINUOUS STREAM",
    title: "THE VAULT",
    description:
      "Structured containment partitioned by operational discipline. Scroll to engage with each sector.",
    categories: [
      {
        id: "ALL",
        label: "ALL NODES",
        countHint: "38 PROMPTS",
        description: "Entire unified lattice of custom instructions, system roles, and generative rigs.",
      },
      {
        id: "Coding",
        label: "CODING",
        countHint: "8 NODES",
        description: "Strict TypeScript, server actions, optimistic UI, state machines, and API scaffolds.",
      },
      {
        id: "Design",
        label: "DESIGN",
        countHint: "8 NODES",
        description: "Midjourney v6 camera setups, lighting physics, render octane engine parameters.",
      },
      {
        id: "Copywriting",
        label: "COPYWRITING",
        countHint: "8 NODES",
        description: "Direct-response vectors, landing page hooks, objection guillotine frameworks.",
      },
      {
        id: "Marketing",
        label: "MARKETING",
        countHint: "7 NODES",
        description: "Growth loops, viral breakdowns, programmatic SEO, and launch sequences.",
      },
      {
        id: "System Prompts",
        label: "SYSTEM PROMPTS",
        countHint: "7 NODES",
        description: "Adversarial dialectic evaluation, Bayesian confidence scales, formal proofs.",
      },
    ],
  },
  workbench: {
    badge: "REAL-TIME WORKBENCH // INTERACTIVE HUB",
    title: "PROMPT COMMAND MATRIX",
    subtitle:
      "Deploy, test, and inject variables into your prompts with instant visual feedback and copy execution.",
    addCta: "ADD PROMPT",
    searchPlaceholder: "FILTER BY TITLE, TAG, OR PROMPT SYNTAX...",
    filterLabel: "ACTIVE SECTOR",
  },
  finale: {
    headline: "DATA SOVEREIGNTY BY DESIGN.",
    subtext:
      "Your intelligence stack belongs to you. Zero tracking, zero telemetry sent to third-party clouds, zero logins. Download your portable JSON archive at any millisecond.",
    exportCta: "EXPORT VAULT (JSON)",
    importCta: "IMPORT VAULT (JSON)",
    wordmark: "PROMPTNEXUS",
    legal: "PROMPTNEXUS ARCHITECTURE © 2026 // BUILT FOR MANOJ // BETA EDITION",
    badge: "LOCAL-FIRST AIR-GAPPED VAULT",
  },
} as const satisfies SceneContent;
