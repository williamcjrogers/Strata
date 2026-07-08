import { defineArrayMember, defineField, defineType } from "sanity";

export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "qualifications",
      title: "Qualifications",
      type: "string",
      description: 'For example "BSc (Hons) MRICS".',
    }),
    defineField({
      name: "headshot",
      title: "Headshot",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alternative text", type: "string" }),
      ],
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "blockContent",
    }),
    defineField({
      name: "specialisms",
      title: "Specialisms",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "service" }, { type: "sector" }],
        }),
      ],
    }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "linkedinUrl", title: "LinkedIn URL", type: "url" }),
    defineField({
      name: "isSenior",
      title: "Senior team member",
      type: "boolean",
      description: "Senior members can be attributed on quotes.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.integer(),
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "headshot" },
  },
});
