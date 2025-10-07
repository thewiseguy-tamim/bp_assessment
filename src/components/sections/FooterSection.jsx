import React from "react";
import { Globe, DollarSign, Facebook, Instagram, Twitter } from "lucide-react";

/**
 * FooterSection
 * - Three columns: Support, Hosting, Airbnb
 * - Bottom bar with legal links, selector chips, and social icons
 */
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

  return (
    <footer className="w-full bg-white">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 py-10 sm:py-12 border-t border-[#EEEEEE]">
        {/* Columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cols.map((col) => (
            <div key={col.title}>
              <div className="mb-3 text-[15px] font-semibold text-[#222222]">
                {col.title}
              </div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[13px] text-[#222222] hover:underline"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-[#EEEEEE] pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[13px] text-[#717171]">
              © {new Date().getFullYear()} Airbnb, Inc. ·
              <a href="#" className="ml-2 hover:underline text-[#222222]">Terms</a> ·
              <a href="#" className="ml-2 hover:underline text-[#222222]">Sitemap</a> ·
              <a href="#" className="ml-2 hover:underline text-[#222222]">Privacy</a> ·
              <a href="#" className="ml-2 hover:underline text-[#222222]">Your Privacy Choices</a>
            </div>

            <div className="flex items-center gap-2">
              {/* Language / currency / region */}
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

              {/* Social icons */}
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