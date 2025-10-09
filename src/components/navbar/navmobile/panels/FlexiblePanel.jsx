import React from "react";
import { Calendar } from "lucide-react";

/**
 * FlexiblePanel
 * Props:
 * - selection: { length: 'weekend'|'week'|'month'|null, month: string|null }
 * - onChange: (partial) => void
 * - months?: Array<{ key: string, month: string, year: number }>  // optional override
 */
export default function FlexiblePanel({ selection, onChange, months: overrideMonths }) {
  const { length, month } = selection ?? {};
  const lengths = [
    { key: "weekend", label: "Weekend" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
  ];

  // Default to October/November/December 2025 to match screenshots
  const months =
    overrideMonths ??
    [
      { key: "oct-2025", month: "October", year: 2025 },
      { key: "nov-2025", month: "November", year: 2025 },
      { key: "dec-2025", month: "December", year: 2025 },
    ];

  return (
    <div className="px-2">
      <div className="rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="px-1 pb-2 border-b border-[#EBEBEB]">
          <div className="text-[15px] font-semibold text-[#222222]">
            How long would you like to stay?
          </div>
          <div className="mt-2 flex items-center gap-2">
            {lengths.map((l) => {
              const active = length === l.key;
              return (
                <button
                  key={l.key}
                  onClick={() => onChange?.({ flexibleLength: l.key })}
                  className={[
                    "px-4 py-2 rounded-full text-[14px] border transition outline-none focus-visible:ring-2 focus-visible:ring-black/10",
                    active
                      ? "bg-[#222222] text-white border-[#222222]"
                      : "bg-white text-[#222222] border-[#DDDDDD]",
                  ].join(" ")}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-1 pt-3">
          <div className="text-[15px] font-semibold text-[#222222]">Go anytime</div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {months.map((m) => {
              const active = month === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => onChange?.({ flexibleMonth: m.key })}
                  className={[
                    "rounded-[12px] border bg-white px-3 py-4 text-center transition",
                    "hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] outline-none focus-visible:ring-2 focus-visible:ring-black/10",
                    active ? "border-black" : "border-[#DDDDDD]",
                  ].join(" ")}
                >
                  <Calendar className="mx-auto h-6 w-6 text-[#717171]" />
                  <div className="mt-2 text-[15px] font-medium text-[#222222]">
                    {m.month}
                  </div>
                  <div className="text-[12px] text-[#717171]">{m.year}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}