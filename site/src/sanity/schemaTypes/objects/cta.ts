import { defineField, defineType } from "sanity";

export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "text",
      title: "Supporting text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "link",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "statusChips",
      title: "Status chips",
      type: "array",
      description:
        'Short live-status signals, for example "Accepting instructions".',
      of: [{ type: "string" }],
      validation: (rule) => rule.max(3),
    }),
  ],
});
