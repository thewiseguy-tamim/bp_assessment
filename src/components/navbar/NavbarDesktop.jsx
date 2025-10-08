import React, { useEffect, useMemo, useRef, useState } from "react";
import Logo from "../common/Logo";
import SearchBar from "./SearchBar";
import {
  Home,
  PartyPopper,
  ConciergeBell,
  Globe,
  Menu,
  User,
  HelpCircle,
  Gift,
  Share2,
  Users,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

// Control the visual morph (do not change layout)
const WIDE_WIDTH = 980;          // px when fully expanded (top of page)
// Collapsed target fraction and safe minimum
const COLLAPSED_FRAC = 0.38; // 38% of expanded width
const MIN_COLLAPSED = 480; // safe floor so it never gets too tiny
const PILL_WIDTH_TARGET = Math.max(MIN_COLLAPSED, Math.round(WIDE_WIDTH * COLLAPSED_FRAC));
const SWITCH_AT = 0.35;          // threshold to swap SearchBar -> Pill (0..1)

// A concrete height for the tabs row (used to truly collapse height)
const TAB_ROW_H = 36;            // px of the tabs row content (adjust if your tabs are taller)

export default function NavbarDesktop({
  progress,        // 0..1 (0 wide / 1 pill) – passed from Navbar.jsx
  activeTab,
  onChangeTab,
  onCompactClick,
}) {
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0 });

  // Keep underline in sync
  useEffect(() => {
    const root = navRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll("[data-tab]"));
    const idx = ["homes", "experiences", "services"].indexOf(activeTab);
    const el = items[idx];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const parent = root.getBoundingClientRect();
    setIndicator({ left: rect.left - parent.left + rect.width / 2 - 20 });
  }, [activeTab]);

  // Interpolated width of the center search container
  const currentWidth = useMemo(() => {
    const t = Math.min(1, Math.max(0, progress));
    // Smoothly interpolate from wide to our 50% target
    return Math.round(WIDE_WIDTH + (PILL_WIDTH_TARGET - WIDE_WIDTH) * t);
  }, [progress]);

  // Tabs motion (fade + real height collapse so the search moves up)
  const tabsStyle = useMemo(() => {
    const t = Math.min(1, Math.max(0, progress));
    const opacity = 1 - Math.min(1, t * 1.05);         // fade out slightly faster
    const maxH = Math.max(0, (1 - t) * TAB_ROW_H);      // 36px -> 0px
    return {
      opacity,
      maxHeight: `${maxH}px`,
      overflow: "hidden",
      transition: "max-height 180ms ease, opacity 180ms linear",
      pointerEvents: t > 0.9 ? "none" : "auto",
    };
  }, [progress]);

  // Search container: reduce the top margin proportionally so it slides up neatly
  const searchContainerStyle = useMemo(() => {
    const t = Math.min(1, Math.max(0, progress));
    const baseMt = 8;                        // mt-2 = 8px baseline
    const mt = Math.max(0, baseMt * (1 - t)); // 8px -> 0px
    return {
      width: currentWidth,
      marginTop: `${mt}px`,
      transition: "width 150ms linear, margin-top 150ms linear",
    };
  }, [progress, currentWidth]);

  const showSearchBar = progress < SWITCH_AT;

  return (
    <div className="mx-auto flex max-w-[1760px] items-start justify-between gap-4 px-6">
      {/* Left */}
      <div className="shrink-0 pt-1">
        <Logo size="lg" />
      </div>

      {/* Center column: tabs above (fade + height collapse), resizable search below */}
      <div className="flex flex-1 flex-col items-center">
        {/* Icon tabs row */}
        <nav
          ref={navRef}
          className="relative will-change-[opacity] transition-opacity duration-150 ease-linear"
          style={tabsStyle}
          aria-label="Primary"
          aria-hidden={tabsStyle.opacity <= 0.02 ? "true" : "false"}
        >
          <ul className="flex items-center gap-8">
            <Tab
              icon={<Home className="h-6 w-6" />}
              label="Homes"
              active={activeTab === "homes"}
              onClick={() => onChangeTab?.("homes")}
            />
            <Tab
              icon={<PartyPopper className="h-6 w-6" />}
              label="Experiences"
              badge="NEW"
              active={activeTab === "experiences"}
              onClick={() => onChangeTab?.("experiences")}
            />
            <Tab
              icon={<ConciergeBell className="h-6 w-6" />}
              label="Services"
              badge="NEW"
              active={activeTab === "services"}
              onClick={() => onChangeTab?.("services")}
            />
          </ul>
          {/* 3px underline */}
          <div
            className="pointer-events-none mx-auto mt-1 h-[3px] w-10 rounded-full bg-black transition-transform duration-300"
            style={{ transform: `translateX(${indicator.left}px)` }}
            aria-hidden
          />
        </nav>

        {/* Resizable search area (width shrinks with scroll, slides up) */}
        <div
          className="mt-2 transition-[width,margin-top] duration-150 ease-linear"
          style={searchContainerStyle}
        >
          {showSearchBar ? (
            <SearchBar onSubmit={() => {}} onChange={() => {}} />
          ) : (
            <CollapsedPill onClick={onCompactClick} />
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-start gap-3 pt-1">
        <button
          type="button"
          className="rounded-full px-3 py-2 text-[15px] text-[#222222] transition-colors hover:bg-[#F7F7F7]"
        >
          Become a host
        </button>

        <button
          type="button"
          aria-label="Language and region"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
        >
          <Globe className="h-5 w-5 text-[#222222]" />
        </button>

        <UserMenuButton />
      </div>
    </div>
  );
}

function Tab({ icon, label, badge, active, onClick }) {
  return (
    <li data-tab>
      <button
        type="button"
        onClick={onClick}
        className={cls(
          "group inline-flex items-center gap-2 rounded-md text-[15px] font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
          active ? "text-black" : "text-[#717171] hover:text-black"
        )}
        aria-current={active ? "page" : undefined}
      >
        <span>{icon}</span>
        <span>{label}</span>
        {badge && (
          <span className="ml-1 rounded-full bg-[#EBEBEB] px-2 py-0.5 text-[11px] font-semibold text-[#222222]">
            {badge}
          </span>
        )}
      </button>
    </li>
  );
}

// Collapsed pill: three equal segments with vertical dividers and a Home icon on the left (inside the first segment)
function CollapsedPill({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Expand search"
      className={cls(
        "w-full rounded-full border border-[#DDDDDD] bg-white shadow-sm transition-all hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
      )}
    >
      <div className="flex items-center justify-between px-3 py-2.5">
        {/* Three equal parts with vertical dividers */}
        <div className="flex-1">
          <div className="grid grid-cols-3 divide-x divide-[#DDDDDD] text-[14px] text-[#222222]">
            <div className="flex items-center justify-center gap-2 px-3">
              <Home className="h-4 w-4 text-[#222222]" />
              <span>Anywhere</span>
            </div>
            <div className="flex items-center justify-center px-3">Anytime</div>
            <div className="flex items-center justify-center px-3">Add guests</div>
          </div>
        </div>

        {/* Pink search circle */}
        <span
          className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FF385C] text-white shadow-md transition hover:bg-[#E31C5F]"
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5">
            <path
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20 15.5 14Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"
            />
          </svg>
        </span>
      </div>
    </button>
  );
}

/* Simple user menu button + anchored menu (unchanged) */
function UserMenuButton() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!open) return;
      if (menuRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick, true);
    return () => document.removeEventListener("mousedown", onClick, true);
  }, [open]);

  const rect = btnRef.current?.getBoundingClientRect();
  const style = rect
    ? { position: "fixed", top: rect.bottom + 8, left: rect.right - 280, zIndex: 60 }
    : {};

  return (
    <>
      <button
        type="button"
        ref={btnRef}
        aria-haspopup="menu"
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-[#DDDDDD] px-3 py-2 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
      >
        <Menu className="h-5 w-5 text-[#222222]" />
        <User className="h-6 w-6 text-[#717171]" />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={style}
          className="w-[280px] rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
          role="menu"
          aria-label="User menu"
        >
          <div className="p-2">
            <Item icon={<HelpCircle className="h-5 w-5" />} label="Help Center" onClick={() => setOpen(false)} />
            <Divider />
            <div
              className="flex cursor-pointer items-start gap-3 rounded-lg p-3 hover:bg-[#F7F7F7]"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[#222222]">Become a host</div>
                <div className="text-[13px] text-[#717171]">
                  It&apos;s easy to start hosting and earn extra income.
                </div>
              </div>
              <div className="ml-auto">
                <img
                  src="https://images.unsplash.com/photo-1520975922284-9bcd39f0a7c9?w=36&h=36&fit=crop&auto=format"
                  alt=""
                  className="h-9 w-9 rounded-lg object-cover"
                />
              </div>
            </div>
            <Item icon={<Share2 className="h-5 w-5" />} label="Refer a Host" onClick={() => setOpen(false)} />
            <Item icon={<Users className="h-5 w-5" />} label="Find a co-host" onClick={() => setOpen(false)} />
            <Item icon={<Gift className="h-5 w-5" />} label="Gift cards" onClick={() => setOpen(false)} />
            <Divider />
            <Item label="Log in or sign up" onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

function Item({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="menuitem"
      className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
    >
      {icon && <span className="text-[#222222]">{icon}</span>}
      <span className="text-[14px] text-[#222222]">{label}</span>
    </button>
  );
}

function Divider() {
  return <div className="my-2 h-px bg-[#EBEBEB]" />;
}