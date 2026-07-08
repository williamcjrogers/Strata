import Link from "next/link";

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
      <p className="eyebrow text-accent-ink">
        {String(service.order ?? 0).padStart(2, "0")}
      </p>
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
