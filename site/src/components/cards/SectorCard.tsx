import Link from "next/link";
import { SanityImage, type ProjectedImage } from "@/components/media/SanityImage";

export type SectorCardData = {
  _id: string;
  title: string | null;
  slug: string | null;
  strapline?: string | null;
  summary?: string | null;
  heroImage?: ProjectedImage;
};

export function SectorCard({ sector }: { sector: SectorCardData }) {
  return (
    <article data-reveal className="group relative overflow-clip bg-strata-900">
      <div className="relative aspect-card w-full">
        <SanityImage
          image={sector.heroImage ?? null}
          fallbackSeed={sector.slug ?? sector._id}
          fallback="benchmark"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
        />
        {/* scrim keeps the overlaid title at AA contrast over any image */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-strata-950/85 to-transparent"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="type-h3 uppercase text-paper">
          <Link href={`/sectors/${sector.slug}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {sector.title}
          </Link>
        </h3>
        {sector.strapline ? (
          <p className="mt-2 text-sm text-strata-200">{sector.strapline}</p>
        ) : null}
      </div>
    </article>
  );
}
