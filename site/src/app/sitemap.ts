import type { MetadataRoute } from "next";
import { hrefForDoc } from "@/lib/links";
import { client } from "@/sanity/lib/client";
import { sitemapQuery } from "@/sanity/queries/sitemap";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await client.fetch(sitemapQuery, {}, { perspective: "published" });
  if (!data) return [];

  const entries: MetadataRoute.Sitemap = [];
  const push = (
    docType: string,
    items: { slug: string | null; _updatedAt: string }[] | null,
  ) => {
    for (const item of items ?? []) {
      if (!item.slug) continue;
      entries.push({
        url: `${siteUrl}${hrefForDoc(docType, item.slug)}`,
        lastModified: item._updatedAt,
      });
    }
  };

  push("page", data.pages);
  push("service", data.services);
  push("sector", data.sectors);
  push("project", data.projects);
  push("person", data.people);
  push("article", data.articles);

  return entries;
}
