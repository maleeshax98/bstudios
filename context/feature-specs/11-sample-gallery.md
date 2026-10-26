**Task: Implement the Sample Work Masonry Gallery**

Please generate the code for the `SampleGallery` component after the services in homepage using Next.js, Tailwind CSS, and the `cn()` utility. 

Do not add a title just the section.

**Component Specifications:**
* **Layout (The Pinterest Grid):** Create a responsive Masonry-style grid (Pinterest layout) to display a collection of sample images[cite: 2, 4]. Use CSS columns or a similar technique so that both vertical and horizontal formats fit together perfectly without being cropped into rigid squares[cite: 2, 4].
* **Content:** Use 8-12 high-quality, cinematic placeholder image URLs (e.g., Unsplash) with varying aspect ratios. 
* **The Teaser Overlay:** At the bottom of the section, implement a large, full-width gradient overlay that fades from transparent (at the top of the overlay) to solid Cinematic Off-White / Warm Pearl (`#F7F7F5`) at the bottom. This acts as a visual fade-out, obscuring the bottom images to tease that there is more work to see.
* **Call to Action:** Centered directly over the bottom gradient overlay, place a sleek, magnetic "See More" button to drive users to the full portfolio page.
* **Theme Enforcement:** Lock the component into the cinematic off-light theme only (no dark mode styling whatsoever)[cite: 8]. The section background and the bottom gradient must use Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5)[cite: 8]. The "See More" button and any text must use Rich Charcoal / Ink Black (`--text-primary` / #111111)[cite: 8].

Output *only* the complete, working React component code. Do not provide explanations or read further context.