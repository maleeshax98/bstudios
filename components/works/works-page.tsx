"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  RotateCw,
  AlertCircle,
  Play,
  Film,
  Layers,
} from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { fetchMoreAlbums } from "@/lib/actions";
import OptimizedImage from "../optimized-image";

// ============================================================================
// Types & Models
// ============================================================================

export type MediaFormat = "ALL" | "PHOTOS" | "VIDEOS" | "MIXED";

export interface AlbumProject {
  id: string;
  title: string;
  category: string;
  media: "PHOTOS" | "VIDEOS" | "MIXED";
  date: string;
  src: string;
  alt: string;
  count?: string;
  duration?: string;
  aspectRatio?: string;
  slug?: string;
  description?: string;
  cloudinaryFolder?: string;
}

// Fallback curated projects in case CMS has not yet been populated
export const ALBUM_PROJECTS: AlbumProject[] = [
  {
    id: "project-01",
    title: "Malaysia's Birthday",
    category: "BIRTHDAY",
    media: "PHOTOS",
    date: "Oct 24, 2026",
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
    alt: "Celebration with sparklers and modern aesthetic",
    count: "185 Photos",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "project-02",
    title: "Lake Como Vows",
    category: "WEDDING",
    media: "PHOTOS",
    date: "Sep 18, 2026",
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
    alt: "Intimate wedding vows beside Lake Como",
    count: "340 Photos",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "project-03",
    title: "The Brutalist Monograph",
    category: "COMMERCIAL",
    media: "VIDEOS",
    date: "Aug 12, 2026",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
    alt: "Brutalist architectural brand showreel",
    duration: "04:50 Film",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "project-04",
    title: "Amalfi Coastline Prelude",
    category: "ENGAGEMENT",
    media: "VIDEOS",
    date: "Jun 14, 2026",
    src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85",
    alt: "Cinematic sunset engagement session on coastal cliffs",
    duration: "04:10 Film",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "project-05",
    title: "Kyoto Daylight Stills",
    category: "CASUAL",
    media: "PHOTOS",
    date: "Jul 29, 2026",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    alt: "Editorial natural light lifestyle portraits in Kyoto",
    count: "95 Stills",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "project-06",
    title: "Noir Atelier Campaign",
    category: "COMMERCIAL",
    media: "PHOTOS",
    date: "May 20, 2026",
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
    alt: "Avant-garde couture fashion campaign",
    count: "120 Stills",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "project-07",
    title: "Tuscan Villa Celebration",
    category: "WEDDING",
    media: "VIDEOS",
    date: "Apr 08, 2026",
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
    alt: "Candlelit romantic evening reception in Tuscany",
    duration: "05:30 Film",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "project-08",
    title: "Aurelia's 25th Gala",
    category: "BIRTHDAY",
    media: "VIDEOS",
    date: "Mar 17, 2026",
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85",
    alt: "Glamour evening birthday celebration vignette",
    duration: "03:15 Film",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "project-09",
    title: "Highland Mist Session",
    category: "ENGAGEMENT",
    media: "PHOTOS",
    date: "Feb 22, 2026",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=85",
    alt: "Atmospheric alpine engagement portraits",
    count: "140 Photos",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "project-10",
    title: "Midday Reverie",
    category: "CASUAL",
    media: "VIDEOS",
    date: "Jan 15, 2026",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
    alt: "Golden hour lifestyle cinematics",
    duration: "03:20 Film",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "project-11",
    title: "L'Hiver Haute Joaillerie",
    category: "COMMERCIAL",
    media: "VIDEOS",
    date: "Nov 04, 2025",
    src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
    alt: "High jewelry luxury brand showcase",
    duration: "02:30 Film",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "project-12",
    title: "Sora & Kenji's Sacred Ceremony",
    category: "WEDDING",
    media: "PHOTOS",
    date: "Oct 10, 2025",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    alt: "Floral arch and documentary wedding photography",
    count: "310 Photos",
    aspectRatio: "aspect-[4/5]",
  },
];

export interface WorksPageAlbum {
  _id: string;
  title?: string | null;
  description?: string | null;
  date?: string | null;
  category?: {
    _id: string;
    title?: string | null;
  } | null;
  alt?: string | null;
  thumbnail?: string | null;
  cloudinaryFolder?: string | null;
  Media?: string | null;
  count?: string | null;
  duration?: string | null;
  slug?: {
    current?: string | null;
  } | null;
  publishedAt?: string | null;
}

export interface WorksPageCategory {
  _id: string;
  title?: string | null;
}

/**
 * Maps a raw Sanity album query item to the standardized AlbumProject model.
 */
function mapSanityAlbum(item: WorksPageAlbum): AlbumProject {
  const fallbackSrc =
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85";

  let formattedDate = item.date || "";
  if (!formattedDate && item.publishedAt) {
    try {
      formattedDate = new Date(item.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      formattedDate = "Recent";
    }
  }

  const rawMedia = item.Media
    ? String(item.Media).trim().toUpperCase()
    : "PHOTOS";
  const media: "PHOTOS" | "VIDEOS" | "MIXED" = rawMedia.includes("VIDEO")
    ? "VIDEOS"
    : rawMedia.includes("MIXED")
      ? "MIXED"
      : "PHOTOS";

  return {
    id: item._id,
    title: item.title || "Untitled Archive",
    category: (item.category?.title || "WEDDING").trim().toUpperCase(),
    media,
    date: formattedDate || "Recent Archive",
    src:
      item.thumbnail && item.thumbnail.trim().length > 0
        ? item.thumbnail.trim()
        : fallbackSrc,
    alt: item.alt || item.title || "Archive Project",
    count: item.count || undefined,
    duration: item.duration || undefined,
    aspectRatio: "aspect-[4/5]",
    slug: item.slug?.current || undefined,
    description: item.description || undefined,
    cloudinaryFolder: item.cloudinaryFolder || undefined,
  };
}

// ============================================================================
// Skeleton Card Component
// ============================================================================

export function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="group relative flex flex-col w-full select-none"
    >
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border-subtle bg-[#EBEBE8] dark:bg-bg-surface animate-pulse">
        <div className="absolute top-4 right-4 h-6 w-20 rounded-full bg-[#DFDFDC] animate-pulse dark:bg-bg-surface" />
        <div className="absolute bottom-4 left-4 h-5 w-28 rounded-md bg-[#DFDFDC] animate-pulse dark:bg-bg-surface" />
      </div>

      {/* Meta Bar Skeleton */}
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-[#DFDFDC] animate-pulse" />
        <div className="h-3 w-16 rounded bg-[#DFDFDC] animate-pulse" />
      </div>

      {/* Title Skeleton */}
      <div className="mt-2 h-7 w-3/4 rounded bg-[#DFDFDC] animate-pulse" />
    </div>
  );
}

// ============================================================================
// Album Card Component with Image Optimization & Retry Logic
// ============================================================================

export interface AlbumCardProps {
  project: AlbumProject;
  priority?: boolean;
}

export function AlbumCard({ project, priority = false }: AlbumCardProps) {
  const [hasError, setHasError] = React.useState(false);
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [retryKey, setRetryKey] = React.useState(0);

  const handleRetry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRetrying(true);
    setHasError(false);
    setRetryKey((prev) => prev + 1);

    setTimeout(() => {
      setIsRetrying(false);
    }, 450);
  };

  const rawSrc =
    project.src && project.src.trim().length > 0
      ? project.src
      : "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85";

  const imageSrc =
    retryKey > 0
      ? rawSrc.includes("?")
        ? `${rawSrc}&retry=${retryKey}`
        : `${rawSrc}?retry=${retryKey}`
      : rawSrc;

  // Format Photo count display badge
  const formattedCount = React.useMemo(() => {
    if (!project.count) return "Photo Vault";
    const lower = project.count.toLowerCase();
    if (
      lower.includes("photo") ||
      lower.includes("still") ||
      lower.includes("shot")
    ) {
      return project.count;
    }
    return `${project.count} Photos`;
  }, [project.count]);

  // Format Video duration display badge
  const formattedDuration = React.useMemo(() => {
    if (!project.duration || project.duration === "0") return "4K Film";
    const lower = project.duration.toLowerCase();
    if (
      lower.includes("film") ||
      lower.includes("min") ||
      lower.includes("sec")
    ) {
      return project.duration;
    }
    return `${project.duration} Film`;
  }, [project.duration]);

  const albumHref = project.slug
    ? `/album/${project.slug}`
    : `/album/${project.id}`;

  return (
    <Link
      href={albumHref}
      className="group relative flex flex-col w-full text-left transition-all duration-300 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-2xl"
    >
      <article className="flex flex-col w-full">
        {/* Thumbnail Container */}
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface",
            project.aspectRatio || "aspect-[4/5]",
          )}
        >
          {/* Error Fallback UI with Retry Button */}
          {hasError ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-[#EBEBE8]">
              <div className="w-12 h-12 rounded-full border border-border-subtle bg-bg-base flex items-center justify-center mb-3 text-text-muted shadow-sm">
                <AlertCircle className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="font-serif italic text-base text-text-primary">
                Thumbnail Unavailable
              </p>
              <p className="font-sans text-xs text-text-muted mt-1 max-w-[200px]">
                Could not load high-resolution image preview.
              </p>

              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className={cn(
                  "mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full",
                  "border border-border-subtle bg-bg-base text-xs font-sans font-semibold uppercase tracking-wider text-text-primary",
                  "shadow-sm transition-all duration-300 hover:bg-text-primary hover:text-bg-base hover:shadow-md",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                )}
              >
                <RotateCw
                  className={cn(
                    "w-3.5 h-3.5 stroke-[2]",
                    isRetrying && "animate-spin",
                  )}
                />
                <span>{isRetrying ? "Retrying..." : "Retry Image"}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Optimized Next.js Image with Hover Scale */}
              {/* <Image
                key={`${project.id}-${retryKey}`}
                src={imageSrc}
                alt={project.alt || project.title}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                priority={priority}
                onError={() => setHasError(true)}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              /> */}

              <OptimizedImage
                key={`${project.id}-${retryKey}`}
                src={imageSrc}
                alt={project.alt || project.title}
                format="auto"
                quality="auto"
                loading="eager"
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105"
                priority={priority}
                onError={() => setHasError(true)}
              />

              {/* Subtle Gradient Scrim at bottom of image */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80"
              />

              {/* Top Badge: Media Type / Asset Count */}
              <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-sm">
                {project.media === "VIDEOS" ? (
                  <>
                    <Film className="w-3 h-3 stroke-[2]" />
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider">
                      {formattedDuration}
                    </span>
                  </>
                ) : project.media === "MIXED" ? (
                  <>
                    <Layers className="w-3 h-3 stroke-[2]" />
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider">
                      {project.count
                        ? `${project.count} Assets`
                        : "Photos & Film"}
                    </span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3 h-3 stroke-[2]" />
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider">
                      {formattedCount}
                    </span>
                  </>
                )}
              </div>

              {/* Bottom Floating Play Indicator for Videos or Mixed */}
              {(project.media === "VIDEOS" || project.media === "MIXED") && (
                <div
                  aria-hidden="true"
                  className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 text-text-primary backdrop-blur-md flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                >
                  <Play className="w-4 h-4 fill-text-primary stroke-none ml-0.5" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Date & Category Meta */}
        <div className="mt-4 flex items-center justify-between text-xs tracking-wider text-text-muted">
          <span className="font-sans font-bold uppercase tracking-widest text-[11px] text-text-muted group-hover:text-text-primary transition-colors duration-300">
            {project.category}
          </span>
          <span className="font-sans text-[11px] uppercase tracking-wider text-text-muted">
            {project.date}
          </span>
        </div>

        {/* Album Title */}
        <h3 className="mt-1 font-serif italic text-2xl sm:text-[1.65rem] text-text-primary group-hover:text-accent-primary transition-colors duration-300 leading-tight">
          {project.title}
        </h3>
      </article>
    </Link>
  );
}

// ============================================================================
// Main WorksPage Component
// ============================================================================

export interface WorksPageProps extends React.HTMLAttributes<HTMLElement> {
  initialAlbums?: WorksPageAlbum[];
  initialCategories?: WorksPageCategory[];
}

export function WorksPage({
  initialAlbums,
  initialCategories,
  className,
  ...props
}: WorksPageProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const [sanityAlbums, setSanityAlbums] = React.useState<WorksPageAlbum[]>(
    initialAlbums || [],
  );
  const [hasMore, setHasMore] = React.useState(
    (initialAlbums?.length ?? 0) >= 6,
  );
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const loadMoreAlbums = React.useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetchMoreAlbums(sanityAlbums.length, 6);
      if (!res || !res.albums || res.albums.length === 0) {
        setHasMore(false);
      } else {
        setSanityAlbums((prev) => {
          const existingIds = new Set(prev.map((a) => a._id));
          const newUnique = res.albums.filter((a) => !existingIds.has(a._id));
          return [...prev, ...newUnique];
        });
        setHasMore(res.hasMore);
      }
    } catch (err) {
      console.error("Failed to fetch more albums:", err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, sanityAlbums.length]);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMore) {
          loadMoreAlbums();
        }
      },
      { rootMargin: "600px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMoreAlbums]);

  // Normalize all available projects: use Sanity CMS data when available, otherwise fall back to curated projects
  const allProjects = React.useMemo<AlbumProject[]>(() => {
    if (sanityAlbums && sanityAlbums.length > 0) {
      return sanityAlbums.map(mapSanityAlbum);
    }
    return ALBUM_PROJECTS;
  }, [sanityAlbums]);

  // Dynamically compute Shoot Category tabs: only show categories fetched from Sanity
  const categoryTabs = React.useMemo<{ label: string; value: string }[]>(() => {
    const sanityCategoryTitles = (initialCategories || [])
      .map((c) => c.title?.trim().toUpperCase())
      .filter((t): t is string => Boolean(t));

    const unique = Array.from(new Set(sanityCategoryTitles));

    return [
      { label: "ALL", value: "ALL" },
      ...unique.map((cat) => ({ label: cat, value: cat })),
    ];
  }, [initialCategories]);

  // Dynamically compute Media Format tabs: include MIXED if mixed media exists
  const mediaFormatTabs = React.useMemo<
    { label: string; value: MediaFormat }[]
  >(() => {
    const hasMixed = allProjects.some((p) => p.media === "MIXED");
    if (hasMixed) {
      return [
        { label: "ALL", value: "ALL" },
        { label: "PHOTOS", value: "PHOTOS" },
        { label: "VIDEOS", value: "VIDEOS" },
        { label: "MIXED", value: "MIXED" },
      ];
    }
    return [
      { label: "ALL", value: "ALL" },
      { label: "PHOTOS", value: "PHOTOS" },
      { label: "VIDEOS", value: "VIDEOS" },
    ];
  }, [allProjects]);

  // Filter States
  const [activeMedia, setActiveMedia] = React.useState<MediaFormat>("ALL");
  const [activeCategory, setActiveCategory] = React.useState<string>("ALL");

  // Subtle loading state for initial smooth mount
  const isLoading = false;

  // Filtered projects based on active format and category filters
  const filteredProjects = React.useMemo(() => {
    return allProjects.filter((project) => {
      // Media Format Filter
      let matchMedia = true;
      if (activeMedia === "PHOTOS") {
        matchMedia = project.media === "PHOTOS" || project.media === "MIXED";
      } else if (activeMedia === "VIDEOS") {
        matchMedia = project.media === "VIDEOS" || project.media === "MIXED";
      } else if (activeMedia === "MIXED") {
        matchMedia = project.media === "MIXED";
      }

      // Shoot Category Filter (case-insensitive)
      const matchCategory =
        activeCategory === "ALL" ||
        project.category.trim().toUpperCase() ===
          activeCategory.trim().toUpperCase();

      return matchMedia && matchCategory;
    });
  }, [allProjects, activeMedia, activeCategory]);

  // Animate grid cards when filtering completes
  React.useEffect(() => {
    if (isLoading || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll("article");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.04,
            ease: "power2.out",
          },
        );
      }
    }, gridRef);

    return () => ctx.revert();
  }, [filteredProjects, isLoading]);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative w-full min-h-screen bg-bg-base text-text-primary select-none",
        "pt-28 sm:pt-36 md:pt-40 pb-24 sm:pb-32 px-6 sm:px-8 lg:px-12",
        className,
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto">
        {/* ================================================================= */}
        {/* 1. Header & Filtering System */}
        {/* ================================================================= */}
        <header className="border-b border-border-subtle pb-10 sm:pb-14">
          {/* Massive Brutalist Headline */}
          <h1 className="font-sans font-black uppercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9] text-text-primary">
            WORKS
          </h1>

          {/* Interactive Dual Filtering Tabs */}
          <div className="mt-10 sm:mt-12 space-y-5">
            {/* Tab Row 1: Media Format */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted/80 shrink-0 min-w-[90px]">
                FORMAT:
              </span>

              <div
                role="tablist"
                aria-label="Media Format Filter"
                className="flex flex-wrap items-center gap-2 sm:gap-3"
              >
                {mediaFormatTabs.map((tab) => {
                  const isActive = activeMedia === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveMedia(tab.value)}
                      className={cn(
                        "group relative px-4 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                        isActive
                          ? "bg-text-primary text-bg-base shadow-sm"
                          : "text-text-muted hover:text-text-primary hover:bg-[#111111]/5 border border-transparent",
                      )}
                    >
                      <span>[ {tab.label} ]</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Row 2: Shoot Category */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted/80 shrink-0 min-w-[90px]">
                CATEGORY:
              </span>

              <div
                role="tablist"
                aria-label="Shoot Category Filter"
                className="flex flex-wrap items-center gap-2 sm:gap-2.5"
              >
                {categoryTabs.map((tab) => {
                  const isActive = activeCategory === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(tab.value)}
                      className={cn(
                        "group relative px-4 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                        isActive
                          ? "bg-text-primary text-bg-base shadow-sm"
                          : "text-text-muted hover:text-text-primary hover:bg-[#111111]/5 border border-transparent",
                      )}
                    >
                      <span>[ {tab.label} ]</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* ================================================================= */}
        {/* 2. Gallery Grid & Album Cards */}
        {/* ================================================================= */}
        <main className="mt-12 sm:mt-16">
          {isLoading ? (
            /* Skeleton Loading Grid */
            <div
              aria-label="Loading portfolio archives"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            /* Empty Filter Results State */
            <div className="py-24 text-center rounded-2xl border border-dashed border-border-subtle bg-bg-surface/50">
              <div className="w-14 h-14 mx-auto rounded-full border border-border-subtle bg-bg-base flex items-center justify-center text-text-muted mb-4 shadow-sm">
                <Layers className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h2 className="font-serif italic text-2xl text-text-primary">
                No matching archives found
              </h2>
              <p className="font-sans text-xs uppercase tracking-widest text-text-muted mt-2 max-w-sm mx-auto">
                No projects matched your active format and category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveMedia("ALL");
                  setActiveCategory("ALL");
                }}
                className="mt-6 px-6 py-2.5 rounded-full bg-text-primary text-bg-base font-sans text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors duration-200"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Actual Responsive Gallery Grid */
            <>
              <div
                ref={gridRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12"
              >
                {filteredProjects.map((project, index) => (
                  <AlbumCard
                    key={project.id}
                    project={project}
                    priority={index < 3}
                  />
                ))}
              </div>

              {/* Scroll-based pagination sentinel & loading indicator */}
              <div
                ref={sentinelRef}
                className="w-full py-12 flex items-center justify-center min-h-[80px]"
                aria-live="polite"
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
      </div>
    </section>
  );
}

export default WorksPage;
