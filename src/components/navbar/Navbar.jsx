import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import useScrollPosition from "../../hooks/useScrollPosition";

export default function Navbar() {
  const { isScrolled } = useScrollPosition({ scrolledThreshold: 50 });
  const [activeTab, setActiveTab] = useState("homes");

  // When scrolled, clicking the compact pill expands the full SearchBar.
  const [forceExpanded, setForceExpanded] = useState(false);

  // If user scrolls back to top, reset expansion (full bar will be visible anyway).
  useEffect(() => {
    if (!isScrolled) setForceExpanded(false);
  }, [isScrolled]);

  const handleCompactClick = useCallback(() => {
    setForceExpanded(true);
  }, []);

  const desktopProps = useMemo(
    () => ({
      isScrolled,
      activeTab,
      onChangeTab: setActiveTab,
      forceExpanded,
      onCompactClick: handleCompactClick,
    }),
    [isScrolled, activeTab, forceExpanded, handleCompactClick]
  );

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full shadow-sm",
        "bg-white/90 backdrop-blur-sm transition-all duration-300",
        isScrolled ? "py-2" : "py-3",
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