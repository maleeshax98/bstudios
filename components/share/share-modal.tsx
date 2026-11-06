"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ShareAlbumData {
  title: string;
  slug?: string | null;
  url?: string | null;
  category?: string | null;
  image?: string | null;
  description?: string | null;
}

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  album: ShareAlbumData | null;
}

export function ShareModal({ isOpen, onClose, album }: ShareModalProps) {
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [copied, setCopied] = React.useState(false);

  const supportsNativeShare =
    isMounted &&
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function";

  // Compute absolute share URL
  const shareUrl = React.useMemo(() => {
    if (!album) return "";
    if (album.url && (album.url.startsWith("http://") || album.url.startsWith("https://"))) {
      return album.url;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "https://bstudio.lk";
    const slug = (album.slug || "").trim();

    if (slug.startsWith("http://") || slug.startsWith("https://")) {
      return slug;
    }

    if (slug.startsWith("#") || !slug) {
      if (typeof window !== "undefined") {
        return window.location.href;
      }
      return `${origin}/works`;
    }

    const normalizedPath = slug.startsWith("/")
      ? slug
      : slug.startsWith("album/")
        ? `/${slug}`
        : `/album/${slug}`;

    return `${origin}${normalizedPath}`;
  }, [album]);

  const shareText = React.useMemo(() => {
    if (!album) return "B'STUDIO — High-End Cinematic Photography & Videography";
    return `Explore "${album.title}" by B'STUDIO — High-End Cinematic Storytelling`;
  }, [album]);

  // Handle escape key and lock body scroll
  React.useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Copy to clipboard
  const handleCopy = async () => {
    if (!shareUrl) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // Trigger native device share
  const handleNativeShare = async () => {
    if (!navigator.share || !album) return;
    try {
      await navigator.share({
        title: album.title,
        text: shareText,
        url: shareUrl,
      });
    } catch {
      // User cancelled or share failed, ignore
    }
  };

  if (!isMounted || !isOpen || !album) {
    return null;
  }

  // Social media share links
  const socialChannels = [
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      color: "hover:border-[#25D366] hover:text-[#25D366] dark:hover:border-[#25D366] dark:hover:text-[#25D366]",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M17.507 14.307l-.009.075c-.338.925-1.748 1.83-2.43 1.947-.597.103-1.37.164-3.957-.91-3.313-1.375-5.426-4.756-5.59-4.978-.163-.223-1.332-1.773-1.332-3.382 0-1.609.84-2.4 1.14-2.724.3-.324.654-.405.872-.405.218 0 .436.002.627.012.203.01.474-.077.74.564.275.666.937 2.285 1.018 2.452.082.167.137.362.027.584-.11.222-.164.36-.327.556-.164.195-.345.437-.493.587-.164.166-.335.347-.144.675.191.328.848 1.4 1.817 2.264 1.246 1.11 2.298 1.455 2.626 1.62.327.164.519.137.709-.082.191-.219.818-.952 1.037-1.28.218-.328.436-.273.736-.163.3.11 1.908.9 2.236 1.064.327.163.545.245.627.382.082.136.082.791-.256 1.716zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.05 22l4.98-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
      ),
    },
    {
      name: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:border-[#1877F2] hover:text-[#1877F2] dark:hover:border-[#1877F2] dark:hover:text-[#1877F2]",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "hover:border-[#0A66C2] hover:text-[#0A66C2] dark:hover:border-[#0A66C2] dark:hover:text-[#0A66C2]",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
    {
      name: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}${album.image ? `&media=${encodeURIComponent(album.image)}` : ""}&description=${encodeURIComponent(shareText)}`,
      color: "hover:border-[#E60023] hover:text-[#E60023] dark:hover:border-[#E60023] dark:hover:text-[#E60023]",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
          <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.98-.12-2.5.02-3.58l.78-3.32s-.2-.4-.2-.99c0-.93.54-1.63 1.21-1.63.57 0 .85.43.85.95 0 .58-.37 1.44-.56 2.24-.16.67.33 1.22.99 1.22 1.19 0 2.1-1.25 2.1-3.07 0-1.6-1.15-2.72-2.8-2.72-1.91 0-3.03 1.43-3.03 2.91 0 .58.22 1.2.5 1.54.05.07.06.13.04.2l-.19.78c-.03.13-.1.18-.23.12-1.02-.47-1.65-1.96-1.65-3.15 0-2.56 1.86-4.92 5.37-4.92 2.82 0 5.01 2.01 5.01 4.7 0 2.8-1.77 5.06-4.22 5.06-.82 0-1.6-.43-1.87-.93l-.51 1.94c-.18.72-.68 1.62-1.01 2.17A12 12 0 1 0 12 0z" />
        </svg>
      ),
    },
  ];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Share ${album.title}`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop overlay with blur */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in-0 duration-200"
      />

      {/* Modal Dialog Content */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-3xl p-6 sm:p-8 select-none",
          "bg-bg-base dark:bg-[#161616] text-text-primary",
          "border border-border-subtle shadow-2xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
        )}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close share dialog"
          className="absolute top-5 right-5 p-2 rounded-full border border-border-subtle bg-bg-surface hover:bg-text-primary hover:text-bg-base text-text-muted transition-all duration-200 cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2]" />
        </button>

    
        {/* Album Title */}
        <h3 className="font-serif italic text-2xl sm:text-3xl text-text-primary leading-tight max-w-[85%]">
          {album.title}
        </h3>

        {/* Description or instruction */}
        <p className="font-sans text-xs text-text-muted mt-2 leading-relaxed">
          Share this collection directly with clients and collaborators across social channels or copy the permanent archive link.
        </p>

        {/* Social Channels Row */}
        <div className="mt-6 pt-5 border-t border-border-subtle">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3.5">
            Share via Social Channels
          </p>

          <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
            {socialChannels.map((channel) => (
              <a
                key={channel.name}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex flex-col items-center justify-center gap-2 p-3 rounded-2xl",
                  "border border-border-subtle bg-bg-surface/80 hover:bg-bg-surface",
                  "text-text-muted transition-all duration-200 hover:-translate-y-0.5",
                  channel.color,
                )}
                aria-label={`Share on ${channel.name}`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                  {channel.icon}
                </div>
                <span className="font-sans text-[10px] font-semibold tracking-wider text-center truncate w-full">
                  {channel.name.split(" ")[0]}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Copy Link Input Bar */}
        <div className="mt-6 pt-5 border-t border-border-subtle">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-2">
            Direct Archive Link
          </p>

          <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-border-subtle bg-bg-surface">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onFocus={(e) => e.target.select()}
              className="flex-1 bg-transparent px-3 py-1 font-sans text-xs text-text-primary select-all outline-none truncate"
            />

            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 shadow-xs",
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-text-primary text-bg-base hover:opacity-90 active:scale-95",
              )}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 stroke-[2]" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Native Web Share API Button (if supported on mobile/desktop) */}
        {supportsNativeShare && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border-subtle bg-bg-surface/50 hover:bg-bg-surface text-text-primary font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 stroke-[2]" />
              <span>More Sharing Options (Device Share)</span>
              <ExternalLink className="w-3 h-3 stroke-[2] opacity-60" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default ShareModal;
