import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Building2, Landmark, Mountain, Search as SearchIcon } from "lucide-react";

// Debug helper
const dbg = (...args) => {
  if (typeof window === "undefined") return;
  const enabled = window.__SEARCH_DEBUG__ ?? true;
  if (enabled) console.debug("[WherePanel]", ...args);
};

const SUGGESTED = [
  {
    id: "nearby",
    title: "Nearby",
    subtitle: "Find what’s around you",
    Icon: MapPin,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "toronto",
    title: "Toronto, Canada",
    subtitle: "For sights like CN Tower",
    Icon: Building2,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    id: "bangkok",
    title: "Bangkok, Thailand",
    subtitle: "For its bustling nightlife",
    Icon: Landmark,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    id: "london",
    title: "London, United Kingdom",
    subtitle: "For its stunning architecture",
    Icon: Landmark,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    id: "newyork",
    title: "New York, NY",
    subtitle: "For its top-notch dining",
    Icon: Building2,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    id: "vancouver",
    title: "Vancouver, Canada",
    subtitle: "For nature-lovers",
    Icon: Mountain,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "calgary",
    title: "Calgary, Canada",
    subtitle: "Known for its skiing",
    Icon: Mountain,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];

export default function WherePanel({ query, setQuery, location, setLocation }) {
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    // auto-focus the input for quick typing
    inputRef.current?.focus();
    dbg("Mounted WherePanel", { location, query });
  }, []);

  const filtered = useMemo(() => {
    if (!query) return SUGGESTED;
    const q = query.trim().toLowerCase();
    return SUGGESTED.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (item) => {
    dbg("handleSelect", item);
    setLocation?.({ id: item.id, name: item.title });
  };

  const useQuery = () => {
    if (!query.trim()) return;
    const item = { id: "custom", name: query.trim() };
    dbg("Use query", item);
    setLocation?.(item);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (query.trim()) {
        useQuery();
      } else if (filtered[0]) {
        handleSelect(filtered[0]);
      }
    }
  };

  return (
    <div
      className={[
        "relative",
        // enter animation for panel content
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
        "transition-all duration-200",
      ].join(" ")}
    >
      <div className="px-3 pb-2">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#717171]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search destinations"
            className="w-full rounded-full border border-[#DDDDDD] bg-white py-3 pl-9 pr-4 text-[14px] shadow-sm placeholder:text-[#717171] focus:border-black focus:ring-0"
            aria-label="Search destinations"
          />
        </div>
      </div>

      <div className="px-3 pt-1 pb-3">
        <div className="px-2 py-2 text-[12px] font-semibold text-[#717171]">
          Suggested destinations
        </div>

        <div className="max-h-[420px] overflow-y-auto pr-2">
          {query && (
            <button
              type="button"
              onClick={useQuery}
              className="group w-full rounded-2xl p-3 mb-1 hover:bg-[#F7F7F7] transition flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-[#EEE] flex items-center justify-center">
                <SearchIcon className="h-5 w-5 text-[#222]" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[14px] font-semibold text-[#222]">
                  Use “{query}”
                </div>
                <div className="text-[12px] text-[#717171]">
                  Search this destination
                </div>
              </div>
            </button>
          )}

          {filtered.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelect(s)}
              className={[
                "group w-full rounded-2xl p-3 flex items-center gap-3",
                "hover:bg-[#F7F7F7] transition",
                // slight staggered entrance
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
              ].join(" ")}
              style={{ transitionDelay: `${Math.min(i, 8) * 20}ms` }}
            >
              <div className={`h-12 w-12 rounded-2xl ${s.iconBg} flex items-center justify-center`}>
                <s.Icon className={`h-6 w-6 ${s.iconColor}`} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[14px] font-semibold text-[#222]">
                  {s.title}
                </div>
                <div className="text-[12px] text-[#717171]">{s.subtitle}</div>
              </div>
            </button>
          ))}

          {!filtered.length && !query && (
            <div className="p-4 text-center text-[13px] text-[#717171]">
              No suggestions
            </div>
          )}
        </div>
      </div>
    </div>
  );
}