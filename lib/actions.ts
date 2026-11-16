"use server";

import { sanityFetch } from "@/sanity/live";
import { PAGINATED_ALBUMS_QUERY, PAGINATED_PACKAGES_QUERY } from "@/sanity/queries";
import type { WorksPageAlbum } from "@/components/works/works-page";
import type { PackageItem } from "@/components/packages/packages-page";

export async function fetchMoreAlbums(
  start: number,
  limit = 6,
  category = "ALL",
): Promise<{
  albums: WorksPageAlbum[];
  hasMore: boolean;
}> {
  try {
    const end = start + limit;
    const cat = category?.trim() || "ALL";
    const categoryNormalized = cat.replace(/-/g, " ");
    const { data: albums } = await sanityFetch({
      query: PAGINATED_ALBUMS_QUERY,
      params: { start, end, category: cat, categoryNormalized },
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

export async function fetchMorePackages(
  start: number,
  limit = 6,
  category = "ALL",
): Promise<{
  packages: PackageItem[];
  hasMore: boolean;
}> {
  try {
    const end = start + limit;
    const cat = category?.trim() || "ALL";
    const categoryNormalized = cat.replace(/-/g, " ");
    const { data: packages } = await sanityFetch({
      query: PAGINATED_PACKAGES_QUERY,
      params: { start, end, category: cat, categoryNormalized },
      stega: false,
    });

    return {
      packages: (packages as PackageItem[]) || [],
      hasMore: (packages || []).length === limit,
    };
  } catch (error) {
    console.error("fetchMorePackages error:", error);
    return {
      packages: [],
      hasMore: false,
    };
  }
}
