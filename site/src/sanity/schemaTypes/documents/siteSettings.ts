import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      initialValue: "Strata Cost Consulting",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortName",
      title: "Short name",
      type: "string",
      initialValue: "SCC",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Default description",
      type: "text",
      rows: 3,
      description: "Used as the default meta description.",
    }),
    defineField({
      name: "contact",
      title: "Contact details",
      type: "object",
      fields: [
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({
          name: "addressLines",
          title: "Address",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({ name: "linkedinUrl", title: "LinkedIn URL", type: "url" }),
      ],
    }),
    defineField({
      name: "standardsLine",
      title: "Professional standards line",
      type: "string",
      description:
        "Optional footer line for professional-body affiliations (e.g. RICS). Leave empty until the firm's regulatory status is confirmed.",
    }),
    defineField({
      name: "credentialsStats",
      title: "Credentials statistics",
      type: "array",
      description: "The reusable statistics band (market evidence, track record).",
      of: [defineArrayMember({ type: "stat" })],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
