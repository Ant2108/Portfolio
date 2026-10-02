import { Reveal } from "@/components/ui/reveal";
import { principles } from "@/data/portfolio";

export function Approach() {
  return (
    <section aria-labelledby="approach-title" className="border-y-4 border-double border-rule-strong bg-paper-deep/60">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label text-burgundy">Interlude — On method</p>
            <h2 id="approach-title" className="display mt-5 text-[2.2rem] text-ink sm:text-5xl">
              How I approach <em>the work.</em>
            </h2>
          </div>
          <p className="max-w-xs font-serif text-lg italic text-ink-soft">
            Four habits I try to keep, whatever the stack.
          </p>
        </Reveal>

        <ol className="grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={i * 110}
              className="border-b border-rule py-8 sm:px-6 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:py-4 lg:first:pl-0 lg:last:border-r-0"
            >
              <span aria-hidden className="display block text-6xl text-burgundy">
                {p.numeral}
              </span>
              <h3 className="label mt-6 text-ink">{p.title}</h3>
              <p className="mt-3 font-serif text-2xl leading-snug text-ink">{p.line}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
