
Read `AGENTS.md` and `context/ui-context.md` before starting.

We are adding the design system and UI primitive components for the **B studio** project.

Install and configure `shadcn/ui`.

Add these shadcn components:

* Button
* Card
* Dialog
* Input
* Tabs
* Textarea
* ScrollArea

Do not modify the generated `components/ui/*` files after installation.

Also install `lucide-react` (ensure icons are stroke-based only, no filled variants) and install `gsap` for the animations and `lenis` for smooth scroll

Create `lib/utils.ts` with a reusable `cn()` helper for merging Tailwind classes.


* Map the typography correctly to our "Modern Editorial" setup (bold Sans-Serif for structure/headers, sophisticated italicized Serif for accents/body).



### Check when done

* Ensure all components strictly match the Off-Light Modern Editorial theme in `context/ui-context.md` (creamy off-white backgrounds `#F7F7F5`, soft stone surfaces `#EBEBE8`, and high-contrast ink typography `#111111`).
* All components import without errors.
* `cn()` works properly.