"use client";

import { useEffect, useState } from "react";

type Props = {
  lines: readonly string[];
  className?: string;
};

export function KineticHeadline({ lines, className = "" }: Props) {
  const [plain, setPlain] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPlain(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (plain) {
    return (
      <h1
        className={`landing-display-font text-[clamp(2.5rem,11vw,7.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] ${className}`}
      >
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line}
          </span>
        ))}
      </h1>
    );
  }

  return (
    <h1
      className={`landing-display-font text-[clamp(2.5rem,11vw,7.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] ${className}`}
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(/\s+/).filter(Boolean).map((word, wi) => (
            <span key={`${li}-${wi}`} className="mr-[0.12em] inline-block whitespace-nowrap">
              {Array.from(word).map((ch, ci) => (
                <span
                  key={`${li}-${wi}-${ci}`}
                  className="inline-block overflow-hidden pb-[0.04em] align-bottom"
                >
                  <span className="landing-kinetic-char inline-block">{ch}</span>
                </span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
