**Task: Implement the Single Album Gallery Page**

**Status: COMPLETED**

## CONTEXT

-I have added lib/cd.ts file for configing cloudinary and some functions to get photos and videos.
First analize it.

-So then what you need to do is, in works page, link album card to a path like /album/[slug from the sanity] (/album/[slug]).
Then in that page.tsx you can run a sanity query to find the cloudinary folder name.

-And then you can run cd.ts functions to get data.

- And there will be a filters only [PHOTOS] nad [VIDEOS] by default photos will be selected but if there is no photos hide that and focus only in videos.

## UI

**1. The Immersive Welcome (Title Sequence)**

- **The Cinematic Transition:** When the page loads, the screen must start with a pure, cinematic white background[cite: 1].

- **The Name Reveal:** The Event Name smoothly fades into the dead center of the screen using an elegant, italicized Serif font, holds for a moment, and then fades completely out and then the description works same and fades out completly[cite: 1].

- **The Date Reveal:** Immediately after, the Event Date fades into the center in a bold Sans-Serif font, holds, and then fades out[cite: 1]. The black intro overlay then disappears, revealing the main gallery.

**2. The Main Gallery (Pinterest / Masonry Grid)**

- **Structure:** Render the album's media in a responsive, asymmetrical Masonry grid (Pinterest style)[cite: 1]. This ensures both portrait and landscape formats fit together perfectly without rigid cropping[cite: 1].
- **Scrolling:** Keep scroll behavior native and clean, omitting heavy scroll-linked animations for distraction-free viewing[cite: 1].

**3. The Faded Footer & Filters**

- **Layout:** Instead of a header, implement a sticky/fixed footer pinned at the bottom of the viewport.
- **Faded Top:** The footer container must feature a smooth gradient at its top edge, fading from transparent down to solid Cinematic Off-White so it blends seamlessly over the scrolling gallery.
- **Filters:** Center exactly two elegant text buttons in this footer to toggle media: **[ PHOTOS ]** and **[ VIDEOS ]**. Do not include an "All" button[cite: 1]. Active filters should be visually distinct.

**4. The Full-Screen Lightbox Experience**

- **Interaction:** Clicking any individual photo or video expands it into a full-screen lightbox against a pure black background[cite: 1].
- **Navigation:** The lightbox must include functioning Next (`>`) and Previous (`<`) arrows to let the user navigate through the album seamlessly, plus an "X" to close[cite: 1].
