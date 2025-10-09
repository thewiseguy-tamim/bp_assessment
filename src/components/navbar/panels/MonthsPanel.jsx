import React, { useEffect, useMemo, useRef, useState } from "react";

export default function MonthsPanel({ startDate, endDate, setStartDate, setEndDate }) {
  const [months, setMonths] = useState(3);


  const dbg = (...args) => {
    if (typeof window === "undefined") return;
    const enabled = window.__SEARCH_DEBUG__ ?? false;
    if (enabled) console.debug("[MonthsPanel]", ...args);
  };


  const baseStart = useMemo(() => {
    if (startDate) return new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }, [startDate]);


  useEffect(() => {
    const s = baseStart;
    const e = new Date(s.getFullYear(), s.getMonth() + months, 1);
    dbg("sync external dates", { months, start: s, end: e });
    setStartDate?.(s);
    setEndDate?.(e);
  }, [months, baseStart, setStartDate, setEndDate]);

  // Sizing
  const size = 360;              
  const cx = size / 2;
  const cy = size / 2;
  const trackWidth = 28;         
  const handleSize = 44;         
  const outerPad = 12;           

  
  const r = Math.min(cx, cy) - Math.max(trackWidth / 2 + outerPad, handleSize / 2 + outerPad);

  
  const START = 30;            
  const KNOB_OFFSET_DEG = -30; 

  const toRad = (deg) => (deg * Math.PI) / 180;
  const polarTop = (deg) => {
    const rad = toRad(deg - 90); 
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };


  const endTopDegRaw = START + (months / 12) * 360;
  const endTopDeg = endTopDegRaw % 360 || (months === 12 ? 360 : 0);

  const knobDegTop = (endTopDeg + KNOB_OFFSET_DEG + 360) % 360;

  const capCompDeg = (trackWidth * 90) / (Math.PI * r);
  const arcEndDeg = (knobDegTop - capCompDeg + 360) % 360;

 
  const arcPath = () => {
    const s = polarTop(START);
    const e = polarTop(arcEndDeg);
    const delta = (arcEndDeg - START + 360) % 360;
    const largeArc = delta > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };


  const knobPos = polarTop(knobDegTop);

 
  const dialRef = useRef(null);
  const toAngleFromCenterTop = (cx, cy, x, y) => {
    const rad = Math.atan2(y - cy, x - cx);
    let deg = (rad * 180) / Math.PI; 
    deg += 90;                       
    if (deg < 0) deg += 360;
    return deg;                     
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

    const fromStart = (angleTop - START + 360) % 360;
    const snap = Math.min(12, Math.max(1, Math.floor(fromStart / 30) + 1));
    if (snap !== months) dbg("pointer -> months", { angleTop, fromStart, snap });
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
    new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);

  return (
    <div className="w-[min(920px,calc(100vw-64px))]">
      {/* Title */}
      <div className="mt-1 mb-6 text-center text-[20px] sm:text-[22px] font-semibold text-[#222222]">
        When’s your trip?
      </div>

      {/* Dial */}
      <div
        ref={dialRef}
        className="relative mx-auto my-3 cursor-grab active:cursor-grabbing"
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
     
            <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6A88" />
              <stop offset="60%" stopColor="#FF3E66" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
            
            <radialGradient id="ringSheen" cx="25%" cy="8%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            
            <radialGradient id="ringGlow" cx="70%" cy="95%" r="60%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.08" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="rgba(0,0,0,.18)" />
            </filter>
          </defs>

         
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={trackWidth} />

          <path d={arcPath()} fill="none" stroke="url(#pinkGrad)" strokeWidth={trackWidth} strokeLinecap="round" />

   
          <circle cx={cx} cy={cy} r={r + trackWidth / 2} fill="url(#ringGlow)" />
          <circle cx={cx} cy={cy} r={r + trackWidth / 2.2} fill="url(#ringSheen)" />


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


          {Array.from({ length: 12 }).map((_, i) => {
            const degTop = (i / 12) * 360;
            const p = polarTop(degTop);
            const major = i % 3 === 0;
            return <circle key={i} cx={p.x} cy={p.y} r={major ? 3 : 2} fill="rgba(17,24,39,0.28)" />;
          })}

    
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

      <div className="mt-6 mb-2 text-center text-[15px] text-[#222222]">
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