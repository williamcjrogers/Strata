import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    siteTitle,
    shortName,
    tagline,
    description,
    contact{
      email,
      phone,
      addressLines,
      linkedinUrl
    },
    credentialsStats[]{
      value,
      label,
      source,
      sourceUrl
    },
    defaultSeo{
      metaTitle,
      metaDescription,
      "ogImage": ogImage.asset->url
    }
  }
`);
