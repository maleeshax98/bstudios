"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/optimized-image";
import type { CloudinaryResource } from "@/lib/cd";
import {
  BtsCloudinaryVideoCard,
  BtsVideoCard,
  getAspectClass,
  mixMediaItems,
  type BtsPhotoItem,
  type BtsVideoItem,
  type BtsMixedMediaItem,
  type BtsRawVideo,
} from "@/components/bts-gallery";
import { getYouTubeVideoId } from "@/lib/youtube";

export interface BtsPageProps extends React.HTMLAttributes<HTMLElement> {
  initialImages?: CloudinaryResource[];
  initialVideos?: (CloudinaryResource | BtsRawVideo)[];
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
      type: "image" as const,
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

  // Process all BTS Videos from Cloudinary or YouTube fallback
  const displayVideos: BtsVideoItem[] = React.useMemo(() => {
    if (!initialVideos || initialVideos.length === 0) return [];
    const valid: BtsVideoItem[] = [];

    for (let idx = 0; idx < initialVideos.length; idx++) {
      const v = initialVideos[idx];

      // 1. Cloudinary video resource
      if ("secure_url" in v || "url" in v || ("resource_type" in v && v.resource_type === "video")) {
        const res = v as CloudinaryResource;
        const src = res.secure_url || res.url;
        if (!src) continue;
        const title =
          (typeof res.display_name === "string" && res.display_name) ||
          (typeof res.filename === "string" && res.filename) ||
          `Behind The Scenes Clip ${valid.length + 1}`;

        valid.push({
          id: res.asset_id || res.public_id || `bts-page-video-${valid.length}`,
          type: "video",
          src,
          title,
          width: res.width,
          height: res.height,
          duration: res.duration,
          aspectRatio: getAspectClass(res.width, res.height),
        });
      } else if ("youtubeUrl" in v && v.youtubeUrl) {
        // 2. YouTube fallback
        const ytId = getYouTubeVideoId(v.youtubeUrl);
        if (ytId) {
          valid.push({
            id: v._id || `bts-page-video-${valid.length}`,
            type: "video",
            src: v.youtubeUrl,
            title: v.title?.trim() || `Behind The Scenes ${valid.length + 1}`,
            youtubeId: ytId,
            aspectRatio: "aspect-video",
          });
        }
      }
    }

    return valid;
  }, [initialVideos]);

  // Mixed items (photos and videos interleaved without tabs)
  const displayItems: BtsMixedMediaItem[] = React.useMemo(() => {
    return mixMediaItems(displayPhotos, displayVideos);
  }, [displayPhotos, displayVideos]);

  // Strict conditional rendering:
  // If nothing to show do not show a message (zero DOM output)
  if (displayItems.length === 0) {
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
      {/* Editorial Page Header (No tabs per specification) */}
      <div className="mx-auto mb-10 max-w-[1700px] border-b border-border-subtle pb-8 sm:mb-14 sm:pb-12">
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
        </div>
      </div>

      {/* Media Content: Mixed Photos & Videos in Pinterest Masonry Grid */}
      <div className="mx-auto max-w-[1700px]">
        <div className="columns-2 gap-2.5 sm:gap-4 md:columns-3 md:gap-6 lg:columns-4">
          {displayItems.map((item, idx) => {
            if (item.type === "video") {
              if (item.youtubeId) {
                return (
                  <div key={item.id} className="mb-2.5 break-inside-avoid sm:mb-4 md:mb-6">
                    <BtsVideoCard video={{ id: item.id, title: item.title, videoId: item.youtubeId }} index={idx} />
                  </div>
                );
              }
              return <BtsCloudinaryVideoCard key={item.id} item={item} />;
            }

            return (
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
