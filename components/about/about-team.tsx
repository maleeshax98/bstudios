"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/optimized-image";
import type { TEAM_QUERY_RESULT } from "@/sanity.types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface AboutTeamProps extends React.HTMLAttributes<HTMLElement> {
  initialTeam?: TEAM_QUERY_RESULT;
}

export function AboutTeam({
  initialTeam = [],
  className,
  ...props
}: AboutTeamProps) {
  // If there is no data for the team, do not show the section
  const team = initialTeam;
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<(HTMLElement | null)[]>([]);

  React.useEffect(() => {
    if (!team || team.length === 0) return;

    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header reveal
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: header,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Staggered card reveal on scroll
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: (i % 3) * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, sectionRef);

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => ctx.revert();
  }, [team]);

  // If there is no data for the team, do not show the section
  if (!team || team.length === 0) {
    return null;
  }

  return (
    <section
      id="team"
      ref={sectionRef}
      className={cn(
        "relative w-full bg-bg-base text-text-primary px-6 sm:px-12 md:px-16 lg:px-24 py-24 sm:py-32 lg:py-40 select-none overflow-hidden border-t border-border-subtle",
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="mb-16 sm:mb-20 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
            <div className="lg:col-span-7">
              <h2 className="font-sans font-black uppercase tracking-tighter text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-text-primary leading-[0.88]">
                THE TEAM
              </h2>
            </div>

            <div className="lg:col-span-5">
              <p className="font-serif italic text-lg sm:text-xl lg:text-2xl text-text-primary/75 max-w-lg leading-relaxed">
                The visual directors, cinematographers, and artists dedicated to
                framing every B&apos;STUDIO story with editorial poise.
              </p>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div
          className={cn(
            "grid gap-8 sm:gap-10 lg:gap-12",
            team.length === 1 && "grid-cols-1 max-w-md mx-auto",
            team.length === 2 && "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto",
            team.length >= 3 &&
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto",
          )}
        >
          {team.map((member, index) => {
            const hasCustomLink = Boolean(
              member.link && member.link.trim() !== "",
            );
            const isExternalLink =
              hasCustomLink && /^https?:\/\//i.test(member.link!);
            const targetHref = hasCustomLink ? member.link! : "#team";

            return (
              <article
                key={member._id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="group flex flex-col"
              >
                {/* Photo container — Image is a Link */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg-surface border border-border-subtle rounded-none">
                  {isExternalLink ? (
                    <a
                      href={targetHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full relative overflow-hidden"
                      aria-label={
                        member.name
                          ? `View portfolio of ${member.name}`
                          : "Team member link"
                      }
                    >
                      {member.image ? (
                        <OptimizedImage
                          src={member.image}
                          alt={member.name || "B'STUDIO Team Member"}
                          fill
                          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-bg-surface text-text-muted text-xs uppercase tracking-widest font-sans font-medium">
                          B&apos;STUDIO
                        </div>
                      )}

                      {/* Subtle hover indicator badge */}
                      <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowUpRight className="w-4 h-4 stroke-[1.5]" />
                      </div>
                    </a>
                  ) : hasCustomLink ? (
                    <Link
                      href={targetHref}
                      className="block w-full h-full relative overflow-hidden"
                      aria-label={
                        member.name
                          ? `View portfolio of ${member.name}`
                          : "Team member link"
                      }
                    >
                      {member.image ? (
                        <OptimizedImage
                          src={member.image}
                          alt={member.name || "B'STUDIO Team Member"}
                          fill
                          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-bg-surface text-text-muted text-xs uppercase tracking-widest font-sans font-medium">
                          B&apos;STUDIO
                        </div>
                      )}

                      {/* Subtle hover indicator badge */}
                      <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowUpRight className="w-4 h-4 stroke-[1.5]" />
                      </div>
                    </Link>
                  ) : (
                    <a
                      href={targetHref}
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="block w-full h-full relative overflow-hidden cursor-default"
                      aria-label={member.name || "Team member"}
                    >
                      {member.image ? (
                        <OptimizedImage
                          src={member.image}
                          alt={member.name || "B'STUDIO Team Member"}
                          fill
                          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-bg-surface text-text-muted text-xs uppercase tracking-widest font-sans font-medium">
                          B&apos;STUDIO
                        </div>
                      )}
                    </a>
                  )}
                </div>

                {/* Name below image */}
                <h3 className="font-sans font-bold uppercase tracking-tight text-xl sm:text-2xl text-text-primary mt-5 sm:mt-6 leading-tight">
                  {member.name}
                </h3>

                {/* Role / Title if provided */}
                {member.role && (
                  <p className="font-serif italic text-sm sm:text-base text-text-muted mt-1">
                    {member.role}
                  </p>
                )}

                {/* Optional description below name */}
                {member.description && member.description.trim() !== "" && (
                  <p className="font-serif italic sm:font-normal text-sm sm:text-base text-text-primary/75 dark:text-text-primary/70 mt-3 leading-relaxed">
                    {member.description}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AboutTeam;
