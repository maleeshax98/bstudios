"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import type { WEDDING_ALBUMS_QUERY_RESULT } from "@/sanity.types";
import { OptimizedImage } from "@/components/optimized-image";

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

export interface ClientSpaceTeaserProps extends React.HTMLAttributes<HTMLElement> {
  initialAlbums?: WEDDING_ALBUMS_QUERY_RESULT;
}

interface PersonalAlbum {
  id: string;
  galleryId: string;
  client: string;
  shootType: string;
  assetCount: string;
  src: string;
  alt: string;
  slug?: string;
  link?: string;
}

export function ClientSpaceTeaser({
  initialAlbums,
  className,
  ...props
}: ClientSpaceTeaserProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const cardsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const magneticBtnRef = React.useRef<HTMLAnchorElement>(null);

  const albums = React.useMemo<PersonalAlbum[]>(() => {
    if (!initialAlbums || initialAlbums.length === 0) {
      return [];
    }

    return initialAlbums.slice(0, 4).map((album, idx) => {
      const galleryNum = String(idx + 1).padStart(2, "0");
      const countText = album.count
        ? `${album.count} Assets // 4K Master`
        : album.duration
          ? `${album.duration} Film // 4K Master`
          : "300+ Assets // 4K Master";

      const shootType = album.description
        ? album.description.length > 36
          ? `${album.description.slice(0, 36).trim()}...`
          : album.description
        : album.date || "Wedding Collection";

      const slug = album.slug?.current;
      const link = slug ? `/album/${slug}` : "/works";

      return {
        id: album._id,
        galleryId: `GALLERY #${galleryNum}`,
        client: album.title || `Wedding Story #${galleryNum}`,
        shootType,
        assetCount: countText,
        src: cleanImageUrl(album.thumbnail) || "",
        alt: album.alt || album.title || "Client wedding album preview",
        slug,
        link,
      };
    });
  }, [initialAlbums]);

  // GSAP ScrollTrigger album fan out / spread animation
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(
      (c): c is HTMLDivElement => c !== null,
    );

    if (!section || cards.length === 0) return;

    let isMounted = true;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop layout (>= 1024px)
      mm.add("(min-width: 1024px)", () => {
        // Initial stacked deck positioning
        if (cards[0]) {
          gsap.set(cards[0], {
            xPercent: -5,
            yPercent: 4,
            rotation: -4,
            scale: 0.94,
            zIndex: 1,
          });
        }
        if (cards[1]) {
          gsap.set(cards[1], {
            xPercent: 3,
            yPercent: -2,
            rotation: 3,
            scale: 0.96,
            zIndex: 2,
          });
        }
        if (cards[2]) {
          gsap.set(cards[2], {
            xPercent: -2,
            yPercent: 2,
            rotation: -1.5,
            scale: 0.98,
            zIndex: 3,
          });
        }
        if (cards[3]) {
          gsap.set(cards[3], {
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            scale: 1.0,
            zIndex: 4,
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Fan out albums into an overlapping cascading spread
        if (cards[0]) {
          tl.to(
            cards[0],
            {
              xPercent: -88,
              yPercent: 12,
              rotation: -14,
              scale: 0.92,
              ease: "power2.out",
            },
            0,
          );
        }
        if (cards[1]) {
          tl.to(
            cards[1],
            {
              xPercent: -28,
              yPercent: -6,
              rotation: -5,
              scale: 0.96,
              ease: "power2.out",
            },
            0,
          );
        }
        if (cards[2]) {
          tl.to(
            cards[2],
            {
              xPercent: 28,
              yPercent: 6,
              rotation: 5,
              scale: 0.98,
              ease: "power2.out",
            },
            0,
          );
        }
        if (cards[3]) {
          tl.to(
            cards[3],
            {
              xPercent: 88,
              yPercent: -12,
              rotation: 14,
              scale: 1.0,
              ease: "power2.out",
            },
            0,
          );
        }
      });

      // Mobile & Tablet layout (< 1024px)
      mm.add("(max-width: 1023px)", () => {
        // Subtle stack setup fitting narrower viewport
        if (cards[0]) {
          gsap.set(cards[0], {
            xPercent: -3,
            yPercent: 3,
            rotation: -3,
            scale: 0.92,
            zIndex: 1,
          });
        }
        if (cards[1]) {
          gsap.set(cards[1], {
            xPercent: 2,
            yPercent: -2,
            rotation: 2,
            scale: 0.95,
            zIndex: 2,
          });
        }
        if (cards[2]) {
          gsap.set(cards[2], {
            xPercent: -1,
            yPercent: 1,
            rotation: -1,
            scale: 0.98,
            zIndex: 3,
          });
        }
        if (cards[3]) {
          gsap.set(cards[3], {
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            scale: 1.0,
            zIndex: 4,
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=90%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        if (cards[0]) {
          tl.to(
            cards[0],
            {
              xPercent: -42,
              yPercent: -10,
              rotation: -10,
              scale: 0.88,
              ease: "power2.out",
            },
            0,
          );
        }
        if (cards[1]) {
          tl.to(
            cards[1],
            {
              xPercent: -14,
              yPercent: 4,
              rotation: -3,
              scale: 0.92,
              ease: "power2.out",
            },
            0,
          );
        }
        if (cards[2]) {
          tl.to(
            cards[2],
            {
              xPercent: 14,
              yPercent: -4,
              rotation: 3,
              scale: 0.96,
              ease: "power2.out",
            },
            0,
          );
        }
        if (cards[3]) {
          tl.to(
            cards[3],
            {
              xPercent: 42,
              yPercent: 10,
              rotation: 10,
              scale: 1.0,
              ease: "power2.out",
            },
            0,
          );
        }
      });
    }, section);

    // Refresh calculations once custom web fonts are rendered
    document.fonts?.ready?.then(() => {
      if (isMounted) {
        ScrollTrigger.refresh();
      }
    });

    return () => {
      isMounted = false;
      ctx.revert();
    };
  }, [albums]);

  // Magnetic hover effect on primary CTA button
  const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = magneticBtnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.35;
    const distanceY = (e.clientY - centerY) * 0.35;

    gsap.to(el, {
      x: distanceX,
      y: distanceY,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMagneticLeave = () => {
    const el = magneticBtnRef.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
    });
  };

  // Teardown magnetic tweens on unmount
  React.useEffect(() => {
    const el = magneticBtnRef.current;
    return () => {
      if (el) {
        gsap.killTweensOf(el);
      }
    };
  }, []);

  if (albums.length === 0) {
    return (
      <section
        id="client-space"
        role="region"
        aria-label="Dedicated Client Space"
        className={cn(
          "relative w-full py-24 sm:py-32 bg-bg-base text-text-primary border-t border-border-subtle",
          className,
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <header className="border-b border-border-subtle pb-8 mb-12">
            <h2 className="font-sans font-black uppercase text-4xl sm:text-6xl lg:text-7xl tracking-tighter text-text-primary">
              CLIENT SPACE
            </h2>
          </header>
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
    <div className="relative w-full">
      <section
        ref={sectionRef}
        id="client-space"
        role="region"
        aria-label="Dedicated Client Space"
        className={cn(
          "relative w-full h-[100dvh] min-h-[680px] bg-bg-base text-text-primary overflow-hidden flex items-center select-none",
          className,
        )}
        {...props}
      >
      {/* Background architectural watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden">
        <span className="font-sans font-black text-[28vw] uppercase leading-none whitespace-nowrap tracking-tighter">
          GALLERY
        </span>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Information & CTA */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left z-20">
            <div className="mt-10">
              {/* Massive Brutalist Sans-Serif Headline */}
              <h2 className="font-sans font-black uppercase tracking-tighter leading-[0.88] text-text-primary text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.25rem]">
                YOUR PERSONAL PREMIERE
              </h2>

              {/* Elegant Italicized Serif Description */}
              <p className="font-serif italic text-text-primary/90 text-lg sm:text-xl md:text-2xl leading-relaxed mt-4 sm:mt-6 max-w-xl">
                Every memory, beautifully curated. Access your high-resolution
                digital albums in one dedicated space—designed for private
                viewing or sharing publicly with the world.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-text-primary/10 mt-6 sm:mt-8 max-w-xl">
              <div>
                <span className="font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider text-text-primary block">
                  01 / Gallery
                </span>
                <span className="font-serif italic text-[11px] sm:text-xs text-text-muted mt-0.5 block leading-tight">
                  Public & Private
                </span>
              </div>
              <div>
                <span className="font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider text-text-primary block">
                  02 / Master
                </span>
                <span className="font-serif italic text-[11px] sm:text-xs text-text-muted mt-0.5 block leading-tight">
                  Lossless 4K Files
                </span>
              </div>
              <div>
                <span className="font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider text-text-primary block">
                  03 / Sharing
                </span>
                <span className="font-serif italic text-[11px] sm:text-xs text-text-muted mt-0.5 block leading-tight">
                  One-Click Links
                </span>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 sm:mt-10">
              <Link
                ref={magneticBtnRef}
                href={albums[0]?.link || "/works"}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-text-primary text-bg-base font-sans text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300  hover:shadow-xl active:scale-95 will-change-transform"
              >
                <span>VIEW ALBUM</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {/* <a
                href="#client-login"
                className="group inline-flex items-center gap-2 px-6 py-3.5 sm:py-4 rounded-full border border-border-subtle bg-bg-surface text-text-primary font-sans text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:border-text-primary hover:bg-bg-subtle active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary transition-colors duration-200 stroke-[1.75]" />
                <span>ACCESS GALLERY</span>
              </a> */}
            </div>
          </div>

          {/* Right Column: The Album Spread Animation Stage */}
          <div className="lg:col-span-7 flex items-center justify-center relative w-full h-[360px] sm:h-[450px] md:h-[500px] lg:h-[560px] perspective-[1000px]">
            <div className="relative w-full h-full flex items-center justify-center">
              {albums.map((album, index) => (
                <div
                  key={album.id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className="group absolute w-[190px] sm:w-[240px] md:w-[280px] lg:w-[310px] aspect-[3/4] rounded-2xl overflow-hidden border border-border-subtle bg-bg-surface shadow-[0_20px_50px_rgba(0,0,0,0.12)] will-change-transform transition-shadow duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)]"
                >
                  <Link
                    href={album.link || "/works"}
                    className="block relative w-full h-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary rounded-2xl"
                    aria-label={`View ${album.client} album`}
                  >
                    {/* High Quality Cinematic Image via OptimizedImage */}
                    <OptimizedImage
                      src={album.src}
                      alt={album.alt}
                      fill
                      sizes="(max-width: 640px) 190px, (max-width: 1024px) 280px, 310px"
                      priority={index === 3}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Top Vault Pill Badge */}
                    <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
                      <span className="font-sans text-[9px] sm:text-[10px] font-bold tracking-widest uppercase bg-bg-base/90 backdrop-blur-md px-2.5 py-1 rounded-full text-text-primary border border-black/5 shadow-sm">
                        {album.galleryId}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-bg-base/90 backdrop-blur-md flex items-center justify-center border border-black/5 shadow-sm">
                        <Share2 className="w-3 h-3 text-text-primary stroke-[1.75]" />
                      </div>
                    </div>

                    {/* Bottom Metadata Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white z-10 pointer-events-none">
                      <p className="font-serif italic text-base sm:text-lg text-white font-normal leading-tight">
                        {album.client}
                      </p>
                      <p className="font-sans text-[10px] sm:text-[11px] tracking-wider uppercase text-white/80 mt-1">
                        {album.shootType}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15 text-[9px] tracking-widest uppercase text-white/60">
                        <span>{album.assetCount}</span>
                        <span className="font-mono text-[9px]">4K HDR</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
}

export default ClientSpaceTeaser;
