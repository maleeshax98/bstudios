import type { Metadata } from "next";
import * as React from "react";
import { PackagesPage } from "@/components/packages/packages-page";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { sanityFetch } from "@/sanity/live";
import { CATEGORIES_QUERY, PACKAGES_QUERY } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title:
    "Investment & Packages — B studio | High-End Cinematic Photography & Videography",
  description:
    "Explore B studio's curated investment collections and pricing for wedding cinematography, editorial preshoots, birthday galas, and commercial campaigns.",
};

async function getPackagesPageData() {
  try {
    const [categoriesRes, packagesRes] = await Promise.all([
      sanityFetch({ query: CATEGORIES_QUERY, stega: false }),
      sanityFetch({ query: PACKAGES_QUERY, stega: false }),
    ]);
    return {
      categories: categoriesRes.data || [],
      packages: packagesRes.data || [],
    };
  } catch (error) {
    console.warn(
      "Could not fetch packages data from Sanity:",
      error,
    );
    return {
      categories: [],
      packages: [],
    };
  }
}

export default async function Page() {
  const { categories, packages } = await getPackagesPageData();

  return (
    <>
      {/* Curated Packages Exhibition */}
      <PackagesPage
        initialCategories={categories}
        initialPackages={packages}
      />

      {/* The Booking Transition */}
      <ContactForm prompt="READY TO INVEST IN YOUR STORY?" />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
