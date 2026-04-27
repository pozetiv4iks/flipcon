import type { RefObject } from "react";
import { LandingBackgroundLine } from "@/src/components/assets/LandingBackgroundLine";

type Props = {
  pathRef: RefObject<SVGPathElement | null>;
};

export function LandingBackground({ pathRef }: Props) {
  return (
    <>
      <div
        className="landing-aurora pointer-events-none fixed inset-0 z-0"
        aria-hidden
      />
      <div
        className="landing-grain pointer-events-none fixed inset-0 z-[100]"
        aria-hidden
      />
      <LandingBackgroundLine pathRef={pathRef} />
    </>
  );
}
