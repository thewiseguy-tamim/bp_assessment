import React, { useEffect, useState } from "react";
import { Tag, X } from "lucide-react";

/**
 * PriceModal (small toast)
 * - Small floating chip: "Prices include all fees"
 * - Bottom-left by default
 *
 * Props:
 * - open?: boolean (default uncontrolled with auto showing)
 * - onClose?: () => void
 * - sessionKey?: string (default: "price_modal_seen")
 * - showOncePerSession?: boolean (default: true)
 * - autoHideMs?: number | null (default: null)
 * - position?: "bottom-left" | "bottom-right" (default: "bottom-left")
 */
export default function PriceModal({
  open,
  onClose,
  sessionKey = "price_modal_seen",
  showOncePerSession = true,
  autoHideMs = null,
  position = "bottom-left",
}) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const controlled = typeof open === "boolean";

  useEffect(() => {
    if (controlled) {
      setRender(open);
      requestAnimationFrame(() => setVisible(open));
      return;
    }
    const seen = showOncePerSession
      ? sessionStorage.getItem(sessionKey) === "1"
      : false;
    if (!seen) {
      setRender(true);
      requestAnimationFrame(() => setVisible(true));
      if (autoHideMs) {
        const t = setTimeout(() => handleClose(), autoHideMs);
        return () => clearTimeout(t);
      }
    }
  }, [controlled, open, sessionKey, showOncePerSession, autoHideMs]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setRender(false), 160);
    if (showOncePerSession) {
      try {
        sessionStorage.setItem(sessionKey, "1");
      } catch {}
    }
    onClose?.();
  };

  if (!render) return null;

  const posClass =
    position === "bottom-right"
      ? "right-4 bottom-4"
      : "left-4 bottom-4";

  return (
    <div
      className={`fixed ${posClass} z-[65] transition-all ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg ring-1 ring-black/5">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FF385C]/10">
          <Tag className="h-4 w-4 text-[#FF385C]" />
        </div>
        <div className="text-[13px] font-medium text-[#222222]">
          Prices include all fees
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={handleClose}
          className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
        >
          <X className="h-4 w-4 text-[#717171]" />
        </button>
      </div>
    </div>
  );
}