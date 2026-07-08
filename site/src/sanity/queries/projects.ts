import { defineQuery } from "next-sanity";

export const projectsIndexQuery = defineQuery(`
  *[_type == "project"
    && ($sector == null || $sector in sectors[]->slug.current)
    && ($service == null || $service in servicesProvided[]->slug.current)]
  | order(featured desc, order asc, title asc){
    _id,
    title,
    "slug": slug.current,
    client,
    location,
    value,
    summary,
    featured,
    heroImage{
      "alt": alt,
      asset->{_id, url, metadata{lqip, dimensions}}
    },
    "sectors": sectors[]->{title, "slug": slug.current},
    "services": servicesProvided[]->{title, "slug": slug.current}
  }
`);

export const featuredProjectsQuery = defineQuery(`
  *[_type == "project" && featured == true] | order(order asc, title asc)[0...4]{
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
  }
`);

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    client,
    location,
    value,
    completed,
    summary,
    body,
    heroImage{
      "alt": alt,
      asset->{_id, url, metadata{lqip, dimensions}}
    },
    gallery[]{
      _key,
      "alt": alt,
      caption,
      asset->{_id, url, metadata{lqip, dimensions}}
    },
    "sectors": sectors[]->{_id, title, "slug": slug.current},
    "services": servicesProvided[]->{_id, title, "slug": slug.current},
    quote{
      text,
      attributionName,
      attributionRole,
      person->{name, "slug": slug.current}
    },
    "related": *[_type == "project" && slug.current != $slug
      && count((sectors[]._ref)[@ in ^.^.sectors[]._ref]) > 0]
      | order(featured desc, order asc)[0...3]{
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
    seo{metaTitle, metaDescription, "ogImage": ogImage.asset->url, noIndex}
  }
`);

export const projectSlugsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)]{"slug": slug.current}
`);

/** Facet lists for the projects filter bar. */
export const projectFacetsQuery = defineQuery(`
  {
    "sectors": *[_type == "sector"] | order(order asc){title, "slug": slug.current},
    "services": *[_type == "service"] | order(order asc){title, "slug": slug.current}
  }
`);
