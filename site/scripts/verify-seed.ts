import { createClient } from "@sanity/client";

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2026-05-19",
  useCdn: false,
});

const q = `{
  "pages": count(*[_type=="page"]),
  "services": count(*[_type=="service"]),
  "sectors": count(*[_type=="sector"]),
  "projects": count(*[_type=="project"]),
  "people": count(*[_type=="person"]),
  "articles": count(*[_type=="article"]),
  "settings": count(*[_type=="siteSettings"]),
  "brokenRefs": count(*[references("missing")])
}`;

c.fetch(q).then((r) => console.log(JSON.stringify(r)));
