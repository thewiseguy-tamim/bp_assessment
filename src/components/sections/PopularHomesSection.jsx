import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "../cards/PropertyCard";

/**
 * PopularHomesSection
 * - Mobile: horizontal snap carousel
 * - Desktop: wide horizontal scroller with arrow controls
 * - Desktop shows exactly 7 columns without cutoffs
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
    <section className={`w-full ${className}`}>
      {/* Local CSS to force 7 columns on desktop */}
      <style>{`
        @media (min-width: 1024px) {
          /* 7 columns with CSS vars for gap/columns */
          [data-grid="homes"] .card-item {
            width: calc((100% - (var(--gap, 20px) * (var(--cols, 7) - 1))) / var(--cols, 7)) !important;
          }
        }
      `}</style>

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
          {/* gap-5 -> 20px; expose as CSS var so calc can match it */}
          <div
            className="flex gap-5 snap-x snap-mandatory"
            data-grid="homes"
            style={{
              // Ensure desktop is exactly 7 columns
              // You can tweak gap here if needed (must match gap-5 => 20px)
              "--cols": 7,
              "--gap": "20px",
            }}
          >
            {properties.map((p) => (
              <div
                key={p.id}
                // Mobile/tablet: fixed widths for nice snap
                // Desktop (lg+): width overridden by the CSS rule above to fit exactly 7 cols
                className="snap-start shrink-0 w-[220px] sm:w-[240px] md:w-[260px] card-item"
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