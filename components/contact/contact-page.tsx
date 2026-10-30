"use client";

import * as React from "react";
import gsap from "gsap";
import { ChevronDown, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CORE_SERVICES = [
  "Preshoot",
  "Casual Shoot",
  "Birthday Shoot",
  "Engagement Shoot",
  "Wedding Shoot",
  "Promotion Video",
  "Other Service",
] as const;

export type ContactPageProps = React.HTMLAttributes<HTMLElement>;

export function ContactPage({ className, ...props }: ContactPageProps) {
  // Form input states
  const [name, setName] = React.useState("");
  const [selectedService, setSelectedService] = React.useState<string>("");
  const [date, setDate] = React.useState("");
  const [email, setEmail] = React.useState("");

  // UI & interaction states
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [focusedInput, setFocusedInput] = React.useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(
    null,
  );

  // Element refs
  const sectionRef = React.useRef<HTMLElement>(null);
  const leftColRef = React.useRef<HTMLDivElement>(null);
  const rightColRef = React.useRef<HTMLDivElement>(null);
  const formContainerRef = React.useRef<HTMLFormElement>(null);
  const successContainerRef = React.useRef<HTMLDivElement>(null);
  const dropdownContainerRef = React.useRef<HTMLSpanElement>(null);
  const magneticButtonRef = React.useRef<HTMLButtonElement>(null);

  // Close service dropdown on click-outside or Escape key
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Entrance animations and GSAP lifecycle cleanup
  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (leftColRef.current) {
        gsap.from(leftColRef.current.children, {
          y: 28,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
        });
      }
      if (rightColRef.current) {
        gsap.from(rightColRef.current, {
          y: 36,
          opacity: 0,
          duration: 1,
          delay: 0.18,
          ease: "power3.out",
        });
      }
    }, sectionRef);

    const magneticEl = magneticButtonRef.current;

    return () => {
      ctx.revert();
      if (magneticEl) {
        gsap.killTweensOf(magneticEl);
      }
    };
  }, []);

  // GSAP magnetic hover cursor tracking on "SEND INQUIRY" button
  const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = magneticButtonRef.current;
    if (!el || isSubmitting) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.35;
    const distanceY = (e.clientY - centerY) * 0.35;

    gsap.to(el, {
      x: distanceX,
      y: distanceY,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleMagneticLeave = () => {
    const el = magneticButtonRef.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  // Form submission handler with validation & smooth GSAP dissolve fade
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setValidationError("Please enter your name.");
      document.getElementById("contact-name")?.focus();
      return;
    }

    if (!selectedService) {
      setValidationError("Please select a desired service.");
      setIsDropdownOpen(true);
      return;
    }

    if (!date.trim()) {
      setValidationError("Please enter your estimated event date.");
      document.getElementById("contact-date")?.focus();
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setValidationError("Please enter a valid email address.");
      document.getElementById("contact-email")?.focus();
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          service: selectedService,
          eventDate: date.trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Failed to submit inquiry. Please try again.",
        );
      }

      // Smoothly dissolve the form container via GSAP
      if (formContainerRef.current) {
        gsap.to(formContainerRef.current, {
          opacity: 0,
          y: -18,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            setIsSubmitted(true);
            setIsSubmitting(false);

            // Animate confirmation message fade-in
            requestAnimationFrame(() => {
              if (successContainerRef.current) {
                gsap.fromTo(
                  successContainerRef.current,
                  { opacity: 0, y: 24 },
                  { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
                );
              }
            });
          },
        });
      } else {
        setIsSubmitted(true);
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setValidationError(msg);
    }
  };

  // Reset form to send another inquiry
  const handleResetForm = () => {
    setName("");
    setSelectedService("");
    setDate("");
    setEmail("");
    setValidationError(null);
    setIsSubmitted(false);

    requestAnimationFrame(() => {
      if (formContainerRef.current) {
        gsap.fromTo(
          formContainerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        );
      }
    });
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full min-h-[100dvh] bg-bg-base text-text-primary px-6 sm:px-10 md:px-14 lg:px-16 xl:px-24 pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 select-none flex flex-col justify-between",
        className,
      )}
      {...props}
    >
      {/* Split-Screen Magazine Layout Container */}
      <div className="max-w-[1720px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-16 xl:gap-24 items-start flex-1">
        {/* ========================================================= */}
        {/* LEFT COLUMN: The Details                                  */}
        {/* ========================================================= */}
        <div
          ref={leftColRef}
          className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between h-full min-h-[440px] lg:min-h-[640px]"
        >
          {/* Top block: Eyebrow, Brutalist Headline & Italic Serif Intro */}
          <div>
            {/* <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-text-primary inline-block" />
              <span className="font-sans font-bold uppercase tracking-[0.25em] text-[11px] sm:text-xs text-text-muted">
                04 // INQUIRIES & COMMISSIONS
              </span>
            </div> */}

            <h1 className="font-sans font-black uppercase tracking-tighter text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[6.5rem] leading-[0.88] text-text-primary">
              LET&apos;S CREATE
            </h1>

            <p className="font-serif italic text-xl sm:text-2xl lg:text-[1.65rem] text-text-primary/90 leading-relaxed max-w-lg mt-6 sm:mt-8">
              Available worldwide. Reach out to discuss your next cinematic
              project or request our complete pricing guide.
            </p>
          </div>

          {/* Bottom block: Studio Contact Details */}
          <div className="pt-10 sm:pt-14 mt-12 lg:mt-auto border-t border-text-primary/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-8">
              {/* Email */}
              <div>
                <h2 className="font-sans font-bold uppercase tracking-wider text-[11px] sm:text-xs text-text-muted mb-1.5">
                  EMAIL
                </h2>
                <a
                  href="mailto:inquiries@bstudio.com"
                  className="font-serif text-base sm:text-lg text-text-primary hover:text-black  dark:hover:text-white transition-colors block underline decoration-text-primary/30 hover:decoration-black"
                >
                  inquiries@bstudio.com
                </a>
              </div>

              {/* Phone */}
              <div>
                <h2 className="font-sans font-bold uppercase tracking-wider text-[11px] sm:text-xs text-text-muted mb-1.5">
                  PHONE
                </h2>
                <a
                  href="tel:+94772038822"
                  className="font-serif text-base sm:text-lg text-text-primary hover:text-black dark:hover:text-white  transition-colors block"
                >
                  +94 (77) 203-8822
                </a>
              </div>

              {/* WhatsApp */}
              <div>
                <h2 className="font-sans font-bold uppercase tracking-wider text-[11px] sm:text-xs text-text-muted mb-1.5">
                  WHATSAPP
                </h2>
                <a
                  href="https://wa.me/94704028206"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-base sm:text-lg text-text-primary hover:text-black dark:hover:text-white  transition-colors block underline decoration-text-primary/30 hover:decoration-black"
                >
                  +94 70 402 8206
                </a>
              </div>

              {/* Studio Location */}
              <div>
                <h2 className="font-sans font-bold uppercase tracking-wider text-[11px] sm:text-xs text-text-muted mb-1.5">
                  STUDIO LOCATION
                </h2>
                <p className="font-serif text-base sm:text-lg text-text-primary leading-snug">
                  74 Horton Place, Colombo 07
                  <br />
                  <span className="font-serif italic text-text-muted text-sm">
                    Sri Lanka & Worldwide
                  </span>
                </p>
              </div>

              {/* Social Links */}
              <div>
                <h2 className="font-sans font-bold uppercase tracking-wider text-[11px] sm:text-xs text-text-muted mb-1.5">
                  SOCIAL
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-serif text-base sm:text-lg text-text-primary">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black hover:underline transition-colors dark:hover:text-white"
                  >
                    Instagram
                  </a>
                  <span className="text-text-muted">/</span>
                  <a
                    href="https://vimeo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black hover:underline transition-colors dark:hover:text-white"
                  >
                    Vimeo
                  </a>
                  <span className="text-text-muted">/</span>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black hover:underline transition-colors dark:hover:text-white"
                  >
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: The Conversational Form & Success State     */}
        {/* ========================================================= */}
        <div
          ref={rightColRef}
          className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center h-full pt-2 lg:pt-6"
        >
          {!isSubmitted ? (
            <form
              ref={formContainerRef}
              onSubmit={handleSubmit}
              className="w-full flex flex-col justify-center"
              noValidate
            >
              {/* Validation Warning Notice */}
              {validationError && (
                <div className="mb-6 px-4 py-2.5 rounded-xl bg-[#EBEBE8] border border-text-primary/20 text-xs font-sans font-bold uppercase tracking-wider text-text-primary inline-flex items-center gap-2 max-w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
                  {validationError}
                </div>
              )}

              {/* Mad-Libs Conversational Sentence */}
              <div className="font-serif italic text-text-primary text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[2.9rem] leading-[1.65] sm:leading-[1.75] md:leading-[1.8] tracking-tight">
                Hi B studio, my name is {/* 1. NAME INPUT */}
                <span className="inline-grid grid-cols-1 items-baseline mx-1 align-baseline relative">
                  <span
                    aria-hidden="true"
                    className="col-start-1 row-start-1 font-sans font-bold not-italic text-transparent select-none whitespace-pre pointer-events-none px-1 text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[2.9rem]"
                  >
                    {name || "Your Name"}
                  </span>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    onFocus={() => setFocusedInput("name")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Your Name"
                    className={cn(
                      "col-start-1 row-start-1 w-full bg-transparent font-sans font-bold not-italic text-text-primary px-1 text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[2.9rem]",
                      "border-b transition-colors duration-300 focus:outline-none placeholder:font-serif placeholder:italic placeholder:font-normal placeholder:text-text-muted/60",
                      focusedInput === "name" || name
                        ? "border-black border-b-2"
                        : "border-[#888888]",
                    )}
                    required
                  />
                </span>
                . I am captivated by your work and would love to book a{" "}
                {/* 2. SERVICE SELECTOR DROPDOWN */}
                <span
                  ref={dropdownContainerRef}
                  className="relative inline-block mx-1 align-baseline"
                >
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    onFocus={() => setFocusedInput("service")}
                    onBlur={() => setFocusedInput(null)}
                    aria-expanded={isDropdownOpen}
                    className={cn(
                      "inline-flex items-center gap-1.5 sm:gap-2 font-sans font-bold not-italic text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[2.9rem] text-text-primary px-1 border-b transition-colors duration-300 focus:outline-none cursor-pointer",
                      isDropdownOpen ||
                        focusedInput === "service" ||
                        selectedService
                        ? "border-black border-b-2"
                        : "border-[#888888]",
                    )}
                  >
                    <span
                      className={cn(
                        !selectedService &&
                          "font-serif italic font-normal text-text-muted/80",
                      )}
                    >
                      {selectedService || "Select Service"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform duration-300 stroke-[2.25] text-text-primary",
                        isDropdownOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {/* Floating Service Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-3 z-50 w-72 sm:w-80 rounded-2xl bg-bg-base border border-text-primary/15 p-2 shadow-2xl backdrop-blur-md">
                      <div className="px-3 py-2 text-[10px] font-sans font-bold uppercase tracking-widest text-text-muted border-b border-text-primary/10 mb-1 flex items-center justify-between">
                        <span>Core Services</span>
                        <span>06</span>
                      </div>
                      <div className="space-y-1">
                        {CORE_SERVICES.map((service, index) => {
                          const isSelected = selectedService === service;
                          return (
                            <button
                              key={service}
                              type="button"
                              onClick={() => {
                                setSelectedService(service);
                                setIsDropdownOpen(false);
                                if (validationError) setValidationError(null);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2.5 rounded-xl font-sans text-sm sm:text-base flex items-center justify-between transition-colors duration-200 cursor-pointer",
                                isSelected
                                  ? "bg-text-primary text-bg-base font-bold"
                                  : "text-text-primary hover:bg-bg-surface font-medium",
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={cn(
                                    "font-mono text-xs",
                                    isSelected
                                      ? "text-bg-base/70"
                                      : "text-text-muted",
                                  )}
                                >
                                  0{index + 1}.
                                </span>
                                <span>{service}</span>
                              </div>
                              {isSelected && (
                                <Check className="w-4 h-4 stroke-[2.5]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </span>{" "}
                for my upcoming event around {/* 3. DATE INPUT */}
                <span className="inline-grid grid-cols-1 items-baseline mx-1 align-baseline relative">
                  <span
                    aria-hidden="true"
                    className="col-start-1 row-start-1 font-sans font-bold not-italic text-transparent select-none whitespace-pre pointer-events-none px-1 text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[2.9rem]"
                  >
                    {date || "Date"}
                  </span>
                  <input
                    id="contact-date"
                    type="text"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    onFocus={() => setFocusedInput("date")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Date"
                    className={cn(
                      "col-start-1 row-start-1 w-full bg-transparent font-sans font-bold not-italic text-text-primary px-1 text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[2.9rem]",
                      "border-b transition-colors duration-300 focus:outline-none placeholder:font-serif placeholder:italic placeholder:font-normal placeholder:text-text-muted/60",
                      focusedInput === "date" || date
                        ? "border-black border-b-2"
                        : "border-[#888888]",
                    )}
                    required
                  />
                </span>
                . You can reach me at {/* 4. EMAIL INPUT */}
                <span className="inline-grid grid-cols-1 items-baseline mx-1 align-baseline relative">
                  <span
                    aria-hidden="true"
                    className="col-start-1 row-start-1 font-sans font-bold not-italic text-transparent select-none whitespace-pre pointer-events-none px-1 text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[2.9rem]"
                  >
                    {email || "Email/PHONE"}
                  </span>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Email/Phone"
                    className={cn(
                      "col-start-1 row-start-1 w-full bg-transparent font-sans font-bold not-italic text-text-primary px-1 text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[2.9rem]",
                      "border-b transition-colors duration-300 focus:outline-none placeholder:font-serif placeholder:italic placeholder:font-normal placeholder:text-text-muted/60",
                      focusedInput === "email" || email
                        ? "border-black border-b-2"
                        : "border-[#888888]",
                    )}
                    required
                  />
                </span>{" "}
                to discuss the details.
              </div>

              {/* Massive Pill-Shaped "SEND INQUIRY" Button with Magnetic Effect */}
              <div
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="pt-10 sm:pt-14 inline-block p-4 -m-4 pointer-events-auto max-w-fit"
              >
                <button
                  ref={magneticButtonRef}
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center justify-center gap-4 px-10 sm:px-14 md:px-16 py-5 sm:py-6 rounded-full bg-text-primary text-bg-base font-sans font-black uppercase tracking-wider text-sm sm:text-base cursor-pointer shadow-lg hover:bg-black transition-colors duration-300 disabled:opacity-50"
                >
                  <span>
                    {isSubmitting ? "TRANSMITTING..." : "SEND INQUIRY"}
                  </span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          ) : (
            /* Elegant Serif Confirmation Message State */
            <div
              ref={successContainerRef}
              className="w-full py-10 sm:py-16 flex flex-col justify-center"
            >
              <div className="space-y-6 max-w-xl">
                <div className="w-14 h-[2px] bg-text-primary" />

                <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.18] tracking-tight">
                  &ldquo;Your story is safe with us. We will be in touch
                  soon.&rdquo;
                </h2>

                <p className="font-sans font-bold uppercase tracking-[0.2em] text-xs sm:text-sm text-text-muted">
                  — B STUDIO EDITORIAL TEAM
                </p>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="font-sans font-bold uppercase tracking-wider text-xs sm:text-sm text-text-primary underline underline-offset-4 hover:text-black transition-colors cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
