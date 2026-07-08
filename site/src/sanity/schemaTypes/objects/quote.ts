import { defineField, defineType } from "sanity";

export const quote = defineType({
  name: "quote",
  title: "Quote",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attributionName",
      title: "Attribution name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attributionRole",
      title: "Attribution role",
      type: "string",
      description: 'For example "Director, Strata Cost Consulting".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "person",
      title: "Team member",
      type: "reference",
      to: [{ type: "person" }],
      description: "Optional. Links the quote to a team profile.",
    }),
  ],
  preview: {
    select: { title: "text", subtitle: "attributionName" },
  },
});
