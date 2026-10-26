"use client";

import * as React from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export type AboutIntroProps = React.HTMLAttributes<HTMLElement>;

export function AboutIntro({ className, ...props }: AboutIntroProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const kickerRef = React.useRef<HTMLDivElement>(null);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);
  const statementRef = React.useRef<HTMLParagraphElement>(null);
  const scrollCueRef = React.useRef<HTMLButtonElement>(null);

  // GSAP smooth fade and slide-up animation on initial page mount
  React.useEffect(() => {
    const section = sectionRef.current;
    const kicker = kickerRef.current;
    const headline = headlineRef.current;
    const statement = statementRef.current;
    const scrollCue = scrollCueRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15,
      });

      if (kicker) {
        tl.fromTo(
          kicker,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9 }
        );
      }

      if (headline) {
        tl.fromTo(
          headline,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.15 },
          "-=0.65"
        );
      }

      if (statement) {
        tl.fromTo(
          statement,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 1.1 },
          "-=0.8"
        );
      }

      if (scrollCue) {
        tl.fromTo(
          scrollCue,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.6"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToStory = () => {
    const storySection = document.getElementById("directors-cut");
    if (storySection) {
      storySection.scrollIntoView({ behavior: "smooth" });
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
        "relative w-full h-[100dvh] min-h-[680px] bg-bg-base text-text-primary flex flex-col justify-between overflow-hidden select-none px-6 sm:px-12 md:px-16 lg:px-24 pt-28 sm:pt-36 pb-12 sm:pb-16",
        className
      )}
      {...props}
    >
      {/* Top Editorial Magazine Kicker */}


      {/* Center / Aggressively Aligned Left Editorial Content */}
      <div className="my-auto py-6 sm:py-10 w-full max-w-7xl mx-auto flex flex-col justify-center">
        {/* Massive Brutalist Sans-Serif Headline */}
        <h1
          ref={headlineRef}
          className="font-sans font-black uppercase tracking-tighter leading-[0.84] text-text-primary text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] xl:text-[12.25rem] opacity-0"
        >
          THE VISION
        </h1>

        {/* Large, Elegant, Italicized Serif Philosophical Statement */}
        <p
          ref={statementRef}
          className="font-serif italic font-normal text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem] text-text-primary/90 leading-[1.2] sm:leading-[1.22] md:leading-[1.24] max-w-5xl mt-6 sm:mt-8 md:mt-12 opacity-0"
        >
          “We treat every memory as a cinematic masterpiece, framing authentic
          moments with editorial elegance.”
        </p>
      </div>

      {/* Bottom Editorial Scroll Cue */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center pt-4 border-t border-border-subtle">


        <button
          ref={scrollCueRef}
          type="button"
          onClick={handleScrollToStory}
          aria-label="Scroll down to the studio story"
          className="group flex items-center gap-3 text-text-muted hover:text-text-primary transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary opacity-0"
        >
          <span className="font-sans font-bold text-[10px] sm:text-xs tracking-[0.25em] uppercase">
            Scroll To Story
          </span>
          {/* Animated vertical cue line */}
          <div className="relative w-[1px] h-7 sm:h-9 bg-text-primary/20 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-text-primary animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
}

export default AboutIntro;
