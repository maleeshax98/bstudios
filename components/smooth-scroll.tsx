"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const lenisRef = React.useRef<Lenis | null>(null);

  React.useEffect(() => {
    // Initialize Lenis for cinematic smooth inertia scrolling
    const lenis = new Lenis();
    lenisRef.current = lenis;

    // Synchronize Lenis with GSAP ScrollTrigger updates
    lenis.on("scroll", ScrollTrigger.update);

    // Feed Lenis into GSAP ticker for frame-perfect rendering at 60-120fps
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Instantly scroll to top on route change to prevent stale scroll offsets
  React.useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    }
  }, [pathname]);

  return <>{children}</>;
}

export default SmoothScroll;
