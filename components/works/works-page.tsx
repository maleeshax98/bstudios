"use client";

import * as React from "react";
import Link from "next/link";
import {
  Camera,
  RotateCw,
  AlertCircle,
  Play,
  Film,
  Layers,
  Share2,
} from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { fetchMoreAlbums } from "@/lib/actions";
import OptimizedImage from "../optimized-image";
import { ShareModal } from "@/components/share/share-modal";

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
  const fallbackSrc = "";

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
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border-subtle bg-[#EBEBE8] dark:bg-bg-surface animate-pulse">
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 h-4 sm:h-6 w-14 sm:w-20 rounded-full bg-[#DFDFDC] animate-pulse dark:bg-bg-surface" />
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 h-4 sm:h-5 w-20 sm:w-28 rounded-md bg-[#DFDFDC] animate-pulse dark:bg-bg-surface" />
      </div>

      {/* Meta Bar Skeleton */}
      <div className="mt-2.5 sm:mt-4 flex items-center justify-between">
        <div className="h-2.5 sm:h-3 w-16 sm:w-24 rounded bg-[#DFDFDC] dark:bg-bg-surface animate-pulse" />
        <div className="h-2.5 sm:h-3 w-12 sm:w-16 rounded bg-[#DFDFDC] dark:bg-bg-surface animate-pulse" />
      </div>

      {/* Title Skeleton */}
      <div className="mt-1.5 sm:mt-2 h-5 sm:h-7 w-3/4 rounded bg-[#DFDFDC] dark:bg-bg-surface animate-pulse" />
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
  const [isShareOpen, setIsShareOpen] = React.useState(false);

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
      : "";

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
      className="group relative flex flex-col w-full text-left transition-all duration-300 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-xl sm:rounded-2xl"
    >
      <article className="flex flex-col w-full">
        {/* Thumbnail Container */}
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border-subtle bg-bg-surface",
            project.aspectRatio || "aspect-[4/5]",
          )}
        >
          {/* Top-Left: Share Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsShareOpen(true);
            }}
            aria-label={`Share ${project.title}`}
            title="Share Album"
            className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-90 hover:opacity-100"
          >
            <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2]" />
          </button>

          {/* Error Fallback UI with Retry Button */}
          {hasError || !rawSrc ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-[#EBEBE8]">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border border-border-subtle bg-bg-base flex items-center justify-center mb-2 sm:mb-3 text-text-muted shadow-sm">
                <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.5]" />
              </div>
              <p className="font-serif italic text-sm sm:text-base text-text-primary">
                Thumbnail Unavailable
              </p>
              <p className="font-sans text-[10px] sm:text-xs text-text-muted mt-1 max-w-[200px] hidden sm:block">
                Could not load high-resolution image preview.
              </p>

              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className={cn(
                  "mt-3 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full",
                  "border border-border-subtle bg-bg-base text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-wider text-text-primary",
                  "shadow-sm transition-all duration-300 hover:bg-text-primary hover:text-bg-base hover:shadow-md",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                )}
              >
                <RotateCw
                  className={cn(
                    "w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2]",
                    isRetrying && "animate-spin",
                  )}
                />
                <span>{isRetrying ? "Retrying..." : "Retry"}</span>
              </button>
            </div>
          ) : (
            <>
              <OptimizedImage
                key={`${project.id}-${retryKey}`}
                src={imageSrc}
                alt={project.alt || project.title}
                format="auto"
                quality="auto"
                loading="eager"
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105"
                priority={priority}
                onError={() => setHasError(true)}
              />

              {/* Subtle Gradient Scrim at bottom of image */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80"
              />

              {/* Top Badge: Media Type / Asset Count */}
              <div className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 z-10 flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-sm">
                {project.media === "VIDEOS" ? (
                  <>
                    <Film className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2]" />
                    <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                      {formattedDuration}
                    </span>
                  </>
                ) : project.media === "MIXED" ? (
                  <>
                    <Layers className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2]" />
                    <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                      {project.count
                        ? `${project.count} Assets`
                        : "Photos & Film"}
                    </span>
                  </>
                ) : (
                  <>
                    <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2]" />
                    <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                      {formattedCount}
                    </span>
                  </>
                )}
              </div>

              {/* Bottom Floating Play Indicator for Videos or Mixed */}
              {(project.media === "VIDEOS" || project.media === "MIXED") && (
                <div
                  aria-hidden="true"
                  className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 z-10 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/90 text-text-primary backdrop-blur-md flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-text-primary stroke-none ml-0.5 dark:fill-black" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Date & Category Meta */}
        <div className="mt-2.5 sm:mt-4 flex items-center justify-between text-xs tracking-wider text-text-muted gap-1">
          <span className="font-sans font-bold uppercase tracking-widest text-[9px] sm:text-[11px] text-text-muted group-hover:text-text-primary transition-colors duration-300 truncate">
            {project.category}
          </span>
          <span className="font-sans text-[9px] sm:text-[11px] uppercase tracking-wider text-text-muted shrink-0">
            {project.date}
          </span>
        </div>

        {/* Album Title */}
        <h3 className="mt-1 font-serif italic text-base sm:text-xl md:text-2xl lg:text-[1.65rem] text-text-primary group-hover:text-accent-primary transition-colors duration-300 leading-snug sm:leading-tight line-clamp-2">
          {project.title}
        </h3>
      </article>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        album={{
          title: project.title,
          slug: project.slug || project.id,
          category: project.category,
          image: project.src,
          description: project.description,
        }}
      />
    </Link>
  );
}

// ============================================================================
// Main WorksPage Component
// ============================================================================

export interface WorksPageProps extends React.HTMLAttributes<HTMLElement> {
  initialAlbums?: WorksPageAlbum[];
  initialCategories?: WorksPageCategory[];
  initialCategory?: string;
}

/**
 * Normalizes and matches an input category parameter against available categories.
 */
function findMatchingCategory(
  param: string,
  availableCategories: { label: string; value: string }[],
): string {
  const norm = param.trim().toLowerCase();
  if (!norm || norm === "all") return "ALL";
  const normHyphen = norm.replace(/\s+/g, "-");
  const match = availableCategories.find((cat) => {
    const catLower = cat.value.toLowerCase();
    const catHyphen = catLower.replace(/\s+/g, "-");
    return catLower === norm || catHyphen === normHyphen;
  });
  return match ? match.value : param.toUpperCase();
}

export function WorksPage({
  initialAlbums,
  initialCategories,
  initialCategory,
  className,
  ...props
}: WorksPageProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

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

  const [activeCategory, setActiveCategory] = React.useState<string>(() => {
    if (initialCategory) {
      return findMatchingCategory(initialCategory, categoryTabs);
    }
    return "ALL";
  });

  const [sanityAlbums, setSanityAlbums] = React.useState<WorksPageAlbum[]>(
    initialAlbums || [],
  );
  const [hasMore, setHasMore] = React.useState(
    (initialAlbums?.length ?? 0) >= 6,
  );
  const prevInitialAlbumsRef = React.useRef(initialAlbums);

  // Synchronize initialAlbums only when it changes from a fresh route or live query,
  // without wiping out newly appended paginated albums.
  React.useEffect(() => {
    if (initialAlbums && initialAlbums !== prevInitialAlbumsRef.current) {
      prevInitialAlbumsRef.current = initialAlbums;
      setSanityAlbums((prev) => {
        if (prev.length <= (initialAlbums.length || 6)) {
          return initialAlbums;
        }
        const incomingIds = new Set(initialAlbums.map((a) => a._id));
        const remaining = prev.filter((a) => !incomingIds.has(a._id));
        return [...initialAlbums, ...remaining];
      });
      setHasMore((initialAlbums.length ?? 0) >= 6);
    }
  }, [initialAlbums]);

  const [isCategoryLoading, setIsCategoryLoading] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  /**
   * Fetches paginated albums filtered by category from the server.
   * Keeps data fetching server-side rather than filtering in the client.
   */
  const fetchWorksByCategory = React.useCallback(
    async (category: string, start = 0, limit = 6) => {
      const catParam =
        category === "ALL" ? "" : `&category=${encodeURIComponent(category)}`;
      const res = await fetch(
        `/api/albums?start=${start}&limit=${limit}${catParam}`,
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch albums for category: ${category}`);
      }
      return (await res.json()) as {
        albums: WorksPageAlbum[];
        hasMore: boolean;
      };
    },
    [],
  );

  /**
   * Category tab click handler:
   * 1. Updates URL params with clean slug/query param for sharing without page refresh.
   * 2. Triggers server-side paginated fetching for the selected category.
   */
  const handleCategorySelect = React.useCallback(
    async (newCategory: string) => {
      if (newCategory === activeCategory && !isCategoryLoading) return;

      setActiveCategory(newCategory);

      // Update the browser URL without full page reload so users can share the page
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (newCategory === "ALL") {
          url.searchParams.delete("category");
        } else {
          // Clean lowercase hyphenated param for URL sharing (e.g. "wedding", "pre-shoot")
          const urlParam = newCategory.toLowerCase().replace(/\s+/g, "-");
          url.searchParams.set("category", urlParam);
        }
        window.history.pushState(null, "", url.toString());
      }

      // Fetch relevant works filtered by the category from the server
      setIsCategoryLoading(true);
      try {
        const res = await fetchWorksByCategory(newCategory, 0, 6);
        setSanityAlbums(res.albums || []);
        setHasMore(res.hasMore ?? ((res.albums || []).length >= 6));
      } catch (err) {
        console.warn(
          "API route /api/albums failed, falling back to server action:",
          err,
        );
        try {
          const fallbackRes = await fetchMoreAlbums(0, 6, newCategory);
          setSanityAlbums(fallbackRes.albums || []);
          setHasMore(fallbackRes.hasMore);
        } catch (fallbackErr) {
          console.error("All fetch attempts failed for category:", fallbackErr);
          setSanityAlbums([]);
          setHasMore(false);
        }
      } finally {
        setIsCategoryLoading(false);
      }
    },
    [activeCategory, isCategoryLoading, fetchWorksByCategory],
  );

  // Listen for browser Back/Forward navigation to update category and fetch relevant works
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (!catParam) {
        if (activeCategory !== "ALL") {
          handleCategorySelect("ALL");
        }
      } else {
        const match = findMatchingCategory(catParam, categoryTabs);
        if (match !== activeCategory) {
          handleCategorySelect(match);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeCategory, categoryTabs, handleCategorySelect]);

  const loadMoreAlbums = React.useCallback(async () => {
    if (isLoadingMore || !hasMore || isCategoryLoading) return;
    setIsLoadingMore(true);
    try {
      let res: { albums: WorksPageAlbum[]; hasMore: boolean } | null = null;
      try {
        res = await fetchWorksByCategory(
          activeCategory,
          sanityAlbums.length,
          6,
        );
      } catch (fetchErr) {
        console.warn(
          "API route /api/albums failed, falling back to server action:",
          fetchErr,
        );
      }

      if (!res) {
        res = await fetchMoreAlbums(sanityAlbums.length, 6, activeCategory);
      }

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
  }, [
    isLoadingMore,
    hasMore,
    isCategoryLoading,
    activeCategory,
    sanityAlbums.length,
    fetchWorksByCategory,
  ]);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isCategoryLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMore && !isCategoryLoading) {
          loadMoreAlbums();
        }
      },
      { rootMargin: "600px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isCategoryLoading, loadMoreAlbums]);

  // Normalize all available projects: use Sanity CMS data when available, otherwise fall back to empty list
  const allProjects = React.useMemo<AlbumProject[]>(() => {
    if (sanityAlbums && sanityAlbums.length > 0) {
      return sanityAlbums.map(mapSanityAlbum);
    }
    return [];
  }, [sanityAlbums]);

  const isFirstMountRef = React.useRef(true);
  const prevCategoryRef = React.useRef(activeCategory);

  // Animate grid cards ONLY on initial mount and when category changes.
  // Never re-animate or reset opacity of existing cards during infinite scroll pagination.
  React.useEffect(() => {
    if (isCategoryLoading || !gridRef.current) return;

    const isCategoryChange = prevCategoryRef.current !== activeCategory;
    prevCategoryRef.current = activeCategory;

    if (isFirstMountRef.current || isCategoryChange) {
      isFirstMountRef.current = false;
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
    }
  }, [activeCategory, isCategoryLoading]);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative w-full min-h-screen bg-bg-base text-text-primary select-none",
        "pt-28 sm:pt-36 md:pt-40 pb-24 sm:pb-32 px-3 sm:px-6 md:px-8 lg:px-12",
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

          {/* Interactive Shoot Category Filtering Tabs */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
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
                    onClick={() => handleCategorySelect(tab.value)}
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
        </header>

        {/* ================================================================= */}
        {/* 2. Gallery Grid & Album Cards */}
        {/* ================================================================= */}
        <main className="mt-12 sm:mt-16">
          {isCategoryLoading ? (
            /* Skeleton Loading Grid while switching category */
            <div
              aria-label="Loading portfolio archives"
              className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8 lg:gap-12"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={`cat-loading-skeleton-${index}`} />
              ))}
            </div>
          ) : allProjects.length === 0 ? (
            /* Empty Filter Results State */
            <div className="py-24 text-center rounded-2xl border border-dashed border-border-subtle bg-bg-surface/50">
              <div className="w-14 h-14 mx-auto rounded-full border border-border-subtle bg-bg-base flex items-center justify-center text-text-muted mb-4 shadow-sm">
                <Layers className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h2 className="font-serif italic text-2xl sm:text-3xl text-text-primary">
                No matching archives found
              </h2>
              <p className="font-sans text-xs uppercase tracking-widest text-text-muted mt-2 max-w-sm mx-auto">
                {activeCategory === "ALL"
                  ? "No archive projects are currently available."
                  : `No projects found in the "${activeCategory}" archive.`}
              </p>
              {activeCategory !== "ALL" && (
                <button
                  type="button"
                  onClick={() => handleCategorySelect("ALL")}
                  className="mt-6 px-6 py-2.5 rounded-full bg-text-primary text-bg-base font-sans text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors duration-200"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            /* Actual Responsive Gallery Grid */
            <>
              <div
                ref={gridRef}
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8 lg:gap-12"
              >
                {allProjects.map((project, index) => (
                  <AlbumCard
                    key={project.id}
                    project={project}
                    priority={index < 3}
                  />
                ))}

                {/* In-place skeleton cards directly in the grid where new albums are loading */}
                {isLoadingMore && (
                  <>
                    <SkeletonCard key="loading-skeleton-1" />
                    <SkeletonCard key="loading-skeleton-2" />
                    <SkeletonCard key="loading-skeleton-3" />
                  </>
                )}
              </div>

              {/* Scroll-based pagination sentinel & loading indicator */}
              <div
                ref={sentinelRef}
                className="w-full py-12 flex items-center justify-center min-h-[80px]"
                aria-live="polite"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2.5 text-text-muted select-none">
                    <span className="inline-block w-2 h-2 rounded-full bg-text-muted animate-ping" />
                    <p className="font-serif italic text-sm text-text-muted lowercase tracking-widest">
                      loading more archives...
                    </p>
                  </div>
                ) : !hasMore && allProjects.length > 6 ? (
                  <p className="font-serif italic text-xs text-text-muted/60 tracking-widest uppercase select-none">
                    — END OF WORKS ARCHIVE —
                  </p>
                ) : null}
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
}

export default WorksPage;
