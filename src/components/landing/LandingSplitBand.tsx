import { SPLIT_BAND } from "./content";

export function LandingSplitBand() {
  return (
    <section className="landing-section border-t border-[var(--landing-line)] px-5 py-20 sm:px-6 md:py-28 md:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-20">
        <h2 className="landing-reveal landing-display-font text-[clamp(2rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
          {SPLIT_BAND.headline.split(" ").map((w, i) => (
            <span key={i} className="block">
              {w}
            </span>
          ))}
        </h2>
        <p className="landing-reveal text-base leading-relaxed text-[var(--landing-muted)] md:text-lg lg:pb-2">
          {SPLIT_BAND.sub}
        </p>
      </div>
    </section>
  );
}
