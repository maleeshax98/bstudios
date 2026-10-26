"use client";

import * as React from "react";
import Image from "next/image";
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

// ============================================================================
// Types & Categories
// ============================================================================

export type MediaFormat = "ALL" | "PHOTOS" | "VIDEOS";
export type ShootCategory =
  | "ALL"
  | "WEDDING"
  | "BIRTHDAY"
  | "COMMERCIAL"
  | "CASUAL"
  | "ENGAGEMENT";

export interface AlbumProject {
  id: string;
  title: string;
  category: Exclude<ShootCategory, "ALL">;
  media: Exclude<MediaFormat, "ALL">;
  date: string;
  src: string;
  alt: string;
  count?: string;
  duration?: string;
  aspectRatio?: string;
}

export const MEDIA_FORMAT_TABS: { label: string; value: MediaFormat }[] = [
  { label: "ALL", value: "ALL" },
  { label: "PHOTOS", value: "PHOTOS" },
  { label: "VIDEOS", value: "VIDEOS" },
];

export const SHOOT_CATEGORY_TABS: { label: string; value: ShootCategory }[] = [
  { label: "ALL", value: "ALL" },
  { label: "WEDDING", value: "WEDDING" },
  { label: "BIRTHDAY", value: "BIRTHDAY" },
  { label: "COMMERCIAL", value: "COMMERCIAL" },
  { label: "CASUAL", value: "CASUAL" },
  { label: "ENGAGEMENT", value: "ENGAGEMENT" },
];

// Curated high-resolution Unsplash album projects
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
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border-subtle bg-[#EBEBE8] animate-pulse">
        <div className="absolute top-4 right-4 h-6 w-20 rounded-full bg-[#DFDFDC] animate-pulse" />
        <div className="absolute bottom-4 left-4 h-5 w-28 rounded-md bg-[#DFDFDC] animate-pulse" />
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
    e.stopPropagation();
    setIsRetrying(true);
    setHasError(false);
    setRetryKey((prev) => prev + 1);

    // Reset spinner state after a momentary pause
    setTimeout(() => {
      setIsRetrying(false);
    }, 450);
  };

  const imageSrc =
    retryKey > 0 ? `${project.src}&retry=${retryKey}` : project.src;

  return (
    <article className="group relative flex flex-col w-full text-left transition-all duration-300">
      {/* Thumbnail Container */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface",
          project.aspectRatio || "aspect-[4/5]"
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
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              )}
            >
              <RotateCw
                className={cn(
                  "w-3.5 h-3.5 stroke-[2]",
                  isRetrying && "animate-spin"
                )}
              />
              <span>{isRetrying ? "Retrying..." : "Retry Image"}</span>
            </button>
          </div>
        ) : (
          <>
            {/* Optimized Next.js Image with Hover Scale */}
            <Image
              key={`${project.id}-${retryKey}`}
              src={imageSrc}
              alt={project.alt || project.title}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              priority={priority}
              quality={85}
              onError={() => setHasError(true)}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
                    {project.duration || "4K Film"}
                  </span>
                </>
              ) : (
                <>
                  <Camera className="w-3 h-3 stroke-[2]" />
                  <span className="font-sans text-[10px] font-bold uppercase tracking-wider">
                    {project.count || "Photo Vault"}
                  </span>
                </>
              )}
            </div>

            {/* Bottom Floating Play Indicator for Videos */}
            {project.media === "VIDEOS" && (
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
  );
}

// ============================================================================
// Main WorksPage Component
// ============================================================================

export type WorksPageProps = React.HTMLAttributes<HTMLElement>;

export function WorksPage({ className, ...props }: WorksPageProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Filter States
  const [activeMedia, setActiveMedia] = React.useState<MediaFormat>("ALL");
  const [activeCategory, setActiveCategory] =
    React.useState<ShootCategory>("ALL");

  // Simulated Loading State for initial fetch and skeleton demonstration
  const [isLoading, setIsLoading] = React.useState(true);

  // Initial simulated data loading sequence
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  // Filtered projects
  const filteredProjects = React.useMemo(() => {
    return ALBUM_PROJECTS.filter((project) => {
      const matchMedia =
        activeMedia === "ALL" || project.media === activeMedia;
      const matchCategory =
        activeCategory === "ALL" || project.category === activeCategory;
      return matchMedia && matchCategory;
    });
  }, [activeMedia, activeCategory]);

  // Animate grid cards when filtering or loading completes
  React.useEffect(() => {
    if (isLoading || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll("article");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
            ease: "power2.out",
          }
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
        className
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
            SELECTED WORKS
          </h1>

          {/* Editorial Philosophy Statement */}
          {/* <p className="mt-4 sm:mt-6 font-serif italic text-lg sm:text-2xl text-text-muted max-w-3xl leading-relaxed">
            A comprehensive monograph of client archives, documentary wedding
            narratives, and editorial commercial direction.
          </p> */}

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
                {MEDIA_FORMAT_TABS.map((tab) => {
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
                          : "text-text-muted hover:text-text-primary hover:bg-[#111111]/5 border border-transparent"
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
                {SHOOT_CATEGORY_TABS.map((tab) => {
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
                          : "text-text-muted hover:text-text-primary hover:bg-[#111111]/5 border border-transparent"
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
          )}
        </main>
      </div>
    </section>
  );
}

export default WorksPage;
