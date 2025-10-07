import React from "react";
import Logo from "../common/Logo";
import Button from "../common/Button";
import Badge from "../common/Badge";
import {
  Home as HomeIcon,
  PartyPopper,
  ConciergeBell,
  Globe,
  Menu,
  User,
  Search as SearchIcon,
} from "lucide-react";

/**
 * NavbarDesktop
 * - Smooth height transition 80px -> 64px on scroll
 * - Center nav with icons (Lucide placeholders; swap for Lottie later)
 * - Right side actions: Become a host, language, user menu
 * - Search trigger pill (wire to SearchModal later)
 */
export default function NavbarDesktop({
  isScrolled,
  items,
  activeKey,
  onChange,
  onSearchClick,
}) {
  const heightClass = isScrolled ? "h-16" : "h-20";

  const renderIcon = (key) => {
    const common = "h-6 w-6";
    switch (key) {
      case "homes":
        return <HomeIcon className={common} />;
      case "experiences":
        return <PartyPopper className={common} />;
      case "services":
        return <ConciergeBell className={common} />;
      default:
        return <HomeIcon className={common} />;
    }
  };

  return (
    <div className="w-full">
      {/* Top bar */}
      <div
        className={`transition-all duration-300 ${heightClass}`}
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-[1760px] px-6 h-full">
          <div className="flex h-full items-center justify-between gap-4">
            {/* Left: Logo */}
            <div className="shrink-0">
              <Logo size="lg" withText />
            </div>

            {/* Center: Tabs with icons (replace with AnimatedNavIcon later) */}
            <nav className="absolute left-1/2 -translate-x-1/2">
              <ul className="flex items-center gap-8">
                {items.map((it) => {
                  const active = activeKey === it.key;
                  return (
                    <li key={it.key} className="relative">
                      <button
                        type="button"
                        onClick={() => onChange?.(it.key)}
                        className={`group inline-flex items-center gap-2 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 ${
                          active ? "text-black" : "text-[#717171] hover:text-black"
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        <span className="text-[#222222]">{renderIcon(it.key)}</span>
                        <span>{it.label}</span>
                        {it.isNew && (
                          <Badge size="sm" variant="neutral" className="translate-y-[-6px]">
                            NEW
                          </Badge>
                        )}
                      </button>
                      {active && (
                        <div className="absolute -bottom-2 left-0 right-0 mx-auto h-[3px] w-10 rounded-full bg-black" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-[15px] text-[#222222] hover:bg-[#F7F7F7] px-3 py-2 rounded-full transition-colors"
              >
                Become a host
              </button>

              <button
                type="button"
                aria-label="Language and region"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
              >
                <Globe className="h-5 w-5 text-[#222222]" />
              </button>

              <button
                type="button"
                aria-label="User menu"
                className="inline-flex items-center gap-2 rounded-full border border-[#DDDDDD] px-3 py-2 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
              >
                <Menu className="h-5 w-5 text-[#222222]" />
                <div className="relative">
                  <User className="h-6 w-6 text-[#717171]" />
                  {/* Status dot (optional) */}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search trigger pill */}
      <div className="pb-3">
        <div className="mx-auto max-w-[980px] px-6">
          <button
            type="button"
            onClick={onSearchClick}
            className="w-full rounded-full border border-[#DDDDDD] bg-white shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            aria-label="Open search"
          >
            <div className="flex items-center justify-between pl-4 pr-2 py-3">
              <div className="flex items-center gap-4">
                {/* Where */}
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-medium text-[#222222] leading-none">
                    Where
                  </span>
                  <span className="text-[13px] text-[#717171] leading-none mt-1">
                    Search destinations
                  </span>
                </div>

                <div className="hidden sm:block h-8 w-px bg-[#DDDDDD]" />

                {/* Check in */}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[13px] font-medium text-[#222222] leading-none">
                    Check in
                  </span>
                  <span className="text-[13px] text-[#717171] leading-none mt-1">
                    Add dates
                  </span>
                </div>

                <div className="hidden sm:block h-8 w-px bg-[#DDDDDD]" />

                {/* Check out */}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[13px] font-medium text-[#222222] leading-none">
                    Check out
                  </span>
                  <span className="text-[13px] text-[#717171] leading-none mt-1">
                    Add dates
                  </span>
                </div>

                <div className="hidden sm:block h-8 w-px bg-[#DDDDDD]" />

                {/* Who */}
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-[13px] font-medium text-[#222222] leading-none">
                    Who
                  </span>
                  <span className="text-[13px] text-[#717171] leading-none mt-1">
                    Add guests
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="icon"
                aria-label="Search"
                className="shadow-md"
              >
                <SearchIcon className="h-5 w-5" />
              </Button>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}