import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PINK = "#FF385C";

export default function DatesPanel({ checkIn, checkOut, onChange, initialMonth }) {
  const startOfMonth = (date) => {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const addMonths = (date, count) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + count);
    return d;
  };
  const getMonthMatrix = (date) => {
    const first = startOfMonth(date);
    const startWeekDay = first.getDay();
    const grid = [];
    let cur = 1 - startWeekDay;
    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        const day = new Date(first);
        day.setDate(cur);
        row.push(day);
        cur++;
      }
      grid.push(row);
    }
    return grid;
  };
  const isSameDay = (a, b) =>
    a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const isBefore = (a, b) => a.getTime() < b.getTime();
  const formatMonthTitle = (date) =>
    date.toLocaleString(undefined, { month: "long", year: "numeric" });

  const [cursor, setCursor] = useState(startOfMonth(initialMonth || new Date()));
  const months = [cursor, addMonths(cursor, 1)];

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const canGoPrev = startOfMonth(cursor) > startOfMonth(today);

  const pick = (d) => {
    let nextIn = checkIn;
    let nextOut = checkOut;

    if (!checkIn || (checkIn && checkOut)) {
      nextIn = d; nextOut = null;
    } else if (checkIn && !checkOut) {
      if (isBefore(d, checkIn)) {
        nextIn = d; nextOut = checkIn;
      } else {
        nextIn = checkIn; nextOut = d;
      }
    }
    console.debug("[DatesPanel] pick:", {
      click: d.toDateString(),
      nextCheckIn: nextIn?.toDateString(),
      nextCheckOut: nextOut?.toDateString(),
    });
    onChange?.({ checkIn: nextIn, checkOut: nextOut });
  };

  const DayCell = ({ date, inMonth }) => {
    const d = date.getDate();
    const isPast = date < today && inMonth;
    const isStart = inMonth && checkIn && isSameDay(date, checkIn);
    const isEnd = inMonth && checkOut && isSameDay(date, checkOut);
    const inRange =
      inMonth && checkIn && checkOut && isBefore(checkIn, date) && isBefore(date, checkOut);
    const isToday = inMonth && isSameDay(date, today);

    const base = "h-10 w-10 flex items-center justify-center rounded-full select-none transition";
    const muted = inMonth ? "" : "text-[#B0B0B0]";
    const disabled = isPast ? "text-[#DDDDDD]" : "";
    let variant = "";
    if (isStart || isEnd) variant = "bg-[color:var(--pink,#FF385C)] text-white font-semibold";
    else if (inRange) variant = "bg-[#FFE0E6]";
    else variant = "hover:bg-[#F7F7F7]";

    return (
      <button
        onClick={() => !isPast && pick(date)}
        disabled={isPast}
        aria-label={date.toDateString()}
        aria-pressed={isStart || isEnd}
        className={[base, muted, disabled, variant, isToday ? "ring-1 ring-black/10" : ""].join(" ")}
        style={{ "--pink": PINK }}
      >
        {d}
      </button>
    );
  };

  const DOW = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="px-2">
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="text-[13px] text-[#717171] grid grid-cols-7 gap-1 px-1 w-full">
          {DOW.map((c, i) => (
            <div key={`dow-${i}`} className="h-8 flex items-center justify-center">
              {c}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {months.map((m, idx) => {
          const mat = getMonthMatrix(m);
          return (
            <div key={idx} className="rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between px-1">
                <div className="text-[15px] font-semibold text-[#222222]">
                  {formatMonthTitle(m)}
                </div>
                <div className="flex items-center gap-1">
                  {idx === 0 && (
                    <button
                      className={`p-1 rounded hover:bg-black/5 transition ${!canGoPrev ? "opacity-40 pointer-events-none" : ""}`}
                      aria-label="Previous month"
                      onClick={() => {
                        const prev = addMonths(cursor, -1);
                        console.debug("[DatesPanel] prev month", prev);
                        if (canGoPrev) setCursor(prev);
                      }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}
                  {idx === 1 && (
                    <button
                      className="p-1 rounded hover:bg-black/5 transition"
                      aria-label="Next month"
                      onClick={() => {
                        const next = addMonths(cursor, 1);
                        console.debug("[DatesPanel] next month", next);
                        setCursor(next);
                      }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-7 gap-1">
                {mat.flat().map((d, i) => {
                  const inThisMonth = d.getMonth() === m.getMonth();
                  return (
                    <div key={`${m.getMonth()}-${m.getFullYear()}-${i}`} className="flex items-center justify-center">
                      <DayCell date={d} inMonth={inThisMonth} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 inset-x-0 mt-4">
        <div className="flex items-center gap-2 bg-white rounded-b-[20px] px-2 py-3">
          {["Exact dates", "± 1 day", "± 2 days", "± 3 days"].map((t, i) => (
            <button
              key={`pad-${i}`}
              className={["px-3 py-2 text-[13px] rounded-full border", i === 0 ? "border-black text-black" : "border-[#DDDDDD] text-[#222222]"].join(" ")}
              onClick={() => console.debug("[DatesPanel] padding option:", t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}