import React from "react";

export default function InspirationSection({
  title = "Inspiration for future getaways",
  items = [],
  onClick,
  className = "",
}) {
  return (
    <section className={`w-full ${className}`}>
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6">
        <h2 className="mb-3 sm:mb-4 text-[18px] font-semibold text-[#222222]">
          {title}
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => onClick?.(it)}
              className="rounded-2xl border border-[#EEEEEE] bg-white p-4 text-left transition hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            >
              <div className="text-[15px] font-semibold text-[#222222]">
                {it.title}
              </div>
              <div className="mt-1 text-[13px] text-[#717171]">{it.subtitle}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}