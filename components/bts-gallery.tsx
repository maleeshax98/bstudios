"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Play, Film } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/optimized-image";
import type { CloudinaryResource } from "@/lib/cd";
import {
  getYouTubeVideoId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
} from "@/lib/youtube";

export interface BtsPhotoItem {
  id: string;
  src: string;
  alt: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
}

export interface BtsVideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  videoId: string;
}

export interface BtsRawVideo {
  _id: string;
  title?: string | null;
  youtubeUrl?: string | null;
  publishedAt?: string | null;
}

export interface BtsGalleryProps extends React.HTMLAttributes<HTMLElement> {
  initialImages?: CloudinaryResource[];
  initialVideos?: BtsRawVideo[];
}

export function getAspectClass(width?: number, height?: number): string {
  if (!width || !height) return "aspect-[3/4]";
  const ratio = width / height;
  if (ratio >= 1.4) return "aspect-[16/10]";
  if (ratio >= 1.15) return "aspect-[4/3]";
  if (ratio >= 0.9) return "aspect-[1/1]";
  if (ratio >= 0.7) return "aspect-[4/5]";
  return "aspect-[2/3]";
}

/**
 * Interactive YouTube Video Card for BTS gallery.
 * Implements a lightweight facade pattern: loads thumbnail preview first,
 * then mounts responsive iframe upon click for optimal Core Web Vitals and zero CLS.
 */
export function BtsVideoCard({
  video,
  index,
}: {
  video: BtsVideoItem;
  index: number;
}) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [thumbError, setThumbError] = React.useState(false);

  const thumbUrl = thumbError
    ? getYouTubeThumbnailUrl(video.videoId, "hq")
    : getYouTubeThumbnailUrl(video.videoId, "maxres");

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border-subtle bg-black shadow-md transition-all duration-300 hover:border-text-primary/30 hover:shadow-2xl">
      {isPlaying ? (
        <iframe
          src={getYouTubeEmbedUrl(video.videoId, { autoplay: true })}
          title={video.title || `BTS Video ${index + 1}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <div
          onClick={() => setIsPlaying(true)}
          className="relative h-full w-full cursor-pointer select-none"
        >
          {/* YouTube Video Thumbnail */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbUrl}
            alt={video.title || `Behind The Scenes ${index + 1}`}
            onError={() => setThumbError(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Cinematic Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 transition-opacity duration-300 group-hover:opacity-90" />

          {/* Centered Play Button */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-text-primary shadow-2xl transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
              <Play className="ml-1 h-6 w-6 fill-text-primary stroke-none sm:h-7 sm:w-7 dark:fill-black" />
            </div>
          </div>

          {/* Top-Right YouTube Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md border border-white/15 bg-black/70 px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            <Film className="h-3 w-3 stroke-[2]" />
            <span>YouTube</span>
          </div>

          {/* Bottom Title & Index Badge */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="mb-0.5 block font-serif text-xs italic text-white/70">
                BTS {String(index + 1).padStart(2, "0")}
              </span>
              <h4 className="truncate font-sans text-sm font-bold uppercase tracking-wide text-white sm:text-base">
                {video.title || `Behind The Scenes ${index + 1}`}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function BtsGallery({
  initialImages = [],
  initialVideos = [],
  className,
  ...props
}: BtsGalleryProps) {
  const magneticButtonRef = React.useRef<HTMLDivElement>(null);

  // Process Photos (up to 12)
  const displayPhotos: BtsPhotoItem[] = React.useMemo(() => {
    if (!initialImages || initialImages.length === 0) return [];
    return initialImages.slice(0, 12).map((img, idx) => ({
      id: img.asset_id || img.public_id || `bts-photo-${idx}`,
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

  // Process Videos (up to 6 with valid YouTube ID)
  const displayVideos: BtsVideoItem[] = React.useMemo(() => {
    if (!initialVideos || initialVideos.length === 0) return [];
    const valid: BtsVideoItem[] = [];
    for (const v of initialVideos) {
      if (!v.youtubeUrl) continue;
      const id = getYouTubeVideoId(v.youtubeUrl);
      if (id) {
        valid.push({
          id: v._id || `bts-video-${valid.length}`,
          title: v.title?.trim() || `Behind The Scenes ${valid.length + 1}`,
          youtubeUrl: v.youtubeUrl,
          videoId: id,
        });
      }
      if (valid.length >= 6) break;
    }
    return valid;
  }, [initialVideos]);

  const hasPhotos = displayPhotos.length > 0;
  const hasVideos = displayVideos.length > 0;

  // User-selected tab override (null means compute default based on available content)
  const [userTab, setUserTab] = React.useState<"PHOTOS" | "VIDEOS" | null>(null);

  const activeTab: "PHOTOS" | "VIDEOS" =
    userTab !== null
      ? (userTab === "PHOTOS" && hasPhotos) || (userTab === "VIDEOS" && hasVideos)
        ? userTab
        : hasPhotos
          ? "PHOTOS"
          : "VIDEOS"
      : hasPhotos
        ? "PHOTOS"
        : "VIDEOS";

  // Magnetic button cursor interaction
  const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = magneticButtonRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.35;
    const distanceY = (e.clientY - centerY) * 0.35;

    gsap.to(el, {
      x: distanceX,
      y: distanceY,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleMagneticLeave = () => {
    const el = magneticButtonRef.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  React.useEffect(() => {
    const el = magneticButtonRef.current;
    return () => {
      if (el) {
        gsap.killTweensOf(el);
      }
    };
  }, []);

  // Strict conditional rendering: If nothing to show, do not render anything at all
  if (!hasPhotos && !hasVideos) {
    return null;
  }

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-bg-base px-3 pt-16 pb-32 select-none sm:px-6 sm:pt-20 sm:pb-40 md:px-10 md:pb-48 lg:px-16",
        className,
      )}
      {...props}
    >
      {/* Section Header & Optional Tabs */}
      <div className="mx-auto mb-8 flex max-w-[1700px] flex-col justify-between gap-6 border-b border-border-subtle pb-6 sm:mb-12 sm:flex-row sm:items-end">
        <div>
          <span className="mb-1 block font-serif text-xs italic tracking-widest text-text-muted sm:text-sm">
            Behind The Scenes
          </span>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
            BTS ARCHIVE
          </h2>
        </div>

        {/* Filter Tabs: Rendered only when both photos and videos are available */}
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
                "group relative rounded-full px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300",
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
                "group relative rounded-full px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300",
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

      {/* The Teaser Overlay */}
      {/* Fades from transparent at top to solid Off-White (#F7F7F5) at the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-bg-base from-15% via-bg-base/85 via-50% to-transparent sm:h-80 md:h-[420px] lg:h-[480px]"
      />

      {/* Centered Magnetic Call to Action Button ("See More") */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pb-12 sm:pb-16 md:pb-20">
        <div
          className="pointer-events-auto cursor-pointer p-4"
          onMouseMove={handleMagneticMove}
          onMouseLeave={handleMagneticLeave}
        >
          <div ref={magneticButtonRef}>
            <Link
              href="/bts"
              className={cn(
                "group/btn relative inline-flex items-center gap-3 rounded-full",
                "border border-text-primary/20 bg-bg-base/90 px-8 py-4 sm:px-10 sm:py-4.5",
                "text-xs font-medium uppercase tracking-[0.2em] text-text-primary sm:text-sm",
                "shadow-lg backdrop-blur-md transition-all duration-300",
                "hover:scale-[1.02] hover:border-text-primary hover:bg-text-primary hover:text-bg-base hover:shadow-2xl",
              )}
            >
              <span className="font-sans font-semibold">See More</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
