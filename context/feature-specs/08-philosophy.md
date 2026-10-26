**Task: Implement the Philosophy Section**


Please generate the code for the `Philosophy` component using Next.js, Tailwind CSS, GSAP (with ScrollTrigger), and the `cn()` utility. Assume Lenis scroll is already initialized globally.

**Component Specifications:**
* **Layout & Pinning:** A full-screen section (100vh) acting as a container. When this section reaches the center or top of the viewport, the section must **pin** in place[cite: 1, 5, 8].
* **Content:** A large text block displaying the studio's philosophy (e.g., a multi-line paragraph about capturing authentic moments, treating memories like cinema, etc.)[cite: 5].
* **Animation Mechanic (Scroll-Linked Fill):** 
    * Initially, the entire philosophy paragraph is displayed at a very low opacity (e.g., 20%)[cite: 5, 8].
    * As the user scrolls down while the section is pinned, the text opacity "fills in" from 20% to 100%. This should happen perfectly tied to the downward scroll speed (`scrub: true` or `scrub: 1`)[cite: 1, 5, 8].
* **Release Condition:** The user cannot scroll further down the page until the *entire* paragraph is fully lit (100% opacity). Once fully lit, the ScrollTrigger pinning releases, allowing the user to continue scrolling[cite: 1, 5].
* **Typography:** Use the sophisticated, elegant, italicized Serif font for this body of text, establishing the high-end editorial feel[cite: 8]. It should be large and easily readable.
* **Theme Exception (Dark Background):** Unlike the rest of the site which uses the cinematic off-light theme, **this specific section must use a dark background with light text** to create a dramatic visual break. Ensure the background uses Pure Cinematic Black (`#000000`) and the fully lit text uses Crisp White (`#FFFFFF`)[cite: 2, 7, 8].

Output *only* the complete, working React component code. Do not provide explanations or read further context. Ensure all GSAP animations and ScrollTriggers are properly cleaned up on component unmount.