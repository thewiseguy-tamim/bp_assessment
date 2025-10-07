import React from "react";
import CategoryCard from "../cards/CategoryCard";

/**
 * CategorySection
 * - Displays a grid/list of categories
 *
 * Props:
 * - title?: string
 * - categories: Array<{ id, title, subtitle?, icon?, imageSrc? }>
 * - onSelect?: (category) => void
 * - className?: string
 */
export default function CategorySection({
  title = "Explore by category",
  categories = [],
  onSelect,
  className = "",
}) {
  return (
    <section className={`w-full ${className}`}>
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6">
        <div className="mb-3 sm:mb-4 flex items-end justify-between">
          <h2 className="text-[18px] font-semibold text-[#222222]">{title}</h2>
        </div>

        {/* Full width on mobile, grid on larger screens */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              title={c.title}
              subtitle={c.subtitle}
              icon={c.icon}
              imageSrc={c.imageSrc}
              onClick={() => onSelect?.(c)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}