import { defineArrayMember, defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
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
      description: "One line beneath the title on the service page.",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Card copy on the services hub and home page.",
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
      name: "intro",
      title: "Introduction",
      type: "blockContent",
    }),
    defineField({
      name: "engagementModel",
      title: "Engagement model",
      type: "string",
      description: 'For example "Primarily fixed fee" or "Time based".',
    }),
    defineField({
      name: "deliverables",
      title: "What is included",
      type: "array",
      of: [
        defineArrayMember({
          name: "deliverable",
          title: "Deliverable",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
          ],
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
