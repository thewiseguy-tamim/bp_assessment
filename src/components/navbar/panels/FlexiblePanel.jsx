import React, { useMemo, useRef, useState } from "react";
import { ChevronRight, Calendar } from "lucide-react";

export default function FlexiblePanel({ setStartDate, setEndDate }) {
  const [length, setLength] = useState("weekend");
  const monthsRef = useRef(null);

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

  const chooseMonth = (d) => {
    const s = new Date(d.getFullYear(), d.getMonth(), 1);
    const nights = length === "weekend" ? 2 : length === "week" ? 7 : 30;
    const e = new Date(s);
    e.setDate(e.getDate() + nights);
    setStartDate(s);
    setEndDate(e);
  };

  const scrollBy = (dir = 1) => {
    const el = monthsRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(600, el.clientWidth * 0.8),
      behavior: "smooth",
    });
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

      <div className="mb-6 text-center text-[24px] font-bold text-[#222222]">
        Go anytime
      </div>

      <div className="relative pr-[56px]">
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll months"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 rounded-full border border-[#DDDDDD] bg-white p-3 shadow hover:shadow-md"
        >
          <ChevronRight className="h-5 w-5 text-[#222222]" />
        </button>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />

        <div
          ref={monthsRef}
          className="flex gap-4 overflow-x-auto pb-2 pr-16 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {months.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => chooseMonth(m.date)}
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
