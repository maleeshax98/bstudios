"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface BTSImage {
  id: string;
  figure: string;
  caption: string;
  src: string;
  alt: string;
  aspectRatio: string;
  alignment: string;
  parallaxSpeed: number; // custom parallax factor
}

const BTS_IMAGES: BTSImage[] = [
  {
    id: "bts-1",
    figure: "FIG. 01",
    caption: "35MM OPTICS & ANALOG TEXTURE",
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85",
    alt: "Camera gear and 35mm lens setup on location",
    aspectRatio: "aspect-[4/5]",
    alignment: "lg:w-[88%] lg:self-start",
    parallaxSpeed: -14,
  },
  {
    id: "bts-2",
    figure: "FIG. 02",
    caption: "DIRECTOR'S EYE & AMBIENT LIGHT",
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85",
    alt: "Cinematographer on scene framing an editorial composition",
    aspectRatio: "aspect-[3/4]",
    alignment: "lg:w-[84%] lg:self-end lg:-mt-12",
    parallaxSpeed: -22,
  },
  {
    id: "bts-3",
    figure: "FIG. 03",
    caption: "COLOR CHEMISTRY & PRODUCTION SUITE",
    src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=85",
    alt: "Cinematography monitor and post-production color suite",
    aspectRatio: "aspect-[16/10]",
    alignment: "lg:w-[94%] lg:self-center",
    parallaxSpeed: -16,
  },
  {
    id: "bts-4",
    figure: "FIG. 04",
    caption: "FINE-ART MASTERING & ARCHIVAL PRINTS",
    src: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=1200&q=85",
    alt: "Photography studio equipment and bespoke editorial archiving",
    aspectRatio: "aspect-[4/5]",
    alignment: "lg:w-[86%] lg:self-start lg:-mt-10",
    parallaxSpeed: -20,
  },
];

export type AboutDirectorsCutProps = React.HTMLAttributes<HTMLElement>;

export function AboutDirectorsCut({
  className,
  ...props
}: AboutDirectorsCutProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const rightColRef = React.useRef<HTMLDivElement>(null);
  const imageWrappersRef = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const section = sectionRef.current;
    const rightCol = rightColRef.current;
    if (!section || !rightCol) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop layout (>= 1024px): Pin right text column while left images scroll
      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          pin: rightCol,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        // Parallax effect on left column images
        BTS_IMAGES.forEach((item, index) => {
          const wrapper = imageWrappersRef.current[index];
          if (!wrapper) return;
          const img = wrapper.querySelector(".bts-inner-img");
          if (!img) return;

          gsap.fromTo(
            img,
            { yPercent: item.parallaxSpeed * -1 },
            {
              yPercent: item.parallaxSpeed,
              ease: "none",
              scrollTrigger: {
                trigger: wrapper,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      });

      // Mobile / Tablet layout (< 1024px): Gentle scroll reveal for images
      mm.add("(max-width: 1023px)", () => {
        BTS_IMAGES.forEach((_, index) => {
          const wrapper = imageWrappersRef.current[index];
          if (!wrapper) return;

          gsap.fromTo(
            wrapper,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: wrapper,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      });
    }, sectionRef);

    // Refresh triggers after fonts and remote images load
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="directors-cut"
      ref={sectionRef}
      className={cn(
        "relative w-full bg-bg-base text-text-primary px-6 sm:px-12 md:px-16 lg:px-24 py-24 sm:py-32 lg:py-40 select-none",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start relative">
        {/* Left Side: Staggered Parallax Column of Behind-the-Scenes Images */}
        <div className="lg:col-span-7 flex flex-col gap-16 sm:gap-24 lg:gap-36 w-full">
          {/* Mobile Header indicator shown only on small screens before images */}
          <div className="lg:hidden flex items-center gap-3 border-b border-border-subtle pb-3">
            <span className="w-2 h-2 rounded-full bg-accent-primary" />
            <span className="font-sans font-bold text-xs tracking-[0.25em] text-text-muted uppercase">
              {`OUR STORY // 01`}
            </span>
          </div>

          {BTS_IMAGES.map((img, index) => (
            <div
              key={img.id}
              ref={(el) => {
                imageWrappersRef.current[index] = el;
              }}
              className={cn(
                "relative flex flex-col group w-full",
                img.alignment
              )}
            >
              {/* Image Frame with Overflow Hidden for GSAP Inner Parallax */}
              <div
                className={cn(
                  "relative w-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface shadow-2xl",
                  img.aspectRatio
                )}
              >
                <div className="bts-inner-img relative w-full h-[124%] -top-[12%]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Top-Right Figure Badge */}
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-sans font-semibold tracking-widest uppercase">
                  {img.figure}
                </div>

                {/* Subtle Bottom Vignette */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 via-black/20 to-transparent pointer-events-none" />

                {/* Bottom Caption inside frame */}
                <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-5 right-4 z-10 font-sans font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-white/90">
                  {img.caption}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Pinned Text Block Containing Studio Story */}
        <div className="lg:col-span-5 relative w-full">
          <div
            ref={rightColRef}
            className="w-full lg:h-[100dvh] flex flex-col justify-center py-8 lg:py-0"
          >
            {/* Crisp Sans-Serif Section Label */}
            <div className="hidden lg:flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-text-muted/40" />
              <span className="font-sans font-bold text-xs tracking-[0.25em] text-text-muted uppercase">
                {`OUR STORY // 01`}
              </span>
            </div>

            {/* Brutalist Section Title */}
            <h2 className="font-sans font-black uppercase tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] text-text-primary leading-[0.9] mb-8">
              THE DIRECTOR’S
              <br />
              CUT
            </h2>

            {/* Sophisticated Serif Body Paragraphs */}
            <div className="space-y-6 max-w-xl">
              <p className="font-serif italic text-lg sm:text-xl lg:text-[1.35rem] leading-relaxed text-text-primary/90">
                Founded on the belief that visual storytelling transcends simple
                documentation, B studio operates as a boutique creative atelier
                at the intersection of cinema and fine art.
              </p>

              <p className="font-serif italic text-base sm:text-lg lg:text-[1.15rem] leading-relaxed text-text-primary/75">
                Every frame we compose is deliberate. From the delicate play of
                natural shadows to the organic grain of analog medium-format
                film, our approach honors intimacy while commanding editorial
                presence.
              </p>

              <p className="font-serif italic text-base sm:text-lg lg:text-[1.15rem] leading-relaxed text-text-primary/75">
                We work with visionary couples, brands, and artists across the
                globe who crave imagery that feels timeless, poetic, and
                unapologetically cinematic. We do not manufacture moments; we
                illuminate the truth already waiting within them.
              </p>
            </div>

            {/* Editorial Signature & Attributes */}
            <div className="mt-10 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-sans font-bold text-xs tracking-[0.2em] uppercase text-text-primary">
                  BINUKA
                </p>
                <p className="font-serif italic text-xs text-text-muted mt-0.5">
                  Founder & Creative Director
                </p>
              </div>

              <div className="font-sans font-semibold text-[10px] sm:text-xs tracking-widest text-text-muted uppercase">
                {`35MM & 4K CINEMA`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutDirectorsCut;
