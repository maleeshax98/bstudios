# Backend Feature 07: Featured Works from Sanity on Home Page

**Status:** `COMPLETED`
**Date:** 2026-10-27

## Requirements

1. **Analyze `albumType` schema in Sanity:**
   - Inspect `studio/schemaTypes/albumType.ts` and `sanity.types.ts` for the `isFeatured` boolean flag.
2. **GROQ Query:**
   - Write a GROQ query to find albums where `isFeatured == true`.
   - Order results by `publishedAt desc, _createdAt desc`.
   - Extract schema and generate TypeScript types using Sanity TypeGen (`FEATURED_ALBUMS_QUERY_RESULT`).
3. **Frontend Integration (`<SelectedWorks />` on `app/page.tsx`):**
   - Fetch featured albums on the server in `getHomeData()` using `client.fetch(FEATURED_ALBUMS_QUERY)`.
   - Update `<SelectedWorks />` to accept `initialWorks?: FEATURED_ALBUMS_QUERY_RESULT`.
   - Dynamically map Sanity album data to project slide cards (index, title, category, year, description, thumbnail image, `/album/[slug]` link).
   - Dynamically adapt the GSAP timeline scroll distance and the intro counter (`01 — XX / Selected Works`) based on the number of projects.
   - Utilize `<OptimizedImage>` with Cloudinary optimization, external image fallback, and retry handling.
   - Fall back smoothly to pre-curated sample projects if no featured albums exist in Sanity or if a fetch error occurs.

## Verification Checklist

- [x] Analyzed `albumType.ts` and confirmed `isFeatured` boolean field.
- [x] Added `FEATURED_ALBUMS_QUERY` to `bstudio/sanity/queries.ts`.
- [x] Ran `pnpm run typegen` in `studio/`, generating `FEATURED_ALBUMS_QUERY_RESULT` in `bstudio/sanity.types.ts`.
- [x] Updated `bstudio/components/selected-works.tsx` to accept `initialWorks` prop and render dynamic featured works with GSAP ScrollTrigger.
- [x] Updated `bstudio/app/page.tsx` to fetch `FEATURED_ALBUMS_QUERY` in `getHomeData()` and pass `featuredWorks` into `<SelectedWorks initialWorks={featuredWorks} />`.
- [x] TypeScript strict type-check passed (`pnpm exec tsc --noEmit`) with 0 errors.
- [x] ESLint passed (`pnpm lint`) with 0 errors.
- [x] Next.js production build (`pnpm build`) compiled and prerendered all 23 routes cleanly.
- [x] Verified HTTP 200 OK on `http://localhost:3000`.
