**Task: Implement the B studio Navbar**
*Stop. Do not read the entire context, architecture files, or global guidelines. Just implement the specific component requested below. Please reference the file named "B studio" to ensure alignment with the core project vision.*

We are building the `Navbar` component for the **B studio** project. 

**Objective**
Create a highly premium, cinematic top navigation bar that remains sticky at the top of the screen[cite: 1, 3].

**Visual Design & Theme**
* **Layout Structure:** Use a flexbox layout to distribute the elements:
  * **Left:** The "B STUDIO" logo[cite: 3].
  * **Center / Center-Left:** The navigation links (Work, Services, About, Contact)[cite: 3].
  * **Right:** A sleek CTA button (e.g., "Book" or "Inquire")[cite: 3].
* **Background:** Strictly use `--bg-base` (Cinematic Off-White / Warm Pearl, #F7F7F5)[cite: 8]. No transparency or blur that washes out the base color.
* **Border:** Use a subtle bottom border using `--border-subtle`[cite: 3, 8].
* **Typography:** The logo should be in the brutalist, tightly spaced Sans-Serif[cite: 3, 8]. The navigation links can use either the crisp Sans-Serif or the sophisticated, italicized Serif for elegant accents[cite: 3, 8].
* **Theme Enforcement:** Lock the component into the off-light theme only (no dark mode styling whatsoever)[cite: 8]. Primary text should be Rich Charcoal / Ink Black (`--text-primary`)[cite: 8]. Inactive links should use Soft Mid-Grey text (`--text-muted`)[cite: 8].

**Interactions & Animations**
* **Hover States:** When hovering over the navigation links, the muted grey text must smoothly darken to pure black (`--accent-primary`)[cite: 8].
* **CTA Button:** Apply a subtle magnetic hover effect where the right-aligned button gently snaps toward the user's custom cursor[cite: 3, 8]. 

**Mobile Responsiveness**
* **Desktop (md/lg screens):** Display the full Left-Center-Right layout as described above.
* **Mobile/Tablet:** Hide the center navigation links and the CTA button. Instead, display the "B STUDIO" logo on the left and a sleek, minimalist Hamburger Menu icon (stroke-based, using `lucide-react`) on the far right[cite: 6]. 
* **Mobile Menu Overlay:** When the hamburger menu is clicked, it should trigger a full-screen, cinematic off-white overlay (`--bg-base`). The navigation links should appear stacked vertically in massive, high-contrast typography, fading in smoothly to maintain the premium, app-like feel[cite: 1, 8].

##### Check when done
* [x] Component imports without errors and uses `cn()` for Tailwind class merging[cite: 3, 6].
* [x] The background is strictly cinematic off-white/warm pearl with no dark-mode default classes