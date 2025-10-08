import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import MobileSearchSheet from "./MobileSearchSheet";

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top row (minimal) */}
      <div className="mx-auto flex h-full max-w-[1760px] items-center justify-between px-4" />

      {/* Search pill inside navbar */}
      <div className="px-4 pt-2">
        <button
          type="button"
          className="w-full rounded-full border border-[#DDDDDD] bg-white shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
          aria-label="Start your search"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <SearchIcon className="h-5 w-5 text-[#717171]" />
            <span className="text-[15px] text-[#717171]">Start your search</span>
          </div>
        </button>
      </div>

      {/* Tabs under pill */}
      <div className="px-4 pb-2 mt-6">
        <div className="grid grid-cols-3 gap-2 text-center">
          <MobileTab icon={<SearchIcon className="mx-auto h-6 w-6 text-[#222222]" />} label="Homes" />
          <MobileTab icon={<SearchIcon className="mx-auto h-6 w-6 text-[#222222]" />} label={<>Experiences <span className="ml-1 rounded-full bg-[#EBEBEB] px-1 text-[10px] font-semibold">NEW</span></>} />
          <MobileTab icon={<SearchIcon className="mx-auto h-6 w-6 text-[#222222]" />} label={<>Services <span className="ml-1 rounded-full bg-[#EBEBEB] px-1 text-[10px] font-semibold">NEW</span></>} />
        </div>
      </div>

      {/* Full-screen search sheet */}
      <MobileSearchSheet open={open} onClose={() => setOpen(false)} />
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