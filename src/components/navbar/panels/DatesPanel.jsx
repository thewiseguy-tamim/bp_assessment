import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Local helpers for this panel
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const isBetween = (x, s, e) => s && e && x.getTime() > s.getTime() && x.getTime() < e.getTime();

function monthMatrix(monthDate) {
  const first = startOfMonth(monthDate);
  const startWeekday = first.getDay();
  const totalDays = endOfMonth(monthDate).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++)
    cells.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);
  return cells;
}

export default function DatesPanel({
  leftMonth,
  rightMonth,
  startDate,
  endDate,
  onDayClick,
  flex,
  setFlex,
  setOffset,
}) {
  const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
  const quick = [0, 1, 2, 3, 7, 14];

  const Month = (monthDate) => {
    if (!monthDate) return <div className="w-full" />; // placeholder (mobile)
    const label = new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(monthDate);
    const cells = monthMatrix(monthDate);

    const today = new Date();
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return (
      <div className="w-full">
        <div className="mb-4 text-center text-[18px] font-semibold text-[#222222]">
          {label}
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 text-center text-[12px] font-semibold uppercase text-[#717171]">
          {DAYS.map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid (no horizontal gap to allow continuous range background) */}
        <div className="mt-1 grid grid-cols-7 gap-y-1">
          {cells.map((d, i) => {
            const isEmpty = !d;
            const disabled = isEmpty || d < todayMid;

            const start = !isEmpty && startDate && isSameDay(d, startDate);
            const end = !isEmpty && endDate && isSameDay(d, endDate);
            const between = !isEmpty && startDate && endDate && isBetween(d, startDate, endDate);
            const inRange = start || end || between;

            return (
              <div
                key={i}
                className="relative h-10 sm:h-11 md:h-12 flex items-center justify-center"
              >
                {/* Range background bar (continuous across cells) */}
                {inRange && !disabled && (
                  <span
                    aria-hidden
                    className={[
                      "absolute inset-y-0 w-full bg-[#F7F7F7]",
                      start ? "rounded-l-full" : "",
                      end ? "rounded-r-full" : "",
                    ].join(" ")}
                  />
                )}

                {/* Day button */}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onDayClick(d)}
                  className={[
                    "relative z-10 flex items-center justify-center rounded-full transition",
                    "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10",
                    disabled
                      ? "text-[#DDDDDD] cursor-not-allowed"
                      : "text-[#222222] hover:bg-[#F7F7F7]",
                    start || end ? "bg-black text-white hover:bg-black" : "",
                  ].join(" ")}
                >
                  {!isEmpty ? d.getDate() : ""}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-[min(920px,calc(100vw-64px))] overflow-x-hidden">
      {/* Nav chevrons aligned like Airbnb */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOffset((v) => Math.max(0, v - 1))}
          className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="grow" />
        <button
          type="button"
          onClick={() => setOffset((v) => v + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Two-month grid on desktop; one month on mobile */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {Month(leftMonth)}
        {rightMonth && <div className="hidden lg:block">{Month(rightMonth)}</div>}
      </div>

      {/* Flexibility chips */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {quick.map((d) => {
          const active = flex === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setFlex(d)}
              className={[
                "rounded-full border px-4 py-2 text-[14px] transition shadow-sm",
                active
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-[#D9D9D9] hover:border-[#A3A3A3]",
              ].join(" ")}
            >
              {d === 0 ? "Exact dates" : `± ${d} ${d === 1 ? "day" : "days"}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}