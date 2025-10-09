import React, { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

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
 * - animateText?: boolean (default: true)
 * - accentColor?: string (default: "#FF385C")
 */
export default function WelcomeModal({
  open,
  onClose,
  sessionKey = "welcome_modal_shown",
  scrollDismissThreshold = 100,
  showOncePerSession = true,
  animateText = true,
  accentColor = "#FF385C",
}) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const cardRef = useRef(null);
  const timerRef = useRef(null);
  const reducedMotionRef = useRef(false);

  const controlled = typeof open === "boolean";
  const message = "Now you’ll see one price for your trip, all fees included.";

  // Determine prefers-reduced-motion (no try/catch needed here)
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } else {
      reducedMotionRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (controlled) {
      setRender(open);
      requestAnimationFrame(() => setVisible(open));
      return;
    }
    const already = showOncePerSession
      ? (typeof sessionStorage !== "undefined" &&
          sessionStorage.getItem(sessionKey) === "1")
      : false;

    if (!already) {
      setRender(true);
      requestAnimationFrame(() => setVisible(true));
    }
  }, [controlled, open, sessionKey, showOncePerSession]);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => setRender(false), 200);
    if (showOncePerSession) {
      try {
        sessionStorage.setItem(sessionKey, "1");
      } catch (err) {
        // sessionStorage can throw (e.g., Safari private mode)
        void err;
      }
    }
    onClose?.();
  }, [onClose, sessionKey, showOncePerSession]);

  // ESC support
  useEffect(() => {
    if (!render) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [render, close]); // include close

  // Dismiss on scroll
  useEffect(() => {
    if (!render) return;
    const onScroll = () => {
      if (window.scrollY > scrollDismissThreshold) close();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [render, scrollDismissThreshold, close]); // include close

  // Type-in animation
  useEffect(() => {
    if (!render) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!animateText || reducedMotionRef.current) {
      setTypedText(message);
      return;
    }

    setTypedText("");
    let i = 0;
    const speed = 18; // ms per char

    const tick = () => {
      i += 1;
      setTypedText(message.slice(0, i));
      if (i < message.length) {
        timerRef.current = setTimeout(tick, speed);
      }
    };
    timerRef.current = setTimeout(tick, 160);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [render, animateText, message]);

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
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={cardRef}
        className={`relative z-10 w-full max-w-sm rounded-2xl p-6 shadow-[0_30px_80px_rgba(0,0,0,0.2)] ring-1 ring-black/5 transition-all duration-200
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{
          background:
            "linear-gradient(0deg, rgba(255,255,255,0.8), rgba(255,255,255,0.8)), #F6F1EB",
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#222] hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-4 mt-6 flex items-center justify-center">
          <PriceTagIcon size={200} accent={accentColor} />
        </div>

        <h2
          id="welcome-title"
          className="text-center text-[20px] font-semibold leading-snug text-[#222222] mx-auto"
          style={{
            fontFamily:
              "Circular, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            maxWidth: 320,
            minHeight: 48,
          }}
        >
          <span aria-hidden="true">{typedText}</span>
          <span className="sr-only">{message}</span>
        </h2>

        <div className="mt-6">
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

function PriceTagIcon({ size = 60, accent = "#FF385C" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#FF2E83" />
        </linearGradient>
        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.22" />
        </filter>
      </defs>
      <g transform="rotate(-10 32 32)" filter="url(#shadow)">
        <path
          d="M14 20a6 6 0 0 1 6-6h18l10 10v18a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V20z"
          fill="url(#grad)"
        />
        <path d="M38 14l10 10h-8a2 2 0 0 1-2-2v-8z" fill="#FF6B8D" />
        <circle cx="24" cy="24" r="4.5" fill="white" opacity="0.9" />
        <circle cx="24" cy="24" r="2.6" fill="#E6E6E6" />
        <circle cx="24" cy="24" r="1.2" fill="#C9C9C9" />
        <path
          d="M16 28c10-6 22-8 30-6"
          stroke="url(#shine)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}