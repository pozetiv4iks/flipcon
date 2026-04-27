import type { RefObject } from "react";

type MainPageLineProps = {
  pathRef: RefObject<SVGPathElement | null>;
};

export function MainPageLine({ pathRef }: MainPageLineProps) {
  return (
    <svg
      className="absolute top-0 left-1/2 z-0 hidden -translate-x-1/2 pointer-events-none md:block"
      width="1000"
      height="100%"
      viewBox="0 0 1000 6000"
      fill="none"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden
    >
      <path
        ref={pathRef}
        d="M500,0 C600,500 400,800 500,1500 C650,2200 350,2800 500,3500 C700,4200 300,4800 500,5500 L500,6000"
        stroke="url(#lineGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="opacity-30"
      />
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
    </svg>
  );
}
