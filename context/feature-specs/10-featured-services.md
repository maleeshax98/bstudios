**Task: Implement the Horizontal Services Exhibition Section**

 Implement the Horizontal Featured Services Exhibition Section after the philosophy

Please generate the code for the `ServicesExhibition` component using Next.js, Tailwind CSS, GSAP (with ScrollTrigger), and the `cn()` utility. Assume Lenis scroll is already initialized globally.

**Component Specifications:**
* **Layout & Pinning:** A massive container section. When the top of this section reaches the top of the viewport, it must lock (pin) vertically[cite: 1].
* **Animation Mechanic (Horizontal Scroll):** As the user scrolls *down* with their mouse wheel while pinned, the inner content must move *horizontally* from right to left, perfectly tied to the scroll speed (`scrub: true` or `1`)[cite: 1]. 
* **Content (The Panels):** The horizontal scrolling content should consist of 6 massive, full-screen panels (100vw each) representing the core services: Preshoot, Casual Shoot, Birthday Shoot, Engagement Shoot, Wedding Shoot, and Promotion Video[cite: 1].
* **Panel Design (Inside each panel):**
    * **Typography:** A massive, elegant Serif number (e.g., *01.* to *06.*) sits in the background[cite: 1]. Overlapping it is the bold Sans-Serif service name[cite: 1].
    * **Visuals:** An asymmetrical, floating placeholder image (e.g., high-quality Unsplash URLs) specific to that service sits alongside the text[cite: 1].
    * **Details:** Include a short, 2-sentence description of the package, followed by a sleek "[ View Gallery ]" button[cite: 1].
* **Theme Enforcement:** Lock the component into the cinematic off-light theme only (no dark mode styling whatsoever)[cite: 10]. The background must be Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5) and the primary text should be Rich Charcoal / Ink Black (`--text-primary` / #111111)[cite: 10]. Secondary text and massive background numbers can use Soft Mid-Grey (`--text-muted` / #888888)[cite: 10].

Output *only* the complete, working React component code. Do not provide explanations or read further context. Ensure all GSAP animations and ScrollTriggers are properly cleaned up on component unmount.