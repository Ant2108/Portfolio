import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectPlate, plateCaption } from "@/components/projects/project-plate";
import { ArrowRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { getProject, orderedProjects } from "@/data/projects";
import { displayYear, pad } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return orderedProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description, type: "article" },
  };
}

function ExternalLink({ href, empty }: { href: string; empty: string }) {
  if (!href) return <span className="font-serif text-lg italic text-ink-faint">{empty}</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-draw block truncate font-serif text-lg text-burgundy">
      {href.replace(/^https?:\/\/(www\.)?/, "")}
    </a>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = orderedProjects.findIndex((p) => p.slug === slug);
  const prev = orderedProjects[index - 1];
  const next = orderedProjects[index + 1];

  return (
    <article className="mx-auto max-w-[1440px] px-4 pb-24 pt-8 sm:px-6 lg:px-10">
      <nav aria-label="Breadcrumb" className="fade-up flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-5">
        <ol className="label flex items-center gap-2 text-ink-faint">
          <li>
            <Link href="/" className="link-draw hover:text-ink">
              Archive
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/#work" className="link-draw hover:text-ink">
              Work
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            {project.title}
          </li>
        </ol>
        <p className="label text-ink-faint">
          Entry {pad(index + 1)} of {pad(orderedProjects.length)}
        </p>
      </nav>

      <header className="fade-up mt-12 lg:mt-20" style={{ "--delay": "150ms" } as React.CSSProperties}>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <span className="font-serif text-xl italic text-burgundy">No. {pad(index + 1)}</span>
          <span className="label text-ink-faint">{project.category}</span>
          <span className="label text-ink-faint">{displayYear(project.year)}</span>
        </div>
        <h1 className="display mt-5 text-[2.8rem] text-ink sm:text-7xl lg:text-[6.5rem]">{project.title}</h1>
        <p className="mt-6 max-w-2xl font-serif text-2xl italic leading-snug text-ink-soft sm:text-3xl">
          {project.description}
        </p>
      </header>

      <div className="fade-up mt-12 lg:mt-16" style={{ "--delay": "300ms" } as React.CSSProperties}>
        <ProjectPlate
          src={project.image}
          alt={project.imageAlt}
          plate={index + 2}
          caption={plateCaption(project.image, project.title)}
          sizes="(min-width: 1440px) 1360px, 100vw"
          eager
        />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-10">
        <Reveal as="div" className="lg:col-span-4">
          <dl className="border-t border-ink">
            <div className="border-b border-rule py-4">
              <dt className="label text-ink-faint">Category</dt>
              <dd className="mt-1 font-serif text-lg text-ink">{project.category}</dd>
            </div>
            <div className="border-b border-rule py-4">
              <dt className="label text-ink-faint">Year</dt>
              <dd className="mt-1 font-serif text-lg text-ink">{displayYear(project.year)}</dd>
            </div>
            <div className="border-b border-rule py-4">
              <dt className="label text-ink-faint">Technologies</dt>
              <dd className="mt-2">
                <ul className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <li key={t} className="label border border-rule px-2.5 py-1 text-[0.7rem] text-ink">
                      {t}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="border-b border-rule py-4">
              <dt className="label text-ink-faint">Repository</dt>
              <dd className="mt-1">
                <ExternalLink href={project.githubUrl} empty="forthcoming" />
              </dd>
            </div>
            <div className="border-b border-rule py-4">
              <dt className="label text-ink-faint">Live demo</dt>
              <dd className="mt-1">
                <ExternalLink href={project.liveUrl} empty="not deployed" />
              </dd>
            </div>
          </dl>
        </Reveal>

        <div className="space-y-16 lg:col-span-7 lg:col-start-6">
          <Reveal as="div">
            <h2 className="label text-burgundy">Overview</h2>
            <p className="mt-5 text-[1.08rem] leading-[1.8] text-ink-soft first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.6rem] first-letter:leading-[0.8] first-letter:text-burgundy">
              {project.overview}
            </p>
          </Reveal>

          <Reveal as="div">
            <h2 className="label text-burgundy">Key features</h2>
            <ol className="mt-5 border-t border-ink">
              {project.features.map((f, i) => (
                <li key={f} className="flex items-baseline gap-6 border-b border-rule py-4">
                  <span className="w-6 shrink-0 font-serif text-base italic text-burgundy">{pad(i + 1)}</span>
                  <span className="font-serif text-xl leading-snug text-ink sm:text-2xl">{f}</span>
                </li>
              ))}
            </ol>
          </Reveal>

        </div>
      </div>

      {project.gallery && project.gallery.length > 0 && (
        <section aria-labelledby="plates-title" className="mt-24 lg:mt-32">
          <Reveal className="flex items-center gap-4 border-t border-ink pt-4">
            <h2 id="plates-title" className="label text-burgundy">
              Plates
            </h2>
            <span aria-hidden className="h-px w-8 bg-rule-strong" />
            <span className="label text-ink-soft">
              {project.gallery.length} {project.gallery.length === 1 ? "figure" : "figures"}
            </span>
          </Reveal>
          <div className="mt-10 space-y-16 lg:space-y-24">
            {project.gallery.map((img, i) => (
              <Reveal key={img.src}>
                <ProjectPlate
                  src={img.src}
                  alt={img.alt}
                  plate={i + 1}
                  label={`Fig. ${i + 1}`}
                  caption={img.caption}
                  sizes="(min-width: 1440px) 1360px, 100vw"
                />
                <a
                  href={img.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label link-draw mt-2 inline-block text-burgundy"
                >
                  Open full size ↗
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <nav aria-label="More entries" className="mt-24 grid border-y border-ink sm:grid-cols-2">
        {prev ? (
          <Link href={`/projects/${prev.slug}`} className="group border-b border-rule py-8 sm:border-b-0 sm:border-r sm:pr-8">
            <span className="label text-ink-faint">← Previous entry</span>
            <span className="display mt-3 block text-4xl text-ink transition-colors group-hover:text-burgundy">{prev.title}</span>
          </Link>
        ) : (
          <Link href="/#work" className="group border-b border-rule py-8 sm:border-b-0 sm:border-r sm:pr-8">
            <span className="label text-ink-faint">← Back to</span>
            <span className="display mt-3 block text-4xl text-ink transition-colors group-hover:text-burgundy">Selected work</span>
          </Link>
        )}
        {next ? (
          <Link href={`/projects/${next.slug}`} className="group py-8 sm:pl-8 sm:text-right">
            <span className="label text-ink-faint">Next entry →</span>
            <span className="display mt-3 block text-4xl text-ink transition-colors group-hover:text-burgundy">{next.title}</span>
          </Link>
        ) : (
          <Link href="/#contact" className="group py-8 sm:pl-8 sm:text-right">
            <span className="label inline-flex items-center gap-2 text-ink-faint">
              End of archive <ArrowRight className="w-5" />
            </span>
            <span className="display mt-3 block text-4xl text-ink transition-colors group-hover:text-burgundy">Get in touch</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
