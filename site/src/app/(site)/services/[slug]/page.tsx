import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CashflowCurve } from "@/components/artefacts/CashflowCurve";
import { CostPlanBuildup } from "@/components/artefacts/CostPlanBuildup";
import { ValuationTable } from "@/components/artefacts/ValuationTable";
import {
  costPlanRows,
  finalAccountRows,
  interimValuationRows,
} from "@/components/artefacts/presets";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { StrataHero } from "@/components/motion/StrataHero";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Prose } from "@/components/ui/Prose";
import { QuoteBlock } from "@/components/ui/QuoteBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { resolveLink } from "@/lib/links";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { serviceBySlugQuery, serviceSlugsQuery } from "@/sanity/queries/services";

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: serviceSlugsQuery,
    perspective: "published",
    stega: false,
  });
  return (data ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { data: service } = await sanityFetch({
    query: serviceBySlugQuery,
    params: { slug },
    stega: false,
  });
  return buildMetadata({
    title: service?.title,
    description: service?.summary,
    seo: service?.seo,
    path: `/services/${slug}`,
  });
}

/* the artefact each service line shows beside its introduction */
const SERVICE_ARTEFACTS: Record<string, ReactNode> = {
  "pre-contract": (
    <CostPlanBuildup rows={costPlanRows} compact footnote="figures illustrative" />
  ),
  "post-contract": <ValuationTable rows={interimValuationRows} total="13,777,090" compact />,
  claims: (
    <ValuationTable
      refCode="SCC-FA-002"
      title="Final account reconciliation"
      rows={finalAccountRows}
      compact
    />
  ),
  "bank-monitoring": <CashflowCurve />,
};

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const { data: service } = await sanityFetch({
    query: serviceBySlugQuery,
    params: { slug },
  });
  if (!service) notFound();

  const cta = resolveLink(service.cta?.link ?? null);

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(service),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title ?? "", path: `/services/${service.slug}` },
          ]),
        ]}
      />
      <StrataHero
        compact
        eyebrow="Services"
        title={service.title ?? ""}
        lede={service.strapline}
        refCode={`SCC-SVC-${String(service.order ?? 0).padStart(2, "0")}`}
      />

      <SectionReveal className="py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div data-reveal>
              <Prose value={service.intro} />
            </div>
            <aside className="space-y-8">
              <div data-reveal className="border-t-2 border-anchor bg-mist p-6">
                <h2 className="eyebrow text-strata-700">Engagement model</h2>
                <p className="type-h3 mt-3 text-strata-900">
                  {service.engagementModel ?? "Tailored to the commission"}
                </p>
                <p className="mt-4 text-sm text-strata-700">
                  Every commission carries director level oversight from day one.
                </p>
              </div>
              {service.slug && SERVICE_ARTEFACTS[service.slug] ? (
                <div data-reveal>{SERVICE_ARTEFACTS[service.slug]}</div>
              ) : null}
            </aside>
          </div>
        </Container>
      </SectionReveal>

      {service.deliverables && service.deliverables.length > 0 ? (
        <SectionReveal className="bg-mist py-section">
          <Container>
            <header data-reveal className="max-w-3xl">
              <Eyebrow>What is included</Eyebrow>
              <h2 className="type-h2 mt-4 text-strata-900">
                The work itself
              </h2>
            </header>
            <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {service.deliverables.map((item) => (
                <article
                  key={item._key}
                  data-reveal
                  className="border-t-2 border-anchor pt-5"
                >
                  <h3 className="type-h3 text-strata-900">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-3 max-w-prose text-sm text-strata-700">
                      {item.description}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </Container>
        </SectionReveal>
      ) : null}

      {service.sectors && service.sectors.length > 0 ? (
        <SectionReveal className="py-section">
          <Container>
            <header data-reveal className="max-w-3xl">
              <Eyebrow>Where we apply it</Eyebrow>
              <h2 className="type-h2 mt-4 text-strata-900">
                {service.title} by sector
              </h2>
            </header>
            <ul className="mt-12 divide-y divide-line border-y border-line">
              {service.sectors.map((sector) => {
                const offering = sector.offerings?.find(
                  (o) => o?.serviceId === service._id,
                );
                return (
                  <li key={sector._id} data-reveal className="py-6">
                    <div className="grid gap-3 md:grid-cols-[16rem_1fr] md:gap-8">
                      <h3 className="type-h3 text-strata-900">
                        <Link
                          href={`/sectors/${sector.slug}`}
                          className="hover:text-accent-ink"
                        >
                          {sector.title}
                        </Link>
                      </h3>
                      {offering?.summary ? (
                        <p className="max-w-prose text-base text-strata-700">
                          {offering.summary}
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Container>
        </SectionReveal>
      ) : null}

      {service.featuredProjects && service.featuredProjects.length > 0 ? (
        <SectionReveal className="bg-mist py-section">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <header data-reveal className="max-w-3xl">
                <Eyebrow>Track record</Eyebrow>
                <h2 className="type-h2 mt-4 text-strata-900">Related projects</h2>
              </header>
              <Link
                data-reveal
                href="/projects"
                className="text-sm font-semibold uppercase tracking-wide text-accent-ink hover:text-strata-900"
              >
                All projects <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {service.featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </Container>
        </SectionReveal>
      ) : null}

      <QuoteBlock quote={service.quote} variant="band" />

      {service.cta?.heading && cta ? (
        <CTASection
          heading={service.cta.heading}
          text={service.cta.text}
          link={cta}
          statusChips={service.cta.statusChips}
        />
      ) : null}
    </>
  );
}
