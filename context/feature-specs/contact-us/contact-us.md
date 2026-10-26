**Task: Implement the Dedicated Contact Us Page**

Please generate the code for the `ContactPage` component using Next.js, Tailwind CSS, GSAP, and the `cn()` utility. Assume Lenis scroll is already initialized globally.

**Page Specifications & Flow:**

**1. The Layout (Split-Screen Editorial)**
* **Structure:** A full-height (100vh) section divided into two primary areas to create a high-end magazine layout[cite: 1, 2].
* **Left Side (The Details):** 
    * A massive, brutalist Sans-Serif headline taking up significant space: **"LET'S CREATE"** or **"GET IN TOUCH"**[cite: 1].
    * Below it, a short, sophisticated paragraph using the elegant italicized Serif font (e.g., *"Available worldwide. Reach out to discuss your next cinematic project or request our complete pricing guide."*)[cite: 1].
    * At the bottom of the left column, include the studio's contact details (Email, Phone, Studio Location, Social Links). Use a clean, minimalist layout with small, bold Sans-Serif headers and Serif values.
* **Right Side (The Conversational Form):**
    * Display the interactive "Mad-Libs" conversational form[cite: 1].
    * The sentence must read: *"Hi B studio, my name is [ Your Name ]. I am captivated by your work and would love to book a [ Select Service ▾ ] for my upcoming event around [ Date ]. You can reach me at [ Email Address ] to discuss the details."*[cite: 1]

**2. Form Interactions (The "Awwwards" Magic)**
* **Focus State:** The user inputs must be represented as sleek underlines[cite: 1]. They should smoothly transition from muted grey to pure black when clicked/focused[cite: 1].
* **Service Selector:** Clicking `[ Select Service ▾ ]` should open a sleek, floating dropdown menu listing the 6 core services (Preshoot, Casual Shoot, Birthday Shoot, Engagement Shoot, Wedding Shoot, Promotion Video)[cite: 1].
* **Typography:** The static text in the form must use the sophisticated Serif font, while the user's typed input must use the brutalist Sans-Serif font[cite: 1].

**3. Submission & Success State**
* **The Button:** Below the paragraph, include a massive, pill-shaped or rectangular button that says **"SEND INQUIRY"** in bold Sans-Serif[cite: 1]. Apply a subtle magnetic hover effect, pulling it slightly toward the user's cursor[cite: 1].
* **The Fade:** When clicked, the form should dissolve smoothly, and an elegant Serif confirmation message should fade in: *"Your story is safe with us. We will be in touch soon."*[cite: 4]

**Theme Enforcement:**
* Lock the entire page into the **Cinematic Off-Light theme** (no dark mode styling whatsoever)[cite: 1].
* The background must be Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5)[cite: 1]. 
* The primary text must use Rich Charcoal / Ink Black (`--text-primary` / #111111)[cite: 1]. 
* Secondary text, outlines, and inactive input lines should use Soft Mid-Grey (`--text-muted` / #888888)[cite: 1].

Output *only* the complete, working React component code. Do not provide explanations or read further context. Ensure all GSAP animations are properly cleaned up on component unmount.