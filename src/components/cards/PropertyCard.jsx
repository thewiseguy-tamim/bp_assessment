import React, { useEffect, useMemo, useRef, useState } from "react";
import Badge from "../common/Badge";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
const FALLBACK_IMG = "https://placehold.co/1200x900?text=No+Image";

/**
 * PropertyCard
 * - Image carousel with dots
 * - Wishlist heart (persisted to localStorage)
 * - Optional "Guest favorite" badge
 * - Hover: image scale
 *
 * Props:
 * - property: {
 *     id, title, location, city, country,
 *     images: string[], price, nights, rating,
 *     isGuestFavorite, type
 *   }
 * - onClick?: () => void
 * - onWishlistChange?: (id, saved) => void
 * - className?: string
 */
export default function PropertyCard({
  property,
  onClick,
  onWishlistChange,
  className = "",
}) {
  const {
    id,
    title,
    location,
    city,
    country,
    images = [],
    price,
    nights = 1,
    rating,
    isGuestFavorite,
    type,
  } = property || {};

  // Stable, sized fallback images to reduce Unsplash redirect/429 issues
  const imageList = useMemo(() => {
    if (Array.isArray(images) && images.length) return images;
    return [
      "https://source.unsplash.com/1200x900/?apartment&sig=1",
      "https://source.unsplash.com/1200x900/?interior&sig=2",
      "https://source.unsplash.com/1200x900/?bedroom&sig=3",
    ];
  }, [images]);
  const onImgError = (e) => {
    // Swap to a guaranteed placeholder and end skeleton state
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMG;
    setLoaded(true);
  };

  // Carousel state
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    setLoaded(false);
  }, [index]);

  // Preload next image for smoother transitions
  useEffect(() => {
    const nextIdx = (index + 1) % imageList.length;
    const img = new Image();
    img.src = imageList[nextIdx];
  }, [index, imageList]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + imageList.length) % imageList.length);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % imageList.length);
  };

  // Swipe (mobile)
  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const startX = touchStartX.current;
    if (startX == null) return;
    const diff = e.changedTouches[0].clientX - startX;
    const threshold = 40;
    if (diff > threshold) handlePrev(e);
    if (diff < -threshold) handleNext(e);
    touchStartX.current = null;
  };

  // Wishlist localStorage
  const WISHLIST_KEY = "wishlist";
  const initialSaved = useMemo(() => {
    try {
      const arr = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
      return Array.isArray(arr) && id ? arr.includes(id) : false;
    } catch {
      return false;
    }
  }, [id]);

  const [saved, setSaved] = useState(initialSaved);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    const next = !saved;
    setSaved(next);
    try {
      const arr = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
      const set = new Set(Array.isArray(arr) ? arr : []);
      if (next) set.add(id);
      else set.delete(id);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify([...set]));
    } catch {}
    onWishlistChange?.(id, next);
  };

  const locationLine =
    location || [city, country].filter(Boolean).join(", ") || type || "Stay";

  return (
    <div
      className={`group cursor-pointer select-none ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick?.();
      }}
      aria-label={`${title || "Property"} in ${locationLine}`}
    >
      {/* Media */}
      <div
        className="relative w-full overflow-hidden rounded-xl"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* 4:3 aspect without plugin */}
        <div className="pt-[75%]" />
        <div className="absolute inset-0">
          {/* Current image (fade) */}
          <img
            src={imageList[index]}
            alt={title || "Property image"}
            decoding="async"
            className={`h-full w-full object-cover transition-transform duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            } group-hover:scale-105`}
            onLoad={() => setLoaded(true)}
            onError={onImgError}
            loading="lazy"
          />
          {/* Skeleton */}
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-neutral-200" />
          )}

          {/* Guest favorite badge */}
          {isGuestFavorite && (
            <div className="absolute left-3 top-3">
              <Badge
                size="sm"
                variant="neutral"
                className="backdrop-blur bg-white/90"
              >
                Guest favorite
              </Badge>
            </div>
          )}

          {/* Wishlist heart */}
          <button
            type="button"
            aria-pressed={saved}
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            onClick={toggleWishlist}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110"
          >
            <Heart
              className={`h-5 w-5 ${
                saved ? "text-[#FF385C]" : "text-[#222222]"
              }`}
              // Fill for saved state
              style={saved ? { fill: "#FF385C", stroke: "white" } : {}}
            />
          </button>

          {/* Carousel controls (desktop hover) */}
          {imageList.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5 text-[#222222]" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5 text-[#222222]" />
              </button>
            </>
          )}

          {/* Dots */}
          {imageList.length > 1 && (
            <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1">
              {imageList.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition ${
                    i === index ? "bg-white" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="mt-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[15px] font-medium text-[#222222]">
              {locationLine}
            </div>
            <div className="mt-0.5 text-[13px] text-[#717171] overflow-hidden max-h-[40px] line-clamp-2">
              {title}
            </div>
          </div>
          <div className="shrink-0 text-[13px] text-[#222222]">
            <span aria-hidden="true">★</span>{" "}
            <span className="font-medium">{Number(rating || 4.9).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-1 text-[15px] text-[#222222]">
          <span className="font-semibold">${price}</span>
          <span className="text-[#717171]"> for {nights} {nights > 1 ? "nights" : "night"}</span>
        </div>
      </div>
    </div>
  );
}