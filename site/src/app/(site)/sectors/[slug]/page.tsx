import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { CredentialsBand } from "@/components/motion/CredentialsBand";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { StrataHero } from "@/components/motion/StrataHero";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Prose } from "@/components/ui/Prose";
import { QuoteBlock } from "@/components/ui/QuoteBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { resolveLink } from "@/lib/links";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { sectorBySlugQuery, sectorSlugsQuery } from "@/sanity/queries/sectors";

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: sectorSlugsQuery,
    perspective: "published",
    stega: false,
  });
  return (data ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/sectors/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { data: sector } = await sanityFetch({
    query: sectorBySlugQuery,
    params: { slug },
    stega: false,
  });
  return buildMetadata({
    title: sector?.title,
    description: sector?.summary,
    seo: sector?.seo,
    path: `/sectors/${slug}`,
  });
}

export default async function SectorPage({ params }: PageProps<"/sectors/[slug]">) {
  const { slug } = await params;
  const { data: sector } = await sanityFetch({
    query: sectorBySlugQuery,
    params: { slug },
  });
  if (!sector) notFound();

  const cta = resolveLink(sector.cta?.link ?? null);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Sectors", path: "/sectors" },
          { name: sector.title ?? "", path: `/sectors/${sector.slug}` },
        ])}
      />
      <StrataHero
        compact
        eyebrow="Sectors"
        title={sector.title ?? ""}
        lede={sector.strapline}
      />

      {sector.keyStats && sector.keyStats.length > 0 ? (
        <CredentialsBand stats={sector.keyStats} />
      ) : null}

      <SectionReveal className="py-section">
        <Container>
          <div data-reveal className="max-w-3xl">
            <Prose value={sector.marketContext} />
          </div>
        </Container>
      </SectionReveal>

      {sector.serviceOfferings && sector.serviceOfferings.length > 0 ? (
        <SectionReveal className="bg-mist py-section">
          <Container>
            <header data-reveal className="max-w-3xl">
              <Eyebrow>How we help</Eyebrow>
              <h2 className="type-h2 mt-4 text-strata-900">
                Services in {sector.title}
              </h2>
            </header>
            <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {sector.serviceOfferings.map((offering) => (
                <article
                  key={offering._key}
                  data-reveal
                  className="border-t-2 border-anchor pt-5"
                >
                  <h3 className="type-h3 text-strata-900">
                    <Link
                      href={`/services/${offering.service?.slug}`}
                      className="hover:text-accent-ink"
                    >
                      {offering.service?.title}
                    </Link>
                  </h3>
                  {offering.summary ? (
                    <p className="mt-3 max-w-prose text-sm text-strata-700">
                      {offering.summary}
                    </p>
                  ) : null}
                  {offering.service?.engagementModel ? (
                    <p className="meta-line mt-4 text-strata-600">
                      {offering.service.engagementModel}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </Container>
        </SectionReveal>
      ) : null}

      {sector.featuredProjects && sector.featuredProjects.length > 0 ? (
        <SectionReveal className="py-section">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <header data-reveal className="max-w-3xl">
                <Eyebrow>Track record</Eyebrow>
                <h2 className="type-h2 mt-4 text-strata-900">
                  Projects in {sector.title}
                </h2>
              </header>
              <Link
                data-reveal
                href={`/projects?sector=${sector.slug}`}
                className="text-sm font-semibold uppercase tracking-wide text-accent-ink hover:text-strata-900"
              >
                All {sector.title} projects <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {sector.featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </Container>
        </SectionReveal>
      ) : null}

      <QuoteBlock quote={sector.quote} variant="band" />

      {sector.cta?.heading && cta ? (
        <CTASection
          heading={sector.cta.heading}
          text={sector.cta.text}
          link={cta}
          statusChips={sector.cta.statusChips}
        />
      ) : null}
    </>
  );
}
