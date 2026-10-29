"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/optimized-image";
import type { CloudinaryResource } from "@/lib/cd";

export interface SampleGalleryItem {
  id: string;
  src: string;
  alt: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
  title?: string;
  category?: string;
}

export interface SampleGalleryProps
  extends React.HTMLAttributes<HTMLElement> {
  initialImages?: CloudinaryResource[];
}

function getAspectClass(width?: number, height?: number): string {
  if (!width || !height) return "aspect-[3/4]";
  const ratio = width / height;
  if (ratio >= 1.4) return "aspect-[16/10]";
  if (ratio >= 1.15) return "aspect-[4/3]";
  if (ratio >= 0.9) return "aspect-[1/1]";
  if (ratio >= 0.7) return "aspect-[4/5]";
  return "aspect-[2/3]";
}

export function SampleGallery({
  initialImages,
  className,
  ...props
}: SampleGalleryProps) {
  const magneticButtonRef = React.useRef<HTMLDivElement>(null);

  const displayImages: SampleGalleryItem[] = React.useMemo(() => {
    if (initialImages && initialImages.length > 0) {
      return initialImages.map((img, idx) => ({
        id: img.asset_id || img.public_id || `sample-cloud-${idx}`,
        src: img.public_id || img.secure_url,
        alt:
          (typeof img.display_name === "string" && img.display_name) ||
          (typeof img.filename === "string" && img.filename) ||
          `B Studio Cinematic Editorial ${idx + 1}`,
        width: img.width,
        height: img.height,
        aspectRatio: getAspectClass(img.width, img.height),
      }));
    }
    return [];
  }, [initialImages]);

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

  if (displayImages.length === 0) {
    return (
      <section
        className={cn(
          "relative w-full bg-bg-base overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 py-20 select-none",
          className,
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto">
          <div className="min-h-[30vh] flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-subtle rounded-3xl bg-bg-surface/30">
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
      className={cn(
        "relative w-full bg-bg-base overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 pt-8 pb-32 sm:pb-40 md:pb-48 select-none",
        className,
      )}
      {...props}
    >
      {/* Masonry-Style Pinterest Grid (CSS Columns) */}
      <div className="mx-auto max-w-[1700px]">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6">
          {displayImages.map((item) => (
            <div
              key={item.id}
              className="group relative mb-4 sm:mb-6 break-inside-avoid overflow-hidden rounded-xl border border-border-subtle bg-bg-surface transition-all duration-500 hover:border-text-primary/25 hover:shadow-lg"
            >
              <div
                className={cn(
                  "relative w-full overflow-hidden",
                  item.aspectRatio,
                )}
                style={
                  item.width && item.height
                    ? { aspectRatio: `${item.width} / ${item.height}` }
                    : undefined
                }
              >
                <OptimizedImage
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 sm:h-80 md:h-[420px] lg:h-[480px] bg-gradient-to-t from-bg-base from-15% via-bg-base/85 via-50% to-transparent"
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
              href="/works"
              className={cn(
                "group/btn relative inline-flex items-center gap-3 rounded-full",
                "border border-text-primary/20 bg-bg-base/90 px-8 py-4 sm:px-10 sm:py-4.5",
                "text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-text-primary",
                "shadow-lg backdrop-blur-md transition-all duration-300",
                "hover:border-text-primary hover:bg-text-primary hover:text-bg-base hover:shadow-2xl hover:scale-[1.02]",
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
