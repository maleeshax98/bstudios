"use client";

import * as React from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export type ServicesLandingProps = React.HTMLAttributes<HTMLElement>;

export function ServicesLanding({
  className,
  ...props
}: ServicesLandingProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);
  const copyRef = React.useRef<HTMLParagraphElement>(null);
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const scrollCueRef = React.useRef<HTMLButtonElement>(null);

  // Subtle cursor follower on fine-pointer desktop viewports
  React.useEffect(() => {
    const section = sectionRef.current;
    const cursor = cursorRef.current;
    if (!section || !cursor) return;

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    let xTo: gsap.QuickToFunc | null = null;
    let yTo: gsap.QuickToFunc | null = null;

    const ctx = gsap.context(() => {
      xTo = gsap.quickTo(cursor, "x", { duration: 0.22, ease: "power2.out" });
      yTo = gsap.quickTo(cursor, "y", { duration: 0.22, ease: "power2.out" });
    }, section);

    const handleMouseMove = (e: MouseEvent) => {
      if (xTo && yTo) {
        xTo(e.clientX);
        yTo(e.clientY);
      }
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, scale: 0.5, duration: 0.3 });
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handleMouseLeave);
      ctx.revert();
    };
  }, []);

  // Subtle entry reveal for typography and scroll cue
  React.useEffect(() => {
    const headline = headlineRef.current;
    const copy = copyRef.current;
    const scrollCue = scrollCueRef.current;

    const ctx = gsap.context(() => {
      if (headline) {
        gsap.fromTo(
          headline,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: "power3.out" }
        );
      }
      if (copy) {
        gsap.fromTo(
          copy,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.45, ease: "power3.out" }
        );
      }
      if (scrollCue) {
        gsap.fromTo(
          scrollCue,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 1.0, delay: 0.7, ease: "power2.out" }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleScrollDown = () => {
    const exhibitionSection = document.getElementById("services-exhibition");
    if (exhibitionSection) {
      exhibitionSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full h-[100dvh] min-h-[640px] bg-bg-base text-text-primary flex flex-col justify-between overflow-hidden select-none px-6 sm:px-12 md:px-16 lg:px-24 pt-28 sm:pt-36 pb-12 sm:pb-16",
        className
      )}
      {...props}
    >
      {/* Subtle Custom Cursor Follower for Desktop */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="hidden md:flex pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 items-center justify-center rounded-full bg-text-primary text-bg-base text-[10px] font-sans font-bold uppercase tracking-wider px-3.5 py-1.5 shadow-lg backdrop-blur-sm"
      >
        <span>Explore</span>
      </div>



      {/* Main Anchor Content Grid: Left headline + Right philosophy */}
      <div className="my-auto py-8 sm:py-12 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end">
        {/* Left Side: Massive Bold Sans-Serif Headline */}
        <div className="lg:col-span-7">
          <h1
            ref={headlineRef}
            className="font-sans font-black uppercase tracking-tighter leading-[0.84] text-text-primary text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[11.25rem]"
          >
            WHAT
            <br />
            WE DO
          </h1>
        </div>

        {/* Right Side: Sophisticated Editorial Paragraph */}
        <div className="lg:col-span-5 pb-2 lg:pb-4">
          <p
            ref={copyRef}
            className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-[2rem] leading-relaxed sm:leading-relaxed md:leading-relaxed text-text-primary/85 max-w-xl"
          >
            Every frame is approached as an editorial composition. We balance
            raw, unscripted intimacy with high-fashion direction to craft
            cinematic heirlooms that transcend the fleeting moment.
          </p>
        </div>
      </div>

      {/* Bottom Editorial Scroll Cue: Tiny Animated Line & Label */}
      <div className="w-full flex items-center justify-center pt-4 ">
        <button
          ref={scrollCueRef}
          type="button"
          onClick={handleScrollDown}
          aria-label="Scroll down to services exhibition"
          className="group flex flex-col items-center gap-2 text-text-muted hover:text-text-primary transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary"
        >
          <span className="font-sans font-bold text-[10px] sm:text-xs tracking-[0.25em] uppercase">
            Scroll To Explore
          </span>
          {/* Animated vertical line */}
          <div className="relative w-[1px] h-9 sm:h-11 bg-text-primary/20 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-text-primary animate-bounce" />
          </div>
        </button>

        <div className="hidden sm:block font-serif italic text-xs text-text-muted">
          Six Signature Mediums
        </div>
      </div>
    </section>
  );
}
