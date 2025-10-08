import React, { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";

// Debug helper
const dbg = (...args) => {
  if (typeof window === "undefined") return;
  const enabled = window.__SEARCH_DEBUG__ ?? true;
  if (enabled) console.debug("[GuestsPanel]", ...args);
};

function Row({ label, sublabel, value, onChange }) {
  const dec = () => onChange(Math.max(0, value - 1));
  const inc = () => onChange(value + 1);

  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <div className="text-[16px] font-semibold text-[#222]">{label}</div>
        {sublabel && <div className="text-[14px] text-[#717171]">{sublabel}</div>}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={dec}
          disabled={value === 0}
          className={[
            "h-8 w-8 rounded-full border border-[#B0B0B0] flex items-center justify-center",
            value === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#F7F7F7]",
            "transition",
          ].join(" ")}
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="w-6 text-center text-[16px] text-[#222]">{value}</div>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={inc}
          className="h-8 w-8 rounded-full border border-[#B0B0B0] flex items-center justify-center hover:bg-[#F7F7F7] transition"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function GuestsPanel({ guests, setGuests }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dbg("Mounted GuestsPanel", guests);
  }, []);

  const update = (key, val) => {
    const next = { ...guests, [key]: val };
    dbg("Update", key, val, "=>", next);
    setGuests?.(next);
  };

  return (
    <div
      className={[
        "min-w-[300px]",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
        "transition-all duration-200",
      ].join(" ")}
    >
      <div className="divide-y divide-[#EBEBEB]">
        <Row
          label="Adults"
          sublabel="Ages 13 or above"
          value={guests?.adults || 0}
          onChange={(v) => update("adults", v)}
        />
        <Row
          label="Children"
          sublabel="Ages 2 – 12"
          value={guests?.children || 0}
          onChange={(v) => update("children", v)}
        />
        <Row
          label="Infants"
          sublabel="Under 2"
          value={guests?.infants || 0}
          onChange={(v) => update("infants", v)}
        />
        <Row
          label="Pets"
          sublabel={
            <span>
              <button
                type="button"
                onClick={() => dbg("Clicked: bringing a service animal")}
                className="underline underline-offset-2 hover:text-[#222] transition"
              >
                Bringing a service animal?
              </button>
            </span>
          }
          value={guests?.pets || 0}
          onChange={(v) => update("pets", v)}
        />
      </div>
    </div>
  );
}