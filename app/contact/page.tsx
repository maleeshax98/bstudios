import type { Metadata } from "next";
import * as React from "react";
import { ContactPage } from "@/components/contact/contact-page";
import { ContactMap } from "@/components/contact/contact-map";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Contact — B'STUDIO | High-End Cinematic Photography & Videography",
  description:
    "Get in touch with B'STUDIO to discuss your upcoming wedding, editorial shoot, birthday celebration, or cinematic commercial project.",
};

export default function Page() {
  return (
    <>
      {/* Main Split-Screen Contact Page */}
      <ContactPage />

      {/* Studio Google Map */}
      <ContactMap />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
