import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StrataHero } from "@/components/motion/StrataHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/jsonld";
import { resolveLink } from "@/lib/links";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { pageBySlugQuery } from "@/sanity/queries/pages";
import { settingsQuery } from "@/sanity/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: pageBySlugQuery,
    params: { slug: "home" },
    stega: false,
  });
  return buildMetadata({
    title: page?.seo?.metaTitle ?? undefined,
    description: page?.hero?.lede,
    seo: page?.seo,
    path: "/",
  });
}

export default async function HomePage() {
  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: pageBySlugQuery, params: { slug: "home" } }),
    sanityFetch({ query: settingsQuery }),
  ]);
  if (!page) notFound();

  const cta = resolveLink(page.hero?.cta ?? null);

  return (
    <>
      <JsonLd
        data={organizationJsonLd({
          description: settings?.description,
          linkedinUrl: settings?.contact?.linkedinUrl,
          email: settings?.contact?.email,
        })}
      />
      <StrataHero
        eyebrow={page.hero?.eyebrow}
        title={page.hero?.heading ?? page.title ?? "Strata Cost Consulting"}
        lede={page.hero?.lede}
        cta={cta}
      />
      <SectionRenderer sections={page.sections} settings={settings} />
    </>
  );
}
