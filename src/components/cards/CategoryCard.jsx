import React from "react";

/**
 * CategoryCard
 * - Image/icon left, text right
 * - Hover background change, pointer
 *
 * Props:
 * - title: string
 * - subtitle?: string
 * - icon?: ReactNode
 * - imageSrc?: string
 * - onClick?: () => void
 * - className?: string
 */
export default function CategoryCard({
  title,
  subtitle,
  icon,
  imageSrc,
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border border-[#EEEEEE] bg-white p-3 text-left transition hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-[#F7F7F7]">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            icon || <span className="h-6 w-6 rounded bg-neutral-300" />
          )}
        </div>

        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold text-[#222222]">
            {title}
          </div>
          {subtitle && (
            <div className="mt-0.5 truncate text-[13px] text-[#717171]">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}