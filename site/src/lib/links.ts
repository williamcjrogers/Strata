/* Resolve CMS link objects and internal references to hrefs. */

type InternalRef = {
  _type?: string | null;
  slug?: string | null;
} | null;

export type CmsLink = {
  label?: string | null;
  linkType?: string | null;
  external?: string | null;
  internal?: InternalRef;
} | null;

const PAGE_ROUTES: Record<string, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  sectors: "/sectors",
  projects: "/projects",
  people: "/people",
  insights: "/insights",
  careers: "/careers",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  accessibility: "/accessibility",
};

export function hrefForDoc(docType?: string | null, slug?: string | null): string {
  if (!docType || !slug) return "/";
  switch (docType) {
    case "page":
      return PAGE_ROUTES[slug] ?? `/${slug}`;
    case "service":
      return `/services/${slug}`;
    case "sector":
      return `/sectors/${slug}`;
    case "project":
      return `/projects/${slug}`;
    case "person":
      return `/people/${slug}`;
    case "article":
      return `/insights/${slug}`;
    default:
      return "/";
  }
}

export function resolveLink(link: CmsLink): { label: string; href: string } | null {
  if (!link?.label) return null;
  if (link.linkType === "external" && link.external) {
    return { label: link.label, href: link.external };
  }
  if (link.internal) {
    return {
      label: link.label,
      href: hrefForDoc(link.internal._type, link.internal.slug),
    };
  }
  return null;
}
