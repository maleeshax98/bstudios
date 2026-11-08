import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/live";
import { PAGINATED_ALBUMS_QUERY } from "@/sanity/queries";
import type { WorksPageAlbum } from "@/components/works/works-page";

export const dynamic = "force-dynamic";

/**
 * GET /api/albums?start=0&limit=6
 * Lightweight Route Handler for works archive pagination.
 * Prevents Next.js Server Action flight re-renders and Suspense fallback triggers,
 * ensuring existing albums stay completely visible and rock-solid while loading more.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = Math.max(0, parseInt(searchParams.get("start") || "0", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "6", 10));
    const end = start + limit;

    const { data: albums } = await sanityFetch({
      query: PAGINATED_ALBUMS_QUERY,
      params: { start, end },
      stega: false,
    });

    const albumList = (albums as WorksPageAlbum[]) || [];
    return NextResponse.json({
      albums: albumList,
      hasMore: albumList.length === limit,
    });
  } catch (error) {
    console.error("Error in /api/albums:", error);
    return NextResponse.json(
      { error: "Failed to fetch albums", albums: [], hasMore: false },
      { status: 500 },
    );
  }
}
