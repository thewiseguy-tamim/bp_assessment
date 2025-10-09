import React, { useEffect, useMemo, useRef, useState } from "react";
import Lottie from "lottie-react";

/**
 * AnimatedNavIcon
 * Lottie wrapper with safe fallbacks and simple controls.
 *
 * Props:
 * - animationData: object (required for animation)
 * - size?: number (px) default 32
 * - active?: boolean (plays when true)
 * - loop?: boolean (default: true)
 * - playOnHover?: boolean (default: false) — if true, plays on hover
 * - className?: string
 * - fallback?: ReactNode (rendered if Lottie fails or missing data)
 * - ariaLabel?: string
 */
export default function AnimatedNavIcon({
  animationData,
  size = 32,
  active = false,
  loop = true,
  playOnHover = false,
  className = "",
  fallback = null,
  ariaLabel,
}) {
  const lottieRef = useRef(null);
  const [canAnimate, setCanAnimate] = useState(Boolean(animationData));
  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  useEffect(() => {
    if (!lottieRef.current || !canAnimate) return;
    if (prefersReduced) {
      lottieRef.current.stop?.();
      return;
    }
    if (active) lottieRef.current.play?.();
    else lottieRef.current.stop?.();
  }, [active, canAnimate, prefersReduced]);

  const onError = () => setCanAnimate(false);

  const handleMouseEnter = () => {
    if (!canAnimate || !playOnHover || prefersReduced) return;
    lottieRef.current?.play?.();
  };
  const handleMouseLeave = () => {
    if (!canAnimate || !playOnHover) return;
    if (!active) lottieRef.current?.stop?.();
  };

  if (!canAnimate || !animationData) {
    return (
      <span
        aria-label={ariaLabel}
        className={className}
        style={{ width: size, height: size, display: "inline-flex" }}
      >
        {fallback}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{ width: size, height: size, display: "inline-flex" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={active && !prefersReduced}
        onError={onError}
        style={{ width: size, height: size }}
      />
    </span>
  );
}