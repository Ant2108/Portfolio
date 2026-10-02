import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { journey } from "@/data/portfolio";
import { pad } from "@/lib/utils";

export function Journey() {
  return (
    <section id="journey" aria-labelledby="journey-title" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
      <SectionHeading
        id="journey-title"
        number="04"
        label="Journey"
        title={
          <>
            Learning &amp; development <em className="text-burgundy">journey.</em>
          </>
        }
      />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="font-serif text-2xl italic leading-snug text-ink-soft">
              A sequence rather than a résumé — the order in which the pieces came together.
            </p>
            <p className="label mt-6 text-ink-faint">{journey.length} chapters</p>
          </div>
        </Reveal>

        <ol className="relative lg:col-span-8 lg:col-start-5">
          <span aria-hidden className="absolute bottom-3 left-[0.4rem] top-3 w-px bg-rule-strong sm:left-[0.45rem]" />
          {journey.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 80} className="relative grid gap-x-8 pb-12 pl-10 last:pb-0 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:pl-12">
              <span aria-hidden className="absolute left-0 top-2.5 size-[0.85rem] rotate-45 border border-burgundy bg-paper sm:size-[0.95rem]">
                <span className="absolute inset-[3px] bg-burgundy" />
              </span>
              <span className="font-serif text-lg italic text-burgundy">{pad(i + 1)}</span>
              <div className="border-b border-rule pb-10">
                <h3 className="display text-4xl text-ink sm:text-5xl">{step.title}</h3>
                <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">{step.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {step.tags.map((tag) => (
                    <li key={tag} className="label border border-rule px-2.5 py-1 text-[0.7rem] text-ink-soft">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
