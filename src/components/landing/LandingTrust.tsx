import { TRUST_ITEMS } from "./content";

export function LandingTrust() {
  return (
    <section
      id="trust"
      className="landing-section border-t border-[var(--landing-line)] px-5 py-20 sm:px-6 md:py-28 md:px-10"
    >
      <div className="mx-auto max-w-[1200px]">
        <h2 className="landing-reveal landing-display-font mb-12 text-center text-3xl font-extrabold tracking-tight md:mb-16 md:text-5xl">
          Спокойствие по умолчанию
        </h2>
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="landing-reveal rounded-2xl border border-[var(--landing-line)] bg-[color-mix(in_oklab,var(--landing-fg)_5%,transparent)] p-8 md:p-10"
            >
              <h3 className="text-lg font-semibold md:text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--landing-muted)] md:text-base">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
