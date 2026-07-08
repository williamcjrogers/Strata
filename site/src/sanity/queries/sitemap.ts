import { defineQuery } from "next-sanity";

export const sitemapQuery = defineQuery(`
  {
    "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true]{
      "slug": slug.current, _updatedAt
    },
    "services": *[_type == "service" && defined(slug.current)]{
      "slug": slug.current, _updatedAt
    },
    "sectors": *[_type == "sector" && defined(slug.current)]{
      "slug": slug.current, _updatedAt
    },
    "projects": *[_type == "project" && defined(slug.current)]{
      "slug": slug.current, _updatedAt
    },
    "people": *[_type == "person" && defined(slug.current)]{
      "slug": slug.current, _updatedAt
    },
    "articles": *[_type == "article" && defined(slug.current)]{
      "slug": slug.current, _updatedAt
    }
  }
`);
