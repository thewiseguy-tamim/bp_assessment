import React, { useEffect, useMemo, useRef, useState } from "react";

export default function MonthsPanel({ startDate, endDate, setStartDate, setEndDate }) {
  const [months, setMonths] = useState(3);

  // Base start: next month if none selected
  const baseStart = useMemo(() => {
    if (startDate) return new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }, [startDate]);

  // Keep external state in sync
  useEffect(() => {
    const s = baseStart;
    const e = new Date(s.getFullYear(), s.getMonth() + months, 1);
    setStartDate?.(s);
    setEndDate?.(e);
  }, [months, baseStart, setStartDate, setEndDate]);

  // Dial sizing/styling
  const size = 340;            // SVG viewport size
  const cx = size / 2;
  const cy = size / 2;
  const trackWidth = 28;       // ring thickness
  const handleSize = 44;       // knob diameter
  const outerPad = 10;         // padding for glow/shadow

  // Compute radius so ring + knob stay inside viewport
  const r = Math.min(cx, cy) - Math.max(trackWidth / 2 + outerPad, handleSize / 2 + outerPad);

  // Angles (0° = 12 o’clock, positive clockwise)
  const START = 30;            // 1 o’clock (degrees from top)
  const KNOB_OFFSET_DEG = -30; // move knob back 30° from arc end (your request)

  const toRad = (deg) => (deg * Math.PI) / 180;
  const polarTop = (deg) => {
    const rad = toRad(deg - 90); // convert top-based to standard cos/sin (0° = right)
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // Arc end from top; months=12 => 12 o’clock
  const endTopDegRaw = START + (months / 12) * 360; // 30..390
  const endTopDeg = endTopDegRaw % 360 || (months === 12 ? 360 : 0);
  const fullRing = months === 12;

  // Gapless arc path: full circle is two 180° arcs
  const arcPath = () => {
    if (fullRing) {
      const s = polarTop(START);
      const midDeg = START + 180;
      const m = polarTop(midDeg);
      const e = polarTop(START + 360);
      return [
        `M ${s.x} ${s.y} A ${r} ${r} 0 1 1 ${m.x} ${m.y}`,
        `A ${r} ${r} 0 1 1 ${e.x} ${e.y}`,
      ].join(" ");
    }
    const s = polarTop(START);
    const e = polarTop(endTopDeg);
    const delta = (endTopDeg - START + 360) % 360;
    const largeArc = delta > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  // Knob position: 30° behind arc end
  const knobDegTop = (endTopDeg + KNOB_OFFSET_DEG + 360) % 360;
  const knobPos = polarTop(knobDegTop);

  // Dragging -> months (snap to sectors so 12 o’clock is 12)
  const dialRef = useRef(null);
  const toAngleFromCenterTop = (cx, cy, x, y) => {
    const rad = Math.atan2(y - cy, x - cx);
    let deg = (rad * 180) / Math.PI; // -180..180 (0 at 3 o’clock)
    deg += 90;                       // move 0 to 12 o’clock
    if (deg < 0) deg += 360;
    return deg;                      // 0..360 from top
  };

  const onPointer = (e) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const angleTop = toAngleFromCenterTop(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      e.clientX,
      e.clientY
    );

    // Map 1 o’clock to 0°, then snap 30° sectors:
    // [0,30) -> 1, [30,60) -> 2, ..., [330,360) -> 12
    const fromStart = (angleTop - START + 360) % 360;
    const snap = Math.min(12, Math.max(1, Math.floor(fromStart / 30) + 1));
    setMonths(snap);
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    onPointer(e);
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  };
  const onPointerUp = () => {
    window.removeEventListener("pointermove", onPointer);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setMonths((m) => Math.min(12, m + 1));
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setMonths((m) => Math.max(1, m - 1));
    }
  };

  const fmt = (d) =>
    new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(d);

  return (
    <div className="w-[min(920px,calc(100vw-64px))] min-h-[600px]">
      <div className="mb-6 text-center text-[20px] font-semibold text-[#222222]">When’s your trip?</div>

      <div
        ref={dialRef}
        className="relative mx-auto my-6 cursor-grab active:cursor-grabbing"
        style={{ width: size, height: size, touchAction: "none" }}
        role="slider"
        aria-label="Select number of months"
        aria-valuemin={1}
        aria-valuemax={12}
        aria-valuenow={months}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            {/* bright ring gradient */}
            <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6A88" />
              <stop offset="60%" stopColor="#FF3E66" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
            {/* glossy highlight */}
            <radialGradient id="ringSheen" cx="25%" cy="8%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            {/* bottom glow */}
            <radialGradient id="ringGlow" cx="70%" cy="95%" r="60%">
              <stop offset="0%" stopColor="rgba(255,56,92,0.25)" />
              <stop offset="70%" stopColor="rgba(255,56,92,0)" />
            </radialGradient>
            <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="rgba(0,0,0,.18)" />
            </filter>
          </defs>

          {/* base grey ring */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={trackWidth} />

          {/* pink arc (gapless, round caps) */}
          <path d={arcPath()} fill="none" stroke="url(#pinkGrad)" strokeWidth={trackWidth} strokeLinecap="round" />

          {/* sheen + glow */}
          <circle cx={cx} cy={cy} r={r + trackWidth / 2} fill="url(#ringGlow)" />
          <circle cx={cx} cy={cy} r={r + trackWidth / 2.2} fill="url(#ringSheen)" />

          {/* center puck */}
          <g filter="url(#softShadow)">
            <circle cx={cx} cy={cy} r={84} fill="#fff" />
          </g>
          <foreignObject x={cx - 84} y={cy - 84} width="168" height="168">
            <div className="w-full h-full flex items-center justify-center text-center">
              <div>
                <div className="text-[56px] leading-none font-extrabold text-[#111]">{months}</div>
                <div className="mt-1 text-sm text-[#6B7280]">{months === 1 ? "month" : "months"}</div>
              </div>
            </div>
          </foreignObject>

          {/* 12 tick dots */}
          {Array.from({ length: 12 }).map((_, i) => {
            const degTop = (i / 12) * 360; // 0..360 from top
            const p = polarTop(degTop);
            const major = i % 3 === 0;
            return <circle key={i} cx={p.x} cy={p.y} r={major ? 3 : 2} fill="rgba(17,24,39,0.28)" />;
          })}

          {/* knob 30° behind arc end */}
          <g transform={`translate(${knobPos.x}, ${knobPos.y})`}>
            <circle
              r={handleSize / 2}
              fill="#fff"
              stroke="#ff3e66"
              strokeWidth="5"
              style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,.25))" }}
            />
          </g>
        </svg>
      </div>

      {/* date preview */}
      <div className="mt-6 text-center text-[15px] text-[#222222]">
        <span className="underline underline-offset-[6px] decoration-[1.5px] decoration-black/60">
          {fmt(startDate || baseStart)}
        </span>
        <span className="mx-2 text-[#717171]">to</span>
        <span className="underline underline-offset-[6px] decoration-[1.5px] decoration-black/60">
          {fmt(endDate || new Date(baseStart.getFullYear(), baseStart.getMonth() + months, 1))}
        </span>
      </div>
    </div>
  );
}