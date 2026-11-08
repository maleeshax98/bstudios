import type { Metadata } from "next";
import * as React from "react";
import { AboutIntro } from "@/components/about/about-intro";
import { AboutDirectorsCut } from "@/components/about/about-directors-cut";
import { AboutPillars } from "@/components/about/about-pillars";
import { AboutTeam } from "@/components/about/about-team";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { WhisperLoader } from "@/components/about/whisper-loader";
import { sanityFetch } from "@/sanity/live";
import { TEAM_QUERY } from "@/sanity/queries";
import type { TEAM_QUERY_RESULT } from "@/sanity.types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About — B'STUDIO | High-End Cinematic Photography & Videography",
  description:
    "Discover B'STUDIO's vision, behind-the-scenes craft, and core creative pillars dedicated to framing authentic moments with editorial elegance.",
};

async function getAboutPageData(): Promise<{ team: TEAM_QUERY_RESULT }> {
  try {
    const { data: team } = await sanityFetch({
      query: TEAM_QUERY,
      stega: false,
    });
    return {
      team: team || [],
    };
  } catch (error) {
    console.warn("Could not fetch team data from Sanity:", error);
    return {
      team: [],
    };
  }
}

export default async function AboutPage() {
  const { team } = await getAboutPageData();

  return (
    <>
      {/* 1. The Loading Sequence (The Whisper Intro) */}
      <WhisperLoader />

      {/* 2. The Editorial Hook (The Intro) */}
      <AboutIntro />

      {/* 3. The Director's Cut (Behind the Scenes Parallax) */}
      <AboutDirectorsCut />

      {/* 4. The Core Pillars (The Approach) */}
      <AboutPillars />

      {/* 5. The Team Section (The Collective) */}
      <AboutTeam initialTeam={team} />

      {/* 6. The Booking Transition (The End) */}
      <ContactForm prompt="READY TO SHOOT?" />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
