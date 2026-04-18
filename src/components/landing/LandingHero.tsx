import { KineticHeadline } from "./KineticHeadline";
import { HERO_KINETIC_LINES } from "./content";

export function LandingHero() {
  return (
    <section className="landing-section relative z-10 flex min-h-[100dvh] flex-col justify-center px-5 pb-20 pt-28 sm:px-6 sm:pt-32 md:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-[min(50vh,480px)] bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,var(--landing-glow),transparent_65%)] blur-3xl" aria-hidden />

      <div className="mx-auto w-full max-w-[1200px]">
        <p className="landing-blur-in mb-8 max-w-xl text-xs font-semibold uppercase tracking-[0.35em] text-[var(--landing-muted)] md:text-sm">
          flipcon — очередь без шума
        </p>

        <KineticHeadline lines={HERO_KINETIC_LINES} />

        <p className="landing-blur-in mt-10 max-w-2xl text-pretty text-base leading-relaxed text-[var(--landing-muted)] md:mt-14 md:text-xl md:leading-snug">
          Профессиональный инструмент для команд: одна ясная лента задач вместо
          десяти чатов. Сфокусируйтесь на сути — мы держим порядок и темп.
        </p>

        <div className="landing-blur-in mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5">
          <a
            href="#cta"
            className="inline-flex h-14 min-w-[200px] items-center justify-center rounded-full bg-[var(--landing-fg)] px-8 text-sm font-semibold text-[var(--landing-bg)] transition-[transform,filter] hover:brightness-110 active:scale-[0.99]"
          >
            Ранний доступ
          </a>
          <a
            href="#tools"
            className="inline-flex h-14 min-w-[200px] items-center justify-center rounded-full border border-[var(--landing-line)] px-8 text-sm font-semibold text-[var(--landing-fg)] transition-colors hover:border-[color-mix(in_oklab,var(--landing-fg)_45%,var(--landing-line))]"
          >
            Смотреть возможности
          </a>
        </div>
      </div>
    </section>
  );
}
