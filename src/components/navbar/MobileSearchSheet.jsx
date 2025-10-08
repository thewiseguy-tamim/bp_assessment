import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Home,
  PartyPopper,
  ConciergeBell,
  Search as SearchIcon,
  MapPin,
  Building2,
  Landmark,
  Mountain,
  Minus,
  Plus,
} from "lucide-react";

/* Suggested destinations */
const SUGGESTIONS = [
  { id: "nearby", name: "Nearby", tagline: "Find what’s around you", icon: <MapPin className="h-6 w-6 text-[#0074CC]" /> },
  { id: "toronto", name: "Toronto, Canada", tagline: "For sights like CN Tower", icon: <Building2 className="h-6 w-6 text-[#0074CC]" /> },
  { id: "bangkok", name: "Bangkok, Thailand", tagline: "For its bustling nightlife", icon: <Landmark className="h-6 w-6 text-[#0074CC]" /> },
  { id: "london", name: "London, United Kingdom", tagline: "For its stunning architecture", icon: <Landmark className="h-6 w-6 text-[#0074CC]" /> },
  { id: "nyc", name: "New York, NY", tagline: "For its top-notch dining", icon: <Landmark className="h-6 w-6 text-[#0074CC]" /> },
  { id: "vancouver", name: "Vancouver, Canada", tagline: "For nature-lovers", icon: <Mountain className="h-6 w-6 text-[#0074CC]" /> },
  { id: "calgary", name: "Calgary, Canada", tagline: "Known for its skiing", icon: <Mountain className="h-6 w-6 text-[#0074CC]" /> },
];

/* Calendar helpers */
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const addMonths = (d, m) => new Date(d.getFullYear(), d.getMonth() + m, 1);
const isSameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
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

/* Force demo months to Oct/Nov 2025 to match your mock. Use new Date() for live behavior. */
const DEMO_TODAY = new Date(2025, 9, 5);

export default function MobileSearchSheet({ open, onClose }) {
  // Debug fingerprint
  useEffect(() => {
    console.log("MobileSearchSheet v10 mounted", { at: new Date().toISOString() });
  }, []);
  useEffect(() => {
    console.log("MobileSearchSheet v10 open:", open);
  }, [open]);

  const [active, setActive] = useState("who"); // 'where' | 'when' | 'who'
  const [dateTab, setDateTab] = useState("dates");

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });
  const [flexDays, setFlexDays] = useState(0); // 0 | 1 | 2 | 3

  const [offset, setOffset] = useState(0);
  const today = useMemo(() => DEMO_TODAY, []);
  const leftMonth = useMemo(() => addMonths(startOfMonth(today), offset), [today, offset]);
  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  // Stable onClose for Escape handler
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === "Escape" && onCloseRef.current?.();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const clearAll = () => {
    setQuery("");
    setLocation(null);
    setStartDate(null);
    setEndDate(null);
    setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
    setFlexDays(0);
    setDateTab("dates");
    setOffset(0);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1100] bg-white">
      {/* Top icons row (sticky) */}
      <div className="sticky top-0 z-[1110] bg-white px-4 pt-3 pb-2">
        <div className="mx-auto flex max-w-[560px] items-center justify-between">
          <div className="flex items-center gap-8">
            <TopIcon active label="Homes" icon={<Home className="h-6 w-6" />} />
            <TopIcon label="Experiences" icon={<PartyPopper className="h-6 w-6" />} />
            <TopIcon label="Services" icon={<ConciergeBell className="h-6 w-6" />} />
          </div>

          <div className="flex items-center gap-2">
            {/* Visible on mobile too (match mock) */}
            <button
              type="button"
              onClick={() => setLocation({ id: "flexible", name: "I'm flexible" })}
              className="inline-flex rounded-full border border-[#DDDDDD] px-3 py-1.5 text-[13px] font-medium text-[#222222] hover:bg-[#F7F7F7]"
            >
              I&apos;m flexible
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="relative h-[calc(100vh-136px)] overflow-auto px-4 pb-40">
        <div className="mx-auto w-full max-w-[560px]">
          {/* Where chip */}
          <SectionChip
            title="Where"
            value={location?.name || "I'm flexible"}
            active={active === "where"}
            onClick={() => setActive("where")}
          />
          {active === "where" && (
            <PanelCard className="mt-2">
              <WherePanel query={query} setQuery={setQuery} location={location} setLocation={setLocation} />
            </PanelCard>
          )}

          {/* When chip */}
          <SectionChip
            className="mt-3"
            title="When"
            value={startDate && endDate ? `${fmt(startDate)} – ${fmt(endDate)}` : "Add dates"}
            active={active === "when"}
            onClick={() => setActive("when")}
          />
          {active === "when" && (
            <PanelCard className="mt-2">
              <WhenPanel
                dateTab={dateTab}
                setDateTab={setDateTab}
                leftMonth={leftMonth}
                rightMonth={rightMonth}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                offset={offset}
                setOffset={setOffset}
                todayRef={today}
                flexDays={flexDays}
                setFlexDays={setFlexDays}
              />
            </PanelCard>
          )}

          {/* Who chip */}
          <SectionChip
            className="mt-3"
            title="Who"
            value={guestsSummary(guests) || "Add guests"}
            active={active === "who"}
            onClick={() => setActive("who")}
          />
          {active === "who" && (
            <PanelCard className="mt-2">
              <WhoPanel guests={guests} setGuests={setGuests} />
            </PanelCard>
          )}
        </div>
      </div>

      {/* Bottom action bar: absolute inside the full-screen sheet (robust vs transform wrappers) */}
      <div className="absolute bottom-0 left-0 right-0 z-[1120] border-t border-[#EBEBEB] bg-white/95 px-4 py-3 backdrop-blur supports-[padding:max(0px)]">
        <div className="mx-auto flex max-w-[560px] items-center justify-between">
          <button type="button" onClick={clearAll} className="text-[14px] underline text-[#222222]">
            Clear all
          </button>

          {active === "when" ? (
            <button
              type="button"
              onClick={() => setActive("who")}
              className="rounded-full bg-[#222222] px-5 py-3 text-[15px] font-semibold text-white shadow-md hover:bg-black"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full bg-[#E50063] px-5 py-3 text-[15px] font-semibold text-white shadow-md hover:bg-[#c30051]"
            >
              Search <SearchIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- UI building blocks ---------- */

function TopIcon({ active, icon, label }) {
  return (
    <div className="text-center">
      <div className="relative mx-auto">{icon}</div>
      <div className="mt-1 text-[12px] text-[#222222]">
        <span className={active ? "font-semibold" : ""}>{label}</span>
      </div>
      {active && <div className="mx-auto mt-1 h-[3px] w-10 rounded-full bg-black" />}
    </div>
  );
}

function SectionChip({ title, value, active, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between rounded-2xl border border-[#DDDDDD] bg-white px-4 py-3 text-left",
        active ? "shadow-[0_6px_20px_rgba(0,0,0,0.12)]" : "",
        "transition-all",
        className,
      ].join(" ")}
    >
      <span className="text-[16px] font-semibold text-[#222222]">{title}</span>
      <span className="text-[14px] text-[#717171]">{value}</span>
    </button>
  );
}

function PanelCard({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-2xl border border-[#EEEEEE] bg-white p-3 shadow-[0_20px_40px_rgba(0,0,0,0.15)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* ---------- Panels ---------- */

function WherePanel({ query, setQuery, location, setLocation }) {
  const filtered = useMemo(() => {
    if (!query) return SUGGESTIONS;
    return SUGGESTIONS.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div>
      <div className="mb-3 text-[18px] font-semibold text-[#222222]">Where?</div>

      <div className="rounded-xl border border-[#DDDDDD] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <SearchIcon className="h-5 w-5 text-[#717171]" />
          <input
            className="flex-1 bg-transparent outline-none text-[15px]"
            placeholder="Search destinations"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3 text-[13px] font-medium text-[#717171]">Suggested destinations</div>
      <div className="mt-2 max-h-[320px] overflow-auto pr-1">
        {filtered.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setLocation({ id: s.id, name: s.name })}
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-[#F7F7F7]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1F5F9]">{s.icon}</div>
            <div>
              <div className="text-[15px] text-[#222222]">{s.name}</div>
              <div className="text-[13px] text-[#717171]">{s.tagline}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function WhenPanel({
  dateTab,
  setDateTab,
  leftMonth,
  rightMonth,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  offset: _offset,
  setOffset,
  todayRef,
  flexDays,
  setFlexDays,
}) {
  return (
    <div>
      <div className="mb-2 text-[18px] font-semibold text-[#222222]">When?</div>

      <div className="mb-3 inline-flex rounded-full bg-[#EBEBEB] p-1">
        {["dates", "months", "flexible"].map((t) => (
          <button
            key={t}
            onClick={() => setDateTab(t)}
            className={[
              "rounded-full px-4 py-2 text-[14px] font-medium transition",
              dateTab === t ? "bg-white shadow-sm" : "text-[#222222] hover:text-[#717171]",
            ].join(" ")}
            aria-selected={dateTab === t}
            role="tab"
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {dateTab === "dates" && (
        <DatesCalendar
          leftMonth={leftMonth}
          rightMonth={rightMonth}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setOffset={setOffset}
          todayRef={todayRef}
        />
      )}

      {dateTab === "months" && <div className="py-10 text-center text-[#717171]">Months picker coming soon</div>}
      {dateTab === "flexible" && <div className="py-10 text-center text-[#717171]">Flexible options coming soon</div>}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {[0, 1, 2, 3].map((d) => {
          const active = d === flexDays;
          return (
            <button
              key={`flex-${d}`}
              type="button"
              onClick={() => setFlexDays(d)}
              className={[
                "rounded-full border px-3 py-1.5 text-[13px]",
                active ? "border-black text-[#222222]" : "border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7]",
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

function DatesCalendar({ leftMonth, rightMonth, startDate, endDate, setStartDate, setEndDate, setOffset, todayRef }) {
  const handleClickDay = (d) => {
    if (!d) return;
    const todayMid = new Date(todayRef.getFullYear(), todayRef.getMonth(), todayRef.getDate());
    const dm = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (dm < todayMid) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(d);
      setEndDate(null);
      setOffset((v) => v + 1);
      return;
    }
    if (d.getTime() <= startDate.getTime()) {
      setStartDate(d);
      setEndDate(null);
      setOffset((v) => v + 1);
      return;
    }
    setEndDate(d);
  };

  const MonthGrid = (monthDate) => {
    const days = monthMatrix(monthDate);
    const label = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(monthDate);
    const weekdays = [
      { key: "sun", label: "S" },
      { key: "mon", label: "M" },
      { key: "tue", label: "T" },
      { key: "wed", label: "W" },
      { key: "thu", label: "T" },
      { key: "fri", label: "F" },
      { key: "sat", label: "S" },
    ];
    const todayMid = new Date(todayRef.getFullYear(), todayRef.getMonth(), todayRef.getDate());

    return (
      <div className="mb-4 w-full">
        <div className="mb-2 text-center text-[16px] font-semibold text-[#222222]">{label}</div>
        <div className="grid grid-cols-7 gap-y-2 text-center text-[12px] font-semibold uppercase text-[#717171]">
          {weekdays.map((d, i) => (
            <div key={`${d.key}-${i}`}>{d.label}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-y-1">
          {days.map((d, idx) => {
            const disabled = !d || d < todayMid;
            const start = d && startDate && isSameDay(d, startDate);
            const end = d && endDate && isSameDay(d, endDate);
            const between = d && startDate && endDate && isBetween(d, startDate, endDate);

            return (
              <button
                key={idx}
                disabled={disabled}
                onClick={() => handleClickDay(d)}
                className={[
                  "mx-auto my-1 flex h-11 w-11 items-center justify-center rounded-full text-[14px] transition",
                  disabled ? "cursor-not-allowed text-[#DDDDDD]" : "text-[#222222] hover:bg-[#F7F7F7]",
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
    <div>
      {MonthGrid(leftMonth)}
      {MonthGrid(rightMonth)}
    </div>
  );
}

function WhoPanel({ guests, setGuests }) {
  const rows = [
    { key: "adults", title: "Adults", sub: "Ages 13 or above" },
    { key: "children", title: "Children", sub: "Ages 2 – 12" },
    { key: "infants", title: "Infants", sub: "Under 2" },
    { key: "pets", title: "Pets", sub: <span className="underline">Bringing a service animal?</span> },
  ];

  const update = (k, delta) => {
    setGuests((g) => ({ ...g, [k]: Math.max(0, (g[k] || 0) + delta) }));
  };

  return (
    <div>
      <div className="px-2 py-1 text-[18px] font-semibold text-[#222222]">Who?</div>
      <div className="rounded-2xl border border-[#EEEEEE] bg-white shadow">
        {rows.map((r, idx) => {
          const count = guests[r.key] || 0;
          return (
            <div
              key={r.key}
              className={[
                "flex items-center justify-between px-3 py-4",
                idx < rows.length - 1 ? "border-b border-[#EEEEEE]" : "",
              ].join(" ")}
            >
              <div>
                <div className="text-[15px] text-[#222222]">{r.title}</div>
                <div className="text-[13px] text-[#717171]">{r.sub}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={`Decrease ${r.title}`}
                  onClick={() => update(r.key, -1)}
                  disabled={count === 0}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#DDDDDD] bg-white text-[#222222] hover:border-[#717171] disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-6 text-center text-[15px]">{count}</div>
                <button
                  type="button"
                  aria-label={`Increase ${r.title}`}
                  onClick={() => update(r.key, +1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#DDDDDD] bg-white text-[#222222] hover:border-[#717171]"
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

/* Helpers */
function fmt(d) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(d);
}
function guestsSummary(g) {
  const total = (g.adults || 0) + (g.children || 0);
  const parts = [];
  if (total > 0) parts.push(`${total} ${total === 1 ? "guest" : "guests"}`);
  if (g.infants) parts.push(`${g.infants} ${g.infants === 1 ? "infant" : "infants"}`);
  if (g.pets) parts.push(`${g.pets} ${g.pets === 1 ? "pet" : "pets"}`);
  return parts.join(", ");
}