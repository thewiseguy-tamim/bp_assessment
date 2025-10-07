import React from "react";
import SearchBar from "../navbar/SearchBar";

/**
 * HeroSection
 * - Centers the SearchBar in a roomy area below the navbar
 * - Use onChange/onSubmit to bubble search params to context or routing
 *
 * Props:
 * - searchValue?: object (SearchBar value shape)
 * - onSearchChange?: (next) => void
 * - onSearchSubmit?: (value) => void
 * - className?: string
 */
export default function HeroSection({
  
  className = "",
}) {
  return (
    <section className={`w-full bg-white ${className}`}>
      <div className="mx-auto max-w-[980px] px-4 sm:px-6">
        <div className="py-4 sm:py-6">
          
        </div>
      </div>
    </section>
  );
}