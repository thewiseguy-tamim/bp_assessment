import React, { useEffect, useRef, useState } from "react";
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

export default function NavbarDesktop({
  isScrolled,
  activeTab,
  onChangeTab,
  forceExpanded,
  onCompactClick,
}) {
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0 });

  // Slide the 3px underline to the active tab
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
  }, [activeTab, isScrolled]);

  // User menu with click outside to close
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!menuOpen) return;
      if (menuRef.current?.contains(e.target) || menuBtnRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick, true);
    return () => document.removeEventListener("mousedown", onClick, true);
  }, [menuOpen]);

  const showCompact = isScrolled && !forceExpanded;
  const showExpandedRow = !isScrolled || forceExpanded;

  return (
    <div className="mx-auto max-w-[1760px] px-6">
      {/* Top row: logo + center (animated: tabs <-> pill) + actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="shrink-0">
          <Logo size="lg" />
        </div>

        {/* Center container keeps stable height and cross-fades content */}
        <div className="relative flex-1 flex justify-center min-h-[48px]">
          {/* Tabs layer */}
          <nav
            ref={navRef}
            className={cls(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              showCompact ? "opacity-0 translate-y-1 scale-95 pointer-events-none" : "opacity-100 translate-y-0 scale-100"
            )}
            aria-label="Primary"
            aria-hidden={showCompact ? "true" : "false"}
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
            <div
              className="pointer-events-none absolute -bottom-2 h-[3px] w-10 rounded-full bg-black transition-transform duration-300"
              style={{ transform: `translateX(${indicator.left}px)` }}
              aria-hidden
            />
          </nav>

          {/* Compact pill layer */}
          <div
            className={cls(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px]",
              "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              showCompact ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-1 scale-95 pointer-events-none"
            )}
            aria-hidden={showCompact ? "false" : "true"}
          >
            <CollapsedPill onClick={onCompactClick} />
          </div>
        </div>

        {/* Right actions */}
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
            aria-haspopup="menu"
            aria-expanded={menuOpen ? "true" : "false"}
            ref={menuBtnRef}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-[#DDDDDD] px-3 py-2 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
          >
            <Menu className="h-5 w-5 text-[#222222]" />
            <User className="h-6 w-6 text-[#717171]" />
          </button>

          <UserMenu open={menuOpen} anchorRef={menuBtnRef} menuRef={menuRef} onClose={() => setMenuOpen(false)} />
        </div>
      </div>

      {/* Full SearchBar row — animated expand/collapse, still part of header */}
      <AnimatedRow show={showExpandedRow}>
        <div className="mx-auto max-w-[980px]">
          <SearchBar className="mt-1" onSubmit={() => {}} onChange={() => {}} />
        </div>
      </AnimatedRow>
    </div>
  );
}

function AnimatedRow({ show, children }) {
  // Smooth height + opacity animation for the full SearchBar row
  return (
    <div
      className={cls(
        "overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        show ? "opacity-100" : "opacity-0"
      )}
      style={{ maxHeight: show ? 120 : 0 }}
    >
      <div className="pt-3">{children}</div>
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
          "group inline-flex items-center gap-2 text-[15px] font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 rounded-md",
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
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4 text-[14px] text-[#222222]">
          <span>Anywhere</span>
          <span className="h-5 w-px bg-[#DDDDDD]" />
          <span>Anytime</span>
          <span className="h-5 w-px bg-[#DDDDDD]" />
          <span>Add guests</span>
        </div>
        <span
          className={cls(
            "ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full",
            "bg-[#FF385C] text-white shadow-md transition hover:bg-[#E31C5F]"
          )}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5">
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

function UserMenu({ open, anchorRef, menuRef, onClose }) {
  if (!open) return null;
  const rect = anchorRef.current?.getBoundingClientRect();
  const style = rect
    ? { position: "fixed", top: rect.bottom + 8, left: rect.right - 280, zIndex: 60 }
    : {};

  return (
    <div
      ref={menuRef}
      style={style}
      className="w-[280px] rounded-2xl bg-white shadow-xl ring-1 ring-black/5 transition-opacity"
      role="menu"
      aria-label="User menu"
    >
      <div className="p-2">
        <Item icon={<HelpCircle className="h-5 w-5" />} label="Help Center" onClick={onClose} />
        <Divider />
        <div
          className="flex items-start gap-3 rounded-lg p-3 hover:bg-[#F7F7F7] cursor-pointer"
          role="menuitem"
          onClick={onClose}
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
        <Item icon={<Share2 className="h-5 w-5" />} label="Refer a Host" onClick={onClose} />
        <Item icon={<Users className="h-5 w-5" />} label="Find a co-host" onClick={onClose} />
        <Item icon={<Gift className="h-5 w-5" />} label="Gift cards" onClick={onClose} />
        <Divider />
        <Item label="Log in or sign up" onClick={onClose} />
      </div>
    </div>
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