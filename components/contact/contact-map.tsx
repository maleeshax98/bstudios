import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ContactMapProps = React.HTMLAttributes<HTMLElement>;

export function ContactMap({ className, ...props }: ContactMapProps) {
  return (
    <section
      aria-label="Studio Location Map"
      className={cn(
        "relative w-full bg-bg-base text-text-primary border-t border-text-primary/10 select-none",
        className,
      )}
      {...props}
    >
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-24 py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-text-primary inline-block" />
              <span className="font-sans font-bold uppercase tracking-[0.25em] text-[10px] sm:text-xs text-text-muted">
                STUDIO LOCATION // VISIT US
              </span>
            </div>
            <h2 className="font-sans font-black uppercase tracking-tight text-2xl sm:text-3xl md:text-4xl text-text-primary">
              OUR STUDIO
            </h2>
          </div>

          <a
            href="https://www.google.com/maps/place/B'sTudio/@7.3265749,80.0539469,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider text-xs sm:text-sm text-text-primary hover:text-black dark:hover:text-white transition-colors"
          >
            <span>Open in Google Maps</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Responsive Map Container */}
        <div className="w-full h-[380px] sm:h-[450px] lg:h-[520px] rounded-2xl overflow-hidden border border-text-primary/10 bg-bg-surface shadow-xs">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.243053100509!2d80.0539469!3d7.3265749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2e149490d7d61%3A0x930526345c0bdcb3!2sB'sTudio!5e0!3m2!1sen!2ssg!4v1793351008402!5m2!1sen!2ssg"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="B'STUDIO Location on Google Maps"
            className="w-full h-full transition-[filter] duration-300 dark:contrast-[1.1] dark:invert-[0.9] dark:hue-rotate-180"
          />
        </div>
      </div>
    </section>
  );
}

export default ContactMap;
