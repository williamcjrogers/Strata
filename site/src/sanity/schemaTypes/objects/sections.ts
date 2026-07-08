import { defineArrayMember, defineField, defineType } from "sanity";

/*
  Page-builder section objects. SectionRenderer.tsx dispatches on _type,
  mapping each to a site component:
  richTextSection -> Prose, statsBand -> CredentialsBand,
  quoteBand -> Quote, ctaBand -> CTASection, featureGrid -> feature cards,
  projectGrid -> ProjectCard grid, peopleGrid -> PersonCard grid,
  serviceMatrix -> ServiceSectorMatrix, logoStrip -> logo band.
*/

const sectionHeader = [
  defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
  defineField({ name: "heading", title: "Heading", type: "string" }),
];

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich text",
  type: "object",
  fields: [
    ...sectionHeader,
    defineField({
      name: "content",
      title: "Content",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Rich text", subtitle: "Rich text" }),
  },
});

export const statsBand = defineType({
  name: "statsBand",
  title: "Statistics band",
  type: "object",
  fields: [
    ...sectionHeader,
    defineField({
      name: "useGlobalStats",
      title: "Use the global credentials statistics",
      type: "boolean",
      description: "When on, shows the statistics from Site settings.",
      initialValue: false,
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [defineArrayMember({ type: "stat" })],
      hidden: ({ parent }) => parent?.useGlobalStats === true,
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Statistics band", subtitle: "Statistics band" }),
  },
});

export const quoteBand = defineType({
  name: "quoteBand",
  title: "Quote band",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "quote",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "quote.attributionName" },
    prepare: ({ title }) => ({ title: title || "Quote", subtitle: "Quote band" }),
  },
});

export const ctaBand = defineType({
  name: "ctaBand",
  title: "Call to action band",
  type: "object",
  fields: [
    defineField({
      name: "cta",
      title: "Call to action",
      type: "cta",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "cta.heading" },
    prepare: ({ title }) => ({ title: title || "Call to action", subtitle: "CTA band" }),
  },
});

export const featureGrid = defineType({
  name: "featureGrid",
  title: "Feature grid",
  type: "object",
  fields: [
    ...sectionHeader,
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          name: "featureItem",
          title: "Feature",
          type: "object",
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
            defineField({ name: "link", title: "Link", type: "link" }),
          ],
        }),
      ],
      validation: (rule) => rule.min(2).max(6),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Feature grid", subtitle: "Feature grid" }),
  },
});

export const projectGrid = defineType({
  name: "projectGrid",
  title: "Project grid",
  type: "object",
  fields: [
    ...sectionHeader,
    defineField({
      name: "mode",
      title: "Selection",
      type: "string",
      options: {
        list: [
          { title: "Featured projects", value: "featured" },
          { title: "Manual selection", value: "manual" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "featured",
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      hidden: ({ parent }) => parent?.mode !== "manual",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Project grid", subtitle: "Project grid" }),
  },
});

export const peopleGrid = defineType({
  name: "peopleGrid",
  title: "People grid",
  type: "object",
  fields: [
    ...sectionHeader,
    defineField({
      name: "people",
      title: "People",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
      description: "Leave empty to show the full team in order.",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "People grid", subtitle: "People grid" }),
  },
});

export const serviceMatrix = defineType({
  name: "serviceMatrix",
  title: "Service and sector matrix",
  type: "object",
  fields: [
    ...sectionHeader,
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Service matrix", subtitle: "Service and sector matrix" }),
  },
});

export const logoStrip = defineType({
  name: "logoStrip",
  title: "Logo strip",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          fields: [
            defineField({
              name: "alt",
              title: "Organisation name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Logo strip", subtitle: "Logo strip" }),
  },
});

export const sectionTypes = [
  richTextSection,
  statsBand,
  quoteBand,
  ctaBand,
  featureGrid,
  projectGrid,
  peopleGrid,
  serviceMatrix,
  logoStrip,
];

/** Shared page-builder array member list. */
export const sectionMembers = sectionTypes.map((type) =>
  defineArrayMember({ type: type.name }),
);
