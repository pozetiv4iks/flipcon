import { BrandTextLogo } from "./BrandTextLogo";
import { WHY_LEAD } from "./content";

export function LandingWhy() {
  return (
    <section
      id="why"
      className="landing-section border-t border-[var(--landing-line)] px-5 py-24 sm:px-6 md:py-36 md:px-10"
    >
      <div className="mx-auto max-w-[1100px]">
        <p className="landing-reveal mb-6 flex flex-wrap items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--landing-muted)]">
          <span>Почему</span>
          <BrandTextLogo className="h-5" />
        </p>
        <p className="landing-reveal landing-display-font text-[clamp(1.5rem,4.2vw,3.75rem)] font-medium leading-[1.12] tracking-[-0.03em] text-[var(--landing-fg)]">
          {WHY_LEAD}
        </p>
      </div>
    </section>
  );
}
