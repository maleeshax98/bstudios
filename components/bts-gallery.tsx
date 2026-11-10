"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Play, Film, Volume2, VolumeX } from "lucide-react";
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
  type: "image";
  src: string;
  alt: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
}

export interface BtsVideoItem {
  id: string;
  type: "video";
  src: string;
  title?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  duration?: number;
  youtubeId?: string;
}

export type BtsMixedMediaItem = BtsPhotoItem | BtsVideoItem;

export interface BtsRawVideo {
  _id: string;
  title?: string | null;
  youtubeUrl?: string | null;
  publishedAt?: string | null;
  [key: string]: unknown;
}

export interface BtsGalleryProps extends React.HTMLAttributes<HTMLElement> {
  initialImages?: CloudinaryResource[];
  initialVideos?: (CloudinaryResource | BtsRawVideo)[];
}

/**
 * Calculates responsive aspect ratio classes based on dimensions.
 * Supports horizontal widescreen (16:9), standard landscape, square,
 * portrait, and vertical reels/shorts (9:16).
 */
export function getAspectClass(width?: number, height?: number): string {
  if (!width || !height) return "aspect-[3/4]";
  const ratio = width / height;
  if (ratio >= 1.7) return "aspect-video"; // 16:9 widescreen
  if (ratio >= 1.4) return "aspect-[16/10]";
  if (ratio >= 1.15) return "aspect-[4/3]";
  if (ratio >= 0.9) return "aspect-[1/1]";
  if (ratio >= 0.7) return "aspect-[4/5]";
  if (ratio >= 0.55) return "aspect-[9/16]"; // 9:16 vertical video
  return "aspect-[2/3]";
}

/**
 * Derives a JPEG poster thumbnail URL for Cloudinary video assets.
 */
export function getCloudinaryVideoPoster(url?: string): string | undefined {
  if (!url) return undefined;
  if (!url.includes("cloudinary.com")) return undefined;
  return url.replace(/\.(mp4|mov|webm|mkv|avi|m4v)(\?.*)?$/i, ".jpg$2");
}

/**
 * Interleaves videos evenly into photos to produce a balanced, aesthetic
 * mixed masonry gallery without clustering videos in one spot.
 */
export function mixMediaItems(
  photos: BtsPhotoItem[],
  videos: BtsVideoItem[],
): BtsMixedMediaItem[] {
  if (photos.length === 0) return videos;
  if (videos.length === 0) return photos;

  const result: BtsMixedMediaItem[] = [];
  const totalPhotos = photos.length;
  const totalVideos = videos.length;

  // Stride: distribute videos evenly across photos
  const stride = Math.max(1, Math.floor(totalPhotos / (totalVideos + 1)));

  let photoIdx = 0;
  let videoIdx = 0;

  while (photoIdx < totalPhotos || videoIdx < totalVideos) {
    // Add photo chunk
    const nextPhotoChunk = Math.min(photoIdx + stride, totalPhotos);
    while (photoIdx < nextPhotoChunk) {
      result.push(photos[photoIdx++]);
    }
    // Add video if available
    if (videoIdx < totalVideos) {
      result.push(videos[videoIdx++]);
    }
    // If all videos used, add remaining photos
    if (videoIdx >= totalVideos && photoIdx < totalPhotos) {
      while (photoIdx < totalPhotos) {
        result.push(photos[photoIdx++]);
      }
    }
  }

  return result;
}

/**
 * Responsive Cloudinary HTML5 Video Card for BTS Gallery.
 * - Autoplays muted on continuous loop like a cinematic moving picture.
 * - Respects natural video aspect ratios (horizontal widescreen, vertical reels, square).
 * - Interactive Sound Toggle: users can unmute/mute audio anytime with one click.
 * - Click-to-pause / Click-to-play with subtle tactile indicator.
 * - Dynamic aspect ratio calculation with zero letterboxing or layout shift.
 */
export function BtsCloudinaryVideoCard({
  item,
}: {
  item: BtsVideoItem;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [aspectRatio, setAspectRatio] = React.useState<number | null>(
    item.width && item.height ? item.width / item.height : null,
  );

  const posterUrl = React.useMemo(
    () => getCloudinaryVideoPoster(item.src),
    [item.src],
  );

  // Guarantee seamless muted autoplay across modern browsers (iOS/Safari/Chrome)
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.defaultMuted = true;
    v.muted = true;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Autoplay may be deferred or blocked by browser power-saving mode
        console.debug("Autoplay notice:", err);
      });
    }
  }, []);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (v.videoWidth && v.videoHeight && !aspectRatio) {
      setAspectRatio(v.videoWidth / v.videoHeight);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;

    if (isMuted) {
      // Unmuting: mute any other active video on the page
      const allVideos = document.querySelectorAll("video");
      allVideos.forEach((other) => {
        if (other !== v) {
          other.muted = true;
        }
      });
      v.muted = false;
      setIsMuted(false);
      if (v.paused) {
        v.play().catch(() => {});
        setIsPaused(false);
      }
    } else {
      v.muted = true;
      setIsMuted(true);
    }
  };

  const handleCardClick = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play().catch(() => {});
      setIsPaused(false);
    } else {
      v.pause();
      setIsPaused(true);
    }
  };

  return (
    <div
      className={cn(
        "group relative mb-2.5 break-inside-avoid overflow-hidden rounded-lg border border-border-subtle bg-black shadow-md transition-all duration-500 hover:border-text-primary/25 hover:shadow-xl sm:mb-4 sm:rounded-xl md:mb-6 cursor-pointer select-none",
        getAspectClass(item.width, item.height),
      )}
      style={
        aspectRatio
          ? { aspectRatio: `${aspectRatio}` }
          : item.width && item.height
            ? { aspectRatio: `${item.width} / ${item.height}` }
            : undefined
      }
      onClick={handleCardClick}
    >
      <video
        ref={videoRef}
        src={item.src}
        poster={posterUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        className="h-full w-full object-cover select-none"
      />

      {/* Top badges: Sound Toggle & BTS Film label */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 sm:top-3 sm:right-3 z-10">
        <button
          type="button"
          onClick={handleToggleMute}
          aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
          title={isMuted ? "Unmute" : "Mute"}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-transform duration-200 hover:scale-110 hover:bg-black/85 cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="h-3.5 w-3.5 stroke-[2]" />
          ) : (
            <Volume2 className="h-3.5 w-3.5 stroke-[2] text-white" />
          )}
        </button>

        <div className="flex items-center gap-1.5 rounded-md border border-white/15 bg-black/70 px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:px-2.5">
          <Film className="h-3 w-3 stroke-[2]" />
          <span>BTS Film</span>
        </div>
      </div>

      {/* Paused State Overlay with tactile Play button */}
      {isPaused && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-text-primary shadow-2xl transition-transform duration-300 sm:h-14 sm:w-14">
            <Play className="ml-0.5 h-5 w-5 fill-text-primary stroke-none sm:h-6 sm:w-6 dark:fill-black" />
          </div>
        </div>
      )}

      {/* Bottom Gradient Scrim with Title & Duration */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-2.5 pt-6 pb-2.5 sm:px-3 sm:pb-3 flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-sans text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
          </h4>
        </div>
        {item.duration ? (
          <span className="shrink-0 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white/80 backdrop-blur-xs">
            {Math.floor(item.duration / 60)}:
            {String(Math.floor(item.duration % 60)).padStart(2, "0")}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/**
 * YouTube Video Card fallback (retained for backward compatibility).
 */
export function BtsVideoCard({
  video,
  index = 0,
}: {
  video: { id: string; title?: string; youtubeUrl?: string; videoId?: string };
  index?: number;
}) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [thumbError, setThumbError] = React.useState(false);

  const videoId = video.videoId || (video.youtubeUrl ? getYouTubeVideoId(video.youtubeUrl) : null);

  const thumbUrl = videoId
    ? thumbError
      ? getYouTubeThumbnailUrl(videoId, "hq")
      : getYouTubeThumbnailUrl(videoId, "maxres")
    : "";

  if (!videoId) return null;

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border-subtle bg-black shadow-md transition-all duration-300 hover:border-text-primary/30 hover:shadow-2xl">
      {isPlaying ? (
        <iframe
          src={getYouTubeEmbedUrl(videoId, { autoplay: true })}
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbUrl}
            alt={video.title || `Behind The Scenes ${index + 1}`}
            onError={() => setThumbError(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 transition-opacity duration-300 group-hover:opacity-90" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-text-primary shadow-2xl transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
              <Play className="ml-1 h-6 w-6 fill-text-primary stroke-none sm:h-7 sm:w-7 dark:fill-black" />
            </div>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md border border-white/15 bg-black/70 px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            <Film className="h-3 w-3 stroke-[2]" />
            <span>YouTube</span>
          </div>
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

  // Process Videos (up to 6 from Cloudinary or YouTube fallback)
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
          id: res.asset_id || res.public_id || `bts-video-${valid.length}`,
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
            id: v._id || `bts-video-${valid.length}`,
            type: "video",
            src: v.youtubeUrl,
            title: v.title?.trim() || `Behind The Scenes ${valid.length + 1}`,
            youtubeId: ytId,
            aspectRatio: "aspect-video",
          });
        }
      }

      if (valid.length >= 6) break;
    }

    return valid;
  }, [initialVideos]);

  // Mixed items (photos and videos interleaved without tabs)
  const displayItems: BtsMixedMediaItem[] = React.useMemo(() => {
    return mixMediaItems(displayPhotos, displayVideos);
  }, [displayPhotos, displayVideos]);

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
  if (displayItems.length === 0) {
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
      {/* Section Header (No tabs per specification) */}
      <div className="mx-auto mb-8 flex max-w-[1700px] flex-col justify-between gap-6 border-b border-border-subtle pb-6 sm:mb-12 sm:flex-row sm:items-end">
        <div>
          <span className="mb-1 block font-serif text-xs italic tracking-widest text-text-muted sm:text-sm">
            Behind The Scenes
          </span>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
            BTS ARCHIVE
          </h2>
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

      {/* The Teaser Overlay */}
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
