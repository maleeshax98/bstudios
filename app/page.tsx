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

export default function Home() {
  return (
    <>
      <HomeLoader />
      <Hero />
      <PinnedScrollText />
      <SelectedWorks />
      <Philosophy />
      <ServicesExhibition />
      <SampleGallery />
      <ClientSpaceTeaser />
      <ColorGradeLookbook />
      <ContactForm />
      <Footer />
    </>
  );
}
