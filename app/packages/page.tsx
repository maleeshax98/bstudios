import type { Metadata } from "next";
import * as React from "react";
import { Suspense } from "react";
import { PackagesPage } from "@/components/packages/packages-page";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { client } from "@/sanity/client";
import { CATEGORIES_QUERY, PACKAGES_QUERY } from "@/sanity/queries";

export const metadata: Metadata = {
  title:
    "Investment & Packages — B studio | High-End Cinematic Photography & Videography",
  description:
    "Explore B studio's curated investment collections and pricing for wedding cinematography, editorial preshoots, birthday galas, and commercial campaigns.",
};

async function getPackagesPageData() {
  try {
    const [categories, packages] = await Promise.all([
      client.fetch(CATEGORIES_QUERY),
      client.fetch(PACKAGES_QUERY),
    ]);
    return {
      categories: categories || [],
      packages: packages || [],
    };
  } catch (error) {
    console.warn("Could not fetch packages data from Sanity:", error);
    return {
      categories: [],
      packages: [],
    };
  }
}

async function PackagesContent() {
  const { categories, packages } = await getPackagesPageData();
  return (
    <PackagesPage
      initialCategories={categories}
      initialPackages={packages}
    />
  );
}

export default function Page() {
  return (
    <>
      {/* Curated Packages Exhibition wrapped in Suspense for Partial Prerendering */}
      <Suspense
        fallback={<PackagesPage initialCategories={[]} initialPackages={[]} />}
      >
        <PackagesContent />
      </Suspense>

      {/* The Booking Transition */}
      <ContactForm prompt="READY TO INVEST IN YOUR STORY?" />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
