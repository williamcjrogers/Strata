import { defineQuery } from "next-sanity";

export const sectorsIndexQuery = defineQuery(`
  *[_type == "sector"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    order,
    strapline,
    summary,
    heroImage{
      "alt": alt,
      asset->{_id, url, metadata{lqip, dimensions}}
    }
  }
`);

export const sectorBySlugQuery = defineQuery(`
  *[_type == "sector" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    order,
    strapline,
    summary,
    heroImage{
      "alt": alt,
      asset->{_id, url, metadata{lqip, dimensions}}
    },
    marketContext,
    keyStats[]{value, label, source, sourceUrl},
    serviceOfferings[]{
      _key,
      summary,
      service->{
        _id,
        title,
        "slug": slug.current,
        strapline,
        summary,
        engagementModel
      }
    },
    featuredProjects[]->{
      _id,
      title,
      "slug": slug.current,
      client,
      location,
      value,
      summary,
      heroImage{
        "alt": alt,
        asset->{_id, url, metadata{lqip, dimensions}}
      },
      "sectors": sectors[]->{title, "slug": slug.current}
    },
    quote{
      text,
      attributionName,
      attributionRole,
      person->{name, "slug": slug.current}
    },
    cta{
      heading,
      text,
      link{
        label,
        linkType,
        external,
        internal->{_type, "slug": slug.current}
      }
    },
    seo{metaTitle, metaDescription, "ogImage": ogImage.asset->url, noIndex}
  }
`);

export const sectorSlugsQuery = defineQuery(`
  *[_type == "sector" && defined(slug.current)]{"slug": slug.current}
`);

/** Full matrix data: every sector with its offering summaries keyed by service. */
export const matrixQuery = defineQuery(`
  {
    "services": *[_type == "service"] | order(order asc){
      _id,
      title,
      "slug": slug.current
    },
    "sectors": *[_type == "sector"] | order(order asc){
      _id,
      title,
      "slug": slug.current,
      "offerings": serviceOfferings[]{"serviceId": service._ref, summary}
    }
  }
`);
