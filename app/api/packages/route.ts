import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/live";
import { PAGINATED_PACKAGES_QUERY } from "@/sanity/queries";
import type { PackageItem } from "@/components/packages/packages-page";

export const dynamic = "force-dynamic";

/**
 * GET /api/packages?start=0&limit=6&category=wedding
 * Lightweight Route Handler for packages pagination.
 * Supports category filtering for server-side paginated queries.
 * Prevents client-side in-memory filtering and Server Action flight re-renders.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = Math.max(0, parseInt(searchParams.get("start") || "0", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "6", 10));
    const end = start + limit;
    const category = searchParams.get("category")?.trim() || "ALL";
    const categoryNormalized = category.replace(/-/g, " ");

    const { data: packages } = await sanityFetch({
      query: PAGINATED_PACKAGES_QUERY,
      params: { start, end, category, categoryNormalized },
      stega: false,
    });

    const packageList = (packages as PackageItem[]) || [];
    return NextResponse.json({
      packages: packageList,
      hasMore: packageList.length === limit,
    });
  } catch (error) {
    console.error("Error in /api/packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages", packages: [], hasMore: false },
      { status: 500 },
    );
  }
}
