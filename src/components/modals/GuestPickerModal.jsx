import React, { useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import Button from "../common/Button";

/**
 * GuestPickerModal
 * - Four rows: Adults, Children, Infants, Pets
 * - +/- buttons, disabled minus at 0
 * - "Bringing a service animal?" link for Pets
 *
 * Props:
 * - open: boolean
 * - value?: { adults: number, children: number, infants: number, pets: number }
 * - onClose: () => void
 * - onApply: (guests) => void
 */
export default function GuestPickerModal({
  open,
  value = { adults: 0, children: 0, infants: 0, pets: 0 },
  onClose,
  onApply,
}) {
  const [show, setShow] = useState(false);
  const [guests, setGuests] = useState(value);

  useEffect(() => {
    if (open) {
      setShow(true);
      setGuests(value);
    } else {
      setShow(false);
    }
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const update = (key, delta) => {
    setGuests((g) => {
      const next = { ...g, [key]: Math.max(0, (g[key] || 0) + delta) };
      return next;
    });
  };

  const clear = () => setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
  const apply = () => onApply?.(guests);

  if (!open) return null;

  const rows = [
    { key: "adults", title: "Adults", sub: "Ages 13 or above" },
    { key: "children", title: "Children", sub: "Ages 2–12" },
    { key: "infants", title: "Infants", sub: "Under 2" },
    {
      key: "pets",
      title: "Pets",
      sub: <span className="underline">Bringing a service animal?</span>,
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-black/30 transition-opacity ${
          show ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[75] block lg:hidden p-4 transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-6"
        }`}
      >
        <div className="max-h-[85vh] overflow-hidden rounded-3xl bg-white shadow-xl">
          <Header onClose={onClose} />

          <div className="p-3">
            <Rows rows={rows} guests={guests} update={update} />
          </div>

          <div className="flex items-center justify-between border-t border-[#EEEEEE] px-3 py-3">
            <button
              type="button"
              onClick={clear}
              className="text-[15px] font-medium underline"
            >
              Clear
            </button>
            <Button variant="primary" onClick={apply}>
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop centered */}
      <div className="fixed inset-0 z-[75] hidden items-center justify-center p-6 lg:flex">
        <div
          className={`w-full max-w-[520px] rounded-3xl bg-white shadow-xl ring-1 ring-black/5 transition-all ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <Header onClose={onClose} />

          <div className="p-4">
            <Rows rows={rows} guests={guests} update={update} />
          </div>

          <div className="flex items-center justify-between border-t border-[#EEEEEE] px-4 py-3">
            <button
              type="button"
              onClick={clear}
              className="text-[15px] font-medium underline"
            >
              Clear
            </button>
            <Button variant="primary" onClick={apply}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function Header({ onClose }) {
  return (
    <div className="flex items-center justify-between border-b border-[#EEEEEE] px-4 py-3">
      <div className="text-[15px] font-medium text-[#222222]">Guests</div>
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

function Rows({ rows, guests, update }) {
  return (
    <div className="divide-y divide-[#EEEEEE] rounded-2xl border border-[#EEEEEE]">
      {rows.map((r) => {
        const count = guests[r.key] || 0;
        return (
          <div
            key={r.key}
            className={`flex items-center justify-between p-4 ${
              count === 0 ? "opacity-90" : ""
            }`}
          >
            <div>
              <div className="text-[15px] text-[#222222]">{r.title}</div>
              <div className="text-[13px] text-[#717171]">{r.sub}</div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => update(r.key, -1)}
                disabled={count === 0}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7] disabled:opacity-40"
                aria-label={`Decrease ${r.title}`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="w-6 text-center text-[15px]">{count}</div>
              <button
                type="button"
                onClick={() => update(r.key, +1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7]"
                aria-label={`Increase ${r.title}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}