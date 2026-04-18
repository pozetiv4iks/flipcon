"use client";

import { useState, type RefObject } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "./content";

type Props = {
  magneticBtnRef: RefObject<HTMLDivElement | null>;
};

export function LandingNav({ magneticBtnRef }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-[70] w-full border-b border-[var(--landing-line)] bg-[color-mix(in_oklab,var(--landing-bg)_72%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-5 sm:px-6">
        <a href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-accent-soft)] text-sm font-semibold tracking-tight text-[var(--landing-accent)] transition-transform duration-300 group-hover:-rotate-6">
            fc
          </span>
          <span className="text-lg font-semibold tracking-tight">flipcon</span>
        </a>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Основное">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-fg)]"
            >
              {item.label}
            </a>
          ))}
          <div ref={magneticBtnRef}>
            <a
              href="#cta"
              className="inline-flex rounded-full bg-[var(--landing-fg)] px-5 py-2 text-sm font-semibold text-[var(--landing-bg)] transition-[transform,box-shadow] duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.35)]"
            >
              Войти в список
            </a>
          </div>
        </nav>

        <button
          type="button"
          className="rounded-xl p-2 text-[var(--landing-muted)] md:hidden"
          aria-expanded={open}
          aria-controls="landing-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div
          id="landing-mobile-nav"
          className="border-t border-[var(--landing-line)] bg-[var(--landing-bg)] px-5 py-6 md:hidden"
        >
          <div className="flex flex-col gap-5">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-base font-medium"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#cta"
              className="rounded-2xl bg-[var(--landing-accent)] py-3.5 text-center text-sm font-semibold text-[var(--landing-bg)]"
              onClick={() => setOpen(false)}
            >
              Войти в список
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
