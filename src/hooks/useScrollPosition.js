import { useEffect, useRef, useState } from "react";


export default function useScrollPosition(options = {}) {
  const {
    threshold = 2,          
    scrolledThreshold = 50, 
  } = options;

  const [state, setState] = useState({
    x: 0,
    y: 0,
    direction: null, 
    atTop: true,
    atBottom: false,
    isScrolled: false,
    progress: 0, 
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