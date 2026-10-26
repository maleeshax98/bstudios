"use client";

import * as React from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface WhisperLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onComplete?: () => void;
}

export function WhisperLoader({
  className,
  onComplete,
  ...props
}: WhisperLoaderProps) {
  const [isDone, setIsDone] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    // Lock body scrolling while the whisper intro plays
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(container, { opacity: 1 });
      gsap.set(text, { opacity: 0, y: 10 });

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = originalOverflow;
          setIsDone(true);
          onComplete?.();
        },
      });

      // 1. Text fades into the exact center using elegant italic serif
      tl.to(text, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power2.out",
      })
        // 2. Holds for a second
        .to({}, { duration: 1.0 })
        // 3. Slowly fades out
        .to(text, {
          opacity: 0,
          y: -8,
          duration: 0.85,
          ease: "power2.in",
        })
        // 4. Black background smoothly dissolves to reveal the main page in Off-Light theme
        .to(
          container,
          {
            opacity: 0,
            duration: 0.95,
            ease: "power2.inOut",
          },
          "-=0.3"
        );
    }, containerRef);

    return () => {
      document.body.style.overflow = originalOverflow;
      ctx.revert();
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading Services"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black select-none pointer-events-auto",
        className
      )}
      {...props}
    >
      <p
        ref={textRef}
        className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/95 tracking-wide text-center px-6"
      >
        Crafting your story.
      </p>
    </div>
  );
}
