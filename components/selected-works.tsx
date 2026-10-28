"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FEATURED_ALBUMS_QUERY_RESULT } from "@/sanity.types";
import OptimizedImage from "./optimized-image";

// Register ScrollTrigger plugin safely for client-side environments
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function cleanImageUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  const match = trimmed.match(
    /^(https?:\/\/[^\s]+?\.(?:jpg|jpeg|png|webp|avif|gif))([a-zA-Z\s].*)$/i,
  );
  if (match) {
    return match[1];
  }
  return trimmed;
}

function extractYear(
  dateStr?: string | null,
  publishedAt?: string | null,
): string {
  if (dateStr) {
    const yearMatch = dateStr.match(/\b(20\d\d|19\d\d)\b/);
    if (yearMatch) return yearMatch[1];
  }
  if (publishedAt) {
    try {
      return new Date(publishedAt).getFullYear().toString();
    } catch {
      // fallback
    }
  }
  return "2026";
}

export interface SelectedProject {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  link: string;
}

export const SELECTED_PROJECTS: SelectedProject[] = [
  {
    id: "noir-silhouette",
    index: "01",
    title: "Noir Silhouette",
    category: "Fashion Editorial & 35mm Film",
    year: "2025",
    description:
      "A monochrome study in contrast and fluid motion, sculpted through harsh shadows and authentic analog film grain.",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=75",
    link: "#noir-silhouette",
  },
  {
    id: "solitude-in-form",
    index: "02",
    title: "Solitude In Form",
    category: "Brutalist Architecture & Direction",
    year: "2025",
    description:
      "Geometric stillness and raw concrete textures captured under sharp midday sun, celebrating architectural serenity.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75",
    link: "#solitude-in-form",
  },
  {
    id: "velvet-dusk",
    index: "03",
    title: "Velvet Dusk",
    category: "Cinematography & Narrative Stills",
    year: "2024",
    description:
      "Atmospheric twilight vignettes bathed in warm amber tones, capturing unscripted moments through anamorphic lenses.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=75",
    link: "#velvet-dusk",
  },
  {
    id: "sculpted-horizon",
    index: "04",
    title: "Sculpted Horizon",
    category: "Fine Art & Landscape Installation",
    year: "2024",
    description:
      "An exploration of elemental coastal formations, drifting tides, and the sculptural power of shifting coastal light.",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=75",
    link: "#sculpted-horizon",
  },
  {
    id: "chromatic-pulse",
    index: "05",
    title: "Chromatic Pulse",
    category: "Avant-Garde Runway & Showreel",
    year: "2026",
    description:
      "High-voltage haute couture illuminated by surgical beam lighting, blending dynamic choreography with editorial poise.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=75",
    link: "#chromatic-pulse",
  },
];

export type SelectedWorksProps = React.HTMLAttributes<HTMLElement> & {
  initialWorks?: FEATURED_ALBUMS_QUERY_RESULT;
};

export function SelectedWorks({
  initialWorks,
  className,
  ...props
}: SelectedWorksProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const introTitleRef = React.useRef<HTMLDivElement>(null);
  const slideRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const projects = React.useMemo<SelectedProject[]>(() => {
    if (initialWorks && initialWorks.length > 0) {
      return initialWorks.map((doc, idx) => {
        const num = String(idx + 1).padStart(2, "0");
        const cleanedImage = cleanImageUrl(doc.thumbnail);
        const year = extractYear(doc.date, doc.publishedAt);
        const slug = doc.slug?.current;
        return {
          id: doc._id || slug || `featured-${idx}`,
          index: num,
          title: doc.title || "Untitled Project",
          category: doc.category?.title || "Editorial",
          year,
          description: doc.description || "",
          image:
            cleanedImage ||
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=75",
          link: slug ? `/album/${slug}` : `#${doc._id}`,
        };
      });
    }
    return SELECTED_PROJECTS;
  }, [initialWorks]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || projects.length === 0) return;

    slideRefs.current = slideRefs.current.slice(0, projects.length);
    textRefs.current = textRefs.current.slice(0, projects.length);
    imageRefs.current = imageRefs.current.slice(0, projects.length);

    const ctx = gsap.context(() => {
      // 1. Initial deterministic setup for all slides:
      projects.forEach((_, idx) => {
        const slide = slideRefs.current[idx];
        const textEl = textRefs.current[idx];
        const imgEl = imageRefs.current[idx];

        if (!slide || !textEl || !imgEl) return;

        gsap.set(slide, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(textEl, {
          scale: 1,
          opacity: 0,
        });
        gsap.set(imgEl, {
          scale: 1,
          opacity: 0,
        });
      });

      // 2. Master timeline pinned to viewport with scrub smoothing (scrub: 1.2)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${window.innerHeight * (projects.length + 1)}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 3. Full-Screen Creative Intro Title: "ARCHIVE" fades in, holds, and fades out
      if (introTitleRef.current) {
        gsap.set(introTitleRef.current, { autoAlpha: 1 });

        tl.to(introTitleRef.current, {
          autoAlpha: 1,
          duration: 0.2,
          ease: "power2.out",
        })
          .to({}, { duration: 0.4 }) // Hold to let the user absorb the section
          .to(introTitleRef.current, {
            autoAlpha: 0,
            duration: 0.9,
            ease: "power2.in",
          });
      }

      // 4. Construct sequential alternating center-hold reveal for each project:
      projects.forEach((_, idx) => {
        const slide = slideRefs.current[idx];
        const textEl = textRefs.current[idx];
        const imgEl = imageRefs.current[idx];

        if (!slide || !textEl || !imgEl) return;

        // Phase A: Entry - Image & text glide smoothly into center (xPercent: 0)
        tl.set(slide, {
          autoAlpha: 1,
          pointerEvents: "auto",
        })
          .to(textEl, {
            opacity: 1,
            duration: 1.2,
            ease: "power1.out",
          })
          .to(
            imgEl,
            {
              opacity: 1,
              duration: 1.2,
              ease: "power1.out",
            },
            "<",
          )
          // Phase B: The Hold - Perfect stillness in center for reading & interaction
          .to({}, { duration: 2.0 })
          // Phase C: The Exit - Smoothly scale down and fade to 0
          .to([textEl, imgEl], {
            opacity: 0,
            duration: 1.2,
            ease: "power1.in",
          })
          .set(slide, {
            autoAlpha: 0,
            pointerEvents: "none",
          });
      });
    }, containerRef);

    // Refresh ScrollTrigger calculations after web fonts are completely loaded
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      ctx.revert();
    };
  }, [projects]);

  const totalCountFormatted = String(projects.length).padStart(2, "0");

  return (
    <section
      ref={containerRef}
      id="selected-works"
      aria-label="Selected Works"
      className={cn(
        "relative w-full h-[100dvh] min-h-[640px] overflow-hidden bg-bg-base select-none",
        className,
      )}
      {...props}
    >
      {/* Creative Full-Screen Intro Title filling the screen */}
      <div
        ref={introTitleRef}
        aria-hidden="true"
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none bg-black"
      >
        <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
          <span className="w-2 h-2 rounded-full bg-text-primary/70 inline-block" />
          <span className="font-serif italic text-xs sm:text-sm md:text-base text-text-muted tracking-widest uppercase">
            01 — {totalCountFormatted} / Selected Works
          </span>
        </div>
        <h2 className="font-sans font-black text-[18vw] sm:text-[20vw] md:text-[22vw] uppercase tracking-tighter leading-none text-center text-white">
          ARCHIVE
        </h2>
      </div>

      {/* Centered Gallery Stage for all Projects */}
      <div className="relative w-full h-full ">
        {projects.map((project, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={project.id}
              ref={(el) => {
                slideRefs.current[idx] = el;
              }}
              style={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center  pointer-events-none will-change-transform "
            >
              <div className="w-full max-w-6xl mx-auto flex md:items-center md:justify-center flex-wrap gap-10 p-10">
                {/* Text Block */}
                <div
                  ref={(el) => {
                    textRefs.current[idx] = el;
                  }}
                  className={cn(
                    "flex flex-col justify-center will-change-transform transform-gpu ",
                    isEven ? "md:order-1" : "md:order-2",
                  )}
                >
                  {/* Category / Subtitle Eyebrow */}
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <span className="font-serif italic text-xs sm:text-sm md:text-base text-text-muted">
                      {project.index} — {project.category} ({project.year})
                    </span>
                  </div>

                  {/* Massive Bold Sans-Serif Title */}
                  <h3 className="font-sans font-black text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-tighter leading-[0.92] text-text-primary mb-3 sm:mb-5">
                    {project.title}
                  </h3>

                  {/* Editorial Description */}
                  <p className="font-serif italic sm:font-normal text-text-muted text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mb-6 sm:mb-8">
                    {project.description}
                  </p>

                  {/* View Button */}
                  <div>
                    <Link
                      href={project.link}
                      onClick={(e) => {
                        // Smoothly prevent jump for demo hash link
                        if (project.link.startsWith("#")) {
                          e.preventDefault();
                        }
                      }}
                      className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border border-text-primary/25 bg-transparent text-text-primary font-sans font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:border-text-primary hover:bg-text-primary hover:text-bg-base cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>View Project</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Image Block */}
                <div
                  ref={(el) => {
                    imageRefs.current[idx] = el;
                  }}
                  className={cn(
                    "relative w-full max-w-[600px] h-[400px] overflow-hidden rounded-xs bg-bg-surface border border-black/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] group will-change-transform transform-gpu ",
                    isEven ? "md:order-2" : "md:order-1",
                  )}
                >
                  <OptimizedImage
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={idx === 0}
                    onLoad={() => {
                      if (typeof window !== "undefined") {
                        ScrollTrigger.refresh();
                      }
                    }}
                  />
                  {/* Subtle edge vignette / border ring */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />

                  {/* Minimal Index Corner Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-bg-base/90 backdrop-blur-xs rounded-xs border border-black/10">
                    <span className="font-serif italic text-xs font-semibold text-text-primary">
                      {project.index}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SelectedWorks;
