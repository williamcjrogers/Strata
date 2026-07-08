import Link from "next/link";
import { SanityImage, type ProjectedImage } from "@/components/media/SanityImage";

export type PersonCardData = {
  _id: string;
  name: string | null;
  slug: string | null;
  role?: string | null;
  qualifications?: string | null;
  headshot?: ProjectedImage;
};

export function PersonCard({ person }: { person: PersonCardData }) {
  return (
    <article data-reveal className="group relative">
      <div className="relative aspect-portrait w-full overflow-clip bg-strata-900">
        <SanityImage
          image={person.headshot ?? null}
          fallbackSeed={person.slug ?? person._id}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          ratio="4:5"
          className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-strata-900/20 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0"
        />
      </div>
      <h3 className="type-h3 mt-4 text-strata-900">
        <Link href={`/people/${person.slug}`} className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          {person.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-strata-700">
        {person.role}
        {person.qualifications ? (
          <span className="mt-0.5 block text-xs text-strata-600">
            {person.qualifications}
          </span>
        ) : null}
      </p>
    </article>
  );
}
