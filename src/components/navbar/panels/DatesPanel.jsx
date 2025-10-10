import React, { useCallback, useEffect, useMemo, useState } from "react";

function ChevronRightIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const isBetween = (x, s, e) =>
  s && e && x.getTime() > s.getTime() && x.getTime() < e.getTime();
const isSameMonthYear = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth();

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

const dbg = (...args) => {
  if (typeof window === "undefined") return;
  const enabled = window.__SEARCH_DEBUG__ ?? true;
  if (enabled) console.debug("[DatesPanel]", ...args);
};

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
  const DAYS = useMemo(
    () => [
      { key: "sun", label: "S" },
      { key: "mon", label: "M" },
      { key: "tue", label: "T" },
      { key: "wed", label: "W" },
      { key: "thu", label: "T" },
      { key: "fri", label: "F" },
      { key: "sat", label: "S" },
    ],
    []
  );
  const quick = [0, 1, 2, 3, 7, 14];

  const [s, setS] = useState(startDate ?? null);
  const [e, setE] = useState(endDate ?? null);

  const [picking, setPicking] = useState(() =>
    startDate && !endDate ? "end" : "start"
  );

  useEffect(() => {
    if (startDate !== undefined) setS(startDate);
  }, [startDate]);
  useEffect(() => {
    if (endDate !== undefined) setE(endDate);
  }, [endDate]);
  useEffect(() => {
    if (s && !e) setPicking("end");
    if ((!s && !e) || (s && e)) setPicking("start");
  }, [s, e]);

  const fmtMonthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: "long",
        year: "numeric",
      }),
    []
  );

  const handleWheel = useCallback(
    (e) => {
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 8) return;
      if (delta > 0) setOffset((v) => v + 1);
      else setOffset((v) => v - 1);
    },
    [setOffset]
  );

  const handleKey = useCallback(
    (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        setOffset((v) => v + 1);
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setOffset((v) => v - 1);
      }
    },
    [setOffset]
  );

  const autoAdvanceForCheckout = useCallback(
    (clickedStart) => {
      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(min-width: 1024px)").matches;

      if (isDesktop) {
        if (rightMonth && isSameMonthYear(clickedStart, rightMonth)) {
          setOffset((v) => v + 1);
        }
      } else {
        setOffset((v) => v + 1);
      }
    },
    [rightMonth, setOffset]
  );

  const handleSelect = useCallback(
    (d) => {
      if (!d) return;

      if (picking === "start") {
        setS(d);
        setE(null);
        setPicking("end");
        autoAdvanceForCheckout(d);
        dbg("Select start", d);
        onDayClick?.(d, d, null);
        return;
      }

      if (!s) {
        setS(d);
        setE(null);
        setPicking("end");
        autoAdvanceForCheckout(d);
        dbg("No start yet; treat as start", d);
        onDayClick?.(d, d, null);
        return;
      }

      if (d.getTime() <= s.getTime()) {
        setS(d);
        setE(null);
        setPicking("end");
        autoAdvanceForCheckout(d);
        dbg("Clicked before/at start; moved start", d);
        onDayClick?.(d, d, null);
      } else {
        setE(d);
        setPicking("start");
        dbg("Select end", d);
        onDayClick?.(d, s, d);
      }
    },
    [picking, s, autoAdvanceForCheckout, onDayClick]
  );

  const Month = (monthDate) => {
    if (!monthDate) return <div className="w-full" />;
    const label = fmtMonthLabel.format(monthDate);
    const cells = monthMatrix(monthDate);

    const today = new Date();
    const todayMid = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return (
      <div className="w-full">
        <div className="mb-6 text-center text-[18px] font-semibold text-[#222222]">
          {label}
        </div>

        <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase text-[#8E8E8E] tracking-wide">
          {DAYS.map((d, i) => (
            <div key={`hdr-${d.key}-${i}`} className="py-1">
              {d.label}
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-y-1">
          {cells.map((d, i) => {
            const isEmpty = !d;
            const disabled = isEmpty || d < todayMid;

            const start = !isEmpty && s && isSameDay(d, s);
            const end = !isEmpty && e && isSameDay(d, e);
            const between = !isEmpty && s && e && isBetween(d, s, e);
            const inRange = start || end || between;

            return (
              <div
                key={i}
                className="relative h-10 sm:h-12 flex items-center justify-center"
              >
                {inRange && !disabled && (
                  <span
                    aria-hidden
                    className={[
                      "absolute inset-y-0 w-full bg-[#F2F2F2]",
                      start ? "rounded-l-full" : "",
                      end ? "rounded-r-full" : "",
                    ].join(" ")}
                  />
                )}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(d)}
                  className={[
                    "relative z-10 flex items-center justify-center rounded-full transition",
                    "h-8 w-8 sm:h-9 sm:w-9 text-[13px] sm:text-[14px]",
                    disabled
                      ? "text-[#D1D1D1] cursor-not-allowed"
                      : "text-[#222222] hover:bg-[#F2F2F2]",
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

  const handleNext = () => setOffset((v) => v + 1);
  const handlePrev = () => setOffset((v) => v - 1);

  return (
    <div className="w-[min(920px,calc(100vw-64px))] overflow-x-hidden">
      <div
        className="relative max-w-[820px] outline-none pt-2"
        tabIndex={0}
        onWheel={handleWheel}
        onKeyDown={handleKey}
        aria-label="Calendar months"
      >
        <div className="relative">
          {/* Add side padding so the arrows don't cover the grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 px-12">
            {Month(leftMonth)}
            {rightMonth && (
              <div className="hidden lg:block">{Month(rightMonth)}</div>
            )}
          </div>

          {/* Previous month arrow */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous month"
            title="Previous month"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20
                       flex h-9 w-9 items-center justify-center rounded-full
                       border border-[#D9D9D9] bg-white text-[#222222] shadow-sm
                       hover:bg-[#F2F2F2] focus:outline-none focus:ring-2 focus:ring-black"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          {/* Next month arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next month"
            title="Next month"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20
                       flex h-9 w-9 items-center justify-center rounded-full
                       border border-[#D9D9D9] bg-white text-[#222222] shadow-sm
                       hover:bg-[#F2F2F2] focus:outline-none focus:ring-2 focus:ring-black"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Left-aligned quick buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-start gap-2">
          {quick.map((d) => {
            const active = flex === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => {
                  dbg("Flex set", d);
                  setFlex(d);
                }}
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
    </div>
  );
}