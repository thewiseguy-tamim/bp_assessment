import React from "react";

const sizeMap = {
  sm: "text-xs px-2.5 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-[15px] px-3.5 py-2",
};

const variantMap = {
  neutral: "bg-white text-[#222222] border border-black/5",
  subtle: "bg-[#F7F7F7] text-[#222222]",
  outline: "bg-transparent text-[#222222] border border-[#DDDDDD]",
  pink: "bg-[#FF385C] text-white",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
};

export default function Badge({
  variant = "neutral",
  size = "md",
  elevated = true,
  icon,
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full font-medium whitespace-nowrap";
  const shadow = elevated ? "shadow-sm" : "";

  return (
    <span
      className={`${base} ${sizeMap[size]} ${variantMap[variant]} ${shadow} ${className}`}
      {...props}
    >
      {icon ? <span className="shrink-0 h-4 w-4">{icon}</span> : null}
      {children}
    </span>
  );
}