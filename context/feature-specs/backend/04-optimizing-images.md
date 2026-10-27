**Task: Implement Cloudinary Image Optimization and Next.js Caching**

**Status: COMPLETED**


Please update our media fetching and rendering logic using Next.js data caching and the `next-cloudinary` library[cite: 20].

**Specifications:**

**1. Server-Side Data Caching**

- **Logic:** Update the Next.js server component responsible for fetching the album media from the specific `cloudinaryFolder` referenced in our Sanity CMS.
- **Caching:** Wrap the Cloudinary Search API call using Next.js's native fetch caching mechanism. Add a `revalidate` timer (e.g., `revalidate: 3600` for 1 hour) so the application caches the array of media URLs locally and instantly serves the data without hitting the Cloudinary API on every page load.

**2. Frontend Image Rendering (`next-cloudinary`)**

- **Component Update:** Provide the command to install `next-cloudinary`. Replace any standard Next.js `<Image>` tags with the `<CldImage>` component for the gallery grid thumbnails.
- **Optimization:** Configure `<CldImage>` to utilize Cloudinary's auto-format and auto-quality features to dynamically serve lightweight, next-gen formats (like WebP/AVIF) and handle lazy loading directly from the CDN.
- **Loading State:** Retain the previously built `SkeletonCard` UI state using Tailwind's `animate-pulse` (with the muted `#EBEBE8` background) to display while the images are requested[cite: 5].

**3. Theme Enforcement (Cinematic Off-Light)**

- Lock any wrapper elements or error states into the **Cinematic Off-Light theme** (no dark mode styling whatsoever)[cite: 5].
- Fallback backgrounds should align with Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5)[cite: 8].

Output _only_ the necessary terminal installation command and the complete, working React server component and UI code. Do not provide explanations or read further context.
