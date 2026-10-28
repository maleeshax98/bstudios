# Feature Specification: Keep Scrolling Inactivity Indicator

## Objective
Provide an elegant, editorial floating visual cue prompting the user to "Keep scrolling" when they remain idle without scrolling for 10 seconds. The indicator must only appear on the Home page (`/`) and About Us page (`/about`).

## User-Facing Behavior
1. **Inactivity Trigger**: When a user is on the Home page (`/`) or About Us page (`/about`) and does not scroll for 10 seconds, a floating indicator appears at the bottom center of the viewport.
2. **Animation**: The indicator has a pulsing animation (`animate-pulse`) and smooth entry/exit transitions (`transition-all duration-500`).
3. **Immediate Dismissal on Scroll**: As soon as the user resumes scrolling, uses the mouse wheel, or swipes on touch devices, the message immediately fades out and the 10-second inactivity countdown resets.
4. **Bottom-of-Page Suppression**: If the user has scrolled to the bottom of the page (within 50px of the footer), the indicator does not appear since there is no remaining content to scroll.
5. **Interactive Click**: Clicking the indicator gently scrolls down the page and immediately hides the prompt.
6. **Route Restriction**: Strictly restricted to the Home page (`/`) and About Us page (`/about`). Navigating to any other route (e.g. `/packages`, `/contact`, `/album/...`) immediately removes the indicator and deactivates the listeners.

## Acceptance Criteria
- [x] Floating at bottom center (`fixed bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-40`).
- [x] Appears after 10 seconds of no scrolling activity.
- [x] Features animated pulse effect.
- [x] Active only on `/` and `/about`.
- [x] Fades out immediately upon scrolling, wheeling, or swiping, resetting the timer.
- [x] Matches B studio Off-Light / Dark editorial theme tokens (`bg-bg-surface/90`, `text-text-primary`, `border-border-subtle`, `font-sans font-bold uppercase tracking-[0.2em]`).
- [x] Hydration-safe in Next.js 16 / React 19.

## Files and Modules to Change / Add
- `bstudio/components/keep-scrolling-indicator.tsx` (New Client Component)
- `bstudio/app/layout.tsx` (Mounts `<KeepScrollingIndicator />` alongside other floating UI controls)

## Dependencies
- `lucide-react` (`ChevronDown` / `ArrowDown` icon)
- `next/navigation` (`usePathname`)
- Tailwind CSS / design system tokens

## States
- **Idle / Hidden**: `opacity-0 translate-y-4 pointer-events-none`
- **Active / Visible**: `opacity-100 translate-y-0 pointer-events-auto animate-pulse`
- **Bottom Reached**: Suppressed

## Explicit Exclusions
- Unrelated routes (`/services`, `/contact`, `/portfolio`, `/works`, `/pricing`, `/packages`, `/album/*`).
- Changes to existing section logic or layout content.

