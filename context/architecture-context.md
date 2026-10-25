# Architecture Context

Here is the technical architecture context adapted specifically for **B studio**, following the structure you provided and incorporating our locked-in technologies and cinematic design choices:

# Architecture Context

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Framework | Next.js | Full-stack app for top-tier performance and SEO

 |
| Animations | GSAP | Complex, timeline-based animations and horizontal scrolls

 |
| Scroll Mechanics | Lenis | Buttery smooth scrolling for the interactive exhibitions

 |

 |
    Icons | lucide-react | icons for the user interface |
 |

## System Boundaries

* `app/(site)` — Frontend Next.js routes: mapping the cinematic user journey across the Home, Work, Services, and About pages.


* `app/api` — Server-side request handlers: secure processing for the conversational contact form submissions.


* `sanity` — CMS configuration schemas: structuring the database for projects, services, and galleries.


* `components` — UI composition: gallery masonry layouts, sticky filters, scroll-to-flex grids, and interactive forms.


* `lib` — Shared infrastructure: animation helpers for GSAP, Lenis initialization, and Sanity/Cloudinary client utilities.


## Animation & Interaction Model

* **Scrolling Execution**: Lenis intercepts native browser scrolling to provide smooth inertia, feeding scroll position data directly to GSAP.


