"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

export default defineConfig({
  name: "scc",
  title: "Strata Cost Consulting",
  projectId,
  dataset,
  basePath: studioUrl,
  schema: {
    types: schemaTypes,
    // the singleton is edited through the pinned structure item only
    templates: (templates) =>
      templates.filter((template) => template.schemaType !== "siteSettings"),
  },
  document: {
    actions: (actions, context) =>
      context.schemaType === "siteSettings"
        ? actions.filter(
            (action) =>
              action.action !== "delete" && action.action !== "duplicate",
          )
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        initial: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
});
