import Link from "next/link";
import { BrandTextLogo } from "./BrandTextLogo";

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-[var(--landing-line)] px-5 py-16 sm:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-8 md:flex-row md:items-end">
        <div className="text-center md:text-left">
          <p className="mb-0">
            <BrandTextLogo className="mx-auto h-7 md:mx-0" />
          </p>
          <p className="mt-2 max-w-sm text-sm text-[var(--landing-muted)]">
            Нейро-аналитика по коду, людям и рынку. Дедлайны, кто в работе, ТЗ с
            репо — и путь идеи для стартап-команды.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-xs font-medium uppercase tracking-[0.25em] text-[var(--landing-muted)]">
          <Link href="/" className="transition-colors hover:text-[var(--landing-fg)]">
            Главная
          </Link>
          <a href="#tools" className="transition-colors hover:text-[var(--landing-fg)]">
            Возможности
          </a>
          <Link
            href="/login"
            className="transition-colors hover:text-[var(--landing-fg)]"
          >
            Вход
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-[1200px] text-center text-[10px] uppercase tracking-[0.4em] text-[var(--landing-muted)]">
        © 2026
      </p>
    </footer>
  );
}
