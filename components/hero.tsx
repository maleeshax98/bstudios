"use client";

import * as React from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  videoSrc?: string;
  title?: string;
  subtitle?: string;
}

export function Hero({
  videoSrc = "/hero.mp4",
  title = "B STUDIO",
  subtitle = "Cinematic Photography & Videography",
  className,
  ...props
}: HeroProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const idleTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // GSAP quickTo setters for 60-120fps mouse tracking
  const xTo = React.useRef<gsap.QuickToFunc | null>(null);
  const yTo = React.useRef<gsap.QuickToFunc | null>(null);

  React.useEffect(() => {
    // Only enable custom cursor interaction on desktop fine-pointer devices
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer || !cursorRef.current) return;

    // Initialize GSAP quickTo for silky smooth coordinate tracking
    xTo.current = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.18,
      ease: "power2.out",
    });
    yTo.current = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.18,
      ease: "power2.out",
    });

    // Subtle entrance animation for the typography
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [titleRef.current, subtitleRef.current],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!xTo.current || !yTo.current) return;

    // Track mouse coordinates
    xTo.current(e.clientX);
    yTo.current(e.clientY);

    if (!isVisible) {
      setIsVisible(true);
    }

    // Expand cursor into "Scroll" indicator upon mouse movement
    setIsExpanded(true);

    // After 1.2s of inactivity, collapse back into subtle indicator dot
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 1200);
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setIsExpanded(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Hero Showreel"
      className={cn(
        "relative w-full h-[calc(100dvh-5rem)] min-h-[560px] flex items-center justify-center overflow-hidden bg-black select-none md:cursor-none",
        className
      )}
      {...props}
    >
      {/* Background Visual: Dynamic Video Showreel with Subtle Black Overlay */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="w-full h-full object-cover opacity-70"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* Subtle black overlay (not too dark) to let the video shine while making white text pop */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/55" />
      </div>

      {/* Dead Center Main Typography in Crisp White */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-7xl mx-auto pointer-events-none">
        <h1
          ref={titleRef}
          className="font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] xl:text-[12rem] tracking-tighter leading-[0.88] text-white uppercase drop-shadow-sm"
        >
          {title}
        </h1>
        <p
          ref={subtitleRef}
          className="font-serif italic font-normal text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white/80 mt-2 sm:mt-3 md:mt-4 tracking-tight"
        >
          {subtitle}
        </p>
      </div>

      {/* Bottom Editorial Scroll Cue */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none opacity-75">
        <span className="font-sans text-[10px] uppercase tracking-widest text-white/70 font-medium">
          Scroll
        </span>
        <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-white/60 to-transparent" />
      </div>

      {/* Custom Cursor with dynamic "Scroll" indicator expansion */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-30 hidden md:flex items-center justify-center rounded-full border border-white/30 bg-black/60 shadow-lg backdrop-blur-sm text-white -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity,background-color] duration-300 ease-out",
          isVisible ? "opacity-100" : "opacity-0",
          isExpanded ? "w-20 h-20" : "w-3 h-3 bg-white border-none"
        )}
      >
        <div
          className={cn(
            "flex flex-col items-center justify-center transition-opacity duration-200",
            isExpanded ? "opacity-100 delay-100" : "opacity-0 pointer-events-none"
          )}
        >
          <span className="font-sans text-[9px] uppercase tracking-widest font-semibold text-white">
            Scroll
          </span>
          <ArrowDown className="w-3 h-3 mt-0.5 stroke-[1.75] text-white/80" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
