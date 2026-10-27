**Task: Implement Optimized Cloudinary Image with Retry Logic**

**Status: COMPLETED**
Please generate a reusable `OptimizedImage` component using React, Tailwind CSS, and the `next-cloudinary` library. 

**Component Specifications:**
* **Cloudinary Integration:** Replace standard Next.js `<Image>` tags with the `<CldImage>` component. Configure it to use `format="auto"` and `quality="auto"` to seamlessly serve lightweight formats dynamically.
* **Loading State:** Implement a skeleton loader using Tailwind's `animate-pulse` with a muted background (`#EBEBE8`) that displays while the image is downloading[cite: 4].
* **Error & Retry Mechanism:** Track the image loading state[cite: 4]. If `<CldImage>` fires an `onError` event, hide the broken image and display a clean fallback UI[cite: 4]. Inside this fallback, include a subtle, elegant "Retry Image" button (using the crisp Sans-Serif font) that updates a `retryKey` state (e.g., appending a timestamp to the image `src` or changing the component `key`) to force a fresh re-render and download attempt[cite: 4].
* **Theme Enforcement:** Lock the fallback UI and retry button into the Cinematic Off-Light theme[cite: 4]. The background of the error state should be Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5) with the retry text in Rich Charcoal / Ink Black (`--text-primary` / #111111)[cite: 4]. 

Output *only* the complete, working React component code. Do not provide explanations or read further context. Ensure the retry state management is fully functional within the component.

### Implementation Summary
- Created reusable `OptimizedImage` component in `bstudio/components/optimized-image.tsx` and re-export in `bstudio/components/ui/optimized-image.tsx`.
- Integrated `<CldImage>` with `format="auto"` and `quality="auto"` to dynamically serve next-gen formats (WebP/AVIF).
- Implemented skeleton loader with Tailwind's `animate-pulse` on muted `#EBEBE8` background while downloading.
- Implemented state tracking (`isLoaded`, `hasError`, `isRetrying`, `retryKey`, `retryTimestamp`), displaying error fallback UI on `onError` and resetting state when `src` changes.
- Added subtle, elegant "Retry Image" button using crisp Sans-Serif font (`font-sans font-semibold uppercase tracking-wider`) that increments `retryKey` and appends a cache-busting timestamp to force fresh re-render and network request.
- Locked fallback UI strictly to Cinematic Off-Light theme (`#F7F7F5` background, `#111111` retry text, `#DFDFDC` hairline border).
- Integrated `OptimizedImage` into `bstudio/components/album/album-gallery.tsx` (`LazyGalleryImage`).
- Verified with TypeScript strict checks (`pnpm exec tsc --noEmit`), ESLint (`pnpm lint`), production build (`pnpm build` compiling all 17 routes), and runtime HTTP 200 checks on `/` and `/album/sakkili-miya-pakaya`.