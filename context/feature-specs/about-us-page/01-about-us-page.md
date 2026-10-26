**Task: Implement the About Us Page**


Please generate the code for the `AboutPage` (and any necessary sub-components) using Next.js, Tailwind CSS, GSAP (with ScrollTrigger), and the `cn()` utility. Assume Lenis scroll is already initialized globally.

**Page Specifications & Flow:**

**1. The Editorial Hook (The Intro)**
* **Layout:** A massive, full-screen (100vh) introduction section that feels like opening a high-end magazine.
* **Content:** Dead center or aggressively aligned to the left, display a massive, brutalist Sans-Serif headline: **"THE VISION"** or **"WHO WE ARE"**. Intertwined or directly below it, use a large, elegant, italicized Serif font for a philosophical statement (e.g., *"We treat every memory as a cinematic masterpiece, framing authentic moments with editorial elegance."*).
* **Animation:** As the page loads, use GSAP to smoothly fade and slide the text up into place.

**2. The Director's Cut (Behind the Scenes Parallax)**
* **Layout & Pinning:** A split-screen layout. When the section hits the top of the viewport, the right side (text) pins in place while the left side (images) continues to scroll.
* **Visuals (Left Side):** A staggered column of 3 to 4 high-quality, cinematic behind-the-scenes placeholder images (e.g., Unsplash URLs of camera setups or editorial shoots). Apply a subtle GSAP parallax effect (`scrub: true`) so they move at slightly different speeds as the user scrolls.
* **Content (Right Side):** The pinned text block containing the studio's story. Use the crisp Sans-Serif for small section labels (e.g., `OUR STORY // 01`) and the sophisticated Serif for the body paragraphs detailing the studio's dedication to high-end photography and videography.

**3. The Core Pillars (The Approach)**
* **Layout:** A clean, minimalist layout breaking down the studio's approach.
* **Content:** Create an interactive or staggered reveal list of 3 core pillars (e.g., *01. Authentic Presence, 02. Editorial Lighting, 03. Cinematic Grading*). 
* **Animation Mechanic:** As the user scrolls into this section, each pillar smoothly fades in and translates upward, tied to the scroll speed to maintain the heavily curated, rhythmic pacing.

**4. The Booking Transition (The End)**
* **The Finish Line:** At the bottom of the page, include a massive text prompt: *"READY TO SHOOT?"* followed by the interactive "Mad-Libs" conversational booking form (reusing the exact structure from the homepage/services page).

**Theme Enforcement:**
* Lock the entire page into the **Cinematic Off-Light theme** (no dark mode styling whatsoever)[cite: 2, 8].
* The background must be Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5)[cite: 8]. 
* The primary text must use Rich Charcoal / Ink Black (`--text-primary` / #111111)[cite: 8]. 
* Secondary text, subtitles, and outlines should use Soft Mid-Grey (`--text-muted` / #888888)[cite: 8].

Output *only* the complete, working React component code. Do not provide explanations or read further context. Ensure all GSAP animations and ScrollTriggers are properly cleaned up on component unmount.