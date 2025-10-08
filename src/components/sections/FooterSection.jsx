import React from "react";
import {
  Globe,
  DollarSign,
  Facebook,
  Instagram,
  Twitter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import tt from "../../assets/tik.png";

export default function FooterSection() {
  const cols = [
    {
      title: "Support",
      links: [
        "Help Center",
        "Get help with a safety issue",
        "AirCover",
        "Anti-discrimination",
        "Disability support",
        "Cancellation options",
        "Report neighborhood concern",
      ],
    },
    {
      title: "Hosting",
      links: [
        "Airbnb your home",
        "Airbnb your experience",
        "Airbnb your service",
        "AirCover for Hosts",
        "Hosting resources",
        "Community forum",
        "Hosting responsibly",
        "Airbnb-friendly apartments",
        "Join a free Hosting class",
        "Find a co-host",
      ],
    },
    {
      title: "Airbnb",
      links: [
        "2025 Summer Release",
        "Newsroom",
        "Careers",
        "Investors",
        "Gift cards",
        "Airbnb.org emergency stays",
      ],
    },
  ];

  const tabs = [
    { id: "tips", label: "Travel tips & inspiration" },
    { id: "apts", label: "Airbnb-friendly apartments" },
  ];

  const [activeTab, setActiveTab] = React.useState("tips");
  const [showMoreApts, setShowMoreApts] = React.useState(false);

  // Tab 1: Tips
  const tips = [
    { title: "Family travel hub", desc: "Tips and inspiration" },
    { title: "Family budget travel", desc: "Get there for less" },
    {
      title: "Vacation ideas for any budget",
      desc: "Make it special without making it spendy",
    },
    {
      title: "Travel Europe on a budget",
      desc: "How to take the kids to Europe for less",
    },
    { title: "Outdoor adventure", desc: "Explore nature with the family" },
    {
      title: "Bucket list national parks",
      desc: "Must-see parks for family travel",
    },
  ];

  // Tab 2: Airbnb-friendly apartments (matches your screenshot + a Show more toggle)
  const aptsInitial = [
    { title: "Albuquerque", desc: "New Mexico" },
    { title: "Arlington, TX", desc: "Texas" },
    { title: "Atlanta Metro", desc: "Georgia" },
    { title: "Augusta", desc: "Georgia" },
    { title: "Austin Metro", desc: "Texas" },
    { title: "Baton Rouge", desc: "Louisiana" },
    { title: "Bentonville", desc: "Arkansas" },
    { title: "Birmingham", desc: "Alabama" },
    { title: "Boise", desc: "Idaho" },
    { title: "Boston Metro", desc: "Massachusetts" },
    { title: "Boulder", desc: "Colorado" },
    { title: "Charlotte", desc: "North Carolina" },
    { title: "Chicago Metro", desc: "Illinois" },
    { title: "Cincinnati", desc: "Ohio" },
    { title: "Columbus", desc: "Ohio" },
    { title: "Crestview", desc: "Florida" },
    { title: "Dallas", desc: "Texas" },
  ];

  const aptsMore = [
    { title: "Denver", desc: "Colorado" },
    { title: "Des Moines", desc: "Iowa" },
    { title: "Detroit Metro", desc: "Michigan" },
    { title: "El Paso", desc: "Texas" },
    { title: "Fort Lauderdale", desc: "Florida" },
    { title: "Fort Worth", desc: "Texas" },
    { title: "Fresno", desc: "California" },
    { title: "Houston", desc: "Texas" },
    { title: "Indianapolis", desc: "Indiana" },
    { title: "Jacksonville", desc: "Florida" },
    { title: "Kansas City", desc: "Missouri" },
    { title: "Las Vegas", desc: "Nevada" },
    { title: "Los Angeles Metro", desc: "California" },
    { title: "Miami", desc: "Florida" },
    { title: "Milwaukee", desc: "Wisconsin" },
    { title: "Minneapolis", desc: "Minnesota" },
    { title: "Nashville", desc: "Tennessee" },
    { title: "New Orleans", desc: "Louisiana" },
    { title: "New York City Metro", desc: "New York" },
    { title: "Oklahoma City", desc: "Oklahoma" },
    { title: "Orlando", desc: "Florida" },
    { title: "Phoenix Metro", desc: "Arizona" },
    { title: "Portland Metro", desc: "Oregon" },
    { title: "Raleigh", desc: "North Carolina" },
    { title: "Sacramento", desc: "California" },
    { title: "Salt Lake City", desc: "Utah" },
    { title: "San Antonio", desc: "Texas" },
    { title: "San Diego Metro", desc: "California" },
    { title: "San Francisco Bay Area", desc: "California" },
    { title: "Seattle Metro", desc: "Washington" },
    { title: "St. Louis", desc: "Missouri" },
    { title: "Tampa", desc: "Florida" },
    { title: "Tucson", desc: "Arizona" },
    { title: "Washington, DC", desc: "District of Columbia" },
  ];

  const inspirationItems = {
    tips,
    apts: showMoreApts ? [...aptsInitial, ...aptsMore] : aptsInitial,
  };

  const itemsToRender =
    activeTab === "apts" ? inspirationItems.apts : inspirationItems[activeTab];

  return (
    <footer className="w-full bg-[#f7f7f7] mt-5">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 border-t border-[#EEEEEE]">
        {/* Inspiration for future getaways */}
        <section className="py-8 sm:py-10">
          <h2 className="text-[22px] sm:text-[26px] font-semibold text-[#222222]">
            Inspiration for future getaways
          </h2>

          {/* Tabs */}
          <div className="mt-5 border-b border-[#EAEAEA]">
            <div role="tablist" className="flex gap-6 overflow-x-auto">
              {tabs.map((t) => {
                const isActive = t.id === activeTab;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(t.id)}
                    className={[
                      "whitespace-nowrap pb-3 text-[15px] transition-colors",
                      isActive
                        ? "text-[#222222] border-b-2 border-[#222222] font-medium"
                        : "text-[#717171] hover:text-[#222222]",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Items under active tab */}
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {itemsToRender.map((it) => (
              <a key={it.title} href="#" className="group block" aria-label={it.title}>
                <div className="text-[15px] font-semibold text-[#222222] group-hover:underline">
                  {it.title}
                </div>
                <div className="mt-1 text-[13px] text-[#717171]">{it.desc}</div>
              </a>
            ))}

            {/* Show more / Show less (only for apts tab) */}
            {activeTab === "apts" && !showMoreApts && (
              <button
                type="button"
                onClick={() => setShowMoreApts(true)}
                aria-expanded={showMoreApts}
                className="group block text-left"
              >
                <div className="inline-flex items-center gap-1 text-[15px] font-semibold text-[#222222] group-hover:underline">
                  Show more
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>
            )}
            {activeTab === "apts" && showMoreApts && (
              <button
                type="button"
                onClick={() => setShowMoreApts(false)}
                aria-expanded={showMoreApts}
                className="group block text-left"
              >
                <div className="inline-flex items-center gap-1 text-[15px] font-semibold text-[#222222] group-hover:underline">
                  Show less
                  <ChevronUp className="h-4 w-4" />
                </div>
              </button>
            )}
          </div>
        </section>

        {/* Link columns */}
        <section className="pt-6 sm:pt-10 pb-6 sm:pb-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {cols.map((col) => (
              <div key={col.title}>
                <div className="mb-3 text-[15px] font-semibold text-[#222222]">
                  {col.title}
                </div>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-[14px] text-[#222222] hover:underline">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom bar */}
        <div className="border-t border-[#EEEEEE]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
            {/* Left: legal */}
            <div className="text-[13px] text-[#717171]">
              © {new Date().getFullYear()} Airbnb, Inc. ·
              <a href="#" className="ml-2 hover:underline text-[#222222]">
                Terms
              </a>{" "}
              ·
              <a href="#" className="ml-2 hover:underline text-[#222222]">
                Sitemap
              </a>{" "}
              ·
              <a href="#" className="ml-2 hover:underline text-[#222222]">
                Privacy
              </a>{" "}
              ·
              <a
                href="#"
                className="ml-2 hover:underline text-[#222222] inline-flex items-center gap-1"
              >
                Your Privacy Choices
                <span aria-hidden className="ml-1 inline-flex items-center">
                  <img
                    src={tt}
                    alt="tik"
                    className="h-[16px] w-[25px] rounded object-cover"
                  />
                </span>
              </a>
            </div>

            {/* Right: chips and socials */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[13px] text-[#222222] hover:bg-[#F7F7F7]"
                aria-label="Select language"
              >
                <Globe className="h-4 w-4" />
                English (US)
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[13px] text-[#222222] hover:bg-[#F7F7F7]"
                aria-label="Select currency"
              >
                <DollarSign className="h-4 w-4" />
                USD
              </button>

              <div className="ml-1 flex items-center gap-1">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
                >
                  <Facebook className="h-4 w-4 text-[#222222]" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
                >
                  <Twitter className="h-4 w-4 text-[#222222]" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F7F7F7]"
                >
                  <Instagram className="h-4 w-4 text-[#222222]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}