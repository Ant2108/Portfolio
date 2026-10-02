import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  number: string;
  label: string;
  title: React.ReactNode;
  id: string;
  aside?: React.ReactNode;
  className?: string;
};

/** "01 / ABOUT" marker, a rule, and a large serif heading. */
export function SectionHeading({ number, label, title, id, aside, className }: SectionHeadingProps) {
  return (
    <Reveal as="header" className={cn("mb-12 md:mb-20", className)}>
      <div className="flex items-center gap-4 border-t border-ink pt-4">
        <span className="label text-burgundy">{number}</span>
        <span aria-hidden className="h-px w-8 bg-rule-strong" />
        <span className="label text-ink-soft">{label}</span>
        {aside && <span className="label ml-auto hidden text-ink-faint sm:block">{aside}</span>}
      </div>
      <h2 id={id} className="display mt-8 max-w-4xl text-[2.2rem] text-ink sm:text-5xl lg:text-6xl">
        {title}
      </h2>
    </Reveal>
  );
}
