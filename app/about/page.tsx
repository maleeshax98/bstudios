import type { Metadata } from "next";
import * as React from "react";
import { AboutIntro } from "@/components/about/about-intro";
import { AboutDirectorsCut } from "@/components/about/about-directors-cut";
import { AboutPillars } from "@/components/about/about-pillars";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { WhisperLoader } from "@/components/about/whisper-loader";

export const metadata: Metadata = {
  title: "About — B'STUDIO | High-End Cinematic Photography & Videography",
  description:
    "Discover B'STUDIO's vision, behind-the-scenes craft, and core creative pillars dedicated to framing authentic moments with editorial elegance.",
};

export default function AboutPage() {
  return (
    <>
      {/* 1. The Loading Sequence (The Whisper Intro) */}
      <WhisperLoader />

      {/* 1. The Editorial Hook (The Intro) */}
      <AboutIntro />

      {/* 2. The Director's Cut (Behind the Scenes Parallax) */}
      <AboutDirectorsCut />

      {/* 3. The Core Pillars (The Approach) */}
      <AboutPillars />

      {/* 4. The Booking Transition (The End) */}
      <ContactForm prompt="READY TO SHOOT?" />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
