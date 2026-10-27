"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SERVICES_QUERY_RESULT } from "@/sanity.types";
import OptimizedImage from "../optimized-image";

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

export interface ServicePanel {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  galleryHref: string;
}

const SERVICES: ServicePanel[] = [
  {
    id: "preshoot",
    number: "01.",
    title: "Preshoot",
    subtitle: "Intimate Prelude",
    description:
      "An intimate editorial prelude capturing raw chemistry and quiet anticipation before the grand celebration. We frame the tenderness of your romance in timeless, cinematic light.",
    imageSrc:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Intimate couple preshoot in soft editorial lighting",
    galleryHref: "/#work",
  },
  {
    id: "casual-shoot",
    number: "02.",
    title: "Casual Shoot",
    subtitle: "Authentic & Editorial",
    description:
      "Authentic, unposed portraiture celebrating natural daylight and effortless contemporary presence. Every frame documents your personality with high-fashion ease and poise.",
    imageSrc:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Natural daylight casual editorial portrait",
    galleryHref: "/#work",
  },
  {
    id: "birthday-shoot",
    number: "03.",
    title: "Birthday Shoot",
    subtitle: "Milestone Celebration",
    description:
      "Bespoke milestone celebrations immortalized with modern glamour and editorial distinction. We turn personal anniversaries into magazine-grade visual archives.",
    imageSrc:
      "https://images.unsplash.com/photo-1530103862676-de389d80ba24?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Elegant celebration and birthday glamour photography",
    galleryHref: "/#work",
  },
  {
    id: "engagement-shoot",
    number: "04.",
    title: "Engagement Shoot",
    subtitle: "Timeless Romance",
    description:
      "Intimate promises and tender visual narratives chronicling the beginning of your forever. From sweeping golden hour landscapes to quiet embraces, each composition is pure poetry.",
    imageSrc:
      "https://images.unsplash.com/photo-1518131558231-15a01bc1e345?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Romantic engagement couple portrait outdoors",
    galleryHref: "/#work",
  },
  {
    id: "wedding-shoot",
    number: "05.",
    title: "Wedding Shoot",
    subtitle: "Documentary Elegance",
    description:
      "Bespoke documentary and fine-art coverage preserving the grandeur, laughter, and sacred vows of your wedding day. We craft heirloom visual treasures destined to endure generations.",
    imageSrc:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "High-end wedding couple ceremony and documentary coverage",
    galleryHref: "/#work",
  },
  {
    id: "promotion-video",
    number: "06.",
    title: "Promotion Video",
    subtitle: "Cinematic Branding",
    description:
      "High-impact commercial narratives and bespoke brand showreels engineered to articulate your vision. Masterful 4K film color grading, immersive soundscapes, and visionary direction.",
    imageSrc:
      "https://images.unsplash.com/photo-1551817958-20204d6ab212?auto=format&fit=crop&w=1600&q=85",
    imageAlt:
      "Commercial videography and narrative video production camera setup",
    galleryHref: "/#work",
  },
];

export type ServicesVerticalProps = React.HTMLAttributes<HTMLElement> & {
  initialServices?: SERVICES_QUERY_RESULT;
};

export function ServicesVertical({
  initialServices,
  className,
  ...props
}: ServicesVerticalProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const panelsRef = React.useRef<(HTMLDivElement | null)[]>([]);

  const services = React.useMemo<ServicePanel[]>(() => {
    if (initialServices && initialServices.length > 0) {
      return initialServices.map((doc, index) => {
        const num = String(index + 1).padStart(2, "0");
        const cleaned = cleanImageUrl(doc.image);
        return {
          id: doc._id || doc.slug?.current || `service-${index}`,
          number: `${num}.`,
          title: doc.title || "Untitled Service",
          subtitle: doc.subTitle || "Cinematic Offering",
          description: doc.description || "",
          imageSrc:
            cleaned ||
            "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1600&q=85",
          imageAlt: `${doc.title || "Service"} - ${doc.subTitle || "B studio"}`,
          galleryHref: "/works",
        };
      });
    }
    return SERVICES;
  }, [initialServices]);

  React.useEffect(() => {
    const section = sectionRef.current;
    const panels = panelsRef.current.filter(
      (p): p is HTMLDivElement => p !== null,
    );

    if (!section || !panels.length) return;

    const ctx = gsap.context(() => {
      panels.forEach((panel) => {
        const textBlock = panel.querySelector(".service-text");
        const imageBlock = panel.querySelector(".service-image");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 80%", // Reveal when the top of the panel hits 80% of the viewport height
            toggleActions: "play none none reverse",
          },
        });

        // Staggered reveal for text and image
        tl.fromTo(
          textBlock,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        ).fromTo(
          imageBlock,
          { opacity: 0, y: 60, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" },
          "-=0.9", // Overlap the animations
        );
      });
    }, sectionRef);

    // Refresh ScrollTrigger after web fonts and images load
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => ctx.revert();
  }, [services]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className={cn(
        "relative w-full bg-bg-base overflow-hidden select-none py-24 sm:py-32 lg:py-48",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col w-full gap-32 sm:gap-40 lg:gap-56">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={service.id}
              ref={(el) => {
                panelsRef.current[index] = el;
              }}
              className="w-full relative px-6 sm:px-12 md:px-16 lg:px-24"
            >
              {/* Massive Elegant Background Serif Number (01. to 06.) centered horizontally */}
              <div
                aria-hidden="true"
                className="font-serif italic font-light text-[26vw] sm:text-[30vw] md:text-[34vw] lg:text-[28vw] text-text-muted/15 select-none pointer-events-none absolute top-1/2 -translate-y-1/2 left-0 right-0 text-center leading-none tracking-tighter z-0"
              >
                {service.number}
              </div>

              {/* Panel Foreground Content Container */}
              <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-20 items-center relative z-10">
                {/* Text Content Block */}
                <div
                  className={cn(
                    "service-text lg:col-span-7 flex flex-col justify-center",
                    isEven ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  {/* Category Index & Subtitle */}
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <span className="w-8 h-[1px] bg-text-muted/40" />
                    <span className="font-sans font-bold text-xs sm:text-sm tracking-[0.25em] text-text-muted uppercase">
                      {service.subtitle}
                    </span>
                  </div>

                  {/* Overlapping Bold Sans-Serif Service Name */}
                  <h2 className="font-sans font-black uppercase tracking-tighter text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.75rem] text-text-primary leading-[0.88] drop-shadow-sm">
                    {service.title}
                  </h2>

                  {/* 2-Sentence Sophisticated Description */}
                  <p className="font-serif italic text-base sm:text-lg md:text-xl lg:text-2xl text-text-primary/75 max-w-xl leading-relaxed mt-4 sm:mt-6">
                    {service.description}
                  </p>

                  {/* Sleek [ View Gallery ] Button */}
                  <div className="mt-6 sm:mt-8 pt-2">
                    <Link
                      href={service.galleryHref}
                      className="group/btn inline-flex items-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full border border-text-primary/25 bg-bg-base/90 text-text-primary hover:bg-text-primary hover:text-bg-base transition-all duration-300 font-sans text-xs sm:text-sm uppercase tracking-widest font-semibold cursor-pointer shadow-sm hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                    >
                      <span>View Gallery</span>
                      <ArrowUpRight className="w-4 h-4 stroke-[2.25] transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Asymmetrical Floating Cinematic Image */}
                <div
                  className={cn(
                    "service-image lg:col-span-5 flex justify-center",
                    isEven ? "lg:order-2" : "lg:order-1",
                  )}
                >
                  <div
                    className={cn(
                      "relative w-full max-w-sm md:max-w-md lg:max-w-lg aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-black/10 group transition-transform duration-500",
                      isEven
                        ? "rotate-[-1deg] translate-y-2 lg:translate-x-4"
                        : "rotate-[1deg] -translate-y-2 lg:-translate-x-4",
                    )}
                  >
                    {/* <Image
                      src={service.imageSrc}
                      alt={service.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={index === 0}
                    /> */}

                    <OptimizedImage
                      src={service.imageSrc}
                      alt={service.imageAlt}
                      format="auto"
                      quality="auto"
                      loading="eager"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={index === 0}
                    />

                    {/* Subtle Corner Archive Badge */}
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-sans tracking-widest uppercase font-semibold">
                      {`${service.number} // ARCHIVE`}
                    </div>

                    {/* Subtle Bottom Vignette */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />

                    <div className="absolute bottom-4 left-4 z-20 font-serif italic text-white/90 text-sm">
                      {service.title}
                    </div>
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
