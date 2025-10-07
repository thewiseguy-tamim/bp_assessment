import React, { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../common/Button";

/**
 * DatePickerModal
 * - 2 months on desktop, 1 on mobile
 * - Range selection with highlight
 * - Quick filters: Exact, ±1, ±2, ±3, ±7, ±14 days
 * - Clear button, today indication
 *
 * Props:
 * - open: boolean
 * - startDate?: Date|null
 * - endDate?: Date|null
 * - flex?: number (0,1,2,3,7,14)
 * - onClose: () => void
 * - onApply: ({ startDate, endDate, flex }) => void
 */

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const addMonths = (d, m) => new Date(d.getFullYear(), d.getMonth() + m, 1);
const isSameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const isBefore = (a, b) => a && b && a.getTime() < b.getTime();
const isBetween = (x, s, e) => s && e && x.getTime() > s.getTime() && x.getTime() < e.getTime();

function monthMatrix(monthDate) {
  const first = startOfMonth(monthDate);
  const startWeekday = first.getDay();
  const totalDays = endOfMonth(monthDate).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) {
    cells.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);
  return cells;
}

export default function DatePickerModal({
  open,
  startDate: startProp = null,
  endDate: endProp = null,
  flex: flexProp = 0,
  onClose,
  onApply,
}) {
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(startProp);
  const [endDate, setEndDate] = useState(endProp);
  const [flex, setFlex] = useState(flexProp);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (open) {
      setShow(true);
      setStartDate(startProp);
      setEndDate(endProp);
      setFlex(flexProp);
      setOffset(0);
    } else {
      setShow(false);
    }
  }, [open, startProp, endProp, flexProp]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const today = new Date();
  const leftMonth = useMemo(() => addMonths(startOfMonth(today), offset), [today, offset]);
  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  const handleClickDay = (d) => {
    if (!d) return;
    const dMid = new Date(d); dMid.setHours(0,0,0,0);
    const tMid = new Date(today); tMid.setHours(0,0,0,0);
    if (dMid < tMid) return; // disable past
    if (!startDate || (startDate && endDate)) {
      setStartDate(d);
      setEndDate(null);
      return;
    }
    if (isBefore(d, startDate)) {
      setStartDate(d);
      return;
    }
    setEndDate(d);
  };

  const clear = () => {
    setStartDate(null);
    setEndDate(null);
    setFlex(0);
  };

  const apply = () => onApply?.({ startDate, endDate, flex });

  if (!open) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-black/30 transition-opacity ${
          show ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Mobile full-screen */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[75] block lg:hidden p-4 transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-6"
        }`}
      >
        <div className="max-h-[85vh] overflow-hidden rounded-3xl bg-white shadow-xl">
          <Header onClose={onClose} />

          <div className="p-4">
            <CalendarGrid
              leftMonth={leftMonth}
              rightMonth={null}
              today={today}
              startDate={startDate}
              endDate={endDate}
              onClickDay={handleClickDay}
              onPrev={() => setOffset((v) => Math.max(0, v - 1))}
              onNext={() => setOffset((v) => v + 1)}
            />

            <QuickFlex flex={flex} setFlex={setFlex} onClear={clear} />
          </div>

          <Footer onClear={clear} onApply={apply} />
        </div>
      </div>

      {/* Desktop centered */}
      <div className="fixed inset-0 z-[75] hidden items-center justify-center p-6 lg:flex">
        <div
          className={`w-full max-w-[960px] rounded-3xl bg-white shadow-xl ring-1 ring-black/5 transition-all ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <Header onClose={onClose} />

          <div className="px-4 pb-4">
            <CalendarGrid
              leftMonth={leftMonth}
              rightMonth={rightMonth}
              today={today}
              startDate={startDate}
              endDate={endDate}
              onClickDay={handleClickDay}
              onPrev={() => setOffset((v) => Math.max(0, v - 1))}
              onNext={() => setOffset((v) => v + 1)}
            />

            <QuickFlex flex={flex} setFlex={setFlex} onClear={clear} />
          </div>

          <div className="flex items-center justify-between border-t border-[#EEEEEE] px-4 py-3">
            <button
              type="button"
              onClick={clear}
              className="text-[15px] font-medium underline"
            >
              Clear dates
            </button>
            <Button variant="primary" onClick={apply}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function Header({ onClose }) {
  return (
    <div className="flex items-center justify-between border-b border-[#EEEEEE] px-4 py-3">
      <div className="text-[15px] font-medium text-[#222222]">Select dates</div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function CalendarGrid({
  leftMonth,
  rightMonth,
  today,
  startDate,
  endDate,
  onClickDay,
  onPrev,
  onNext,
}) {
  const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
  const months = [leftMonth, rightMonth].filter(Boolean);

  const renderMonth = (month) => {
    const cells = monthMatrix(month);
    const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(month);
    const todayMid = new Date(today); todayMid.setHours(0,0,0,0);

    return (
      <div key={month.toISOString()} className="w-full">
        <div className="mb-3 text-[15px] font-medium text-[#222222]">{monthLabel}</div>

        <div className="grid grid-cols-7 gap-y-2 text-center text-[12px] text-[#717171]">
          {DAY_LABELS.map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-y-1">
          {cells.map((d, idx) => {
            const dMid = d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;
            const isPast = dMid ? dMid < todayMid : false;
            const isStart = d && startDate && dMid && dMid.getTime() === new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
            const isEnd = d && endDate && dMid && dMid.getTime() === new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
            const inRange = d && startDate && endDate && dMid > new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) && dMid < new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            const isToday = dMid && dMid.getTime() === todayMid.getTime();

            return (
              <button
                key={idx}
                type="button"
                disabled={!d || isPast}
                onClick={() => onClickDay(d)}
                className={[
                  "mx-auto my-1 flex h-9 w-9 items-center justify-center rounded-full text-[13px] transition",
                  !d || isPast ? "text-neutral-300 cursor-default" : "hover:bg-black/5",
                  isStart || isEnd ? "bg-[#222222] text-white hover:bg-[#222222]" : "",
                  !isStart && !isEnd && inRange ? "bg-[#FF385C]/10 text-[#222222]" : "",
                  isToday && !isStart && !isEnd && !inRange ? "ring-1 ring-[#222222]/30" : "",
                ].join(" ")}
              >
                {d ? d.getDate() : ""}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="grow" />
        <button
          type="button"
          onClick={onNext}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {months.map(renderMonth)}
      </div>
    </>
  );
}

function QuickFlex({ flex, setFlex, onClear }) {
  const options = [0, 1, 2, 3, 7, 14];
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {options.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => setFlex(d)}
          className={`rounded-full border px-3 py-1.5 text-[13px] ${
            flex === d
              ? "border-black bg-white text-[#222222]"
              : "border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7]"
          }`}
        >
          {d === 0 ? "Exact dates" : `± ${d} ${d === 1 ? "day" : "days"}`}
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="ml-auto text-[13px] font-medium underline"
      >
        Clear dates
      </button>
    </div>
  );
}

function Footer({ onClear, onApply }) {
  return (
    <div className="flex items-center justify-between border-t border-[#EEEEEE] px-4 py-3">
      <button
        type="button"
        onClick={onClear}
        className="text-[15px] font-medium underline"
      >
        Clear dates
      </button>
      <Button variant="primary" onClick={onApply}>
        Save
      </Button>
    </div>
  );
}