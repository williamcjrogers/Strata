import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard, formatDate } from "@/components/cards/ArticleCard";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { StrataHero } from "@/components/motion/StrataHero";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Prose } from "@/components/ui/Prose";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { articleBySlugQuery, articleSlugsQuery } from "@/sanity/queries/articles";

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: articleSlugsQuery,
    perspective: "published",
    stega: false,
  });
  return (data ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { data: article } = await sanityFetch({
    query: articleBySlugQuery,
    params: { slug },
    stega: false,
  });
  return buildMetadata({
    title: article?.title,
    description: article?.excerpt,
    seo: article?.seo,
    path: `/insights/${slug}`,
  });
}

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const { data: article } = await sanityFetch({
    query: articleBySlugQuery,
    params: { slug },
  });
  if (!article) notFound();

  const related = (article.related ?? []).filter(Boolean).slice(0, 3);

  return (
    <>
      <StrataHero
        compact
        eyebrow={[article.topics?.[0]?.title ?? "Insight", formatDate(article.publishedAt)]
          .filter(Boolean)
          .join(" · ")}
        title={article.title ?? ""}
        lede={article.excerpt}
      />

      <SectionReveal as="article" className="py-section">
        <Container>
          {article.author ? (
            <p data-reveal className="mb-10 flex items-center gap-3 text-sm">
              <span aria-hidden="true" className="inline-block h-0.5 w-6 bg-accent" />
              <span>
                By{" "}
                <Link
                  href={`/people/${article.author.slug}`}
                  className="font-semibold text-strata-900 underline decoration-strata-300 underline-offset-4 hover:decoration-strata-600"
                >
                  {article.author.name}
                </Link>
                {article.author.role ? (
                  <span className="text-strata-700">, {article.author.role}</span>
                ) : null}
              </span>
            </p>
          ) : null}
          <div data-reveal className="max-w-3xl">
            <Prose value={article.body} />
          </div>
        </Container>
      </SectionReveal>

      {related.length > 0 ? (
        <SectionReveal className="bg-mist py-section" aria-label="Related insights">
          <Container>
            <header data-reveal>
              <Eyebrow>Keep reading</Eyebrow>
              <h2 className="type-h2 mt-4 text-strata-900">Related insights</h2>
            </header>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item._id} article={item} />
              ))}
            </div>
          </Container>
        </SectionReveal>
      ) : null}

      <CTASection
        heading="Talk to the authors"
        text="The thinking above comes from live commissions. If it lands close to home, so can we."
        link={{ label: "Start a conversation", href: "/contact" }}
      />
    </>
  );
}
