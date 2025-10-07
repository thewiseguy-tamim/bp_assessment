import React from "react";

/**
 * Container
 * - Centers content with responsive horizontal padding
 * - Sizes map to max widths; default is "wide" (1760px) per spec
 *
 * Props:
 * - size: "sm" | "md" | "lg" | "xl" | "wide" | "full"
 * - as: string/element (default "div")
 * - className: string
 */
const sizeMap = {
  sm: "max-w-[640px]",
  md: "max-w-[980px]",
  lg: "max-w-[1200px]",
  xl: "max-w-[1400px]",
  wide: "max-w-[1760px]",
  full: "max-w-full",
};

export default function Container({
  size = "wide",
  as = "div",
  className = "",
  children,
  ...props
}) {
  const Tag = as || "div";
  return (
    <Tag
      className={`mx-auto px-4 sm:px-6 ${sizeMap[size] || sizeMap.wide} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}