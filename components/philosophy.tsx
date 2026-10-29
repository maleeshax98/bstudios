"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";

// Register ScrollTrigger plugin safely for client-side environments
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PHILOSOPHY_PARAGRAPH =
  "We believe every fleeting gesture holds the weight of cinema. In an age of ephemeral noise, we sculpt stillness, authentic emotion, and timeless light into enduring visual poetry. Every frame is treated with reverent intention, preserving human memory not merely as documentation, but as timeless art.";

const PHILOSOPHY_WORDS = PHILOSOPHY_PARAGRAPH.split(" ");

export type PhilosophyProps = React.HTMLAttributes<HTMLElement>;

export function Philosophy({ className, ...props }: PhilosophyProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const paragraphRef = React.useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const paragraph = paragraphRef.current;
    if (!container || !paragraph) return;

    let isMounted = true;

    // Scoped GSAP context for clean unmount teardown
    const ctx = gsap.context(() => {
      const words = paragraph.querySelectorAll<HTMLSpanElement>(".philosophy-word");
      if (!words.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: "+=140%",
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Initially, the entire philosophy paragraph is displayed at 20% opacity.
      // As the user scrolls down while pinned, words progressively fill in from 20% to 100%
      // Crisp White (#FFFFFF) strictly tied to downward scroll speed (scrub: 1).
      tl.fromTo(
        words,
        {
          opacity: 0.2,
          color: "rgba(255, 255, 255, 0.2)",
        },
        {
          opacity: 1,
          color: "#FFFFFF",
          stagger: 0.08,
          ease: "none",
        }
      );

      // Brief hold buffer while fully illuminated before ScrollTrigger releases pinning
      tl.to({}, { duration: 0.15 });
    }, container);

    // Refresh ScrollTrigger metrics once web fonts (Newsreader serif) finish loading
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        if (isMounted) {
          ScrollTrigger.refresh();
        }
      });
    }

    return () => {
      isMounted = false;
      ctx.revert();
    };
  }, []);

  return (
    <div className="relative w-full bg-[#000000]">
      <section
        ref={containerRef}
        id="philosophy"
        className={cn(
          "relative w-full h-[100dvh] overflow-hidden bg-[#000000] text-[#FFFFFF] flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 lg:px-28 select-none z-20",
          className
        )}
        {...props}
      >
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center justify-center text-center">
          {/* Subtle Editorial Eyebrow */}
          {/* <div className="mb-6 sm:mb-8 md:mb-10">
            <span className="font-sans text-[11px] sm:text-xs md:text-sm tracking-[0.28em] uppercase text-white/40">
              03 / Philosophy
            </span>
          </div> */}

          {/* Large Editorial Philosophy Text Block */}
          <p
            ref={paragraphRef}
            className="font-serif italic font-normal text-3xl sm:text-3xl md:text-5xl lg:text-5xl xl:text-5xl  leading-[1.3] sm:leading-[1.25] md:leading-[1.2] tracking-tight text-white select-none text-center"
          >
            {PHILOSOPHY_WORDS.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="philosophy-word inline-block mr-[0.25em] sm:mr-[0.28em] text-white opacity-20 transition-none"
                style={{ opacity: 0.2 }}
              >
                {word}
              </span>
            ))}
          </p>

          {/* Editorial Chapter Stamp */}
          {/* <div className="mt-8 sm:mt-12 md:mt-14 flex items-center justify-between w-full max-w-2xl pt-6 border-t border-white/10 text-[10px] sm:text-xs font-sans tracking-[0.2em] uppercase text-white/30">
            <span>Cinema & Stillness</span>
            <span>B Studio</span>
          </div> */}
        </div>
      </section>
    </div>
  );
}
