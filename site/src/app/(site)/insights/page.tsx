import type { Metadata } from "next";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { CmsPage, cmsPageMetadata } from "@/components/sections/CmsPage";
import { Container } from "@/components/ui/Container";
import { sanityFetch } from "@/sanity/lib/live";
import { articlesIndexQuery } from "@/sanity/queries/articles";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("insights", "/insights");
}

export default async function InsightsPage() {
  const { data: articles } = await sanityFetch({ query: articlesIndexQuery });

  return (
    <CmsPage slug="insights">
      <SectionReveal className="py-section">
        <Container>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {(articles ?? []).map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </Container>
      </SectionReveal>
    </CmsPage>
  );
}
