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
import { client } from "@/sanity/client";
import {
  SERVICES_QUERY,
  COLORGRADING_QUERY,
  FEATURED_ALBUMS_QUERY,
  WEDDING_ALBUMS_QUERY,
} from "@/sanity/queries";
import { getSampleImages } from "@/lib/cd";

async function getHomeData() {
  try {
    const [
      services,
      colorgrading,
      featuredWorks,
      weddingAlbums,
      sampleImagesData,
    ] = await Promise.all([
      client.fetch(SERVICES_QUERY),
      client.fetch(COLORGRADING_QUERY),
      client.fetch(FEATURED_ALBUMS_QUERY),
      client.fetch(WEDDING_ALBUMS_QUERY),
      getSampleImages(),
    ]);

    return {
      services: services || [],
      colorgrading: colorgrading || [],
      featuredWorks: featuredWorks || [],
      weddingAlbums: weddingAlbums || [],
      sampleImages: sampleImagesData?.resources || [],
    };
  } catch (error) {
    console.warn(
      "Could not fetch home data, falling back to sample data.",
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
