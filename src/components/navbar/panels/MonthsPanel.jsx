import React, { useEffect, useMemo, useRef, useState } from "react";

export default function MonthsPanel({ startDate, endDate, setStartDate, setEndDate }) {
  const [months, setMonths] = useState(3);

  const baseStart = useMemo(() => {
    if (startDate) return new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }, [startDate]);

  useEffect(() => {
    const s = baseStart;
    const e = new Date(s.getFullYear(), s.getMonth() + months, 1);
    setStartDate?.(s);
    setEndDate?.(e);
  }, [months, baseStart, setStartDate, setEndDate]);

  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const dialRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Arc config: gap around the bottom like Airbnb
  const START = 30;
  const SWEEP = 300;

  const toAngleFromCenterTop = (cx, cy, x, y) => {
    const rad = Math.atan2(y - cy, x - cx);
    let deg = (rad * 180) / Math.PI; // -180..180, 0 at 3 o’clock
    deg += 90; // top
    if (deg < 0) deg += 360;
    return deg;
  };

  const onPointer = (e) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angleTop = toAngleFromCenterTop(cx, cy, e.clientX, e.clientY);
    let raw = ((angleTop - START + 360) % 360) / SWEEP;
    raw = clamp(raw, 0, 1);
    const snap = Math.max(1, Math.min(12, Math.round(raw * 12)));
    setMonths(snap);
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    onPointer(e);
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  };
  const onPointerUp = () => {
    setDragging(false);
    window.removeEventListener("pointermove", onPointer);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setMonths((m) => clamp(m + 1, 1, 12));
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setMonths((m) => clamp(m - 1, 1, 12));
    }
  };

  // Sizing
  const handleSize = 44;
  const trackInset = 16;
  const [radius, setRadius] = useState(126);
  useEffect(() => {
    const update = () => {
      if (!dialRef.current) return;
      const w = dialRef.current.offsetWidth;
      const r = w / 2 - trackInset - handleSize / 2;
      setRadius(Math.max(70, r));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const angleFromTop = START + (months / 12) * SWEEP;

  const fmt = (d) =>
    new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);

  return (
    <div className="w-[min(920px,calc(100vw-64px))] min-h-[600px]">
      <div className="mb-6 text-center text-[20px] font-semibold text-[#222222]">
        When’s your trip?
      </div>

      <div
        ref={dialRef}
        className="relative mx-auto my-6 h-[340px] w-[340px] select-none rounded-full"
        role="slider"
        aria-label="Select number of months"
        aria-valuemin={1}
        aria-valuemax={12}
        aria-valuenow={months}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        style={{
          background: `
            radial-gradient(120px 120px at 75% 15%, rgba(255,255,255,0.65), rgba(255,255,255,0) 60%),
            radial-gradient(200px 140px at 70% 100%, rgba(255,56,92,0.25), rgba(255,56,92,0) 70%),
            conic-gradient(from -90deg,
              #ff6a88 0deg,
              #ff3e66 ${Math.max(0, angleFromTop - 18)}deg,
              #e11d48 ${angleFromTop}deg,
              rgba(0,0,0,0.06) ${angleFromTop}deg
            )
          `,
          boxShadow:
            "inset 0 18px 40px rgba(0,0,0,.10), inset 0 -10px 18px rgba(0,0,0,.08), 0 10px 30px rgba(0,0,0,.10)",
        }}
      >
        {/* Center puck */}
        <div className="absolute left-1/2 top-1/2 h-[168px] w-[168px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_16px_32px_rgba(0,0,0,.18),_inset_0_-2px_0_rgba(0,0,0,.04)] flex items-center justify-center">
          <div className="text-center">
            <div className="text-[56px] leading-none font-extrabold text-[#111]">{months}</div>
            <div className="mt-1 text-sm text-[#6B7280]">{months === 1 ? "month" : "months"}</div>
          </div>
        </div>

        {/* 12 tick dots */}
        {Array.from({ length: 12 }).map((_, i) => {
          const degFromTop = (i / 12) * 360;
          const rad = (degFromTop * Math.PI) / 180;
          const x = radius * Math.sin(rad);
          const y = -radius * Math.cos(rad);
          const isFilled = i <= months - 1;
          return (
            <span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
                backgroundColor: isFilled ? "rgba(17,24,39,0.35)" : "rgba(17,24,39,0.18)",
              }}
            />
          );
        })}

        {/* Handle */}
        <div
          className={[
            "absolute rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,.25),_inset_0_-2px_0_rgba(0,0,0,.06)] transition-transform",
            dragging ? "cursor-grabbing" : "cursor-grab",
          ].join(" ")}
          style={{
            height: `${handleSize}px`,
            width: `${handleSize}px`,
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) rotate(${angleFromTop - 90}deg) translate(${radius}px) rotate(-${angleFromTop - 90}deg)`,
            border: "5px solid #ff3e66",
            zIndex: 1,
          }}
        />
      </div>

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
