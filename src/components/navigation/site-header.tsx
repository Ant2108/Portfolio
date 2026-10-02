"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, person, type SectionId } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { ReaderTime } from "@/components/navigation/reader-time";

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    // A section is "active" once it crosses the upper third of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((s) => observer.observe(s));

    // Clear the indicator when scrolled back up into the hero.
    const onScroll = () => {
      const first = sections[0];
      if (first && first.getBoundingClientRect().top > window.innerHeight * 0.4) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  return enabled ? active : null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-serif text-xl font-medium tracking-tight text-ink">{person.name}</span>
          <span className="label hidden text-ink-faint transition-colors group-hover:text-burgundy sm:inline">
            / Archive
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden md:block">
          <ol className="flex items-center gap-1 lg:gap-3">
            {navigation.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`/#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "group relative flex items-baseline gap-1.5 px-2 py-2 transition-colors",
                      isActive ? "text-ink" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    <span className="font-serif text-sm italic text-burgundy">{item.number}</span>
                    <span className="label">{item.label}</span>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-2 -bottom-[13px] h-[2px] origin-left bg-burgundy transition-transform duration-500",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50",
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="hidden border-l border-rule pl-6 lg:block">
          <ReaderTime />
        </div>

        <button
          type="button"
          className="label ml-auto flex items-center gap-3 py-2 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-index"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Index"}
          <span aria-hidden className="relative block h-3 w-5">
            <span
              className={cn(
                "absolute left-0 top-0.5 h-px w-5 bg-ink transition-transform duration-300",
                open && "translate-y-1 rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute bottom-0.5 left-0 h-px w-5 bg-ink transition-transform duration-300",
                open && "-translate-y-1 -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      {/* Mobile index sheet */}
      <div
        id="mobile-index"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-rule bg-paper md:hidden"
      >
        <nav aria-label="Mobile" className="px-4 pb-10 pt-6 sm:px-6">
          <p className="label mb-4 text-ink-faint">Index of contents</p>
          <ol>
            {navigation.map((item) => (
              <li key={item.id} className="border-b border-rule">
                <a
                  href={`/#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-5 py-5"
                >
                  <span className="font-serif text-lg italic text-burgundy">{item.number}</span>
                  <span className="display text-4xl text-ink">{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <ReaderTime />
          </div>
        </nav>
      </div>
    </header>
  );
}
