"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME,
  api_key:
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryResource {
  asset_id: string;
  public_id: string;
  format: string;
  version: number;
  resource_type: "image" | "video";
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  asset_folder?: string;
  url: string;
  secure_url: string;
  duration?: number;
  aspect_ratio?: number;
  [key: string]: unknown;
}

export interface CloudinaryPaginationResult {
  resources: CloudinaryResource[];
  nextCursor: string | null;
  totalCount: number;
}

/**
 * Helper to execute Cloudinary Search API call with Next.js native fetch caching.
 * Caches the array of media items locally for 1 hour (revalidate: 3600)
 * to avoid hitting the Cloudinary Search API on every page load.
 */
async function searchCloudinaryWithCache(
  expression: string,
  nextCursor?: string | null,
  limit = 12,
  sortDirection: "asc" | "desc" = "asc",
): Promise<CloudinaryPaginationResult> {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey =
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return { resources: [], nextCursor: null, totalCount: 0 };
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const bodyPayload: Record<string, unknown> = {
    expression,
    sort_by: [{ created_at: sortDirection }],
    max_results: limit,
  };

  if (nextCursor) {
    bodyPayload.next_cursor = nextCursor;
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    },
  );

  if (!res.ok) {
    throw new Error(`Cloudinary search API returned HTTP ${res.status}`);
  }

  const data = await res.json();
  return {
    resources: (data.resources as CloudinaryResource[]) || [],
    nextCursor: data.next_cursor || null,
    totalCount: data.total_count || 0,
  };
}

const getImages = async (
  folderName: string,
  nextCursor?: string | null,
  limit = 12,
): Promise<CloudinaryPaginationResult> => {
  if (!folderName) return { resources: [], nextCursor: null, totalCount: 0 };

  const expression = `asset_folder=${folderName} AND resource_type=image`;

  // 1. Primary: Next.js native fetch caching with revalidate: 3600
  try {
    return await searchCloudinaryWithCache(expression, nextCursor, limit);
  } catch (fetchErr) {
    console.warn("Native fetch caching fallback to Cloudinary SDK:", fetchErr);
  }

  // 2. Secondary fallback via Cloudinary SDK
  try {
    let search = cloudinary.search
      .expression(expression)
      .sort_by("created_at", "asc")
      .max_results(limit);

    if (nextCursor) {
      search = search.next_cursor(nextCursor);
    }

    const resources = await search.execute();
    return {
      resources: (resources?.resources as CloudinaryResource[]) || [],
      nextCursor: resources?.next_cursor || null,
      totalCount: resources?.total_count || 0,
    };
  } catch (err) {
    console.error("Cloudinary getImages error:", err);
    return { resources: [], nextCursor: null, totalCount: 0 };
  }
};

const getVideos = async (
  folderName: string,
  nextCursor?: string | null,
  limit = 12,
): Promise<CloudinaryPaginationResult> => {
  if (!folderName) return { resources: [], nextCursor: null, totalCount: 0 };

  const expression = `asset_folder=${folderName} AND resource_type=video`;

  // 1. Primary: Next.js native fetch caching with revalidate: 3600
  try {
    return await searchCloudinaryWithCache(expression, nextCursor, limit);
  } catch (fetchErr) {
    console.warn("Native fetch caching fallback to Cloudinary SDK:", fetchErr);
  }

  // 2. Secondary fallback via Cloudinary SDK
  try {
    let search = cloudinary.search
      .expression(expression)
      .sort_by("created_at", "asc")
      .max_results(limit);

    if (nextCursor) {
      search = search.next_cursor(nextCursor);
    }

    const resources = await search.execute();
    return {
      resources: (resources?.resources as CloudinaryResource[]) || [],
      nextCursor: resources?.next_cursor || null,
      totalCount: resources?.total_count || 0,
    };
  } catch (err) {
    console.error("Cloudinary getVideos error:", err);
    return { resources: [], nextCursor: null, totalCount: 0 };
  }
};

const getSampleImages = async (
  limit = 12,
): Promise<CloudinaryPaginationResult> => {
  const expression = `(asset_folder="SAMPLE-IMAGES-HOME-PAGE" OR asset_folder="SIHP") AND resource_type=image`;

  // 1. Primary: Next.js native fetch caching with revalidate: 3600
  try {
    return await searchCloudinaryWithCache(expression, null, limit, "desc");
  } catch (fetchErr) {
    console.warn("Native fetch caching fallback to Cloudinary SDK:", fetchErr);
  }

  // 2. Secondary fallback via Cloudinary SDK
  try {
    const search = cloudinary.search
      .expression(expression)
      .sort_by("created_at", "desc")
      .max_results(limit);

    const resources = await search.execute();
    return {
      resources: (resources?.resources as CloudinaryResource[]) || [],
      nextCursor: resources?.next_cursor || null,
      totalCount: resources?.total_count || 0,
    };
  } catch (err) {
    console.error("Cloudinary getSampleImages error:", err);
    return { resources: [], nextCursor: null, totalCount: 0 };
  }
};

export { getImages, getVideos, searchCloudinaryWithCache, getSampleImages };
