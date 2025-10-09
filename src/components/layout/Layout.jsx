import React, { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "../navbar/Navbar";
import FooterSection from "../sections/FooterSection";
import WelcomeModal from "../modals/WelcomeModal";
import PriceModal from "../modals/PriceModal";
import Button from "../common/Button";
import { ChevronUp } from "lucide-react";

/**
 * Layout
 * - Global app shell with Navbar, optional Footer, and portal modals
 * - Includes Skip link for accessibility
 * - Scroll-to-top button appears after 500px
 *
 * Props:
 * - children
 * - showFooter?: boolean (default: true)
 * - showWelcome?: boolean (default: true; WelcomeModal shows once per session)
 * - showPriceToast?: boolean (default: true; toast shows once per session)
 */
export default function Layout({
  children,
  showFooter = true,
  showWelcome = true,
  showPriceToast = true,
}) {
  const [showToTop, setShowToTop] = useState(false);

  // Scroll-driven fade for PriceModal
  const [priceOpacity, setPriceOpacity] = useState(1);
  const [priceHidden, setPriceHidden] = useState(false);
  const hiddenRef = useRef(false);
  const startY = useRef(0);
  const raf = useRef(null);

  const lockHidden = useCallback(() => {
    hiddenRef.current = true;
    setPriceHidden(true);
    setPriceOpacity(0);
  }, []);

  useEffect(() => {
    // initial position
    startY.current = window.scrollY || 0;
    const maxFadePx = 200; // distance to fully fade out (tweak as needed)

    const onScroll = () => {
      setShowToTop(window.scrollY > 500);
      if (hiddenRef.current) return; // already locked hidden

      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const deltaDown = Math.max(0, y - startY.current);
        const next = Math.max(0, Math.min(1, 1 - deltaDown / maxFadePx));

        if (next <= 0.01) {
          // fully faded → lock hidden until reload
          lockHidden();
        } else {
          setPriceOpacity(next);
        }

        raf.current = null;
      });
    };

    // Initialize once
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [lockHidden]);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      {/* Header */}
      <Navbar />

      {/* Main content */}
      <main id="main-content" className="relative">
        {children}
      </main>

      {/* Footer */}
      {showFooter && <FooterSection />}

      {/* Modals shown once per session (internally managed) */}
      {showWelcome && <WelcomeModal />}

      {/* Price toast: bottom-center, fades with scroll, locks hidden after fade */}
      {showPriceToast && !priceHidden && (
        <PriceModal
          position="bottom-center"
          offsetBottom={32} // move it a little up from bottom (px)
          scrollOpacity={priceOpacity}
        />
      )}

      {/* Scroll-to-top button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="primary"
          size="icon"
          aria-label="Scroll to top"
          onClick={scrollToTop}
          className={`transition-all ${
            showToTop
              ? "opacity-100 translate-y-0"
              : "pointer-events-none opacity-0 translate-y-2"
          }`}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}