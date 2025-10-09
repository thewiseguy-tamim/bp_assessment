import React, { useEffect, useState } from "react";
import { Search, Heart, UserRound } from "lucide-react";

const PINK = "#FF385C";
const GRAY = "#717171";

/**
 * BottomNav (mobile)
 * Props:
 * - active?: 'explore' | 'wishlists' | 'login'
 * - onChange?: (tab) => void
 * - hidden?: boolean  // when true, slides/fades down out of view
 */
export default function BottomNavMob({ active: activeProp, onChange, hidden = false }) {
  const [activeLocal, setActiveLocal] = useState(
    () => sessionStorage.getItem("bottomNavActive") || "explore"
  );
  const active = activeProp ?? activeLocal;

  useEffect(() => {
    onChange?.(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setActive = (tab) => {
    setActiveLocal(tab);
    sessionStorage.setItem("bottomNavActive", tab);
    onChange?.(tab);
  };

  const items = [
    { key: "explore", label: "Explore", Icon: Search },
    { key: "wishlists", label: "Wishlists", Icon: Heart },
    { key: "login", label: "Log in", Icon: UserRound },
  ];

  return (
    <nav
      className={[
        "lg:hidden fixed bottom-0 inset-x-0 z-[60] bg-white border-t border-[#EBEBEB]",
        "shadow-[0_-2px_8px_rgba(0,0,0,0.06)]",
        "transition-all duration-300 ease-out will-change-transform",
        hidden ? "translate-y-[110%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100",
      ].join(" ")}
      role="navigation"
      aria-label="Mobile bottom navigation"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0px)",
      }}
    >
      <ul className="grid grid-cols-3 h-[64px]">
        {items.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <li key={key} className="flex items-center justify-center">
              <button
                onClick={() => setActive(key)}
                aria-pressed={isActive}
                className="flex flex-col items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-black/10 active:scale-[0.98] transition"
              >
                <Icon
                  className="h-6 w-6"
                  color={isActive ? PINK : GRAY}
                  aria-hidden="true"
                  strokeWidth={2.4}
                />
                <span
                  className={[
                    "text-[11px] font-medium leading-none",
                    isActive ? "text-[color:var(--active,#FF385C)]" : "text-[#717171]",
                  ].join(" ")}
                  style={{ "--active": PINK }}
                >
                  {label}
                </span>
                <span
                  aria-hidden="true"
                  className={[
                    "mt-0.5 h-[2px] w-8 rounded",
                    isActive ? "bg-[color:var(--active,#FF385C)]" : "bg-transparent",
                  ].join(" ")}
                  style={{ "--active": PINK }}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}