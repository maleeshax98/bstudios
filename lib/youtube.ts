/**
 * Utility functions for parsing YouTube video links, generating embed URLs,
 * and fetching thumbnail previews.
 */

/**
 * Extracts the 11-character YouTube video ID from various YouTube URL formats
 * or returns the string if it is already an 11-character ID.
 *
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - VIDEO_ID (raw 11 chars)
 */
export function getYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Raw 11-character ID (alphanumeric, dash, underscore)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Standard regex matching various YouTube URL patterns
  const regExp =
    /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return match[1];
  }

  try {
    const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1).split("/")[0].split("?")[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
    const v = parsed.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
  } catch {
    // Ignore URL parse errors
  }

  return null;
}

/**
 * Returns a privacy-enhanced YouTube embed URL with optimal playback settings.
 */
export function getYouTubeEmbedUrl(
  videoId: string,
  options?: { autoplay?: boolean; rel?: number },
): string {
  const params = new URLSearchParams({
    rel: String(options?.rel ?? 0),
    modestbranding: "1",
    enablejsapi: "1",
  });
  if (options?.autoplay) {
    params.set("autoplay", "1");
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Returns YouTube thumbnail URLs with quality options.
 * Defaults to maxresdefault with hqdefault fallback available.
 */
export function getYouTubeThumbnailUrl(
  videoId: string,
  quality: "maxres" | "hq" | "mq" = "maxres",
): string {
  const suffix =
    quality === "maxres"
      ? "maxresdefault.jpg"
      : quality === "mq"
        ? "mqdefault.jpg"
        : "hqdefault.jpg";
  return `https://img.youtube.com/vi/${videoId}/${suffix}`;
}
