import type { Metadata } from "next";
import * as React from "react";
import { WhisperLoader } from "@/components/services/whisper-loader";
import { ServicesLanding } from "@/components/services/services-landing";
import { ServicesVertical } from "@/components/services/services-horizontal";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Services — B studio | High-End Cinematic Photography & Videography",
  description:
    "Explore B studio's dedicated core services: Preshoot, Casual Shoot, Birthday Shoot, Engagement Shoot, Wedding Shoot, and Promotion Video in a bespoke horizontal exhibition.",
};

export default function ServicesPage() {
  return (
    <>
      {/* 1. The Loading Sequence (The Whisper Intro) */}
      <WhisperLoader />

      {/* 2. The Landing (The Anchor) */}
      <ServicesLanding />

      {/* 3. The Horizontal Exhibition (The Core) */}
      <ServicesVertical />

      {/* 4. The Booking Transition (The End) */}
      <ContactForm prompt="READY TO SHOOT?" />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
