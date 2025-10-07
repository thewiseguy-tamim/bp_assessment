import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "../common/Button";
import {
  X,
  MapPin,
  Building2,
  Landmark,
  Mountain,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * SearchDropdown
 * - Mobile: full-screen slide-up
 * - Desktop: anchored card below the search bar, fade/scale in
 * - Panels: "where", "dates", "who"
 * - Dates panel includes tabs (Dates/Months/Flexible), 2 months on desktop
 *
 * Props:
 * - open: boolean
 * - panel: "where" | "dates" | "who"
 * - anchorRef: ref of SearchBar container (for desktop positioning)
 * - value: { location, startDate, endDate, guests }
 * - onApply: (partialUpdate) => void
 * - onClose: () => void
 */

const SUGGESTIONS = [
  {
    id: "nearby",
    name: "Nearby",
    tagline: "Find what’s around you",
    icon: <MapPin className="h-6 w-6 text-[#717171]" />,
  },
  {
    id: "toronto",
    name: "Toronto, Canada",
    tagline: "For sights like CN Tower",
    icon: <Building2 className="h-6 w-6 text-[#717171]" />,
  },
  {
    id: "bangkok",
    name: "Bangkok, Thailand",
    tagline: "For its bustling nightlife",
    icon: <Landmark className="h-6 w-6 text-[#717171]" />,
  },
  {
    id: "london",
    name: "London, United Kingdom",
    tagline: "For its stunning architecture",
    icon: <Landmark className="h-6 w-6 text-[#717171]" />,
  },
  {
    id: "nyc",
    name: "New York, NY",
    tagline: "For its top-notch dining",
    icon: <Landmark className="h-6 w-6 text-[#717171]" />,
  },
  {
    id: "vancouver",
    name: "Vancouver, Canada",
    tagline: "For nature-lovers",
    icon: <Mountain className="h-6 w-6 text-[#717171]" />,
  },
  {
    id: "calgary",
    name: "Calgary, Canada",
    tagline: "Known for its skiing",
    icon: <Mountain className="h-6 w-6 text-[#717171]" />,
  },
];

// Utility: dates
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d, m) => new Date(d.getFullYear(), d.getMonth() + m, 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const isSameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const isBefore = (a, b) => a && b && a.getTime() < b.getTime();
const isAfter = (a, b) => a && b && a.getTime() > b.getTime();
const isBetween = (x, s, e) => s && e && x.getTime() > s.getTime() && x.getTime() < e.getTime();

function monthMatrix(monthDate) {
  const first = startOfMonth(monthDate);
  const startWeekday = first.getDay(); // 0-6
  const totalDays = endOfMonth(monthDate).getDate();
  const cells = [];
  // leading blanks
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  // days
  for (let d = 1; d <= totalDays; d++) {
    cells.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), d));
  }
  // trailing blanks to fill 6 rows
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);
  return cells;
}

export default function SearchDropdown({
  open,
  panel = "where",
  anchorRef,
  value,
  onApply,
  onClose,
}) {
  const [activePanel, setActivePanel] = useState(panel);
  const [show, setShow] = useState(false);

  // Local edit state
  const [location, setLocation] = useState(value?.location || null);
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState(value?.startDate || null);
  const [endDate, setEndDate] = useState(value?.endDate || null);
  const [flex, setFlex] = useState(0); // 0 exact, 1,2,3,7,14 days
  const [monthOffset, setMonthOffset] = useState(0);
  const [dateTab, setDateTab] = useState("dates"); // dates | months | flexible
  const [guests, setGuests] = useState(
    value?.guests || { adults: 0, children: 0, infants: 0, pets: 0 }
  );

  // Reset when opened
  useEffect(() => {
    if (open) {
      setActivePanel(panel);
      setShow(true);
      setLocation(value?.location || null);
      setQuery("");
      setStartDate(value?.startDate || null);
      setEndDate(value?.endDate || null);
      setFlex(0);
      setMonthOffset(0);
      setDateTab("dates");
      setGuests(
        value?.guests || { adults: 0, children: 0, infants: 0, pets: 0 }
      );
    } else {
      setShow(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Position (desktop)
  const anchoredStyle = useMemo(() => {
    if (!anchorRef?.current) return {};
    const rect = anchorRef.current.getBoundingClientRect();
    const top = rect.bottom + 12 + window.scrollY;
    const left = window.innerWidth / 2; // center align
    return {
      top,
      left,
      transform: "translateX(-50%)",
    };
  }, [anchorRef, open, show]);

  const applyAndClose = () => {
    onApply?.({
      location,
      startDate,
      endDate,
      guests,
      flex,
    });
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date();
  const leftMonth = useMemo(
    () => addMonths(startOfMonth(today), monthOffset),
    [today, monthOffset]
  );
  const rightMonth = useMemo(
    () => addMonths(leftMonth, 1),
    [leftMonth]
  );

  const renderCalendar = (monthDate) => {
    const cells = monthMatrix(monthDate);
    const isPast = (d) => d && d.setHours(0,0,0,0) < today.setHours(0,0,0,0);

    const handleClickDay = (d) => {
      if (!d || isPast(d)) return;
      if (!startDate || (startDate && endDate)) {
        setStartDate(d);
        setEndDate(null);
      } else if (isBefore(d, startDate)) {
        setStartDate(d);
      } else if (isSameDay(d, startDate)) {
        // allow single-day selection temporarily
        setEndDate(d);
      } else {
        setEndDate(d);
      }
    };

    const monthLabel = new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(monthDate);

    return (
      <div className="w-full">
        <div className="flex items-center justify-between px-2 mb-3">
          <div className="text-[15px] font-medium text-[#222222]">{monthLabel}</div>
        </div>

        <div className="grid grid-cols-7 gap-y-2 text-center text-[12px] text-[#717171]">
          {DAY_LABELS.map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-y-1">
          {cells.map((d, idx) => {
            const disabled = !d || isPast(d);
            const isStart = d && startDate && isSameDay(d, startDate);
            const isEnd = d && endDate && isSameDay(d, endDate);
            const inRange = d && startDate && endDate && isBetween(d, startDate, endDate);

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => handleClickDay(d)}
                className={[
                  "mx-auto my-1 flex h-9 w-9 items-center justify-center rounded-full text-[13px] transition",
                  disabled ? "text-neutral-300 cursor-default" : "hover:bg-black/5",
                  isStart || isEnd ? "bg-[#222222] text-white hover:bg-[#222222]" : "",
                  !isStart && !isEnd && inRange ? "bg-[#FF385C]/10 text-[#222222]" : "",
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

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity ${show ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 block lg:hidden p-4 transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-6"
        }`}
      >
        <div className="rounded-3xl bg-white shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEEEEE]">
            <div className="text-[15px] font-medium capitalize">{activePanel}</div>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-[#F7F7F7]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activePanel === "where" && (
              <WherePanel
                location={location}
                setLocation={setLocation}
                query={query}
                setQuery={setQuery}
              />
            )}
            {activePanel === "dates" && (
              <DatesPanel
                dateTab={dateTab}
                setDateTab={setDateTab}
                leftMonth={leftMonth}
                rightMonth={rightMonth}
                monthOffset={monthOffset}
                setMonthOffset={setMonthOffset}
                renderCalendar={renderCalendar}
                flex={flex}
                setFlex={setFlex}
                clearDates={clearDates}
              />
            )}
            {activePanel === "who" && (
              <GuestsPanel guests={guests} setGuests={setGuests} />
            )}
          </div>

          <div className="border-t border-[#EEEEEE] p-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (activePanel === "dates") clearDates();
                if (activePanel === "who")
                  setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
                if (activePanel === "where") {
                  setLocation(null);
                  setQuery("");
                }
              }}
              className="text-[15px] font-medium underline text-[#222222]"
            >
              Clear
            </button>
            <Button variant="primary" onClick={applyAndClose}>
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop anchored card */}
      <div
        className="hidden lg:block"
        style={{ position: "absolute", ...anchoredStyle, zIndex: 60 }}
      >
        <div
          className={`w-[min(980px,calc(100vw-48px))] rounded-3xl bg-white shadow-xl ring-1 ring-black/5 transition-all duration-200 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <TabButton
                active={activePanel === "where"}
                onClick={() => setActivePanel("where")}
                label="Where"
              />
              <TabButton
                active={activePanel === "dates"}
                onClick={() => setActivePanel("dates")}
                label="Dates"
              />
              <TabButton
                active={activePanel === "who"}
                onClick={() => setActivePanel("who")}
                label="Who"
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-[#F7F7F7]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 pb-4">
            {activePanel === "where" && (
              <WherePanel
                location={location}
                setLocation={setLocation}
                query={query}
                setQuery={setQuery}
              />
            )}

            {activePanel === "dates" && (
              <DatesPanel
                dateTab={dateTab}
                setDateTab={setDateTab}
                leftMonth={leftMonth}
                rightMonth={rightMonth}
                monthOffset={monthOffset}
                setMonthOffset={setMonthOffset}
                renderCalendar={renderCalendar}
                flex={flex}
                setFlex={setFlex}
                clearDates={clearDates}
              />
            )}

            {activePanel === "who" && (
              <GuestsPanel guests={guests} setGuests={setGuests} />
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-[#EEEEEE]">
            <button
              type="button"
              onClick={() => {
                if (activePanel === "dates") clearDates();
                if (activePanel === "who")
                  setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
                if (activePanel === "where") {
                  setLocation(null);
                  setQuery("");
                }
              }}
              className="text-[15px] font-medium underline text-[#222222]"
            >
              Clear
            </button>
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

function TabButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
        active ? "bg-black text-white" : "text-[#222222] hover:bg-[#F7F7F7]"
      }`}
    >
      {label}
    </button>
  );
}

function WherePanel({ location, setLocation, query, setQuery }) {
  const filtered = useMemo(() => {
    if (!query) return SUGGESTIONS;
    return SUGGESTIONS.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="w-full max-w-[520px]">
      <div className="relative">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations"
          className="w-full rounded-2xl border border-[#DDDDDD] bg-white px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      <div className="mt-4 text-[13px] font-medium text-[#717171]">
        Suggested destinations
      </div>

      <div className="mt-2 max-h-[300px] overflow-auto pr-2">
        {filtered.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setLocation({ id: s.id, name: s.name });
            }}
            className={`w-full rounded-2xl px-3 py-2 transition hover:bg-[#F7F7F7] ${
              location?.id === s.id ? "ring-2 ring-black/10" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F7F7]">
                {s.icon}
              </div>
              <div className="text-left">
                <div className="text-[15px] text-[#222222]">{s.name}</div>
                <div className="text-[13px] text-[#717171]">{s.tagline}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DatesPanel({
  dateTab,
  setDateTab,
  leftMonth,
  rightMonth,
  monthOffset,
  setMonthOffset,
  renderCalendar,
  flex,
  setFlex,
  clearDates,
}) {
  const FLEX_OPTS = [0, 1, 2, 3, 7, 14];

  return (
    <div className="w-full">
      {/* Tabs inside Dates */}
      <div className="mb-3 flex items-center gap-2">
        {["dates", "months", "flexible"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setDateTab(t)}
            className={`rounded-full px-3 py-1.5 text-[13px] font-medium capitalize ${
              dateTab === t ? "bg-black text-white" : "text-[#222222] hover:bg-[#F7F7F7]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {dateTab === "dates" && (
        <>
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonthOffset((v) => Math.max(0, v - 1))}
              className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="grow" />
            <button
              type="button"
              onClick={() => setMonthOffset((v) => v + 1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderCalendar(leftMonth)}
            <div className="hidden lg:block">{renderCalendar(rightMonth)}</div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {FLEX_OPTS.map((d) => (
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
              onClick={clearDates}
              className="ml-auto text-[13px] font-medium underline"
            >
              Clear dates
            </button>
          </div>
        </>
      )}

      {dateTab === "months" && (
        <div className="py-6 text-[#717171]">
          Coming soon: month-based selection. Use Dates tab meanwhile.
        </div>
      )}

      {dateTab === "flexible" && (
        <div className="py-6 text-[#717171]">
          Coming soon: flexible options (Weekend, Week, Month).
        </div>
      )}
    </div>
  );
}

function GuestsPanel({ guests, setGuests }) {
  const rows = [
    { key: "adults", title: "Adults", sub: "Ages 13 or above" },
    { key: "children", title: "Children", sub: "Ages 2–12" },
    { key: "infants", title: "Infants", sub: "Under 2" },
    {
      key: "pets",
      title: "Pets",
      sub: (
        <span className="underline">
          Bringing a service animal?
        </span>
      ),
    },
  ];

  const update = (key, delta) => {
    setGuests((g) => {
      const next = { ...g, [key]: Math.max(0, (g[key] || 0) + delta) };
      return next;
    });
  };

  return (
    <div className="w-full max-w-[520px]">
      <div className="divide-y divide-[#EEEEEE] rounded-2xl border border-[#EEEEEE]">
        {rows.map((r) => {
          const count = guests[r.key] || 0;
          const disabledMinus = count === 0;
          return (
            <div key={r.key} className="flex items-center justify-between p-4">
              <div>
                <div className="text-[15px] text-[#222222]">{r.title}</div>
                <div className="text-[13px] text-[#717171]">{r.sub}</div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => update(r.key, -1)}
                  disabled={disabledMinus}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7] disabled:opacity-40"
                  aria-label={`Decrease ${r.title}`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-6 text-center text-[15px]">{count}</div>
                <button
                  type="button"
                  onClick={() => update(r.key, +1)}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7]"
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