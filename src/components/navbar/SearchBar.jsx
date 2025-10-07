import React, { useMemo, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import SearchDropdown from "./SearchDropdown";

// Single, clean implementation of SearchBar
export default function SearchBar({ value, onChange, onSubmit, className = "" }) {
  const [searchBarMode, setSearchBarMode] = useState("default");
  const [activeSection, setActiveSection] = useState(null);
  const [open, setOpen] = useState(false);

  const [state, setState] = useState(
    value || {
      location: null,
      checkIn: null,
      checkOut: null,
      guests: { adults: 0, children: 0, infants: 0, pets: 0 },
      flex: 0,
    }
  );

  const anchorRef = useRef(null);

  const guestsLabel = useMemo(() => {
    const { adults = 0, children = 0, infants = 0, pets = 0 } = state.guests || {};
    const total = adults + children;
    const parts = [];
    parts.push(total > 0 ? `${total} ${total > 1 ? "guests" : "guest"}` : "Add guests");
    if (infants) parts.push(`${infants} ${infants > 1 ? "infants" : "infant"}`);
    if (pets) parts.push(`${pets} ${pets > 1 ? "pets" : "pet"}`);
    return parts.join(", ");
  }, [state]);

  const fmtShort = (d) =>
    d ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(d) : null;

  const whenLabel = useMemo(() => {
    const { checkIn, checkOut } = state;
    if (checkIn && checkOut) {
      return `${fmtShort(checkIn)} – ${fmtShort(checkOut)}`;
    }
    return "Anytime";
  }, [state]);

  const valuesDefault = {
    where: state.location?.name || "Search destinations",
    checkin: state.checkIn ? fmtShort(state.checkIn) : "Add dates",
    checkout: state.checkOut ? fmtShort(state.checkOut) : "Add dates",
    who: guestsLabel,
  };

  const valuesWhen = {
    where: state.location?.name || "Search destinations",
    when: whenLabel,
    who: guestsLabel,
  };

  const openDropdown = (sectionKey) => {
    if (sectionKey === "checkin" || sectionKey === "checkout") {
      setSearchBarMode("when-active");
      setActiveSection("when");
      setOpen(true);
      return;
    }
    if (sectionKey === "when") {
      setActiveSection("when");
      setOpen(true);
      return;
    }
    setActiveSection(sectionKey);
    setOpen(true);
  };

  const handleApply = (partial) => {
    const next = { ...state };
    if (partial?.location !== undefined) next.location = partial.location;
    if (partial?.startDate !== undefined) next.checkIn = partial.startDate;
    if (partial?.endDate !== undefined) next.checkOut = partial.endDate;
    if (partial?.guests !== undefined) next.guests = partial.guests;
    if (partial?.flex !== undefined) next.flex = partial.flex;

    setState(next);
    onChange?.(next);
  };

  const closeDropdown = () => {
    setOpen(false);
    if (searchBarMode === "when-active") {
      setTimeout(() => {
        setSearchBarMode("default");
        setActiveSection(null);
      }, 220);
    } else {
      setActiveSection(null);
    }
  };

  const submitSearch = () => {
    onSubmit?.(state);
    closeDropdown();
  };

  const isWhenMode = searchBarMode === "when-active";

  const gridDefault = "grid-cols-[1fr_1fr_1fr_1fr]";
  const gridWhen = "grid-cols-[30%_45%_25%]";

  return (
    <div className={`relative ${className}`} ref={anchorRef}>
      <div
        className={[
          "flex items-center rounded-[50px] bg-white shadow-sm",
          "border border-[#DDDDDD] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "h-[66px] px-2 sm:px-3",
        ].join(" ")}
        role="search"
      >
        {!isWhenMode ? (
          <div className={`grid ${gridDefault} flex-1 items-stretch divide-x divide-[#DDDDDD]`}>
            <BarSection
              dataKey="where"
              title="Where"
              value={valuesDefault.where}
              onClick={() => openDropdown("where")}
              active={activeSection === "where" && open}
              ariaExpanded={activeSection === "where" && open}
            />
            <BarSection
              dataKey="checkin"
              title="Check in"
              value={valuesDefault.checkin}
              onClick={() => openDropdown("checkin")}
              active={activeSection === "checkin" && open}
              ariaExpanded={activeSection === "checkin" && open}
            />
            <BarSection
              dataKey="checkout"
              title="Check out"
              value={valuesDefault.checkout}
              onClick={() => openDropdown("checkout")}
              active={activeSection === "checkout" && open}
              ariaExpanded={activeSection === "checkout" && open}
            />
            <BarSection
              dataKey="who"
              title="Who"
              value={valuesDefault.who}
              onClick={() => openDropdown("who")}
              active={activeSection === "who" && open}
              ariaExpanded={activeSection === "who" && open}
            />
          </div>
        ) : (
          <div className={`grid ${gridWhen} flex-1 items-stretch`}>
            <BarSection
              dataKey="where"
              title="Where"
              value={valuesWhen.where}
              onClick={() => openDropdown("where")}
              active={activeSection === "where" && open}
              ariaExpanded={activeSection === "where" && open}
            />
            <BarSection
              dataKey="when"
              title="When"
              value={valuesWhen.when}
              onClick={() => openDropdown("when")}
              active={activeSection === "when" && open}
              ariaExpanded={activeSection === "when" && open}
              activeElevated
            />
            <BarSection
              dataKey="who"
              title="Who"
              value={valuesWhen.who}
              onClick={() => openDropdown("who")}
              active={activeSection === "who" && open}
              ariaExpanded={activeSection === "who" && open}
            />
          </div>
        )}

        <div
          className={[
            "ml-2 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            isWhenMode ? "w-[120px]" : "w-14",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={submitSearch}
            aria-label="Search"
            className={[
              "h-14 w-full rounded-full bg-[#E61E4D] text-white",
              "flex items-center justify-center gap-2",
              "border border-[#DDDDDD]",
              "transition hover:bg-[#D70466] hover:scale-[1.04] shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
            ].join(" ")}
          >
            <SearchIcon className="h-5 w-5" />
            <span
              className={[
                "whitespace-nowrap text-[16px] font-semibold",
                "transition-opacity duration-250",
                isWhenMode ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              Search
            </span>
          </button>
        </div>
      </div>

      <SearchDropdown
        open={open}
        active={isWhenMode ? "when" : activeSection}
        anchorRef={anchorRef}
        value={state}
        onApply={handleApply}
        onClose={closeDropdown}
      />
    </div>
  );
}

function BarSection({ dataKey, title, value, onClick, active, ariaExpanded, activeElevated = false }) {
  return (
    <button
      type="button"
      data-key={dataKey}
      onClick={onClick}
      aria-expanded={ariaExpanded}
      className={[
        "group h-[62px] w-full text-left px-6",
        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
        active || activeElevated
          ? "rounded-[32px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          : "hover:bg-[#F7F7F7] hover:shadow-[0_2px_4px_rgba(0,0,0,0.08)] hover:rounded-[32px]",
      ].join(" ")}
    >
      <div className="flex h-full flex-col items-start justify-center">
        <span className="text-[12px] font-semibold leading-4 text-[#222222]">{title}</span>
        <span className="mt-1 max-w-full truncate text-[14px] leading-[18px] text-[#717171]">{value}</span>
      </div>
    </button>
  );
}