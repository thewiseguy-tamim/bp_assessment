import React, { useEffect, useState, useCallback } from "react";
import { Tag } from "lucide-react";

/**
 * PriceModal (small toast)
 * - Small floating chip: "Prices include all fees"
 *
 * Props:
 * - open?: boolean (default uncontrolled with auto showing)
 * - visible?: boolean (optional external visibility control)
 * - scrollOpacity?: number (0..1) => multiplies final opacity (for scroll-fade)
 * - onClose?: () => void
 * - sessionKey?: string (default: "price_modal_seen")
 * - showOncePerSession?: boolean (default: true)
 * - autoHideMs?: number | null (default: null)
 * - position?: "bottom-left" | "bottom-right" | "bottom-center" | "center"
 * - offsetBottom?: number (px, applied when position starts with "bottom-")
 */
export default function PriceModal({
  open,
  visible: visibleProp,
  scrollOpacity,
  onClose,
  sessionKey = "price_modal_seen",
  showOncePerSession = true,
  autoHideMs = null,
  position = "bottom-left",
  offsetBottom = 32, // px; moves the toast up from the bottom
}) {
  const [render, setRender] = useState(false);
  const [entered, setEntered] = useState(false);

  const controlledOpen = typeof open === "boolean";
  const controlledVisible = typeof visibleProp === "boolean";

  const handleClose = useCallback(() => {
    // close permanently and mark session
    setEntered(false);
    setTimeout(() => setRender(false), 160);
    if (showOncePerSession) {
      try {
        sessionStorage.setItem(sessionKey, "1");
      } catch {
        // ignore sessionStorage errors
      }
    }
    onClose?.();
  }, [showOncePerSession, sessionKey, onClose]);

  useEffect(() => {
    if (controlledOpen) {
      setRender(open);
      requestAnimationFrame(() => setEntered(open));
      return;
    }

    const seen = showOncePerSession
      ? sessionStorage.getItem(sessionKey) === "1"
      : false;

    if (!seen) {
      setRender(true);
      requestAnimationFrame(() => setEntered(true));

      if (autoHideMs) {
        const t = setTimeout(() => handleClose(), autoHideMs);
        return () => clearTimeout(t);
      }
    }
  }, [controlledOpen, open, showOncePerSession, sessionKey, autoHideMs, handleClose]);

  if (!render) return null;

  const isBottom = position.startsWith("bottom-");
  const posBase =
    {
      "bottom-left": "left-4",
      "bottom-right": "right-4",
      "bottom-center": "left-1/2 -translate-x-1/2",
      center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    }[position] || "left-4";

  // Base visibility (mount/show) multiplied by scroll-driven opacity
  const baseOpacity = controlledVisible ? (visibleProp ? 1 : 0) : entered ? 1 : 0;
  const so = typeof scrollOpacity === "number" ? Math.max(0, Math.min(1, scrollOpacity)) : 1;
  const finalOpacity = baseOpacity * so;
  const pointer = finalOpacity < 0.05 ? "none" : "auto";

  return (
    <div
      className={`fixed ${posBase} z-[65]`}
      style={{
        bottom: isBottom
          ? `calc(${offsetBottom}px + env(safe-area-inset-bottom))`
          : undefined,
      }}
      role="status"
      aria-live="polite"
    >
      {/* Inner wrapper handles the fade so position transforms aren't overridden */}
      <div
        className="will-change-[opacity] transition-opacity duration-150 ease-linear"
        style={{ opacity: finalOpacity, pointerEvents: pointer }}
      >
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg ring-1 ring-black/5 text-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FF385C]/10">
            <Tag className="h-4 w-4 text-[#FF385C]" />
          </div>
          <div className="text-[15px] font-medium text-[#222222]">
            Prices include all fees
          </div>
        </div>
      </div>
    </div>
  );
}