import { ArrowUpRight } from "lucide-react";
import { TOOLS } from "./content";

export function LandingTools() {
  return (
    <section
      id="tools"
      className="landing-section border-t border-[var(--landing-line)]"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-6 md:px-10 md:py-32">
        <div className="mb-14 max-w-2xl md:mb-20">
          <p className="landing-reveal text-xs font-semibold uppercase tracking-[0.3em] text-[var(--landing-muted)]">
            Возможности
          </p>
          <h2 className="landing-reveal landing-display-font mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            Инструменты
          </h2>
          <p className="landing-reveal mt-4 text-[var(--landing-muted)] md:text-lg">
            Четыре опоры — от входящих до границ доступа. Крупные заголовки и
            сетка вместо бесконечных подменю.
          </p>
        </div>
      </div>

      <div className="landing-tools-pin border-y border-[var(--landing-line)]">
        <div className="landing-tools-viewport">
          <div className="landing-tools-track">
            {TOOLS.map((tool) => (
              <article
                key={tool.slug}
                className="landing-tool-panel landing-tool-card group"
              >
                <div className="landing-reveal mx-auto flex h-full max-w-[1200px] flex-col justify-center px-5 py-16 sm:px-6 md:px-10">
                  <div className="mb-10 flex items-start justify-between gap-4">
                    <span className="text-[var(--landing-muted)]">{tool.icon}</span>
                    <span className="rounded-full border border-[var(--landing-line)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--landing-muted)]">
                      {tool.slug}
                    </span>
                  </div>
                  <h3 className="landing-display-font text-[clamp(2.25rem,6vw,4.25rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
                    {tool.title}
                  </h3>
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--landing-muted)] md:text-lg">
                    {tool.body}
                  </p>
                  <a
                    href="#cta"
                    className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-fg)] opacity-90 transition-[gap,opacity] hover:gap-3 hover:opacity-100"
                  >
                    К старту
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
