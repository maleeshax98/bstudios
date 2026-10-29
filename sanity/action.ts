"use server";

import { revalidateTag, revalidatePath } from "next/cache";

/**
 * Server action for Sanity Live Content updates.
 * Revalidates Next.js cache tags and layout path, then returns "refresh"
 * to guarantee that the browser automatically refreshes and displays
 * published Sanity changes in real time across development and production.
 */
export async function revalidateAndRefresh(
  unsafeTags: unknown,
): Promise<"refresh"> {
  try {
    if (Array.isArray(unsafeTags)) {
      for (const tag of unsafeTags) {
        if (typeof tag === "string" && tag.trim()) {
          revalidateTag(tag, "max");
        }
      }
    }
    // Revalidate root layout path to ensure no stale route or fetch cache remains
    revalidatePath("/", "layout");
  } catch (err) {
    console.warn("Failed to revalidate tags in live action:", err);
  }
  return "refresh";
}
