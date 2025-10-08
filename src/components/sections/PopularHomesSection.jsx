import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "../cards/PropertyCard";

/**
 * PopularHomesSection
 * - Mobile: horizontal snap carousel
 * - Desktop: wide horizontal scroller with arrow controls
 *
 * Props:
 * - title: string (e.g., "Popular homes in Kuala Lumpur")
 * - properties: Property[] (shape expected by PropertyCard)
 * - onPropertyClick?: (property) => void
 * - className?: string
 */
export default function PopularHomesSection({
  title,
  properties = [],
  onPropertyClick,
  className = "",
}) {
  const scrollRef = useRef(null);

  const scrollBy = (dir = 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(900, el.clientWidth * 0.9);
    el.scrollBy({ left: amount * dir, behavior: "smooth" });
  };

  return (
    <section className= {`w-full ${className}`}>
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#222222]">{title}</h2>

          {/* Arrow nav on desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DDDDDD] hover:bg-[#F7F7F7]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DDDDDD] hover:bg-[#F7F7F7]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scroller: snap on mobile; smooth scroll everywhere */}
        <div
          ref={scrollRef}
          className="scroll-smooth overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-6 snap-x snap-mandatory">
            {properties.map((p) => (
              <div
                key={p.id}
                className="snap-start shrink-0 w-[260px] sm:w-[300px] lg:w-[320px]"
                data-card
              >
                <PropertyCard property={p} onClick={() => onPropertyClick?.(p)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}