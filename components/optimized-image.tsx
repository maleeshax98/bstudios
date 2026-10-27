"use client";

import * as React from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { RotateCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OptimizedImageProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CldImage>,
  "src"
> {
  /**
   * Cloudinary Public ID or Image URL.
   */
  src: string;
  /**
   * Accessible alternative text description.
   */
  alt: string;
  /**
   * Additional CSS classes for the outer container wrapper.
   */
  containerClassName?: string;
  /**
   * Optional aspect ratio class (e.g. "aspect-[4/5]", "aspect-video", "aspect-[3/4]").
   */
  aspectRatio?: string;
  /**
   * Title shown inside the error fallback state.
   * Defaults to "Image Preview Unavailable".
   */
  fallbackTitle?: string;
  /**
   * Description shown inside the error fallback state.
   * Defaults to "Unable to download asset from Cloudinary CDN.".
   */
  fallbackDescription?: string;
  /**
   * Whether to display the "Retry Image" button inside the fallback UI.
   * Defaults to true.
   */
  showRetryButton?: boolean;
  /**
   * Callback invoked whenever the user triggers a retry.
   */
  onRetry?: () => void;
  /**
   * Whether to fall back to Next.js <Image> if src is an external non-Cloudinary URL.
   * Defaults to true for cross-domain safety.
   */
  fallbackToNextImage?: boolean;
}

/**
 * Reusable OptimizedImage component using Next.js, Tailwind CSS, and next-cloudinary.
 *
 * Specifications satisfied:
 * 1. Cloudinary Integration: Replaces standard Next.js <Image> with <CldImage format="auto" quality="auto" />.
 * 2. Loading State: Skeleton loader using Tailwind's `animate-pulse` on muted `#EBEBE8` background while downloading.
 * 3. Error & Retry Mechanism: Tracks image loading state. Displays clean fallback UI on `onError` with a subtle,
 *    elegant "Retry Image" button in crisp Sans-Serif font that updates `retryKey` state to force a fresh re-render.
 * 4. Theme Enforcement: Fallback UI locked into Cinematic Off-Light theme with Cinematic Off-White / Warm Pearl
 *    (`--bg-base` / #F7F7F5) background and Rich Charcoal / Ink Black (`--text-primary` / #111111) retry text.
 */
export function OptimizedImage({
  src,
  alt,
  containerClassName,
  aspectRatio,
  fallbackTitle = "Image Preview Unavailable",
  fallbackDescription = "Unable to download asset from Cloudinary CDN.",
  showRetryButton = true,
  onRetry,
  fallbackToNextImage = true,
  className,
  format = "auto",
  quality = "auto",
  loading = "lazy",
  fill,
  width,
  height,
  sizes,
  priority,
  onLoad,
  onError,
  ...rest
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [retryKey, setRetryKey] = React.useState(0);
  const [retryTimestamp, setRetryTimestamp] = React.useState<number | null>(
    null,
  );

  // Synchronize state when src prop changes (React recommended pattern: adjust state during render)
  const [prevSrc, setPrevSrc] = React.useState(src);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setHasError(!src || src.trim().length === 0);
    setIsLoaded(false);
    setRetryKey(0);
    setRetryTimestamp(null);
    setIsRetrying(false);
  }

  // Check if source is empty or invalid
  const isEmptySrc = !src || src.trim().length === 0;
  const isDisplayingError = hasError || isEmptySrc;

  // Retry event handler: updates retryKey to force re-render and re-download attempt
  const handleRetry = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsRetrying(true);
      setHasError(false);
      setIsLoaded(false);
      setRetryKey((prev) => prev + 1);
      setRetryTimestamp(Date.now());

      onRetry?.();

      setTimeout(() => {
        setIsRetrying(false);
      }, 500);
    },
    [onRetry],
  );

  // Compute cache-busting source when retry is triggered
  const effectiveSrc = React.useMemo(() => {
    if (!src) return "";
    if (retryKey === 0 || !retryTimestamp) return src;

    if (src.includes("?")) {
      return `${src}&retry=${retryKey}&t=${retryTimestamp}`;
    }
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return `${src}?retry=${retryKey}&t=${retryTimestamp}`;
    }
    // Cloudinary public ID: changing component key triggers a full fresh mount
    return src;
  }, [src, retryKey, retryTimestamp]);

  // Determine whether this is a Cloudinary-hosted asset or external URL
  const isCloudinary = React.useMemo(() => {
    if (!src) return false;
    return (
      src.includes("res.cloudinary.com") ||
      (!src.startsWith("http://") &&
        !src.startsWith("https://") &&
        !src.startsWith("/"))
    );
  }, [src]);

  // Determine whether to use Next.js <Image> as fallback for non-Cloudinary external domains
  const shouldUseNextImage = fallbackToNextImage && !isCloudinary;

  // Determine layout dimensions
  const isFillLayout = Boolean(fill || (aspectRatio && !width && !height));
  const finalWidth = isFillLayout ? undefined : width || 1200;
  const finalHeight = isFillLayout ? undefined : height || 800;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#EBEBE8]",
        aspectRatio,
        isFillLayout && !aspectRatio && "w-full h-full",
        containerClassName,
      )}
    >
      {/* =================================================================== */}
      {/* 1. SKELETON LOADER (Tailwind animate-pulse with muted #EBEBE8)      */}
      {/* =================================================================== */}
      {!isLoaded && !isDisplayingError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 flex flex-col justify-between p-4 bg-[#EBEBE8] animate-pulse pointer-events-none"
        >
          <div className="self-end h-5 w-16 rounded-full bg-[#DFDFDC] animate-pulse" />
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. ERROR & RETRY FALLBACK (Cinematic Off-Light Theme Enforcement)   */}
      {/* Background: Cinematic Off-White / Warm Pearl (--bg-base / #F7F7F5)  */}
      {/* Retry Text: Rich Charcoal / Ink Black (--text-primary / #111111)    */}
      {/* =================================================================== */}
      {isDisplayingError ? (
        <div
          role="alert"
          aria-label="Image loading failed"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-[#F7F7F5] select-none"
        >
          <div className="w-12 h-12 rounded-full border border-[#DFDFDC] bg-[#EBEBE8] flex items-center justify-center mb-3 text-[#888888] shadow-sm">
            <AlertCircle className="w-5 h-5 stroke-[1.5]" />
          </div>
          <p className="font-serif italic text-base text-[#111111] leading-snug">
            {fallbackTitle}
          </p>
          <p className="font-sans text-xs text-[#888888] mt-1 max-w-[220px] leading-relaxed">
            {fallbackDescription}
          </p>

          {showRetryButton && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={isRetrying}
              aria-label="Retry image download"
              className={cn(
                "mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full",
                "border border-[#DFDFDC] bg-[#F7F7F5] text-xs font-sans font-semibold uppercase tracking-wider text-[#111111]",
                "shadow-sm transition-all duration-300 hover:bg-[#111111] hover:text-[#F7F7F5] hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] active:scale-95 disabled:opacity-60",
              )}
            >
              <RotateCw
                className={cn(
                  "w-3.5 h-3.5 stroke-[2] text-current",
                  isRetrying && "animate-spin",
                )}
              />
              <span>{isRetrying ? "Retrying..." : "Retry Image"}</span>
            </button>
          )}
        </div>
      ) : shouldUseNextImage ? (
        /* Fallback for external non-Cloudinary images */
        <Image
          key={`next-${effectiveSrc}-${retryKey}`}
          src={effectiveSrc}
          alt={alt}
          fill={isFillLayout}
          width={finalWidth}
          height={finalHeight}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : loading}
          onLoad={(e) => {
            setIsLoaded(true);
            setHasError(false);
            onLoad?.(e);
          }}
          onError={(e) => {
            setHasError(true);
            setIsLoaded(false);
            onError?.(e);
          }}
          className={cn(
            "object-cover transition-opacity duration-700 ease-out",
            isLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
        />
      ) : (
        /* Cloudinary Optimized Image with auto-format and auto-quality */
        <CldImage
          key={`cld-${effectiveSrc}-${retryKey}`}
          src={effectiveSrc}
          alt={alt}
          format={format}
          quality={quality}
          fill={isFillLayout}
          width={finalWidth}
          height={finalHeight}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : loading}
          onLoad={(e) => {
            setIsLoaded(true);
            setHasError(false);
            onLoad?.(e);
          }}
          onError={(e) => {
            setHasError(true);
            setIsLoaded(false);
            onError?.(e);
          }}
          className={cn(
            "object-cover transition-opacity duration-700 ease-out",
            isLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
          {...rest}
        />
      )}
    </div>
  );
}

export default OptimizedImage;
