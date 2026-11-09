"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/optimized-image";
import type { CloudinaryResource } from "@/lib/cd";
import {
  BtsVideoCard,
  getAspectClass,
  type BtsPhotoItem,
  type BtsVideoItem,
  type BtsRawVideo,
} from "@/components/bts-gallery";
import { getYouTubeVideoId } from "@/lib/youtube";

export interface BtsPageProps extends React.HTMLAttributes<HTMLElement> {
  initialImages?: CloudinaryResource[];
  initialVideos?: BtsRawVideo[];
}

export function BtsPage({
  initialImages = [],
  initialVideos = [],
  className,
  ...props
}: BtsPageProps) {
  // Process all BTS Photos
  const displayPhotos: BtsPhotoItem[] = React.useMemo(() => {
    if (!initialImages || initialImages.length === 0) return [];
    return initialImages.map((img, idx) => ({
      id: img.asset_id || img.public_id || `bts-page-photo-${idx}`,
      src: img.public_id || img.secure_url,
      alt:
        (typeof img.display_name === "string" && img.display_name) ||
        (typeof img.filename === "string" && img.filename) ||
        `B'STUDIO Behind The Scenes Photo ${idx + 1}`,
      width: img.width,
      height: img.height,
      aspectRatio: getAspectClass(img.width, img.height),
    }));
  }, [initialImages]);

  // Process all BTS Videos with valid YouTube ID
  const displayVideos: BtsVideoItem[] = React.useMemo(() => {
    if (!initialVideos || initialVideos.length === 0) return [];
    const valid: BtsVideoItem[] = [];
    for (const v of initialVideos) {
      if (!v.youtubeUrl) continue;
      const id = getYouTubeVideoId(v.youtubeUrl);
      if (id) {
        valid.push({
          id: v._id || `bts-page-video-${valid.length}`,
          title: v.title?.trim() || `Behind The Scenes ${valid.length + 1}`,
          youtubeUrl: v.youtubeUrl,
          videoId: id,
        });
      }
    }
    return valid;
  }, [initialVideos]);

  const hasPhotos = displayPhotos.length > 0;
  const hasVideos = displayVideos.length > 0;

  // Tab State: null allows derived default based on available content
  const [userTab, setUserTab] = React.useState<"PHOTOS" | "VIDEOS" | null>(
    null,
  );

  const activeTab: "PHOTOS" | "VIDEOS" =
    userTab !== null
      ? (userTab === "PHOTOS" && hasPhotos) ||
        (userTab === "VIDEOS" && hasVideos)
        ? userTab
        : hasPhotos
          ? "PHOTOS"
          : "VIDEOS"
      : hasPhotos
        ? "PHOTOS"
        : "VIDEOS";

  // Strict conditional rendering:
  // If nothing to show do not show a message (zero DOM output)
  if (!hasPhotos && !hasVideos) {
    return null;
  }

  return (
    <section
      className={cn(
        "relative w-full min-h-screen bg-bg-base text-text-primary px-3 pt-28 pb-32 select-none sm:px-6 sm:pt-36 sm:pb-40 md:px-10 md:pt-40 md:pb-48 lg:px-16",
        className,
      )}
      {...props}
    >
      {/* Editorial Page Header */}
      <div className="mx-auto mb-10 max-w-[1700px] border-b border-border-subtle pb-8 sm:mb-14 sm:pb-12">
        {/* Subtle Monograph Category Indicator */}

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-sans text-4xl font-black uppercase tracking-tight text-text-primary sm:text-6xl md:text-7xl lg:text-8xl">
              BTS ARCHIVE
            </h1>
            <p className="mt-3 max-w-2xl font-serif text-base italic text-text-primary/75 sm:mt-4 sm:text-lg md:text-xl">
              Unfiltered moments, production craft, and behind-the-lens
              chronicles from our editorial sets.
            </p>
          </div>

          {/* Filter Tabs: Rendered only when BOTH photos and videos are available */}
          {hasPhotos && hasVideos && (
            <div
              role="tablist"
              aria-label="Behind The Scenes media selector"
              className="flex items-center gap-2 sm:gap-3"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "PHOTOS"}
                onClick={() => setUserTab("PHOTOS")}
                className={cn(
                  "group relative cursor-pointer rounded-full px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300",
                  "focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-none",
                  activeTab === "PHOTOS"
                    ? "bg-text-primary text-bg-base shadow-sm"
                    : "border border-transparent text-text-muted hover:bg-[#111111]/5 hover:text-text-primary",
                )}
              >
                <span>[ PHOTOS ]</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "VIDEOS"}
                onClick={() => setUserTab("VIDEOS")}
                className={cn(
                  "group relative cursor-pointer rounded-full px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300",
                  "focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-none",
                  activeTab === "VIDEOS"
                    ? "bg-text-primary text-bg-base shadow-sm"
                    : "border border-transparent text-text-muted hover:bg-[#111111]/5 hover:text-text-primary",
                )}
              >
                <span>[ VIDEOS ]</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media Content: Photos Tab (Masonry-Style Pinterest Grid matching SampleGallery: 2 columns on small/mobile screens) */}
      {activeTab === "PHOTOS" && hasPhotos && (
        <div className="mx-auto max-w-[1700px]">
          <div className="columns-2 gap-2.5 sm:gap-4 md:columns-3 md:gap-6 lg:columns-4">
            {displayPhotos.map((item) => (
              <div
                key={item.id}
                className="group relative mb-2.5 break-inside-avoid overflow-hidden rounded-lg border border-border-subtle bg-bg-surface transition-all duration-500 hover:border-text-primary/25 hover:shadow-lg sm:mb-4 sm:rounded-xl md:mb-6"
              >
                <div
                  className={cn(
                    "relative w-full overflow-hidden",
                    item.aspectRatio,
                  )}
                  style={
                    item.width && item.height
                      ? { aspectRatio: `${item.width} / ${item.height}` }
                      : undefined
                  }
                >
                  <OptimizedImage
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Content: Videos Tab (Responsive 16:9 Video Grid) */}
      {activeTab === "VIDEOS" && hasVideos && (
        <div className="mx-auto max-w-[1700px]">
          <div
            className={cn(
              "w-full",
              displayVideos.length === 1
                ? "mx-auto max-w-3xl"
                : displayVideos.length === 2
                  ? "mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2"
                  : "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3",
            )}
          >
            {displayVideos.map((video, idx) => (
              <BtsVideoCard key={video.id} video={video} index={idx} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
