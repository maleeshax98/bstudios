import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingThemeToggle } from "@/components/floating-theme-toggle";
import { KeepScrollingIndicator } from "@/components/keep-scrolling-indicator";
import { SanityLive } from "@/sanity/live";
import { revalidateAndRefresh } from "@/sanity/action";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "B'STUDIO — High-End Photography & Videography",
  description: "B'STUDIO is a premium, cinematic visual studio framing photography and videography in an off-light editorial experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary font-sans transition-colors duration-300">
        <ThemeProvider>
          <SmoothScroll>
            <Navbar />
            <main className="flex-1">{children}</main>
          </SmoothScroll>
          <FloatingThemeToggle />
          <KeepScrollingIndicator />
          <SanityLive action={revalidateAndRefresh} />
        </ThemeProvider>
      </body>
    </html>
  );
}
