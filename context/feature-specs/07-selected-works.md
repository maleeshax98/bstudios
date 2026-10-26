**Task: Implement the Selected Works Section**
implement this after `PinnedScrollText` in home page.

Please generate the code for the `SelectedWorks` component using Next.js, Tailwind CSS, GSAP (with ScrollTrigger), and the `cn()` utility. Assume Lenis scroll is already initialized globally.

**Component Specifications:**
* **Layout & Content:** A dedicated full-screen section showcasing 5 "Selected Works"[cite: 1]. Use 5 low-quality, cinematic sample image URLs from the internet (e.g., Unsplash). Each project must display the image on one side, and a text block (Title, short description, and a "View" button) on the opposite side.
* **Animation Mechanic (The Alternating Center-Hold Reveal):** Built with GSAP ScrollTrigger tied to the user's downward scroll speed (`scrub: true`):
    * **Entry:** The project image and text block enter from opposite sides. For example, if the image slides in from outside the right edge, the text block slides in from the left edge[cite: 1]. Alternate this direction for each of the 5 projects.
    * **The Hold:** The image and text meet perfectly in the center of the viewport and stay still (pinned or delayed in the timeline) for a moment as the user scrolls, ensuring they have plenty of time to read the description and click the "View" button.
    * **The Exit:** As the user continues scrolling, the current project (both image and text) scales down (zooms out into the screen) and fades to 0 opacity.
    * **Next:** The next project immediately begins its entry sequence.
* **Typography:** Use the established "Modern Editorial" typography (massive bold Sans-Serif for titles, elegant Serif or clean Sans for descriptions) to maintain the high-end gallery feel[cite: 5].
* **Theme Enforcement:** Lock the component into the cinematic off-light theme only (no dark mode styling whatsoever)[cite: 5]. The section background must be Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5) and the typography must use Rich Charcoal / Ink Black (`--text-primary` / #111111)[cite: 5].

Output *only* the complete, working React component code. Do not provide explanations or read further context. Ensure all GSAP animations and ScrollTriggers are properly cleaned up on component unmount.