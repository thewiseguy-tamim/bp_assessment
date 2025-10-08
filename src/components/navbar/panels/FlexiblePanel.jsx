import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function FlexiblePanel({ setStartDate, setEndDate }) {
  const [length, setLength] = useState("weekend");
  const monthsRef = useRef(null);

  // Scroll affordances
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  // Accent color used for active length chip
  const ACCENT = "#E61E4D";

  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      return {
        id: i,
        date: d,
        month: new Intl.DateTimeFormat(undefined, { month: "long" }).format(d),
        year: new Intl.DateTimeFormat(undefined, { year: "numeric" }).format(d),
      };
    });
  }, []);

  const updateScrollState = useCallback(() => {
    const el = monthsRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const sl = el.scrollLeft;
    setCanLeft(sl > 2);
    setCanRight(sl < max - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = monthsRef.current;
    if (!el) return;
    const onScroll = () => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  // Pick a month -> set dates based on selected length
  const chooseMonth = (d) => {
    const s = new Date(d.getFullYear(), d.getMonth(), 1);
    const nights = length === "weekend" ? 2 : length === "week" ? 7 : 30;
    const e = new Date(s);
    e.setDate(e.getDate() + nights);
    setStartDate(s);
    setEndDate(e);
  };

  // Smooth paging by ~80% of the visible width (feels like a carousel)
  const scrollStep = () => {
    const el = monthsRef.current;
    if (!el) return 0;
    return Math.min(600, el.clientWidth * 0.8);
  };

  const scrollByDir = (dir = 1) => {
    const el = monthsRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * scrollStep(), behavior: "smooth" });
  };

  // Trackpad/mouse wheel -> slide horizontally
  const handleWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 8) return;
    e.preventDefault();
    scrollByDir(delta > 0 ? 1 : -1);
  };

  // Keyboard arrows -> slide
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByDir(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByDir(-1);
    }
  };

  return (
    <div className="w-[min(920px,calc(100vw-64px))]">
      {/* Title (centered) */}
      <div className="mt-1 mb-6 text-center text-[20px] sm:text-[22px] font-semibold text-[#222222]">
        How long would you like to stay?
      </div>

      {/* Alignment wrapper: keeps content centered; slight left nudge to account for arrows */}
      <div className="mx-auto max-w-[900px] px-3 sm:px-0 transform-gpu -translate-x-4 sm:-translate-x-6">

        {/* Length chips (outlined pills) */}
        <div className="mb-8 flex items-center justify-center gap-3">
          {[
            { key: "weekend", label: "Weekend" },
            { key: "week", label: "Week" },
            { key: "month", label: "Month" },
          ].map((opt) => {
            const active = length === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setLength(opt.key)}
                className={[
                  "rounded-full px-5 py-2 text-[14px] font-medium transition",
                  "border shadow-sm",
                  "text-[#222222] border-[#DDDDDD] hover:border-[#B0B0B0] hover:shadow",
                ].join(" ")}
                style={active ? { color: ACCENT, borderColor: ACCENT } : undefined}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Subheading */}
        <div className="mb-2 text-center text-[16px] font-semibold text-[#222222]">
          Go anytime
        </div>

        {/* Divider above the squares */}
        <div className="mx-auto mb-4 h-px w-[98%] max-w-[880px] bg-[#EEEEEE]" />

        {/* Slider area */}
        <div className="relative px-2 sm:px-6 py-2">
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            aria-label="Scroll months left"
            className={[
              "absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-1/2",
              "rounded-full border border-[#DDDDDD] bg-white p-2.5 shadow",
              "transition",
              canLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
            ].join(" ")}
          >
            <ChevronLeft className="h-5 w-5 text-[#222222]" />
          </button>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            aria-label="Scroll months right"
            className={[
              "absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2",
              "rounded-full border border-[#DDDDDD] bg-white p-2.5 shadow",
              "transition",
              canRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
            ].join(" ")}
          >
            <ChevronRight className="h-5 w-5 text-[#222222]" />
          </button>

          {/* Edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />

          {/* Months scroller: show 6 squares visually on desktop */}
          <div
            ref={monthsRef}
            className="flex gap-4 overflow-x-auto pr-3 pl-3 pb-1 outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            tabIndex={0}
            onWheel={handleWheel}
            onKeyDown={handleKeyDown}
            role="listbox"
            aria-label="Pick a month"
          >
            {months.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => chooseMonth(m.date)}
                role="option"
                className={[
                  // Perfect square size; tuned so 6 fit across typical 880–900px viewport with 16px gaps
                  "w-[120px] h-[120px] sm:w-[128px] sm:h-[128px] md:w-[132px] md:h-[132px]",
                  "shrink-0 rounded-[16px] border border-[#DDDDDD] bg-white text-center",
                  "px-4 py-4 transition",
                  "hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:-translate-y-[3px] hover:border-[#B0B0B0]",
                  "focus:outline-none focus:ring-2 focus:ring-black/10",
                  "flex flex-col items-center justify-center",
                ].join(" ")}
              >
                <Calendar className="mb-3 h-7 w-7 text-[#8A8A8A]" />
                <div className="text-[15px] font-semibold text-[#222222] leading-tight">
                  {m.month}
                </div>
                <div className="text-[12px] text-[#717171] leading-tight mt-0.5">
                  {m.year}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}