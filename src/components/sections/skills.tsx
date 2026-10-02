import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { technologyIndex } from "@/data/portfolio";
import { pad } from "@/lib/utils";

const total = technologyIndex.reduce((n, g) => n + g.items.length, 0);

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
      <SectionHeading
        id="skills-title"
        number="02"
        label="Skills"
        aside={`${total} entries`}
        title={
          <>
            Technology <em className="text-burgundy">index.</em>
          </>
        }
      />

      <Reveal>
        <p className="mb-10 max-w-md text-sm leading-relaxed text-ink-soft">
          The tools that appear across my projects, grouped by where they sit in a system.
        </p>
      </Reveal>

      <ol className="border-b border-ink">
        {technologyIndex.map((group, i) => (
          <Reveal
            as="li"
            key={group.group}
            delay={i * 70}
            className="group grid gap-x-8 gap-y-3 border-t border-ink py-7 transition-colors hover:bg-paper-deep/50 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.1fr)] md:py-9 lg:grid-cols-[6rem_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.6fr)] lg:px-2"
          >
            <span className="font-serif text-lg italic text-burgundy">{pad(i + 1)}</span>
            <h3 className="display text-4xl text-ink lg:text-5xl">{group.group}</h3>
            <p className="font-serif text-lg italic text-ink-faint md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-start-1 lg:pt-2">
              {group.note}
            </p>
            <ul className="flex flex-wrap gap-x-1 gap-y-2 md:col-start-3 md:row-span-2 md:row-start-1 lg:col-start-4 lg:pt-2.5">
              {group.items.map((item, k) => (
                <li key={item} className="label text-[0.75rem] text-ink">
                  {item}
                  {k < group.items.length - 1 && (
                    <span aria-hidden className="mx-2 text-gold">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
