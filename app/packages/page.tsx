import type { Metadata } from "next";
import * as React from "react";
import { PackagesPage } from "@/components/packages/packages-page";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { client } from "@/sanity/client";
import { PACKAGES_QUERY } from "@/sanity/queries";

export const metadata: Metadata = {
  title:
    "Investment & Packages — B studio | High-End Cinematic Photography & Videography",
  description:
    "Explore B studio's curated investment collections and pricing for wedding cinematography, editorial preshoots, birthday galas, and commercial campaigns.",
};

async function getPackagesData() {
  "use cache";
  try {
    const packages = await client.fetch(PACKAGES_QUERY);
    return packages || [];
  } catch (error) {
    console.warn(
      "Could not fetch packages from Sanity, falling back to sample data.",
      error,
    );
    return [];
  }
}

export default async function Page() {
  const packages = await getPackagesData();

  return (
    <>
      {/* Curated Packages Exhibition */}
      <PackagesPage initialPackages={packages} />

      {/* The Booking Transition */}
      <ContactForm prompt="READY TO INVEST IN YOUR STORY?" />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
