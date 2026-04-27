import { BrandTextLogo } from "./BrandTextLogo";
import { KineticHeadline } from "./KineticHeadline";
import { HERO_KINETIC_LINES } from "./content";

export function LandingHero() {
  return (
    <section className="landing-section relative z-10 flex min-h-[100dvh] flex-col justify-center px-5 pb-20 pt-28 sm:px-6 sm:pt-32 md:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-[min(50vh,480px)] bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,var(--landing-glow),transparent_65%)] blur-3xl" aria-hidden />

      <div className="mx-auto w-full max-w-[1200px]">
        <p className="landing-blur-in mb-8 flex max-w-xl flex-wrap items-center gap-2.5 text-[var(--landing-muted)]">
          <BrandTextLogo priority className="h-5 sm:h-6" />
          <span className="text-xs font-semibold uppercase tracking-[0.35em] md:text-sm">
            — бизнес-аналитика через нейросеть
          </span>
        </p>

        <KineticHeadline lines={HERO_KINETIC_LINES} />

        <p className="landing-blur-in mt-10 max-w-2xl text-pretty text-base leading-relaxed text-[var(--landing-muted)] md:mt-14 md:text-xl md:leading-snug">
          Создаётся единая картина: что происходит в репо, в разговоре с командой и
          на рынке. Система подскажет, кому поставить дедлайн исходя из стэка и
          загруженности. В персональной таблице — задачи, нейронка ведёт ТЗ, опираясь
          на гит, а для венчура и хакатонов — ветвит идеи и сопоставит их с трекшном
          и реальностью, чтобы у стартапа оставалась управляемая тропа.
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
