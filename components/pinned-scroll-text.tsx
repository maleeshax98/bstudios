"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger plugin safely for client-side environments
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type PinnedScrollTextProps = React.HTMLAttributes<HTMLElement>;

export function PinnedScrollText({
  className,
  ...props
}: PinnedScrollTextProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) return;

    // Isolate GSAP timeline and ScrollTrigger inside context for clean unmount teardown
    const ctx = gsap.context(() => {
      // Metrics calculation helper
      const getMetrics = () => {
        const viewportWidth = container.offsetWidth || window.innerWidth;
        // Accurate rendered width including subpixels and font tracking
        const textWidth =
          text.getBoundingClientRect().width || text.scrollWidth;
        // Editorial margin ensuring "DIRECTING" sits comfortably inside the viewport
        const margin = Math.max(48, Math.round(viewportWidth * 0.05));
        const startX = viewportWidth;
        const endX = viewportWidth - textWidth - margin;
        const scrollDistance = startX - endX;

        return { startX, endX, scrollDistance };
      };

      const metrics = getMetrics();

      gsap.fromTo(
        text,
        {
          // x: metrics.startX,
          x: 0,
        },
        {
          x: () => {
            const viewportWidth = container.offsetWidth || window.innerWidth;
            const textWidth =
              text.getBoundingClientRect().width || text.scrollWidth;
            const margin = Math.max(48, Math.round(viewportWidth * 0.05));
            return viewportWidth - textWidth - margin;
          },
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => {
              const viewportWidth = container.offsetWidth || window.innerWidth;
              const textWidth =
                text.getBoundingClientRect().width || text.scrollWidth;
              const margin = Math.max(48, Math.round(viewportWidth * 0.05));
              const scrollDistance = textWidth + margin;
              return `+=${scrollDistance}`;
            },
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        }
      );
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
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="Cinematic Statement"
      className={cn(
        "relative w-full h-[100dvh] min-h-[500px] overflow-hidden bg-bg-base flex items-center select-none",
        className
      )}
      {...props}
    >
      <div
        ref={textRef}
        style={{ transform: "translate3d(100vw, 0, 0)" }}
        className="w-max inline-block whitespace-nowrap font-sans font-black uppercase tracking-tight sm:tracking-tighter leading-none text-text-primary text-[50vh] will-change-transform pr-16 sm:pr-24 md:pr-32"
      >
        CINEMATIC ART AND DIRECTING
      </div>
    </section>
  );
}

export default PinnedScrollText;
