import React, { useEffect, useMemo, useState } from "react";
import { X, MapPin, Building2, Landmark, Mountain } from "lucide-react";

/**
 * SearchModal
 * - Mobile: full-screen overlay
 * - Desktop: large centered modal
 * - Autofocus input, suggested destinations with icons
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSelect?: (destination) => void
 */
const SUGGESTIONS = [
  { id: "nearby", name: "Nearby", tagline: "Find what’s around you", icon: <MapPin className="h-6 w-6 text-[#717171]" /> },
  { id: "toronto", name: "Toronto, Canada", tagline: "For sights like CN Tower", icon: <Building2 className="h-6 w-6 text-[#717171]" /> },
  { id: "bangkok", name: "Bangkok, Thailand", tagline: "For its bustling nightlife", icon: <Landmark className="h-6 w-6 text-[#717171]" /> },
  { id: "london", name: "London, United Kingdom", tagline: "For its stunning architecture", icon: <Landmark className="h-6 w-6 text-[#717171]" /> },
  { id: "nyc", name: "New York, NY", tagline: "For its top-notch dining", icon: <Landmark className="h-6 w-6 text-[#717171]" /> },
  { id: "vancouver", name: "Vancouver, Canada", tagline: "For nature-lovers", icon: <Mountain className="h-6 w-6 text-[#717171]" /> },
  { id: "calgary", name: "Calgary, Canada", tagline: "Known for its skiing", icon: <Mountain className="h-6 w-6 text-[#717171]" /> },
];

export default function SearchModal({ open, onClose, onSelect }) {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!query) return SUGGESTIONS;
    return SUGGESTIONS.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  if (!open) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-black/30 transition-opacity ${
          show ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile full-screen */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[75] block lg:hidden p-4 transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-6"
        }`}
      >
        <div className="max-h-[85vh] overflow-hidden rounded-3xl bg-white shadow-xl">
          <Header onClose={onClose} />
          <Body
            query={query}
            setQuery={setQuery}
            filtered={filtered}
            onSelect={(d) => {
              onSelect?.(d);
              onClose?.();
            }}
          />
        </div>
      </div>

      {/* Desktop centered modal */}
      <div className="fixed inset-0 z-[75] hidden items-center justify-center p-6 lg:flex">
        <div
          className={`w-full max-w-[640px] rounded-3xl bg-white shadow-xl ring-1 ring-black/5 transition-all ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <Header onClose={onClose} />
          <Body
            query={query}
            setQuery={setQuery}
            filtered={filtered}
            onSelect={(d) => {
              onSelect?.(d);
              onClose?.();
            }}
          />
        </div>
      </div>
    </>
  );
}

function Header({ onClose }) {
  return (
    <div className="flex items-center justify-between border-b border-[#EEEEEE] px-4 py-3">
      <div className="text-[15px] font-medium text-[#222222]">Search destinations</div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function Body({ query, setQuery, filtered, onSelect }) {
  return (
    <div className="p-4">
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search destinations"
        className="w-full rounded-2xl border border-[#DDDDDD] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-black/10"
      />

      <div className="mt-4 text-[13px] font-medium text-[#717171]">
        Suggested destinations
      </div>

      <div className="mt-2 max-h-[420px] overflow-auto pr-2">
        {filtered.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect?.(s)}
            className="w-full rounded-2xl px-3 py-2 text-left transition hover:bg-[#F7F7F7]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F7F7]">
                {s.icon}
              </div>
              <div>
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