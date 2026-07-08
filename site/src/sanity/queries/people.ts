import { defineQuery } from "next-sanity";

export const peopleIndexQuery = defineQuery(`
  *[_type == "person"] | order(order asc, name asc){
    _id,
    name,
    "slug": slug.current,
    role,
    qualifications,
    isSenior,
    headshot{
      "alt": alt,
      asset->{_id, url, metadata{lqip, dimensions}}
    }
  }
`);

export const personBySlugQuery = defineQuery(`
  *[_type == "person" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    role,
    qualifications,
    email,
    linkedinUrl,
    isSenior,
    headshot{
      "alt": alt,
      asset->{_id, url, metadata{lqip, dimensions}}
    },
    bio,
    "specialisms": specialisms[]->{_type, title, "slug": slug.current},
    "articles": *[_type == "article" && author._ref == ^._id]
      | order(publishedAt desc)[0...3]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt
    }
  }
`);

export const personSlugsQuery = defineQuery(`
  *[_type == "person" && defined(slug.current)]{"slug": slug.current}
`);
