/*
  JSON-LD builders. Plain Organization plus specific typing; the
  generic ProfessionalService type is deprecated and never used.
*/
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const ORG_ID = `${siteUrl}/#organization`;

export function organizationJsonLd(options?: {
  description?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Strata Cost Consulting",
    alternateName: "SCC",
    url: siteUrl,
    logo: `${siteUrl}/brand/avatar.png`,
    ...(options?.description ? { description: options.description } : {}),
    ...(options?.linkedinUrl ? { sameAs: [options.linkedinUrl] } : {}),
    ...(options?.email
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            email: options.email,
            contactType: "sales",
            areaServed: "GB",
          },
        }
      : {}),
  };
}

export function serviceJsonLd(service: {
  title?: string | null;
  summary?: string | null;
  slug?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url: `${siteUrl}/services/${service.slug}`,
    areaServed: "GB",
    provider: { "@id": ORG_ID },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function articleJsonLd(article: {
  title?: string | null;
  excerpt?: string | null;
  slug?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  authorName?: string | null;
  authorSlug?: string | null;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url: `${siteUrl}/insights/${article.slug}`,
    datePublished: article.publishedAt,
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    ...(article.image ? { image: [article.image] } : {}),
    author: {
      "@type": "Person",
      name: article.authorName,
      ...(article.authorSlug
        ? { url: `${siteUrl}/people/${article.authorSlug}` }
        : {}),
    },
    publisher: { "@id": ORG_ID },
  };
}

export function personJsonLd(person: {
  name?: string | null;
  role?: string | null;
  slug?: string | null;
  linkedinUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    url: `${siteUrl}/people/${person.slug}`,
    worksFor: { "@id": ORG_ID },
    ...(person.linkedinUrl ? { sameAs: [person.linkedinUrl] } : {}),
  };
}
