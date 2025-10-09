import React, { useEffect, useState } from "react";
import DatesPanel from "./DatesPanel";
import MonthsPanel from "./MonthsPanel";
import FlexiblePanel from "./FlexiblePanel";

export default function WhenPanel({ value, onChange }) {
  const [tab, setTab] = useState(value?.dateMode ?? "dates");

  useEffect(() => {
    console.debug("[WhenPanel] init value:", value);
  }, []); // mount

  useEffect(() => {
    console.debug("[WhenPanel] tab ->", tab);
    if (value?.dateMode !== tab) onChange?.({ dateMode: tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div className="px-1">
      <h3 className="px-3 text-[20px] font-semibold text-[#222222]">When?</h3>

      <div className="mt-3 px-2">
        <div className="inline-flex items-center rounded-full bg-[#F0F0F0] p-[4px]">
          {["dates", "months", "flexible"].map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`min-w-[84px] px-4 py-2 rounded-full text-[14px] transition font-semibold outline-none focus-visible:ring-2 focus-visible:ring-black/10 ${
                  isActive ? "bg-white shadow text-[#222222]" : "text-[#717171]"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        {tab === "dates" && (
          <DatesPanel
            checkIn={value?.checkIn}
            checkOut={value?.checkOut}
            onChange={(p) => {
              console.debug("[WhenPanel] dates change:", p);
              onChange?.(p);
            }}
          />
        )}
        {tab === "months" && (
          <MonthsPanel
            length={typeof value?.flexibleLength === "number" ? value?.flexibleLength : 3}
            onChange={(len) => {
              console.debug("[WhenPanel] months change:", len);
              onChange?.({ flexibleLength: len });
            }}
          />
        )}
        {tab === "flexible" && (
          <FlexiblePanel
            selection={{
              length: typeof value?.flexibleLength === "string" ? value?.flexibleLength : null,
              month: value?.flexibleMonth ?? null,
            }}
            onChange={(p) => {
              console.debug("[WhenPanel] flexible change:", p);
              onChange?.(p);
            }}
          />
        )}
      </div>
    </div>
  );
}