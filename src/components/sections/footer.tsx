import { person } from "@/data/portfolio";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-[1440px] px-4 pb-10 sm:px-6 lg:px-10">
      <div className="grid gap-4 border-t-4 border-double border-rule-strong pt-6 sm:grid-cols-[1fr_auto_auto] sm:items-baseline sm:gap-10">
        <p className="flex flex-wrap items-baseline gap-x-3">
          <span className="font-serif text-lg text-ink">{person.name}</span>
          <span className="label text-ink-faint">{person.title}</span>
        </p>
        <p className="label text-ink-faint">
          © {new Date().getFullYear()} · Built with Next.js
        </p>
        <a href="#main" className="label link-draw w-fit text-ink-soft hover:text-burgundy">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
