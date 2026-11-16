import type { Metadata } from "next";
import * as React from "react";
import { Suspense } from "react";
import { PackagesPage, PackageSkeletonCard } from "@/components/packages/packages-page";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { sanityFetch } from "@/sanity/live";
import { CATEGORIES_QUERY, PAGINATED_PACKAGES_QUERY } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title:
    "Investment & Packages — B'STUDIO | High-End Cinematic Photography & Videography",
  description:
    "Explore B'STUDIO's curated investment collections and pricing for wedding cinematography, editorial preshoots, birthday galas, and commercial campaigns.",
};

async function getPackagesPageData(category?: string) {
  try {
    const cat = category?.trim() || "ALL";
    const catNormalized = cat.replace(/-/g, " ");

    const [categoriesRes, packagesRes] = await Promise.all([
      sanityFetch({ query: CATEGORIES_QUERY, stega: false }),
      sanityFetch({
        query: PAGINATED_PACKAGES_QUERY,
        params: { start: 0, end: 6, category: cat, categoryNormalized: catNormalized },
        stega: false,
      }),
    ]);
    return {
      categories: categoriesRes.data || [],
      packages: packagesRes.data || [],
    };
  } catch (error) {
    console.warn("Could not fetch packages data from Sanity:", error);
    return {
      categories: [],
      packages: [],
    };
  }
}

async function PackagesGallery({ initialCategory }: { initialCategory?: string }) {
  const { categories, packages } = await getPackagesPageData(initialCategory);
  return (
    <PackagesPage
      initialCategories={categories}
      initialPackages={packages}
      initialCategory={initialCategory}
    />
  );
}

function PackagesFallback() {
  return (
    <section className="relative w-full min-h-screen bg-bg-base text-text-primary select-none pt-28 sm:pt-36 md:pt-40 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="border-b border-border-subtle pb-10 sm:pb-14">
          <h1 className="font-sans font-black uppercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9] text-text-primary">
            CURATED PACKAGES
          </h1>
        </header>
        {/* 1-Card Grid on Small Screens, Multi-Column on Desktop */}
        <div className="mt-10 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <PackageSkeletonCard key={i} />
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
      {/* Curated Packages Exhibition wrapped in Suspense for PPR and URL category navigation */}
      <Suspense fallback={<PackagesFallback />}>
        <PackagesGallery initialCategory={category} />
      </Suspense>

      {/* The Booking Transition */}
      <ContactForm prompt="READY TO INVEST IN YOUR STORY?" />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
