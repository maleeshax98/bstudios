import * as React from "react";
import { HomeLoader } from "@/components/home-loader";
import { Hero } from "@/components/hero";
import { PinnedScrollText } from "@/components/pinned-scroll-text";
import { SelectedWorks } from "@/components/selected-works";
import { Philosophy } from "@/components/philosophy";
import { ServicesExhibition } from "@/components/services-exhibition";
import { SampleGallery } from "@/components/sample-gallery";
import { ClientSpaceTeaser } from "@/components/client-space-teaser";
import { ColorGradeLookbook } from "@/components/color-grade-lookbook";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { sanityFetch } from "@/sanity/live";
import {
  SERVICES_QUERY,
  COLORGRADING_QUERY,
  FEATURED_ALBUMS_QUERY,
  WEDDING_ALBUMS_QUERY,
} from "@/sanity/queries";
import { getSampleImages } from "@/lib/cd";

export const revalidate = 60;

async function getHomeData() {
  try {
    const [
      servicesRes,
      colorgradingRes,
      featuredWorksRes,
      weddingAlbumsRes,
      sampleImagesData,
    ] = await Promise.all([
      sanityFetch({ query: SERVICES_QUERY, stega: false }),
      sanityFetch({ query: COLORGRADING_QUERY, stega: false }),
      sanityFetch({ query: FEATURED_ALBUMS_QUERY, stega: false }),
      sanityFetch({ query: WEDDING_ALBUMS_QUERY, stega: false }),
      getSampleImages(),
    ]);

    return {
      services: servicesRes.data || [],
      colorgrading: colorgradingRes.data || [],
      featuredWorks: featuredWorksRes.data || [],
      weddingAlbums: weddingAlbumsRes.data || [],
      sampleImages: sampleImagesData?.resources || [],
    };
  } catch (error) {
    console.warn(
      "Could not fetch home data from Sanity/Cloudinary:",
      error,
    );
    return {
      services: [],
      colorgrading: [],
      featuredWorks: [],
      weddingAlbums: [],
      sampleImages: [],
    };
  }
}

export default async function Home() {
  const { services, colorgrading, featuredWorks, weddingAlbums, sampleImages } =
    await getHomeData();

  return (
    <>
      <HomeLoader />
      <Hero />
      <PinnedScrollText />
      <SelectedWorks initialWorks={featuredWorks} />
      <Philosophy />
      <ServicesExhibition initialServices={services} />
      <SampleGallery initialImages={sampleImages} />
      <ClientSpaceTeaser initialAlbums={weddingAlbums} />
      <br />
      <br />
      <br />
      <ColorGradeLookbook initialLookbook={colorgrading} />
      <ContactForm />
      <Footer />
    </>
  );
}
