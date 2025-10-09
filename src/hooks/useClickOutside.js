import { useEffect } from "react";


export default function useClickOutside(refOrRefs, handler, options = {}) {
  const {
    ignore = [],
    disabled = false,
    detectEscape = true,
    events = ["mousedown", "touchstart"],
  } = options;

  useEffect(() => {
    if (disabled) return;
    if (typeof document === "undefined") return;

    const refs = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs];
    const ignoreRefs = Array.isArray(ignore) ? ignore : [ignore];

    const isInRefs = (target, list) =>
      list.some((r) => r?.current && r.current.contains(target));

    const onEvent = (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;

      if (isInRefs(target, refs)) return;

      if (ignoreRefs.length && isInRefs(target, ignoreRefs)) return;

      handler?.(e);
    };

    events.forEach((ev) => document.addEventListener(ev, onEvent, true));

    const onKey = (e) => {
      if (detectEscape && e.key === "Escape") handler?.(e);
    };
    if (detectEscape) document.addEventListener("keydown", onKey);

    return () => {
      events.forEach((ev) => document.removeEventListener(ev, onEvent, true));
      if (detectEscape) document.removeEventListener("keydown", onKey);
    };
  }, [refOrRefs, handler, ignore, disabled, detectEscape, events]);
}