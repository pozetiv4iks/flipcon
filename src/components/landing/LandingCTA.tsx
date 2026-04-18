export function LandingCTA() {
  return (
    <section
      id="cta"
      className="landing-section border-t border-[var(--landing-line)] px-5 py-28 text-center sm:px-6 md:py-40"
    >
      <div className="landing-reveal mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--landing-muted)]">
          Старт
        </p>
        <h2 className="landing-display-font mt-6 text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
          Готовы убрать шум из очереди?
        </h2>
        <p className="mt-6 text-pretty text-[var(--landing-muted)] md:text-lg">
          Ранний доступ по приглашению — оставьте контакт, мы напишем, когда
          будет не стыдно показать продукт.
        </p>
        <div className="relative mx-auto mt-12 inline-block w-full max-w-md">
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[var(--landing-fg)] opacity-15 blur-3xl" />
          <a
            href="/registraition"
            className="relative inline-flex h-16 w-full items-center justify-center rounded-full bg-[var(--landing-fg)] px-10 text-sm font-semibold text-[var(--landing-bg)] transition-[transform,filter] hover:brightness-110 active:scale-[0.99]"
          >
            Оставить контакт
          </a>
        </div>
      </div>
    </section>
  );
}
