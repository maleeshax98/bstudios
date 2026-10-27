# Backend Feature 08: Client Space Fetch Wedding Albums from Sanity

**Status:** `COMPLETED`
**Date:** 2026-10-27

## Requirements

1. **Sanity GROQ Query:**
   - Define a GROQ query to fetch the first 4 wedding albums ordered by `publishedAt desc, _createdAt desc`.
   - Filter by wedding category: `*[_type == "album" && (lower(category->title) == "wedding" || category->title match "*wedding*")] | order(publishedAt desc, _createdAt desc)[0...4]`.
   - Retrieve all required album fields: `_id`, `title`, `description`, `date`, `category->{ _id, title }`, `alt`, `thumbnail`, `cloudinaryFolder`, `Media`, `count`, `duration`, `slug`, `publishedAt`.
   - Run TypeGen in `studio/` to generate `WEDDING_ALBUMS_QUERY_RESULT` in `bstudio/sanity.types.ts`.

2. **Server-Side Data Fetching (`app/page.tsx`):**
   - In `getHomeData()`, fetch `WEDDING_ALBUMS_QUERY` using `client.fetch(WEDDING_ALBUMS_QUERY)` concurrently alongside existing queries in `Promise.all`.
   - Include defensive `try/catch` fallback returning empty arrays during transient build/prerender network timeouts.
   - Pass fetched `weddingAlbums` as `initialAlbums` to `<ClientSpaceTeaser />`.

3. **Frontend Integration (`components/client-space-teaser.tsx`):**
   - Accept `initialAlbums?: WEDDING_ALBUMS_QUERY_RESULT` in `ClientSpaceTeaserProps`.
   - Dynamically map Sanity wedding albums to the `PersonalAlbum` data model (`id`, `galleryId`, `client`, `shootType`, `assetCount`, `src`, `alt`, `slug`, `link`).
   - Use `<OptimizedImage>` with Cloudinary format/quality optimization, skeleton loaders, and retry handling.
   - Wrap album cards in Next.js `<Link>` to allow direct navigation to `/album/${slug}`.
   - Update the primary CTA "VIEW SAMPLE ALBUM" button to link to the first wedding album or `/works`.
   - Fall back smoothly to pre-curated sample albums if fewer than 4 wedding albums exist in Sanity, preserving the 4-card spread animation without breaking layout or GSAP mechanics.

## Verification Checklist

- [x] Defined `WEDDING_ALBUMS_QUERY` and `CLIENT_SPACE_ALBUMS_QUERY` in `bstudio/sanity/queries.ts`.
- [x] Executed `pnpm run typegen` in `studio/`, generating `WEDDING_ALBUMS_QUERY_RESULT` and `CLIENT_SPACE_ALBUMS_QUERY_RESULT` in `bstudio/sanity.types.ts`.
- [x] Updated `bstudio/app/page.tsx` (`getHomeData()` & `Home()`) to fetch wedding albums via `client.fetch` and pass `initialAlbums` to `<ClientSpaceTeaser />`.
- [x] Updated `bstudio/components/client-space-teaser.tsx` with dynamic mapping, `<OptimizedImage>`, clickable cards, and dynamic sample album CTA link.
- [x] TypeScript strict type-check passed (`pnpm exec tsc --noEmit`) with 0 errors.
- [x] ESLint passed (`pnpm lint`) with 0 errors.
- [x] Next.js production build (`pnpm build`) compiled and prerendered all 23 routes cleanly with PPR.
- [x] Verified HTTP 200 OK on running dev server.
