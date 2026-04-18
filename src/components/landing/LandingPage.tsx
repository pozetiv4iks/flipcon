"use client";

import { useRef } from "react";
import { Unbounded } from "next/font/google";
import "@/src/styles/landing.css";
import { useLandingAnimations } from "@/src/hooks/useLandingAnimations";
import { LandingBackground } from "./LandingBackground";
import { LandingNav } from "./LandingNav";
import { LandingHero } from "./LandingHero";
import { LandingWhy } from "./LandingWhy";
import { LandingSplitBand } from "./LandingSplitBand";
import { LandingStats } from "./LandingStats";
import { LandingTools } from "./LandingTools";
import { LandingTrust } from "./LandingTrust";
import { LandingCTA } from "./LandingCTA";
import { LandingFooter } from "./LandingFooter";

const landingDisplay = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "800"],
  variable: "--font-landing-display",
});

export default function LandingPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const magneticBtnRef = useRef<HTMLDivElement>(null);

  useLandingAnimations({ mainRef, pathRef, magneticBtnRef });

  return (
    <div
      ref={mainRef}
      className={`landing-root ${landingDisplay.variable} selection:bg-[var(--landing-accent-soft)] selection:text-[var(--landing-fg)] relative min-h-screen overflow-x-hidden font-sans antialiased`}
    >
      <LandingBackground pathRef={pathRef} />
      <LandingNav magneticBtnRef={magneticBtnRef} />
      <main>
        <LandingHero />
        <LandingWhy />
        <LandingSplitBand />
        <LandingStats />
        <LandingTools />
        <LandingTrust />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
