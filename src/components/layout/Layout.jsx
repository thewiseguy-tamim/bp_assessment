import React, { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "../navbar/Navbar";
import FooterSection from "../sections/FooterSection";
import WelcomeModal from "../modals/WelcomeModal";
import PriceModal from "../modals/PriceModal";
import Button from "../common/Button";
import { ChevronUp } from "lucide-react";

// Mobile
import NavbarMobile from "../navbar/navmobile/NavbarMobile";
import BottomNavMob from "../navbar/navmobile/BottomNav(mob)";

function useIsMobile(breakpoint = 1024) {
  const get = () =>
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
      : false;
  const [isMobile, setIsMobile] = useState(get);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
    setIsMobile(mq.matches);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange);
    };
  }, [breakpoint]);
  return isMobile;
}

export default function Layout({
  children,
  showFooter = true,
  showWelcome = true,
  showPriceToast = true,
}) {
  const isMobile = useIsMobile();

  // Scroll-to-top visibility
  const [showToTop, setShowToTop] = useState(false);

  // Bottom nav hide on scroll down
  const [hideBottomNav, setHideBottomNav] = useState(false);

  // Price toast fade with scroll
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

  // Price toast + scroll-to-top
  useEffect(() => {
    startY.current = window.scrollY || 0;
    const maxFadePx = 200;
    const onScroll = () => {
      setShowToTop(window.scrollY > 500);
      if (hiddenRef.current) return;
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        const y = window.scrollY || 0;
        const deltaDown = Math.max(0, y - startY.current);
        const next = Math.max(0, Math.min(1, 1 - deltaDown / maxFadePx));
        if (next <= 0.01) lockHidden();
        else setPriceOpacity(next);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [lockHidden]);

  // Detect scroll direction to hide/show bottom nav
  useEffect(() => {
    let lastY = window.scrollY || 0;
    const onScrollDir = () => {
      const y = window.scrollY || 0;
      const goingDown = y > lastY;
      // Hide when scrolling down beyond small threshold, show when scrolling up
      if (goingDown && y > 80) {
        setHideBottomNav(true);
      } else if (!goingDown) {
        setHideBottomNav(false);
      }
      // Always show near top
      if (y < 12) setHideBottomNav(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScrollDir, { passive: true });
    return () => window.removeEventListener("scroll", onScrollDir);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      {/* Desktop header (component hides itself on mobile via lg breakpoint) */}
      <Navbar />

      {/* Mobile header (controls its own modal internally) */}
      <div className="lg:hidden">
        <NavbarMobile onSearchSubmit={(data) => {
          // Optional: global search handling
        }}/>
      </div>

      {/* Main content */}
      <main
        id="main-content"
        className="relative"
        style={{
          paddingBottom: isMobile
            ? "calc(env(safe-area-inset-bottom, 0px) + 80px)"
            : undefined,
        }}
      >
        {children}
      </main>

      {/* Footer (hide on mobile if desired with `hidden lg:block`) */}
      {showFooter && <FooterSection />}

      {/* First-visit/once modals */}
      {showWelcome && <WelcomeModal />}

      {/* Price toast (kept above BottomNav on mobile) */}
      {showPriceToast && !priceHidden && (
        <PriceModal
          position="bottom-center"
          offsetBottom={isMobile ? 96 : 32}
          scrollOpacity={priceOpacity}
        />
      )}

      {/* Bottom navigation (mobile only). Fades/slides away on scroll down. */}
      <BottomNavMob hidden={hideBottomNav} />

      {/* Scroll-to-top */}
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