import { defineLive } from "next-sanity/live";
import { client } from "./client";

// Read token for server-side live content and draft queries.
// Never pass write tokens as browserToken to prevent exposing secrets to client bundles.
const serverToken =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: serverToken || false,
  browserToken: process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN || false,
});
