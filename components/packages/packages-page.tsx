"use client";

import * as React from "react";
import gsap from "gsap";
import { ArrowUpRight, Check, Sparkles, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { client } from "@/sanity/client";
import { CATEGORIES_QUERY, PACKAGES_BY_CATEGORY_QUERY } from "@/sanity/queries";
import type {
  CATEGORIES_QUERY_RESULT,
  PACKAGES_QUERY_RESULT,
} from "@/sanity.types";

export type CategoryItem = CATEGORIES_QUERY_RESULT[number];
export type PackageItem = PACKAGES_QUERY_RESULT[number];

export interface PackagesPageProps {
  initialCategories?: CategoryItem[];
  initialPackages?: PackageItem[];
}

export function PackagesPage({
  initialCategories = [],
  initialPackages = [],
}: PackagesPageProps) {
  const [categories, setCategories] =
    React.useState<CategoryItem[]>(initialCategories);
  const [packages, setPackages] =
    React.useState<PackageItem[]>(initialPackages);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>(
    () => initialCategories[0]?._id || "",
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const cardsGridRef = React.useRef<HTMLDivElement>(null);

  // If initialCategories was empty, fetch categories on mount
  React.useEffect(() => {
    if (categories.length > 0) return;

    let isMounted = true;
    async function loadCategories() {
      try {
        const fetched: CategoryItem[] = await client.fetch(CATEGORIES_QUERY);
        if (isMounted && fetched && fetched.length > 0) {
          setCategories(fetched);
          setSelectedCategoryId((current) => current || fetched[0]._id);
        }
      } catch (err) {
        console.warn("Could not fetch categories on client:", err);
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, [categories.length]);

  const effectiveCategoryId = selectedCategoryId || categories[0]?._id || "";

  // Resolve currently selected category
  const selectedCategory = React.useMemo(() => {
    return (
      categories.find((c) => c._id === effectiveCategoryId) ||
      categories[0] ||
      null
    );
  }, [categories, effectiveCategoryId]);

  // Filter packages for the selected category
  const activePackages = React.useMemo(() => {
    if (!selectedCategory) return [];

    return packages.filter((pkg) => {
      if (!pkg.category) return false;
      if (pkg.category._id === selectedCategory._id) return true;
      if (
        pkg.category.title &&
        selectedCategory.title &&
        pkg.category.title.trim().toLowerCase() ===
          selectedCategory.title.trim().toLowerCase()
      ) {
        return true;
      }
      return false;
    });
  }, [packages, selectedCategory]);

  // Fetch from Sanity when selecting a category if no packages exist in local state
  React.useEffect(() => {
    if (!selectedCategory) return;

    let isMounted = true;

    async function ensureCategoryPackages() {
      // Check if we already have matching packages in state
      const hasMatch = packages.some((p) => {
        if (!p.category) return false;
        return (
          p.category._id === selectedCategory?._id ||
          (p.category.title &&
            selectedCategory?.title &&
            p.category.title.trim().toLowerCase() ===
              selectedCategory.title.trim().toLowerCase())
        );
      });

      if (hasMatch) return;

      try {
        setIsLoading(true);
        const fetched: PackageItem[] = await client.fetch(
          PACKAGES_BY_CATEGORY_QUERY,
          {
            categoryId: selectedCategory._id,
            category: selectedCategory.title || "",
          },
        );

        if (isMounted && fetched && fetched.length > 0) {
          setPackages((prev) => {
            const existingIds = new Set(prev.map((p) => p._id));
            const newItems = fetched.filter((p) => !existingIds.has(p._id));
            return [...prev, ...newItems];
          });
        }
      } catch (err) {
        console.warn("Could not fetch packages for category:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    ensureCategoryPackages();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, packages]);

  // GSAP animation when switching categories: clean fade-in and subtle upward glide
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
            stagger: 0.06,
            ease: "power2.out",
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [selectedCategoryId, activePackages]);

  const selectedCategoryTitle = selectedCategory?.title || "COLLECTION";

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-bg-base text-text-primary selection:bg-text-primary selection:text-bg-base"
    >
      {/* 1. The Editorial Header */}
      <section className="relative w-full pt-28 sm:pt-36 md:pt-40 pb-12 sm:pb-16 px-6 sm:px-8 lg:px-12">
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

      {/* 2. The Service Selection (Categories Navigation - wrapped, no horizontal scroll) */}
      <nav
        aria-label="Package Categories"
        className="sticky top-16 sm:top-20 z-30 w-full bg-bg-base/95 backdrop-blur-md border-y border-border-subtle py-4 px-6 sm:px-8 lg:px-12 transition-colors duration-200"
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
          {categories.map((cat) => {
            const isActive = selectedCategory?._id === cat._id;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => setSelectedCategoryId(cat._id)}
                aria-pressed={isActive}
                className={cn(
                  "relative px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-sans font-bold uppercase tracking-[0.2em] transition-all duration-200 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-primary",
                  isActive
                    ? "text-[#111111] bg-bg-surface font-black shadow-xs ring-1 ring-border-subtle"
                    : "text-[#888888] hover:text-[#111111] hover:bg-bg-surface/50",
                )}
              >
                [ {cat.title} ]
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

      {/* 3. The Packages Display (Centered flex system) */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Active Category Monograph Cue */}
          <div className="flex items-center justify-between mb-10 sm:mb-14 pb-4 border-b border-border-subtle">
            <span className="font-sans font-bold text-xs uppercase tracking-[0.25em] text-text-muted">
              SHOWING // {selectedCategoryTitle.toUpperCase()} TIERS
            </span>
            <span className="font-serif italic text-xs sm:text-sm text-text-muted">
              {activePackages.length}{" "}
              {activePackages.length === 1 ? "Option" : "Options"} Available
            </span>
          </div>

          {/* Cards or Empty State Container */}
          <div ref={cardsGridRef} className="w-full">
            {activePackages.length === 0 ? (
              /* If there is no packages for the relevant category, show a message */
              <div className="package-empty-state w-full py-16 sm:py-24 text-center border border-dashed border-border-subtle bg-bg-surface/20 max-w-2xl mx-auto px-6 sm:px-10 rounded-sm">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-bg-surface text-text-muted">
                  <PackageOpen className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-[0.25em] text-text-muted block mb-3">
                  COLLECTION STATUS // 0 TIERS
                </span>
                <h3 className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-text-primary mb-3">
                  No packages available for this category yet.
                </h3>
                <p className="font-sans text-xs uppercase tracking-widest text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
                  Every story deserves dedicated art direction. Inquire directly
                  to commission a bespoke collection for your{" "}
                  <span className="font-semibold text-text-primary lowercase">
                    {selectedCategoryTitle}
                  </span>
                  .
                </p>
                <a
                  href={`https://wa.me/94704028206?text=${encodeURIComponent(
                    `Hi B studio, I would like to inquire about bespoke packages for ${selectedCategoryTitle}.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-sans font-bold uppercase tracking-[0.2em] border border-text-primary bg-text-primary text-bg-base hover:bg-black transition-colors"
                >
                  <span>[ REQUEST BESPOKE QUOTE ]</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ) : (
              /* Centered package cards flex system */
              <div className="flex flex-wrap justify-center items-stretch gap-8 sm:gap-10 lg:gap-12 max-w-7xl mx-auto">
                {activePackages.map((pkg, idx) => {
                  const tierIndex = String(idx + 1).padStart(2, "0");
                  const hasBadge = Boolean(pkg.badge);

                  return (
                    <article
                      key={pkg._id || `pkg-${idx}`}
                      className="package-card w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-2rem)] max-w-md relative border border-border-subtle bg-bg-surface/20 hover:bg-bg-surface/40 p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-text-primary/50 group"
                    >
                      {/* Top Section */}
                      <div>
                        {/* Header Row: Tier Index & Optional Badge */}
                        <div className="flex items-center justify-between gap-4 mb-6">
                          <span className="font-serif italic text-lg text-text-muted">
                            /{tierIndex}
                          </span>
                          {hasBadge && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.2em] border border-text-primary/20 bg-bg-base text-text-primary rounded-full">
                              <Sparkles className="w-2.5 h-2.5 stroke-[2]" />
                              {pkg.badge}
                            </span>
                          )}
                        </div>

                        {/* Title: Bold Sans-Serif Package Name */}
                        <h2 className="font-sans font-black uppercase text-2xl sm:text-3xl lg:text-[1.85rem] tracking-tight leading-[1.05] text-text-primary group-hover:text-black transition-colors">
                          {pkg.title}
                        </h2>

                        {/* Investment / Price (Quite Big Display) */}
                        {pkg.price && (
                          <div className="mt-4 flex items-baseline gap-2">
                            <span className="font-sans font-black text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-none text-text-primary">
                              {pkg.price}
                            </span>
                          </div>
                        )}

                        {/* Hairline Divider */}
                        <div className="h-px w-full bg-border-subtle my-6" />

                        {/* Description: Sophisticated Italicized Serif */}
                        {pkg.description && (
                          <p className="font-serif italic text-base sm:text-lg text-text-primary/80 leading-relaxed">
                            &ldquo;{pkg.description}&rdquo;
                          </p>
                        )}

                        {/* Hairline Divider */}
                        <div className="h-px w-full bg-border-subtle my-6" />

                        {/* Deliverables Header */}
                        <h3 className="font-sans font-bold text-[10px] uppercase tracking-[0.25em] text-text-muted mb-4">
                          COLLECTION INCLUSIONS
                        </h3>

                        {/* Deliverables: Sleek List mapping over array */}
                        {pkg.deliverables && pkg.deliverables.length > 0 && (
                          <ul className="space-y-3">
                            {pkg.deliverables.map((item, dIdx) => (
                              <li
                                key={dIdx}
                                className="font-sans text-xs uppercase tracking-wider text-text-muted flex items-start gap-2.5 leading-snug"
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
                            `Hi B studio, I would like to inquire about the "${pkg.title || "Package"}" package (${selectedCategoryTitle}${pkg.price ? ` - ${pkg.price}` : ""}).`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 px-6 text-xs font-sans font-bold uppercase tracking-[0.2em] border border-text-primary text-text-primary bg-transparent hover:bg-text-primary hover:text-bg-base transition-colors duration-200 flex items-center justify-center gap-2 group-hover:bg-text-primary group-hover:text-bg-base cursor-pointer"
                        >
                          <span>[ INQUIRE NOW ]</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Loading Indicator when fetching category asynchronously */}
          {isLoading && (
            <div className="mt-12 text-center">
              <p className="font-serif italic text-sm text-text-muted lowercase tracking-widest animate-pulse">
                loading collections...
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
