import * as React from "react";
import { HomeLoader } from "@/components/home-loader";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <HomeLoader />
      <Hero />
    </>
  );
}
