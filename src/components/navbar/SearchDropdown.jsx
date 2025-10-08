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
} from "lucide-react";
import DatesPanel from "./panels/DatesPanel";
import MonthsPanel from "./panels/MonthsPanel";
import FlexiblePanel from "./panels/FlexiblePanel";

const Z_MODAL = 10000;

// Month helpers used HERE (do not pass null to DatesPanel)
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d, m) => new Date(d.getFullYear(), d.getMonth() + m, 1);

const SUGGESTIONS = [
  { id: "nearby", name: "Nearby", tagline: "Find what’s around you", icon: <MapPin className="h-6 w-6 text-[#0074CC]" /> },
  { id: "toronto", name: "Toronto, Canada", tagline: "For sights like CN Tower", icon: <Building2 className="h-6 w-6 text-[#0074CC]" /> },
  { id: "bangkok", name: "Bangkok, Thailand", tagline: "For its bustling nightlife", icon: <Landmark className="h-6 w-6 text-[#0074CC]" /> },
  { id: "london", name: "London, United Kingdom", tagline: "For its stunning architecture", icon: <Landmark className="h-6 w-6 text-[#0074CC]" /> },
  { id: "nyc", name: "New York, NY", tagline: "For its top-notch dining", icon: <Landmark className="h-6 w-6 text-[#0074CC]" /> },
  { id: "vancouver", name: "Vancouver, Canada", tagline: "For nature-lovers", icon: <Mountain className="h-6 w-6 text-[#0074CC]" /> },
  { id: "calgary", name: "Calgary, Canada", tagline: "Known for its skiing", icon: <Mountain className="h-6 w-6 text-[#0074CC]" /> },
];

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
  const [dateTab, setDateTab] = useState("dates");
  const [guests, setGuests] = useState(
    value?.guests || { adults: 0, children: 0, infants: 0, pets: 0 }
  );

  // Month nav state
  const [offset, setOffset] = useState(0);
  const today = useMemo(() => new Date(), []);
  const leftMonth = useMemo(
    () => addMonths(startOfMonth(today), offset),
    [today, offset]
  );
  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  useEffect(() => {
    if (open) {
      setShow(true);
      setQuery("");
      setLocation(value?.location || null);
      setStartDate(value?.checkIn || null);
      setEndDate(value?.checkOut || null);
      setFlex(value?.flex || 0);
      setDateTab("dates");
      setGuests(
        value?.guests || { adults: 0, children: 0, infants: 0, pets: 0 }
      );
      setOffset(0);
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

  // Position under the SearchBar + align to left/center/right based on active section
  const anchoredStyle = useMemo(() => {
    const el = anchorRef?.current;
    if (!el) return { zIndex: Z_MODAL };
    const rect = el.getBoundingClientRect();
    const gap = 16;
    const vpW = window.innerWidth;
    const pad = 16;
    const top = rect.bottom + gap;

    if (active === "where")
      return { position: "fixed", top, left: Math.max(pad, rect.left), zIndex: Z_MODAL };

    if (active === "who")
      return { position: "fixed", top, right: Math.max(pad, vpW - rect.right), left: "auto", zIndex: Z_MODAL };

    const center = rect.left + rect.width / 2;
    return { position: "fixed", top, left: center, transform: "translateX(-50%)", zIndex: Z_MODAL };
  }, [anchorRef, active]);

  const handleDayClick = (d) => {
    if (!d) return;
    const tMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dMid = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (dMid < tMid) return;
    if (!startDate || (startDate && endDate)) {
      setStartDate(d);
      setEndDate(null);
      return;
    }
    if (dMid < new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) {
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
        className={`fixed inset-0 bg-black/20 transition-opacity ${show ? "opacity-100" : "opacity-0"}`}
        style={{ zIndex: Z_MODAL - 1 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Desktop anchored dropdown */}
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

          {(active === "checkin" || active === "checkout" || active === "when") && (
            <div className="mb-6 flex w-full items-center justify-center">
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
                        "px-8 py-3 text-[14px] font-medium rounded-full transition outline-none focus-visible:ring-2 focus-visible:ring-black/10",
                        isActive ? "bg-white shadow-sm text-black font-semibold" : "text-[#222222] hover:text-[#717171]",
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
            <WherePanel query={query} setQuery={setQuery} location={location} setLocation={setLocation} />
          )}

          {(active === "checkin" || active === "checkout" || active === "when") && dateTab === "dates" && (
            <DatesPanel
              key={`desktop-${dateTab}`}
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

          {(active === "checkin" || active === "checkout" || active === "when") && dateTab === "months" && (
            <MonthsPanel startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
          )}

          {(active === "checkin" || active === "checkout" || active === "when") && dateTab === "flexible" && (
            <FlexiblePanel setStartDate={setStartDate} setEndDate={setEndDate} />
          )}

          {active === "who" && <GuestsPanel guests={guests} setGuests={setGuests} />}

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
        className={`fixed inset-x-0 bottom-0 block lg:hidden p-4 transition-transform duration-300 ${show ? "translate-y-0" : "translate-y-6"}`}
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
              <WherePanel query={query} setQuery={setQuery} location={location} setLocation={setLocation} />
            )}

            {(active === "checkin" || active === "checkout" || active === "when") && (
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
                            isActive ? "bg-white shadow-sm text-black font-semibold" : "text-[#222222] hover:text-[#717171]",
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
                    key={`mobile-${dateTab}`}
                    leftMonth={leftMonth}
                    rightMonth={null}     // one month on mobile
                    startDate={startDate}
                    endDate={endDate}
                    onDayClick={handleDayClick}
                    flex={flex}
                    setFlex={setFlex}
                    setOffset={setOffset}
                  />
                )}
                {dateTab === "months" && (
                  <MonthsPanel startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
                )}
                {dateTab === "flexible" && <FlexiblePanel setStartDate={setStartDate} setEndDate={setEndDate} />}
              </>
            )}

            {active === "who" && <GuestsPanel guests={guests} setGuests={setGuests} />}
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

/* Where + Guests helpers (unchanged) */
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