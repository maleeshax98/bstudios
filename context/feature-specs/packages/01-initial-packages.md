**Task: Implement the Dedicated Packages Page with Sanity CMS Integration**

**Status: COMPLETED**

Please generate the code for the `PackagesPage` component and its corresponding Sanity schema using Next.js, Tailwind CSS, GSAP (with ScrollTrigger), and the `cn()` utility. Assume Lenis scroll is already initialized globally.

**1. Sanity Schema Definition (The Package Type)**

- Generate a Sanity schema file (e.g., `package.ts`) to manage the packages dynamically. It must include:
  - `title` (String): The name of the package (e.g., "Director's Cut").
  - `serviceCategory` (String): A predefined list or string mapping to the 6 core services (Preshoot, Casual, Birthday, Engagement, Wedding, Promotion).
  - `description` (Text): A short, elegant description of the package's vibe.
  - `deliverables` (Array of Strings): A list of what is included (e.g., "8 Hours Coverage", "4K Cinematic Trailer").

**2. Data Fetching & Sample Data**

- In the Next.js component, write the GROQ query and fetch logic to retrieve the packages from Sanity based on the active tab.
- Include a robust array of **mock sample data** directly in the component (matching the Sanity schema structure) to be used as a fallback or for immediate UI rendering before the CMS is fully populated.

**3. The Editorial Header**

- **Layout:** A clean, high-impact header section to introduce the pricing and packages.
- **Typography:** A massive, brutalist Sans-Serif headline (e.g., "INVESTMENT" or "CURATED PACKAGES") aligned to the left or center. Below it, an elegant, italicized Serif subtitle (e.g., _"Bespoke collections tailored to your unique narrative."_).

**4. The Service Selection (Interactive Tabs)**

- **Layout:** Implement an elegant, sticky navigation row or sidebar to let the user select the shoot type.
- **Categories:** The tabs must include the 6 core services: **[ PRESHOOT ] | [ CASUAL ] | [ BIRTHDAY ] | [ ENGAGEMENT ] | [ WEDDING ] | [ PROMOTION ]**.
- **Styling:** The tabs must use a small, bold, track-spaced Sans-Serif font. Active tabs should be Rich Charcoal (`#111111`) with a subtle underline or pill background, while inactive tabs remain Soft Mid-Grey (`#888888`).

**5. The Packages Display (The Details)**

- **Layout:** A minimalist, editorial grid or vertical list of packages that dynamically updates based on the fetched/sample data for the selected service tab.
- **Card Design:** Each package tier should be displayed in a clean, border-lined card or separated by elegant hairline dividers (`--border-subtle`).
- **Content per Package:**
  - **Title:** Bold Sans-Serif package name fetched from data.
  - **Description:** A short, sophisticated sentence in italicized Serif from data.
  - **Deliverables:** A sleek list mapping over the deliverables array from data. Use tiny Sans-Serif for the list items.
  - **Call to Action:** A sleek **[ INQUIRE NOW ]** button that smoothly scrolls to the contact form or redirects to the contact page.

**6. Theme Enforcement (Cinematic Off-Light)**

- Lock the entire page into the **Cinematic Off-Light theme** (no dark mode styling whatsoever).
- The background must be Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5).
- The primary text must use Rich Charcoal / Ink Black (`--text-primary` / #111111).
- Secondary text, borders, and inactive tabs should use Soft Mid-Grey (`--text-muted` / #888888) and Warm Muted Grey (`--border-subtle` / #DFDFDC).

Output _only_ the complete, working Sanity schema code block followed by the complete React component code block. Do not provide explanations or read further context. Ensure all GSAP animations and state transitions between the service tabs are properly cleaned up on component unmount.
