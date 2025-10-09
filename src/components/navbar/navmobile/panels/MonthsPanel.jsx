import React, { useCallback, useEffect, useMemo, useState } from "react";

const PINK = "#FF385C";

/**
 * MonthsPanel
 * Circular dial to pick 1–12 months.
 *
 * Props:
 * - length: number (1..12) default 3
 * - onChange: (len: number) => void
 * - startDate?: Date (defaults to next month 1st)
 */
export default function MonthsPanel({ length = 3, onChange, startDate }) {
  const [value, setValue] = useState(() => Math.min(12, Math.max(1, length)));

  // IMPORTANT: only depend on `value` to avoid update loops
  useEffect(() => {
    onChange?.(value);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useMemo(() => {
    if (startDate instanceof Date) {
      const d = new Date(startDate);
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [startDate]);

  const end = useMemo(() => {
    const d = new Date(start);
    d.setMonth(d.getMonth() + value);
    return d;
  }, [start, value]);

  const size = 240;
  const radius = 92;
  const center = size / 2;
  const angle = (value / 12) * 360;

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
  };
  const angleFromPoint = (cx, cy, x, y) =>
    (Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90 + 360) % 360;

  const handlePos = polarToCartesian(center, center, radius, angle);

  const beginDrag = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const move = (ev) => {
      const clientX = ev.touches?.[0]?.clientX ?? ev.clientX;
      const clientY = ev.touches?.[0]?.clientY ?? ev.clientY;
      const ang = angleFromPoint(cx, cy, clientX, clientY);
      const months = Math.max(1, Math.min(12, Math.round((ang / 360) * 12)));
      setValue(months);
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
  }, []);

  const fmt = (d) =>
    d.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="px-2">
      <div className="flex items-center justify-center">
        <div
          className="relative"
          style={{ width: size, height: size }}
          onMouseDown={beginDrag}
          onTouchStart={beginDrag}
          role="slider"
          aria-label="Months"
          aria-valuemin={1}
          aria-valuemax={12}
          aria-valuenow={value}
        >
          {/* dial bg */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, #ffffff, #f3f3f3 70%, #e9e9e9)",
              boxShadow: "inset 0 8px 24px rgba(0,0,0,0.08)",
            }}
          />
          {/* progress ring */}
          <div
            className="absolute inset-4 rounded-full"
            style={{
              background: `conic-gradient(${PINK} 0deg, ${PINK} ${angle}deg, #eee ${angle}deg 360deg)`,
              filter: "drop-shadow(0 8px 18px rgba(255,56,92,0.35))",
            }}
          />
          {/* center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-[44px] leading-none font-semibold text-[#222222]">
                {value}
              </div>
              <div className="text-[15px] text-[#717171] -mt-1">months</div>
            </div>
          </div>
          {/* dots */}
          {[...Array(12)].map((_, i) => {
            const p = polarToCartesian(center, center, radius, (i / 12) * 360);
            return (
              <span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-black/15"
                style={{ left: p.x - 3, top: p.y - 3 }}
              />
            );
          })}
          {/* handle */}
          <div
            className="absolute h-8 w-8 rounded-full bg-white border-2 border-white shadow-[0_3px_10px_rgba(0,0,0,0.2)]"
            style={{ left: handlePos.x - 16, top: handlePos.y - 16 }}
          />
        </div>
      </div>

      {/* Range preview */}
      <div className="mt-4 text-center text-[15px]">
        <span className="underline">{fmt(start)}</span>
        <span className="mx-2 text-[#717171]">to</span>
        <span className="underline">{fmt(end)}</span>
      </div>
    </div>
  );
}