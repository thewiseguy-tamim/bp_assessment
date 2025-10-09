import React from "react";
import { Minus, Plus } from "lucide-react";

/**
 * WhoPanel
 * Props:
 * - counts: { adults, children, infants, pets }
 * - onChange: (partial) => void
 */
export default function WhoPanel({ counts, onChange }) {
  const Row = ({ label, sub, keyName, link }) => {
    const count = counts?.[keyName] ?? 0;
    const dec = () => onChange?.({ [keyName]: Math.max(0, count - 1) });
    const inc = () => onChange?.({ [keyName]: count + 1 });

    return (
      <div className="flex items-center justify-between py-4 border-b border-[#EBEBEB] last:border-none">
        <div>
          <div className="text-[15px] font-semibold text-[#222222]">{label}</div>
          {sub ? (
            <div className="text-[13px] text-[#717171]">{sub}</div>
          ) : link ? (
            <button className="text-[13px] text-[#717171] underline underline-offset-2">
              {link}
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-4">
          <button
            aria-label={`Decrease ${label}`}
            onClick={dec}
            disabled={count === 0}
            className={[
              "h-9 w-9 rounded-full border flex items-center justify-center",
              "transition active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-black/10",
              count === 0 ? "border-[#EBEBEB] text-[#DDDDDD]" : "border-[#DDDDDD] text-[#222222]",
            ].join(" ")}
          >
            <Minus className="h-5 w-5" />
          </button>
          <div className="w-6 text-center text-[17px]">{count}</div>
          <button
            aria-label={`Increase ${label}`}
            onClick={inc}
            className="h-9 w-9 rounded-full border border-[#DDDDDD] flex items-center justify-center active:scale-95 transition outline-none focus-visible:ring-2 focus-visible:ring-black/10"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="px-2">
      <div className="rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <h3 className="px-1 text-[20px] font-semibold text-[#222222]">Who?</h3>
        <div className="mt-2 px-1">
          <Row label="Adults" sub="Ages 13 or above" keyName="adults" />
          <Row label="Children" sub="Ages 2–12" keyName="children" />
          <Row label="Infants" sub="Under 2" keyName="infants" />
          <Row label="Pets" link="Bringing a service animal?" keyName="pets" />
        </div>
      </div>
    </div>
  );
}