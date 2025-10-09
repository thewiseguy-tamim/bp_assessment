import React from "react";

const sizeMap = {
  sm: { icon: 22, text: "text-[18px]" },
  md: { icon: 26, text: "text-[22px]" },
  lg: { icon: 30, text: "text-[24px]" },
  xl: { icon: 36, text: "text-[28px]" },
};

export default function Logo({
  size = "md",
  withText = true,
  as = "button",
  href,
  onClick,
  className = "",
  title = "Airbnb",
}) {
  const s = sizeMap[size] || sizeMap.md;
  const Tag = as || (href ? "a" : "button");

  const base =
    "inline-flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 rounded-md";

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={`${base} ${className}`}
      aria-label="Airbnb home"
      title={title}
    >

      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="shrink-0 text-[#FF385C]"
      >

        <path
          fill="currentColor"
          d="M16 2c-5.523 0-10 4.477-10 10 0 4.07 2.246 7.545 5.51 11.092l3.535 3.882a1.75 1.75 0 0 0 2.41 0l3.535-3.882C23.754 19.545 26 16.07 26 12c0-5.523-4.477-10-10-10Zm0 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
        />
      </svg>

      {withText && (
        <span
          className={`${s.text} font-semibold tracking-tight text-[#FF385C]`}
          style={{ fontFamily: "Circular, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
        >
          airbnb
        </span>
      )}
    </Tag>
  );
}