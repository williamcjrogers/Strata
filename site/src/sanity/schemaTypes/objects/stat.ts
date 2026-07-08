import { defineField, defineType } from "sanity";

export const stat = defineType({
  name: "stat",
  title: "Statistic",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: 'Display value, for example "£32bn", "10 years", "50%".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "Optional attribution, for example the publisher of the figure.",
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
  },
});
