import React, { useEffect, useRef, useState } from "react";
import { Tag, X } from "lucide-react";

/**
 * WelcomeModal
 * - Shows once per session (sessionStorage) by default
 * - Dismiss: "Got it", click outside, scroll > threshold, or ESC
 * - Centered modal with fade/scale transitions
 *
 * Props:
 * - open?: boolean (if provided, component becomes controlled)
 * - onClose?: () => void
 * - sessionKey?: string (default: "welcome_modal_shown")
 * - scrollDismissThreshold?: number (default: 100)
 * - showOncePerSession?: boolean (default: true)
 */
export default function WelcomeModal({
  open,
  onClose,
  sessionKey = "welcome_modal_shown",
  scrollDismissThreshold = 100,
  showOncePerSession = true,
}) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);

  const controlled = typeof open === "boolean";

  useEffect(() => {
    if (controlled) {
      setRender(open);
      requestAnimationFrame(() => setVisible(open));
      return;
    }
    const already = showOncePerSession
      ? sessionStorage.getItem(sessionKey) === "1"
      : false;

    if (!already) {
      setRender(true);
      requestAnimationFrame(() => setVisible(true));
    }
  }, [controlled, open, sessionKey, showOncePerSession]);

  // ESC support
  useEffect(() => {
    if (!render) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [render]);

  // Dismiss on scroll
  useEffect(() => {
    if (!render) return;
    const onScroll = () => {
      if (window.scrollY > scrollDismissThreshold) close();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [render, scrollDismissThreshold]);

  const close = () => {
    setVisible(false);
    setTimeout(() => setRender(false), 180);
    if (showOncePerSession) {
      try {
        sessionStorage.setItem(sessionKey, "1");
      } catch {}
    }
    onClose?.();
  };

  const onBackdropClick = (e) => {
    if (!cardRef.current) return;
    if (!cardRef.current.contains(e.target)) close();
  };

  if (!render) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      onMouseDown={onBackdropClick}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={cardRef}
        className={`relative z-10 w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5 transition-all ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
        >
          <X className="h-5 w-5 text-[#222222]" />
        </button>

        <div className="mx-auto mb-3 mt-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FF385C]/10">
          <Tag className="h-8 w-8 text-[#FF385C]" />
        </div>

        <h2
          id="welcome-title"
          className="text-center text-[20px] font-semibold text-[#222222]"
          style={{ fontFamily: "Circular, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
        >
          Now you’ll see one price for your trip, all fees included.
        </h2>

        <div className="mt-5">
          <button
            type="button"
            onClick={close}
            className="w-full rounded-full bg-black px-4 py-3 text-center text-[15px] font-medium text-white transition hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}