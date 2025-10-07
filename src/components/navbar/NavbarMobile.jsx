import React from "react";
import Logo from "../common/Logo";
import Button from "../common/Button";
import {
  Home as HomeIcon,
  PartyPopper,
  ConciergeBell,
  Globe,
  Menu,
  Search as SearchIcon,
} from "lucide-react";

/**
 * NavbarMobile
 * - Simplified top bar with logo + hamburger
 * - Prominent search trigger
 * - Bottom navigation with three tabs (icons now Lucide; swap to Lottie later)
 */
export default function NavbarMobile({
  isScrolled,
  items,
  activeKey,
  onChange,
  onSearchClick,
}) {
  const renderIcon = (key, className = "h-5 w-5") => {
    switch (key) {
      case "homes":
        return <HomeIcon className={className} />;
      case "experiences":
        return <PartyPopper className={className} />;
      case "services":
        return <ConciergeBell className={className} />;
      default:
        return <HomeIcon className={className} />;
    }
  };

  return (
    <div className="w-full">
      {/* Top header */}
      <div
        className={`transition-all duration-300 ${
          isScrolled ? "h-14" : "h-16"
        }`}
      >
        <div className="mx-auto max-w-[1760px] px-4 h-full">
          <div className="flex h-full items-center justify-between">
            <Logo size="md" withText={false} />
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Language and region"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
              >
                <Globe className="h-5 w-5 text-[#222222]" />
              </button>
              <button
                type="button"
                aria-label="Open menu"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-[#DDDDDD] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
              >
                <Menu className="h-5 w-5 text-[#222222]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent search trigger */}
      <div className="px-4 pb-3">
        <button
          type="button"
          onClick={onSearchClick}
          className="w-full rounded-full border border-[#DDDDDD] bg-white shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
          aria-label="Open search"
        >
          <div className="flex items-center justify-between pl-4 pr-2 py-3">
            <div className="flex flex-col text-left">
              <span className="text-[15px] font-medium text-[#222222] leading-none">
                Where to?
              </span>
              <span className="text-[13px] text-[#717171] leading-none mt-1">
                Anywhere • Any week • Add guests
              </span>
            </div>
            <Button variant="primary" size="icon" aria-label="Search" className="shadow-md">
              <SearchIcon className="h-5 w-5" />
            </Button>
          </div>
        </button>
      </div>

      {/* Bottom navigation bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 border-t border-[#DDDDDD] bg-white"
        aria-label="Bottom navigation"
      >
        <ul className="grid grid-cols-3">
          {items.map((it) => {
            const active = activeKey === it.key;
            return (
              <li key={it.key}>
                <button
                  type="button"
                  onClick={() => onChange?.(it.key)}
                  className="w-full py-2.5 flex flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={`${
                      active ? "text-[#FF385C]" : "text-[#717171]"
                    }`}
                  >
                    {renderIcon(it.key, "h-5 w-5")}
                  </span>
                  <span
                    className={`text-[11px] ${
                      active ? "text-[#FF385C]" : "text-[#717171]"
                    }`}
                  >
                    {it.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Reserve space for bottom bar to avoid overlap */}
      <div className="h-14" />
    </div>
  );
}