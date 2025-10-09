import React, { useMemo, useState } from "react";
import { Search, MapPin, Building2, Landmark } from "lucide-react";

const SUGGESTIONS = [
  {
    key: "nearby",
    label: "Nearby",
    sub: "Find what's around you",
    Icon: MapPin,
    color: "#4CC9F0",
  },
  {
    key: "toronto",
    label: "Toronto, Canada",
    sub: "For sights like CN Tower",
    Icon: Building2,
    color: "#2A9D8F",
  },
  {
    key: "bangkok",
    label: "Bangkok, Thailand",
    sub: "For its bustling nightlife",
    Icon: Landmark,
    color: "#0EA5E9",
  },
  {
    key: "london",
    label: "London, United Kingdom",
    sub: "For its stunning architecture",
    Icon: Landmark,
    color: "#7C3AED",
  },
  {
    key: "newyork",
    label: "New York, NY",
    sub: "For its top-notch dining",
    Icon: Building2,
    color: "#EF4444",
  },
  {
    key: "vancouver",
    label: "Vancouver, Canada",
    sub: "For nature-lovers",
    Icon: Landmark,
    color: "#10B981",
  },
];

/**
 * WherePanel
 * Props:
 * - value: { key, label } | null
 * - onSelect: (destination) => void
 */
export default function WherePanel({ value, onSelect }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q) return SUGGESTIONS;
    return SUGGESTIONS.filter((s) =>
      s.label.toLowerCase().includes(q.toLowerCase())
    );
  }, [q]);

  const pickFirst = () => {
    if (filtered.length > 0) onSelect?.({ key: filtered[0].key, label: filtered[0].label });
  };

  return (
    <div className="px-1">
      <h3 className="px-3 text-[20px] font-semibold text-[#222222]">Where?</h3>

      {/* Search input */}
      <div className="mt-3">
        <label className="sr-only" htmlFor="where-search">Search destinations</label>
        <div className="rounded-[12px] border border-[#DDDDDD] px-3 py-2 flex items-center gap-2 bg-white">
          <Search className="h-5 w-5 text-[#717171]" aria-hidden="true" />
          <input
            id="where-search"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && pickFirst()}
            placeholder="Search destinations"
            className="w-full bg-transparent outline-none text-[15px] placeholder-[#717171]"
          />
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-3 text-[14px] text-[#222222] px-1">
        Suggested destinations
      </div>

      <ul
        className="mt-2 max-h-80 overflow-auto pr-1"
        role="listbox"
        aria-label="Suggested destinations"
      >
        {filtered.map(({ key, label, sub, Icon, color }) => (
          <li key={key}>
            <button
              role="option"
              aria-selected={value?.key === key}
              onClick={() => onSelect?.({ key, label })}
              className="w-full flex items-center gap-3 rounded-[12px] px-3 py-2 hover:bg-[#F7F7F7] active:scale-[0.995] transition text-left"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#EBEBEB] bg-white"
                style={{ color }}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-[#222222]">
                  {label}
                </div>
                <div className="text-[13px] text-[#717171]">{sub}</div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}