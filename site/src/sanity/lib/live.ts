import "server-only";

import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { readToken } from "./token";

/*
  Single data-access path for every page: sanityFetch + <SanityLive />.
  Live content revalidates published changes automatically; the read
  token also powers draft mode for the Presentation tool.
*/
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  browserToken: readToken,
});
