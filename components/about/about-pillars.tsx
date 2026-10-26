"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface Pillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}

const PILLARS: Pillar[] = [
  {
    number: "01.",
    title: "Authentic Presence",
    subtitle: "Unscripted Intimacy & Natural Cadence",
    description:
      "We strip away manufactured poses in favor of authentic human emotion. Our presence behind the lens is quiet, unobtrusive, and receptive, capturing fleeting gestures and unguarded glances that feel genuine and alive.",
    tags: ["Discreet Direction", "Spontaneous Emotion", "Unguarded Moments"],
  },
  {
    number: "02.",
    title: "Editorial Lighting",
    subtitle: "Chiaroscuro & Sculpted Luminescence",
    description:
      "Light is our primary medium. We balance dramatic natural illumination with delicate directional shaping, sculpting subjects with depth, mood, and the dimensional texture of classic cinema.",
    tags: ["Available Light Mastery", "Shadow Separation", "Atmospheric Depth"],
  },
  {
    number: "03.",
    title: "Cinematic Grading",
    subtitle: "Bespoke Color Chemistry & Analog Warmth",
    description:
      "Color is memory. Every image and film sequence undergoes meticulous in-house color grading, inspired by 35mm film stocks, rich shadow depth, and timeless tonal restraint.",
    tags: ["35mm Film Stocks", "In-House LUT Chemistry", "Timeless Contrast"],
  },
];

export type AboutPillarsProps = React.HTMLAttributes<HTMLElement>;

export function AboutPillars({ className, ...props }: AboutPillarsProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const pillarRowsRef = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header reveal on scroll
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: header,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Smooth fade-in and upward translation tied to scroll speed (scrub)
      pillarRowsRef.current.forEach((row) => {
        if (!row) return;

        gsap.fromTo(
          row,
          {
            opacity: 0,
            y: 70,
          },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              end: "top 55%",
              scrub: 1,
            },
          }
        );
      });
    }, sectionRef);

    // Refresh after fonts load
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="core-pillars"
      ref={sectionRef}
      className={cn(
        "relative w-full bg-bg-base text-text-primary px-6 sm:px-12 md:px-16 lg:px-24 py-24 sm:py-32 lg:py-40 select-none overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-text-muted/40" />
            <span className="font-sans font-bold text-xs tracking-[0.25em] text-text-muted uppercase">
              {`THE APPROACH // 02`}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
            <div className="lg:col-span-7">
              <h2 className="font-sans font-black uppercase tracking-tighter text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-text-primary leading-[0.88]">
                CORE PILLARS
              </h2>
            </div>

            <div className="lg:col-span-5">
              <p className="font-serif italic text-lg sm:text-xl lg:text-2xl text-text-primary/75 max-w-lg leading-relaxed">
                Three inviolable tenets that govern every composition, color
                grade, and shutter actuation.
              </p>
            </div>
          </div>
        </div>

        {/* Minimalist Staggered Reveal List of 3 Pillars */}
        <div className="border-b border-border-subtle">
          {PILLARS.map((pillar, index) => (
            <div
              key={pillar.number}
              ref={(el) => {
                pillarRowsRef.current[index] = el;
              }}
              className="group relative border-t border-border-subtle py-12 sm:py-16 lg:py-20 transition-colors duration-500 hover:bg-bg-surface/40 -mx-6 sm:-mx-12 md:-mx-16 lg:-mx-24 px-6 sm:px-12 md:px-16 lg:px-24"
            >
              <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                {/* Pillar Number */}
                <div className="lg:col-span-2 flex items-baseline justify-between lg:justify-start gap-4">
                  <span className="font-serif italic font-light text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-text-muted/50 group-hover:text-text-primary transition-colors duration-300">
                    {pillar.number}
                  </span>

                  <ArrowUpRight className="lg:hidden w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors duration-300" />
                </div>

                {/* Pillar Title & Subtitle */}
                <div className="lg:col-span-5">
                  <h3 className="font-sans font-black uppercase tracking-tight text-3xl sm:text-4xl lg:text-[2.75rem] text-text-primary leading-[0.95]">
                    {pillar.title}
                  </h3>
                  <p className="font-serif italic text-base sm:text-lg text-text-muted mt-2 sm:mt-3">
                    {pillar.subtitle}
                  </p>
                </div>

                {/* Pillar Description & Tags */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
                  <p className="font-serif italic text-base sm:text-lg lg:text-xl text-text-primary/80 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Editorial Tag Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {pillar.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-sans font-semibold text-[10px] sm:text-xs tracking-wider uppercase px-3 py-1 rounded-full border border-border-subtle bg-bg-base/80 text-text-muted group-hover:border-text-primary/20 group-hover:text-text-primary transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutPillars;
