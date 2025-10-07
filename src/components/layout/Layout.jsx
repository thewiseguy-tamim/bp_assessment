import React, { useEffect, useState } from "react";
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
  // legacy centered search modal removed; SearchBar now manages search state locally
  const [showToTop, setShowToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowToTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-md"
      >
        Skip to main content
      </a>

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
      {showPriceToast && <PriceModal position="bottom-left" />}

      {/* Removed legacy centered SearchModal. Search happens inside Navbar SearchBar now. */}

      {/* Scroll-to-top button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="primary"
          size="icon"
          aria-label="Scroll to top"
          onClick={scrollToTop}
          className={`transition-all ${showToTop ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"}`}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}