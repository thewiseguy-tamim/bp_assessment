import React, { useMemo, useRef, useState } from "react";
import Button from "../common/Button";
import { Search as SearchIcon } from "lucide-react";
import SearchDropdown from "./SearchDropdown";

/**
 * SearchBar
 * - Pill search with sections: Where | Check in | Check out | Who
 * - Hover shadow, rounded-full, Tailwind-only
 * - Clicking any section opens SearchDropdown with the relevant panel
 *
 * Props:
 * - value?: { location?: { id?: string, name?: string }, startDate?: Date|null, endDate?: Date|null, guests?: { adults: number, children: number, infants: number, pets: number } }
 * - onChange?: (nextValue) => void
 * - onSubmit?: (value) => void
 * - className?: string
 */
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState("where"); // 'where' | 'dates' | 'who'
  const [state, setState] = useState(
    value || {
      location: null,
      startDate: null,
      endDate: null,
      guests: { adults: 0, children: 0, infants: 0, pets: 0 },
    }
  );

  const containerRef = useRef(null);

  const dateLabels = useMemo(() => {
    const opts = { month: "short", day: "numeric" };
    const fmt = (d) => (d ? new Intl.DateTimeFormat(undefined, opts).format(d) : "Add dates");
    return {
      in: state.startDate ? fmt(state.startDate) : "Add dates",
      out: state.endDate ? fmt(state.endDate) : "Add dates",
    };
  }, [state.startDate, state.endDate]);

  const guestsLabel = useMemo(() => {
    const { adults, children, infants, pets } = state.guests || {};
    const totalMain = (adults || 0) + (children || 0);
    const parts = [];
    parts.push(totalMain > 0 ? `${totalMain} ${totalMain > 1 ? "guests" : "guest"}` : "Add guests");
    if (infants) parts.push(`${infants} ${infants > 1 ? "infants" : "infant"}`);
    if (pets) parts.push(`${pets} ${pets > 1 ? "pets" : "pet"}`);
    return parts.join(", ");
  }, [state.guests]);

  const locationTop = state.location?.name ? "Where" : "Where";
  const locationBottom = state.location?.name || "Search destinations";

  const openPanel = (key) => {
    setPanel(key);
    setOpen(true);
  };

  const handleApply = (next) => {
    const merged = { ...state, ...next };
    setState(merged);
    onChange?.(merged);
    setOpen(false);
  };

  const handleSubmit = () => {
    onSubmit?.(state);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className="w-full rounded-full border border-[#DDDDDD] bg-white shadow-sm transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-black/10"
        role="search"
      >
        <div className="flex items-center justify-between pl-4 pr-2 py-2.5 sm:py-3">
          <div className="flex items-center gap-4">
            {/* Where */}
            <button
              type="button"
              onClick={() => openPanel("where")}
              className="text-left"
            >
              <div>
                <div className="text-[13px] font-medium text-[#222222] leading-none">
                  {locationTop}
                </div>
                <div className="mt-1 text-[13px] text-[#717171] leading-none truncate max-w-[120px] sm:max-w-[180px]">
                  {locationBottom}
                </div>
              </div>
            </button>

            <div className="hidden sm:block h-8 w-px bg-[#DDDDDD]" />

            {/* Check in */}
            <button
              type="button"
              onClick={() => openPanel("dates")}
              className="hidden sm:block text-left"
            >
              <div>
                <div className="text-[13px] font-medium text-[#222222] leading-none">
                  Check in
                </div>
                <div className="mt-1 text-[13px] text-[#717171] leading-none">
                  {dateLabels.in}
                </div>
              </div>
            </button>

            <div className="hidden sm:block h-8 w-px bg-[#DDDDDD]" />

            {/* Check out */}
            <button
              type="button"
              onClick={() => openPanel("dates")}
              className="hidden sm:block text-left"
            >
              <div>
                <div className="text-[13px] font-medium text-[#222222] leading-none">
                  Check out
                </div>
                <div className="mt-1 text-[13px] text-[#717171] leading-none">
                  {dateLabels.out}
                </div>
              </div>
            </button>

            <div className="hidden md:block h-8 w-px bg-[#DDDDDD]" />

            {/* Who */}
            <button
              type="button"
              onClick={() => openPanel("who")}
              className="hidden md:block text-left"
            >
              <div>
                <div className="text-[13px] font-medium text-[#222222] leading-none">
                  Who
                </div>
                <div className="mt-1 text-[13px] text-[#717171] leading-none truncate max-w-[160px]">
                  {guestsLabel}
                </div>
              </div>
            </button>
          </div>

          <Button
            variant="primary"
            size="icon"
            aria-label="Search"
            className="shadow-md"
            onClick={handleSubmit}
          >
            <SearchIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Dropdown / Overlay */}
      <SearchDropdown
        open={open}
        panel={panel}
        anchorRef={containerRef}
        value={state}
        onClose={() => setOpen(false)}
        onApply={handleApply}
      />
    </div>
  );
}