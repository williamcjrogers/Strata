import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { StrataHero } from "@/components/motion/StrataHero";
import { Container } from "@/components/ui/Container";
import { projectsFilterHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { pageBySlugQuery } from "@/sanity/queries/pages";
import { projectFacetsQuery, projectsIndexQuery } from "@/sanity/queries/projects";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: pageBySlugQuery,
    params: { slug: "projects" },
    stega: false,
  });
  return buildMetadata({
    title: page?.title,
    description: page?.hero?.lede,
    seo: page?.seo,
    // filtered permutations canonicalise to the unfiltered index
    path: "/projects",
  });
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      prefetch={false}
      aria-current={active ? "true" : undefined}
      className={`inline-flex min-h-11 items-center border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-anchor bg-anchor text-paper"
          : "border-line text-strata-700 hover:border-strata-500 hover:text-strata-900"
      }`}
    >
      {children}
    </Link>
  );
}

export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const sp = await searchParams;
  const sector = typeof sp.sector === "string" ? sp.sector : undefined;
  const service = typeof sp.service === "string" ? sp.service : undefined;

  const [{ data: page }, { data: facets }, { data: projects }] = await Promise.all([
    sanityFetch({ query: pageBySlugQuery, params: { slug: "projects" } }),
    sanityFetch({ query: projectFacetsQuery }),
    sanityFetch({
      query: projectsIndexQuery,
      params: { sector: sector ?? null, service: service ?? null },
    }),
  ]);
  if (!page) notFound();

  const current = { sector, service };
  const filtered = Boolean(sector || service);
  const results = projects ?? [];

  return (
    <>
      <StrataHero
        compact
        eyebrow={page.hero?.eyebrow}
        title={page.hero?.heading ?? "Projects"}
        lede={page.hero?.lede}
      />

      <section className="py-section-sm">
        <Container>
          <div className="space-y-5 border-b border-line pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-2 text-strata-700">Sector</span>
              <FilterChip href={projectsFilterHref(current, { sector: null })} active={!sector}>
                All
              </FilterChip>
              {(facets?.sectors ?? []).map((item) => (
                <FilterChip
                  key={item.slug}
                  href={projectsFilterHref(current, { sector: item.slug })}
                  active={sector === item.slug}
                >
                  {item.title}
                </FilterChip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-2 text-strata-700">Service</span>
              <FilterChip href={projectsFilterHref(current, { service: null })} active={!service}>
                All
              </FilterChip>
              {(facets?.services ?? []).map((item) => (
                <FilterChip
                  key={item.slug}
                  href={projectsFilterHref(current, { service: item.slug })}
                  active={service === item.slug}
                >
                  {item.title}
                </FilterChip>
              ))}
            </div>
            <p aria-live="polite" className="text-sm text-strata-700">
              {results.length} {results.length === 1 ? "project" : "projects"}
              {filtered ? (
                <>
                  {" "}
                  &middot;{" "}
                  <Link
                    href="/projects"
                    className="font-semibold text-accent-ink underline decoration-strata-300 underline-offset-4 hover:decoration-strata-600"
                  >
                    Clear filters
                  </Link>
                </>
              ) : null}
            </p>
          </div>

          {results.length > 0 ? (
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="mt-12 max-w-xl">
              <p className="type-h3 text-strata-900">
                No projects match that combination yet.
              </p>
              <p className="mt-3 text-strata-700">
                Try a different filter, or{" "}
                <Link
                  href="/projects"
                  className="font-semibold text-accent-ink underline decoration-strata-300 underline-offset-4"
                >
                  view all projects
                </Link>
                .
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
