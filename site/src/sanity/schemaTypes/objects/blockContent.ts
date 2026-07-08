import { defineArrayMember, defineField, defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "externalLink",
            title: "External link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
              }),
            ],
          }),
          defineArrayMember({
            name: "internalLink",
            title: "Internal link",
            type: "object",
            fields: [
              defineField({
                name: "reference",
                title: "Destination",
                type: "reference",
                to: [
                  { type: "page" },
                  { type: "service" },
                  { type: "sector" },
                  { type: "project" },
                  { type: "article" },
                  { type: "person" },
                ],
                validation: (rule) => rule.required(),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      name: "figure",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
    defineArrayMember({
      name: "pullQuote",
      title: "Pull quote",
      type: "quote",
    }),
    defineArrayMember({
      name: "statGroup",
      title: "Statistics",
      type: "object",
      fields: [
        defineField({
          name: "stats",
          title: "Statistics",
          type: "array",
          of: [defineArrayMember({ type: "stat" })],
          validation: (rule) => rule.min(1).max(4),
        }),
      ],
      preview: {
        select: { stats: "stats" },
        prepare: ({ stats }) => ({
          title: "Statistics",
          subtitle: `${stats?.length ?? 0} items`,
        }),
      },
    }),
  ],
});
