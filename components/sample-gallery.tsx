"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface SampleGalleryItem {
  id: string;
  src: string;
  alt: string;
  aspectRatio: string;
  title: string;
  category: string;
}

const SAMPLE_IMAGES: SampleGalleryItem[] = [
  {
    id: "sample-1",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
    alt: "Cinematic portrait editorial",
    aspectRatio: "aspect-[3/4]",
    title: "Aura of Grace",
    category: "Fashion Editorial",
  },
  {
    id: "sample-2",
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85",
    alt: "Misty mountain cinematographic frame",
    aspectRatio: "aspect-[16/10]",
    title: "Echoes of Dawn",
    category: "Cinematography",
  },
  {
    id: "sample-3",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    alt: "Pre-wedding golden hour portrait",
    aspectRatio: "aspect-[4/5]",
    title: "Golden Vows",
    category: "Wedding",
  },
  {
    id: "sample-4",
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
    alt: "Monochrome editorial silhouette",
    aspectRatio: "aspect-[2/3]",
    title: "Shadow Contour",
    category: "Fine Art",
  },
  {
    id: "sample-5",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    alt: "Brutalist architecture light study",
    aspectRatio: "aspect-[4/3]",
    title: "Concrete Form",
    category: "Architecture",
  },
  {
    id: "sample-6",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85",
    alt: "Milestone celebration portrait",
    aspectRatio: "aspect-[1/1]",
    title: "Velvet Light",
    category: "Milestone",
  },
  {
    id: "sample-7",
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
    alt: "Intimate couple portrait",
    aspectRatio: "aspect-[3/4]",
    title: "Quiet Devotion",
    category: "Engagement",
  },
  {
    id: "sample-8",
    src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85",
    alt: "Grand wedding celebration",
    aspectRatio: "aspect-[16/9]",
    title: "Heirloom Hall",
    category: "Ceremony",
  },
  {
    id: "sample-9",
    src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
    alt: "Bespoke styling detail",
    aspectRatio: "aspect-[4/5]",
    title: "Sartorial Texture",
    category: "Editorial Detail",
  },
  {
    id: "sample-10",
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85",
    alt: "Atmospheric street cinematography",
    aspectRatio: "aspect-[3/2]",
    title: "Nocturne Rain",
    category: "Street / Noir",
  },
  {
    id: "sample-11",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85",
    alt: "Modern studio aesthetic portrait",
    aspectRatio: "aspect-[3/4]",
    title: "Luminous Stare",
    category: "Studio Portrait",
  },
  {
    id: "sample-12",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    alt: "Expansive twilight landscape",
    aspectRatio: "aspect-[16/10]",
    title: "Infinite Ridge",
    category: "Landscape",
  },
];

export type SampleGalleryProps = React.HTMLAttributes<HTMLElement>;

export function SampleGallery({ className, ...props }: SampleGalleryProps) {
  const magneticButtonRef = React.useRef<HTMLDivElement>(null);

  // Magnetic button cursor interaction
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
    const el = magneticButtonRef.current;
    return () => {
      if (el) {
        gsap.killTweensOf(el);
      }
    };
  }, []);

  return (
    <section
      className={cn(
        "relative w-full bg-bg-base overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 pt-8 pb-32 sm:pb-40 md:pb-48 select-none",
        className
      )}
      {...props}
    >
      {/* Masonry-Style Pinterest Grid (CSS Columns) */}
      <div className="mx-auto max-w-[1700px]">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6">
          {SAMPLE_IMAGES.map((item) => (
            <div
              key={item.id}
              className="group relative mb-4 sm:mb-6 break-inside-avoid overflow-hidden rounded-xl border border-border-subtle bg-bg-surface transition-all duration-500 hover:border-text-primary/25 hover:shadow-lg"
            >
              <div className={cn("relative w-full overflow-hidden", item.aspectRatio)}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Teaser Overlay */}
      {/* Fades from transparent at top to solid Off-White (#F7F7F5) at the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 sm:h-80 md:h-[420px] lg:h-[480px] bg-gradient-to-t from-[#F7F7F5] from-15% via-[#F7F7F5]/85 via-50% to-transparent"
      />

      {/* Centered Magnetic Call to Action Button */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pb-12 sm:pb-16 md:pb-20">
        <div
          className="pointer-events-auto p-4 cursor-pointer"
          onMouseMove={handleMagneticMove}
          onMouseLeave={handleMagneticLeave}
        >
          <div ref={magneticButtonRef}>
            <Link
              href="/portfolio"
              className={cn(
                "group/btn relative inline-flex items-center gap-3 rounded-full",
                "border border-text-primary/20 bg-[#F7F7F5]/90 px-8 py-4 sm:px-10 sm:py-4.5",
                "text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-text-primary",
                "shadow-lg backdrop-blur-md transition-all duration-300",
                "hover:border-text-primary hover:bg-text-primary hover:text-bg-base hover:shadow-2xl hover:scale-[1.02]"
              )}
            >
              <span className="font-sans font-semibold">See More</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
