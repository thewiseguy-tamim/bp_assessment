import { useEffect, useRef, useState } from "react";

/**
 * useScrollPosition
 * - Tracks window scroll position with rAF for performance
 * - Provides direction, top/bottom flags, and a handy isScrolled boolean
 *
 * Usage:
 * const { y, direction, isScrolled } = useScrollPosition({ scrolledThreshold: 50 });
 */
export default function useScrollPosition(options = {}) {
  const {
    threshold = 2,          // minimal delta to change direction
    scrolledThreshold = 50, // y > scrolledThreshold => isScrolled (for navbar)
  } = options;

  const [state, setState] = useState({
    x: 0,
    y: 0,
    direction: null, // "up" | "down" | null
    atTop: true,
    atBottom: false,
    isScrolled: false,
    progress: 0, // 0..1 scroll progress of the page
  });

  const frame = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });
  const dirRef = useRef(null);
  const lastDirY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const read = () => {
      const x =
        window.pageXOffset ??
        document.documentElement.scrollLeft ??
        document.body.scrollLeft ??
        0;
      const y =
        window.pageYOffset ??
        document.documentElement.scrollTop ??
        document.body.scrollTop ??
        0;

      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const atTop = y <= 0;
      const atBottom = y >= maxScroll - 1;
      const isScrolled = y > scrolledThreshold;

      // Direction with small movement threshold
      let direction = dirRef.current;
      if (Math.abs(y - lastDirY.current) >= threshold) {
        direction = y > lastPos.current.y ? "down" : "up";
        dirRef.current = direction;
        lastDirY.current = y;
      }

      lastPos.current = { x, y };
      setState({
        x,
        y,
        direction,
        atTop,
        atBottom,
        isScrolled,
        progress: Math.min(1, Math.max(0, y / maxScroll)),
      });
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = 0;
        read();
      });
    };

    const onResize = onScroll;

    // Initial read
    read();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [scrolledThreshold, threshold]);

  return state;
}