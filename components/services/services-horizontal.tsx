"use client";

import * as React from "react";
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
          imageSrc: cleaned || "",
          imageAlt: `${doc.title || "Service"} - ${doc.subTitle || "B'STUDIO"}`,
          galleryHref: "/works",
        };
      });
    }
    return [];
  }, [initialServices]);

  React.useEffect(() => {
    const section = sectionRef.current;
    const panels = panelsRef.current.filter(
      (p): p is HTMLDivElement => p !== null,
    );

    if (!section || !panels.length || services.length === 0) return;

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

  if (services.length === 0) {
    return (
      <section
        id="services"
        className={cn(
          "relative w-full bg-bg-base overflow-hidden select-none py-24 sm:py-32",
          className,
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="min-h-[35vh] flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-subtle rounded-3xl bg-bg-surface/30">
            <p className="font-serif italic text-2xl sm:text-3xl text-text-primary">
              No data to load
            </p>
          </div>
        </div>
      </section>
    );
  }

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
