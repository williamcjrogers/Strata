import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { SanityImage } from "@/components/media/SanityImage";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { StrataHero } from "@/components/motion/StrataHero";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Prose } from "@/components/ui/Prose";
import { QuoteBlock } from "@/components/ui/QuoteBlock";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { projectBySlugQuery, projectSlugsQuery } from "@/sanity/queries/projects";

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: projectSlugsQuery,
    perspective: "published",
    stega: false,
  });
  return (data ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await sanityFetch({
    query: projectBySlugQuery,
    params: { slug },
    stega: false,
  });
  return buildMetadata({
    title: project?.title,
    description: project?.summary,
    seo: project?.seo,
    path: `/projects/${slug}`,
  });
}

/* Tight metadata line rendered from discrete fields (the Corefive pattern). */
function ProjectMetaLine({
  project,
}: {
  project: {
    location?: string | null;
    client?: string | null;
    value?: string | null;
    completed?: string | null;
    services?: ({ title: string | null; slug: string | null } | null)[] | null;
  };
}) {
  const items: { label: string; value: React.ReactNode }[] = [];
  if (project.location) items.push({ label: "Location", value: project.location });
  if (project.client) items.push({ label: "Client", value: project.client });
  if (project.value) items.push({ label: "Value", value: project.value });
  if (project.completed) items.push({ label: "Status", value: project.completed });
  if (project.services && project.services.length > 0) {
    items.push({
      label: "Services",
      value: project.services.filter(Boolean).map((service, i) => (
        <span key={service?.slug}>
          {i > 0 ? ", " : ""}
          <Link
            href={`/services/${service?.slug}`}
            className="underline decoration-strata-300 underline-offset-4 hover:decoration-strata-600"
          >
            {service?.title}
          </Link>
        </span>
      )),
    });
  }

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-line py-8 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="eyebrow text-strata-600">{item.label}</dt>
          <dd className="mt-2 text-sm font-semibold text-strata-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const { data: project } = await sanityFetch({
    query: projectBySlugQuery,
    params: { slug },
  });
  if (!project) notFound();

  return (
    <>
      <StrataHero
        compact
        eyebrow={project.sectors?.[0]?.title ?? "Projects"}
        title={project.title ?? ""}
        lede={project.summary}
      />

      <SectionReveal className="py-section-sm">
        <Container>
          <div data-reveal>
            <ParallaxMedia className="aspect-hero w-full bg-strata-900">
              <div className="relative h-full w-full">
                <SanityImage
                  image={project.heroImage ?? null}
                  fallbackSeed={project.slug ?? project._id}
                  sizes="(min-width: 1280px) 80rem, 100vw"
                  ratio="21:9"
                  className="object-cover"
                  priority
                />
              </div>
            </ParallaxMedia>
          </div>
          <div data-reveal className="mt-12">
            <ProjectMetaLine project={project} />
          </div>
        </Container>
      </SectionReveal>

      <SectionReveal className="pb-section">
        <Container>
          <div data-reveal className="max-w-3xl">
            <Prose value={project.body} />
          </div>
        </Container>
      </SectionReveal>

      {project.gallery && project.gallery.length > 0 ? (
        <SectionReveal className="pb-section">
          <Container>
            <div className="grid gap-8 sm:grid-cols-2">
              {project.gallery.map((image) => (
                <figure key={image._key} data-reveal>
                  <div className="relative aspect-card w-full overflow-clip bg-strata-900">
                    <SanityImage
                      image={image}
                      fallbackSeed={image._key}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  {image.caption ? (
                    <figcaption className="meta-line mt-3 text-strata-700">
                      {image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </Container>
        </SectionReveal>
      ) : null}

      <QuoteBlock quote={project.quote} variant="band" />

      {project.related && project.related.length > 0 ? (
        <SectionReveal className="bg-mist py-section">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <header data-reveal>
                <Eyebrow>More work</Eyebrow>
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
              {project.related.map((item) => (
                <ProjectCard key={item._id} project={item} />
              ))}
            </div>
          </Container>
        </SectionReveal>
      ) : null}

      <CTASection
        heading="A commission like this one?"
        text="Tell us where the scheme, dispute or portfolio stands and we will tell you what it needs."
        link={{ label: "Start a conversation", href: "/contact" }}
      />
    </>
  );
}
