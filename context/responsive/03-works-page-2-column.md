## Works Page 2-Column Grid Layout on Small Screens

## Context

- In small screen sizes (mobile viewports), display album cards on the `/works` page in a 2-column grid layout instead of stacking a single album card at a time (`grid-cols-2 md:grid-cols-2 lg:grid-cols-3`).
- Reduce the image size requests (`sizes="... 50vw"`) on mobile screens to save mobile bandwidth and accelerate page loading.
- Responsively scale card elements (corner radius, share button, top media badge, play indicator, date/category metadata, and album title typography) so they look balanced and refined in the 2-column layout on mobile devices.
- Synchronize in-place skeleton loaders and SSR fallback grid with the responsive 2-column layout.
