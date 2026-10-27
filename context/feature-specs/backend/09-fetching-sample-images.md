## Fetching and showing sample images in home page

## Status: COMPLETED

## Context

- Fetch recent 12 images from cloudinary `SAMPLE-IMAGES-HOME-PAGE` folder.
- I have created the function in `lib/cd.ts`. you can update it if u want.
- Use it to fetch images.
- Then show those images in `sample-gallery.tsx`.
- Update `sample-gallery.tsx` to accept initial images and display them in a grid.

## Implementation Details

- **Cloudinary Fetch (`lib/cd.ts`):**
  - Updated `searchCloudinaryWithCache()` to accept `sortDirection` (`"asc" | "desc"`).
  - Implemented `getSampleImages()` querying `(asset_folder="SAMPLE-IMAGES-HOME-PAGE" OR asset_folder="SIHP") AND resource_type=image`.
  - Ordered by `created_at: "desc"` to fetch the 12 most recent images.
  - Implemented Next.js native `fetch` caching with `revalidate: 3600` (1 hour) and secondary Cloudinary SDK fallback.
- **Home Page Integration (`app/page.tsx`):**
  - Added `getSampleImages()` to `getHomeData()` marked with `"use cache"`.
  - Passed `sampleImages` to `<SampleGallery initialImages={sampleImages} />`.
- **Masonry Gallery (`components/sample-gallery.tsx`):**
  - Updated `SampleGalleryProps` to accept `initialImages?: CloudinaryResource[]`.
  - Mapped Cloudinary resources to dynamic gallery items with exact aspect ratio calculations (`style={{ aspectRatio: `${item.width} / ${item.height}` }}`).
  - Integrated `<OptimizedImage>` with auto-format/auto-quality WebP/AVIF delivery, skeleton loading state, and error retry handling.
  - Retained pre-curated sample images as graceful fallback.
- **Verification:**
  - `pnpm exec tsc --noEmit` passed with 0 errors.
  - `pnpm lint` passed with 0 errors.
  - `pnpm build` passed compiling all 23 routes cleanly with Partial Prerendering.
  - Runtime verified via curl with HTTP 200 OK and Cloudinary public IDs rendered.

