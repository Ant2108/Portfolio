import { ProjectEntry } from "@/components/projects/project-entry";
import { SectionHeading } from "@/components/ui/section-heading";
import { orderedProjects as ordered } from "@/data/projects";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
      <SectionHeading
        id="work-title"
        number="03"
        label="Work"
        aside={`${ordered.length} entries`}
        title={
          <>
            Selected <em className="text-burgundy">work.</em>
          </>
        }
      />

      <div className="space-y-24 lg:space-y-40">
        {ordered.map((project, i) => (
          <ProjectEntry
            key={project.slug}
            project={project}
            index={i}
            layout={i === 0 ? "feature" : i % 2 === 1 ? "left" : "right"}
          />
        ))}
      </div>
    </section>
  );
}
