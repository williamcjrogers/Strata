import { defineQuery } from "next-sanity";

export const servicesIndexQuery = defineQuery(`
  *[_type == "service"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    order,
    strapline,
    summary,
    engagementModel
  }
`);

export const serviceBySlugQuery = defineQuery(`
  *[_type == "service" && slug.current == $slug][0]{
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
    intro,
    engagementModel,
    deliverables[]{_key, title, description},
    "sectors": *[_type == "sector" && references(^._id)] | order(order asc){
      _id,
      title,
      "slug": slug.current,
      "offerings": serviceOfferings[]{"serviceId": service._ref, summary}
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

export const serviceSlugsQuery = defineQuery(`
  *[_type == "service" && defined(slug.current)]{"slug": slug.current}
`);
