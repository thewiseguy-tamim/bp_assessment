import React from "react";
import PropertyCard from "./PropertyCard";
import Badge from "../common/Badge";


export default function GuestFavoriteCard({
  property,
  onClick,
  onWishlistChange,
  className = "",
}) {
  const favProp = { ...property, isGuestFavorite: true };

  return (
    <div className={`rounded-2xl ring-1 ring-[#FF385C]/15 p-2 ${className}`}>
      <div className="mb-1">
        <Badge size="sm" variant="subtle">
          Guest favorite
        </Badge>
      </div>
      <PropertyCard
        property={favProp}
        onClick={onClick}
        onWishlistChange={onWishlistChange}
      />
    </div>
  );
}