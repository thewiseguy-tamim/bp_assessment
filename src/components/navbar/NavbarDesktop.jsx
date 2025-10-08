import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Lottie from "lottie-react";
import homes from "../../assets/homes.json";
import baloon from "../../assets/baloon.json";
import bell from "../../assets/bell.json";

import Logo from "../common/Logo";
import SearchBar from "./SearchBar";
import {
  Globe,
  Menu,
  HelpCircle,
  Gift,
  Share2,
  Users,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

// Control the visual morph (do not change layout)
const WIDE_WIDTH = 980;          // px when fully expanded (top of page)
const COLLAPSED_FRAC = 0.38;     // 38% of expanded width
const MIN_COLLAPSED = 480;       // safe floor so it never gets too tiny
const PILL_WIDTH_TARGET = Math.max(MIN_COLLAPSED, Math.round(WIDE_WIDTH * COLLAPSED_FRAC));
const SWITCH_AT = 0.35;          // threshold to swap SearchBar -> Pill (0..1)

// Taller row so bigger Lotties aren’t clipped when expanded
const TAB_ROW_H = 72;

// Underline width (short bar like the screenshot)
const UNDERLINE_W = 115; // px

export default function NavbarDesktop({
  progress,        // 0..1 (0 wide / 1 pill) – passed from Navbar.jsx
  activeTab,
  onChangeTab,
  onCompactClick,
}) {
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0 });

  // Centralized measurement so we can reuse on resize
  const measureIndicator = useCallback(() => {
    const root = navRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll("[data-tab]"));
    const idx = ["homes", "experiences", "services"].indexOf(activeTab);
    const el = items[idx];
    if (!el) return;

    // Measure both Lottie + label as one group
    const measureEl = el.querySelector("[data-measure]") || el;
    const parentRect = root.getBoundingClientRect();
    const rect = measureEl.getBoundingClientRect();

    const left = rect.left - parentRect.left + rect.width / 2 - UNDERLINE_W / 2;
    setIndicator({ left });
  }, [activeTab]);

  // Keep underline in sync with active tab
  useEffect(() => {
    measureIndicator();
  }, [measureIndicator]);

  // Recalculate underline on resize so it stays centered
  useEffect(() => {
    const onResize = () => measureIndicator();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureIndicator]);

  // Interpolated width of the center search container
  const currentWidth = useMemo(() => {
    const t = Math.min(1, Math.max(0, progress));
    return Math.round(WIDE_WIDTH + (PILL_WIDTH_TARGET - WIDE_WIDTH) * t);
  }, [progress]);

  // Tabs motion (fade + real height collapse so the search moves up)
  const tabsStyle = useMemo(() => {
    const t = Math.min(1, Math.max(0, progress));
    const opacity = 1 - Math.min(1, t * 1.05);
    const maxH = Math.max(0, (1 - t) * TAB_ROW_H);
    return {
      opacity,
      maxHeight: `${maxH}px`,
      overflow: "hidden",
      transition: "max-height 180ms ease, opacity 180ms linear",
      pointerEvents: t > 0.9 ? "none" : "auto",
    };
  }, [progress]);

  // Search container vertical offset
  const searchContainerStyle = useMemo(() => {
    const t = Math.min(1, Math.max(0, progress));
    const baseMt = 5; // adjust if you want more room below the tabs
    const mt = Math.max(0, baseMt * (1 - t));
    return {
      width: currentWidth,
      marginTop: `${mt}px`,
      transition: "width 150ms linear, margin-top 150ms linear",
    };
  }, [progress, currentWidth]);

  const showSearchBar = progress < SWITCH_AT;

  return (
    <div className="mx-auto grid max-w-[1760px] grid-cols-[1fr_auto_1fr] items-start gap-4 px-6">
      {/* Left */}
      <div className="shrink-0 pt-1 justify-self-start">
        <Logo size="lg" />
      </div>

      {/* Center column */}
      <div className="col-start-2 flex flex-col items-center justify-self-center">
        {/* Icon tabs row */}
        <nav
          ref={navRef}
          className="relative pb-0  will-change-[opacity] transition-opacity duration-150 ease-linear"
          style={tabsStyle}
          aria-label="Primary"
          aria-hidden={tabsStyle.opacity <= 0.02 ? "true" : "false"}
        >
          <ul className="flex items-center gap-8">
            <Tab
              icon={<Lottie animationData={homes} loop autoplay style={{ width: 65, height: 65 }} />}
              label="Homes"
              active={activeTab === "homes"}
              onClick={() => onChangeTab?.("homes")}
            />
            <Tab
              icon={<Lottie animationData={baloon} loop autoplay style={{ width: 50, height: 50 }} />}
              label="Experiences"
              badge="NEW" // badge over the Lottie
              active={activeTab === "experiences"}
              onClick={() => onChangeTab?.("experiences")}
            />
            <Tab
              icon={<Lottie animationData={bell} loop autoplay style={{ width: 50, height: 50 }} />}
              label="Services"
              badge="NEW" // badge over the Lottie
              active={activeTab === "services"}
              onClick={() => onChangeTab?.("services")}
            />
          </ul>

          {/* underline (centered under icon + label group) */}
          <div
            className="pointer-events-none absolute left-0 bottom-0 h-[3px] rounded-full bg-black transition-transform duration-300"
            style={{ width: UNDERLINE_W, transform: `translateX(${indicator.left}px)` }}
            aria-hidden
          />
        </nav>

        {/* Resizable search area */}
        <div
          className="flex justify-center transition-[width,margin-top] duration-150 ease-linear"
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
      <div className="flex items-start gap-3 pt-1 justify-self-end">
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
        {/* Measure this wrapper so underline centers under BOTH icon + label */}
        <span data-measure className="inline-flex items-center gap-2">
          <span className="relative inline-flex items-center justify-center">
            {icon}
            {badge && (
              <span
                className="absolute -top-2 right-0 translate-x-1/4 rounded-full bg-[#2C3E67] px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-md"
                aria-hidden="true"
              >
                {badge}
              </span>
            )}
          </span>
          <span className="inline-block">{label}</span>
        </span>
      </button>
    </li>
  );
}

// Collapsed pill: three equal segments with vertical dividers and the same Homes Lottie on the left
function CollapsedPill({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
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
              {/* <Lottie animationData={homes} loop autoplay style={{ width: 18, height: 18 }} /> */}
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