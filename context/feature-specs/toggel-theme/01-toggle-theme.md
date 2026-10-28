**Task: Implement Dynamic Theme Switching & Floating Toggle Button**

Please generate the setup for `next-themes` and a `FloatingThemeToggle` component using Next.js, Tailwind CSS, and `lucide-react`.

**1. Theme Provider Setup (`components/theme-provider.tsx`):**

- Wrap the application using `next-themes`.
- Configure it with `attribute="class"`, `defaultTheme="system"`, and `enableSystem={true}` so the website automatically detects and applies the user's device theme (Dark or Light) on first load.

**2. The Floating Toggle Component (`components/floating-theme-toggle.tsx`):**

- **Positioning:** A fixed, floating circular button placed in the bottom-right corner of the screen (`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50`).
- **Visual Design:** A sleek, premium circular button (`w-12 h-12` or `w-14 h-14`). It should have a high-contrast style using the custom palette (e.g., `bg-text-primary` for the button background and `text-bg-base` for the icon, ensuring it always pops against the page). Include a refined shadow (`shadow-2xl`) and subtle border.
- **Icons:** Use the `Sun` and `Moon` stroke icons from `lucide-react`. Implement a smooth rotation/scale transition when swapping between the two states.
- **Interactions:** Apply a smooth, tactile hover effect (`hover:scale-110 active:scale-95 transition-all duration-300`). If GSAP is available, feel free to add a subtle magnetic pull on hover.

**3. Integration:**

- Output the code for the `ThemeProvider` wrapper.
- Output the code for the `FloatingThemeToggle` client component.
- Provide a brief 1-step instruction on how to wrap the `app/layout.tsx` with the provider and where to drop the toggle button.

Output _only_ the working React component code blocks and brief integration steps. Do not provide lengthy explanations. Ensure it relies strictly on the `.dark` class variant pattern (`@custom-variant dark (&:is(.dark *));`) configured in the `globals.css`.
