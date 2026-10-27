"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { client } from "@/sanity/client";
import { PACKAGES_BY_CATEGORY_QUERY } from "@/sanity/queries";

export interface PackageItem {
  _id: string;
  title: string | null;
  serviceCategory: string | null;
  description: string | null;
  deliverables: string[] | null;
  price?: string | null;
  badge?: string | null;
  order?: number | null;
}

export interface PackagesPageProps {
  initialPackages?: PackageItem[];
}

export type ServiceCategoryId =
  | "preshoot"
  | "casual"
  | "birthday"
  | "engagement"
  | "wedding"
  | "promotion";

export interface ServiceCategoryTab {
  id: ServiceCategoryId;
  label: string;
}

export const SERVICE_CATEGORIES: ServiceCategoryTab[] = [
  { id: "preshoot", label: "PRESHOOT" },
  { id: "casual", label: "CASUAL" },
  { id: "birthday", label: "BIRTHDAY" },
  { id: "engagement", label: "ENGAGEMENT" },
  { id: "wedding", label: "WEDDING" },
  { id: "promotion", label: "PROMOTION" },
];

/**
 * Robust mock sample data matching the Sanity package schema structure.
 * Serves as an immediate editorial preview before CMS documents are published.
 */
export const MOCK_SAMPLE_PACKAGES: PackageItem[] = [
  // WEDDING
  {
    _id: "mock-wedding-1",
    title: "The Minimalist Keepsake",
    serviceCategory: "wedding",
    description:
      "A focused, unobtrusive documentary collection capturing genuine vows and essential emotion with editorial restraint.",
    deliverables: [
      "8 Hours Consecutive Coverage",
      "Lead Photographer & Cinematographer Duo",
      "350+ Curated Color-Graded High-Res Stills",
      "4-Minute 4K Cinematic Highlight Film",
      "Full Ceremony & Speech Audio Recording",
      "Private Digital Gallery (1 Year Hosting)",
    ],
    price: "Starting at $2,800",
    badge: "ESSENTIAL",
    order: 1,
  },
  {
    _id: "mock-wedding-2",
    title: "The Director's Cut",
    serviceCategory: "wedding",
    description:
      "Our signature multi-perspective cinematic experience, capturing the grandeur, delicate stolen glances, and euphoric celebration.",
    deliverables: [
      "12 Hours Comprehensive Full-Day Coverage",
      "2 Lead Photographers & 2 Cinematographers",
      "4K Drone Aerial Cinematography",
      "8-10 Minute Cinematic Featurette",
      "60-Second Vertical Instagram Teaser",
      "700+ Master-Graded Archival Photographs",
      "Handcrafted 12x12 Fine-Art Linen Album",
    ],
    price: "Starting at $4,600",
    badge: "SIGNATURE",
    order: 2,
  },
  {
    _id: "mock-wedding-3",
    title: "The Sovereign Editorial",
    serviceCategory: "wedding",
    description:
      "A complete multi-day heirloom commission designed for grand destination celebrations requiring uncompromising art direction.",
    deliverables: [
      "Multi-Day Coverage (Rehearsal, Ceremony, Reception)",
      "Full Cinema Crew & 35mm Analog Film Specialist",
      "20-Minute Master Documentary Film",
      "Same-Day Edit Premiere for Reception",
      "1,000+ Master Photographs with Rush 7-Day Sneak Peek",
      "Bespoke Italian Leather Hardcover Monograph",
      "Two Companion Parent Albums Included",
    ],
    price: "Custom Commission",
    badge: "HEIRLOOM",
    order: 3,
  },

  // PRESHOOT
  {
    _id: "mock-preshoot-1",
    title: "The Editorial Prologue",
    serviceCategory: "preshoot",
    description:
      "An intimate fine-art concept session designed to frame your connection against architectural and natural backdrops.",
    deliverables: [
      "4 Hours On-Location Guided Production",
      "Creative Moodboard & Wardrobe Styling Guidance",
      "60 Hand-Graded High-Resolution Stills",
      "Private High-Speed Online Gallery",
      "Print Release for Wedding Invitations",
    ],
    price: "Starting at $1,400",
    badge: "EDITORIAL",
    order: 1,
  },
  {
    _id: "mock-preshoot-2",
    title: "The Director's Vision",
    serviceCategory: "preshoot",
    description:
      "A full-scale cinematic journey combining 35mm analog frames, sweeping aerial optics, and a narrative micro-film.",
    deliverables: [
      "Full Day Destination Exploration",
      "2 Scenic Locations with Sunset Timing",
      "4K Drone Cinematography & Ambient Audio",
      "90-Second Cinematic Teaser Reel",
      "120 Master-Graded Photographs",
      "Archival Fine-Art Keepsake Print Box",
    ],
    price: "Starting at $2,400",
    badge: "SIGNATURE",
    order: 2,
  },

  // CASUAL
  {
    _id: "mock-casual-1",
    title: "The Naturalist Frame",
    serviceCategory: "casual",
    description:
      "Unscripted, organic moments captured in natural ambient light. Perfect for couples, personal branding, or creative lifestyle portraits.",
    deliverables: [
      "2 Hours Natural Light Location Session",
      "1 Curated Urban or Coastal Environment",
      "40 Master-Graded High-Res Stills",
      "Online Proofing & Delivery within 10 Days",
      "High-Resolution Download & Print Rights",
    ],
    price: "Starting at $850",
    badge: "INTIMATE",
    order: 1,
  },
  {
    _id: "mock-casual-2",
    title: "The Lifestyle Monograph",
    serviceCategory: "casual",
    description:
      "A high-fashion casual editorial with deliberate compositional framing and striking contrast tones.",
    deliverables: [
      "4 Hours Multi-Location Coverage",
      "Up to 3 Wardrobe Changes",
      "80 Hand-Graded Editorial Photographs",
      "30-Second Aesthetic Video Snippet for Social",
      "Express 5-Day Delivery of Top 10 Frames",
    ],
    price: "Starting at $1,450",
    badge: "POPULAR",
    order: 2,
  },

  // BIRTHDAY
  {
    _id: "mock-birthday-1",
    title: "The Evening Soirée",
    serviceCategory: "birthday",
    description:
      "Sophisticated event documentation capturing milestone birthdays with red-carpet panache and uninhibited emotion.",
    deliverables: [
      "4 Hours Consecutive Evening Coverage",
      "Red Carpet Arrival & Guest Step-and-Repeat",
      "Candid Party Highlights & Cake Ceremony",
      "150+ Curated Color-Graded High-Res Stills",
      "Next-Day Social Sneak Peek (10 Photos)",
    ],
    price: "Starting at $1,200",
    badge: "CELEBRATION",
    order: 1,
  },
  {
    _id: "mock-birthday-2",
    title: "The Grand Gala Monograph",
    serviceCategory: "birthday",
    description:
      "Premier multi-camera production engineered for large-scale milestone galas, celebrity anniversaries, and luxury ballroom evenings.",
    deliverables: [
      "Up to 8 Hours Comprehensive Gala Coverage",
      "Lead Photographer & 2 4K Cinematographers",
      "4K Highlights Film (3-5 Minutes)",
      "Complete Documentary Edit of Speeches & Toasts",
      "VIP Dedicated Portrait Station",
      "350+ Master-Graded High-Resolution Photographs",
    ],
    price: "Starting at $2,600",
    badge: "PRESTIGE",
    order: 2,
  },

  // ENGAGEMENT
  {
    _id: "mock-engagement-1",
    title: "The Golden Hour Proposal",
    serviceCategory: "engagement",
    description:
      "Secret reconnaissance, undercover positioning, and genuine emotion as the question is asked at golden hour.",
    deliverables: [
      "Pre-Shoot Secret Location Coordination",
      "Discreet Long-Lens Proposal Capture",
      "1-Hour Post-Proposal Sunset Portraiture",
      "50 Master-Graded High-Res Stills",
      "Same-Night Delivery of 5 Key Frames",
    ],
    price: "Starting at $950",
    badge: "PROPOSAL",
    order: 1,
  },
  {
    _id: "mock-engagement-2",
    title: "The Narrative Chapter",
    serviceCategory: "engagement",
    description:
      "A cinematic love letter pairing sweeping landscape cinematography with intimate editorial still photography.",
    deliverables: [
      "Half-Day Narrative Storytelling Session",
      "Moodboard Curation & Cinematic Location Scouting",
      "4K 90-Second Cinematic Teaser with Music License",
      "100 Master-Graded Photographs",
      "Private Digital Vault & Print Consultation",
    ],
    price: "Starting at $1,800",
    badge: "SIGNATURE",
    order: 2,
  },

  // PROMOTION
  {
    _id: "mock-promotion-1",
    title: "The Brand Statement",
    serviceCategory: "promotion",
    description:
      "A high-impact cinematic commercial engineered to elevate brands, fashion houses, luxury architects, and entrepreneurs.",
    deliverables: [
      "1 Production Day (Up to 8 Hours)",
      "4K Ultra-HD Cinema Camera & Prime Lenses",
      "Professional Sound Design & Licensed Master Soundtrack",
      "60-Second Brand Anthem Film",
      "Two 15-Second Vertical Cutdowns for Campaigns",
      "10 High-End Retouched Editorial Stills",
    ],
    price: "Starting at $2,200",
    badge: "COMMERCIAL",
    order: 1,
  },
  {
    _id: "mock-promotion-2",
    title: "The Master Campaign",
    serviceCategory: "promotion",
    description:
      "End-to-end commercial filmmaking for multi-channel product launches, hospitality brandings, and architectural showcases.",
    deliverables: [
      "2 Full Production Days with Dedicated Crew",
      "Director, Gaffer & Sound Recordist",
      "Full 4K Cinema Drone Integration",
      "Main Brand Film (2-3 Minutes) + 4 Micro-Reels",
      "Behind-The-Scenes Monograph Photo Suite (50 Stills)",
      "Full Global Commercial Broadcast License",
    ],
    price: "Starting at $4,500",
    badge: "ENTERPRISE",
    order: 2,
  },
];

export function PackagesPage({ initialPackages = [] }: PackagesPageProps) {
  const [activeTab, setActiveTab] = React.useState<ServiceCategoryId>("wedding");
  const [sanityPackages, setSanityPackages] = React.useState<PackageItem[]>(initialPackages);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const cardsGridRef = React.useRef<HTMLDivElement>(null);

  // Filter packages based on activeTab:
  // If CMS returns data for this tab, use it; otherwise fallback to rich mock data.
  const activePackages = React.useMemo(() => {
    const liveMatches = sanityPackages.filter(
      (p) => p.serviceCategory && p.serviceCategory.toLowerCase() === activeTab.toLowerCase()
    );

    if (liveMatches.length > 0) {
      return liveMatches;
    }

    // Fallback to sample data for the active category
    return MOCK_SAMPLE_PACKAGES.filter(
      (p) => p.serviceCategory && p.serviceCategory.toLowerCase() === activeTab.toLowerCase()
    );
  }, [sanityPackages, activeTab]);

  // Fetch from Sanity when activeTab changes if not already populated
  React.useEffect(() => {
    let isMounted = true;

    async function fetchCategoryPackages() {
      // Check if we already have packages for this category in sanityPackages
      const alreadyHaveCategory = sanityPackages.some(
        (p) => p.serviceCategory && p.serviceCategory.toLowerCase() === activeTab.toLowerCase()
      );

      if (alreadyHaveCategory) return;

      try {
        setIsLoading(true);
        const fetched: PackageItem[] = await client.fetch(PACKAGES_BY_CATEGORY_QUERY, {
          category: activeTab,
        });

        if (isMounted && fetched && fetched.length > 0) {
          setSanityPackages((prev) => {
            const existingIds = new Set(prev.map((p) => p._id));
            const newItems = fetched.filter((p) => !existingIds.has(p._id));
            return [...prev, ...newItems];
          });
        }
      } catch (err) {
        console.warn("Notice: Using curated sample packages for this category.", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCategoryPackages();

    return () => {
      isMounted = false;
    };
  }, [activeTab, sanityPackages]);

  // GSAP animation when switching tabs: clean fade-in and subtle upward glide
  React.useEffect(() => {
    if (!cardsGridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsGridRef.current?.querySelectorAll(".package-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab, activePackages]);

  // Handle switching tabs
  const handleTabChange = (category: ServiceCategoryId) => {
    if (category === activeTab) return;
    setActiveTab(category);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-bg-base text-text-primary selection:bg-text-primary selection:text-bg-base"
    >
      {/* 3. The Editorial Header */}
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

      {/* 4. The Service Selection (Interactive Sticky Tabs) */}
      <nav
        aria-label="Package Categories"
        className="sticky top-16 sm:top-20 z-30 w-full bg-bg-base/95 backdrop-blur-md border-y border-border-subtle py-4 px-6 sm:px-8 lg:px-12 transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleTabChange(cat.id)}
                aria-pressed={isActive}
                className={cn(
                  "relative px-4 sm:px-5 py-2 text-xs font-sans font-bold uppercase tracking-[0.2em] transition-all duration-200 whitespace-nowrap rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-primary",
                  isActive
                    ? "text-[#111111] bg-bg-surface font-black shadow-xs"
                    : "text-[#888888] hover:text-[#111111]"
                )}
              >
                [ {cat.label} ]
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-4 left-4 right-4 h-0.5 bg-text-primary"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 5. The Packages Display (The Details) */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Active Category Monograph Cue */}
          <div className="flex items-center justify-between mb-10 sm:mb-14 pb-4 border-b border-border-subtle">
            <span className="font-sans font-bold text-xs uppercase tracking-[0.25em] text-text-muted">
              SHOWING // {activeTab.toUpperCase()} TIERS
            </span>
            <span className="font-serif italic text-xs sm:text-sm text-text-muted">
              {activePackages.length} {activePackages.length === 1 ? "Option" : "Options"} Available
            </span>
          </div>

          {/* Minimalist Editorial Grid */}
          <div
            ref={cardsGridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12"
          >
            {activePackages.map((pkg, idx) => {
              const tierIndex = String(idx + 1).padStart(2, "0");
              const hasBadge = Boolean(pkg.badge);

              return (
                <article
                  key={pkg._id || `pkg-${idx}`}
                  className="package-card relative border border-border-subtle bg-bg-surface/20 hover:bg-bg-surface/40 p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-text-primary/50 group"
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

                    {/* Investment / Price (if provided) */}
                    {pkg.price && (
                      <p className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-text-primary/90 mt-2">
                        {pkg.price}
                      </p>
                    )}

                    {/* Hairline Divider */}
                    <div className="h-px w-full bg-border-subtle my-6" />

                    {/* Description: Sophisticated Italicized Serif */}
                    <p className="font-serif italic text-base sm:text-lg text-text-primary/80 leading-relaxed">
                      &ldquo;{pkg.description}&rdquo;
                    </p>

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
                            <span className="text-text-primary/90">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Bottom Action: Sleek [ INQUIRE NOW ] Button */}
                  <div className="mt-8 sm:mt-10 pt-6 border-t border-border-subtle">
                    <Link
                      href={`/contact?service=${activeTab}&package=${encodeURIComponent(
                        pkg.title || ""
                      )}`}
                      className="w-full py-4 px-6 text-xs font-sans font-bold uppercase tracking-[0.2em] border border-text-primary text-text-primary bg-transparent hover:bg-text-primary hover:text-bg-base transition-colors duration-200 flex items-center justify-center gap-2 group-hover:bg-text-primary group-hover:text-bg-base cursor-pointer"
                    >
                      <span>[ INQUIRE NOW ]</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
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
