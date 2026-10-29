# Task: Audit and Implement Sanity Live Content Across the Entire Codebase

## Objective

Thoroughly inspect the entire existing codebase and implement Sanity Live Content so that newly published or updated documents in Sanity Studio are reflected on the Next.js website automatically, without requiring a Vercel redeployment or manual cache clearing.

This must work locally and on Vercel deployments, including the development branch.

**Do not start implementing immediately. First understand the existing architecture, identify every Sanity data-fetching path, investigate the current caching behavior, and establish a safe implementation plan.**

## Phase 1 — Full Codebase Audit

Inspect the relevant parts of the entire repository, including:

- `package.json` and the package manager lockfile.
- `next.config.ts` or equivalent Next.js configuration.
- The App Router structure under `app/` or `src/app/`.
- All Sanity client configurations and Sanity-related utilities.
- Every GROQ query and every Sanity data-fetching function.
- All pages, layouts, Server Components, Client Components, route handlers, and Server Actions that depend on Sanity data.
- Any Sanity Studio configuration and content schemas.
- Existing caching, revalidation, Suspense, and rendering configurations.
- Environment variable references and the existing deployment configuration.
- Any existing `defineLive`, `sanityFetch`, `SanityLive`, webhook, or cache-tag implementation.

Search the whole repository rather than relying on filenames or assumptions. Follow the imports and call sites to understand how data flows from Sanity to the UI.

Identify all Sanity content types, queries, and routes that need live updates.

### Audit report

Before modifying files, provide a concise report describing:

1. The existing Sanity architecture.
2. How Sanity data is currently fetched.
3. Which caching mechanisms are active and where stale content originates.
4. Whether Next.js Cache Components or other experimental caching features are enabled.
5. Which pages and components depend on Sanity.
6. The proposed implementation and any compatibility concerns.

After producing the report, continue with the implementation unless a genuinely blocking ambiguity or destructive decision requires my approval.

## Phase 2 — Research the Correct Integration

Use the official, current documentation for `next-sanity`, Sanity Live Content, and the installed Next.js version.

References:

- https://www.sanity.io/docs/nextjs
- https://www.sanity.io/docs/nextjs/live-content
- https://github.com/sanity-io/next-sanity

Determine the correct integration for the versions actually installed in this repository.

Prefer the official `next-sanity` Live Content integration using `defineLive`, `sanityFetch`, and `SanityLive` where supported.

Do not blindly copy examples intended for a different Next.js version or caching model. In particular, verify compatibility with Next.js Cache Components, if enabled.

Do not upgrade Next.js, Prisma, React, or unrelated dependencies just to implement this feature. Change dependencies only when necessary and explain why.

## Phase 3 — Implement the Shared Live Content Infrastructure

Implement the integration centrally, following the existing project architecture and conventions.

Where appropriate:

1. Configure the existing Sanity project ID, dataset, API version, and other required client settings.
2. Configure the official Live Content integration.
3. Establish the required server-side environment variables and authentication configuration, if applicable.
4. Create or update the shared Sanity data-fetching utilities.
5. Integrate `SanityLive` into the appropriate root layout or another architecturally correct location.
6. Ensure all Sanity queries use the correct shared fetching infrastructure.
7. Preserve existing GROQ query behavior, projections, parameters, data types, and content relationships.
8. Preserve existing preview/draft behavior, authentication, and access restrictions.
9. Handle unpublished drafts and published content according to the application's existing intended behavior.
10. Ensure live updates work across the routes and components that display Sanity content.

Avoid duplicating Sanity clients, live configurations, or query implementations unnecessarily.

Do not expose Sanity write tokens, private credentials, or other secrets to the browser.

## Phase 4 — Audit and Migrate Every Data-Fetching Path

Search again across the complete codebase for all Sanity data access, including:

- `client.fetch(...)`
- `sanityFetch(...)`
- Direct GROQ queries.
- Sanity queries wrapped in helper functions.
- Queries inside page components and layouts.
- Data-fetching functions imported from other modules.
- Data loaded through route handlers or Server Actions.
- Any Sanity data accessed indirectly through shared utilities.

For every relevant call site, determine whether it needs to participate in the live content integration.

Migrate eligible read queries to the appropriate shared live-fetching mechanism.

Do not automatically convert every Sanity request without understanding its purpose. For example, webhooks, write operations, internal scripts, and external API integrations may need to remain separate.

Ensure the live integration actually covers every relevant page rather than just the homepage.

If a query cannot use the live mechanism directly, document why and implement an appropriate alternative when necessary.

## Phase 5 — Resolve Caching Correctly

Identify and resolve all caching layers that can prevent published Sanity changes from appearing.

Consider:

- Next.js Data Cache.
- Full Route Cache and static rendering.
- ISR and `revalidate` configuration.
- Next.js Cache Components and caching directives.
- Sanity CDN caching.
- Browser and HTTP response caching.
- Custom cache tags and cache profiles.
- Any manually implemented fetch wrappers.

Use the official Sanity Live Content mechanism for the intended live-update behavior.

Do not assume that adding `SanityLive` alone fixes every possible caching issue. Verify that the actual data-fetching functions and rendering strategy are compatible with the integration.

Avoid indiscriminately setting every request to `no-store`, disabling all caching, or forcing every page to render dynamically. Preserve appropriate performance optimizations wherever possible.

If a webhook or explicit revalidation mechanism is required for a particular query, implement it securely and document the reason.

## Phase 6 — Environment and Vercel Compatibility

Verify that the implementation works with the environment variables and deployment model used by the project.

Inspect the existing configuration without printing secret values.

Document which environment variables are required for:

- Local development.
- Vercel preview/development deployments.
- Production deployments.

Check whether Vercel environment variables are scoped correctly to the relevant deployment environments.

Do not assume that a Vercel deployment created from a development branch automatically receives the same environment variables as production.

If the implementation requires Sanity API credentials, webhook secrets, or additional configuration, document the exact variable names and where they must be configured.

Never hardcode credentials or commit `.env` secrets.

## Phase 7 — Verification and Testing

After implementation:

1. Run the project's available type checks and lint commands.
2. Run the production build if the environment supports it.
3. Resolve any errors introduced by the changes.
4. Inspect the final codebase again for Sanity queries that bypass the intended architecture.
5. Verify that existing pages, content rendering, metadata, image handling, and routing remain intact.
6. Verify the official Live Content integration is correctly wired into the relevant layouts and data-fetching paths.
7. Check that the implementation does not introduce hydration errors, duplicate client instances, unnecessary network requests, or rendering regressions.

Do not claim that live updates have been verified against Sanity or Vercel unless you actually performed that test.

If credentials or external access are unavailable, clearly distinguish between code-level verification and a live end-to-end test.

Provide a manual verification procedure:

1. Deploy the changes to the Vercel development environment.
2. Open the deployed website.
3. Publish a new Sanity document that should appear on a particular route.
4. Confirm the document appears without redeploying or manually invalidating the cache.
5. Update the document and verify that the changes appear.
6. Repeat the test locally.
7. Check any remaining routes and content types identified in the audit.

## Engineering Rules

- Preserve the current architecture and coding conventions.
- Do not rebuild the website or redesign existing UI.
- Do not modify unrelated features.
- Do not delete files or reset Git history.
- Do not alter Prisma schemas, migrations, or database state unless explicitly required and approved.
- Do not overwrite unrelated uncommitted user changes.
- Do not introduce unnecessary dependencies.
- Do not create parallel Sanity infrastructure when the project already has a suitable implementation.
- Prefer small, coherent, production-quality changes over a broad refactor.
- Keep TypeScript types accurate and avoid `any` unless there is a documented reason.
- Never fabricate successful test results.
- Keep the changes focused, maintainable, secure, and production-ready.

## Final Report

When finished, provide:

1. The original root cause or the most likely root cause, with supporting evidence.
2. The architecture and caching changes made.
3. Every file created, modified, or removed, with a short explanation.
4. Any dependency changes.
5. Any environment variables or Sanity/Vercel settings I must configure manually.
6. The type-check, lint, and build results.
7. Any remaining limitations or unverified behavior.
8. A precise end-to-end testing checklist.

**Success criterion:** Publishing or updating eligible content in Sanity must cause the deployed Next.js website to reflect that change without requiring a new Vercel deployment, while retaining appropriate caching, security, and existing application behavior.