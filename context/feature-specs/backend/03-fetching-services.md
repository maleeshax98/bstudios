## Fetch and show services form sanity

**Status: COMPLETED**

I have created sanity types for service schema.

Now I want to fetch and display services from sanity in home page `<ServicesExhibition />` and also the services page.tsx.

also

I have created sanity types for colorgrading in sanity.
Now I want to fetch and display colorgrading from sanity in home page where `<ColorGradeLookbook />`.

### Implementation Summary
- Defined type-safe GROQ queries `SERVICES_QUERY` and `COLORGRADING_QUERY` in `bstudio/sanity/queries.ts`.
- Ran Sanity TypeGen in `studio/` generating `SERVICES_QUERY_RESULT` and `COLORGRADING_QUERY_RESULT` in `bstudio/sanity.types.ts`.
- Added defensive `cleanImageUrl` helper handling image URL string cleaning across Cloudinary and CMS assets.
- Updated `components/services-exhibition.tsx` to accept `initialServices` prop and dynamically render all services with dynamic count badges and GSAP horizontal track recalculation.
- Updated `components/color-grade-lookbook.tsx` to accept `initialLookbook` prop and dynamically render all color grading themes with dynamic count badges and GSAP horizontal track recalculation.
- Updated `components/services/services-horizontal.tsx` (`ServicesVertical`) to accept `initialServices` prop and dynamically render vertical exhibition panels with staggered GSAP reveals.
- Updated `app/page.tsx` with `"use cache"` SSR data fetching via `sanityFetch` for both services and colorgrading documents.
- Updated `app/services/page.tsx` with `"use cache"` SSR data fetching via `sanityFetch` for services documents.
- Verified with TypeScript strict checks (`tsc --noEmit`), ESLint, Next.js production build (`pnpm build`, 17/17 routes passing), and live dev server HTTP 200 checks with verified HTML payloads.
