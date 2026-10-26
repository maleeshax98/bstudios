**Task: Implement the Cinematic Pinned Horizontal Scroll Text**

Please generate the code for the `PinnedScrollText` component using Next.js, Tailwind CSS, GSAP (with ScrollTrigger), and the `cn()` utility. Assume Lenis scroll is already initialized globally.

**Component Specifications:**
* **Layout & Pinning:** A full-screen section (100vh) that acts as a container. When the top of this section reaches the top of the viewport (`start: "top top"`), the section must **pin** in place[cite: 1, 5, 8]. The user cannot scroll further down the page until the text animation completes[cite: 5].
* **Animation Mechanic:** Inside the pinned section, a massive text block reading "CINEMATIC ART AND DIRECTING" starts off-screen to the right. As the user scrolls, the text moves horizontally from right to left. This movement must be tied perfectly to the user's downward scroll speed using GSAP (`scrub: true` or `scrub: 1`)[cite: 5, 8]. 
* **Release Condition:** The ScrollTrigger pinning must end, allowing the user to scroll vertically again, *only* when the word "DIRECTING" (the end of the text block) fully enters the viewport[cite: 5]. 
* **Typography:** Use a massive, brutalist, bold Sans-Serif font to give the text a modern editorial feel[cite: 9]. The text should be large enough to dominate the screen.
* **Theme Enforcement:** Lock the component into the cinematic off-light theme only (no dark mode styling whatsoever)[cite: 9]. The background must be Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5) and the text should be Rich Charcoal / Ink Black (`--text-primary` / #111111)[cite: 9].

Output *only* the complete, working React component code. Do not provide explanations or read further context. Ensure all GSAP animations and ScrollTriggers are properly cleaned up on component unmount.

