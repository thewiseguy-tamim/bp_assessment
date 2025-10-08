import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import DatesPanel from "./panels/DatesPanel";
import MonthsPanel from "./panels/MonthsPanel";
import FlexiblePanel from "./panels/FlexiblePanel";
import WherePanel from "./panels/WherePanel";
import GuestsPanel from "./panels/GuestsPanel";

const Z_MODAL = 10000;

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d, m) => new Date(d.getFullYear(), d.getMonth() + m, 1);
const isSameMonthYear = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

// Debug helper: toggle with window.__SEARCH_DEBUG__ = false
const dbg = (...args) => {
  if (typeof window === "undefined") return;
  const enabled = window.__SEARCH_DEBUG__ ?? true;
  if (enabled) console.debug("[SearchDropdown]", ...args);
};

export default function SearchDropdown({
  open,
  active,
  anchorRef,
  value,
  onApply,
  onClose,
  onTabChange,
  onActiveSectionChange,
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

  const [offset, setOffset] = useState(0);
  const today = useMemo(() => new Date(), []);
  const leftMonth = useMemo(
    () => addMonths(startOfMonth(today), offset),
    [today, offset]
  );
  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  // Desktop overlay should start below the SearchBar
  const overlayTop = useMemo(() => {
    const el = anchorRef?.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const gap = 16;
    return rect.bottom + gap;
  }, [anchorRef]);

  useEffect(() => {
    if (open) {
      dbg("open", { active });
      setShow(true);
      setQuery("");
      setLocation(value?.location || null);
      setStartDate(value?.checkIn || null);
      setEndDate(value?.checkOut || null);
      setFlex(value?.flex || 0);
      setDateTab("dates");
      setGuests(value?.guests || { adults: 0, children: 0, infants: 0, pets: 0 });
      setOffset(0);
    } else {
      dbg("close");
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
      return { position: "fixed", top, left: Math.max(pad, rect.left), zIndex: Z_MODAL };

    if (active === "who")
      return {
        position: "fixed",
        top,
        right: Math.max(pad, vpW - rect.right),
        left: "auto",
        zIndex: Z_MODAL,
      };

    const center = rect.left + rect.width / 2;
    return { position: "fixed", top, left: center, transform: "translateX(-50%)", zIndex: Z_MODAL };
  }, [anchorRef, active]);

  // Width and padding tuned to panels (similar to screenshots)
  const panelSizing =
    active === "where"
      ? "w-[min(440px,calc(100vw-64px))] px-2 pb-4 pt-2"
      : active === "who"
      ? "w-[min(480px,calc(100vw-64px))] px-6 pb-6 pt-4"
      : "w-[min(920px,calc(100vw-64px))] px-8 pb-10 pt-6";

  // Slide to checkout after check-in and live-apply
  const handleDayClick = (d) => {
    if (!d) return;
    const tMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dMid = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (dMid < tMid) return;

    const logState = () => dbg("handleDayClick state", { startDate, endDate, clicked: d });

    // If starting a new range or re-starting
    if (!startDate || (startDate && endDate)) {
      setStartDate(d);
      setEndDate(null);
      onApply?.({ startDate: d, endDate: null, location, guests, flex });
      dbg("Start date selected", d);
      onActiveSectionChange?.("checkout");

      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(min-width: 1024px)").matches;

      if (isDesktop) {
        if (rightMonth && isSameMonthYear(d, rightMonth)) {
          setOffset((v) => v + 1);
        }
      } else {
        setOffset((v) => v + 1);
      }
      logState();
      return;
    }

    // If clicked before current start, redefine start and keep waiting for checkout
    const startMid = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    if (dMid <= startMid) {
      setStartDate(d);
      setEndDate(null);
      onApply?.({ startDate: d, endDate: null, location, guests, flex });
      dbg("Restarted selection with new start date", d);
      onActiveSectionChange?.("checkout");

      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(min-width: 1024px)").matches;

      if (isDesktop) {
        if (rightMonth && isSameMonthYear(d, rightMonth)) {
          setOffset((v) => v + 1);
        }
      } else {
        setOffset((v) => v + 1);
      }
      logState();
      return;
    }

    // Otherwise set end and keep everything in sync
    setEndDate(d);
    onApply?.({ startDate, endDate: d, location, guests, flex });
    dbg("End date selected", d);
  };

  if (!open) return null;

  return (
    <>
      {/* Desktop overlay (does NOT cover the navbar) */}
      <div
        className={`hidden lg:block fixed left-0 right-0 bg-black/20 transition-opacity ${show ? "opacity-100" : "opacity-0"}`}
        style={{ top: overlayTop, bottom: 0, zIndex: Z_MODAL - 1 }}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Mobile overlay (full screen) */}
      <div
        className={`block lg:hidden fixed inset-0 bg-black/20 transition-opacity ${show ? "opacity-100" : "opacity-0"}`}
        style={{ zIndex: Z_MODAL - 1 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Desktop anchored dropdown */}
      <div style={anchoredStyle} className="hidden lg:block">
        <div
          className={[
            "relative rounded-[32px] bg-white",
            panelSizing,
            "shadow-[0_6px_20px_rgba(0,0,0,0.2)] ring-1 ring-black/5",
            "transition-all duration-300",
            show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
            "overflow-hidden",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          <div className="mb-1 flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                dbg("Close button clicked");
                onClose?.();
              }}
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
                        dbg("Date tab change", t);
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

          {(active === "checkin" || active === "checkout" || active === "when") &&
            dateTab === "dates" && (
              <DatesPanel
                key={`desktop-${dateTab}`}
                leftMonth={leftMonth}
                rightMonth={rightMonth}
                startDate={startDate}
                endDate={endDate}
                onDayClick={handleDayClick}
                flex={flex}
                setFlex={(f) => {
                  setFlex(f);
                  dbg("Flex changed", f);
                  onApply?.({ startDate, endDate, location, guests, flex: f });
                }}
                setOffset={setOffset}
              />
            )}

          {(active === "checkin" || active === "checkout" || active === "when") &&
            dateTab === "months" && (
              <MonthsPanel
                startDate={startDate}
                endDate={endDate}
                setStartDate={(d) => {
                  dbg("MonthsPanel setStartDate", d);
                  setStartDate(d);
                  onApply?.({ startDate: d, endDate, location, guests, flex });
                }}
                setEndDate={(d) => {
                  dbg("MonthsPanel setEndDate", d);
                  setEndDate(d);
                  onApply?.({ startDate, endDate: d, location, guests, flex });
                }}
              />
            )}

          {(active === "checkin" || active === "checkout" || active === "when") &&
            dateTab === "flexible" && (
              <FlexiblePanel
                setStartDate={(d) => {
                  dbg("FlexiblePanel setStartDate", d);
                  setStartDate(d);
                  onApply?.({ startDate: d, endDate, location, guests, flex });
                }}
                setEndDate={(d) => {
                  dbg("FlexiblePanel setEndDate", d);
                  setEndDate(d);
                  onApply?.({ startDate, endDate: d, location, guests, flex });
                }}
              />
            )}

          {active === "where" && (
            <WherePanel
              query={query}
              setQuery={(q) => {
                dbg("Where query change", q);
                setQuery(q);
              }}
              location={location}
              setLocation={(loc) => {
                dbg("Location selected", loc);
                setLocation(loc);
                onApply?.({ location: loc, startDate, endDate, guests, flex });
              }}
            />
          )}

          {active === "who" && (
            <GuestsPanel
              guests={guests}
              setGuests={(g) => {
                dbg("Guests updated", g);
                setGuests(g);
                onApply?.({ startDate, endDate, location, guests: g, flex });
              }}
            />
          )}
        </div>
      </div>

      {/* Mobile sheet placeholder: keep your existing mobile sheet code here */}
    </>
  );
}