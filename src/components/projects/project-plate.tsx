import Image from "next/image";
import { cn, roman } from "@/lib/utils";

type ProjectPlateProps = {
  src: string;
  alt: string;
  plate: number;
  /** Overrides the default "Pl. II" label, e.g. "Fig. 1". */
  label?: string;
  caption: string;
  sizes: string;
  className?: string;
  eager?: boolean;
};

/** A framed project image with crop marks and an archival caption. */
export function ProjectPlate({ src, alt, plate, label, caption, sizes, className, eager }: ProjectPlateProps) {
  return (
    <figure className={cn("corners p-2 sm:p-3", className)}>
      <div className="plate-reveal relative aspect-[16/10] overflow-hidden bg-paper-deep">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="object-cover [filter:sepia(0.06)] transition-[transform,filter] duration-[1.2s] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.025] group-hover:[filter:sepia(0)]"
        />
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className="label shrink-0 whitespace-nowrap text-[0.7rem] text-ink-faint">{label ?? `Pl. ${roman(plate)}`}</span>
        <span className="text-right font-serif text-sm italic text-ink-faint">{caption}</span>
      </figcaption>
    </figure>
  );
}

/** Honest caption: SVG plates are illustrations, not screenshots. */
export function plateCaption(image: string, title: string) {
  return image.endsWith(".svg") ? `${title} — illustrative plate` : title;
}
