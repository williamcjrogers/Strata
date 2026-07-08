import { defineArrayMember, defineField, defineType } from "sanity";

export const sector = defineType({
  name: "sector",
  title: "Sector",
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: "strapline",
      title: "Strapline",
      type: "string",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Card copy on the sectors hub and home page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alternative text", type: "string" }),
      ],
    }),
    defineField({
      name: "marketContext",
      title: "Market context",
      type: "blockContent",
      description: "The sector challenge and why it matters now.",
    }),
    defineField({
      name: "keyStats",
      title: "Key statistics",
      type: "array",
      of: [defineArrayMember({ type: "stat" })],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "serviceOfferings",
      title: "Service offerings",
      type: "array",
      description:
        "How each service line applies in this sector. This array drives the service and sector matrix.",
      of: [
        defineArrayMember({
          name: "serviceOffering",
          title: "Service offering",
          type: "object",
          fields: [
            defineField({
              name: "service",
              title: "Service",
              type: "reference",
              to: [{ type: "service" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "summary",
              title: "How it applies in this sector",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "service.title", subtitle: "summary" },
          },
        }),
      ],
    }),
    defineField({
      name: "featuredProjects",
      title: "Featured projects",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
    }),
    defineField({ name: "quote", title: "Quote", type: "quote" }),
    defineField({ name: "cta", title: "Call to action", type: "cta" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "strapline" },
  },
});
