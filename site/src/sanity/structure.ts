import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.documentTypeListItem("page").title("Pages"),
      S.listItem()
        .title("Services")
        .schemaType("service")
        .child(
          S.documentTypeList("service")
            .title("Services")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.listItem()
        .title("Sectors")
        .schemaType("sector")
        .child(
          S.documentTypeList("sector")
            .title("Sectors")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.documentTypeListItem("project").title("Projects"),
      S.listItem()
        .title("People")
        .schemaType("person")
        .child(
          S.documentTypeList("person")
            .title("People")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.listItem()
        .title("Insights")
        .schemaType("article")
        .child(
          S.documentTypeList("article")
            .title("Insights")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
    ]);
