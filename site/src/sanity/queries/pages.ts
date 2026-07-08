import { defineQuery } from "next-sanity";

export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    hero{
      eyebrow,
      heading,
      lede,
      image{
        "alt": alt,
        asset->{_id, url, metadata{lqip, dimensions}}
      },
      cta{
        label,
        linkType,
        external,
        internal->{_type, "slug": slug.current}
      }
    },
    sections[]{
      _key,
      _type,
      _type == "richTextSection" => {
        eyebrow,
        heading,
        content
      },
      _type == "statsBand" => {
        eyebrow,
        heading,
        useGlobalStats,
        stats[]{value, label, source, sourceUrl}
      },
      _type == "quoteBand" => {
        quote{
          text,
          attributionName,
          attributionRole,
          person->{name, "slug": slug.current}
        }
      },
      _type == "ctaBand" => {
        cta{
          heading,
          text,
          link{
            label,
            linkType,
            external,
            internal->{_type, "slug": slug.current}
          }
        }
      },
      _type == "featureGrid" => {
        eyebrow,
        heading,
        items[]{
          _key,
          heading,
          text,
          link{
            label,
            linkType,
            external,
            internal->{_type, "slug": slug.current}
          }
        }
      },
      _type == "projectGrid" => {
        eyebrow,
        heading,
        mode,
        projects[]->{
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
      },
      _type == "peopleGrid" => {
        eyebrow,
        heading,
        people[]->{
          _id,
          name,
          "slug": slug.current,
          role,
          qualifications,
          headshot{
            "alt": alt,
            asset->{_id, url, metadata{lqip, dimensions}}
          }
        }
      },
      _type == "serviceMatrix" => {
        eyebrow,
        heading,
        intro
      },
      _type == "logoStrip" => {
        heading,
        logos[]{
          _key,
          "alt": alt,
          asset->{_id, url, metadata{lqip, dimensions}}
        }
      }
    },
    seo{metaTitle, metaDescription, "ogImage": ogImage.asset->url, noIndex}
  }
`);

export const pageSlugsQuery = defineQuery(`
  *[_type == "page" && defined(slug.current)]{"slug": slug.current}
`);
