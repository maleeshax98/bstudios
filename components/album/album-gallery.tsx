"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  ArrowLeft,
  Maximize2,
  Film,
  Camera,
} from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { getImages, getVideos } from "@/lib/cd";
import { OptimizedImage } from "@/components/optimized-image";

export interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  previewUrl?: string;
  width?: number;
  height?: number;
  alt?: string;
  duration?: number | string;
  format?: string;
}

export interface AlbumData {
  id: string;
  title: string;
  description?: string | null;
  date?: string | null;
  category?: string | null;
  cloudinaryFolder?: string | null;
  mediaType?: string | null;
  thumbnail?: string | null;
}

export interface AlbumGalleryProps {
  album: AlbumData;
  initialPhotos?: MediaItem[];
  initialVideos?: MediaItem[];
  initialPhotosCursor?: string | null;
  initialVideosCursor?: string | null;
}

/**
 * Skeleton Card Component using Tailwind animate-pulse with muted #EBEBE8 background.
 * Locked into the Cinematic Off-Light aesthetic.
 */
export function SkeletonCard({
  aspectRatio = "aspect-[3/4]",
  className,
}: {
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-[#EBEBE8] animate-pulse border border-border-subtle",
        aspectRatio,
        className,
      )}
    >
      {/* <div className="absolute top-4 right-4 h-5 w-16 rounded-full bg-[#DFDFDC] animate-pulse" />
      <div className="absolute bottom-4 left-4 h-4 w-24 rounded-md bg-[#DFDFDC] animate-pulse" /> */}
    </div>
  );
}

/**
 * Lazy Image with CldImage optimization (auto-format, auto-quality, CDN lazy loading),
 * SkeletonCard loading state, and error & retry mechanism.
 */
function LazyGalleryImage({
  item,
  albumTitle,
  index,
}: {
  item: MediaItem;
  albumTitle: string;
  index: number;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#EBEBE8]">
      <OptimizedImage
        src={item.url}
        alt={item.alt || `${albumTitle} Still ${index + 1}`}
        width={item.width || 1200}
        height={item.height || 1500}
        format="auto"
        quality="auto"
        loading="lazy"
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105"
      />

      {/* Hover Overlay with Expand Icon */}
      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-20">
        <div className="p-3 rounded-full bg-black/60 text-white backdrop-blur-sm shadow-md transform scale-90 group-hover:scale-100 transition-transform">
          <Maximize2 className="w-5 h-5 stroke-[1.75]" />
        </div>
      </div>
    </div>
  );
}

export function AlbumGallery({
  album,
  initialPhotos = [],
  initialVideos = [],
  initialPhotosCursor = null,
  initialVideosCursor = null,
}: AlbumGalleryProps) {
  // Photos and Videos with backend pagination state
  const [photos, setPhotos] = React.useState<MediaItem[]>(initialPhotos);
  const [videos, setVideos] = React.useState<MediaItem[]>(initialVideos);
  const [photosCursor, setPhotosCursor] = React.useState<string | null>(
    initialPhotosCursor,
  );
  const [videosCursor, setVideosCursor] = React.useState<string | null>(
    initialVideosCursor,
  );
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  // Sync with initial props
  const prevInitialPhotos = React.useRef(initialPhotos);
  React.useEffect(() => {
    if (prevInitialPhotos.current !== initialPhotos) {
      prevInitialPhotos.current = initialPhotos;
      setPhotos(initialPhotos);
      setPhotosCursor(initialPhotosCursor);
    }
  }, [initialPhotos, initialPhotosCursor]);

  const prevInitialVideos = React.useRef(initialVideos);
  React.useEffect(() => {
    if (prevInitialVideos.current !== initialVideos) {
      prevInitialVideos.current = initialVideos;
      setVideos(initialVideos);
      setVideosCursor(initialVideosCursor);
    }
  }, [initialVideos, initialVideosCursor]);

  // Determine available media
  const hasPhotos = photos.length > 0;
  const hasVideos = videos.length > 0;

  // Filter state: default to PHOTOS if photos exist; if no photos, focus only on VIDEOS
  const [userFilter, setUserFilter] = React.useState<
    "PHOTOS" | "VIDEOS" | null
  >(null);

  const activeFilter: "PHOTOS" | "VIDEOS" =
    userFilter !== null
      ? userFilter
      : hasPhotos
        ? "PHOTOS"
        : hasVideos
          ? "VIDEOS"
          : "PHOTOS";

  // Current active media and cursor for backend pagination
  const currentMediaList = activeFilter === "PHOTOS" ? photos : videos;
  const currentCursor = activeFilter === "PHOTOS" ? photosCursor : videosCursor;
  const hasMore = Boolean(currentCursor);

  // Fetch more media from backend on scroll
  const loadMore = React.useCallback(async () => {
    if (isLoadingMore || !hasMore || !album.cloudinaryFolder) return;
    setIsLoadingMore(true);

    try {
      if (activeFilter === "PHOTOS" && photosCursor) {
        const res = await getImages(album.cloudinaryFolder, photosCursor, 12);
        if (res.resources.length > 0) {
          const newItems: MediaItem[] = res.resources.map((img) => ({
            id: img.asset_id || img.public_id,
            type: "image",
            url: img.secure_url || img.url,
            width: img.width,
            height: img.height,
            alt: `${album.title || "Album"} Still`,
            format: img.format,
          }));
          setPhotos((prev) => [...prev, ...newItems]);
        }
        setPhotosCursor(res.nextCursor);
      } else if (activeFilter === "VIDEOS" && videosCursor) {
        const res = await getVideos(album.cloudinaryFolder, videosCursor, 12);
        if (res.resources.length > 0) {
          const newItems: MediaItem[] = res.resources.map((vid) => ({
            id: vid.asset_id || vid.public_id,
            type: "video",
            url: vid.secure_url || vid.url,
            width: vid.width,
            height: vid.height,
            duration: vid.duration,
            alt: `${album.title || "Album"} Film`,
            format: vid.format,
          }));
          setVideos((prev) => [...prev, ...newItems]);
        }
        setVideosCursor(res.nextCursor);
      }
    } catch (err) {
      console.error("Error loading more media from backend:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    hasMore,
    album.cloudinaryFolder,
    album.title,
    activeFilter,
    photosCursor,
    videosCursor,
  ]);

  // Sentinel IntersectionObserver for scroll-based backend pagination
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!hasMore || isLoadingMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "650px", // Trigger before user reaches bottom for smooth experience
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  // Intro Sequence State
  const [isIntroComplete, setIsIntroComplete] = React.useState(false);
  const introOverlayRef = React.useRef<HTMLDivElement>(null);
  const introTitleRef = React.useRef<HTMLHeadingElement>(null);
  const introDescRef = React.useRef<HTMLParagraphElement>(null);
  const introDateRef = React.useRef<HTMLParagraphElement>(null);

  // Manage body scroll lock during Intro Sequence
  React.useEffect(() => {
    if (isIntroComplete) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      // Starting initial state (hidden)
      gsap.set(
        [
          introTitleRef.current,
          introDescRef.current,
          introDateRef.current,
        ].filter(Boolean),
        { opacity: 0, y: 14 },
      );

      const tl = gsap.timeline({
        onComplete: () => {
          setIsIntroComplete(true);
        },
      });

      // 1. The Name Reveal: smoothly fades into dead center in italicized Serif, holds, fades out
      if (introTitleRef.current) {
        tl.to(introTitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
        })
          .to({}, { duration: 0.9 }) // hold
          .to(introTitleRef.current, {
            opacity: 0,
            y: -14,
            duration: 0.65,
            ease: "power2.in",
          });
      }

      // 2. The Description: fades in center, holds, fades completely out
      if (introDescRef.current && album.description) {
        tl.to(
          introDescRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
          },
          "+=0.15",
        )
          .to({}, { duration: 0.9 }) // hold
          .to(introDescRef.current, {
            opacity: 0,
            y: -14,
            duration: 0.65,
            ease: "power2.in",
          });
      }

      // 3. The Date Reveal: fades in center in bold Sans-Serif font, holds, fades out
      if (introDateRef.current && album.date) {
        tl.to(
          introDateRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
          },
          "+=0.15",
        )
          .to({}, { duration: 0.85 }) // hold
          .to(introDateRef.current, {
            opacity: 0,
            y: -14,
            duration: 0.65,
            ease: "power2.in",
          });
      }

      // 4. Reveal Gallery: white intro overlay disappears smoothly
      if (introOverlayRef.current) {
        tl.to(
          introOverlayRef.current,
          {
            opacity: 0,
            duration: 0.75,
            ease: "power2.inOut",
          },
          "+=0.1",
        );
      }
    }, introOverlayRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [album.date, album.description, isIntroComplete]);

  // Manage body scroll lock during Lightbox
  React.useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [lightboxIndex]);

  // Lightbox Navigation Functions
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = React.useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const nextMedia = React.useCallback(() => {
    if (lightboxIndex === null || currentMediaList.length === 0) return;
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % currentMediaList.length : 0,
    );
  }, [lightboxIndex, currentMediaList.length]);

  const prevMedia = React.useCallback(() => {
    if (lightboxIndex === null || currentMediaList.length === 0) return;
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + currentMediaList.length) % currentMediaList.length
        : 0,
    );
  }, [lightboxIndex, currentMediaList.length]);

  // Lightbox Keyboard Listener
  React.useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        nextMedia();
      } else if (e.key === "ArrowLeft") {
        prevMedia();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextMedia, prevMedia]);

  const currentMedia =
    lightboxIndex !== null ? currentMediaList[lightboxIndex] : null;

  return (
    <div className="relative min-h-screen w-full bg-bg-base text-text-primary selection:bg-text-primary selection:text-bg-base">
      {/* =================================================================== */}
      {/* 1. THE IMMERSIVE WELCOME (TITLE SEQUENCE)                            */}
      {/* =================================================================== */}
      {!isIntroComplete && (
        <div
          ref={introOverlayRef}
          role="dialog"
          aria-label="Welcome Title Sequence"
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-bg-subtle subtle pointer-events-auto select-none"
        >
          {/* Skip Intro Button */}
          <button
            type="button"
            onClick={() => setIsIntroComplete(true)}
            className="absolute top-8 right-8 z-50 text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-text-muted hover:text-text-primary transition-colors py-2 px-3 border border-border-subtle rounded-full bg-white/80 backdrop-blur-sm"
          >
            [ SKIP ]
          </button>

          {/* Centered sequence typography container */}
          <div className="relative flex flex-col items-center justify-center text-center px-6 max-w-4xl w-full">
            {/* The Name Reveal: elegant italicized Serif */}
            <h1
              ref={introTitleRef}
              className="font-serif italic font-normal text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-[#111111] dark:text-text-muted leading-[1.08] tracking-tight"
            >
              {album.title}
            </h1>

            {/* The Description Reveal: elegant italicized Serif */}
            {album.description && (
              <p
                ref={introDescRef}
                className="absolute inset-x-0 mx-auto font-serif italic text-base sm:text-xl md:text-2xl text-[#666666] max-w-2xl px-6 text-center leading-relaxed"
              >
                {album.description}
              </p>
            )}

            {/* The Date Reveal: bold Sans-Serif font */}
            {album.date && (
              <p
                ref={introDateRef}
                className="absolute inset-x-0 mx-auto font-sans font-black text-xl sm:text-3xl md:text-4xl uppercase tracking-[0.25em] text-[#111111] dark:text-text-muted text-center"
              >
                {album.date}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation back to Works Archive (No sticky navbar strip) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <Link
          href="/works"
          className="group inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2] transition-transform duration-300 group-hover:-translate-x-1" />
          <span>[ WORKS ARCHIVE ]</span>
        </Link>
      </div>

      {/* =================================================================== */}
      {/* 2. THE MAIN GALLERY (PINTEREST / MASONRY GRID)                      */}
      {/* =================================================================== */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-48">
        {/* Editorial Album Header: Centered Title & Date */}
        <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-14 md:mb-16">
          <h1 className="font-serif italic font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-primary leading-[1.08] tracking-tight max-w-4xl">
            {album.title}
          </h1>
          {album.date && (
            <p className="mt-3 sm:mt-4 font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.25em] text-text-muted">
              {album.date}
            </p>
          )}
          {album.description && (
            <p className="mt-4 sm:mt-5 font-serif italic text-base sm:text-lg text-text-muted max-w-2xl px-4 leading-relaxed">
              {album.description}
            </p>
          )}
        </div>

        {currentMediaList.length === 0 ? (
          <div className="min-h-[45vh] flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-subtle rounded-3xl bg-bg-surface/50 my-12">
            <div className="w-14 h-14 rounded-full border border-border-subtle bg-bg-base flex items-center justify-center text-text-muted mb-4 shadow-sm">
              {activeFilter === "VIDEOS" ? (
                <Film className="w-6 h-6 stroke-[1.5]" />
              ) : (
                <Camera className="w-6 h-6 stroke-[1.5]" />
              )}
            </div>
            <h3 className="font-serif italic text-2xl text-text-primary">
              {!hasPhotos && !hasVideos
                ? "No data to load"
                : `No ${activeFilter === "VIDEOS" ? "Videos" : "Photos"} Found`}
            </h3>
            <p className="font-sans text-xs uppercase tracking-wider text-text-muted mt-2 max-w-sm">
              {album.cloudinaryFolder
                ? `Folder "${album.cloudinaryFolder}" currently has no ${activeFilter.toLowerCase()} uploaded in Cloudinary.`
                : "No media folder is associated with this album yet."}
            </p>
            {hasPhotos && activeFilter === "VIDEOS" && (
              <button
                type="button"
                onClick={() => setUserFilter("PHOTOS")}
                className="mt-6 px-6 py-2 rounded-full border border-border-subtle bg-bg-base text-xs font-sans font-bold uppercase tracking-wider hover:bg-text-primary hover:text-bg-base transition-all"
              >
                View {photos.length} Photos
              </button>
            )}
            {hasVideos && activeFilter === "PHOTOS" && (
              <button
                type="button"
                onClick={() => setUserFilter("VIDEOS")}
                className="mt-6 px-6 py-2 rounded-full border border-border-subtle bg-bg-base text-xs font-sans font-bold uppercase tracking-wider hover:bg-text-primary hover:text-bg-base transition-all"
              >
                View {videos.length} Videos
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6">
              {currentMediaList.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => openLightbox(index)}
                  className="break-inside-avoid mb-4 sm:mb-6 group relative cursor-pointer overflow-hidden rounded-xl border border-border-subtle bg-bg-surface transition-all duration-300 hover:shadow-xl hover:border-black/30"
                >
                  {item.type === "image" ? (
                    <LazyGalleryImage
                      item={item}
                      albumTitle={album.title}
                      index={index}
                    />
                  ) : (
                    <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
                      <video
                        src={item.url}
                        preload="none"
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                      />

                      {/* Centered Play Pill */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white/95 text-text-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-5 h-5 fill-text-primary stroke-none ml-0.5" />
                        </div>
                      </div>

                      {/* Video Duration / Film Badge */}
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/20 text-white font-sans text-[10px] font-bold uppercase tracking-wider">
                        {item.duration ? `${item.duration}s` : "Film"}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Scroll Sentinel & Loading Indicator */}
            {isLoadingMore && (
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 mt-4 w-full">
                <SkeletonCard aspectRatio="aspect-[3/4]" />
                <SkeletonCard aspectRatio="aspect-[4/5]" />
                <SkeletonCard aspectRatio="aspect-[16/10]" />
                <SkeletonCard aspectRatio="aspect-[3/4]" />
              </div>
            )}

            <div
              ref={sentinelRef}
              className="w-full py-12 flex items-center justify-center"
            >
              {isLoadingMore && (
                <p className="font-serif italic text-sm text-text-muted lowercase tracking-widest animate-pulse">
                  loading...
                </p>
              )}
            </div>
          </>
        )}
      </main>

      {/* =================================================================== */}
      {/* 3. THE FADED FOOTER & FILTERS                                       */}
      {/* =================================================================== */}
      <footer className="fixed bottom-0 inset-x-0 z-30 pointer-events-none select-none">
        {/* Gradient Container fading transparent to solid Off-White */}
        <div className="w-full bg-gradient-to-t from-[#F7F7F5] via-[#F7F7F5]/95 dark:from-[#0c0c0c] dark:via-[#0c0c0c]/95 to-transparent pt-16 pb-8 px-6 pointer-events-auto flex flex-col items-center justify-center">
          {/* Centered exactly two elegant text buttons: [ PHOTOS ] and [ VIDEOS ] */}
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            {hasPhotos && (
              <button
                type="button"
                onClick={() => setUserFilter("PHOTOS")}
                className={cn(
                  "font-sans text-xs sm:text-sm font-bold tracking-[0.25em] uppercase transition-all duration-300 py-2 px-4 border-b-2",
                  activeFilter === "PHOTOS"
                    ? "text-text-primary border-text-primary"
                    : "text-text-muted border-transparent hover:text-text-primary",
                )}
              >
                [ PHOTOS ]
              </button>
            )}

            {hasVideos && (
              <button
                type="button"
                onClick={() => setUserFilter("VIDEOS")}
                className={cn(
                  "font-sans text-xs sm:text-sm font-bold tracking-[0.25em] uppercase transition-all duration-300 py-2 px-4 border-b-2",
                  activeFilter === "VIDEOS"
                    ? "text-text-primary border-text-primary"
                    : "text-text-muted border-transparent hover:text-text-primary",
                )}
              >
                [ VIDEOS ]
              </button>
            )}
          </div>

          {/* Editorial Asset Counter */}
          <div className="mt-2 text-center">
            <span className="font-serif italic text-xs text-text-muted tracking-wider">
              {currentMediaList.length}{" "}
              {activeFilter === "VIDEOS" ? "Films" : "Stills"} Loaded
              {hasMore ? " · scroll for more" : ""}
            </span>
          </div>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* 4. THE FULL-SCREEN LIGHTBOX EXPERIENCE                              */}
      {/* =================================================================== */}
      {lightboxIndex !== null && currentMedia && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Media Lightbox"
          className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none"
        >
          {/* Close Button ("X") */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close Lightbox"
            className="absolute top-6 right-6 z-50 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-8 h-8 stroke-[1.5]" />
          </button>

          {/* Navigation: Previous Arrow ("<") */}
          <button
            type="button"
            onClick={prevMedia}
            aria-label="Previous item"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="w-9 h-9 stroke-[1.5]" />
          </button>

          {/* Navigation: Next Arrow (">") */}
          <button
            type="button"
            onClick={nextMedia}
            aria-label="Next item"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight className="w-9 h-9 stroke-[1.5]" />
          </button>

          {/* Index Counter Indicator */}
          <div className="absolute top-7 left-7 z-50 font-serif italic text-white/60 text-sm tracking-widest">
            {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
            {String(currentMediaList.length).padStart(2, "0")}
          </div>

          {/* Lightbox Media Content */}
          <div className="relative max-w-[92vw] max-h-[86vh] flex items-center justify-center">
            {currentMedia.type === "image" ? (
              currentMedia.url.includes("res.cloudinary.com") ||
              (!currentMedia.url.startsWith("http://") &&
                !currentMedia.url.startsWith("https://")) ? (
                <CldImage
                  src={currentMedia.url}
                  alt={currentMedia.alt || album.title}
                  width={currentMedia.width || 2400}
                  height={currentMedia.height || 1600}
                  format="auto"
                  quality="auto"
                  className="max-w-[92vw] max-h-[86vh] w-auto h-auto object-contain rounded-sm select-none shadow-2xl"
                />
              ) : (
                <Image
                  src={currentMedia.url}
                  alt={currentMedia.alt || album.title}
                  width={currentMedia.width || 2400}
                  height={currentMedia.height || 1600}
                  unoptimized
                  className="max-w-[92vw] max-h-[86vh] w-auto h-auto object-contain rounded-sm select-none shadow-2xl"
                />
              )
            ) : (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                playsInline
                className="max-w-[92vw] max-h-[86vh] rounded-sm select-none shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
