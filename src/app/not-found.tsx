import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[1440px] flex-col justify-center px-4 py-24 sm:px-6 lg:px-10">
      <p className="label text-burgundy">Error 404 — Missing from the archive</p>
      <h1 className="display mt-6 text-6xl text-ink sm:text-8xl">
        This entry was <em className="text-burgundy">never filed.</em>
      </h1>
      <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
        The page you were looking for doesn&rsquo;t exist, or it has been moved.
      </p>
      <Link href="/" className="label link-draw mt-10 w-fit text-ink">
        ← Return to the archive
      </Link>
    </section>
  );
}
