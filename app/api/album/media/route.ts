import { NextResponse } from "next/server";
import { getImages, getVideos } from "@/lib/cd";

export const dynamic = "force-dynamic";

/**
 * API Route Handler for paginated single album media fetching.
 * Using an API route prevents Next.js Server Action flight re-renders
 * and Suspense boundary triggers, keeping the gallery visible and rock-solid
 * while appending new photos/videos smoothly.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder");
    const cursor = searchParams.get("cursor");
    const type = searchParams.get("type") || "image";
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    if (!folder) {
      return NextResponse.json(
        { error: "Folder parameter is required." },
        { status: 400 },
      );
    }

    if (type === "video") {
      const data = await getVideos(folder, cursor, limit);
      return NextResponse.json(data);
    }

    const data = await getImages(folder, cursor, limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/album/media:", error);
    return NextResponse.json(
      { error: "Failed to fetch album media." },
      { status: 500 },
    );
  }
}
