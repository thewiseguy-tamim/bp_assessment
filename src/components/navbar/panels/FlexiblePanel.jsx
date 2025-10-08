import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function FlexiblePanel({ setStartDate, setEndDate }) {
  const [length, setLength] = useState("weekend");
  const monthsRef = useRef(null);

  // Scroll affordances
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      return {
        id: i,
        date: d,
        label: new Intl.DateTimeFormat(undefined, {
          month: "long",
          year: "numeric",
        }).format(d),
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
    <div className="w-[min(920px,calc(100vw-64px))] min-h-[600px]">
      <div className="mb-8 text-center text-[24px] font-bold text-[#222222]">
        How long would you like to stay?
      </div>

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
                "rounded-full border px-7 py-3 text-[16px] transition",
                active
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-[#B0B0B0] hover:border-[#222222] hover:shadow",
              ].join(" ")}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="mb-6 text-center text-[22px] font-semibold text-[#222222]">
        Go anytime
      </div>

      {/* Slider area */}
      <div className="relative px-[56px]">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scrollByDir(-1)}
          aria-label="Scroll months left"
          className={[
            "absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-1/2 rounded-full border border-[#DDDDDD] bg-white p-3 shadow transition",
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
            "absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 rounded-full border border-[#DDDDDD] bg-white p-3 shadow transition",
            canRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <ChevronRight className="h-5 w-5 text-[#222222]" />
        </button>

        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />

        {/* Scroll container */}
        <div
          ref={monthsRef}
          className="flex gap-4 overflow-x-auto pb-2 pr-2 pl-2 outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
              className="w-[140px] h-[160px] shrink-0 rounded-[16px] border border-[#DDDDDD] bg-white p-7 text-center transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-[4px] hover:border-black"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F7F7]">
                <Calendar className="h-6 w-6 text-[#717171]" />
              </div>
              <div className="text-[17px] font-bold text-[#222222]">
                {m.label.split(" ")[0]}
              </div>
              <div className="text-[14px] text-[#717171]">
                {m.label.split(" ").slice(1).join(" ")}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}