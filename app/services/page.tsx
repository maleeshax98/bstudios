import type { Metadata } from "next";
import * as React from "react";
import { WhisperLoader } from "@/components/services/whisper-loader";
import { ServicesLanding } from "@/components/services/services-landing";
import { ServicesVertical } from "@/components/services/services-horizontal";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { client } from "@/sanity/client";
import { SERVICES_QUERY } from "@/sanity/queries";
import type { SERVICES_QUERY_RESULT } from "@/sanity.types";

export const metadata: Metadata = {
  title: "Services — B studio | High-End Cinematic Photography & Videography",
  description:
    "Explore B studio's dedicated core services: Preshoot, Casual Shoot, Birthday Shoot, Engagement Shoot, Wedding Shoot, and Promotion Video in a bespoke horizontal exhibition.",
};

async function getServicesData(): Promise<SERVICES_QUERY_RESULT> {
  "use cache";
  try {
    const services = await client.fetch(SERVICES_QUERY);
    return services || [];
  } catch (error) {
    console.warn("Could not fetch services from Sanity:", error);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServicesData();

  return (
    <>
      {/* 1. The Loading Sequence (The Whisper Intro) */}
      <WhisperLoader />

      {/* 2. The Landing (The Anchor) */}
      <ServicesLanding />

      {/* 3. The Horizontal Exhibition (The Core) */}
      <ServicesVertical initialServices={services} />

      {/* 4. The Booking Transition (The End) */}
      <ContactForm prompt="READY TO SHOOT?" />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
