import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/components/cards/ArticleCard";
import { SanityImage } from "@/components/media/SanityImage";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { StrataHero } from "@/components/motion/StrataHero";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Prose } from "@/components/ui/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/jsonld";
import { hrefForDoc } from "@/lib/links";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { personBySlugQuery, personSlugsQuery } from "@/sanity/queries/people";

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: personSlugsQuery,
    perspective: "published",
    stega: false,
  });
  return (data ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/people/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { data: person } = await sanityFetch({
    query: personBySlugQuery,
    params: { slug },
    stega: false,
  });
  return buildMetadata({
    title: person?.name,
    description: person ? `${person.name}, ${person.role} at Strata Cost Consulting.` : undefined,
    path: `/people/${slug}`,
  });
}

export default async function PersonPage({ params }: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  const { data: person } = await sanityFetch({
    query: personBySlugQuery,
    params: { slug },
  });
  if (!person) notFound();

  return (
    <>
      <JsonLd
        data={[
          personJsonLd(person),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "People", path: "/people" },
            { name: person.name ?? "", path: `/people/${person.slug}` },
          ]),
        ]}
      />
      <StrataHero
        compact
        eyebrow={person.role}
        title={person.name ?? ""}
        lede={person.qualifications}
      />

      <SectionReveal className="py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div data-reveal>
              <div className="relative aspect-portrait w-full max-w-sm overflow-clip bg-strata-900">
                <SanityImage
                  image={person.headshot ?? null}
                  fallbackSeed={person.slug ?? person._id}
                  sizes="(min-width: 1024px) 24rem, 100vw"
                  ratio="4:5"
                  className="object-cover"
                />
              </div>
              {person.linkedinUrl ? (
                <p className="mt-6">
                  <a
                    href={person.linkedinUrl}
                    rel="noreferrer"
                    target="_blank"
                    className="text-sm font-semibold uppercase tracking-wide text-accent-ink underline decoration-strata-300 underline-offset-4 hover:decoration-strata-600"
                  >
                    LinkedIn
                  </a>
                </p>
              ) : null}
            </div>
            <div data-reveal className="max-w-2xl">
              <Prose value={person.bio} />
              {person.specialisms && person.specialisms.length > 0 ? (
                <div className="mt-10">
                  <Eyebrow>Specialisms</Eyebrow>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {person.specialisms.map((item) => (
                      <li key={`${item._type}-${item.slug}`}>
                        <Link
                          href={hrefForDoc(item._type, item.slug)}
                          className="inline-block border border-line px-3 py-1.5 text-sm text-strata-700 transition-colors hover:border-strata-500 hover:text-strata-900"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </SectionReveal>

      {person.articles && person.articles.length > 0 ? (
        <SectionReveal className="bg-mist py-section-sm">
          <Container>
            <header data-reveal>
              <Eyebrow>Writing</Eyebrow>
              <h2 className="type-h2 mt-4 text-strata-900">
                Insights by {person.name}
              </h2>
            </header>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {person.articles.map((article) => (
                <li key={article._id} data-reveal className="py-5">
                  <Link href={`/insights/${article.slug}`} className="group block">
                    <p className="meta-line text-strata-600">
                      {formatDate(article.publishedAt)}
                    </p>
                    <h3 className="type-h3 mt-1 text-strata-900 group-hover:text-accent-ink">
                      {article.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </SectionReveal>
      ) : null}

      <CTASection
        heading="Work with the team"
        text="Tell us about the scheme, the dispute or the portfolio."
        link={{ label: "Start a conversation", href: "/contact" }}
      />
    </>
  );
}
