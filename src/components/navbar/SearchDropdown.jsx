import React, { useEffect, useMemo, useState, useRef } from "react";
import Button from "../common/Button";
import {
  X,
  MapPin,
  Building2,
  Landmark,
  Mountain,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

// Helpers
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const addMonths = (d, m) => new Date(d.getFullYear(), d.getMonth() + m, 1);
const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const isBetween = (x, s, e) =>
  s && e && x.getTime() > s.getTime() && x.getTime() < e.getTime();

const SUGGESTIONS = [
  {
    id: "nearby",
    name: "Nearby",
    tagline: "Find what’s around you",
    icon: <MapPin className="h-6 w-6 text-[#0074CC]" />,
  },
  {
    id: "toronto",
    name: "Toronto, Canada",
    tagline: "For sights like CN Tower",
    icon: <Building2 className="h-6 w-6 text-[#0074CC]" />,
  },
  {
    id: "bangkok",
    name: "Bangkok, Thailand",
    tagline: "For its bustling nightlife",
    icon: <Landmark className="h-6 w-6 text-[#0074CC]" />,
  },
  {
    id: "london",
    name: "London, United Kingdom",
    tagline: "For its stunning architecture",
    icon: <Landmark className="h-6 w-6 text-[#0074CC]" />,
  },
  {
    id: "nyc",
    name: "New York, NY",
    tagline: "For its top-notch dining",
    icon: <Landmark className="h-6 w-6 text-[#0074CC]" />,
  },
  {
    id: "vancouver",
    name: "Vancouver, Canada",
    tagline: "For nature-lovers",
    icon: <Mountain className="h-6 w-6 text-[#0074CC]" />,
  },
  {
    id: "calgary",
    name: "Calgary, Canada",
    tagline: "Known for its skiing",
    icon: <Mountain className="h-6 w-6 text-[#0074CC]" />,
  },
];

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

const Z_MODAL = 10000; // out-rank anything on the page

export default function SearchDropdown({
  open,
  active,
  anchorRef,
  value,
  onApply,
  onClose,
  onTabChange,
}) {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(value?.location || null);
  const [startDate, setStartDate] = useState(value?.checkIn || null);
  const [endDate, setEndDate] = useState(value?.checkOut || null);
  const [flex, setFlex] = useState(value?.flex || 0);
  const [offset, setOffset] = useState(0);
  const [dateTab, setDateTab] = useState("dates");
  const [guests, setGuests] = useState(
    value?.guests || { adults: 0, children: 0, infants: 0, pets: 0 }
  );

  useEffect(() => {
    if (open) {
      setShow(true);
      setQuery("");
      setLocation(value?.location || null);
      setStartDate(value?.checkIn || null);
      setEndDate(value?.checkOut || null);
      setFlex(value?.flex || 0);
      setOffset(0);
      setDateTab("dates");
      setGuests(
        value?.guests || { adults: 0, children: 0, infants: 0, pets: 0 }
      );
    } else {
      setShow(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const anchoredStyle = useMemo(() => {
    const el = anchorRef?.current;
    if (!el) return { zIndex: Z_MODAL };
    const rect = el.getBoundingClientRect();
    const gap = 16;
    const vpW = window.innerWidth;
    const pad = 16;
    const top = rect.bottom + gap;
    if (active === "where")
      return {
        position: "fixed",
        top,
        left: Math.max(pad, rect.left),
        zIndex: Z_MODAL,
      };
    if (active === "who")
      return {
        position: "fixed",
        top,
        right: Math.max(pad, vpW - rect.right),
        left: "auto",
        zIndex: Z_MODAL,
      };
    const center = rect.left + rect.width / 2;
    return {
      position: "fixed",
      top,
      left: center,
      transform: "translateX(-50%)",
      zIndex: Z_MODAL,
    };
  }, [anchorRef, active]);

  const today = useMemo(() => new Date(), []);
  const leftMonth = useMemo(
    () => addMonths(startOfMonth(today), offset),
    [today, offset]
  );
  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  const handleDayClick = (d) => {
    if (!d) return;
    const todayMid = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const dm = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (dm < todayMid) return;
    if (!startDate || (startDate && endDate)) {
      setStartDate(d);
      setEndDate(null);
      return;
    }
    if (dm < startDate) {
      setStartDate(d);
      return;
    }
    setEndDate(d);
  };

  const applyAndClose = () => {
    onApply?.({ location, startDate, endDate, guests, flex });
    onClose?.();
  };

  if (!open) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 transition-opacity ${
          show ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: Z_MODAL - 1 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Desktop */}
      <div style={anchoredStyle} className="hidden lg:block">
        <div
          className={[
            "relative w-[min(920px,calc(100vw-64px))] rounded-[32px] bg-white",
            "shadow-[0_6px_20px_rgba(0,0,0,0.2)] ring-1 ring-black/5",
            "transition-all duration-300",
            show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
            "px-8 pb-10 pt-6 overflow-hidden",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          <div className="mb-1 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-[#F7F7F7]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {(active === "checkin" ||
            active === "checkout" ||
            active === "when") && (
            <div className="mb-6 flex w-full items-center justify-center">
              <div
                role="tablist"
                aria-label="Date selection type"
                className="rounded-full bg-[#EBEBEB] p-1 shadow-sm"
              >
                {["dates", "months", "flexible"].map((t) => {
                  const isActive = dateTab === t;
                  return (
                    <button
                      key={t}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        setDateTab(t);
                        onTabChange?.(t);
                      }}
                      className={[
                        "px-8 py-3 text-[14px] font-medium rounded-full transition outline-none focus-visible:ring-2 focus-visible:ring-black/10",
                        isActive
                          ? "bg-white shadow-sm text-black font-semibold"
                          : "text-[#222222] hover:text-[#717171]",
                      ].join(" ")}
                    >
                      {t[0].toUpperCase() + t.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {active === "where" && (
            <WherePanel
              query={query}
              setQuery={setQuery}
              location={location}
              setLocation={setLocation}
            />
          )}

          {(active === "checkin" ||
            active === "checkout" ||
            active === "when") &&
            dateTab === "dates" && (
              <DatesPanel
                leftMonth={leftMonth}
                rightMonth={rightMonth}
                startDate={startDate}
                endDate={endDate}
                onDayClick={handleDayClick}
                flex={flex}
                setFlex={setFlex}
                setOffset={setOffset}
              />
            )}

          {(active === "checkin" ||
            active === "checkout" ||
            active === "when") &&
            dateTab === "months" && (
              <MonthsPanel
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
            )}

          {(active === "checkin" ||
            active === "checkout" ||
            active === "when") &&
            dateTab === "flexible" && (
              <FlexiblePanel
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
            )}

          {active === "who" && (
            <GuestsPanel guests={guests} setGuests={setGuests} />
          )}

          <div className="pointer-events-none absolute right-8 bottom-6">
            <div className="pointer-events-auto">
              <Button variant="primary" onClick={applyAndClose}>
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 block lg:hidden p-4 transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-6"
        }`}
        style={{ zIndex: Z_MODAL }}
      >
        <div className="max-h-[85vh] overflow-hidden rounded-[32px] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.15)] ring-1 ring-black/5 w-[min(920px,calc(100vw-64px))] mx-auto">
          <div className="flex items-center justify-between border-b border-[#EBEBEB] px-6 py-4">
            <div className="text-[15px] font-medium text-[#222222]">
              {active === "where"
                ? "Search destinations"
                : active === "who"
                ? "Guests"
                : "Select dates"}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {active === "where" && (
              <WherePanel
                query={query}
                setQuery={setQuery}
                location={location}
                setLocation={setLocation}
              />
            )}

            {(active === "checkin" ||
              active === "checkout" ||
              active === "when") && (
              <>
                <div className="mb-4 flex w-full items-center justify-center">
                  <div className="rounded-full bg-[#EBEBEB] p-1 shadow-sm">
                    {["dates", "months", "flexible"].map((t) => {
                      const isActive = dateTab === t;
                      return (
                        <button
                          key={t}
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => {
                            setDateTab(t);
                            onTabChange?.(t);
                          }}
                          className={[
                            "px-6 py-2.5 text-[14px] font-medium rounded-full transition outline-none focus-visible:ring-2 focus-visible:ring-black/10",
                            isActive
                              ? "bg-white shadow-sm text-black font-semibold"
                              : "text-[#222222] hover:text-[#717171]",
                          ].join(" ")}
                        >
                          {t[0].toUpperCase() + t.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {dateTab === "dates" && (
                  <DatesPanel
                    leftMonth={leftMonth}
                    rightMonth={null}
                    startDate={startDate}
                    endDate={endDate}
                    onDayClick={handleDayClick}
                    flex={flex}
                    setFlex={setFlex}
                    setOffset={setOffset}
                  />
                )}
                {dateTab === "months" && (
                  <MonthsPanel
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                  />
                )}
                {dateTab === "flexible" && (
                  <FlexiblePanel
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                  />
                )}
              </>
            )}

            {active === "who" && (
              <GuestsPanel guests={guests} setGuests={setGuests} />
            )}
          </div>

          <div className="flex items-center justify-end border-t border-[#EBEBEB] px-6 py-4">
            <Button variant="primary" onClick={applyAndClose}>
              Search
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/* Sub-panels */

function WherePanel({ query, setQuery, location, setLocation }) {
  const filtered = useMemo(() => {
    if (!query) return SUGGESTIONS;
    return SUGGESTIONS.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="w-full max-w-[520px]">
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search destinations"
        className="w-full rounded-2xl border border-[#DDDDDD] bg-white px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-black/10"
      />
      <div className="mt-4 text-[14px] font-semibold text-[#222222]">
        Suggested destinations
      </div>
      <div className="mt-2 max-h-[320px] overflow-auto pr-2">
        {filtered.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setLocation({ id: s.id, name: s.name })}
            className={[
              "w-full rounded-2xl px-3 py-2 transition text-left",
              "hover:bg-[#F7F7F7]",
              location?.id === s.id ? "ring-2 ring-black/10" : "",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F7F7]">
                {s.icon}
              </div>
              <div>
                <div className="text-[15px] font-medium text-[#222222]">
                  {s.name}
                </div>
                <div className="text-[14px] text-[#717171]">{s.tagline}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DatesPanel({
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
        <div className="mb-4 text-center text-[18px] font-semibold text-[#222222]">
          {label}
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center text-[12px] font-semibold uppercase text-[#717171]">
          {DAYS.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-y-1">
          {cells.map((d, i) => {
            const disabled = !d || d < todayMid;
            const start = d && startDate && isSameDay(d, startDate);
            const end = d && endDate && isSameDay(d, endDate);
            const between = d && startDate && endDate && isBetween(d, startDate, endDate);

            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => onDayClick(d)}
                className={[
                  "mx-auto my-1 flex h-12 w-12 items-center justify-center rounded-full text-[14px] transition",
                  disabled
                    ? "text-[#DDDDDD] cursor-not-allowed"
                    : "text-[#222222] hover:bg-[#F7F7F7]",
                  start || end ? "bg-black text-white hover:bg-black" : "",
                  !start && !end && between ? "bg-[#F7F7F7] text-black" : "",
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
    <div className="w-[min(920px,calc(100vw-64px))] overflow-x-hidden">
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {Month(leftMonth)}
        {rightMonth && <div className="hidden lg:block">{Month(rightMonth)}</div>}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {quick.map((d) => {
          const active = flex === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setFlex(d)}
              className={[
                "rounded-full border px-4 py-2 text-[14px] transition",
                active
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-[#B0B0B0] hover:border-[#717171]",
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

function MonthsPanel({ startDate, endDate, setStartDate, setEndDate }) {
  const [months, setMonths] = useState(3);

  const baseStart = useMemo(() => {
    if (startDate) return new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }, [startDate]);

  useEffect(() => {
    const s = baseStart;
    const e = new Date(s.getFullYear(), s.getMonth() + months, 1);
    setStartDate(s);
    setEndDate(e);
  }, [months, baseStart, setStartDate, setEndDate]);

  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const dialRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Unified angle system: 0deg at 12 o’clock (top), clockwise
  const START = 30;      // active arc starts 30deg from top
  const SWEEP = 300;     // total active arc length

  const toAngleFromCenterTop = (cx, cy, x, y) => {
    const rad = Math.atan2(y - cy, x - cx);
    let deg = (rad * 180) / Math.PI; // -180..180, 0 at 3 o'clock
    deg += 90; // move zero to 12 o'clock
    if (deg < 0) deg += 360;
    return deg; // 0..360, 0 at top
  };

  const onPointer = (e) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angleTop = toAngleFromCenterTop(cx, cy, e.clientX, e.clientY);
    let raw = ((angleTop - START + 360) % 360) / SWEEP;
    raw = clamp(raw, 0, 1);
    const snap = Math.max(1, Math.min(12, Math.round(raw * 12)));
    setMonths(snap);
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    onPointer(e);
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  };
  const onPointerUp = () => {
    setDragging(false);
    window.removeEventListener("pointermove", onPointer);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setMonths((m) => clamp(m + 1, 1, 12));
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setMonths((m) => clamp(m - 1, 1, 12));
    }
  };

  // Dynamic radius (keeps handle/dots aligned at any zoom/DPI)
  const handleSize = 40; // h-10 w-10
  const trackInset = 14;
  const [radius, setRadius] = useState(124);
  useEffect(() => {
    const update = () => {
      if (!dialRef.current) return;
      const w = dialRef.current.offsetWidth;
      const r = w / 2 - trackInset - handleSize / 2;
      setRadius(Math.max(60, r));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const angleFromTop = START + (months / 12) * SWEEP; // 0° at top
  const fmt = (d) =>
    new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);

  return (
    <div className="w-[min(920px,calc(100vw-64px))] min-h-[600px]">
      <div className="mb-6 text-center text-[18px] font-semibold text-[#222222]">
        When’s your trip?
      </div>

      <div
        ref={dialRef}
        className="mx-auto my-6 h-80 w-80 rounded-full relative flex items-center justify-center"
        role="slider"
        aria-label="Select number of months"
        aria-valuemin={1}
        aria-valuemax={12}
        aria-valuenow={months}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        style={{
          // from -90deg => 0deg at top
          background: `conic-gradient(from -90deg, #FF385C ${angleFromTop}deg, rgba(0,0,0,0.06) ${angleFromTop}deg)`,
          boxShadow:
            "inset 0 10px 25px rgba(0,0,0,.08), inset 0 -6px 12px rgba(0,0,0,.06), 0 2px 12px rgba(0,0,0,.06)",
        }}
      >
        <div className="pointer-events-none absolute -top-2 left-4 h-24 w-24 rounded-full bg-white/30 blur-xl" />

        <div className="h-40 w-40 rounded-full bg-white shadow-md flex items-center justify-center text-center">
          <div>
            <div className="text-4xl font-bold text-[#222222]">{months}</div>
            <div className="text-sm text-[#717171]">
              {months === 1 ? "month" : "months"}
            </div>
          </div>
        </div>

        {Array.from({ length: 12 }).map((_, i) => {
          const degFromTop = (i / 12) * 360;
          const rad = (degFromTop * Math.PI) / 180;
          const x = radius * Math.sin(rad);
          const y = -radius * Math.cos(rad);
          const darker = i <= months - 1;

          return (
            <span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
                backgroundColor: darker ? "#9CA3AF" : "#E5E7EB",
              }}
            />
          );
        })}

        <div
          className={[
            "absolute h-10 w-10 rounded-full bg-white shadow-md border-4 border-[#FF385C] transition-transform",
            dragging ? "cursor-grabbing" : "cursor-grab",
          ].join(" ")}
          // CSS transform angles are 0deg at 3 o’clock; convert by -90
          style={{
            transform: `rotate(${angleFromTop - 90}deg) translate(${radius}px) rotate(-${
              angleFromTop - 90
            }deg)`,
          }}
        />
      </div>

      <div className="mt-8 text-center text-[15px] text-[#222222]">
        <span className="underline">{fmt(startDate || baseStart)}</span>
        <span className="mx-2 text-[#717171]">to</span>
        <span className="underline">
          {fmt(
            endDate ||
              new Date(baseStart.getFullYear(), baseStart.getMonth() + months, 1)
          )}
        </span>
      </div>
    </div>
  );
}

function FlexiblePanel({ setStartDate, setEndDate }) {
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

function GuestsPanel({ guests, setGuests }) {
  const rows = [
    { key: "adults", title: "Adults", sub: "Ages 13 or above" },
    { key: "children", title: "Children", sub: "Ages 2–12" },
    { key: "infants", title: "Infants", sub: "Under 2" },
    { key: "pets", title: "Pets", sub: <span className="underline">Bringing a service animal?</span> },
  ];

  const update = (key, delta) =>
    setGuests((g) => ({ ...g, [key]: Math.max(0, (g[key] || 0) + delta) }));

  return (
    <div className="w-[min(520px,calc(100vw-64px))]">
      <div className="divide-y divide-[#EBEBEB]">
        {rows.map((r) => {
          const count = guests[r.key] || 0;
          return (
            <div key={r.key} className="flex items-center justify-between py-6">
              <div>
                <div className="text-[16px] font-semibold text-[#222222]">
                  {r.title}
                </div>
                <div className="text-[14px] text-[#717171]">{r.sub}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => update(r.key, -1)}
                  disabled={count === 0}
                  className={[
                    "inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white",
                    count === 0
                      ? "border-[#EBEBEB] text-[#B0B0B0]"
                      : "border-[#B0B0B0] text-[#222222] hover:border-[#717171]",
                  ].join(" ")}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-8 text-center text-[16px]">{count}</div>
                <button
                  type="button"
                  onClick={() => update(r.key, +1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#B0B0B0] bg-white text-[#222222] hover:border-[#717171]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}