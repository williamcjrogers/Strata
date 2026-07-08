import { notFound } from "next/navigation";
import { StrataHero } from "@/components/motion/StrataHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { resolveLink } from "@/lib/links";
import { sanityFetch } from "@/sanity/lib/live";
import { pageBySlugQuery } from "@/sanity/queries/pages";
import { settingsQuery } from "@/sanity/queries/settings";

/*
  Shared template for CMS-driven pages (about, careers, privacy and
  the hub intros): compact strata hero from the page document followed
  by its page-builder sections. Hub routes pass extra children between
  hero and sections.
*/
export async function CmsPage({
  slug,
  children,
  afterSections,
}: {
  slug: string;
  children?: React.ReactNode;
  afterSections?: React.ReactNode;
}) {
  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: pageBySlugQuery, params: { slug } }),
    sanityFetch({ query: settingsQuery }),
  ]);
  if (!page) notFound();

  return (
    <>
      <StrataHero
        compact
        eyebrow={page.hero?.eyebrow}
        title={page.hero?.heading ?? page.title ?? ""}
        lede={page.hero?.lede}
        cta={resolveLink(page.hero?.cta ?? null)}
      />
      {children}
      <SectionRenderer sections={page.sections} settings={settings} />
      {afterSections}
    </>
  );
}

export async function cmsPageMetadata(slug: string, path: string) {
  const { data: page } = await sanityFetch({
    query: pageBySlugQuery,
    params: { slug },
    stega: false,
  });
  const { buildMetadata } = await import("@/lib/seo");
  return buildMetadata({
    title: page?.title,
    description: page?.hero?.lede,
    seo: page?.seo,
    path,
  });
}
