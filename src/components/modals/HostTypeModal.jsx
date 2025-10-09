import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Lottie from "lottie-react";
import homesAnim from "../../assets/homes.json";
import balloonAnim from "../../assets/baloon.json";
import bellAnim from "../../assets/bell.json";

const cls = (...a) => a.filter(Boolean).join(" ");

const OPTIONS = [
  { id: "homes", title: "Home", anim: homesAnim },
  { id: "experiences", title: "Experience", anim: balloonAnim },
  { id: "services", title: "Service", anim: bellAnim },
];

const cardClasses = (active) =>
  cls(
    "flex h-full flex-col items-center justify-center rounded-2xl p-8 text-center transition-all",
    "border border-transparent hover:border-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
    active ? "border-black ring-1 ring-black" : ""
  );

export default function HostTypeModal({
  open,
  onClose,
  initialSelected,
  onPick,
  autoCloseOnNext = true,
  title = "What would you like to host?",
}) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(initialSelected || null);
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setSelected(initialSelected || null), [initialSelected]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Enter" && selected) handleNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const idx = OPTIONS.findIndex((o) => o.id === selected);
        const nextIdx = idx === -1 ? 0 : (idx + (e.key === "ArrowRight" ? 1 : -1) + OPTIONS.length) % OPTIONS.length;
        setSelected(OPTIONS[nextIdx].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, selected]);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => closeBtnRef.current?.focus(), 0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onOverlayMouseDown = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  if (!open || !mounted) return null;

  const handleNext = () => {
    if (!selected) return;
    onPick?.(selected);
    if (autoCloseOnNext) onClose?.();
  };

  const dialogStyle = {
    width: "clamp(720px, 84vw, 1120px)",
    aspectRatio: "0 / 0.5",
    maxHeight: "85vh",
  };

  const nextDisabled = !selected;

  const modal = (
    <div
      ref={overlayRef}
      onMouseDown={onOverlayMouseDown}
      className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-[1px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="host-type-title"
        style={dialogStyle}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto flex h-auto flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl ring-1 ring-black/5"
      >
        <div className="flex items-center justify-between px-6 pt-4">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[#222222]" />
          </button>
          <div id="host-type-title" className="text-center text-[22px] font-semibold text-[#222222]">
            {title}
          </div>
          <div className="h-9 w-9" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {OPTIONS.map((opt) => {
              const active = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={cardClasses(active)}
                  onClick={() => setSelected(opt.id)}
                >
                  <div className="mb-6 flex items-center justify-center">
                    <Lottie animationData={opt.anim} loop autoplay style={{ width: 110, height: 110 }} />
                  </div>
                  <div className="text-[16px] font-semibold text-[#222222]">{opt.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#EBEBEB] bg-white/70 px-6 py-4">
          <div />
          <button
            type="button"
            onClick={handleNext}
            disabled={nextDisabled}
            className={cls(
              "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-[15px] font-semibold",
              nextDisabled ? "bg-[#EBEBEB] text-[#A5A5A5] cursor-not-allowed" : "bg-black text-white hover:bg-black/90"
            )}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}