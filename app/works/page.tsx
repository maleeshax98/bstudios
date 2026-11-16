import type { Metadata } from "next";
import * as React from "react";
import { Suspense } from "react";
import { WorksPage, SkeletonCard } from "@/components/works/works-page";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { sanityFetch } from "@/sanity/live";
import { PAGINATED_ALBUMS_QUERY, CATEGORIES_QUERY } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Works — B'STUDIO | High-End Cinematic Photography & Videography",
  description:
    "Explore B'STUDIO's complete portfolio archive of editorial wedding photography, cinematic showreels, birthday galas, and commercial campaigns.",
};

async function getWorksData(category?: string) {
  try {
    const cat = category?.trim() || "ALL";
    const catNormalized = cat.replace(/-/g, " ");
    const [albumsRes, categoriesRes] = await Promise.all([
      sanityFetch({
        query: PAGINATED_ALBUMS_QUERY,
        params: { start: 0, end: 6, category: cat, categoryNormalized: catNormalized },
        stega: false,
      }),
      sanityFetch({
        query: CATEGORIES_QUERY,
        stega: false,
      }),
    ]);
    return {
      albums: albumsRes.data || [],
      categories: categoriesRes.data || [],
    };
  } catch (error) {
    console.warn("Could not fetch works data from Sanity:", error);
    return { albums: [], categories: [] };
  }
}

async function WorksGallery({ initialCategory }: { initialCategory?: string }) {
  const { albums, categories } = await getWorksData(initialCategory);
  return (
    <WorksPage
      initialAlbums={albums}
      initialCategories={categories}
      initialCategory={initialCategory}
    />
  );
}

function WorksFallback() {
  return (
    <section className="relative w-full min-h-screen bg-bg-base text-text-primary select-none pt-28 sm:pt-36 md:pt-40 pb-24 sm:pb-32 px-3 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="border-b border-border-subtle pb-10 sm:pb-14">
          <h1 className="font-sans font-black uppercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9] text-text-primary">
            WORKS
          </h1>
        </header>
        <div className="mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8 lg:gap-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface PageProps {
  searchParams?: Promise<{ category?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const category =
    typeof resolvedSearchParams?.category === "string"
      ? resolvedSearchParams.category
      : undefined;

  return (
    <>
      {/* Works Gallery wrapped in Suspense for Next.js Partial Prerendering */}
      <Suspense fallback={<WorksFallback />}>
        <WorksGallery initialCategory={category} />
      </Suspense>

      {/* The Booking Transition */}
      <ContactForm prompt="READY TO SHOOT?" />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
