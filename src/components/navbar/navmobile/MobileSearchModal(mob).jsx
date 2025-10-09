import React, { useEffect, useRef } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import AnimatedNavIcon from "./AnimatedNavIcon";
import homeAnim from "../../../assets/homes.json";
import balloonAnim from "../../../assets/baloon.json";
import bellAnim from "../../../assets/bell.json";
import WherePanel from "./panels/WherePanel";
import WhenPanel from "./panels/WhenPanel";
import WhoPanel from "./panels/WhoPanel";

const PINK = "#FF385C";

function useBodyScrollLock(locked) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (locked) {
      document.body.style.overflow = "hidden";
      if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [locked]);
}

function useFocusTrap(enabled, containerRef) {
  useEffect(() => {
    if (!enabled) return;
    const root = containerRef.current;
    if (!root) return;
    const focusables = () =>
      Array.from(
        root.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
    const first = root.querySelector("[data-autofocus]") || focusables()[0];
    first?.focus();
    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, [enabled, containerRef]);
}

function formatDateShort(date) {
  return date?.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function CatTab({ label, active, isNew, children }) {
  return (
    <div className="relative flex flex-col items-center gap-1">
      <div className="relative">{children}</div>
      {isNew && (
        <span className="absolute -top-2 -right-3 rounded-full bg-[#2F6AFF] text-white text-[10px] px-1.5 py-[2px] shadow">
          NEW
        </span>
      )}
      <span
        className={`text-[12px] font-medium ${active ? "text-[color:var(--pink,#FF385C)]" : "text-[#717171]"}`}
        style={{ "--pink": "#FF385C" }}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={`mt-0.5 h-[2px] w-8 rounded ${active ? "bg-[color:var(--pink,#FF385C)]" : "bg-transparent"}`}
        style={{ "--pink": "#FF385C" }}
      />
    </div>
  );
}

function Section({ title, right, expanded, onToggle, ariaId, children }) {
  return (
    <section className="px-4 mt-3">
      <button
        onClick={onToggle}
        aria-controls={ariaId}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between rounded-2xl bg-white py-3 px-4 border border-[#EBEBEB] active:scale-[0.99] transition shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
      >
        <span className="text-[15px] font-medium text-[#222222]">{title}</span>
        <span className="text-[14px] text-[#717171]">{right}</span>
      </button>
      <div
        id={ariaId}
        className={`transition-all duration-250 ease-out origin-top ${
          expanded ? "mt-3 opacity-100 scale-y-100" : "mt-0 opacity-0 scale-y-95 h-0 overflow-hidden"
        }`}
        aria-hidden={!expanded}
      >
        {children}
      </div>
    </section>
  );
}

export default function MobileSearchModalMob({
  open,
  onClose,
  searchData,
  setSearchData,
  activeSearchSection,
  setActiveSearchSection,
  onSubmit,
}) {
  const containerRef = useRef(null);
  useBodyScrollLock(open);
  useFocusTrap(open, containerRef);

  // Blur focus when closing to avoid aria-hidden warning
  useEffect(() => {
    if (!open) {
      const el = document.activeElement;
      if (el && containerRef.current?.contains(el)) {
        try { el.blur(); } catch (_) {}
      }
    }
  }, [open]);

  // Ensure default section open (Where)
  useEffect(() => {
    if (open && !activeSearchSection) {
      setActiveSearchSection?.("where");
    }
  }, [open, activeSearchSection, setActiveSearchSection]);

  const openSection = (key) => setActiveSearchSection?.(key);

  const whereRight = searchData?.destination?.label ?? "I'm flexible";
  const whenRight =
    searchData?.dateMode === "dates" && searchData?.checkIn && searchData?.checkOut
      ? `${formatDateShort(searchData.checkIn)} - ${formatDateShort(searchData.checkOut)}`
      : searchData?.dateMode === "months" && searchData?.flexibleLength
      ? `${searchData.flexibleLength} months`
      : "Add dates";
  const whoRight = (() => {
    const a = searchData?.adults ?? 0, c = searchData?.children ?? 0, i = searchData?.infants ?? 0, p = searchData?.pets ?? 0;
    const total = a + c;
    if (!total && !i && !p) return "Add guests";
    const parts = [];
    if (total) parts.push(`${total} ${total === 1 ? "guest" : "guests"}`);
    if (i) parts.push(`${i} ${i === 1 ? "infant" : "infants"}`);
    if (p) parts.push(`${p} ${p === 1 ? "pet" : "pets"}`);
    return parts.join(", ");
  })();

  const showSearchPink = activeSearchSection === "where" || activeSearchSection === "who";

  return (
    <div className={`lg:hidden fixed inset-0 z-[70] ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile search"
        className={`absolute inset-x-0 bottom-0 top-0 flex flex-col bg-white rounded-t-[24px] shadow-[0_-8px_24px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-[8%]"
        }`}
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)" }}
      >
        {/* Header (centered tabs with background halo + close) */}
        <div className="px-4 pt-2 pb-2">
          <div className="relative h-[64px]">
            {/* background halo pill behind Lottie icons */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-2 -translate-x-1/2 w-[260px] h-10 rounded-full bg-white/80 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
            />
            {/* centered tabs */}
            <div className="absolute inset-0 flex items-end justify-center gap-6 mt-5">
              <CatTab label="Homes" active>
                <AnimatedNavIcon animationData={homeAnim} size={28} active loop ariaLabel="Homes" />
              </CatTab>
              <CatTab label="Experiences" isNew>
                <AnimatedNavIcon animationData={balloonAnim} size={28} active={false} loop={false} ariaLabel="Experiences" />
              </CatTab>
              <CatTab label="Services" isNew>
                <AnimatedNavIcon animationData={bellAnim} size={28} active={false} loop={false} ariaLabel="Services" />
              </CatTab>
            </div>
            {/* close button */}
            <button
              className="absolute right-1.5 top-1.5 p-2 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:bg-black/[0.04] active:scale-95 transition"
              aria-label="Close"
              data-autofocus
              onClick={onClose}
            >
              <X className="h-5 w-5 text-[#222222]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto">
          {/* WHERE */}
          <Section
            title="Where"
            right={whereRight}
            expanded={activeSearchSection === "where"}
            onToggle={() => openSection(activeSearchSection === "where" ? null : "where")}
            ariaId="section-where"
          >
            {activeSearchSection === "where" ? (
              <div className="rounded-[20px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                <div className="p-3">
                  <WherePanel
                    value={searchData?.destination}
                    onSelect={(dest) => setSearchData?.((prev) => ({ ...prev, destination: dest }))}
                  />
                </div>
                {/* little chevron at bottom center */}
                <div className="flex justify-center pb-1">
                  <div className="h-5 w-8 rounded-full bg-white border border-[#EBEBEB] flex items-center justify-center shadow-[0_-1px_3px_rgba(0,0,0,0.06)]">
                    <ChevronDown className="h-3.5 w-3.5 text-[#717171]" />
                  </div>
                </div>
              </div>
            ) : null}
          </Section>

          {/* WHEN */}
          <Section
            title="When"
            right={whenRight}
            expanded={activeSearchSection === "when"}
            onToggle={() => openSection(activeSearchSection === "when" ? null : "when")}
            ariaId="section-when"
          >
            {activeSearchSection === "when" ? (
              <div className="rounded-[20px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-3">
                <WhenPanel
                  value={searchData}
                  onChange={(partial) => setSearchData?.((p) => ({ ...p, ...partial }))}
                />
              </div>
            ) : null}
          </Section>

          {/* WHO */}
          <Section
            title="Who"
            right={whoRight}
            expanded={activeSearchSection === "who"}
            onToggle={() => openSection(activeSearchSection === "who" ? null : "who")}
            ariaId="section-who"
          >
            {activeSearchSection === "who" ? (
              <div className="rounded-[20px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-3">
                <WhoPanel
                  counts={{
                    adults: searchData?.adults ?? 0,
                    children: searchData?.children ?? 0,
                    infants: searchData?.infants ?? 0,
                    pets: searchData?.pets ?? 0,
                  }}
                  onChange={(partial) => setSearchData?.((p) => ({ ...p, ...partial }))}
                />
              </div>
            ) : null}
          </Section>

          <div className="h-28" />
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 inset-x-0 bg-white/70 backdrop-blur-sm">
          <div className="mx-4 my-3 flex items-center justify-between">
            <button className="text-[14px] text-[#222222] underline underline-offset-2 px-2 py-2 rounded active:scale-95 transition">
              Clear all
            </button>
            {showSearchPink ? (
              <button
                className="flex items-center gap-2 rounded-[12px] bg-[color:var(--pink)] text-white px-4 py-3 font-semibold shadow-[0_4px_12px_rgba(255,56,92,0.35)] active:scale-95 transition"
                style={{ "--pink": PINK }}
                onClick={() => onSubmit?.(searchData)}
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            ) : (
              <button
                className="rounded-[12px] bg-[#222222] text-white px-4 py-3 font-semibold active:scale-95 transition"
                onClick={() => openSection("who")}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}