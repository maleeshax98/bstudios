"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  index: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Work", href: "/#work", index: "01" },
  { label: "Services", href: "/services", index: "02" },
  { label: "About", href: "/#about", index: "03" },
  { label: "Contact", href: "#contact", index: "04" },
];

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  ctaLabel?: string;
  ctaHref?: string;
}

export function Navbar({
  className,
  ctaLabel = "Inquire",
  ctaHref = "#contact",
  ...props
}: NavbarProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isVisible, setIsVisible] = React.useState(true);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const magneticButtonRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const menuListRef = React.useRef<HTMLUListElement>(null);
  const lastScrollYRef = React.useRef(0);

  // Track scroll position and direction:
  // - Always visible at the very top of the page (transparent if in hero section)
  // - Smoothly hides (slides up) when scrolling down
  // - Slides back into view (slides down) when scrolling up
  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(0, window.scrollY);

          // Update transparency threshold (solid past 20px)
          setIsScrolled(currentScrollY > 20);

          // Always visible at the very top of the page
          if (currentScrollY <= 20) {
            setIsVisible(true);
            lastScrollYRef.current = currentScrollY;
          } else {
            const diff = currentScrollY - lastScrollYRef.current;
            // Only toggle visibility when scroll delta exceeds threshold to prevent micro-jitter
            if (Math.abs(diff) > 8) {
              if (diff > 0) {
                // Scrolling DOWN -> smoothly hide navbar
                setIsVisible(false);
              } else {
                // Scrolling UP -> slide navbar back into view
                setIsVisible(true);
              }
              lastScrollYRef.current = currentScrollY;
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHomePage && !isScrolled;
  const shouldShow = isVisible || isOpen;

  // Magnetic button hover effect using GSAP
  const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = magneticButtonRef.current;
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

  const handleMagneticLeave = () => {
    const el = magneticButtonRef.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  const isClosingRef = React.useRef(false);

  const closeMenu = React.useCallback(() => {
    if (!isOpen || isClosingRef.current) return;
    if (!overlayRef.current) {
      setIsOpen(false);
      return;
    }

    isClosingRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        isClosingRef.current = false;
      },
    });

    if (menuListRef.current) {
      tl.to(
        menuListRef.current.children,
        {
          y: -10,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          stagger: 0.02,
        },
        0
      );
    }

    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.inOut",
      },
      0.03
    );
  }, [isOpen]);

  const toggleMenu = () => {
    if (isClosingRef.current) return;
    if (isOpen) {
      closeMenu();
    } else {
      setIsOpen(true);
    }
  };

  // Close overlay on Escape key & manage scroll lock
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isClosingRef.current) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);

      // Smooth entry animation for mobile menu overlay items
      if (overlayRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
      if (menuListRef.current) {
        gsap.fromTo(
          menuListRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.4,
            ease: "power3.out",
            delay: 0.1,
          }
        );
      }
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  return (
    <>
      <header
        onFocusCapture={() => setIsVisible(true)}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ease-in-out",
          shouldShow ? "translate-y-0" : "-translate-y-full",
          isTransparent
            ? "bg-transparent border-b border-transparent"
            : "bg-bg-base border-b border-border-subtle",
          className
        )}
        {...props}
      >
        <nav
          aria-label="Main Navigation"
          className="max-w-7xl mx-auto h-20 px-6 sm:px-8 lg:px-12 flex items-center justify-between"
        >
          {/* Left: The "B STUDIO" Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="group inline-flex items-baseline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            >
              <span
                className={cn(
                  "font-sans font-extrabold uppercase tracking-tighter text-xl sm:text-2xl transition-colors duration-300",
                  isTransparent
                    ? "text-white group-hover:text-white/80"
                    : "text-text-primary group-hover:text-accent-primary"
                )}
              >
                B STUDIO
              </span>
              <span
                className={cn(
                  "ml-1 w-1.5 h-1.5 rounded-full inline-block transition-all duration-300 group-hover:scale-125",
                  isTransparent ? "bg-white" : "bg-accent-primary"
                )}
              />
            </Link>
          </div>

          {/* Center / Center-Left: Navigation links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-baseline gap-1.5 text-xs uppercase tracking-widest transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary",
                  isTransparent
                    ? "text-white/70 hover:text-white"
                    : "text-text-muted hover:text-accent-primary"
                )}
              >
                <span
                  className={cn(
                    "font-serif italic text-xs transition-colors duration-300",
                    isTransparent
                      ? "text-white/50 group-hover:text-white"
                      : "text-text-muted/70 group-hover:text-accent-primary"
                  )}
                >
                  {item.index}
                </span>
                <span className="font-sans font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right: Sleek CTA Button with Magnetic Hover (Desktop) */}
          <div className="hidden md:flex items-center">
            <div
              ref={magneticButtonRef}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className="inline-block"
            >
              <Link
                href={ctaHref}
                className={cn(
                  "group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                  isTransparent
                    ? "bg-white text-accent-primary hover:bg-white/90"
                    : "bg-accent-primary text-bg-base hover:bg-text-primary"
                )}
              >
                <span>{ctaLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Mobile: Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-overlay"
              className={cn(
                "p-2 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors duration-300",
                isTransparent
                  ? "text-white hover:text-white/80"
                  : "text-text-primary hover:text-accent-primary"
              )}
            >
              <Menu className="w-6 h-6 stroke-[1.75]" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay: Full-screen, Cinematic Off-White (--bg-base) */}
      {isOpen && (
        <div
          id="mobile-nav-overlay"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
          className="fixed inset-0 z-50 bg-bg-base flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto"
        >
          {/* Overlay Top Bar */}
          <div className="flex items-center justify-between h-14">
            <Link
              href="/"
              onClick={closeMenu}
              className="font-sans font-extrabold uppercase tracking-tighter text-xl sm:text-2xl text-text-primary"
            >
              B STUDIO
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation menu"
              className="p-2 -mr-2 text-text-primary hover:text-accent-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            >
              <X className="w-6 h-6 stroke-[1.75]" />
            </button>
          </div>

          {/* Overlay Center: Stacked High-Contrast Navigation Links */}
          <div className="my-auto py-12">
            <ul ref={menuListRef} className="space-y-6 sm:space-y-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="group inline-flex items-baseline gap-4 sm:gap-6 text-text-primary hover:text-accent-primary transition-colors duration-200"
                  >
                    <span className="font-serif italic text-lg sm:text-2xl text-text-muted transition-colors duration-200 group-hover:text-accent-primary">
                      {item.index}
                    </span>
                    <span className="font-sans font-black text-4xl sm:text-6xl uppercase tracking-tighter">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Overlay Bottom: CTA & Editorial Meta */}
          <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-serif italic text-sm text-text-muted">
                Cinematic Photography & Direction
              </p>
              <p className="font-sans text-xs tracking-wider uppercase text-text-primary mt-1">
                hello@bstudio.com
              </p>
            </div>

            <Link
              href={ctaHref}
              onClick={closeMenu}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-accent-primary text-bg-base font-sans text-xs uppercase tracking-widest font-semibold hover:bg-text-primary transition-all duration-300"
            >
              <span>{ctaLabel}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2]" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
