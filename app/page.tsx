import * as React from "react";
import { HomeLoader } from "@/components/home-loader";

export default function Home() {
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6">
      <HomeLoader />

      <div className="text-center max-w-2xl mx-auto py-20 select-none">
        <p className="font-serif italic text-base sm:text-lg text-text-muted mb-3">
          Cinematic Photography &amp; Direction
        </p>
        <h1 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tighter text-text-primary">
          B STUDIO
        </h1>
        <p className="font-sans text-xs sm:text-sm uppercase tracking-widest text-text-muted mt-4">
          Colombo, Sri Lanka — Available Worldwide
        </p>
      </div>
    </div>
  );
}
