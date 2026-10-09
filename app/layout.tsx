import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { NoiseGrain } from "@/components/ui";
import { ToastContainer } from "@/components/Toast";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PromptNexus // Local-First Neural Lattice Prompt Manager",
  description:
    "Cinematic, zero-latency, local-first prompt manager for Manoj in Beta. Organize, test, and inject variables into your AI prompt arsenal with instant keystroke retrieval.",
  keywords: [
    "Prompt Manager",
    "Local-First",
    "Prompt Engineering",
    "AI Prompts",
    "Neural Lattice",
    "Zustand",
    "Next.js",
  ],
  authors: [{ name: "Manoj" }],
  openGraph: {
    title: "PromptNexus // Zero-Latency AI Prompt Manager",
    description:
      "100% local. Zero database. Instant clipboard injection for power users.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} dark`}
    >
      <head>
        <noscript>
          <style>{`
            [data-reveal], [data-motion] {
              opacity: 1 !important;
              transform: none !important;
            }
          `}</style>
        </noscript>
      </head>
      <body className="bg-[#050507] text-[#8A8A93] min-h-svh antialiased selection:bg-[#00F0FF] selection:text-[#050507]">
        <MotionConfig reducedMotion="user">
          <SmoothScroll>
            <Cursor />
            <NoiseGrain />
            <ToastContainer />
            {children}
          </SmoothScroll>
        </MotionConfig>
      </body>
    </html>
  );
}
