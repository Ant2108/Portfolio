import Image from "next/image";
import { HeroEngraving } from "@/components/sections/hero-engraving";
import { ArrowDown, ArrowRight, Ornament } from "@/components/ui/icons";
import { TechLogo } from "@/components/ui/tech-logos";
import { currentEntry, person, technologyIndex } from "@/data/portfolio";
import { projects } from "@/data/projects";
import { pad } from "@/lib/utils";

const techCount = technologyIndex.reduce((n, g) => n + g.items.length, 0);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="label text-ink-faint">{label}</dt>
      <dd className="mt-1 font-serif text-xl font-medium leading-tight text-burgundy">{children}</dd>
    </div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-[1440px] px-4 pb-20 pt-6 sm:px-6 lg:px-10 lg:pb-28">
      {/* Status line — archive counters */}
      <div className="fade-up flex flex-wrap items-end gap-x-6 gap-y-3 border-b border-rule pb-5">
        <p className="flex items-baseline gap-2">
          <span className="font-serif text-4xl font-medium leading-none text-ink">{pad(projects.length)}</span>
          <span className="label text-ink-soft">Entries catalogued</span>
        </p>
        <span aria-hidden className="mb-1 hidden h-6 w-px bg-rule-strong sm:block" />
        <p className="flex items-baseline gap-2">
          <span aria-hidden className="grid size-6 place-items-center border border-rule-strong font-serif text-base leading-none text-burgundy">
            +
          </span>
          <span className="font-serif text-4xl font-medium leading-none text-ink">{techCount}</span>
          <span className="label text-ink-soft">Technologies indexed</span>
        </p>
        <p className="label ml-auto hidden text-ink-faint md:block">Vol. I — A personal archive of work</p>
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-2 lg:mt-10 xl:grid-cols-[240px_minmax(0,1fr)_250px]">
        {/* Centre plate */}
        <div className="corners relative order-1 flex flex-col overflow-hidden border border-rule bg-paper-light/40 md:col-span-2 md:min-h-[680px] xl:order-2 xl:col-span-1">
          <div className="fade-up relative z-10 px-6 pt-8 text-center sm:px-12" style={{ "--delay": "200ms" } as React.CSSProperties}>
            <p className="label mx-auto max-w-xl leading-relaxed text-ink">
              Working through a network of requests, records and rules — turning ideas into systems that hold together.
            </p>
            <p className="label mt-3 text-[0.7rem] text-ink-faint">Plate I — engraving drawn in code</p>
          </div>

          <HeroEngraving className="relative -mb-16 -mt-2 aspect-[1000/760] w-full md:absolute md:inset-x-0 md:top-24 md:my-0 md:aspect-auto md:h-[58%]" />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] md:h-[50%] bg-linear-to-t from-paper from-40% via-paper/85 to-transparent"
          />

          <div className="relative z-10 mt-auto px-5 pb-8 text-center sm:px-10 sm:pb-12">
            <p
              className="fade-up label inline-block bg-burgundy px-4 py-2.5 text-paper-light sm:px-6 sm:text-sm"
              style={{ "--delay": "500ms" } as React.CSSProperties}
            >
              {person.title}
            </p>
            <h1
              id="hero-title"
              className="fade-up display mt-5 text-[3.4rem] leading-[1.05] text-ink sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[5.8rem] 2xl:text-[6.4rem]"
              style={{ "--delay": "650ms" } as React.CSSProperties}
            >
              <span className="italic text-burgundy">{person.familyName}</span> {person.givenName}
            </h1>
            <p
              className="fade-up mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-ink-soft"
              style={{ "--delay": "800ms" } as React.CSSProperties}
            >
              {person.intro}
            </p>
            <div
              className="fade-up mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
              style={{ "--delay": "950ms" } as React.CSSProperties}
            >
              <a
                href="#work"
                className="label group flex items-center justify-center gap-3 bg-ink px-6 py-4 text-paper-light transition-colors hover:bg-burgundy"
              >
                View selected work
                <ArrowDown className="h-4 w-2 transition-transform duration-500 group-hover:translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="label group flex items-center justify-center gap-3 border border-ink px-6 py-4 text-ink transition-colors hover:border-burgundy hover:text-burgundy"
              >
                Contact me
                <ArrowRight className="w-5 transition-transform duration-500 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Left — identity card */}
        <aside aria-label="Profile" className="fade-up order-2 xl:order-1" style={{ "--delay": "300ms" } as React.CSSProperties}>
          <div className="grid grid-cols-[minmax(0,130px)_1fr] gap-6 sm:grid-cols-[170px_1fr] xl:block">
            <figure className="corners self-start p-2">
              {/* The photo has a white background; multiply blends it into the paper. */}
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
                <Image
                  src={person.portrait}
                  alt={`Portrait of ${person.name}`}
                  fill
                  sizes="(min-width: 1280px) 240px, (min-width: 640px) 170px, 130px"
                  preload
                  className="object-cover object-top mix-blend-multiply [filter:sepia(0.12)_contrast(1.02)]"
                />
              </div>
            </figure>
            <dl className="space-y-5 xl:mt-8">
              <Field label="Name">{person.name}</Field>
              <Field label="Occupation">{person.title}</Field>
              <Field label="Focus">{person.focus}</Field>
              {person.availability && (
                <div>
                  <dt className="label text-ink-faint">Availability</dt>
                  <dd className="label mt-2 flex items-center justify-between bg-burgundy px-3 py-2 text-paper-light">
                    {person.availability}
                    <Ornament className="w-6 opacity-70" />
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <div className="mt-6">
            <p className="label text-ink-faint">Correspondence</p>
            <a
              href="#contact"
              className="label group mt-2 flex items-center justify-between border border-burgundy px-3 py-2.5 text-burgundy transition-colors hover:bg-burgundy hover:text-paper-light"
            >
              Open correspondence
              <ArrowRight className="w-5 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </div>
        </aside>

        {/* Right — current entry */}
        <aside
          aria-labelledby="current-entry"
          className="fade-up order-3 self-start border-l-2 border-burgundy"
          style={{ "--delay": "450ms" } as React.CSSProperties}
        >
          <h2 id="current-entry" className="label flex items-center justify-between bg-burgundy px-3 py-2 text-sm text-paper-light">
            Current entry
            <Ornament className="w-7 opacity-70" />
          </h2>
          <p className="label bg-paper-deep px-3 py-2 text-[0.7rem] text-ink-soft">{currentEntry.line}</p>
          <dl className="space-y-6 px-3 pt-6">
            <div>
              <dt className="label text-ink-faint">Entry name</dt>
              <dd className="mt-1 font-serif text-2xl font-medium leading-tight text-burgundy">{currentEntry.name}</dd>
            </div>
            <div>
              <dt className="label text-ink-faint">Goal</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{currentEntry.goal}</dd>
            </div>
            <div>
              <dt className="label text-ink-faint">Built with</dt>
              <dd className="mt-3 grid max-w-[16rem] grid-cols-3 gap-2">
                {currentEntry.stack.map((s) => (
                  <span key={s.label} className="flex flex-col items-center gap-2 text-center">
                    <span className="grid size-14 place-items-center border border-gold bg-paper-light shadow-[inset_0_0_0_3px_var(--paper-light),inset_0_0_0_4px_var(--rule)] transition-transform duration-300 hover:-translate-y-0.5">
                      <TechLogo name={s.icon} className="size-7" />
                    </span>
                    <span className="text-xs font-medium leading-tight text-ink-faint">{s.label}</span>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
