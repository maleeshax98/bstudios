"use server";

import { client } from "@/sanity/client";
import { PAGINATED_ALBUMS_QUERY } from "@/sanity/queries";
import type { WorksPageAlbum } from "@/components/works/works-page";

export async function fetchMoreAlbums(
  start: number,
  limit = 6,
): Promise<{
  albums: WorksPageAlbum[];
  hasMore: boolean;
}> {
  try {
    const end = start + limit;
    const albums = await client.fetch(PAGINATED_ALBUMS_QUERY, { start, end });

    return {
      albums: (albums as WorksPageAlbum[]) || [],
      hasMore: (albums || []).length === limit,
    };
  } catch (error) {
    console.error("fetchMoreAlbums error:", error);
    return {
      albums: [],
      hasMore: false,
    };
  }
}
