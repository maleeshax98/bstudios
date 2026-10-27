fix this error,

Uncaught Error: Route "/album/[slug]": A `"use cache"` function is awaiting a promise created outside it. The same call completed when run in isolation, so a module-scoped value (often a top-level `Map` used to dedupe fetches) is most likely blocking it. `"use cache"` already dedupes calls with the same arguments. Remove the surrounding dedupe layer.
Learn more: https://nextjs.org/docs/messages/next-request-in-use-cache
at getAlbumData (app/album/[slug]/page.tsx:18:1)
at Module.generateMetadata (app/album/[slug]/page.tsx:91:23)
at Next.MetadataOutlet (<anonymous>, <anonymous>:1:28)

also add that loading thing again. it is removed somehow
