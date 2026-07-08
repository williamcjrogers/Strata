/*
  Permissive fallbacks so the app builds before the Sanity project is
  created (build step 3 is a user action). Anything that actually talks
  to the API (seed script, live fetches) asserts real values itself.
*/
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-19";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";

export const studioUrl = "/studio";
