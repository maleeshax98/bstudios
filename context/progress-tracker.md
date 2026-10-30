# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 2: Headless CMS Architecture & Content Management

## Current Goal

- Contact Us Feature 03: Adding Google Map to Contact Page completed and verified.

## In Progress

- None.

## Next Up

- Next milestone feature awaiting user instruction.

## Completed

- Contact Us Feature 03: Adding Google Map to Contact Page (`context/feature-specs/contact-us/03-adding-map.md`):
  - Created `ContactMap` component (`components/contact/contact-map.tsx`) with export alias (`components/contact-map.tsx`).
  - Integrated Google Maps iframe embed using the exact embed URL and attributes provided (`src="https://www.google.com/maps/embed?pb=..."`, `loading="lazy"`, `referrerPolicy="strict-origin-when-cross-origin"`, `style={{ border: 0 }}`).
  - Structured within an editorial container (`max-w-[1720px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-24`) matching the Contact Page grid margins.
  - Added editorial section header ("STUDIO LOCATION // VISIT US", "OUR STUDIO") with interactive "Open in Google Maps" deep link pointing to B'sTudio on Google Maps.
  - Added dark theme filter support (`dark:contrast-[1.1] dark:invert-[0.9] dark:hue-rotate-180`) preventing bright white canvas flash in dark mode while preserving natural colors in light mode.
  - Placed `<ContactMap />` in `app/contact/page.tsx` directly above `<Footer />`.
  - Verification:
    - TypeScript strict check (`pnpm exec tsc --noEmit`): passed with 0 errors.
    - ESLint check (`pnpm lint`): passed with 0 errors.
    - Webpack production build (`pnpm exec next build --webpack`): compiled all 14 routes successfully with static prerendering on `/contact`.

- Contact Page and Footer UI Enhancements & Security Hygiene:
  - Added `"Other Service"` option to `CORE_SERVICES` in `components/contact/contact-page.tsx`.
  - Added dark mode hover contrast styles (`dark:hover:text-white`) to email, telephone, WhatsApp, and social media links in `components/contact/contact-page.tsx` and `components/footer.tsx`.
  - Updated contact input placeholder to `"Email/Phone"`.
  - Added `app/api/webhooks/**/test.md` to `.gitignore` to protect sensitive local webhook debug payloads from being committed.
  - Kept `youtube-video-link` strictly isolated from Prisma and Clerk dependencies.

- Works Page Feature 03: Showing YouTube Videos in Album (`context/feature-specs/works-page/03-adding-youtube-videos.md`):
  - Sanity Schema & TypeGen Integration:
    - Inspected `albumType` schema (`studio/schemaTypes/albumType.ts`) confirming the `youtubeLinks` array of strings field.
    - Updated `bstudio/sanity/queries.ts` to include `youtubeLinks` in `ALBUM_BY_SLUG_QUERY`, `ALBUMS_QUERY`, and `PAGINATED_ALBUMS_QUERY`.
    - Ran `pnpm run typegen` in `studio/`, extracting schema and generating updated TypeScript types (`ALBUM_BY_SLUG_QUERY_RESULT` with `youtubeLinks: Array<string> | null`) in `bstudio/sanity.types.ts`.
  - YouTube Link Parsing & Utilities (`bstudio/lib/youtube.ts`):
    - Created `getYouTubeVideoId(url)` supporting all YouTube URL formats (standard watch URLs, short youtu.be, embed, shorts, live, mobile, with query params, or raw 11-char IDs).
    - Created `getYouTubeEmbedUrl(videoId, options)` providing privacy-enhanced `youtube-nocookie.com` embed URLs with `rel=0` and `modestbranding=1`.
    - Created `getYouTubeThumbnailUrl(videoId, quality)` returning `maxresdefault.jpg` with fallback support.
    - Updated `next.config.ts` to allow `img.youtube.com` and `i.ytimg.com` in `images.remotePatterns`.
  - Server-Side Data Fetching (`bstudio/app/album/[slug]/page.tsx`):
    - Updated `AlbumContent` to parse `album.youtubeLinks` into `MediaItem` models with `provider: "youtube"`, `youtubeId`, and high-res previews.
    - Combined parsed YouTube videos and Cloudinary videos into unified `videos` list.
    - Updated `generateMetadata` with defensive OpenGraph image fallback to YouTube video thumbnail when album thumbnail is not specified.
  - Interactive Editorial Gallery Component (`bstudio/components/album/album-gallery.tsx`):
    - Created `YouTubePlayerCard` component using the high-performance facade pattern: renders crystal-clear YouTube HD thumbnail (`maxresdefault.jpg` with `hqdefault.jpg` error fallback), dark gradient scrim, centered tactile Play button, and editorial badges (`Film 01`, `YouTube`).
    - One-click inline playback: clicking the card or play button instantly activates the embedded responsive YouTube video player with `autoplay=1` without reloading or page jumping.
    - Full-Screen Lightbox Theater Mode: clicking the expand button or navigating to the video opens the full-screen modal Lightbox rendering a theater-scale embedded YouTube player (`w-[92vw] max-w-5xl aspect-video`) with clean unmount on exit.
    - Widescreen Video Grid Layout: When switching to `[ VIDEOS ]`, single videos are presented in a centered cinematic hero container (`max-w-4xl mx-auto`), pairs in a balanced 2-column grid (`max-w-5xl mx-auto`), and 3+ in a responsive grid (`max-w-7xl mx-auto`), avoiding narrow CSS masonry column distortion.
    - Empty state refined to inform users when an album has no videos linked yet.
  - Verification:
    - TypeScript strict check (`pnpm exec tsc --noEmit`): passed with 0 errors.
    - ESLint check (`pnpm lint`): passed with 0 errors.
    - Production build (`pnpm exec next build --webpack`): compiled all 14 routes successfully.
    - Studio TypeScript check (`pnpm exec tsc --noEmit` in `studio/`): passed with 0 errors.
    - Dev server runtime check: verified live on `http://localhost:3000/album/ane-pancho-youtube-seen-eka-pakaya` returning HTTP 200 with both YouTube video IDs (`b4nCfZ_YfS4` and `CMQSJrTWLMw`) and responsive video player components.

- Feature 17: Changing Selected Work UI in Home Page (`context/feature-specs/17-changing-selected-work-ui.md`):
  - Updated `<SelectedWorks />` component (`components/selected-works.tsx`):
    - Converted project image presentation from a split side-by-side card to a full-bleed cinematic background image (`absolute inset-0 w-full h-full`) utilizing `<OptimizedImage fill sizes="100vw" ... />`.
    - Added dual gradient scrims (bottom-up `bg-gradient-to-t from-black/90 via-black/45 to-black/20` and left-to-right `bg-gradient-to-r from-black/70 via-black/25 to-transparent`) ensuring strong text contrast and legibility over photos.
    - Repositioned project text to the bottom left within the standard editorial grid (`max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-12 sm:pb-16 lg:pb-20`).
    - Styled typography for the background-image aesthetic:
      - Category & Year Eyebrow: `font-serif italic text-white/75` with subtle dot indicator.
      - Structural Title: `font-sans font-black text-white` uppercase display scaling up to `text-8xl`.
      - Editorial Description: `font-serif italic sm:font-normal text-white/80 max-w-xl`.
      - "View Project" CTA Button: pill button with stroke `ArrowUpRight`, styled in `border-white/30 bg-black/40 hover:bg-white hover:text-black text-white backdrop-blur-sm`.
    - Added a subtle floating index badge at the top-right corner (`{project.index} / {totalCountFormatted}`).
    - Updated GSAP ScrollTrigger timeline:
      - Initial state: image scales at 1.06 with opacity 0; text translates at `y: 40` with opacity 0.
      - Entry: image settles smoothly to `scale: 1` and `opacity: 1`, text glides up to `y: 0` and `opacity: 1`.
      - Hold: still in viewport for user engagement and interaction.
      - Exit: smooth scale and fade transition out before next slide arrives.
  - Verification:
    - TypeScript strict check (`pnpm exec tsc --noEmit`): passed with 0 errors.
    - ESLint (`pnpm lint`): passed with 0 errors.
    - Production build (`pnpm exec next build --webpack`): compiled all 14 routes successfully.

- Sanity Live Content Integration Across Codebase (`context/error/02-adding-sanity-live.md`):
  - Phase 1 & 2 Audit & Research:
    - Confirmed Next.js 16.4.3 and `next-sanity` 13.4.0 with React 19.3.0.
    - Verified that experimental `"use cache"` and `cacheComponents` are disabled, eliminating previous module-scoped deadlock issues.
    - Verified Sanity Live architecture (`defineLive`, `sanityFetch`, `<SanityLive />`).
  - Phase 3 Shared Live Infrastructure:
    - Updated `sanity/client.ts` with `useCdn: true` and environment fallbacks (`brst44qi`, `production`).
    - Configured `sanity/live.ts` with `defineLive`: server-only token support (`SANITY_API_READ_TOKEN` / `SANITY_API_TOKEN`), viewer-safe browser token (`NEXT_PUBLIC_SANITY_API_READ_TOKEN`), never exposing write credentials.
    - Integrated `<SanityLive />` globally in `app/layout.tsx` within `ThemeProvider`.
  - Phase 4 Data-Fetching Migration:
    - Migrated all Sanity data-fetching to `sanityFetch`:
      - `app/page.tsx`: `SERVICES_QUERY`, `COLORGRADING_QUERY`, `FEATURED_ALBUMS_QUERY`, `WEDDING_ALBUMS_QUERY`.
      - `app/works/page.tsx`: `PAGINATED_ALBUMS_QUERY`, `CATEGORIES_QUERY`.
      - `app/services/page.tsx`: `SERVICES_QUERY`.
      - `app/packages/page.tsx`: `CATEGORIES_QUERY`, `PACKAGES_QUERY`.
      - `app/album/[slug]/page.tsx`: `ALBUM_BY_SLUG_QUERY` across page content and `generateMetadata`.
      - `lib/actions.ts`: `fetchMoreAlbums` server action with `PAGINATED_ALBUMS_QUERY`.
    - Maintained strict write client separation in `app/api/contact/route.ts`.
  - Phase 5 Caching Resolution:
    - Removed brute-force `export const dynamic = "force-dynamic"` and `export const revalidate = 0` from routes, restoring Next.js tag-based ISR (`revalidate = 60`).
    - Configured queries with `stega: false` to guarantee pure, clean TypeScript TypeGen types.
  - Phase 6 & 7 Verification & Live Update Diagnostics:
    - Created custom server action `sanity/action.ts` (`revalidateAndRefresh`) that revalidates tags (`revalidateTag(tag, "max")`), clears layout paths (`revalidatePath("/", "layout")`), and explicitly returns `"refresh"`. In `next-sanity` v13, default action returns `undefined` in dev, preventing `router.refresh()` from running.
    - Wired `<SanityLive action={revalidateAndRefresh} />` in `app/layout.tsx`.
    - Added prop synchronization `useEffect` hooks in `components/works/works-page.tsx` and `components/packages/packages-page.tsx` so server component re-renders properly update client component state.
    - Added `http://127.0.0.1:3000` to Sanity project `brst44qi` CORS origins alongside `http://localhost:3000`.
    - TypeScript compiler (`pnpm exec tsc --noEmit`): passed with 0 errors.
    - ESLint (`pnpm lint`): passed with 0 errors.
    - Production build (`pnpm exec next build --webpack`): compiled all 14 routes successfully.


- Bugfix: Runtime NotFoundError on Route Transitions (`context/error/01-cant-reach-the-pages.md`):
  - Root Cause Analysis:
    - In React 19 / Next.js 16, client-side route transitions unmount the previous page's component tree.
    - GSAP ScrollTrigger `pin: true` structurally wraps pinned elements in dynamically injected `<div class="pin-spacer">` wrappers.
    - The pinned sections (`PinnedScrollText`, `SelectedWorks`, `Philosophy`, `ServicesExhibition`, `ClientSpaceTeaser`, `ColorGradeLookbook`) were returning `<section ref={...}>` as the top-level host node directly under `<main>`.
    - Because components were relying on `React.useEffect` for teardown, passive effect cleanup runs *after* React's commit deletion phase (`commitDeletionEffects`).
    - When React attempted to execute `main.removeChild(section)`, `<section>` was physically nested inside `.pin-spacer` rather than `<main>`, throwing `NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node at section`.
  - Resolution Architecture:
    - Created `useIsomorphicLayoutEffect` hook (`lib/hooks.ts`) using `React.useLayoutEffect` on client to guarantee synchronous teardown before React's DOM deletion phase.
    - Updated all 6 pinned Home page components (`PinnedScrollText`, `SelectedWorks`, `Philosophy`, `ServicesExhibition`, `ClientSpaceTeaser`, `ColorGradeLookbook`) plus `PinnedScrollText2` and `AboutDirectorsCut`:
      - Switched from `React.useEffect` to `useIsomorphicLayoutEffect` so `ctx.revert()` unwraps `.pin-spacer` before React touches the DOM.
      - Wrapped the pinned `<section>` elements within a static `<div className="relative w-full">` wrapper so the top-level host node managed by React is never reparented by GSAP.
      - Added `isMounted` cancellation guards to all `document.fonts.ready` promises and image `onLoad` handlers to prevent post-unmount `ScrollTrigger.refresh()` recalculations.
    - Synchronized Lenis on Route Changes (`components/smooth-scroll.tsx`):
      - Stored Lenis instance in `lenisRef` and attached a `pathname` listener.
      - Teleports scroll position instantly to top (`lenis.scrollTo(0, { immediate: true })`) and triggers `ScrollTrigger.refresh()` on route transition.
    - Resolved Turbopack Lenis CSS build issue by migrating `lenis.css` declarations into `app/globals.css`.
  - Verification:
    - TypeScript strict check (`pnpm exec tsc --noEmit`): passed with 0 errors.
    - ESLint check (`pnpm lint`): passed with 0 errors.
    - Production build (`pnpm run build`): compiled and prerendered all routes cleanly.

- Keep Scrolling Inactivity Indicator (`context/feature-specs/scroll-hint/01-keep-scrolling-indicator.md`):
  - Created `KeepScrollingIndicator` client component (`components/keep-scrolling-indicator.tsx`):
    - Positioned at `fixed bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-40`.
    - Automatically detects route via `usePathname()`, restricting appearance strictly to the Home page (`/`) and About Us page (`/about`).
    - 10-second idle countdown: tracks user scroll, wheel, and touchmove interactions; if inactive for 10 seconds, smoothly reveals the indicator.
    - Animated pulse effect: badge features `animate-pulse` and refined editorial styling (`bg-bg-surface/90 text-text-primary border border-border-subtle shadow-xl backdrop-blur-md`).
    - Bottom-of-page suppression: automatically prevents showing if user is already at the bottom of the document.
    - Interactive click: clicking smoothly scrolls down the viewport by 75vh and dismisses the prompt.
    - Hydration-safe mounting via `useSyncExternalStore` adhering to React 19 rules and avoiding cascading render warnings.
  - Integrated into root layout (`app/layout.tsx`) inside `ThemeProvider`.
  - Verification:
    - TypeScript strict check (`pnpm exec tsc --noEmit`): passed with 0 errors.
    - ESLint check (`pnpm lint`): passed with 0 errors.


- Theme Toggle Feature: Dynamic Theme Switching & Floating Toggle Button (`context/feature-specs/toggel-theme/01-toggle-theme.md`):
  - Installed `next-themes` and implemented `ThemeProvider` wrapper (`components/theme-provider.tsx`) with `attribute="class"`, `defaultTheme="system"`, and `enableSystem={true}`.
  - Implemented `FloatingThemeToggle` client component (`components/floating-theme-toggle.tsx`):
    - Positioned at `fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50`.
    - Sleek circular high-contrast design (`w-12 h-12 lg:w-14 lg:h-14`, `bg-text-primary text-bg-base`, `border border-border-subtle shadow-2xl`).
    - Lucide `Sun` and `Moon` stroke icons with smooth rotation and scale transitions (`duration-500 ease-in-out`).
    - Tactile hover interactions with GSAP magnetic pull on mouse move and elastic snap-back on leave.
    - Hydration-safe mounting using `useSyncExternalStore` to avoid cascading render lint issues in React 19.
  - Defined `.dark` theme variables in `app/globals.css` ensuring seamless inversion of `--bg-base`, `--bg-surface`, `--bg-subtle`, `--text-primary`, `--border-subtle`, and shadcn tokens adhering to `@custom-variant dark (&:is(.dark *));`.
  - Integrated `ThemeProvider` and `FloatingThemeToggle` in `app/layout.tsx` with `suppressHydrationWarning`.
  - Verification:
    - TypeScript strict mode: `pnpm exec tsc --noEmit` passed with 0 errors.
    - ESLint: `pnpm lint` passed with 0 errors.
    - Production build: `pnpm build` compiled and prerendered all 24 routes cleanly.
    - Runtime check: Verified live on `localhost:3000` via browser subagent click test toggling themes smoothly.

- Packages Feature: Make Pricing Big & Redirect Inquire Button to WhatsApp:
  - Enhanced Pricing Scale (`components/packages/packages-page.tsx`):
    - Scaled pricing typography to prominent brutalist display size (`text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight leading-none text-text-primary mt-4`), providing immediate visual hierarchy and impact on each card.
  - WhatsApp Direct Inquiry Integration (`components/packages/packages-page.tsx`):
    - Replaced the `/contact` form redirect on the package card inquiry button (`[ INQUIRE NOW ]`) with a direct WhatsApp deep link (`https://wa.me/94704028206?text=...`) targeting studio number `+94 70 402 8206`.
    - Automatically pre-composes a professional inquiry message detailing the specific package name, category, and price (e.g. `Hi B studio, I would like to inquire about the "VINTAGE" package (PRE SHOOT - Rs. 20000).`).
    - Updated empty-state inquiry button (`[ REQUEST BESPOKE QUOTE ]`) to also redirect to WhatsApp with a pre-filled bespoke request for the selected category (`Hi B studio, I would like to inquire about bespoke packages for ${category}.`).
    - Configured with `target="_blank"` and `rel="noopener noreferrer"`.
    - Removed unused `Link` import from `next/link`.
  - Verification:
    - TypeScript: `pnpm exec tsc --noEmit` passed with 0 errors.
    - ESLint: `pnpm lint` passed with 0 errors.
    - Production build: `pnpm build` in `bstudio/` compiled and prerendered all 24 routes cleanly.
    - Runtime check: Verified live curl on `http://localhost:3000/packages` returning WhatsApp deep links with URL-encoded messages.

- Packages Feature 02: Recreating packages page (`context/feature-specs/packages/02-recreating-packages.md`):
  - Analyzed `packageType` in Sanity schema (`studio/schemaTypes/packageType.ts`):
    - Identified fields: `title`, `category` (reference to `category`), `description`, `deliverables` (array of strings), `price`, `badge`, `order`.
    - Corrected preview selection in `packageType.ts` from `serviceCategory` to `category.title`.
  - Added Navbar Link:
    - Updated `NAV_ITEMS` in `components/navbar.tsx` with `{ label: "Packages", href: "/packages", index: "03" }`, re-indexing subsequent items (`About` as "04", `Contact` as "05").
    - Verified dynamic integration across both desktop navigation bar and full-screen mobile navigation overlay.
  - Category Fetching & Selection:
    - Implemented `CATEGORIES_QUERY` fetching all categories from Sanity (`*[_type == "category"] | order(title asc)`).
    - Designed non-horizontal-scroll category tabs that break lines naturally on any screen size using `flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5`.
    - Rendered active tab indicators in `bg-bg-surface text-[#111111] font-black shadow-xs ring-1 ring-border-subtle` and inactive tabs in `text-[#888888] hover:text-[#111111]`.
  - Relevant Packages Fetching & Filtering:
    - Updated `PACKAGES_QUERY` and `PACKAGES_BY_CATEGORY_QUERY` in `bstudio/sanity/queries.ts` to dereference `category->{ _id, title }`.
    - Extracted schema and regenerated TypeScript types via `pnpm run typegen` in `studio/`.
    - Server Component (`app/packages/page.tsx`): Marked `getPackagesPageData()` with `"use cache"` fetching both `CATEGORIES_QUERY` and `PACKAGES_QUERY` in parallel.
    - Component filtering: Synchronously filters relevant packages matching selected category `_id` or `title`, with client-side fallback query `PACKAGES_BY_CATEGORY_QUERY` if not already loaded.
  - Centered Layout & Empty State Message:
    - Packages cards layout: Uses responsive flex system (`flex flex-wrap justify-center items-stretch gap-8 sm:gap-10 lg:gap-12 max-w-7xl mx-auto`) with individual card constraints (`w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-2rem)] max-w-md`), ensuring 1, 2, or 3 cards are always centered in the viewport.
    - Empty state message: When a selected category has 0 packages (e.g. `BIRTHDAY`), displays an elegant centered card with `PackageOpen` icon, Serif headline ("No packages available for this category yet."), custom consultation copy, and direct `[ REQUEST BESPOKE QUOTE ]` CTA button linking to `/contact?service=${categoryTitle}`.
  - Verification:
    - TypeScript: `pnpm exec tsc --noEmit` passed with 0 errors.
    - ESLint: `pnpm lint` passed with 0 errors.
    - Next.js build: `pnpm build` in `bstudio/` compiled and prerendered all 24 routes cleanly.
    - Sanity Studio build: `pnpm build` in `studio/` passed in 226ms.
    - Runtime check: Verified live curl HTTP 200 on `/packages`, verified rendered Sanity categories (`[ BIRTHDAY ]`, `[ PRE SHOOT ]`, `[ WEDDING ]`), packages, and navbar links.

- Contact Us Feature 02: Add WhatsApp Number (`context/feature-specs/contact-us/02-adding-wtsapp.md`):
  - Added WhatsApp number `+94 70 402 8206` with direct chat link (`https://wa.me/94704028206`) to:
    - Minimalist Site Footer (`components/footer.tsx`): Positioned within the sub-footer row between copyright and social links, styled with bold uppercase tag and interactive arrow icon.
    - Dedicated Contact Page (`components/contact/contact-page.tsx`): Integrated as a first-class studio detail block (WHATSAPP) alongside Email, Phone, Studio Location, and Socials.
    - Conversational Contact Form (`components/contact-form.tsx`): Integrated into direct inquiry helper metadata.
    - Mobile Navigation Menu (`components/navbar.tsx`): Added to mobile overlay bottom info alongside email.
  - Verification:
    - TypeScript: `pnpm exec tsc --noEmit` passed with 0 errors.
    - ESLint: `pnpm lint` passed with 0 errors.
    - Production build: `pnpm build` compiled and prerendered all 24 routes cleanly.
    - Runtime check: Verified live curl HTTP 200 and WhatsApp link on `/` and `/contact`.

- Backend Feature 10: Saving Contact Data to Sanity (`context/feature-specs/backend/10-saving-contact-data.md`):
  - Created Sanity document schema `contactSubmissionType` in `studio/schemaTypes/contactSubmission.ts`:
    - Document type `contactSubmission`.
    - Fields: `name` (required string), `email` (required email string), `service` (required radio/list of 6 core services: Preshoot, Casual Shoot, Birthday Shoot, Engagement Shoot, Wedding Shoot, Promotion Video), `eventDate` (required string date/timeframe), `status` (read-only string defaulting to `"New"`), and `submittedAt` (read-only datetime timestamp defaulting to current ISO time).
    - Added custom Sanity Studio preview displaying client name, requested service, date, and lead status.
    - Registered schema in `studio/schemaTypes/index.ts`.
    - Ran `pnpm run typegen` in `studio/`, extracting schema and generating TypeScript types in `bstudio/sanity.types.ts`.
    - Verified Sanity Studio build (`pnpm build` in `studio/` passing cleanly in 238ms).
  - Implemented Next.js Server-Side API Route (`bstudio/app/api/contact/route.ts`):
    - App Router POST request handler using Next.js conventions (`NextResponse`).
    - Validates incoming JSON payload (`name`, `email`, `service`, `eventDate` / `date`).
    - Securely initializes Sanity write client using server-only `SANITY_API_TOKEN` environment variable with `useCdn: false`.
    - Inserts a new document of `_type: 'contactSubmission'` into the Sanity dataset.
    - Returns structured JSON response (`{ success: true, message: "Your story is safe with us. We will be in touch soon.", data: { id, name, email, service, eventDate, submittedAt } }`) with HTTP 201 Created.
  - Connected Frontend Contact Forms to `/api/contact`:
    - Updated `bstudio/components/contact/contact-page.tsx`: Asynchronously submits form payload to `/api/contact`, displays error messages on failure, and triggers smooth GSAP form dissolution into the editorial confirmation message on success.
    - Updated `bstudio/components/contact-form.tsx`: Asynchronously submits form payload to `/api/contact`, renders `"TRANSMITTING..."` button state, displays feedback messages, and renders `"INQUIRY SENT"` confirmation state on success.
  - Verification:
    - TypeScript strict check (`pnpm exec tsc --noEmit`) passed with 0 errors.
    - ESLint (`pnpm lint`) passed with 0 errors.
    - Production build (`pnpm build`) compiled and prerendered all 24 routes cleanly with dynamic route `ƒ /api/contact`.
    - Dev server validation test: Invalid payload returns HTTP 400 with `{ success: false, error: "Name is required." }`.
    - Live end-to-end integration test: Submitted valid payload via curl to `/api/contact`, successfully creating document `VdYqQiYvZQdrJTS4Fj4613` in Sanity dataset `production`.

- Backend Feature 09: Fetching and showing sample images in home page from Cloudinary (`context/feature-specs/backend/09-fetching-sample-images.md`):
  - Updated `searchCloudinaryWithCache()` in `bstudio/lib/cd.ts` to support dynamic `sortDirection: "asc" | "desc"` (defaulting to `"asc"` for existing callers).
  - Implemented `getSampleImages(limit = 12)` in `bstudio/lib/cd.ts`:
    - Searches `(asset_folder="SAMPLE-IMAGES-HOME-PAGE" OR asset_folder="SIHP") AND resource_type=image`.
    - Sorts by `created_at: "desc"` to fetch the 12 most recent images uploaded to the folder.
    - Caches responses locally with Next.js native `fetch` caching (`revalidate: 3600`) to avoid hitting Cloudinary API limits.
    - Provides resilient secondary fallback to Cloudinary SDK and empty array fallback on failure.
  - Updated `bstudio/app/page.tsx`:
    - Added `getSampleImages()` to `getHomeData()` marked with `"use cache"`.
    - Returned `sampleImages` and passed it as `initialImages` prop to `<SampleGallery initialImages={sampleImages} />`.
  - Updated `bstudio/components/sample-gallery.tsx`:
    - Accepts `initialImages?: CloudinaryResource[]`.
    - Dynamically maps Cloudinary resources to gallery items preserving exact image aspect ratios (`style={{ aspectRatio: `${item.width} / ${item.height}` }}`).
    - Replaced standard Next.js `<Image>` with `<OptimizedImage>` from `@/components/optimized-image` to provide automatic next-gen format and quality optimization (WebP/AVIF), skeleton pulsing loaders, and error retry states.
    - Retained pre-curated sample images as graceful fallback if Cloudinary returns 0 assets.
  - Verification:
    - TypeScript strict check (`pnpm exec tsc --noEmit`) passed with 0 errors.
    - ESLint (`pnpm lint`) passed with 0 errors.
    - Production build (`pnpm build`) compiled and prerendered all 23 routes cleanly with Partial Prerendering.
    - Dev server HTTP 200 OK verified on `/`, and Cloudinary public IDs verified in rendered HTML.

- Backend Feature 08: Client Space Fetch Wedding Albums from Sanity (`context/feature-specs/backend/08-client-space-fetch.md`):
  - Added `WEDDING_ALBUMS_QUERY` and `CLIENT_SPACE_ALBUMS_QUERY` in `bstudio/sanity/queries.ts` fetching the first 4 wedding albums (`*[_type == "album" && (lower(category->title) == "wedding" || category->title match "*wedding*")] | order(publishedAt desc, _createdAt desc)[0...4]`).
  - Executed `pnpm run typegen` in `studio/`, extracting schema and generating precise TypeScript query types `WEDDING_ALBUMS_QUERY_RESULT` and `CLIENT_SPACE_ALBUMS_QUERY_RESULT` in `bstudio/sanity.types.ts`.
  - Updated `bstudio/app/page.tsx`:
    - Added `WEDDING_ALBUMS_QUERY` to `getHomeData()` marked with `"use cache"` and resilient `try/catch` fallback.
    - Passed `weddingAlbums` as `initialAlbums` prop to `<ClientSpaceTeaser />`.
  - Updated `bstudio/components/client-space-teaser.tsx`:
    - Accepts `initialAlbums?: WEDDING_ALBUMS_QUERY_RESULT`.
    - Dynamically maps Sanity wedding albums to the `PersonalAlbum` model (`id`, `galleryId`, `client`, `shootType`, `assetCount`, `src`, `alt`, `slug`, `link`).
    - Integrates `<OptimizedImage>` with Cloudinary auto-format/auto-quality CDN optimization, skeleton loading states, and retry handling.
    - Wraps cards with Next.js `<Link>` for direct navigation to `/album/${slug}`.
    - Dynamically links the primary "VIEW SAMPLE ALBUM" CTA to the first wedding album or `/works`.
    - Preserves pre-curated sample albums as fallback if fewer than 4 wedding albums exist in Sanity, preserving the 4-card spread animation without breaking layout or GSAP mechanics.
  - Verification:
    - `pnpm exec tsc --noEmit` passed with 0 errors.
    - `pnpm lint` passed with 0 errors.
    - `pnpm build` passed compiling all 23 routes cleanly with Partial Prerendering.
    - Dev server HTTP 200 OK verified on `/`.

- Backend Feature 07: Featured Works from Sanity on Home Page (`context/feature-specs/backend/07-featured-works.md`):
  - Analyzed `albumType` schema in Sanity (`studio/schemaTypes/albumType.ts` and `bstudio/sanity.types.ts`), identifying the `isFeatured` boolean flag.
  - Added `FEATURED_ALBUMS_QUERY` to `bstudio/sanity/queries.ts` filtering for `*[_type == "album" && isFeatured == true]` ordered by `publishedAt desc, _createdAt desc`.
  - Ran `pnpm run typegen` in `studio/`, extracting schema and generating precise TypeScript query types (`FEATURED_ALBUMS_QUERY_RESULT`) in `bstudio/sanity.types.ts`.
  - Updated `components/selected-works.tsx` (`SelectedWorks`):
    - Accepts `initialWorks?: FEATURED_ALBUMS_QUERY_RESULT`.
    - Dynamically maps Sanity album documents to slide models (`id`, `title`, `category`, `year`, `description`, `image`, `link` pointing to `/album/${slug}`).
    - Dynamically calculates the GSAP ScrollTrigger pinning travel distance based on `projects.length + 1`.
    - Dynamically updates the section intro counter (`01 — XX / Selected Works`).
    - Uses `<OptimizedImage>` with Cloudinary auto-format/auto-quality CDN optimization, external image fallback, and retry handling.
    - Preserves pre-curated sample projects as fallback if Sanity has 0 featured albums or during connection timeouts.
  - Updated `app/page.tsx`:
    - Added `FEATURED_ALBUMS_QUERY` to `getHomeData()` with `"use cache"` and resilient `try/catch` fallback.
    - Passed `featuredWorks` as `initialWorks` prop to `<SelectedWorks />`.
  - Verification:
    - `pnpm exec tsc --noEmit` passed with 0 errors.
    - `pnpm lint` passed with 0 errors.
    - `pnpm build` passed compiling all 23 routes cleanly with Partial Prerendering.
    - Dev server HTTP 200 OK verified on `/`.

- Complete Removal of `@sanity/live` Across Next.js Codebase (`context/feature-specs/backend/06-removing-sanity-live.md`):
  - Ripped out all real-time live preview dependencies (`@sanity/live` / `defineLive` / `sanityFetch` / `<SanityLive />`) across the entire repository.
  - Eliminated module-scoped caching in `sanityFetch` which caused deadlock errors ("A 'use cache' function is awaiting a promise created outside it") with Next.js's native `"use cache"` directive.
  - Switched data fetching across all routes to standard HTTP queries via `client.fetch(QUERY, params)` from `@/sanity/client`.
  - Updated data destructuring from `{ data: T }` wrappers to direct raw results `T` (`app/page.tsx`, `app/works/page.tsx`, `app/packages/page.tsx`, `app/album/[slug]/page.tsx`, `lib/actions.ts`).
  - Added resilient `try/catch` error handling with fallback states for network resilience during prerendering and ISR.
  - Removed `<SanityLive />` component and import from `app/layout.tsx`.
  - Deleted `sanity/live.ts` configuration file completely.
  - Verification:
    - `pnpm exec tsc --noEmit` passed with 0 errors.
    - `pnpm lint` passed with 0 errors.
    - `pnpm build` passed compiling and generating all 23 routes cleanly with Partial Prerendering.
    - Dev server HTTP 200 checks verified on `/`, `/works`, `/services`, `/packages`, and `/album/sakkili-miya-pakaya`.

- Next.js 16 `"use cache"` Promise Serialization Fix for `/services` Route:
  - Scanned for module-scoped caching wrappers (`sanityFetch` from `next-sanity/live` generated via `defineLive`).
  - Removed custom deduplication/live sync wrapper around the data fetcher, eliminating external promise state leakage into the experimental `"use cache"` boundary.
  - Instantiated and awaited the raw Sanity client fetch (`client.fetch(SERVICES_QUERY)`) directly within the `getServicesData` function marked with `"use cache"`.
  - Guaranteed `getServicesData` receives no un-serializable promises and returns serializable data (`SERVICES_QUERY_RESULT`).
  - Verified with `pnpm tsc --noEmit` (0 errors), `pnpm lint` (0 errors), and runtime curl HTTP 200 on `/services`.

- Works Page Loading & Error State Fix (`context/feature-specs/works-page/02-loading-error.md`):
  - Next.js 16 `"use cache"` Promise Deadlock Resolution:
    - Resolved `UseCacheDeadlockError` ("Route '/album/[slug]': A 'use cache' function is awaiting a promise created outside it") on `/album/[slug]`.
    - Identified that `generateMetadata` was calling the `"use cache"` data fetcher `getAlbumData()` while running inside `Next.MetadataOutlet` concurrently with `AlbumContent`, causing cross-scope promise await conflicts during Next.js 16 Partial Prerendering and dev server probe scheduling.
    - Updated `generateMetadata()` to be marked directly with `"use cache"` and fetch metadata directly using `client.fetch(ALBUM_BY_SLUG_QUERY, { slug })`, isolating metadata caching from component tree rendering and eliminating deadlock.
    - Updated `getAllAlbumSlugs()` to fetch slugs directly via `client.fetch(ALBUM_SLUGS_QUERY)` for `generateStaticParams()`, removing unnecessary nested cache layers.
    - Removed `"use cache"` from `getCachedAlbumMedia(folderName)` since `lib/cd.ts`'s `searchCloudinaryWithCache()` already natively caches API responses via Next.js Data Cache (`revalidate: 3600`), eliminating redundant cache layering over Server Actions.
  - Minimalist Pure White Loading State Restoration:
    - Restored `AlbumFallback` to the full-screen pure white canvas (`fixed inset-0 z-50 flex items-center justify-center bg-white select-none`) displaying centered, understated `loading...` text (`font-serif italic text-sm text-text-muted lowercase tracking-widest animate-pulse`).
    - Seamless transition into the welcome title sequence intro without layout shift, visual flashing, or jarring gray skeleton blocks.
  - Cleaned debug code and removed unused `SkeletonCard` import.
  - Verification:
    - `pnpm exec tsc --noEmit` passed with 0 errors.
    - `pnpm lint` passed with 0 errors.
    - `pnpm build` passed compiling all 17 routes with Partial Prerendering.
    - Dev server HTTP 200 OK verified on `/album/sakkili-miya-pakaya`.

- Reusable `OptimizedImage` Component with Cloudinary Optimization & Retry Logic (`context/feature-specs/backend/05-retry-images.md`):
  - Cloudinary Integration & Auto-Optimization:
    - Created `components/optimized-image.tsx` using `next-cloudinary`'s `<CldImage>` configured with `format="auto"` and `quality="auto"` to seamlessly serve lightweight formats dynamically (WebP/AVIF).
    - Created alias export in `components/ui/optimized-image.tsx`.
    - Supports both Cloudinary public IDs and CDN URLs, with defensive fallback handling for external images via Next.js `<Image>`.
  - Skeleton Loader State:
    - Implemented skeleton loader using Tailwind's `animate-pulse` with muted background (`#EBEBE8`) and subtle indicator shapes (`#DFDFDC`) that displays while the image is downloading.
  - Error Tracking & Retry Mechanism:
    - Tracks image loading state with React 19 compiler-compliant state synchronization.
    - If `<CldImage>` fires `onError`, immediately hides the broken image and displays an accessible Off-Light fallback card.
    - Includes a subtle, elegant "Retry Image" button using crisp Sans-Serif font (`font-sans font-semibold uppercase tracking-wider`).
    - Updates `retryKey` state and appends cache-busting timestamp to force a fresh re-render and network download attempt, with animated spinning icon indicator while retrying.
  - Theme Enforcement (Cinematic Off-Light):
    - Error state background strictly locked to Cinematic Off-White / Warm Pearl (`--bg-base` / `#F7F7F5`).
    - Retry button text strictly set to Rich Charcoal / Ink Black (`--text-primary` / `#111111`) with hairline `#DFDFDC` borders and smooth hover inversion.
  - Project Integration:
    - Updated `components/album/album-gallery.tsx` (`LazyGalleryImage`) to leverage `OptimizedImage` for seamless gallery grid rendering.
  - Verification:
    - `pnpm exec tsc --noEmit` passed with 0 errors.
    - `pnpm lint` passed with 0 errors.
    - `pnpm build` passed compiling all 17 routes with Partial Prerendering.
    - Dev server HTTP 200 checks on `/` and `/album/sakkili-miya-pakaya`.

- Cloudinary Image Optimization and Next.js Caching (`context/feature-specs/backend/04-optimizing-images.md`):
  - Server-Side Data Caching (`bstudio/lib/cd.ts` & `bstudio/app/album/[slug]/page.tsx`):
    - Implemented `searchCloudinaryWithCache()` wrapping the Cloudinary Search API via Next.js native `fetch` caching mechanism with `revalidate: 3600` (1-hour cache), caching the array of media items locally without hitting Cloudinary on every page load.
    - Updated `app/album/[slug]/page.tsx` server component with cached media retrieval `getCachedAlbumMedia(folderName)` using `"use cache"` and native cached fetch.
    - Added resilient fallback to Cloudinary SDK when native fetch encounters connection limitations.
    - Hardened `generateStaticParams` in `app/album/[slug]/page.tsx` to provide fallback slugs preventing build validation errors when using Cache Components.
  - Frontend Image Rendering with `next-cloudinary` (`bstudio/components/album/album-gallery.tsx`):
    - Replaced standard Next.js `<Image>` tags with `<CldImage>` for gallery grid thumbnails and lightbox media.
    - Configured auto-format (`format="auto"`) and auto-quality (`quality="auto"`) for serving next-gen WebP/AVIF formats directly from the CDN.
    - Handled CDN lazy loading with responsive `sizes` attribute.
    - Retained the `SkeletonCard` UI state using Tailwind's `animate-pulse` on the muted `#EBEBE8` background while images are being requested or dynamically paginated.
  - Theme Enforcement (Cinematic Off-Light):
    - Locked wrapper elements and fallback screens into `--bg-base` (`#F7F7F5`) with `#EBEBE8` stone surfaces and zero dark mode styling.
  - Verification:
    - `pnpm exec tsc --noEmit` passed with 0 errors.
    - `pnpm lint` passed with 0 errors.
    - `pnpm build` passed compiling all 17 routes with Partial Prerendering.

- Fetching Services and Colorgrading from Sanity (`context/feature-specs/backend/03-fetching-services.md`):
  - Sanity Queries & TypeGen (`bstudio/sanity/queries.ts` & `bstudio/sanity.types.ts`):
    - Added `SERVICES_QUERY` (`*[_type == "services"] | order(publishedAt asc, _createdAt asc)`) fetching `_id, title, subTitle, description, image, slug, publishedAt`.
    - Added `COLORGRADING_QUERY` (`*[_type == "colorgrading"] | order(publishedAt asc, _createdAt asc)`) fetching `_id, title, subTitle, description, image, slug, publishedAt`.
    - Executed `pnpm run typegen` in `studio/` extracting schema and generating TypeScript types `SERVICES_QUERY_RESULT` and `COLORGRADING_QUERY_RESULT` in `bstudio/sanity.types.ts`.
  - Defensive Asset URL Cleaning:
    - Implemented `cleanImageUrl()` helper handling image URL string cleaning across Cloudinary and CMS assets, safely stripping accidental trailing prose or whitespace.
  - Component Dynamic Data Integration:
    - Updated `components/services-exhibition.tsx` (`ServicesExhibition`) to accept `initialServices?: SERVICES_QUERY_RESULT`, derive `services` with dynamic indexing and count badge (`Services // 01 — XX`), recalculating GSAP horizontal track scroll triggers on data load.
    - Updated `components/color-grade-lookbook.tsx` (`ColorGradeLookbook`) to accept `initialLookbook?: COLORGRADING_QUERY_RESULT`, derive `themes` with dynamic count badge (`Lookbook // 01 — XX`), recalculating GSAP horizontal track scroll triggers on data load.
    - Updated `components/services/services-horizontal.tsx` (`ServicesVertical`) to accept `initialServices?: SERVICES_QUERY_RESULT`, mapping to `ServicePanel` models with staggered GSAP reveal triggers and linking `[ View Gallery ]` to `/works`.
  - Server-Side Data Fetching & Caching:
    - Updated `app/page.tsx` with `"use cache"` SSR data fetching via `sanityFetch` for both services and colorgrading, passing `initialServices` to `<ServicesExhibition />` and `initialLookbook` to `<ColorGradeLookbook />`.
    - Updated `app/services/page.tsx` with `"use cache"` SSR data fetching via `sanityFetch` for services, passing `initialServices` to `<ServicesVertical />`.
  - Verification:
    - TypeScript: `pnpm exec tsc --noEmit` passed with 0 errors.
    - ESLint: `pnpm lint` passed with 0 errors.
    - Production build: `pnpm build` passed compiling and prerendering all 17 routes cleanly.
    - Runtime check: Verified live fetch rendering published Sanity services and colorgrading documents via curl HTTP 200 checks on `/` and `/services`.

- Dedicated Packages Page with Sanity CMS Integration (`context/feature-specs/packages/01-initial-packages.md`):
  - Sanity Schema Definition (`studio/schemaTypes/packageType.ts`):
    - Created `packageType` schema document with `title` (string), `serviceCategory` (string with 6 core services radio list: Preshoot, Casual, Birthday, Engagement, Wedding, Promotion), `description` (text), `deliverables` (array of strings), plus optional `price` (string), `badge` (string), and `order` (number).
    - Registered `packageType` in `studio/schemaTypes/index.ts`.
    - Extracted schema and regenerated TypeScript types via `pnpm run typegen` into `bstudio/sanity.types.ts`.
  - GROQ Queries (`bstudio/sanity/queries.ts`):
    - Added `PACKAGES_QUERY` ordering by `order asc, _createdAt asc`.
    - Added `PACKAGES_BY_CATEGORY_QUERY` filtering by `lower(serviceCategory) == lower($category)`.
  - React Component (`components/packages/packages-page.tsx`):
    - Implemented `PackagesPage` using Next.js, Tailwind CSS, GSAP, and `cn()` utility.
    - Curated robust mock sample packages covering all 6 core service categories (Wedding, Preshoot, Casual, Birthday, Engagement, Promotion).
    - Editorial Header: Massive brutalist Sans-Serif headline ("CURATED PACKAGES"), paired with elegant italicized Serif subtitle (_"Bespoke collections tailored to your unique narrative."_).
    - Interactive Sticky Category Tabs: Sticky navigation row (`bg-bg-base/95 backdrop-blur-md`) with small, bold, track-spaced Sans-Serif font (`[ PRESHOOT ] | [ CASUAL ] | [ BIRTHDAY ] | [ ENGAGEMENT ] | [ WEDDING ] | [ PROMOTION ]`), active pill indicator in Rich Charcoal (`#111111`) with bottom accent line, and inactive tabs in Soft Mid-Grey (`#888888`).
    - Editorial Card Grid: Minimalist responsive cards bounded by hairline borders (`--border-subtle`), tier indices (`/01`, `/02`, `/03`), highlight badges (`[ SIGNATURE ]`, etc.), bold package names, investment amounts, italicized Serif descriptions, check-bulleted deliverables lists, and sleek `[ INQUIRE NOW ]` CTA buttons redirecting to contact with query params.
    - GSAP Animation Lifecycle: Seamless fade-in and upward slide stagger when switching categories, with clean unmount teardown via `gsap.context()` / `ctx.revert()`.
    - Strict Theme Enforcement: Locked to Cinematic Off-Light theme (`#F7F7F5` base, `#111111` ink text, `#888888` muted text, zero dark mode styling).
  - Next.js Routes:
    - Created `app/packages/page.tsx` with metadata, `"use cache"` SSR data fetching via `sanityFetch`, composed with `<ContactForm prompt="READY TO INVEST IN YOUR STORY?" />` and `<Footer />`.
    - Created route aliases `app/pricing/page.tsx` and `app/package/page.tsx` redirecting to `/packages`.
    - Created root export `components/packages-page.tsx`.
  - Verification:
    - TypeScript: `pnpm exec tsc --noEmit` passed with 0 errors.
    - ESLint: `pnpm lint` passed with 0 errors.
    - Studio build: `pnpm build` in `studio/` passed cleanly in 239ms.
    - Next.js production build: `pnpm build` in `bstudio/` passed compiling all 17 routes cleanly.
    - HTTP verification: Curl to `http://localhost:3000/packages` returned 200 OK.
    - Visual inspection: Verified high-impact editorial typography, sticky navigation tabs, cards, deliverables, and Off-Light styling via browser screenshot.

- Backend Scroll-Based Pagination & Minimalist Loading States:
  - Album Gallery Page (`/album/[slug]`):
    - Removed pulsing skeleton fallback in `app/album/[slug]/page.tsx` and replaced it with a pure white background displaying centered `loading...` text until the title sequence intro mounts.
    - Upgraded `getImages` and `getVideos` in `lib/cd.ts` to support Cloudinary Search cursor-based pagination (`max_results` + `next_cursor`), returning `{ resources, nextCursor, totalCount }`.
    - Added scroll-based pagination in `components/album/album-gallery.tsx` using `IntersectionObserver` sentinel and Server Actions (`getImages` / `getVideos`), dynamically loading next batches of photos or videos on scroll with centered `loading...` text at the bottom.
  - Works Portfolio Page (`/works`):
    - Added `PAGINATED_ALBUMS_QUERY` in `sanity/queries.ts` with GROQ slice pagination `[$start...$end]`.
    - Ran typegen in `studio/`, updating TypeScript models in `bstudio/sanity.types.ts`.
    - Created `fetchMoreAlbums(start, limit)` server action in `lib/actions.ts` querying paginated albums via `sanityFetch`.
    - Updated `app/works/page.tsx` to fetch initial batch of 6 albums using `PAGINATED_ALBUMS_QUERY`.
    - Updated `components/works/works-page.tsx` with dynamic `sanityAlbums` state, `IntersectionObserver` sentinel, and seamless scroll-based pagination showing `loading...` at the bottom.
  - Verification:
    - TypeScript: `pnpm exec tsc --noEmit` passed with 0 errors.
    - ESLint: `pnpm lint` passed with 0 errors.
    - Production build: `pnpm build` passed compiling all routes cleanly.
    - HTTP status: Verified 200 OK on `/works` and `/album/sakkili-miya-pakaya`.

- Single Album Gallery Page (`context/feature-specs/backend/02-fetching-single-album.md`)
  - Works Page Card Link: Wrapped `AlbumCard` in `components/works/works-page.tsx` with Next.js `Link` pointing to `/album/${project.slug || project.id}`. Stopped click propagation on image retry.
  - Sanity Queries & TypeGen:
    - Added `ALBUM_BY_SLUG_QUERY` and `ALBUM_SLUGS_QUERY` to `bstudio/sanity/queries.ts`.
    - Ran `pnpm run typegen` in `studio/`, generating `ALBUM_BY_SLUG_QUERY_RESULT` and `ALBUM_SLUGS_QUERY_RESULT` types in `bstudio/sanity.types.ts`.
  - Cloudinary Media Integration (`bstudio/lib/cd.ts`):
    - Analyzed and typed `getImages` and `getVideos` with `CloudinaryResource` model.
    - Added defensive error handling so missing environment variables or API errors do not crash Next.js server components.
  - Dynamic Route (`bstudio/app/album/[slug]/page.tsx`):
    - Created dynamic server component route fetching album by slug via `sanityFetch` with `"use cache"` and `generateStaticParams`.
    - Fetches Cloudinary images and videos using `getImages` and `getVideos` based on `album.cloudinaryFolder`.
    - Dynamic metadata generation for SEO with OpenGraph image support.
  - Editorial Gallery Component (`bstudio/components/album/album-gallery.tsx`):
    - 1. The Immersive Welcome (Title Sequence): Full-screen pure white cinematic background overlay, Event Name reveal in elegant italicized Serif, Description reveal, Event Date reveal in bold Sans-Serif, and smooth fade-out dissolution with Skip control.
    - 2. The Main Gallery (Pinterest / Masonry Grid): Responsive asymmetrical masonry grid using CSS columns without rigid cropping, preserving natural aspect ratios, smooth hover zoom, expand/play overlay indicators.
    - 3. The Faded Footer & Filters: Sticky fixed footer pinned at bottom with smooth gradient fading from transparent down to solid Cinematic Off-White (`#F7F7F5`), centered text buttons `[ PHOTOS ]` and `[ VIDEOS ]`, auto-hiding missing format and focusing on available media.
    - 4. The Full-Screen Lightbox Experience: Pure black background lightbox on clicking any photo or video, functioning Next (`>`) and Previous (`<`) arrows, Close (`X`) button, keyboard navigation (Escape, ArrowLeft, ArrowRight), and asset counter (`01 / 18`).
  - Verification & Verification Results:
    - TypeScript: `pnpm exec tsc --noEmit` passed with 0 errors.
    - ESLint: `pnpm lint` passed with 0 errors.
    - Production build: `pnpm build` passed, compiling and prerendering all 14 routes.
    - Dev server: HTTP 200 OK verified on `/album/sakkili-miya-pakaya`.
    - Browser subagent: Verified page flow, title sequence, masonry grid, sticky footer, and interactive lightbox navigation.

- Fetching Albums from Sanity for Works Page (`context/feature-specs/backend/01-fetching-albums.md`)
  - Schema Analysis:
    - Inspected `albumType.ts` (`title`, `description`, `date`, `category` reference, `alt`, `thumbnail`, `cloudinaryFolder`, `Media`, `count`, `duration`, `slug`, `publishedAt`).
    - Inspected `categoryType.ts` (`title`).
    - Inspected `mediaType.ts` (`MEDIAS` list: `PHOTOS`, `VIDEOS`, `MIXED`).
  - Sanity Queries & TypeGen (`bstudio/sanity/queries.ts`):
    - Created `ALBUMS_QUERY` using `defineQuery` fetching all albums ordered by `publishedAt desc, _createdAt desc`, dereferencing `category->{ _id, title }`, and retrieving thumbnail, Media, count, duration, slug, etc.
    - Created `CATEGORIES_QUERY` using `defineQuery` fetching all categories ordered by `title asc`.
    - Added `@sanity/client` to `bstudio` dependencies.
    - Executed `pnpm typegen` in `studio/`, extracting schema and generating precise TypeScript query result types (`ALBUMS_QUERY_RESULT`, `CATEGORIES_QUERY_RESULT`) into `bstudio/sanity.types.ts`.
  - Next.js Partial Prerendering & Server Component Integration (`app/works/page.tsx`):
    - Implemented `getWorksData()` cached with `"use cache"` to comply with Next.js 16 `cacheComponents` and `cacheTag()`.
    - Wrapped async server component `WorksGallery()` inside `<Suspense fallback={<WorksFallback />}>` providing zero-jank streaming with Off-Light skeleton placeholders.
    - Passed fetched Sanity albums and categories as props to `<WorksPage />`.
  - Frontend Mapping, Dynamic Tabs & Filtering (`components/works/works-page.tsx`):
    - Implemented `mapSanityAlbum()` converting Sanity documents to `AlbumProject`, gracefully parsing dates, fallback image sources, and formatting photo counts (`"10"` -> `"10 Photos"`) and video durations (`"04:10"` -> `"04:10 Film"`).
    - Added `res.cloudinary.com` to `remotePatterns` in `next.config.ts` so Cloudinary thumbnails load seamlessly.
    - Media Format Tabs: dynamic support for `[ ALL ]`, `[ PHOTOS ]`, `[ VIDEOS ]`, and `[ MIXED ]` (when mixed albums exist). Format filters match photos and videos cleanly including mixed albums.
    - Shoot Category Tabs: dynamically built from Sanity categories, album categories, and studio defaults (`WEDDING`, `BIRTHDAY`, `COMMERCIAL`, `CASUAL`, `ENGAGEMENT`), with case-insensitive matching.
    - Empty filter state with intuitive "Reset Filters" action.
  - Verification & Verification Results:
    - TypeScript: `pnpm exec tsc --noEmit` passed with 0 errors.
    - ESLint: `pnpm lint` passed with 0 errors (configured `sanity.types.ts` in `eslint.config.mjs` global ignores).
    - Production build: `pnpm build` passed compiling all 10 routes successfully with PPR.
    - Runtime check: Verified live fetch rendering `Sakkili Miya` album with Cloudinary thumbnail, `WEDDING` category, `10 PHOTOS` badge, and functional filters in browser subagent recordings.

- Standalone Sanity CMS & Next.js Integration (`sanity-best-practices` getting-started)
  - Verified Monorepo Layout: Confirmed standalone `studio/` and Next.js `bstudio/` in root `/Users/maleeshanayanashan/Projects/BINUKA`.
  - Standalone Studio Configuration (`studio/`):
    - Configured `sanity.cli.ts` with project `brst44qi`, dataset `production`, auto-updates enabled, and TypeGen settings scanning `../bstudio/{app,components,lib,sanity}/**/*.{ts,tsx,js,jsx}` generating `../bstudio/sanity.types.ts`.
    - Added `"typegen": "sanity schemas extract --force && sanity typegen generate"` to `studio/package.json`.
    - Extracted schema and generated TypeScript types into `bstudio/sanity.types.ts` in 357ms.
  - Next.js Frontend Integration (`bstudio/`):
    - Installed `next-sanity` and `@sanity/image-url` via pnpm.
    - Added `NEXT_PUBLIC_SANITY_PROJECT_ID=brst44qi` and `NEXT_PUBLIC_SANITY_DATASET=production` to `bstudio/.env.local`.
    - Created `sanity/client.ts` with `createClient` targeting project `brst44qi`, dataset `production`, and `useCdn: true`.
    - Created `sanity/image.ts` with `@sanity/image-url` builder and `urlFor` helper.
    - Created `sanity/live.ts` configuring `defineLive` with live content API and server/browser tokens.
    - Added `cdn.sanity.io` to `next.config.ts` remote patterns for Next.js Image optimization.
    - Mounted `<SanityLive />` in `app/layout.tsx` for real-time live content updates and visual editing compatibility.
  - CORS Configuration:
    - Added `http://localhost:3000` with `allowCredentials: true` to project `brst44qi` CORS origins using Sanity MCP.
  - Verification & Builds:
    - Passed TypeScript strict checks in `bstudio`: `pnpm exec tsc --noEmit` (0 errors).
    - Passed ESLint: `pnpm lint` (0 errors).
    - Passed Next.js production build: `pnpm build` (compiled all routes in 1011ms with `.env.local`).
    - Passed Studio production build: `pnpm build` in `studio/` (clean build in 344ms).

- Dedicated Contact Us Page (`context/feature-specs/contact-us/contact-us.md`)
  - Created `components/contact/contact-page.tsx` exporting the complete `ContactPage` component using Next.js, Tailwind CSS, GSAP, and `cn()` utility.
  - Implemented 1. Split-Screen Editorial Magazine Layout (`min-h-[100dvh]`):
    - Left side: Brutalist Sans-Serif headline ("LET'S CREATE", `text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[6.5rem] leading-[0.88]`), sophisticated italicized Serif paragraph (_"Available worldwide. Reach out to discuss your next cinematic project or request our complete pricing guide."_), and studio contact details (Email: `inquiries@bstudio.com`, Phone: `+94 (77) 203-8822`, Studio Location: `74 Horton Place, Colombo 07`, Socials: Instagram, Vimeo, YouTube) with small bold Sans-Serif headers and Serif values.
    - Right side: Mad-Libs conversational form (_"Hi B studio, my name is [ Your Name ]. I am captivated by your work and would love to book a [ Select Service ▾ ] for my upcoming event around [ Date ]. You can reach me at [ Email Address ] to discuss the details."_).
  - Implemented 2. Form Interactions:
    - User inputs represented as sleek underlines with auto-expanding CSS Grid layout, defaulting to Soft Mid-Grey (`border-[#888888]`) and smoothly transitioning to pure black (`border-black border-b-2`) when focused or populated.
    - Floating dropdown menu listing the 6 core services (Preshoot, Casual Shoot, Birthday Shoot, Engagement Shoot, Wedding Shoot, Promotion Video) with check indicators, keyboard navigation, click-outside listener, and Escape key dismissal.
    - Typography pairing: sophisticated italicized Serif for static form text (`font-serif italic`), and bold brutalist Sans-Serif for user typed text (`font-sans font-bold not-italic`).
  - Implemented 3. Submission & Success State:
    - Massive pill-shaped "SEND INQUIRY" button in bold Sans-Serif with GSAP magnetic cursor pull (`power2.out` tracking, `elastic.out(1, 0.4)` return), clean unmount tween kill, and validation warnings.
    - Form dissolution: smooth GSAP timeline fade-out (`opacity: 0, y: -18, duration: 0.5`) followed by the fade-in of an elegant Serif confirmation message (_"Your story is safe with us. We will be in touch soon."_ in `font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl`) with "Send another inquiry" action.
  - Implemented 4. Theme Enforcement: strictly locked to Cinematic Off-Light theme (`#F7F7F5` base, `#111111` primary text, `#888888` muted text, zero dark mode styling).
  - Created root export `components/contact-page.tsx`.
  - Created dedicated Next.js route `app/contact/page.tsx` rendering `ContactPage` composed with `<Footer />`.
  - Updated `components/navbar.tsx` navigation link and CTA to `/contact`.
  - Verified with full TypeScript check (`tsc --noEmit`), ESLint (`pnpm lint` 0 errors), Next.js production build (`pnpm build` in 614ms), and dev server curl verification (HTTP 200 OK on `/contact`).

- Dedicated Works (Portfolio) Page (`context/feature-specs/works-page/01-works-page.md`)
  - Created `components/works/works-page.tsx` exporting the complete `WorksPage` component using Next.js, Tailwind CSS, GSAP, and `cn()` utility.
  - Implemented 1. Header & Filtering System: massive brutalist Sans-Serif headline ("SELECTED WORKS"), editorial monograph description, and dual interactive filter rows:
    - Media Format: tabs toggling between [ ALL ] | [ PHOTOS ] | [ VIDEOS ].
    - Shoot Category: tabs toggling between [ ALL ] | [ WEDDING ] | [ BIRTHDAY ] | [ COMMERCIAL ] | [ CASUAL ] | [ ENGAGEMENT ].
    - Small, bold, track-spaced Sans-Serif typography with active tabs in Rich Charcoal (`#111111`) and inactive tabs in Soft Mid-Grey (`#888888`).
  - Implemented 2. Gallery Grid & Album Cards: responsive CSS grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12`) showcasing curated projects (including "Malaysia's Birthday", "Lake Como Vows", "The Brutalist Monograph", etc.) with thumbnail containers, hover scale-up effect (`group-hover:scale-105`), sophisticated italicized Serif titles (`font-serif italic text-2xl sm:text-[1.65rem]`), and clean tiny date/category metadata.
  - Implemented 3. Image Optimization, Skeletons & Retry Logic: Next.js `<Image>` optimization with Unsplash remote patterns, `SkeletonCard` UI state using Tailwind `animate-pulse` on `#EBEBE8` background for simulated loading, and `onError` image handling with a clean fallback card and subtle "Retry Image" button.
  - Implemented 4. Theme Enforcement: strictly locked into Cinematic Off-Light theme (`#F7F7F5` base, `#111111` primary text, `#888888` muted text, `#DFDFDC` border, zero dark mode styling).
  - Created dedicated route `app/works/page.tsx` composing `WorksPage` with `<ContactForm prompt="READY TO SHOOT?" />` and `<Footer />`.
  - Added alias redirects for `app/work/page.tsx` and `app/portfolio/page.tsx` pointing to `/works`.
  - Updated `components/navbar.tsx` navigation link for Work to `/works`.
  - Updated `components/sample-gallery.tsx` "See More" button to link to `/works`.
  - Verified with full TypeScript check (`tsc --noEmit`), ESLint (`pnpm lint`), Next.js production build (`pnpm build` in 639ms), and dev server curl verification (HTTP 200 OK on `/works`, HTTP 307 on `/work`).

- Feature 01: Design Architecture & UI Primitives (`context/feature-specs/01-design-architecture.md`)
  - Installed and configured `shadcn/ui` on Tailwind CSS v4.
  - Added 7 foundation UI primitives: `Button`, `Card`, `Dialog`, `Input`, `Tabs`, `Textarea`, `ScrollArea` (`components/ui/*` kept untouched).
  - Installed `lucide-react`, `gsap`, and `lenis`.
  - Configured `lib/utils.ts` with reusable `cn()` helper and `ClassValue` type.
  - Configured `app/globals.css` and `app/layout.tsx` locked into the Off-Light Modern Editorial aesthetic per `context/ui-context.md` (`#F7F7F5` base, `#EBEBE8` stone surface, `#111111` ink text).
  - Configured Modern Editorial typography (`Geist` Sans for bold structural headers, `Newsreader` Serif italic for accents/body).
  - Verified with full TypeScript check (`pnpm exec tsc --noEmit`), ESLint (`pnpm lint`), and Next.js production build (`pnpm build`).

- Feature 02: B studio Navbar (`context/feature-specs/02-navbar.md`)
  - Implemented sticky, cinematic top navigation bar in `components/navbar.tsx` locked strictly to Off-Light palette (`--bg-base: #F7F7F5`, `--border-subtle: rgba(17, 17, 17, 0.08)`).
  - Left: "B STUDIO" brutalist tightly-spaced typography logo.
  - Center: Desktop navigation links (Work, Services, About, Contact) paired with sophisticated italicized serif indexing (`01`, `02`, `03`, `04`) smoothly darkening from muted grey (`#888888`) to pure black (`#000000`).
  - Right: Sleek CTA button ("Inquire") with GSAP magnetic cursor pull & elastic snap-back interaction.
  - Mobile responsiveness: Lucide stroke-based hamburger menu toggling full-screen cinematic off-white overlay with massive high-contrast typography, GSAP staggered entry animations, scroll-lock, and `Esc` key dismissibility.
  - Added `--border-subtle` design token to `@theme inline` and `:root` in `app/globals.css`.
  - Integrated `Navbar` into `app/layout.tsx` and updated `app/page.tsx` with editorial preview sections.
  - Verified with full TypeScript check (`pnpm exec tsc --noEmit`), ESLint (`pnpm lint`), and Next.js production build (`pnpm build`).

- Feature 03: Loading animation for loading the home (`context/feature-specs/03-loading-home.md`)
  - Implemented `HomeLoader` in `components/home-loader.tsx` locked strictly to Off-Light palette (`bg-bg-base`, `#F7F7F5`).
  - All elements centered vertically and horizontally in the viewport.
  - Sequence 1: Lead text "WELCOME TO" (`text-text-muted`, tracked uppercase) and middle text "B STUDIO" (`text-text-primary`, bold brutalist sans) fade in smoothly via GSAP, hold, and fade out together.
  - Sequence 2: Stroke-based `Camera` icon from `lucide-react` fades in at the exact center, holds, and fades out.
  - Sequence 3: Full-screen overlay smoothly dissolves to reveal the Home page, cleanly restoring body scroll and unmounting from the DOM.
  - Integrated into `app/page.tsx`.
  - Verified with full TypeScript check (`pnpm exec tsc --noEmit`), ESLint (`pnpm lint`), Next.js production build (`pnpm build`), and browser subagent interaction recording.

- Feature 04: Hero Section (`context/feature-specs/04-hero.md`)
  - Created `components/hero.tsx` exporting `Hero` component and integrated it into `app/page.tsx` alongside `HomeLoader`.
  - Full-screen layout filling `h-[100dvh]` with `overflow-hidden` and centered alignment.
  - Auto-playing, looping, muted background video showreel (`/hero.mp4`) with subtle black gradient overlay (`bg-gradient-to-b from-black/40 via-black/35 to-black/55`) over `opacity-70` video, giving high-contrast cinematic depth.
  - Dead center, high-contrast, bold brutalist Sans-Serif headline ("B STUDIO") in crisp `text-white` paired with an intertwined, sophisticated italicized Serif subtitle (_"Cinematic Photography & Videography"_ in `text-white/80`).
  - Dark glassmorphic GSAP `quickTo` cursor follower on fine-pointer desktop viewports (`border-white/30 bg-black/60 text-white`) that expands from a subtle white dot into an editorial "Scroll" indicator capsule with down-arrow on mouse movement, collapsing back after 1.2s of inactivity.
  - Bottom centered editorial scroll cue line and label in white/70.
  - Verified with full TypeScript check (`pnpm exec tsc --noEmit`), ESLint (`pnpm lint`), and Next.js production build (`pnpm build`).

- Feature 05: Update Navbar Styles (`context/feature-specs/05-update-navbar.md`)
  - Transparent fixed navbar with white typography and white CTA button when user is at the top of the homepage in the hero section.
  - Automatically transitions smoothly to solid Off-White `--bg-base` with ink black text, `--border-subtle`, and black CTA button when scrolling down past the hero threshold.
  - Dynamically returns to transparent upon scrolling back up to the hero section.

- Feature 06: Cinematic Pinned Horizontal Scroll Text (`context/feature-specs/06-marquee-01.md`)
  - Implemented `PinnedScrollText` component in `components/pinned-scroll-text.tsx` using Next.js, Tailwind CSS, GSAP with ScrollTrigger, and `cn()` utility.
  - Full-screen container (`h-[100dvh]`, `bg-bg-base`, `#F7F7F5`) that pins at `start: "top top"` using ScrollTrigger.
  - Massive brutalist bold Sans-Serif headline ("CINEMATIC ART AND DIRECTING") in Rich Charcoal (`text-text-primary`, `#111111`) starting off-screen to the right (`style={{ transform: "translate3d(100vw, 0, 0)" }}` / `metrics.startX`).
  - Movement tied to downward scroll with `scrub: 1` and `anticipatePin: 1`.
  - Pinning releases when the word "DIRECTING" (the end of the text block) fully enters the viewport with editorial breathing margin.
  - Complete GSAP context isolation and teardown on unmount via `gsap.context()` and `ctx.revert()`.
  - Integrated into `app/page.tsx` below `Hero`.
  - Verified with full TypeScript check (`pnpm exec tsc --noEmit`), ESLint (`pnpm lint`), Next.js production build (`pnpm build`), and browser subagent visual recordings.

- Feature 07: Selected Works Section & Global Lenis Smooth Scroll (`context/feature-specs/07-selected-works.md`)
  - Initialized global Lenis smooth scrolling in `components/smooth-scroll.tsx` wrapped in `app/layout.tsx`, synchronizing Lenis scroll with `ScrollTrigger.update` and linking to `gsap.ticker` with `lagSmoothing(0)`.
  - Created `components/selected-works.tsx` exporting `SelectedWorks` component and integrated it into `app/page.tsx` directly after `PinnedScrollText`.
  - Creative Full-Screen Intro Title: Full-screen brutalist header ("ARCHIVE" with subtitle _01 — 05 / Selected Works_) fills the viewport on entry, smoothly reveals via GSAP, holds during initial scroll, and fades out into the distance.
  - Dedicated full-screen gallery container (`h-[100dvh]`, `min-h-[640px]`, `bg-bg-base`, `#F7F7F5`) pinned via ScrollTrigger over `+=600%` scroll distance with `scrub: 1.2` and `anticipatePin: 1`.
  - Showcases 5 curated cinematic projects with Next.js optimized `<Image>` components and Unsplash remote patterns:
    - 01: NOIR SILHOUETTE (Fashion Editorial & 35mm Film)
    - 02: SOLITUDE IN FORM (Brutalist Architecture & Direction)
    - 03: VELVET DUSK (Cinematography & Narrative Stills)
    - 04: SCULPTED HORIZON (Fine Art & Landscape Installation)
    - 05: CHROMATIC PULSE (Avant-Garde Runway & Showreel)
  - Alternating Center-Hold Reveal Animation Mechanics:
    - Initial Deterministic Setup: All slides start hidden with `autoAlpha: 0`; text and images positioned off-screen via percentage translation (`xPercent: ±140`) to eliminate resolution-dependent recalculation and resize jank.
    - Entry Phase: Image and text glide smoothly from opposite alternating sides (Even: text left, image right; Odd: image left, text right) into center grid positions (`xPercent: 0`, `opacity: 1`, `scale: 1`).
    - The Hold: Meets perfectly in center of the viewport and stays completely still for a generous scroll window, ensuring ample time to read editorial copy and click interactive "View Project" buttons.
    - The Exit Phase: Image and text smoothly scale down (`scale: 0.88`) and fade to 0 opacity.
    - Next Phase: Subsequent project seamlessly begins its entry sequence.
  - Modern Editorial typography (massive bold Sans-Serif titles, elegant Serif subtitles and descriptions, stylized pill "View Project" CTA button with `ArrowUpRight` stroke icon).
  - Strict Off-Light Theme adherence (`--bg-base: #F7F7F5`, `--text-primary: #111111`, `--bg-surface: #EBEBE8`, no dark mode).
  - Verified with TypeScript check (`tsc --noEmit`), ESLint (`pnpm lint` 0 errors, 0 warnings), Next.js production build (`pnpm build` in 342ms), and browser testing.

- Feature 08: Philosophy Section (`context/feature-specs/08-philosophy.md`)
  - Implemented `Philosophy` component in `components/philosophy.tsx` and mounted in `app/page.tsx` following `SelectedWorks`.
  - Full-screen pinned container (100dvh) in Pure Cinematic Black (`#000000`).
  - Studio philosophy large text block in sophisticated, elegant, italicized Serif typography (`Newsreader`).
  - Progressive scroll-linked illumination animation: words fill in from 20% opacity to 100% Crisp White (`#FFFFFF`) tied to downward scroll (`scrub: 1`).
  - Pin releases only once the entire paragraph is fully lit.
- Feature 09: Smart-Sticky Hiding Navbar (`context/feature-specs/09-hiding-navbar.md`)
  - Top navigation bar visible at the top of the homepage with transparent hero styling.
  - Automatically slides up out of view on scroll down and slides back down on scroll up.
  - Transitions to solid Off-White with subtle border when scrolled past hero threshold.
  - Fully compatible with Lenis smooth scrolling, GSAP ScrollTrigger pins, and mobile menu overlay.
  - Verified with TypeScript, ESLint, and Next.js production build.

- Feature 10: Horizontal Services Exhibition Section (`context/feature-specs/10-featured-services.md`)
  - Created `components/services-exhibition.tsx` and mounted in `app/page.tsx` directly following `<Philosophy />`.
  - Replaced floating badge with a monumental centered headline ("FEATURED SERVICES", `text-[10vw]`) that fades in and remains persistently anchored throughout the section without fading out.
  - Pinned full-screen container (`h-[100dvh]`, `bg-bg-base`, `#F7F7F5`) locking vertically when reaching viewport top.
  - Implemented discrete sticker snap-scrolls with GSAP ScrollTrigger label snapping (`snapTo: "labels"`): each scroll gesture advances cleanly by one service ("one scroll one service").
  - Showcases 6 curated service packages: Preshoot (`01.`), Casual Shoot (`02.`), Birthday Shoot (`03.`), Engagement Shoot (`04.`), Wedding Shoot (`05.`), and Promotion Video (`06.`).
  - Panel design: Massive Serif number background (`*01.*` - `*06.*`), overlapping bold Sans-Serif service name, asymmetrical floating image with subtle shadow and border, 2-sentence description, and sleek `[ View Gallery ]` button.
  - Strictly locked into Off-Light theme (`#F7F7F5` base, `#111111` primary text, `#888888` muted text).
  - Scoped GSAP context with clean unmount teardown via `ctx.revert()`.
  - Verified with full TypeScript check (`tsc --noEmit`), ESLint (`pnpm lint`), and Next.js production build (`pnpm build` in 281ms).

- Feature 11: Sample Work Masonry Gallery (`context/feature-specs/11-sample-gallery.md`)
  - Created `SampleGallery` component in `components/sample-gallery.tsx` and mounted in `app/page.tsx` directly after `ServicesExhibition`.
  - Responsive Pinterest-style masonry grid using CSS columns (`columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6` with `break-inside-avoid mb-4 sm:mb-6`).
  - Curated 12 high-quality, cinematic Unsplash image assets spanning varied aspect ratios (`aspect-[3/4]`, `aspect-[16/10]`, `aspect-[4/5]`, `aspect-[2/3]`, `aspect-[4/3]`, `aspect-[1/1]`, `aspect-[16/9]`, `aspect-[3/2]`) preventing rigid square cropping and eliminating layout reflows.
  - Large teaser bottom gradient overlay (`h-72 sm:h-80 md:h-[420px] lg:h-[480px]`) fading smoothly from transparent to solid Off-White / Warm Pearl (`#F7F7F5`), obscuring bottom images to tease further portfolio work.
  - Centered sleek magnetic "See More" CTA button positioned over the gradient overlay with GSAP elastic cursor pull interaction and hover inversion (`border-text-primary/20 bg-[#F7F7F5]/90` to solid `bg-text-primary text-bg-base`).
  - No section title added, maintaining pure photographic masonry flow.
  - Strictly locked to Off-Light theme (`#F7F7F5` base, `#111111` primary text, zero dark mode styling).
  - Verified with TypeScript check (`tsc --noEmit` 0 errors), ESLint (`pnpm lint` 0 errors, 0 warnings), and Next.js production build (`pnpm build` in 295ms).

- Feature 12: Conversational Contact Form (`context/feature-specs/12-contact-home.md`)
  - Created `components/contact-form.tsx` exporting `ContactForm` and mounted in `app/page.tsx` directly after `<SampleGallery />`.
  - Implemented Mad-Libs style conversational sentence: _"Hi B studio, my name is [ Your Name ]. I am captivated by your work and would love to book a [ Select Service ▾ ] for my upcoming event around [ Date ]. You can reach me at [ Email Address ] to discuss the details."_
  - Typography: Massive editorial font sizing (`text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.25rem]`) mixing elegant italicized Serif (`font-serif italic text-text-primary`) with bold brutalist Sans-Serif user inputs (`font-sans font-bold not-italic text-text-primary`).
  - Interactive Underlines: Sleek CSS-grid auto-expanding underlines defaulting to Soft Mid-Grey (`border-[#888888]`) and smoothly transitioning to pure black (`border-black`) on hover and focus.
  - Floating Service Dropdown: Interactive inline button with animated rotating chevron opening an accessible floating menu for the core photography & videography services, with keyboard navigation, click-outside dismissal, and dynamic count badge.
  - Large Pill Submission Area: Bold Sans-Serif "SEND INQUIRY" CTA button with GSAP magnetic cursor pull interaction (`gsap.to` with `power2.out` and `elastic.out(1, 0.4)` return), clean unmount teardown, client validation, and feedback state (`INQUIRY SENT`).
  - Strictly locked to Off-Light palette (`#F7F7F5` base, `#111111` primary text, `#888888` muted text, zero dark mode styling).
- Feature 13: Pinned Horizontal Color Grade Lookbook (`context/feature-specs/13-color-grading.md`)
  - Created `components/color-grade-lookbook.tsx` exporting `ColorGradeLookbook` and mounted in `app/page.tsx` between `<SampleGallery />` and `<ContactForm />`.
  - Pinned Container Section: Full-screen container (`h-[100dvh]`, `overflow-hidden`, `bg-bg-base`, `#F7F7F5`) locking vertically when reaching viewport top (`start: "top top"`).
  - Horizontal Scroll Mechanics: Inner track moves horizontally right-to-left scrubbed to downward mouse-wheel scroll (`scrub: 1`, `anticipatePin: 1`) over the exact scroll distance calculated dynamically from track scrollWidth and viewport width.
  - 6 Oversized Gallery Panels: Showcases 6 distinct color grading styles (Dreamy Glow, Off Green, Moody, Dark Aesthetic, Vintage Film, High Contrast) using 6 high-quality cinematic Unsplash images, each spanning 68-78vw of the viewport width so users can analyze color grading details.
  - Card Design: Prominent rounded-2xl frames with subtle borders, elegant top-right index badges (`01 / 06` to `06 / 06`), and bottom gradient overlays showcasing sophisticated italicized Serif theme names (`font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl`) alongside tonal palette descriptions.
  - Hover Interaction: Smooth scale-up zoom (`group-hover:scale-105 duration-700 ease-out`) on images inside overflow-hidden containers.
  - Call to Action: Terminal panel at the end of the track featuring a sleek pill-shaped "WORK WITH US" button with brutalist bold Sans-Serif font, GSAP magnetic cursor pull, elastic snap-back, and link to `#contact`.
  - Strictly locked to Off-Light theme (`#F7F7F5` base, `#111111` primary text, zero dark mode styling).
  - Clean GSAP lifecycle teardown via `gsap.context()` / `ctx.revert()` and `gsap.killTweensOf(magneticBtn)`.
  - Verified with TypeScript (`tsc --noEmit` 0 errors), ESLint (`pnpm lint` 0 errors, 0 warnings), and Next.js production build (`pnpm build`).

- Feature 14: Footer Section (`context/feature-specs/14-footer.md`)
  - Created `components/footer.tsx` exporting `Footer` and mounted at the bottom of `app/page.tsx`.
  - Massive, screen-wide typographic footer spelling out "B STUDIO" (`text-[18vw]` - `text-[19.2vw]`, `font-sans font-black uppercase`) filling the screen width.
  - Minimalist sub-footer with copyright year (`© 2026 B STUDIO.`), editorial italicized Serif statement, and stroke-icon social links (Instagram, Vimeo, YouTube, Behance, LinkedIn) darkening to black with subtle translation on hover.
  - Editorial top section with studio mission statement and real-time Colombo time display.
  - GSAP scroll-triggered reveal animations with clean lifecycle teardown (`ctx.revert()`).
  - Strictly locked to Off-Light theme (`#F7F7F5` base, `#111111` primary text, `#888888` muted text, zero dark mode styling).

- Feature 15: Private Client Space Teaser Section (`context/feature-specs/15-client-space-teaser.md`)
  - Created `components/client-space-teaser.tsx` exporting `ClientSpaceTeaser` and mounted in `app/page.tsx` directly after `<SampleGallery />`.
  - Pinned full-height section (`h-[100dvh]`, `min-h-[680px]`, `bg-bg-base`, `#F7F7F5`) communicating exclusive, private digital spaces provided for each shoot.
  - The Album Spread Animation: 4 stacked personal albums (Lake Como Ceremony, Kyoto Editorial Preshoot, Brutalist Villa Reception, Sunset Coastal Monograph) that start stacked in the center/right and beautifully fan out into an overlapping, cascading spread scrubbed to scroll via GSAP ScrollTrigger (`pin: true`, `scrub: 1`).
  - Responsive fan geometries: Desktop fan-out spread (`mm.add("(min-width: 1024px)")`) spanning up to ±88% translation with angular tilt, and adapted compact spread on mobile/tablet screens (`mm.add("(max-width: 1023px)")`).
  - Typography: Massive brutalist Sans-Serif headline ("YOUR PRIVATE PREMIERE" in `font-sans font-black uppercase text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.25rem]`), paired with elegant italicized Serif description (_"Every memory, beautifully curated. Access your personalized, high-resolution digital albums in one exclusive, private space."_ in `font-serif italic text-text-primary/90`).
  - Call to Action: Sleek pill-shaped "VIEW SAMPLE ALBUM" primary button with GSAP magnetic cursor tracking (`power2.out`) and elastic snap-back (`elastic.out(1, 0.4)`), accompanied by a secondary "CLIENT LOGIN" pill button with lock icon.
  - Strictly locked to Off-Light theme (`#F7F7F5` base, `#111111` primary text, `#888888` muted text, zero dark mode styling).
  - Clean GSAP lifecycle teardown via `gsap.context()` / `ctx.revert()` and `gsap.killTweensOf(magneticBtn)`.
  - Verified with full TypeScript check (`tsc --noEmit`), ESLint (`pnpm lint`), and Next.js production build (`pnpm build`).

- Dedicated Services Page (`context/feature-specs/services-page/01-services-page.md`)
  - Created `app/services/page.tsx` exporting the dedicated `ServicesPage` route (`/services`).
  - Implemented 1. The Whisper Intro (`components/services/whisper-loader.tsx`): initial load in Pure Cinematic Black (`#000000`), elegant line reading _"Crafting your story."_ in italicized Serif (`Newsreader`), holding for a second, fading out, and dissolving smoothly into the Off-Light canvas with complete DOM unmounting and body scroll release.
  - Implemented 2. The Landing / Anchor (`components/services/services-landing.tsx`): full-height (100dvh) intro with massive brutalist Sans-Serif headline ("WHAT WE DO") on the left, sophisticated editorial paragraph explaining the studio's cinematic philosophy on the right, animated editorial vertical scroll cue line, and subtle custom cursor tracking on desktop.
  - Implemented 3. The Horizontal Exhibition (`components/services/services-horizontal.tsx`): full-screen pinned section locking at `top top` scrubbed to mouse-wheel scroll (`scrub: 1`, `anticipatePin: 1`), featuring 6 massive full-screen (100vw each) panels showcasing core services (Preshoot, Casual Shoot, Birthday Shoot, Engagement Shoot, Wedding Shoot, Promotion Video) with background Serif numbers (`*01.*` - `*06.*`), overlapping bold structural titles, asymmetrical floating cinematic images, 2-sentence descriptions, and sleek `[ View Gallery ]` buttons.
  - Implemented 4. The Booking Transition: horizontal track releases pinning cleanly after the 6th panel, scrolling into a final booking section featuring a massive prompt _"READY TO SHOOT?"_ followed by the interactive Mad-Libs conversational form (`components/contact-form.tsx`) and `<Footer />`.
  - Updated `components/navbar.tsx` desktop and mobile nav items to route to `/services`.
  - Strictly locked to Off-Light theme (`#F7F7F5` base, `#111111` text, `#888888` muted text, zero dark mode styling).
  - Verified with full TypeScript check (`tsc --noEmit`), ESLint (`pnpm lint`), and Next.js production build (`pnpm build`).

- Dedicated About Us Page (`context/feature-specs/about-us-page/01-about-us-page.md`)
  - Created `app/about/page.tsx` exporting the dedicated `AboutPage` route (`/about`).
  - Implemented 1. The Editorial Hook (`components/about/about-intro.tsx`): massive full-screen (100vh / `100dvh`) magazine-style introduction section with brutalist bold Sans-Serif headline ("THE VISION") paired with an elegant, large italicized Serif philosophical statement (_"We treat every memory as a cinematic masterpiece, framing authentic moments with editorial elegance."_), smooth GSAP fade & slide-up entry animations, and animated editorial scroll cue.
  - Implemented 2. The Director's Cut (`components/about/about-directors-cut.tsx`): split-screen layout with pinned right-side story text block (`gsap.matchMedia` for desktop screens >= 1024px) detailing the studio's dedication to cinema and fine art, while the left side features a staggered column of 4 high-quality cinematic behind-the-scenes placeholder images with subtle GSAP parallax (`scrub: true`, `yPercent: ±14` to `±22`).
  - Implemented 3. The Core Pillars (`components/about/about-pillars.tsx`): clean, minimalist layout breaking down the studio's approach into 3 core pillars (01. Authentic Presence, 02. Editorial Lighting, 03. Cinematic Grading), with smooth GSAP ScrollTrigger fade-in and upward translation tied directly to scroll speed (`scrub: 1`).
  - Implemented 4. The Booking Transition: terminal booking section with massive prompt _"READY TO SHOOT?"_ followed by the interactive Mad-Libs conversational form (`components/contact-form.tsx`) and `<Footer />`.
  - Updated `components/navbar.tsx` desktop and mobile nav items to route "About" directly to `/about`.
  - Strictly locked to Off-Light theme (`#F7F7F5` base, `#111111` text, `#888888` muted text, zero dark mode styling).
  - Verified with full TypeScript check (`tsc --noEmit`), ESLint (`pnpm lint`), Next.js production build (`pnpm build`), and dev server curl verification (HTTP 200).

## Open Questions

- None currently.

## Architecture Decisions

- Theme: Locked to Off-Light Modern Editorial palette (`--bg-base: #F7F7F5`, `--bg-surface: #EBEBE8`, `--bg-subtle: #DFDFDC`, `--border-subtle: rgba(17, 17, 17, 0.08)`, `--text-primary: #111111`, `--text-muted: #888888`, `--accent-primary: #000000`) with `color-scheme: light;`.
- Dedicated Works Architecture: Component `components/works/works-page.tsx` exporting `WorksPage` with dual interactive filtering (Media Format: ALL, PHOTOS, VIDEOS, MIXED; Shoot Category: strictly derived from categories fetched from Sanity), Next.js `<Image>` optimization with `res.cloudinary.com` remote pattern, `SkeletonCard` pulse loader, image `onError` fallback with retry logic, and responsive CSS grid.
- Sanity Works Integration: GROQ queries in `sanity/queries.ts` (`ALBUMS_QUERY`, `CATEGORIES_QUERY`). Next.js 16 Partial Prerendering architecture with `getWorksData()` cached via `"use cache"` and `<Suspense fallback={<WorksFallback />}>` in `app/works/page.tsx`.
- Dedicated Contact Page Architecture: Split-screen editorial magazine layout in `components/contact/contact-page.tsx` (`min-h-[100dvh]`). Left column features brutalist Sans-Serif headline ("LET'S CREATE"), italicized Serif statement, and studio contact details (small bold Sans-Serif headers, Serif values). Right column features interactive Mad-Libs conversational form with auto-expanding CSS Grid underlines transitioning from `#888888` to `#000000` on focus, floating service dropdown for 6 core services, magnetic "SEND INQUIRY" button, and smooth GSAP dissolution into an elegant Serif confirmation message (_"Your story is safe with us. We will be in touch soon."_).
- Route Structure: Dedicated route `app/works/page.tsx` rendering `WorksGallery` with Suspense streaming, composed with `<ContactForm prompt="READY TO SHOOT?" />` and `<Footer />`.

- Sanity TypeGen & Query Synchronization:
  - Added `isHighlited` field to `packageType` schema in `studio/` and updated `PACKAGES_QUERY` and `PACKAGES_BY_CATEGORY_QUERY` in `bstudio/sanity/queries.ts`.
  - Re-ran Sanity TypeGen (`sanity schemas extract --force && sanity typegen generate` in `studio/`) to sync `bstudio/sanity.types.ts`.
  - Resolved TypeScript type inference error where unmatched query strings fell back to type `{}` instead of `PACKAGES_QUERY_RESULT` array in `app/packages/page.tsx`.
  - Verified with strict TypeScript checks (`tsc --noEmit`).

## Session Notes

- Fetching Albums from Sanity for Works Page completed and verified. Analyzed `albumType`, `categoryType`, and `mediaType` schemas in `studio/schemaTypes/`. Created `ALBUMS_QUERY` and `CATEGORIES_QUERY` with `defineQuery`. Ran TypeGen in `studio/` to generate TypeScript types. Added `res.cloudinary.com` remote pattern to `next.config.ts`. Updated `components/works/works-page.tsx` with `mapSanityAlbum`, dynamic category tabs, mixed media support, and error retry logic. Integrated data fetching into `app/works/page.tsx` with `"use cache"` and `<Suspense>`. Verified with TypeScript strict checks (`tsc --noEmit`), ESLint (`pnpm lint`), production build (`pnpm build` in 1007ms, 10/10 routes passing), and runtime browser verification rendering the published Sanity album. Ready for next user instruction.
  - Updated `components/navbar.tsx` desktop and mobile nav items to route "About" directly to `/about`.
  - Strictly locked to Off-Light theme (`#F7F7F5` base, `#111111` text, `#888888` muted text, zero dark mode styling).
  - Verified with full TypeScript check (`tsc --noEmit`), ESLint (`pnpm lint`), Next.js production build (`pnpm build`), and dev server curl verification (HTTP 200).

## Open Questions

- None currently.

## Architecture Decisions

- Theme: Locked to Off-Light Modern Editorial palette (`--bg-base: #F7F7F5`, `--bg-surface: #EBEBE8`, `--bg-subtle: #DFDFDC`, `--border-subtle: rgba(17, 17, 17, 0.08)`, `--text-primary: #111111`, `--text-muted: #888888`, `--accent-primary: #000000`) with `color-scheme: light;`.
- Dedicated Works Architecture: Component `components/works/works-page.tsx` exporting `WorksPage` with dual interactive filtering (Media Format: ALL, PHOTOS, VIDEOS, MIXED; Shoot Category: strictly derived from categories fetched from Sanity), Next.js `<Image>` optimization with `res.cloudinary.com` remote pattern, `SkeletonCard` pulse loader, image `onError` fallback with retry logic, and responsive CSS grid.
- Sanity Works Integration: GROQ queries in `sanity/queries.ts` (`ALBUMS_QUERY`, `CATEGORIES_QUERY`). Next.js 16 Partial Prerendering architecture with `getWorksData()` cached via `"use cache"` and `<Suspense fallback={<WorksFallback />}>` in `app/works/page.tsx`.
- Dedicated Contact Page Architecture: Split-screen editorial magazine layout in `components/contact/contact-page.tsx` (`min-h-[100dvh]`). Left column features brutalist Sans-Serif headline ("LET'S CREATE"), italicized Serif statement, and studio contact details (small bold Sans-Serif headers, Serif values). Right column features interactive Mad-Libs conversational form with auto-expanding CSS Grid underlines transitioning from `#888888` to `#000000` on focus, floating service dropdown for 6 core services, magnetic "SEND INQUIRY" button, and smooth GSAP dissolution into an elegant Serif confirmation message (_"Your story is safe with us. We will be in touch soon."_).
- Route Structure: Dedicated route `app/works/page.tsx` rendering `WorksGallery` with Suspense streaming, composed with `<ContactForm prompt="READY TO SHOOT?" />` and `<Footer />`.

- Sanity TypeGen & Query Synchronization:
  - Added `isHighlited` field to `packageType` schema in `studio/` and updated `PACKAGES_QUERY` and `PACKAGES_BY_CATEGORY_QUERY` in `bstudio/sanity/queries.ts`.
  - Re-ran Sanity TypeGen (`sanity schemas extract --force && sanity typegen generate` in `studio/`) to sync `bstudio/sanity.types.ts`.
  - Resolved TypeScript type inference error where unmatched query strings fell back to type `{}` instead of `PACKAGES_QUERY_RESULT` array in `app/packages/page.tsx`.
  - Verified with strict TypeScript checks (`tsc --noEmit`).

## Session Notes

- Fetching Albums from Sanity for Works Page completed and verified. Analyzed `albumType`, `categoryType`, and `mediaType` schemas in `studio/schemaTypes/`. Created `ALBUMS_QUERY` and `CATEGORIES_QUERY` with `defineQuery`. Ran TypeGen in `studio/` to generate TypeScript types. Added `res.cloudinary.com` remote pattern to `next.config.ts`. Updated `components/works/works-page.tsx` with `mapSanityAlbum`, dynamic category tabs, mixed media support, and error retry logic. Integrated data fetching into `app/works/page.tsx` with `"use cache"` and `<Suspense>`. Verified with TypeScript strict checks (`tsc --noEmit`), ESLint (`pnpm lint`), production build (`pnpm build` in 1007ms, 10/10 routes passing), and runtime browser verification rendering the published Sanity album.
- Redesigned Selected Works layout and animations (`components/selected-works.tsx`): refined pinned scroll animation timing and transitions, improved layout containment and responsive image container styling, cleaned up unused GSAP transform parameters and variables. Verified with `pnpm run build` and `pnpm run lint`. Ready for GitHub push.
- Caching Removal & Dynamic Fetching Architecture:
  - Removed all caching layers for Sanity CMS and Cloudinary data across the entire application.
  - Set `useCdn: false` in `sanity/client.ts` to query Sanity Content Lake directly without edge cache lag.
  - Set `cache: "no-store"` on Cloudinary search requests in `lib/cd.ts`.
  - Configured `export const dynamic = "force-dynamic"` and `export const revalidate = 0` on all CMS-backed routes (`/`, `/works`, `/services`, `/packages`, `/album/[slug]`).
  - Removed all experimental `"use cache"` directives from server functions and components, and removed `cacheComponents` from `next.config.ts`.
  - Completely removed mock/sample fallback data (`SELECTED_PROJECTS`, `SERVICES`, `SAMPLE_IMAGES`, `SAMPLE_ALBUMS`, `COLOR_THEMES`, `ALBUM_PROJECTS`, dummy album slugs).
  - Implemented clean, editorial empty states with the message "No data to load" when queries return no data.
  - Verified with strict TypeScript checks (`tsc --noEmit`), ESLint (`pnpm lint`), and production build with dynamic route generation.

