"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export function FloatingThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const magneticRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = magneticRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.35;
    const distanceY = (e.clientY - centerY) * 0.35;

    gsap.to(el, {
      x: distanceX,
      y: distanceY,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const el = magneticRef.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  React.useEffect(() => {
    const el = magneticRef.current;
    return () => {
      if (el) {
        gsap.killTweensOf(el);
      }
    };
  }, []);

  // Determine current dark state reliably
  const isDark = mounted
    ? (resolvedTheme ? resolvedTheme === "dark" : theme === "dark")
    : false;

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Directly inspect current class on <html> as ground truth
    const isCurrentlyDark =
      (typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark")) ||
      resolvedTheme === "dark";

    const nextTheme = isCurrentlyDark ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <div
      className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 p-2 -m-2 pointer-events-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={magneticRef}>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          className={cn(
            "relative flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full",
            "bg-text-primary text-bg-base border border-border-subtle shadow-2xl",
            "cursor-pointer select-none transition-all duration-300",
            "hover:scale-110 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          )}
        >
          <Sun
            className={cn(
              "w-5 h-5 lg:w-6 lg:h-6 transition-all duration-500 ease-in-out absolute",
              isDark
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            )}
            strokeWidth={1.75}
          />
          <Moon
            className={cn(
              "w-5 h-5 lg:w-6 lg:h-6 transition-all duration-500 ease-in-out absolute",
              isDark
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0"
            )}
            strokeWidth={1.75}
          />
        </button>
      </div>
    </div>
  );
}
