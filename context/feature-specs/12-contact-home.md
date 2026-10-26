**Task: Implement the Conversational Contact Form**

Please generate the code for the `ContactForm` component using Next.js, Tailwind CSS, GSAP, and the `cn()` utility. 

     
IMPLEMENT THIS AFTER THE `<SampleGallery />` IN HOME PAGE

**Component Specifications:**
* **Layout & Style (The "Mad-Libs" Approach):** Instead of standard input boxes, this must be an interactive conversational sentence. 
    * The sentence should be massive, taking up a large portion of the screen.
    * The static text must use the elegant, italicized Serif font[cite: 8].
    * The user inputs (where they type or select) must be represented as sleek underlines[cite: 8].
    * When the user types, their input must use the bold, brutalist Sans-Serif font[cite: 8].
* **The Script:** 
    *"Hi B studio, my name is [ Your Name ]. I am captivated by your work and would love to book a [ Select Service ▾ ] for my upcoming event around [ Date ]. You can reach me at [ Email Address ] to discuss the details."*[cite: 1]
* **Interactions:**
    * **Focus State:** When a user clicks an input line to type, the line should smoothly transition from muted to the active accent color[cite: 8].
    * **Service Selector:** Clicking `[ Select Service ▾ ]` should open a sleek, floating dropdown menu listing the 6 core services (Preshoot, Casual Shoot, Birthday Shoot, Engagement Shoot, Wedding Shoot, Promotion Video)[cite: 1, 8].
    * **Custom Cursor:** (Optional/CSS only if needed) Keep the typing cursor minimal.
* **Submission Area:** Below the sentence, include a large, pill-shaped or rectangular button that says **"SEND INQUIRY"** in bold Sans-Serif[cite: 1, 8]. Apply a subtle magnetic hover effect to the button if possible[cite: 8].
* **Theme Enforcement:** Lock the component into the cinematic off-light theme only (no dark mode styling whatsoever)[cite: 9]. The background must be Cinematic Off-White / Warm Pearl (`--bg-base` / #F7F7F5)[cite: 9]. The text must be Rich Charcoal / Ink Black (`--text-primary` / #111111)[cite: 9]. The input underlines default to Soft Mid-Grey (`--text-muted` / #888888) and darken to pure black on focus/hover[cite: 9].

Output *only* the complete, working React component code. Do not provide explanations or read further context.