import { defineField, defineType } from "sanity";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "linkType",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Internal", value: "internal" },
          { title: "External", value: "external" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "internal",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "internal",
      title: "Internal destination",
      type: "reference",
      to: [
        { type: "page" },
        { type: "service" },
        { type: "sector" },
        { type: "project" },
        { type: "article" },
        { type: "person" },
      ],
      hidden: ({ parent }) => parent?.linkType !== "internal",
    }),
    defineField({
      name: "external",
      title: "External URL",
      type: "url",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
      hidden: ({ parent }) => parent?.linkType !== "external",
    }),
  ],
});
