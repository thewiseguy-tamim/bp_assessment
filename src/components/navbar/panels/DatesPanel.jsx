import React, { useCallback, useEffect, useMemo, useState } from "react";

// Inline chevron icon (no external dependency)
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

// Local helpers
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const isSameDay = (a, b) =>
  a && b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const isBetween = (x, s, e) =>
  s && e && x.getTime() > s.getTime() && x.getTime() < e.getTime();
const isSameMonthYear = (a, b) =>
  a && b &&
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

export default function DatesPanel({
  leftMonth,
  rightMonth,
  // Controlled (optional)
  startDate,
  endDate,
  // Callback (optional): onDayClick(clicked, nextStart, nextEnd)
  onDayClick,
  flex,
  setFlex,
  setOffset,
}) {
  const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
  const quick = [0, 1, 2, 3, 7, 14];

  // Internal state for check-in/out (works if parent doesn't control)
  const [s, setS] = useState(startDate ?? null);
  const [e, setE] = useState(endDate ?? null);

  // Which part is active: 'start' (check-in) or 'end' (check-out)
  const [picking, setPicking] = useState(() => (startDate && !endDate ? "end" : "start"));

  // Keep internal in sync with controlled props
  useEffect(() => {
    if (startDate !== undefined) setS(startDate);
  }, [startDate]);
  useEffect(() => {
    if (endDate !== undefined) setE(endDate);
  }, [endDate]);
  useEffect(() => {
    if (s && !e) setPicking("end");
    // if both selected or none selected, default to 'start'
    if ((!s && !e) || (s && e)) setPicking("start");
  }, [s, e]);

  const fmtBadge = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
      }),
    []
  );

  // Forward-only: wheel moves forward; negative deltas ignored
  const handleWheel = useCallback(
    (e) => {
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 8) return;
      if (delta > 0) setOffset((v) => v + 1);
    },
    [setOffset]
  );

  // Forward-only: ArrowRight/PageDown move forward; others ignored
  const handleKey = useCallback(
    (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        setOffset((v) => v + 1);
      }
    },
    [setOffset]
  );

  const autoAdvanceForCheckout = useCallback(
    (clickedStart) => {
      // Desktop uses two visible months (lg >= 1024px)
      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(min-width: 1024px)").matches;

      if (isDesktop) {
        // If you pick start in the right visible month, advance so the next month is visible
        if (rightMonth && isSameMonthYear(clickedStart, rightMonth)) {
          setOffset((v) => v + 1);
        }
      } else {
        // On mobile (1-month view), always advance to next month after selecting start
        setOffset((v) => v + 1);
      }
    },
    [rightMonth, setOffset]
  );

  const handleSelect = useCallback(
    (d) => {
      if (!d) return;

      if (picking === "start") {
        // Start a new range with this as check-in
        setS(d);
        setE(null);
        setPicking("end"); // immediately switch to checkout mode
        autoAdvanceForCheckout(d);
        onDayClick?.(d, d, null);
        return;
      }

      // picking === 'end'
      if (!s) {
        // No check-in yet; treat this as start and stay in 'end' to encourage selecting checkout
        setS(d);
        setE(null);
        setPicking("end");
        autoAdvanceForCheckout(d);
        onDayClick?.(d, d, null);
        return;
      }

      if (d.getTime() <= s.getTime()) {
        // Clicked before/at start: move start to this day and continue waiting for checkout
        setS(d);
        setE(null);
        setPicking("end");
        autoAdvanceForCheckout(d);
        onDayClick?.(d, d, null);
      } else {
        // Valid checkout
        setE(d);
        setPicking("start"); // finished a range; default back to start for next selection
        onDayClick?.(d, s, d);
      }
    },
    [picking, s, autoAdvanceForCheckout, onDayClick]
  );

  const Month = (monthDate) => {
    if (!monthDate) return <div className="w-full" />; // placeholder for mobile
    const label = new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(monthDate);
    const cells = monthMatrix(monthDate);

    const today = new Date();
    const todayMid = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return (
      <div className="w-full">
        <div className="mb-3 text-center text-[18px] font-semibold text-[#222222]">
          {label}
        </div>

        {/* Weekday headers (compact) */}
        <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase text-[#8E8E8E] tracking-wide">
          {DAYS.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Grid w/o horizontal gaps for continuous range bg */}
        <div className="mt-0.5 grid grid-cols-7 gap-y-0.5">
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
                className="relative h-9 sm:h-10 flex items-center justify-center"
              >
                {/* Range bar */}
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
                  onClick={() => handleSelect(d)}
                  className={[
                    "relative z-10 flex items-center justify-center rounded-full transition",
                    "h-8 w-8 sm:h-9 sm:w-9 text-[13px]",
                    disabled
                      ? "text-[#DDDDDD] cursor-not-allowed"
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

  return (
    <div className="w-[min(920px,calc(100vw-64px))] overflow-x-hidden">
      {/* Header row inside the calendar: Check-in/Check-out + forward-only arrow */}
      <div className="mb-3 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-[13px]">
          <button
            type="button"
            onClick={() => setPicking("start")}
            className={[
              "rounded-full border px-3 py-1 transition",
              picking === "start"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-[#E5E5E5] hover:border-[#CFCFCF]",
            ].join(" ")}
            aria-pressed={picking === "start"}
            title="Select check-in date"
          >
            <span className="font-medium">
              Check-in{": "}
            </span>
            <span>{s ? fmtBadge.format(s) : "Add date"}</span>
          </button>

          <button
            type="button"
            onClick={() => setPicking("end")}
            className={[
              "rounded-full border px-3 py-1 transition",
              picking === "end"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-[#E5E5E5] hover:border-[#CFCFCF]",
            ].join(" ")}
            aria-pressed={picking === "end"}
            title="Select check-out date"
          >
            <span className="font-medium">
              Check-out{": "}
            </span>
            <span>{e ? fmtBadge.format(e) : "Add date"}</span>
          </button>
        </div>

        {/* Forward-only button (always visible, inside the panel) */}
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-sm hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/30"
          aria-label="Next month"
          title="Next month"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Focusable wrapper to support keyboard + wheel sliding */}
      <div
        className="mx-auto max-w-[820px] outline-none"
        tabIndex={0}
        onWheel={handleWheel}
        onKeyDown={handleKey}
        aria-label="Calendar months"
      >
        {/* Two-month grid on desktop; one month on mobile */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Month(leftMonth)}
          {rightMonth && <div className="hidden lg:block">{Month(rightMonth)}</div>}
        </div>

        {/* Flexibility chips (compact) */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {quick.map((d) => {
            const active = flex === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setFlex(d)}
                className={[
                  "rounded-full border px-3.5 py-1.5 text-[13px] transition shadow-sm",
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