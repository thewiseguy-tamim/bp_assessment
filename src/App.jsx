import React from "react";
import Layout from "./components/layout/Layout";
import HeroSection from "./components/sections/HeroSection";
import PopularHomesSection from "./components/sections/PopularHomesSection";
import InspirationSection from "./components/sections/InspirationSection";
import CategorySection from "./components/sections/CategorySection";

import { useApp } from "./context/AppContext";
import {
  CATEGORY_LIST,
  INSPIRATION_CATEGORIES,
  getSectionData,
} from "./utils/mockData";

export default function App() {
  const {
    state: { search },
    updateSearch,
  } = useApp();

  const sections = getSectionData();

  const handleSearchSubmit = (value) => {
    // Hook in routing or filtering here
    console.log("Search submit:", value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <HeroSection
        searchValue={search}
        onSearchChange={updateSearch}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Categories / filters preview removed per request */}

      {/* Popular homes sections by city */}
      <div className="mt-6 space-y-8">
        {sections.map((s) => (
          <PopularHomesSection
            key={s.id}
            title={s.title}
            properties={s.items}
            onPropertyClick={(p) => console.log("Open property:", p)}
          />
        ))}
      </div>

      {/* Inspiration grid */}
      {/* <InspirationSection
        items={INSPIRATION_CATEGORIES}
        onClick={(it) => console.log("Inspiration:", it)}
        className="mt-10"
      /> */}
    </Layout>
  );
}