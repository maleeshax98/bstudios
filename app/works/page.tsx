import type { Metadata } from "next";
import * as React from "react";
import { WorksPage } from "@/components/works/works-page";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Works — B studio | High-End Cinematic Photography & Videography",
  description:
    "Explore B studio's complete portfolio archive of editorial wedding photography, cinematic showreels, birthday galas, and commercial campaigns.",
};

export default function Page() {
  return (
    <>
      {/* Main Works Gallery Component */}
      <WorksPage />

      {/* The Booking Transition */}
      <ContactForm prompt="READY TO SHOOT?" />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
