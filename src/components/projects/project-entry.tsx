import Link from "next/link";
import { ProjectPlate, plateCaption } from "@/components/projects/project-plate";
import { ArrowRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import type { Project } from "@/data/projects";
import { cn, displayYear, pad } from "@/lib/utils";

type Layout = "feature" | "left" | "right";

/**
 * One project in the "Selected Work" list. The title link is stretched over
 * the whole entry, so the entire panel is clickable with a single tab stop.
 */
export function ProjectEntry({ project, index, layout }: { project: Project; index: number; layout: Layout }) {
  const number = pad(index + 1);
  const href = `/projects/${project.slug}`;

  const meta = (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <span className="font-serif text-lg italic text-burgundy">No. {number}</span>
      <span className="label text-ink-faint">{project.category}</span>
      <span className="label text-ink-faint">{displayYear(project.year)}</span>
    </div>
  );

  const title = (
    <h3 className="display mt-4 text-4xl text-ink sm:text-5xl lg:text-6xl">
      <Link href={href} className="link-draw pb-1 after:absolute after:inset-0 after:content-['']">
        {project.title}
      </Link>
    </h3>
  );

  const details = (
    <>
      <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-ink-soft">{project.description}</p>
      <ul aria-label="Technologies" className="label mt-6 flex flex-wrap gap-y-1 text-[0.75rem] leading-relaxed text-ink">
        {project.technologies.map((t, i) => (
          <li key={t}>
            {t}
            {i < project.technologies.length - 1 && (
              <span aria-hidden className="mx-2 text-gold">
                /
              </span>
            )}
          </li>
        ))}
      </ul>
      <span aria-hidden className="label mt-8 inline-flex items-center gap-3 text-burgundy">
        View entry
        <ArrowRight className="w-6 transition-transform duration-500 group-hover:translate-x-1.5" />
      </span>
    </>
  );

  const plate = (sizes: string) => (
    <ProjectPlate
      src={project.image}
      alt={project.imageAlt}
      plate={index + 2}
      caption={plateCaption(project.image, project.title)}
      sizes={sizes}
    />
  );

  if (layout === "feature") {
    return (
      <Reveal as="article" className="group relative">
        {plate("(min-width: 1440px) 1360px, 100vw")}
        <div className="mt-8 grid grid-cols-1 gap-6 border-t border-ink pt-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            {meta}
            {title}
          </div>
          <div className="lg:col-span-5 lg:pt-10">{details}</div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal as="article" className="group relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
      <div className={cn("lg:col-span-7", layout === "right" && "lg:order-2 lg:col-start-6")}>
        {plate("(min-width: 1024px) 56vw, 100vw")}
      </div>
      <div className={cn("lg:col-span-4", layout === "left" ? "lg:col-start-9" : "lg:order-1 lg:col-start-1")}>
        {meta}
        {title}
        {details}
      </div>
    </Reveal>
  );
}
