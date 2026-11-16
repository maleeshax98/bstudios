"use client";

import * as React from "react";
import gsap from "gsap";
import { ArrowUpRight, Check, Sparkles, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchMorePackages } from "@/lib/actions";
import type {
  CATEGORIES_QUERY_RESULT,
  PAGINATED_PACKAGES_QUERY_RESULT,
} from "@/sanity.types";

export type CategoryItem = CATEGORIES_QUERY_RESULT[number];
export type PackageItem = PAGINATED_PACKAGES_QUERY_RESULT[number];

export interface PackagesPageProps {
  initialCategories?: CategoryItem[];
  initialPackages?: PackageItem[];
  initialCategory?: string;
}

/**
 * Finds a matching category title or value given a URL parameter (e.g. "pre-shoot" -> "PRE SHOOT").
 */
function findMatchingCategory(
  param: string,
  categories: { label: string; value: string; id?: string }[],
): string {
  const normalized = param.trim().toLowerCase().replace(/-/g, " ");
  const found = categories.find((c) => {
    const tabNorm = c.value.trim().toLowerCase().replace(/-/g, " ");
    return (
      tabNorm === normalized ||
      c.id === param ||
      c.value.toLowerCase() === param.toLowerCase()
    );
  });
  return found ? found.value : "ALL";
}

// ============================================================================
// Skeleton Card Component for 1-Card Mobile & Multi-Column Desktop Layout
// ============================================================================

export function PackageSkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="package-skeleton relative flex flex-col justify-between w-full max-w-md mx-auto select-none rounded-xl sm:rounded-2xl border border-border-subtle bg-bg-surface/20 p-6 sm:p-8 lg:p-10 animate-pulse"
    >
      <div>
        {/* Top index skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-4 w-10 rounded bg-[#DFDFDC] dark:bg-bg-surface" />
          <div className="h-5 w-16 rounded-full bg-[#DFDFDC] dark:bg-bg-surface" />
        </div>
        {/* Title skeleton */}
        <div className="h-7 sm:h-8 w-3/4 rounded bg-[#DFDFDC] dark:bg-bg-surface mb-3" />
        {/* Price skeleton */}
        <div className="h-8 sm:h-10 w-1/2 rounded bg-[#DFDFDC] dark:bg-bg-surface mb-5" />
        {/* Divider */}
        <div className="h-px w-full bg-border-subtle my-5 sm:my-6" />
        {/* Description skeleton */}
        <div className="space-y-2 my-5 sm:my-6">
          <div className="h-3 w-full rounded bg-[#DFDFDC] dark:bg-bg-surface" />
          <div className="h-3 w-5/6 rounded bg-[#DFDFDC] dark:bg-bg-surface" />
        </div>
        {/* Inclusions header */}
        <div className="h-2.5 w-28 rounded bg-[#DFDFDC] dark:bg-bg-surface mb-4" />
        {/* Deliverables skeleton */}
        <div className="space-y-3">
          <div className="h-3 w-4/5 rounded bg-[#DFDFDC] dark:bg-bg-surface" />
          <div className="h-3 w-3/4 rounded bg-[#DFDFDC] dark:bg-bg-surface" />
          <div className="h-3 w-2/3 rounded bg-[#DFDFDC] dark:bg-bg-surface" />
        </div>
      </div>
      {/* Button skeleton */}
      <div className="mt-8 sm:mt-10 pt-6 border-t border-border-subtle">
        <div className="h-11 sm:h-12 w-full rounded bg-[#DFDFDC] dark:bg-bg-surface" />
      </div>
    </div>
  );
}

// ============================================================================
// Main Packages Page Component
// ============================================================================

export function PackagesPage({
  initialCategories = [],
  initialPackages = [],
  initialCategory,
}: PackagesPageProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cardsGridRef = React.useRef<HTMLDivElement>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  // Compute category tabs: prepend [ ALL ] followed by categories from Sanity
  const categoryTabs = React.useMemo<{ label: string; value: string; id?: string }[]>(() => {
    const tabs: { label: string; value: string; id?: string }[] = [
      { label: "ALL", value: "ALL", id: "ALL" },
    ];
    const seen = new Set<string>(["ALL"]);

    initialCategories.forEach((cat) => {
      const title = cat.title?.trim();
      if (title && !seen.has(title.toUpperCase())) {
        seen.add(title.toUpperCase());
        tabs.push({
          label: title,
          value: title,
          id: cat._id,
        });
      }
    });

    return tabs;
  }, [initialCategories]);

  // Initial active category resolved from searchParams or default to ALL
  const [activeCategory, setActiveCategory] = React.useState<string>(() => {
    if (initialCategory) {
      return findMatchingCategory(initialCategory, categoryTabs);
    }
    return "ALL";
  });

  const [packages, setPackages] = React.useState<PackageItem[]>(initialPackages || []);
  const [hasMore, setHasMore] = React.useState<boolean>(
    (initialPackages?.length ?? 0) >= 6,
  );
  const [isCategoryLoading, setIsCategoryLoading] = React.useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState<boolean>(false);

  const prevInitialPackagesRef = React.useRef(initialPackages);

  // Synchronize initialPackages when updated from fresh route or live revalidation
  React.useEffect(() => {
    if (initialPackages && initialPackages !== prevInitialPackagesRef.current) {
      prevInitialPackagesRef.current = initialPackages;
      setPackages((prev) => {
        if (prev.length <= (initialPackages.length || 6)) {
          return initialPackages;
        }
        const incomingIds = new Set(initialPackages.map((p) => p._id));
        const remaining = prev.filter((p) => !incomingIds.has(p._id));
        return [...initialPackages, ...remaining];
      });
      setHasMore((initialPackages.length ?? 0) >= 6);
    }
  }, [initialPackages]);

  /**
   * Fetches paginated packages filtered by category from the server.
   * Keeps data fetching server-side rather than filtering in client-side memory.
   */
  const fetchPackagesByCategory = React.useCallback(
    async (category: string, start = 0, limit = 6) => {
      const catParam =
        category === "ALL" ? "" : `&category=${encodeURIComponent(category)}`;
      const res = await fetch(`/api/packages?start=${start}&limit=${limit}${catParam}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch packages for category: ${category}`);
      }
      return (await res.json()) as {
        packages: PackageItem[];
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

      // Update browser URL search params without full page reload so users can share the page
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

      // Fetch relevant packages filtered by the category from the server
      setIsCategoryLoading(true);
      try {
        const res = await fetchPackagesByCategory(newCategory, 0, 6);
        setPackages(res.packages || []);
        setHasMore(res.hasMore ?? ((res.packages || []).length >= 6));
      } catch (err) {
        console.warn(
          "API route /api/packages failed, falling back to server action:",
          err,
        );
        try {
          const fallbackRes = await fetchMorePackages(0, 6, newCategory);
          setPackages(fallbackRes.packages || []);
          setHasMore(fallbackRes.hasMore);
        } catch (fallbackErr) {
          console.error("All fetch attempts failed for category:", fallbackErr);
          setPackages([]);
          setHasMore(false);
        }
      } finally {
        setIsCategoryLoading(false);
      }
    },
    [activeCategory, isCategoryLoading, fetchPackagesByCategory],
  );

  // Listen for browser Back/Forward navigation to update category and fetch relevant packages
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

  /**
   * Infinite scroll pagination: Loads more packages for active category
   */
  const loadMorePackages = React.useCallback(async () => {
    if (isLoadingMore || !hasMore || isCategoryLoading) return;

    setIsLoadingMore(true);
    const start = packages.length;

    try {
      const res = await fetchPackagesByCategory(activeCategory, start, 6);
      const newItems = res.packages || [];

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setPackages((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const uniqueNew = newItems.filter((p) => !existingIds.has(p._id));
          return [...prev, ...uniqueNew];
        });
        setHasMore(res.hasMore ?? (newItems.length >= 6));
      }
    } catch (err) {
      console.warn("Failed to load more packages via API, trying server action:", err);
      try {
        const fallbackRes = await fetchMorePackages(start, 6, activeCategory);
        const fallbackItems = fallbackRes.packages || [];
        if (fallbackItems.length === 0) {
          setHasMore(false);
        } else {
          setPackages((prev) => {
            const existingIds = new Set(prev.map((p) => p._id));
            const uniqueNew = fallbackItems.filter((p) => !existingIds.has(p._id));
            return [...prev, ...uniqueNew];
          });
          setHasMore(fallbackRes.hasMore);
        }
      } catch (fallbackErr) {
        console.error("All loadMore attempts failed:", fallbackErr);
        setHasMore(false);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    hasMore,
    isCategoryLoading,
    packages.length,
    activeCategory,
    fetchPackagesByCategory,
  ]);

  // Infinite scroll intersection observer
  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isCategoryLoading) {
          loadMorePackages();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isCategoryLoading, loadMorePackages]);

  // GSAP animation when switching categories or updating packages
  React.useEffect(() => {
    if (!cardsGridRef.current) return;

    const ctx = gsap.context(() => {
      const items = cardsGridRef.current?.querySelectorAll(
        ".package-card, .package-empty-state",
      );
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.05,
            ease: "power2.out",
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [activeCategory, packages.length]);

  const activeCategoryTitle =
    activeCategory === "ALL" ? "COLLECTION" : activeCategory;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-bg-base text-text-primary selection:bg-text-primary selection:text-bg-base"
    >
      {/* 1. The Editorial Header */}
      <section className="relative w-full pt-28 sm:pt-36 md:pt-40 pb-12 sm:pb-16 px-3 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Subtle Monograph Index */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8 text-xs font-sans font-bold tracking-[0.25em] text-text-muted uppercase">
            <span className="w-8 h-px bg-border-subtle" />
            <span>INVESTMENT &amp; COLLECTIONS</span>
            <span className="w-8 h-px bg-border-subtle" />
          </div>

          {/* Massive Brutalist Sans-Serif Headline */}
          <h1 className="font-sans font-black uppercase text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] tracking-tight leading-[0.88] text-text-primary">
            CURATED
            <br />
            PACKAGES
          </h1>

          {/* Elegant Italicized Serif Subtitle */}
          <p className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-[2rem] text-text-primary/80 mt-6 sm:mt-8 max-w-3xl leading-relaxed">
            Bespoke collections tailored to your unique narrative.
          </p>
        </div>
      </section>

      {/* 2. The Service Selection (Categories Navigation - wrapped, no horizontal scroll, NO photos/videos filter) */}
      <nav
        aria-label="Package Categories"
        className="top-16 sm:top-20 z-30 w-full bg-bg-base/95 backdrop-blur-md border-y border-border-subtle py-4 px-3 sm:px-6 md:px-8 lg:px-12 transition-colors duration-200"
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3.5">
          {categoryTabs.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.id || cat.value}
                type="button"
                onClick={() => handleCategorySelect(cat.value)}
                aria-pressed={isActive}
                className={cn(
                  "relative px-3.5 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-sans font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] transition-all duration-200 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-primary",
                  isActive
                    ? "text-text-primary bg-bg-surface font-black shadow-xs ring-1 ring-border-subtle"
                    : "text-text-muted hover:text-text-primary hover:bg-bg-surface/50",
                )}
              >
                [ {cat.label} ]
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-4 left-4 right-4 h-0.5 bg-text-primary hidden sm:block"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. The Packages Display (1-Card Grid on Small Screens, Multi-Column on Desktop) */}
      <section className="relative w-full py-12 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Active Category Monograph Cue */}
          <div className="flex items-center justify-between mb-8 sm:mb-14 pb-4 border-b border-border-subtle">
            <span className="font-sans font-bold text-xs uppercase tracking-[0.25em] text-text-muted">
              SHOWING // {activeCategoryTitle.toUpperCase()} TIERS
            </span>
            <span className="font-serif italic text-xs sm:text-sm text-text-muted">
              {packages.length} {packages.length === 1 ? "Option" : "Options"}{" "}
              Available
            </span>
          </div>

          {/* Cards or Empty State Container */}
          <div ref={cardsGridRef} className="w-full">
            {isCategoryLoading ? (
              /* Skeleton Grid during category switching */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <PackageSkeletonCard key={`cat-skel-${idx}`} />
                ))}
              </div>
            ) : packages.length === 0 ? (
              /* Empty state if no packages exist for relevant category */
              <div className="package-empty-state w-full py-16 sm:py-24 text-center border border-dashed border-border-subtle bg-bg-surface/20 max-w-2xl mx-auto px-6 sm:px-10 rounded-xl">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-bg-surface text-text-muted">
                  <PackageOpen className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-[0.25em] text-text-muted block mb-3">
                  COLLECTION STATUS // 0 TIERS
                </span>
                <h3 className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-text-primary mb-3">
                  No data to load
                </h3>
                <p className="font-sans text-xs uppercase tracking-widest text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
                  Every story deserves dedicated art direction. Inquire directly
                  to commission a bespoke collection for your{" "}
                  <span className="font-semibold text-text-primary lowercase">
                    {activeCategoryTitle}
                  </span>
                  .
                </p>
                <a
                  href={`https://wa.me/94704028206?text=${encodeURIComponent(
                    `Hi B'STUDIO, I would like to inquire about bespoke packages for ${activeCategoryTitle}.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-sans font-bold uppercase tracking-[0.2em] border border-text-primary bg-text-primary text-bg-base hover:bg-black transition-colors rounded-none"
                >
                  <span>[ REQUEST BESPOKE QUOTE ]</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ) : (
              /* Responsive 1-Card Grid on Small Screens, Multi-Column on Desktop */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
                {packages.map((pkg, idx) => {
                  const tierIndex = String(idx + 1).padStart(2, "0");
                  const hasBadge = Boolean(pkg.badge);
                  return (
                    <article
                      key={pkg._id || `pkg-${idx}`}
                      className={`package-card w-full max-w-md mx-auto relative border border-border-subtle bg-bg-surface/20 hover:bg-bg-surface/40 p-6 sm:p-8 lg:p-10 flex flex-col justify-between transition-all duration-300 hover:border-text-primary/50 group rounded-xl sm:rounded-2xl ${
                        pkg.isHighlited ? "border-2 border-text-primary/50" : ""
                      }`}
                    >
                      {/* Top Section */}
                      <div>
                        {/* Header Row: Tier Index & Optional Badge */}
                        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                          <span className="font-serif italic text-base sm:text-lg text-text-muted">
                            /{tierIndex}
                          </span>
                          {hasBadge && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] border border-text-primary/20 bg-bg-base text-text-primary rounded-full shrink-0">
                              <Sparkles className="w-2.5 h-2.5 stroke-[2]" />
                              <span>{pkg.badge}</span>
                            </span>
                          )}
                        </div>

                        {/* Title: Bold Sans-Serif Package Name */}
                        <h2 className="font-sans font-black uppercase text-2xl sm:text-3xl lg:text-[1.85rem] tracking-tight leading-[1.05] text-text-primary group-hover:text-black group-hover:dark:text-text-primary transition-colors">
                          {pkg.title}
                        </h2>

                        {/* Investment / Price */}
                        {pkg.price && (
                          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
                            <span className="font-sans font-black text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-none text-text-primary">
                              {pkg.price}
                            </span>
                          </div>
                        )}

                        {/* Hairline Divider */}
                        <div className="h-px w-full bg-border-subtle my-5 sm:my-6" />

                        {/* Description: Sophisticated Italicized Serif */}
                        {pkg.description && (
                          <p className="font-serif italic text-base sm:text-lg text-text-primary/80 leading-relaxed">
                            &ldquo;{pkg.description}&rdquo;
                          </p>
                        )}

                        {/* Hairline Divider */}
                        <div className="h-px w-full bg-border-subtle my-5 sm:my-6" />

                        {/* Deliverables Header */}
                        <h3 className="font-sans font-bold text-[10px] uppercase tracking-[0.25em] text-text-muted mb-4">
                          COLLECTION INCLUSIONS
                        </h3>

                        {/* Deliverables: Sleek List mapping over array */}
                        {pkg.deliverables && pkg.deliverables.length > 0 && (
                          <ul className="space-y-2.5 sm:space-y-3">
                            {pkg.deliverables.map((item, dIdx) => (
                              <li
                                key={dIdx}
                                className="font-sans text-xs uppercase tracking-wide text-text-muted flex items-start gap-2.5 leading-snug"
                              >
                                <span className="inline-block mt-0.5 text-text-primary/70 shrink-0">
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </span>
                                <span className="text-text-primary/90">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Bottom Action: Sleek [ INQUIRE NOW ] WhatsApp Redirect Button */}
                      <div className="mt-8 sm:mt-10 pt-6 border-t border-border-subtle">
                        <a
                          href={`https://wa.me/94704028206?text=${encodeURIComponent(
                            `Hi B'STUDIO, I would like to inquire about the "${pkg.title || "Package"}" package (${activeCategoryTitle}${pkg.price ? ` - ${pkg.price}` : ""}).`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 sm:py-4 px-6 text-xs font-sans font-bold uppercase tracking-[0.2em] border border-text-primary text-text-primary bg-transparent hover:bg-text-primary hover:text-bg-base transition-colors duration-200 flex items-center justify-center gap-2 group-hover:bg-text-primary group-hover:text-bg-base cursor-pointer rounded-none"
                        >
                          <span>[ INQUIRE NOW ]</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      </div>
                    </article>
                  );
                })}

                {/* In-Place Skeletons when loading next page */}
                {isLoadingMore && (
                  <>
                    <PackageSkeletonCard />
                    <PackageSkeletonCard />
                  </>
                )}
              </div>
            )}

            {/* Scroll Sentinel for Infinite Pagination */}
            <div
              ref={sentinelRef}
              className="w-full h-8 flex items-center justify-center mt-8 pointer-events-none"
            >
              {isLoadingMore && (
                <p className="font-serif italic text-xs text-text-muted lowercase tracking-widest animate-pulse">
                  loading more collections...
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
