Context:
We are ripping out Sanity's real-time live preview (@sanity/live) across the entire Next.js codebase. The module-scoped caching in sanityFetch is causing deadlock errors with Next.js's native "use cache" directive ("A 'use cache' function is awaiting a promise created outside it"). We do not need live preview; we want maximum production performance using standard HTTP fetches and native Next.js caching.

Task:
Perform a global refactor to remove all traces of sanity/live, replace them with the standard Sanity client, and fix the data mapping.

Step-by-Step Execution Plan:

Replace Imports:

Scan all files for import { sanityFetch } from "@/sanity/live" (or similar paths).

Replace it with import { client } from "@/sanity/client" (adjust path if your standard client export is located elsewhere).

Refactor Fetch Calls:

Convert all instances of sanityFetch({ query: MY_QUERY, params: myParams }) to standard client.fetch(MY_QUERY, myParams).

Fix Data Destructuring (Critical):

sanityFetch returns an object shaped like { data: T }.

client.fetch returns the raw T directly.

Find every place where we awaited sanityFetch and destructured { data } (e.g., const { data: services } = await sanityFetch(...)).

Change it to receive the data directly (e.g., const services = await client.fetch(...)).

Cleanup Layouts & Setup:

Search layout.tsx (or app/layout.tsx) for the <SanityLive/> component (usually imported from next-sanity or @/sanity/live). Remove the import and the component entirely.

Delete the src/sanity/live.ts (or live.tsx) configuration file completely, as it is no longer needed.

Output:
Execute these changes across the workspace. Ensure all files using "use cache" with Sanity queries now cleanly await client.fetch without any external module-scoped wrappers.
