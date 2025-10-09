import React, { forwardRef } from "react";



const sizes = {
  xs: "h-7 px-3 text-xs",
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base",
  xl: "h-[56px] px-7 text-[17px]",
  icon: "h-10 w-10 p-0",
};

const variants = {
  primary:
    "bg-[#FF385C] text-white hover:bg-[#E31C5F] shadow-sm hover:shadow-md",
  secondary:
    "bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#F7F7F7] shadow-sm",
  outline:
    "bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#F7F7F7]",
  ghost:
    "bg-transparent text-[#222222] hover:bg-[#F7F7F7]",
  black:
    "bg-black text-white hover:bg-neutral-900 shadow-sm hover:shadow-md",
};

const roundedMap = {
  full: "rounded-full",
  lg: "rounded-lg",
  md: "rounded-md",
  sm: "rounded",
};

const Spinner = ({ className = "" }) => (
  <svg
    className={`animate-spin ${className}`}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
    />
  </svg>
);

const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      rounded = "full",
      loading = false,
      leftIcon,
      rightIcon,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
    const iconSize =
      size === "xs"
        ? "h-3.5 w-3.5"
        : size === "sm"
        ? "h-4 w-4"
        : size === "md"
        ? "h-4.5 w-4.5"
        : size === "lg"
        ? "h-5 w-5"
        : size === "xl"
        ? "h-5.5 w-5.5"
        : "h-5 w-5";

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size] || sizes.md} ${
          variants[variant] || variants.primary
        } ${roundedMap[rounded] || roundedMap.full} ${className}`}
        disabled={disabled || loading}
        aria-busy={loading ? "true" : "false"}
        {...props}
      >
        {loading ? (
          <>
            <Spinner className={`${iconSize}`} />
            <span className="sr-only">Loading</span>
          </>
        ) : (
          <>
            {leftIcon ? <span className={`${iconSize}`}>{leftIcon}</span> : null}
            {children}
            {rightIcon ? (
              <span className={`${iconSize}`}>{rightIcon}</span>
            ) : null}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;