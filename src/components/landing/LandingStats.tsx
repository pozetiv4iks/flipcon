import { STATS } from "./content";

export function LandingStats() {
  return (
    <section className="landing-section border-y border-[var(--landing-line)] bg-[color-mix(in_oklab,var(--landing-fg)_4%,transparent)] px-5 py-16 sm:px-6 md:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 md:gap-x-12">
        {STATS.map((stat) => (
          <div key={stat.label} className="landing-reveal text-left">
            <div className="mb-3 flex flex-wrap items-baseline gap-x-0.5 font-bold tabular-nums text-[var(--landing-fg)] [font-size:clamp(2rem,5vw,3.5rem)] leading-none">
              <span className="landing-stat-value">{stat.value}</span>
              {stat.suffix ? (
                <span className="text-[0.65em] font-semibold text-[var(--landing-muted)]">
                  {stat.suffix}
                </span>
              ) : null}
            </div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--landing-muted)] md:text-xs">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
