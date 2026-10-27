import type { Metadata } from "next";
import * as React from "react";
import { Suspense } from "react";
import { WorksPage, SkeletonCard } from "@/components/works/works-page";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { client } from "@/sanity/client";
import { PAGINATED_ALBUMS_QUERY, CATEGORIES_QUERY } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Works — B studio | High-End Cinematic Photography & Videography",
  description:
    "Explore B studio's complete portfolio archive of editorial wedding photography, cinematic showreels, birthday galas, and commercial campaigns.",
};

async function getWorksData() {
  "use cache";
  try {
    const [albums, categories] = await Promise.all([
      client.fetch(PAGINATED_ALBUMS_QUERY, { start: 0, end: 6 }),
      client.fetch(CATEGORIES_QUERY),
    ]);
    return {
      albums: albums || [],
      categories: categories || [],
    };
  } catch (error) {
    console.warn("Could not fetch works data from Sanity:", error);
    return { albums: [], categories: [] };
  }
}

async function WorksGallery() {
  const { albums, categories } = await getWorksData();
  return <WorksPage initialAlbums={albums} initialCategories={categories} />;
}

function WorksFallback() {
  return (
    <section className="relative w-full min-h-screen bg-bg-base text-text-primary select-none pt-28 sm:pt-36 md:pt-40 pb-24 sm:pb-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="border-b border-border-subtle pb-10 sm:pb-14">
          <h1 className="font-sans font-black uppercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9] text-text-primary">
            SELECTED WORKS
          </h1>
        </header>
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <>
      {/* Works Gallery wrapped in Suspense for Next.js Partial Prerendering */}
      <Suspense fallback={<WorksFallback />}>
        <WorksGallery />
      </Suspense>

      {/* The Booking Transition */}
      <ContactForm prompt="READY TO SHOOT?" />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
