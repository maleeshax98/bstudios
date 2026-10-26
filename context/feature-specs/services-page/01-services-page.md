**Task: Implement the Dedicated Services Page**

Please generate the code for the `ServicesPage` (and any necessary sub-components) using Next.js, Tailwind CSS, GSAP (with ScrollTrigger), and the `cn()` utility. Assume Lenis scroll is already initialized globally.

**Page Specifications & Flow:**

**1. The Loading Sequence (The Whisper Intro)**[cite: 4]
* **Visual:** The initial load must cover the screen in Pure Cinematic Black (`#000000`).
* **Animation:** A small, elegant line of text reading *"Crafting your story."* fades into the exact center of the screen using the sophisticated, italicized Serif font. It holds for a second, slowly fades out, and the black background smoothly dissolves to reveal the main page in the Off-Light theme.

**2. The Landing (The Anchor)**[cite: 4]
* **Layout:** A full-height (100vh) introduction section. 
* **Content:** On the left side, display a massive, bold Sans-Serif headline: **"WHAT WE DO"**. On the right side, include a short, sophisticated paragraph explaining the studio's cinematic approach to capturing memories. 
* **Interaction:** Include a subtle custom cursor or a tiny, animated line indicating the user should scroll down.

**3. The Horizontal Exhibition (The Core)**[cite: 4]
* **Layout & Pinning:** A massive container section. When the top of this section reaches the top of the viewport, it must lock (pin) vertically.
* **Animation Mechanic:** As the user scrolls *down* with their mouse wheel while pinned, the inner content must move *horizontally* from right to left, perfectly tied to the scroll speed (`scrub: true` or `1`).
* **The Panels:** The horizontal track must contain 6 massive, full-screen panels (100vw each) representing the core services: *Preshoot, Casual Shoot, Birthday Shoot, Engagement Shoot, Wedding Shoot, and Promotion Video*[cite: 1, 4].
* **Panel Design:** Inside each panel, place a massive, elegant Serif number (e.g., *01.* to *06.*) in the background. Overlapping it is the bold Sans-Serif service name. Beside the text, include an asymmetrical, floating cinematic image (use high-quality Unsplash URLs). Below the text, add a 2-sentence description and a sleek **[ View Gallery ]** button[cite: 4].

**4. The Booking Transition (The End)**[cite: 4]
* **The Finish Line:** After gliding through the 6th panel, the horizontal scroll releases. 
* **The CTA:** The user scrolls down into a final section revealing a massive text prompt: *"READY TO SHOOT?"* followed by the interactive "Mad-Libs" conversational booking form (reused from the homepage).

**Theme Enforcement:**
* Aside from the initial black loading screen, lock the entire page into the **Cinematic Off-Light theme** (no dark mode styling)[cite: 1].
* The background must be Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5)[cite: 1]. 
* The primary text must use Rich Charcoal / Ink Black (`--text-primary` / #111111)[cite: 1]. 
* Secondary text and massive background numbers should use Soft Mid-Grey (`--text-muted` / #888888)[cite: 1].

Output *only* the complete, working React component code. Do not provide explanations or read further context. Ensure all GSAP animations and ScrollTriggers are properly cleaned up on component unmount.