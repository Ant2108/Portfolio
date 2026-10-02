import { ArrowRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { contact } from "@/data/portfolio";

/** "https://www.linkedin.com/in/%C3%A1nh/" → "linkedin.com/in/ánh" */
function prettyUrl(href: string) {
  const short = href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  try {
    return decodeURIComponent(short);
  } catch {
    return short;
  }
}

const channels = [
  { label: "Email", href: contact.email ? `mailto:${contact.email}` : "", value: contact.email },
  ...contact.links.map((l) => ({ label: l.label, href: l.href, value: prettyUrl(l.href) })),
];

// The main call to action uses the first channel that has been filled in.
const primary = channels.find((c) => c.href);

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
      <Reveal className="flex items-center gap-4 border-t border-ink pt-4">
        <span className="label text-burgundy">05</span>
        <span aria-hidden className="h-px w-8 bg-rule-strong" />
        <span className="label text-ink-soft">Contact</span>
        <span className="label ml-auto hidden text-ink-faint sm:block">The final page</span>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-8">
          <h2 id="contact-title" className="display text-[3rem] text-ink sm:text-7xl xl:text-[7.5rem]">
            Let&rsquo;s build
            <br />
            something
            <br />
            <em className="text-burgundy">useful.</em>
          </h2>
          <p className="mt-10 max-w-sm font-serif text-2xl italic leading-snug text-ink-soft">
            Have a project, an idea, or an opportunity? I&rsquo;d like to hear about it.
          </p>
          {primary ? (
            <a
              href={primary.href}
              className="label group mt-8 inline-flex items-center gap-4 border-b border-burgundy pb-2 text-base text-burgundy"
            >
              Get in touch
              <ArrowRight className="w-8 transition-transform duration-500 group-hover:translate-x-2" />
            </a>
          ) : (
            <p className="label mt-8 text-ink-faint">Contact details forthcoming</p>
          )}
        </Reveal>

        <Reveal delay={150} className="lg:col-span-4 lg:self-end">
          <h3 className="label text-ink-faint">Correspondence</h3>
          <dl className="mt-4 border-t border-ink">
            {channels.map((c) => (
              <div key={c.label} className="flex items-baseline justify-between gap-6 border-b border-rule py-4">
                <dt className="label text-ink">{c.label}</dt>
                <dd className="min-w-0 text-right">
                  {c.href ? (
                    <a
                      href={c.href}
                      className="link-draw block truncate font-serif text-lg text-burgundy"
                      {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {c.value || "Open"}
                    </a>
                  ) : (
                    <span className="font-serif text-lg italic text-ink-faint">forthcoming</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p aria-hidden className="mt-14 text-center font-serif text-xl italic text-ink-faint">
            — Fin. —
          </p>
        </Reveal>
      </div>
    </section>
  );
}
