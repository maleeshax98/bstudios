**Task: Implement the Color Grade Lookbook Section**


Please generate the code for the `ColorGradeLookbook` component using Next.js, Tailwind CSS, GSAP, and the `cn()` utility. 

**Component Specifications:**
* **Layout (The Editorial Grid):** A clean, high-end editorial grid showcasing 4 distinct color grading themes (e.g., *Dreamy Glow, Off Green, Moody, Dark Aesthetic*). Use 4 high-quality cinematic placeholder image URLs (like Unsplash) representing each aesthetic. 
* **Card Design:** Each grid item should feature the image prominently. Below or overlapping the image, place the theme name. 
* **Interactions:** When hovering over an image, apply a subtle, smooth scale-up effect (zoom in slightly while keeping the container hidden/overflow) to make the photos feel immersive.
* **Typography:** Use the sophisticated, elegant italicized Serif font for the color theme names to give it an artistic, high-end gallery feel[cite: 8]. 
* **Call to Action:** Below the lookbook grid, center a sleek, pill-shaped or bold rectangular "WORK WITH US" button. Apply a subtle magnetic hover effect to the button, pulling it slightly toward the user's cursor[cite: 3]. The button text should use the brutalist, bold Sans-Serif font[cite: 8].
* **Theme Enforcement:** Lock the component into the cinematic off-light theme only (no dark mode styling whatsoever)[cite: 8]. The section background must be Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5)[cite: 8]. The primary text and button styling must use Rich Charcoal / Ink Black (`--text-primary` / #111111)[cite: 8]. 

Output *only* the complete, working React component code. Do not provide explanations or read further context. Ensure any GSAP animations are properly cleaned up on component unmount.