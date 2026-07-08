import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionTypes } from "../objects/sections";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      description:
        'Fixed slugs drive routing: home, about, services, sectors, projects, people, insights, careers, contact, privacy.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "lede", title: "Lede", type: "text", rows: 3 }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alternative text", type: "string" }),
          ],
        }),
        defineField({ name: "cta", title: "Call to action", type: "link" }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: sectionTypes.map((type) => defineArrayMember({ type: type.name })),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title, subtitle: `/${slug === "home" ? "" : (slug ?? "")}` }),
  },
});
