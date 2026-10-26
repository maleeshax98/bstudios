**Task: Implement the Dedicated Works (Portfolio) Page**


Please generate the code for the `WorksPage` component using Next.js, Tailwind CSS, GSAP, and the `cn()` utility. Assume Lenis scroll is already initialized globally.

**Page Specifications & Flow:**

**1. The Header & Filtering System**
* **Layout:** A clean, full-width header section introducing the gallery.
* **Title:** A massive, brutalist Sans-Serif headline (e.g., "ARCHIVE" or "SELECTED WORKS") aligned to the left or center.
* **Dual Tabs:** Below the title, implement two sleek, interactive filter rows:
    * *Media Format:* Tabs to toggle between **[ ALL ] | [ PHOTOS ] | [ VIDEOS ]**.
    * *Shoot Category:* Tabs to toggle between **[ ALL ] | [ WEDDING ] | [ BIRTHDAY ] | [ COMMERCIAL ] | [ CASUAL ] | [ ENGAGEMENT ]**.
* **Styling:** The tabs must use a small, bold, track-spaced Sans-Serif font. Active tabs should be Rich Charcoal (`#111111`) with a subtle underline or pill background, while inactive tabs remain Soft Mid-Grey (`#888888`).

**2. The Gallery Grid & Album Cards**
* **Layout:** A responsive grid layout (e.g., CSS Grid or asymmetrical masonry) to display the album covers.
* **Album Cards:** Each grid item represents a full project album. It must display:
    * **Thumbnail:** A massive, high-quality image container.
    * **Title:** The album name (e.g., "Malaysia's Birthday") using the sophisticated, italicized Serif font, placed below or elegantly overlapping the image bottom.
    * **Date/Meta:** The date of the shoot (e.g., "Oct 24, 2026") and the category using a clean, tiny Sans-Serif font.
* **Interactions:** Hovering over a card should trigger a smooth scale-up effect on the thumbnail inside its overflow-hidden container.

**3. Image Optimization, Skeletons & Retry Logic**
* **Image Component:** Strictly use the Next.js `<Image>` component for heavy optimization. Use high-quality Unsplash URLs as placeholders (Cloudinary integration will happen later).
* **Skeleton Loader:** Build a `SkeletonCard` UI state using Tailwind's `animate-pulse` (with a muted background color like `#EBEBE8`). Render a grid of these skeletons initially to simulate data fetching.
* **Error & Retry Handling:** Implement an `onError` state for the `<Image>` components. If a sample image fails to load, the card should display a clean fallback UI with a subtle "Retry Image" button that triggers a re-render/reload attempt for that specific thumbnail.

**4. Theme Enforcement (Cinematic Off-Light)**
* Lock the entire page into the **Cinematic Off-Light theme** (no dark mode styling whatsoever).
* The background must be Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5). 
* The primary text must use Rich Charcoal / Ink Black (`--text-primary` / #111111). 
* Secondary text, outlines, and inactive tabs should use Soft Mid-Grey (`--text-muted` / #888888) and Warm Muted Grey (`--border-subtle` / #DFDFDC).

Output *only* the complete, working React component code. Do not provide explanations or read further context. Ensure all filtering logic, skeleton states, and image retry mechanics are fully functional within the component.