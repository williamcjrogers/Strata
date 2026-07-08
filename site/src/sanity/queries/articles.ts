import { defineQuery } from "next-sanity";

export const articlesIndexQuery = defineQuery(`
  *[_type == "article"] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    heroImage{
      "alt": alt,
      asset->{_id, url, metadata{lqip, dimensions}}
    },
    author->{name, "slug": slug.current},
    "topics": topics[]->{_type, title, "slug": slug.current}
  }
`);

export const articleBySlugQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    _updatedAt,
    heroImage{
      "alt": alt,
      asset->{_id, url, metadata{lqip, dimensions}}
    },
    body,
    author->{
      _id,
      name,
      "slug": slug.current,
      role,
      qualifications,
      headshot{
        "alt": alt,
        asset->{_id, url, metadata{lqip, dimensions}}
      }
    },
    "topics": topics[]->{_type, title, "slug": slug.current},
    "related": coalesce(
      related[]->{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        heroImage{
          "alt": alt,
          asset->{_id, url, metadata{lqip, dimensions}}
        },
        author->{name}
      },
      *[_type == "article" && slug.current != $slug]
        | order(publishedAt desc)[0...2]{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        heroImage{
          "alt": alt,
          asset->{_id, url, metadata{lqip, dimensions}}
        },
        author->{name}
      }
    ),
    seo{metaTitle, metaDescription, "ogImage": ogImage.asset->url, noIndex}
  }
`);

export const articleSlugsQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)]{"slug": slug.current}
`);
