**Task: Implement the Private Client Space Teaser Section**

Please generate the code for the `ClientSpaceTeaser` component using Next.js, Tailwind CSS, GSAP (with ScrollTrigger), and the `cn()` utility. Assume Lenis scroll is already initialized globally.

Implement this after `<SampleGallery />` in `/page.tsx`

**Component Specifications:**
* **Layout & Concept:** A highly premium, full-height section (100vh) designed to inform users that they receive a dedicated, private space on the website for every single shoot. It should feel exclusive, like a VIP digital vault or a private movie premiere.
* **Animation Mechanic (The Album Spread):** 
    * In the center or off to one side, display a stack of 3-4 high-quality cinematic placeholder images representing personal "albums"[cite: 4, 12]. 
    * As the user scrolls into the section, use GSAP ScrollTrigger to beautifully fan out or spread these stacked albums into a cascading or overlapping layout, visually demonstrating a collection of personal galleries unlocking.
* **Typography (Modern Editorial):** 
    * **Headline:** A massive, brutalist, bold Sans-Serif headline (e.g., "YOUR EXCLUSIVE SPACE" or "YOUR PRIVATE PREMIERE")[cite: 12].
    * **Description:** Below the headline, use the elegant, italicized Serif font for a description explaining the feature (e.g., *"Every memory, beautifully curated. Access your personalized, high-resolution digital albums in one exclusive, private space."*)[cite: 12].
* **Call to Action:** Include a sleek, pill-shaped or bold rectangular "CLIENT LOGIN" or "VIEW SAMPLE ALBUM" button. Apply a subtle magnetic hover effect to the button, pulling it slightly toward the user's cursor[cite: 13].
* **Theme Enforcement:** Lock the component into the cinematic off-light theme only (no dark mode styling whatsoever)[cite: 12]. The section background must be Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5)[cite: 12]. The primary text and button styling must use Rich Charcoal / Ink Black (`--text-primary` / #111111)[cite: 12]. Secondary text should use Soft Mid-Grey (`--text-muted` / #888888)[cite: 12].

Output *only* the complete, working React component code. Do not provide explanations or read further context. Ensure all GSAP animations and ScrollTriggers are properly cleaned up on component unmount.