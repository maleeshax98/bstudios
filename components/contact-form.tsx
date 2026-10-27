"use client";

import * as React from "react";
import gsap from "gsap";
import { ChevronDown, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
  "Preshoot",
  "Casual Shoot",
  "Birthday Shoot",
  "Engagement Shoot",
  "Wedding Shoot",
  "Promotion Video",
  "Other Service",
] as const;

export interface ContactFormProps extends React.HTMLAttributes<HTMLElement> {
  prompt?: string;
}

export function ContactForm({ className, prompt, ...props }: ContactFormProps) {
  const [name, setName] = React.useState("");
  const [selectedService, setSelectedService] = React.useState<string>("");
  const [date, setDate] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [focusedInput, setFocusedInput] = React.useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(
    null,
  );

  const dropdownContainerRef = React.useRef<HTMLSpanElement>(null);
  const magneticButtonRef = React.useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside or pressing Escape
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
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  // GSAP magnetic hover cursor tracking on the submit button
  const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = magneticButtonRef.current;
    if (!el) return;

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

  React.useEffect(() => {
    const el = magneticButtonRef.current;
    return () => {
      if (el) {
        gsap.killTweensOf(el);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setFeedbackMessage("Please provide your name.");
      document.getElementById("contact-name")?.focus();
      return;
    }

    if (!selectedService) {
      setFeedbackMessage("Please select a desired service.");
      setIsDropdownOpen(true);
      return;
    }

    if (!date.trim()) {
      setFeedbackMessage("Please enter your approximate event date.");
      document.getElementById("contact-date")?.focus();
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setFeedbackMessage("Please enter a valid email address.");
      document.getElementById("contact-email")?.focus();
      return;
    }

    setFeedbackMessage(null);
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

      setIsSubmitted(true);
      setIsSubmitting(false);

      // Reset feedback after a generous hold
      setTimeout(() => {
        setIsSubmitted(false);
        setName("");
        setSelectedService("");
        setDate("");
        setEmail("");
      }, 5000);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to submit inquiry. Please try again.";
      setFeedbackMessage(msg);
    }
  };

  return (
    <section
      id="contact"
      className={cn(
        "relative w-full bg-bg-base overflow-hidden px-6 sm:px-12 md:px-16 lg:px-24 py-28 sm:py-36 md:py-48 select-none border-t border-text-primary/10",
        className,
      )}
      {...props}
    >
      <div className="max-w-6xl mx-auto">
        {/* Editorial Heading / Prompt */}
        {prompt ? (
          <div className="mb-12 sm:mb-16">
            <h2 className="font-sans font-black uppercase tracking-tighter text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-text-primary leading-[0.88]">
              {prompt}
            </h2>
          </div>
        ) : (
          <div className="mb-10 sm:mb-14 flex items-center gap-3 text-xs sm:text-sm font-sans font-bold tracking-[0.25em] text-text-muted uppercase">
            <span className="w-8 h-[1px] bg-text-muted/40" />
            <span>Inquiries & Commissions</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Mad-Libs Conversational Sentence */}
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.65] sm:leading-[1.7] md:leading-[1.8] font-serif italic text-text-primary tracking-tight">
            <span>Hi B studio, my name is</span> {/* [ Your Name ] Input */}
            <span className="inline-grid items-baseline relative mx-1.5 sm:mx-2.5 align-baseline">
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 font-sans font-bold not-italic px-1.5 whitespace-pre pointer-events-none select-none min-w-[140px] sm:min-w-[180px]"
              >
                {name || "Your Name"}
              </span>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (feedbackMessage) setFeedbackMessage(null);
                }}
                onFocus={() => setFocusedInput("name")}
                onBlur={() => setFocusedInput(null)}
                placeholder="Your Name"
                aria-label="Your Name"
                className={cn(
                  "col-start-1 row-start-1 w-full bg-transparent font-sans font-bold not-italic text-text-primary",
                  "border-b-2 outline-none px-1.5 pb-0.5 sm:pb-1 transition-colors duration-300",
                  "caret-black selection:bg-text-primary selection:text-bg-base",
                  "placeholder:font-sans placeholder:font-normal placeholder:not-italic placeholder:text-text-muted/50",
                  focusedInput === "name"
                    ? "border-black"
                    : name
                      ? "border-text-primary"
                      : "border-[#888888] hover:border-black",
                )}
              />
            </span>
            <span>. I am captivated by your work and would love to book a</span>{" "}
            {/* [ Select Service ▾ ] Dropdown Selector */}
            <span
              ref={dropdownContainerRef}
              className="inline-block relative mx-1.5 sm:mx-2.5 align-baseline"
            >
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                className={cn(
                  "inline-flex items-center gap-1.5 sm:gap-2.5 bg-transparent border-b-2 px-1.5 pb-0.5 sm:pb-1 transition-colors duration-300 outline-none cursor-pointer",
                  "border-[#888888] hover:border-black",
                  (isDropdownOpen || selectedService) && "border-black",
                )}
              >
                <span
                  className={cn(
                    "font-sans not-italic transition-colors duration-200",
                    selectedService
                      ? "font-bold text-text-primary"
                      : "font-normal text-text-muted/70 hover:text-text-primary",
                  )}
                >
                  {selectedService || "Select Service"}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 stroke-[2.25]",
                    isDropdownOpen
                      ? "rotate-180 text-black"
                      : "text-text-muted",
                  )}
                />
              </button>

              {/* Sleek Floating Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  role="listbox"
                  aria-label="Photography and Videography Services"
                  className={cn(
                    "absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-3 z-50",
                    "w-72 sm:w-84 max-w-[calc(100vw-2.5rem)]",
                    "bg-[#F7F7F5] border border-text-primary/15 rounded-2xl p-2 sm:p-2.5",
                    "shadow-2xl shadow-black/10 backdrop-blur-none",
                    "animate-in fade-in zoom-in-95 duration-200",
                  )}
                >
                  <div className="px-3 py-2 border-b border-text-primary/10 mb-1 flex items-center justify-between">
                    <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-text-muted">
                      Select Service
                    </span>
                    <span className="font-serif italic text-xs text-text-muted">
                      {SERVICES.length} Offerings
                    </span>
                  </div>
                  <div className="py-1 flex flex-col gap-1">
                    {SERVICES.map((service, index) => {
                      const isSelected = selectedService === service;
                      return (
                        <button
                          key={service}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSelectedService(service);
                            setIsDropdownOpen(false);
                            if (feedbackMessage) setFeedbackMessage(null);
                          }}
                          className={cn(
                            "w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between group cursor-pointer",
                            isSelected
                              ? "bg-text-primary text-bg-base font-sans font-bold shadow-sm"
                              : "text-text-primary hover:bg-[#EBEBE8] font-sans font-medium",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "font-serif italic text-xs sm:text-sm",
                                isSelected
                                  ? "text-bg-base/70"
                                  : "text-text-muted group-hover:text-text-primary",
                              )}
                            >
                              0{index + 1}.
                            </span>
                            <span className="text-sm sm:text-base tracking-tight not-italic">
                              {service}
                            </span>
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
            <span>for my upcoming event around</span> {/* [ Date ] Input */}
            <span className="inline-grid items-baseline relative mx-1.5 sm:mx-2.5 align-baseline">
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 font-sans font-bold not-italic px-1.5 whitespace-pre pointer-events-none select-none min-w-[110px] sm:min-w-[140px]"
              >
                {date || "Date"}
              </span>
              <input
                id="contact-date"
                type="text"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (feedbackMessage) setFeedbackMessage(null);
                }}
                onFocus={() => setFocusedInput("date")}
                onBlur={() => setFocusedInput(null)}
                placeholder="Date"
                aria-label="Event Date"
                className={cn(
                  "col-start-1 row-start-1 w-full bg-transparent font-sans font-bold not-italic text-text-primary",
                  "border-b-2 outline-none px-1.5 pb-0.5 sm:pb-1 transition-colors duration-300",
                  "caret-black selection:bg-text-primary selection:text-bg-base",
                  "placeholder:font-sans placeholder:font-normal placeholder:not-italic placeholder:text-text-muted/50",
                  focusedInput === "date"
                    ? "border-black"
                    : date
                      ? "border-text-primary"
                      : "border-[#888888] hover:border-black",
                )}
              />
            </span>
            <span>. You can reach me at</span> {/* [ Email Address ] Input */}
            <span className="inline-grid items-baseline relative mx-1.5 sm:mx-2.5 align-baseline">
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 font-sans font-bold not-italic px-1.5 whitespace-pre pointer-events-none select-none min-w-[160px] sm:min-w-[210px]"
              >
                {email || "Email / Phone"}
              </span>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (feedbackMessage) setFeedbackMessage(null);
                }}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                placeholder="Email / Phone"
                aria-label="Email / Phone"
                className={cn(
                  "col-start-1 row-start-1 w-full bg-transparent font-sans font-bold not-italic text-text-primary",
                  "border-b-2 outline-none px-1.5 pb-0.5 sm:pb-1 transition-colors duration-300",
                  "caret-black selection:bg-text-primary selection:text-bg-base",
                  "placeholder:font-sans placeholder:font-normal placeholder:not-italic placeholder:text-text-muted/50",
                  focusedInput === "email"
                    ? "border-black"
                    : email
                      ? "border-text-primary"
                      : "border-[#888888] hover:border-black",
                )}
              />
            </span>{" "}
            <span>to discuss the details.</span>
          </div>

          {/* Submission Area with Magnetic CTA Button */}
          <div className="mt-16 sm:mt-20 md:mt-24 pt-10 border-t border-text-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div
              className="inline-block p-4 -m-4 pointer-events-auto"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              <button
                ref={magneticButtonRef}
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={cn(
                  "group relative inline-flex items-center justify-center gap-4 px-10 py-5 sm:px-14 sm:py-6 rounded-full",
                  "bg-text-primary text-bg-base font-sans font-bold text-sm sm:text-base md:text-lg tracking-widest uppercase",
                  "transition-all duration-300 ease-out cursor-pointer shadow-lg hover:shadow-2xl hover:bg-black",
                  "active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                )}
              >
                <span>
                  {isSubmitted
                    ? "INQUIRY SENT"
                    : isSubmitting
                      ? "TRANSMITTING..."
                      : "SEND INQUIRY"}
                </span>
                {isSubmitted ? (
                  <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
                ) : (
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
            </div>

            <div className="font-serif italic text-sm sm:text-base text-text-muted">
              {isSubmitted ? (
                <span className="text-text-primary font-medium">
                  Inquiry received. We will respond within 24 hours.
                </span>
              ) : feedbackMessage ? (
                <span className="text-red-600 font-sans text-xs sm:text-sm not-italic font-medium">
                  {feedbackMessage}
                </span>
              ) : (
                <span>
                  Direct inquiries: info@bstudio.com{" // "}WhatsApp:{" "}
                  <a
                    href="https://wa.me/94704028206"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-text-muted/40 hover:text-text-primary hover:decoration-black transition-colors"
                  >
                    +94 70 402 8206
                  </a>{" "}
                  {"// "}Colombo, Sri Lanka
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
