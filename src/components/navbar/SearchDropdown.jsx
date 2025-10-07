import React, { useEffect, useMemo, useState } from "react";
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

/**
 * Props:
 * - open: boolean
 * - active: 'where' | 'checkin' | 'checkout' | 'who' | null
 * - anchorRef: ref to SearchBar container
 * - value: { location, checkIn, checkOut, guests, flex }
 * - onApply: (partial) => void
 * - onClose: () => void
 */

const SUGGESTIONS = [
  { id: "nearby", name: "Nearby", tagline: "Find what’s around you", icon: <MapPin className="h-6 w-6 text-[#0074CC]" /> },
  { id: "toronto", name: "Toronto, Canada", tagline: "For sights like CN Tower", icon: <Building2 className="h-6 w-6 text-[#0074CC]" /> },
  { id: "bangkok", name: "Bangkok, Thailand", tagline: "For its bustling nightlife", icon: <Landmark className="h-6 w-6 text-[#0074CC]" /> },
  { id: "london", name: "London, United Kingdom", tagline: "For its stunning architecture", icon: <Landmark className="h-6 w-6 text-[#0074CC]" /> },
  { id: "nyc", name: "New York, NY", tagline: "For its top-notch dining", icon: <Landmark className="h-6 w-6 text-[#0074CC]" /> },
  { id: "vancouver", name: "Vancouver, Canada", tagline: "For nature-lovers", icon: <Mountain className="h-6 w-6 text-[#0074CC]" /> },
  { id: "calgary", name: "Calgary, Canada", tagline: "Known for its skiing", icon: <Mountain className="h-6 w-6 text-[#0074CC]" /> },
];

// date helpers
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
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);
  return cells;
}

export default function SearchDropdown({
  open,
  active,
  anchorRef,
  value,
  onApply,
  onClose,
  onTabChange, // NEW
}) {
  const [show, setShow] = useState(false);
  // local edit state
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(value?.location || null);
  const [startDate, setStartDate] = useState(value?.checkIn || null);
  const [endDate, setEndDate] = useState(value?.checkOut || null);
  const [flex, setFlex] = useState(value?.flex || 0);
  const [offset, setOffset] = useState(0);
  const [dateTab, setDateTab] = useState("dates"); // dates | months | flexible
  const [guests, setGuests] = useState(value?.guests || { adults: 0, children: 0, infants: 0, pets: 0 });

  // open/close lifecycle
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
      setGuests(value?.guests || { adults: 0, children: 0, infants: 0, pets: 0 });
    } else {
      setShow(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // anchored position for desktop — align under active section
  const anchoredStyle = useMemo(() => {
    const el = anchorRef?.current;
    if (!el) return {};
    const rect = el.getBoundingClientRect();
    const gap = 12; // 12–16px gap
    const vpW = window.innerWidth;
    const pad = 16;
    const top = rect.bottom + gap; // fixed coords (no scrollY)

    if (active === "where") {
      return { position: "fixed", top, left: Math.max(pad, rect.left), zIndex: 110 };
    }
    if (active === "who") {
      return { position: "fixed", top, right: Math.max(pad, vpW - rect.right), left: "auto", zIndex: 110 };
    }
    // Center for checkin/checkout/when
    const center = rect.left + rect.width / 2;
    return { position: "fixed", top, left: center, transform: "translateX(-50%)", zIndex: 110 };
  }, [anchorRef, active]);

  // calendar plumbing
  const today = useMemo(() => new Date(), []);
  const leftMonth = useMemo(() => addMonths(startOfMonth(today), offset), [today, offset]);
  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  const handleDayClick = (d) => {
    if (!d) return;
    const t0 = new Date(today); t0.setHours(0,0,0,0);
    const dm = new Date(d); dm.setHours(0,0,0,0);
    if (dm < t0) return;

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

  const applyAndClose = () => {
    onApply?.({
      location,
      startDate,
      endDate,
      guests,
      flex,
    });
    onClose?.();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/20 transition-opacity ${show ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile full-screen sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[100] block lg:hidden p-4 transition-transform duration-250 ${
          show ? "translate-y-0" : "translate-y-6"
        }`}
      >
        <div className="max-h-[85vh] overflow-hidden rounded-[32px] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.15)]">
          <Header onClose={onClose} active={active} />

          <div className="p-6">
            {active === "where" && (
              <WherePanel
                query={query}
                setQuery={setQuery}
                location={location}
                setLocation={setLocation}
              />
            )}
              {(active === "checkin" || active === "checkout" || active === "when") && dateTab === "dates" && (
              <DatesPanel
                dateTab={dateTab}
                setDateTab={setDateTab}
                leftMonth={leftMonth}
                rightMonth={rightMonth}
                handleDayClick={handleDayClick}
                startDate={startDate}
                endDate={endDate}
                flex={flex}
                setFlex={setFlex}
                offset={offset}
                setOffset={setOffset}
              />
            )}
              {(active === "checkin" || active === "checkout" || active === "when") && dateTab === "months" && (
                <MonthsPanel
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                />
              )}
              {(active === "checkin" || active === "checkout" || active === "when") && dateTab === "flexible" && (
                <FlexiblePanel setStartDate={setStartDate} setEndDate={setEndDate} />
              )}
            {active === "who" && <GuestsPanel guests={guests} setGuests={setGuests} />}
          </div>

          <Footer onApply={applyAndClose} onClose={onClose} />
        </div>
      </div>

      {/* Desktop anchored card */}
      <div className="hidden lg:block" style={anchoredStyle}>
        <div
          className={`w-[min(850px,calc(100vw-48px))] rounded-[32px] bg-white p-8 shadow-[0_8px_28px_rgba(0,0,0,0.15)] ring-1 ring-black/5 transition-all ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header: tabs (left) + close (right). Tabs show for checkin/checkout/when */}
          <div className="mb-3 flex items-center justify-between">
            {(active === "checkin" || active === "checkout" || active === "when") && (
              <div role="tablist" aria-label="Date selection type" className="rounded-full bg-[#EBEBEB] p-1 shadow-sm">
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
                        "px-7 py-3 text-[14px] font-medium rounded-full transition outline-none focus-visible:ring-2 focus-visible:ring-black/10",
                        isActive ? "bg-white shadow-sm text-black font-semibold" : "text-[#222222] hover:text-[#717171]",
                      ].join(" ")}
                    >
                      {t[0].toUpperCase() + t.slice(1)}
                    </button>
                  );
                })}
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-[#F7F7F7]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {active === "where" && (
            <WherePanel
              query={query}
              setQuery={setQuery}
              location={location}
              setLocation={setLocation}
            />
          )}

          {(active === "checkin" || active === "checkout") && (
            <DatesPanel
              dateTab={dateTab}
              setDateTab={setDateTab}
              leftMonth={leftMonth}
              rightMonth={rightMonth}
              handleDayClick={handleDayClick}
              startDate={startDate}
              endDate={endDate}
              flex={flex}
              setFlex={setFlex}
              offset={offset}
              setOffset={setOffset}
            />
          )}

          {active === "who" && <GuestsPanel guests={guests} setGuests={setGuests} />}

          <div className="mt-6 flex items-center justify-end">
            <Button variant="primary" onClick={applyAndClose}>
              Search
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/* Subcomponents */

function Header({ onClose, active }) {
  const title =
    active === "where"
      ? "Search destinations"
      : active === "who"
      ? "Guests"
      : "Select dates";
  return (
    <div className="flex items-center justify-between border-b border-[#EBEBEB] px-6 py-4">
      <div className="text-[15px] font-medium text-[#222222]">{title}</div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

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
              "w-full rounded-2xl px-3 py-2 transition",
              "hover:bg-[#F7F7F7] text-left",
              location?.id === s.id ? "ring-2 ring-black/10" : "",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F7F7]">
                {s.icon}
              </div>
              <div>
                <div className="text-[15px] font-medium text-[#222222]">{s.name}</div>
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
  handleDayClick,
  startDate,
  endDate,
  flex,
  setFlex,
  setOffset,
}) {
  const FLEX = [0, 1, 2, 3, 7, 14];

  return (
    <div className="w-full">
      {/* Month navigation */}
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
        {renderCalendar(leftMonth, { startDate, endDate, handleDayClick })}
        <div className="hidden lg:block">
          {renderCalendar(rightMonth, { startDate, endDate, handleDayClick })}
        </div>
      </div>

      {/* Quick select */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {FLEX.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setFlex(d)}
            className={[
              "rounded-full border px-5 py-2 text-[13.5px] transition",
              d === flex
                ? "border-black bg-black text-white"
                : "border-[#DDDDDD] bg-white text-[#222222] hover:bg-[#F7F7F7]",
            ].join(" ")}
          >
            {d === 0 ? "Exact dates" : `± ${d} ${d === 1 ? "day" : "days"}`}
          </button>
        ))}
      </div>
    </div>
  );
}

function renderCalendar(monthDate, { startDate, endDate, handleDayClick }) {
  const cells = monthMatrix(monthDate);
  const label = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(monthDate);
  const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="w-full">
      <div className="mb-3 text-center text-[16px] font-semibold text-[#222222]">{label}</div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-[12px] uppercase text-[#717171]">
        {DAYS.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          const disabled = !d || d < new Date(new Date().setHours(0,0,0,0));
          const start = d && startDate && isSameDay(d, startDate);
          const end = d && endDate && isSameDay(d, endDate);
          const between = d && startDate && endDate && isBetween(d, startDate, endDate);

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(d)}
              className={[
                "mx-auto my-1 flex h-11 w-11 items-center justify-center rounded-full text-[14px] transition",
                disabled ? "text-[#DDDDDD] cursor-default" : "text-black hover:bg-[#F7F7F7]",
                start || end ? "bg-black text-white hover:bg-black" : "",
                !start && !end && between ? "bg-[#FF385C]/10 text-black" : "",
              ].join(" ")}
            >
              {d ? d.getDate() : ""}
            </button>
          );
        })}
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

  const update = (key, delta) => {
    setGuests((g) => {
      const next = { ...g, [key]: Math.max(0, (g[key] || 0) + delta) };
      return next;
    });
  };

  return (
    <div className="w-full max-w-[520px]">
      <div className="divide-y divide-[#EBEBEB]">
        {rows.map((r, idx) => {
          const count = guests[r.key] || 0;
          return (
            <div key={r.key} className={`flex items-center justify-between py-5 ${idx !== rows.length - 1 ? "" : ""}`}>
              <div>
                <div className="text-[16px] font-semibold text-[#222222]">{r.title}</div>
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
                  aria-label={`Decrease ${r.title}`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-8 text-center text-[16px]">{count}</div>
                <button
                  type="button"
                  onClick={() => update(r.key, +1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#B0B0B0] bg-white text-[#222222] hover:border-[#717171]"
                  aria-label={`Increase ${r.title}`}
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

function Footer({ onApply, onClose }) {
  return (
    <div className="flex items-center justify-between border-t border-[#EBEBEB] px-6 py-4">
      <button
        type="button"
        onClick={onClose}
        className="rounded-full px-4 py-2 text-[14px] font-medium text-[#222222] hover:bg-[#F7F7F7]"
      >
        Cancel
      </button>
      <Button variant="primary" onClick={onApply}>
        Search
      </Button>
    </div>
  );
}

function MonthsPanel({ startDate, endDate, setStartDate, setEndDate }) {
  const [months, setMonths] = useState(3);
  const nextMonthStart = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }, []);

  useEffect(() => {
    const s = nextMonthStart;
    const e = new Date(s.getFullYear(), s.getMonth() + months, 1);
    setStartDate(s);
    setEndDate(e);
  }, [months, nextMonthStart, setStartDate, setEndDate]);

  const angle = (months / 12) * 300 + 30;
  const fmt = (d) =>
    new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(d || new Date());

  return (
    <div className="w-[min(920px,calc(100vw-64px))] min-h-[600px]">
      <div className="mb-6 text-center text-[18px] font-semibold text-[#222222]">When’s your trip?</div>
      <div
        className="mx-auto my-6 h-80 w-80 rounded-full shadow-inner relative flex items-center justify-center"
        style={{ background: `conic-gradient(#FF385C ${angle}deg, rgba(0,0,0,0.06) ${angle}deg)` }}
      >
        <div className="h-40 w-40 rounded-full bg-white shadow-md flex items-center justify-center text-center">
          <div>
            <div className="text-4xl font-bold text-[#222222]">{months}</div>
            <div className="text-sm text-[#717171]">months</div>
          </div>
        </div>
        <div
          className="absolute h-9 w-9 rounded-full bg-white shadow-md border-4 border-[#FF385C] transition-transform"
          style={{ transform: `rotate(${angle}deg) translate(125px) rotate(-${angle}deg)` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-center gap-3">
        <button type="button" onClick={() => setMonths((m) => Math.max(1, m - 1))} className="rounded-full border border-[#DDDDDD] px-4 py-2 text-[14px] hover:bg-[#F7F7F7]">−</button>
        <button type="button" onClick={() => setMonths((m) => Math.min(12, m + 1))} className="rounded-full border border-[#DDDDDD] px-4 py-2 text-[14px] hover:bg-[#F7F7F7]">+</button>
      </div>
      <div className="mt-8 text-center text-[15px] text-[#222222]">
        <span className="underline">{fmt(startDate)}</span>
        <span className="mx-2 text-[#717171]">to</span>
        <span className="underline">{fmt(endDate)}</span>
      </div>
    </div>
  );
}

function FlexiblePanel({ setStartDate, setEndDate }) {
  const [length, setLength] = useState("weekend");
  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      return { id: i, date: d, label: new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(d) };
    });
  }, []);

  const choose = (d) => {
    const s = new Date(d.getFullYear(), d.getMonth(), 1);
    const nights = length === "weekend" ? 2 : length === "week" ? 7 : 30;
    const e = new Date(s);
    e.setDate(e.getDate() + nights);
    setStartDate(s);
    setEndDate(e);
  };

  return (
    <div className="w-[min(920px,calc(100vw-64px))] min-h-[600px]">
      <div className="mb-8 text-center text-[24px] font-bold text-[#222222]">How long would you like to stay?</div>
      <div className="mb-8 flex items-center justify-center gap-3">
        { ["weekend","week","month"].map((key) => {
          const label = key === "weekend" ? "Weekend" : key[0].toUpperCase() + key.slice(1);
          const active = length === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setLength(key)}
              className={[
                "rounded-full border px-7 py-3 text-[16px] transition",
                active ? "bg-black text-white border-black" : "bg-white text-black border-[#B0B0B0] hover:border-[#222222] hover:shadow",
              ].join(" ")}
            >
              {label}
            </button>
          );
        }) }
      </div>

      <div className="mb-6 text-center text-[24px] font-bold text-[#222222]">Go anytime</div>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {months.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => choose(m.date)}
              className="w-[140px] h-[160px] shrink-0 rounded-[16px] border border-[#DDDDDD] bg-white p-7 text-center transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-[4px] hover:border-black"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F7F7]">
                <Calendar className="h-6 w-6 text-[#717171]" />
              </div>
              <div className="text-[17px] font-bold text-[#222222]">{m.label.split(" ")[0]}</div>
              <div className="text-[14px] text-[#717171]">{m.label.split(" ").slice(1).join(" ")}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}