"use client";

import * as React from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  React.useEffect(() => {
    // Initialize Lenis for cinematic smooth inertia scrolling
    const lenis = new Lenis();
    // {
    //       duration: 1.2,
    //       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    //       orientation: "vertical",
    //       gestureOrientation: "vertical",
    //       smoothWheel: true,
    //       wheelMultiplier: 1,
    //       touchMultiplier: 1.5,
    //     }
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
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScroll;
