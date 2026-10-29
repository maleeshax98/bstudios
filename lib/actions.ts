"use server";

import { sanityFetch } from "@/sanity/live";
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
    const { data: albums } = await sanityFetch({
      query: PAGINATED_ALBUMS_QUERY,
      params: { start, end },
      stega: false,
    });

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
