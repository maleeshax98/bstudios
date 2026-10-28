"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

function useMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function KeepScrollingIndicatorContent() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const checkAndShow = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentScroll = window.innerHeight + window.scrollY;
      const isAtBottom = currentScroll >= scrollHeight - 50;

      if (!isAtBottom) {
        setIsVisible(true);
      }
    };

    const resetTimer = () => {
      setIsVisible(false);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(checkAndShow, 10000);
    };

    // Initialize the 10-second idle timer
    timer = setTimeout(checkAndShow, 10000);

    // Listen to user scroll gestures
    window.addEventListener("scroll", resetTimer, { passive: true });
    window.addEventListener("wheel", resetTimer, { passive: true });
    window.addEventListener("touchmove", resetTimer, { passive: true });

    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("wheel", resetTimer);
      window.removeEventListener("touchmove", resetTimer);
    };
  }, []);

  const handleScrollClick = () => {
    window.scrollBy({
      top: window.innerHeight * 0.75,
      behavior: "smooth",
    });
    setIsVisible(false);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out",
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <button
        type="button"
        onClick={handleScrollClick}
        aria-label="Keep scrolling"
        className="group flex items-center gap-2 sm:gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-bg-surface/90 text-text-primary border border-border-subtle shadow-xl backdrop-blur-md hover:border-text-primary/30 transition-all animate-pulse cursor-pointer select-none"
      >
        <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] text-text-primary">
          Keep scrolling
        </span>
        <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-primary transition-transform group-hover:translate-y-0.5" />
      </button>
    </div>
  );
}

export function KeepScrollingIndicator() {
  const pathname = usePathname();
  const mounted = useMounted();

  const cleanPath = (pathname || "").replace(/\/$/, "") || "/";
  const isEligiblePage = cleanPath === "/" || cleanPath === "/about";

  if (!mounted || !isEligiblePage) {
    return null;
  }

  return <KeepScrollingIndicatorContent />;
}

export default KeepScrollingIndicator;
