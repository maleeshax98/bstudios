import type { Metadata } from "next";
import * as React from "react";
import { ContactPage } from "@/components/contact/contact-page";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Contact — B studio | High-End Cinematic Photography & Videography",
  description:
    "Get in touch with B studio to discuss your upcoming wedding, editorial shoot, birthday celebration, or cinematic commercial project.",
};

export default function Page() {
  return (
    <>
      {/* Main Split-Screen Contact Page */}
      <ContactPage />

      {/* Site Footer */}
      <Footer />
    </>
  );
}
