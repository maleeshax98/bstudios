"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type FooterProps = React.HTMLAttributes<HTMLElement>;

const NAV_LINKS = [
  { label: "Work", href: "#work", index: "01" },
  { label: "Services", href: "#services", index: "02" },
  { label: "About", href: "#about", index: "03" },
  { label: "Color Grade", href: "#lookbook", index: "04" },
  { label: "Contact", href: "#contact", index: "05" },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/binuwara_photography",
  },
  { label: "YouTube", href: "https://www.youtube.com/@BinuwaraSP" },
  { label: "FaceBook", href: "https://www.facebook.com/BinuwaraSP" },
];

const COPYRIGHT_YEAR = 2026;

export function Footer({ className, ...props }: FooterProps) {
  const footerRef = React.useRef<HTMLElement>(null);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);
  const subFooterRef = React.useRef<HTMLDivElement>(null);
  const metaRef = React.useRef<HTMLDivElement>(null);

  const [colomboTime, setColomboTime] = React.useState<string>("");

  // Live Colombo (GMT+5:30) time display
  React.useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeString = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Colombo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now);
        setColomboTime(timeString);
      } catch {
        setColomboTime("08:30 PM");
      }
    };

    const initialTimer = setTimeout(updateTime, 0);
    const interval = setInterval(updateTime, 1000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // GSAP scroll-triggered reveal
  React.useEffect(() => {
    const footer = footerRef.current;
    const headline = headlineRef.current;
    const subFooter = subFooterRef.current;
    const meta = metaRef.current;

    if (!footer || !headline) return;

    const ctx = gsap.context(() => {
      // Subtle reveal for the top editorial metadata
      if (meta) {
        gsap.fromTo(
          meta,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footer,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      // Massive headline reveal
      gsap.fromTo(
        headline,
        {
          opacity: 0,
          y: 60,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headline,
            start: "top 92%",
            once: true,
          },
        },
      );

      // Sub-footer fade in
      if (subFooter) {
        gsap.fromTo(
          subFooter,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headline,
              start: "top 90%",
              once: true,
            },
          },
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      ref={footerRef}
      role="contentinfo"
      aria-label="Site Footer"
      className={cn(
        "relative w-full bg-bg-base text-text-primary border-t border-text-primary/10 overflow-hidden select-none",
        className,
      )}
      {...props}
    >
      {/* Top Editorial Row */}
      {/* <div
        ref={metaRef}
        className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-start">
          <div className="md:col-span-5 space-y-4">

            <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-text-primary max-w-md leading-relaxed pt-2">
              Capturing timeless visual narratives through high-end photography
              and bespoke cinematic direction.
            </p>
          </div>


        </div>
      </div> */}

      {/* Massive Screen-Wide Typographic Section */}
      <div className="relative w-full overflow-hidden border-y border-text-primary/10 py-6 sm:py-8 md:py-10 lg:py-12 flex items-center justify-center bg-bg-base">
        <h2
          ref={headlineRef}
          className="font-sans font-black uppercase tracking-tighter leading-[0.8] text-text-primary text-[18vw] sm:text-[18.6vw] md:text-[19vw] lg:text-[19.2vw] select-none text-center whitespace-nowrap will-change-transform pointer-events-none px-2"
        >
          B&apos;STUDIO
        </h2>
      </div>

      {/* Minimalist Sub-Footer */}
      <div
        ref={subFooterRef}
        className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
      >
        {/* Copyright & Serif Accents */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-text-muted">
          <span className="font-sans tracking-wide">
            © {COPYRIGHT_YEAR} B&apos;STUDIO.
          </span>
          <span className="hidden sm:inline text-text-muted/40">•</span>
          <span className="font-serif italic text-text-muted">
            Cinematic Photography & Videography. All Rights Reserved.
          </span>
        </div>

        {/* WhatsApp Contact */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="font-sans uppercase tracking-widest text-[10px] sm:text-[11px] font-bold text-text-muted">
            WhatsApp
          </span>
          <a
            href="https://wa.me/94704028206"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp +94 70 402 8206"
            className="group inline-flex items-center gap-1 font-sans font-semibold tracking-wider text-text-primary hover:text-black 
            dark:hover:text-white
            transition-colors duration-200"
          >
            <span>+94 70 402 8206</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-black" />
          </a>
        </div>
      </div>
      <div className="mb-10">
        {/* Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 font-sans text-xs sm:text-sm uppercase tracking-wider font-medium text-text-muted hover:text-black 
              dark:hover:text-white
              transition-colors duration-200"
            >
              <span>{social.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-black" />
            </a>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 mb-10">
        <a
          href={"https://www.instagram.com/maleeshax1/"}
          target="_blank"
          className="group inline-flex items-center gap-1 font-sans text-xs sm:text-sm  tracking-wider font-medium text-text-muted hover:text-black 
              dark:hover:text-white
              transition-colors duration-200"
        >
          CREATED BY MaleeZha{" "}
        </a>
      </div>
    </footer>
  );
}

export default Footer;
