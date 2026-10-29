import * as React from "react";

/**
 * useIsomorphicLayoutEffect
 * Prevents SSR hydration warnings in Next.js while ensuring
 * synchronous cleanup before React reconciliation removes DOM nodes.
 * Critical for GSAP ScrollTrigger pins to unwrap .pin-spacer before unmounting.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
