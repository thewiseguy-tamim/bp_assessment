import React, { Suspense, useMemo, useState } from "react";
import { Search } from "lucide-react";
import Lottie from "lottie-react";

// Lottie animations
import homeAnim from "../../../assets/homes.json";
import balloonAnim from "../../../assets/baloon.json";
import bellAnim from "../../../assets/bell.json";

// Lazy-load the modal so it only downloads/mounts when needed
const MobileSearchModalMob = React.lazy(() => import("./MobileSearchModal(mob)"));

const PINK = "#FF385C";

export default function NavbarMobile({
  activeTab: activeProp,
  onChangeTab,
  onSearchSubmit, // optional callback when user taps Search in modal
}) {
  const [activeLocal, setActiveLocal] = useState("homes");
  const active = activeProp ?? activeLocal;

  // Modal state (owned here)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeSearchSection, setActiveSearchSection] = useState(null); // 'where'|'when'|'who'|null
  const [searchData, setSearchData] = useState({
    destination: null,
    dateMode: "dates",
    checkIn: null,
    checkOut: null,
    flexibleLength: null,
    flexibleMonth: null,
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const tabs = useMemo(
    () => [
      { key: "homes", label: "Homes", anim: homeAnim, isNew: false },
      { key: "experiences", label: "Experiences", anim: balloonAnim, isNew: true },
      { key: "services", label: "Services", anim: bellAnim, isNew: true },
    ],
    []
  );

  const setActive = (tab) => {
    setActiveLocal(tab);
    onChangeTab?.(tab);
  };

  // Optional: prefetch modal chunk on hover/focus so it opens instantly
  const preloadModal = () => {
    import("./MobileSearchModal(mob)").catch(() => {});
  };

  const openSearch = () => {
    setActiveSearchSection("where"); // default to Where (matches your 2nd image)
    setMobileSearchOpen(true);
  };

  return (
    <>
      <header className="lg:hidden sticky top-0 z-50 w-full bg-white shadow-sm" role="banner" aria-label="Mobile header">
        {/* Search pill */}
        <div className="px-4 pt-3 pb-2">
          <button
            aria-label="Open mobile search"
            onClick={openSearch}
            onMouseEnter={preloadModal}
            onFocus={preloadModal}
            className="w-full flex items-center gap-3 rounded-full bg-[#F7F7F7] px-4 py-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.08)] active:scale-[0.99] transition-transform"
          >
            <Search className="h-5 w-5 text-[#717171]" aria-hidden="true" />
            <span className="text-[15px] text-[#222222] font-medium">Start your search</span>
          </button>
        </div>

        {/* Category tabs */}
        <nav className="px-2 pb-2" aria-label="Mobile categories">
          <ul className="flex items-end justify-around">
            {tabs.map((t) => {
              const isActive = t.key === active;
              return (
                <li key={t.key} className="flex-1">
                  <button
                    onClick={() => setActive(t.key)}
                    aria-pressed={isActive}
                    className={`mx-auto flex flex-col items-center gap-1 px-2 py-1 relative transition-colors ${
                      isActive ? "text-[color:var(--active,#FF385C)]" : "text-[#717171]"
                    }`}
                    style={{ "--active": PINK }}
                  >
                    <div className="relative h-8 w-8">
                      <Lottie animationData={t.anim} loop={isActive} autoplay={isActive} style={{ height: 32, width: 32 }} />
                      {t.isNew && (
                        <span className="absolute -right-2 -top-1 rounded-full bg-[#2F6AFF] px-1.5 py-[2px] text-[10px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className={`text-[12px] font-medium ${isActive ? "text-[color:var(--active,#FF385C)]" : "text-[#717171]"}`}>{t.label}</span>
                    <span aria-hidden="true" className={`mt-0.5 h-[2px] w-8 rounded ${isActive ? "bg-[color:var(--active,#FF385C)]" : "bg-transparent"}`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* Conditionally mount the modal only when open */}
      {mobileSearchOpen && (
        <Suspense fallback={null}>
          <MobileSearchModalMob
            open={mobileSearchOpen}
            onClose={() => setMobileSearchOpen(false)}
            searchData={searchData}
            setSearchData={setSearchData}
            activeSearchSection={activeSearchSection}
            setActiveSearchSection={setActiveSearchSection}
            onSubmit={(data) => {
              setMobileSearchOpen(false);
              onSearchSubmit?.(data);
            }}
          />
        </Suspense>
      )}
    </>
  );
}