import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { interests, person } from "@/data/portfolio";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
      <SectionHeading
        id="about-title"
        number="01"
        label="About"
        aside="Folio 01"
        title={
          <>
            A developer who enjoys turning ideas into <em className="text-burgundy">working systems.</em>
          </>
        }
      />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-3">
          <p className="font-serif text-2xl italic leading-snug text-ink-soft">{person.positioning}</p>
        </Reveal>

        <Reveal delay={120} className="space-y-6 text-[1.05rem] leading-[1.75] text-ink-soft lg:col-span-5 lg:col-start-5">
          <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.6rem] first-letter:leading-[0.8] first-letter:text-burgundy">
            I&rsquo;m a software developer who leans towards the backend — the part of an application that stores the
            data, enforces the rules and answers the requests. Most of my projects start as an API and grow outwards
            from there.
          </p>
          <p>
            I&rsquo;ve built with Java and Spring Boot, C# and ASP.NET Core, and put React and Next.js interfaces on
            top of them. I like work that feels practical: stock counts that add up, access that is properly
            controlled, endpoints that behave the way their names suggest.
          </p>
          <p>
            Away from that, I make small games in Unity and Godot — a good place to practise thinking about state,
            timing and how something feels to use.
          </p>
        </Reveal>

        <Reveal delay={240} className="lg:col-span-3 lg:col-start-10">
          <div className="border-t border-ink pt-4">
            <h3 className="label text-ink-faint">Currently interested in</h3>
            <ul className="mt-4">
              {interests.map((item, i) => (
                <li key={item} className="flex items-baseline gap-4 border-b border-rule py-3">
                  <span className="font-serif text-sm italic text-burgundy">{String.fromCharCode(97 + i)}.</span>
                  <span className="font-serif text-xl text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
