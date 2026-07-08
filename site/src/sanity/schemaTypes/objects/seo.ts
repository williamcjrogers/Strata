import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description: "Overrides the page title in search results (max 60 characters).",
      validation: (rule) => rule.max(60).warning("Keep meta titles under 60 characters."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160).warning("Keep meta descriptions under 160 characters."),
    }),
    defineField({
      name: "ogImage",
      title: "Social sharing image",
      type: "image",
      description: "1200 x 630 recommended. Falls back to the site default.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
