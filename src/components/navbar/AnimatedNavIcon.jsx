import React, { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import Badge from "../common/Badge";

/**
 * AnimatedNavIcon
 * - Lottie animation that plays on hover, and plays once on active state
 * - Active state shows an underline indicator
 * - Provide either `animationData` or a `src` to a JSON file in /public/animations
 *
 * Props:
 * - label: string
 * - active: boolean
 * - onClick: () => void
 * - animationData?: object
 * - src?: string (e.g. "/animations/home-icon.json")
 * - size?: number (icon box size in px, default 28)
 * - showNew?: boolean (shows "NEW" badge)
 * - className?: string
 */
export default function AnimatedNavIcon({
  label,
  active = false,
  onClick,
  animationData,
  src,
  size = 28,
  showNew = false,
  className = "",
}) {
  const lottieRef = useRef(null);
  const [data, setData] = useState(animationData || null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!animationData && src) {
      fetch(src)
        .then((r) => r.json())
        .then((json) => {
          if (mounted) setData(json);
        })
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, [src, animationData]);

  useEffect(() => {
  
    if (active && lottieRef.current) {
      try {
        lottieRef.current.goToAndPlay(0, true);
      } catch {console.error();
      }
    }
  }, [active]);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => {
        setHovered(true);
        try {
          lottieRef.current?.play?.();
        } catch {console.error();}
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (!active) {
          try {
            lottieRef.current?.stop?.();
          } catch {console.error();}
        }
      }}
      className={`group relative inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 ${className}`}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`shrink-0 transition-colors ${
          active ? "text-black" : "text-[#717171] group-hover:text-black"
        }`}
        style={{ width: size, height: size }}
      >
        {data ? (
          <Lottie
            lottieRef={lottieRef}
            animationData={data}
            autoplay={active}
            loop={hovered}
            style={{ width: size, height: size }}
          />
        ) : (
          <span className="block h-full w-full rounded-md bg-neutral-200 animate-pulse" />
        )}
      </span>
      <span
        className={`text-[15px] font-medium transition-colors ${
          active ? "text-black" : "text-[#717171] group-hover:text-black"
        }`}
      >
        {label}
      </span>
      {showNew && (
        <Badge size="sm" variant="neutral" className="-translate-y-1">
          NEW
        </Badge>
      )}

      {active && (
        <span className="pointer-events-none absolute -bottom-2 left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-full bg-black" />
      )}
    </button>
  );
}