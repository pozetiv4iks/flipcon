import type { RefObject } from "react";

type LandingBackgroundLineProps = {
  pathRef: RefObject<SVGPathElement | null>;
};

export function LandingBackgroundLine({
  pathRef,
}: LandingBackgroundLineProps) {
  return (
    <svg
      className="pointer-events-none absolute top-0 left-1/2 z-0 hidden h-full w-[min(100%,900px)] -translate-x-1/2 md:block"
      viewBox="0 0 1000 6200"
      fill="none"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden
    >
      <path
        ref={pathRef}
        d="M120,0 C280,420 820,900 500,1600 C180,2350 900,2900 480,3600 C140,4150 760,4700 500,5400 L500,6200"
        stroke="url(#landingLine)"
        strokeWidth="1.25"
        strokeLinecap="round"
        className="opacity-[0.22]"
      />
      <defs>
        <linearGradient id="landingLine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="45%" stopColor="#a8a4c8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#040035" stopOpacity="0.35" />
        </linearGradient>
      </defs>
    </svg>
  );
}
