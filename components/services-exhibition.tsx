"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import type { SERVICES_QUERY_RESULT } from "@/sanity.types";
import OptimizedImage from "./optimized-image";

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

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  index: string;
  src: string;
  alt: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: "preshoot",
    title: "Preshoot",
    subtitle: "Intimate Prelude",
    index: "01",
    src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1600&q=85",
    alt: "Cinematic preshoot photography",
    description:
      "Intimate prelude sessions capturing raw, unscripted chemistry and anticipation before the main event.",
  },
  {
    id: "casual-shoot",
    title: "Casual Shoot",
    subtitle: "Authentic & Editorial",
    index: "02",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85",
    alt: "Laid back casual portrait photography",
    description:
      "Authentic, laid-back moments frozen in time with a natural, high-fashion editorial lens.",
  },
  {
    id: "birthday-shoot",
    title: "Birthday Shoot",
    subtitle: "Milestone Celebration",
    index: "03",
    src: "https://images.unsplash.com/photo-1530103862676-de389d80ba24?auto=format&fit=crop&w=1600&q=85",
    alt: "Elegant birthday celebration photography",
    description:
      "Cinematic celebrations framing your personal milestones with bespoke elegance and style.",
  },
  {
    id: "engagement-shoot",
    title: "Engagement Shoot",
    subtitle: "Timeless Romance",
    index: "04",
    src: "https://images.unsplash.com/photo-1518131558231-15a01bc1e345?auto=format&fit=crop&w=1600&q=85",
    alt: "Romantic engagement photography",
    description:
      "Timeless visual narratives beautifully documenting the beginning of your forever.",
  },
  {
    id: "wedding-shoot",
    title: "Wedding Shoot",
    subtitle: "Documentary Elegance",
    index: "05",
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=85",
    alt: "High-end wedding photography",
    description:
      "Bespoke documentary and editorial coverage of your most unforgettable day.",
  },
  {
    id: "promotion-video",
    title: "Promotion Video",
    subtitle: "Cinematic Branding",
    index: "06",
    src: "https://images.unsplash.com/photo-1551817958-20204d6ab212?auto=format&fit=crop&w=1600&q=85",
    alt: "Professional promotional videography production",
    description:
      "High-impact, cinematic brand storytelling engineered to elevate your commercial vision.",
  },
];

export type ServicesExhibitionProps = React.HTMLAttributes<HTMLElement> & {
  initialServices?: SERVICES_QUERY_RESULT;
};

export function ServicesExhibition({
  initialServices,
  className,
  ...props
}: ServicesExhibitionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const magneticButtonRef = React.useRef<HTMLDivElement>(null);

  const services = React.useMemo<ServiceItem[]>(() => {
    if (initialServices && initialServices.length > 0) {
      return initialServices.map((doc, index) => {
        const num = String(index + 1).padStart(2, "0");
        const cleaned = cleanImageUrl(doc.image);
        return {
          id: doc._id || doc.slug?.current || `service-${index}`,
          title: doc.title || "Untitled Service",
          subtitle: doc.subTitle || "Cinematic Offering",
          index: num,
          src:
            cleaned ||
            "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1600&q=85",
          alt: `${doc.title || "Service"} - ${doc.subTitle || "B studio"}`,
          description: doc.description || "",
        };
      });
    }
    return SERVICES;
  }, [initialServices]);

  const totalCountFormatted = String(services.length).padStart(2, "0");

  const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = magneticButtonRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.35;
    const distanceY = (e.clientY - centerY) * 0.35;

    gsap.to(el, {
      x: distanceX,
      y: distanceY,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleMagneticLeave = () => {
    const el = magneticButtonRef.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  React.useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const magneticBtn = magneticButtonRef.current;

    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getScrollDistance = () => {
        return Math.max(0, track.scrollWidth - window.innerWidth);
      };

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      ctx.revert();
      if (magneticBtn) {
        gsap.killTweensOf(magneticBtn);
      }
    };
  }, [services]);

  return (
    <section
      ref={sectionRef}
      id="services-exhibition"
      aria-label="Core Services Exhibition"
      className={cn(
        "relative w-full h-[100dvh] overflow-hidden bg-bg-base select-none border-t border-border-subtle",
        className,
      )}
      {...props}
    >
      {/* Horizontal Scrolling Track */}
      <div
        ref={trackRef}
        className="flex h-full items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 px-8 sm:px-14 md:px-20 lg:px-24 w-max will-change-transform"
      >
        {/* Intro Section Headline Card */}
        <div className="w-[38vw] sm:w-[32vw] lg:w-[28vw] max-w-[460px] shrink-0 flex flex-col justify-center pr-4">
          {/* <div className="mb-4 sm:mb-6 flex items-center gap-3 text-xs sm:text-sm font-sans font-bold tracking-[0.25em] text-text-muted uppercase">
            <span className="w-8 h-[1px] bg-text-muted/40" />
            <span>{`Services // 01 — ${totalCountFormatted}`}</span>
          </div> */}

          <h2 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-text-primary uppercase leading-[0.92]">
            Service{" "}
            <span className="font-serif italic font-normal lowercase tracking-normal text-text-muted">
              offerings
            </span>
          </h2>

          <p className="font-serif italic text-base sm:text-lg text-text-muted mt-6 leading-relaxed">
            Bespoke photography and videography packages engineered to capture
            authentic moments with editorial elegance.
          </p>

          <div className="mt-8 flex items-center gap-2 text-xs font-sans font-bold tracking-[0.2em] text-text-primary/60 uppercase">
            <span>Keep Scrolling</span>
            <span className="animate-pulse">⬇</span>
          </div>
        </div>

        {/* Oversized Gallery Cards (60-80% Viewport Width) */}
        {services.map((service, index) => (
          <div
            key={service.id}
            className="w-[78vw] sm:w-[72vw] lg:w-[68vw] max-w-[1100px] shrink-0 h-[68vh] sm:h-[72vh] md:h-[76vh] flex flex-col relative"
          >
            <div className="group relative w-full h-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface shadow-xs transition-all duration-500 hover:border-text-primary/30 hover:shadow-xl">
              {/* Massive Image Container with Smooth Scale-Up on Hover */}
              {/* <Image
                src={service.src}
                alt={service.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 80vw, 68vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              /> */}

              <OptimizedImage
                src={service.src}
                alt={service.alt}
                format="auto"
                quality="auto"
                loading="eager"
                fill
                sizes="(max-width: 1024px) 80vw, 68vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Top-Right Index Pill Badge */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
                <span className="font-sans text-[11px] sm:text-xs font-bold tracking-widest text-text-primary bg-bg-base/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border-subtle shadow-xs">
                  {`${service.index} / ${totalCountFormatted}`}
                </span>
              </div>

              {/* Bottom Elegant Overlay with Theme Name and Tonal Description */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-t from-bg-base/95 via-bg-base/80 to-transparent flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.25em] text-text-muted uppercase block mb-1.5">
                    {service.subtitle}
                  </span>
                  <h3 className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight">
                    {service.title}
                  </h3>
                </div>

                <p className="font-sans text-xs sm:text-sm text-text-primary/75 max-w-sm sm:text-right leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Terminal Call to Action Panel: Centered Magnetic "WORK WITH US" Button */}
        <div className="w-[60vw] sm:w-[50vw] lg:w-[42vw] max-w-[650px] shrink-0 h-[68vh] sm:h-[72vh] md:h-[76vh] flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-border-subtle rounded-2xl bg-bg-surface/50">
          <span className="font-sans text-xs font-bold tracking-[0.25em] text-text-muted uppercase block mb-4">
            Booking & Availability
          </span>

          <h3 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-text-primary leading-tight">
            Ready to Shoot?
          </h3>

          <p className="font-serif italic text-base sm:text-lg text-text-muted max-w-md mt-4 mb-10 leading-relaxed">
            Available worldwide to document your most unforgettable moments with
            cinematic precision.
          </p>

          <div
            className="p-4 cursor-pointer"
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
          >
            <div ref={magneticButtonRef}>
              <Link
                href="#contact"
                className={cn(
                  "group/btn relative inline-flex items-center gap-4 rounded-full",
                  "border border-text-primary bg-text-primary px-10 py-5 sm:px-14 sm:py-6",
                  "text-xs sm:text-sm md:text-base font-sans font-black uppercase tracking-[0.25em] text-bg-base",
                  "shadow-xl transition-all duration-300",
                  "hover:border-text-primary hover:bg-bg-base hover:text-text-primary hover:shadow-2xl hover:scale-[1.03]",
                )}
              >
                <span>BOOK A SESSION</span>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
