import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
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
      name: "client",
      title: "Client",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: 'Display value, for example "£45m".',
    }),
    defineField({
      name: "servicesProvided",
      title: "Services provided",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "sectors",
      title: "Sectors",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "sector" }] })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "completed",
      title: "Completion",
      type: "string",
      description: 'For example "2025" or "Ongoing".',
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Card copy on project listings.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Case study",
      type: "blockContent",
      description: "Challenge, approach and outcome with commercial results.",
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
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.integer(),
    }),
    defineField({ name: "quote", title: "Quote", type: "quote" }),
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
    select: { title: "title", client: "client", location: "location" },
    prepare: ({ title, client, location }) => ({
      title,
      subtitle: [client, location].filter(Boolean).join(" · "),
    }),
  },
});
