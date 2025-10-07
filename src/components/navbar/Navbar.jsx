import React, { useEffect, useState, useCallback } from "react";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

// Local lightweight scroll hook to avoid external deps
function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

export default function Navbar({
  defaultActive = "homes",
  onTabChange,
  onSearchClick,
}) {
  const isScrolled = useScrolled(50);
  const [active, setActive] = useState(defaultActive);

  const handleChange = useCallback(
    (key) => {
      setActive(key);
      onTabChange?.(key);
    },
    [onTabChange]
  );

  const handleSearch = useCallback(() => {
    onSearchClick?.();
  }, [onSearchClick]);

  const navItems = [
    { key: "homes", label: "Homes", isNew: false, icon: "home" },
    { key: "experiences", label: "Experiences", isNew: true, icon: "experiences" },
    { key: "services", label: "Services", isNew: true, icon: "services" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm transition-all`}
      role="banner"
    >
      {/* Desktop */}
      <div className="hidden lg:block">
        <NavbarDesktop
          isScrolled={isScrolled}
          items={navItems}
          activeKey={active}
          onChange={handleChange}
          onSearchClick={handleSearch}
        />
      </div>

      {/* Mobile/Tablet */}
      <div className="block lg:hidden">
        <NavbarMobile
          isScrolled={isScrolled}
          items={navItems}
          activeKey={active}
          onChange={handleChange}
          onSearchClick={handleSearch}
        />
      </div>
    </header>
  );
}