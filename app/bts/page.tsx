import type { Metadata } from "next";
import * as React from "react";
import { BtsPage } from "@/components/bts/bts-page";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { sanityFetch } from "@/sanity/live";
import { ALL_BTS_QUERY } from "@/sanity/queries";
import { getBtsImages } from "@/lib/cd";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Behind The Scenes — B'STUDIO | High-End Cinematic Photography & Videography",
  description:
    "Explore B'STUDIO's behind-the-scenes photography and film archive showcasing authentic moments and creative production.",
};

async function getBtsData() {
  try {
    const [btsImagesData, btsVideosRes] = await Promise.all([
      getBtsImages(100),
      sanityFetch({ query: ALL_BTS_QUERY, stega: false }),
    ]);

    return {
      btsImages: btsImagesData?.resources || [],
      btsVideos: btsVideosRes.data || [],
    };
  } catch (error) {
    console.warn("Could not fetch BTS data from Sanity/Cloudinary:", error);
    return {
      btsImages: [],
      btsVideos: [],
    };
  }
}

export default async function Page() {
  const { btsImages, btsVideos } = await getBtsData();

  return (
    <>
      {/* Editorial BTS Exhibition */}
      <BtsPage initialImages={btsImages} initialVideos={btsVideos} />

      {/* The Booking Transition */}
      <ContactForm prompt="READY TO SHOOT?" />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
