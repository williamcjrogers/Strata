import type { Metadata } from "next";

type SeoFields = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  noIndex?: boolean | null;
} | null;

/** Build page metadata from CMS seo fields with sensible fallbacks. */
export function buildMetadata({
  title,
  description,
  seo,
  path,
}: {
  title?: string | null;
  description?: string | null;
  seo?: SeoFields;
  path: string;
}): Metadata {
  const resolvedTitle = seo?.metaTitle ?? title ?? undefined;
  const resolvedDescription = seo?.metaDescription ?? description ?? undefined;
  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: path },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      type: "website",
      ...(seo?.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    ...(seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
