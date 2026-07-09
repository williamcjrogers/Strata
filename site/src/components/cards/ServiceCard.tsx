import Link from "next/link";
import { RefCode } from "@/components/artefacts/RefCode";
import { refFromSeed } from "@/lib/refcode";

export type ServiceCardData = {
  _id: string;
  title: string | null;
  slug: string | null;
  order?: number | null;
  strapline?: string | null;
  summary?: string | null;
  engagementModel?: string | null;
};

export function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <article
      data-reveal
      className="group relative border-t-2 border-anchor bg-paper pt-5 transition-colors hover:bg-mist"
    >
      <div className="flex items-baseline justify-between gap-4">
        <p aria-hidden="true" className="type-mono text-accent-ink">
          SRV.{String(service.order ?? 0).padStart(2, "0")}
        </p>
        <RefCode
          code={refFromSeed("SCC-SVC", service.slug ?? service._id)}
          className="pr-5"
        />
      </div>
      <h3 className="type-h3 mt-3 text-strata-900">
        <Link href={`/services/${service.slug}`} className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          {service.title}
        </Link>
      </h3>
      {service.summary ? (
        <p className="mt-3 text-sm text-strata-700">{service.summary}</p>
      ) : null}
      <p className="mt-5 flex items-center gap-2 pb-5 text-sm font-semibold uppercase tracking-wide text-accent-ink">
        Explore
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </p>
    </article>
  );
}
