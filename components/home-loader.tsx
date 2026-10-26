"use client";

import * as React from "react";
import { Camera } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface HomeLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onLoaded?: () => void;
}

export function HomeLoader({ onLoaded, className, ...props }: HomeLoaderProps) {
  const [isComplete, setIsComplete] = React.useState(false);

  const overlayRef = React.useRef<HTMLDivElement>(null);
  const textGroupRef = React.useRef<HTMLDivElement>(null);
  const welcomeRef = React.useRef<HTMLParagraphElement>(null);
  const studioRef = React.useRef<HTMLHeadingElement>(null);
  const cameraWrapperRef = React.useRef<HTMLDivElement>(null);
  const cameraRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!welcomeRef.current && !studioRef.current && !cameraRef.current) {
      return
    }
    // Prevent scrolling behind the loading screen
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      // Initialize starting state to ensure no initial flash
      gsap.set([welcomeRef.current, studioRef.current, cameraRef.current], {
        opacity: 0,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setIsComplete(true);
          onLoaded?.();
        },
      });

      // 1. Text Animation: "WELCOME TO" fades in, followed smoothly by "B STUDIO" in the middle
      tl.fromTo(
        welcomeRef.current,
        { opacity: 0, y: 0 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      )
        .fromTo(
          studioRef.current,
          { opacity: 0, y: 0 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.25"
        )
        // Hold text
        .to({}, { duration: 0.85 })
        // Text fades out together
        .to([welcomeRef.current, studioRef.current], {
          opacity: 0,
          y: 0,
          duration: 0.6,
          ease: "power2.in",
        })

        // 2. Camera Icon Animation: fades in at the exact middle of the screen and fades out
        .fromTo(
          cameraRef.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
          "+=0.1"
        )
        // Hold camera icon
        .to({}, { duration: 0.75 })
        // Camera icon fades out
        .to(cameraRef.current, {
          opacity: 0,
          scale: 1.1,
          duration: 0.55,
          ease: "power2.in",
        })

        // 3. Home page reveal: Full-screen overlay smoothly dissolves to unveil the home page
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.7,
            ease: "power2.inOut",
          },
          "+=0.1"
        );
    }, overlayRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [onLoaded]);

  if (isComplete) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-label="Loading B Studio experience"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-bg-base select-none pointer-events-auto",
        className
      )}
      {...props}
    >
      <div className="relative flex flex-col items-center justify-center text-center px-6 max-w-4xl w-full">
        {/* Step 1: Centered Welcome & Studio typography */}
        <div
          ref={textGroupRef}
          className="flex flex-col items-center justify-center"
        >
          <p
            ref={welcomeRef}
            className="font-sans text-xs sm:text-sm md:text-base uppercase tracking-[0.35em] text-text-muted font-medium mb-3"
          >
            WELCOME TO
          </p>
          <h1
            ref={studioRef}
            className="font-sans font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter text-text-primary"
          >
            B STUDIO
          </h1>
        </div>

        {/* Step 2: Camera icon, positioned at the exact same screen center */}
        <div
          ref={cameraWrapperRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            ref={cameraRef}
            className="flex items-center justify-center p-4"
          >
            <Camera
              className="w-12 h-12 sm:w-16 sm:h-16 text-text-primary stroke-[1.25]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeLoader;
