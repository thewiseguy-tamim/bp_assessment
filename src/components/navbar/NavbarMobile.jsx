import React from "react";
import Logo from "../common/Logo";
import { Globe, Menu, Search as SearchIcon, Home, PartyPopper, ConciergeBell } from "lucide-react";

export default function NavbarMobile() {
  return (
    <>
      <div className="mx-auto flex h-full max-w-[1760px] items-center justify-between px-4">
        <Logo size="md" withText={false} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Language and region"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
          >
            <Globe className="h-5 w-5 text-[#222222]" />
          </button>
          <button
            type="button"
            aria-label="Open menu"
            className="inline-flex items-center gap-2 rounded-full border border-[#DDDDDD] px-3 py-2 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
          >
            <Menu className="h-5 w-5 text-[#222222]" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-2">
        <button
          type="button"
          className="w-full rounded-full border border-[#DDDDDD] bg-white shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
          aria-label="Start your search"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <SearchIcon className="h-5 w-5 text-[#717171]" />
            <span className="text-[15px] text-[#717171]">Start your search</span>
          </div>
        </button>
      </div>

      <div className="px-4 pb-2">
        <div className="grid grid-cols-3 gap-2 text-center">
          <MobileTab icon={<Home className="mx-auto h-6 w-6 text-[#222222]" />} label="Homes" />
          <MobileTab
            icon={<PartyPopper className="mx-auto h-6 w-6 text-[#222222]" />}
            label={
              <>
                Experiences <span className="ml-1 rounded-full bg-[#EBEBEB] px-1 text-[10px] font-semibold">NEW</span>
              </>
            }
          />
          <MobileTab
            icon={<ConciergeBell className="mx-auto h-6 w-6 text-[#222222]" />}
            label={
              <>
                Services <span className="ml-1 rounded-full bg-[#EBEBEB] px-1 text-[10px] font-semibold">NEW</span>
              </>
            }
          />
        </div>
      </div>
    </>
  );
}

function MobileTab({ icon, label }) {
  return (
    <div>
      {icon}
      <div className="mt-1 text-xs text-[#222222] font-medium">{label}</div>
    </div>
  );
}