import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import useScrollPosition from "../../hooks/useScrollPosition";

// How many pixels of scroll collapses the search width fully
const MORPH_RANGE = 140;

export default function Navbar() {
  const { isScrolled } = useScrollPosition({ scrolledThreshold: 1 });
  const [activeTab, setActiveTab] = useState("homes");

  // When scrolled, clicking the pill expands (overrides scroll for a moment)
  const [forceExpanded, setForceExpanded] = useState(false);

  // Smooth 0..1 progress from scroll
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY || 0;
        const t = Math.min(1, Math.max(0, y / MORPH_RANGE));
        setProgress(t);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // If user returns to top, disable forceExpanded
  useEffect(() => {
    if (!isScrolled) setForceExpanded(false);
  }, [isScrolled]);

  const handleCompactClick = useCallback(() => {
    // Expand back by scrolling to top; remove if you don’t want the auto-scroll
    window.scrollTo({ top: 0, behavior: "smooth" });
    setForceExpanded(true);
  }, []);

  const desktopProps = useMemo(
    () => ({
      activeTab,
      onChangeTab: setActiveTab,
      // If forceExpanded, treat progress like 0 (fully wide)
      progress: forceExpanded ? 0 : progress,
      onCompactClick: handleCompactClick,
    }),
    [activeTab, progress, forceExpanded, handleCompactClick]
  );

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm shadow-sm",
        // Tiny padding change while width is morphing (no height jump)
        "transition-[padding] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        progress > 0 ? "py-2.5" : "py-4",
      ].join(" ")}
      role="banner"
      aria-label="Site header"
    >
      {/* Desktop */}
      <div className="hidden lg:block">
        <NavbarDesktop {...desktopProps} />
      </div>

      {/* Mobile/Tablet */}
      <div className="block lg:hidden">
        <NavbarMobile />
      </div>
    </header>
  );
}