"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";

import properties from "../../../public/data/script";
import Filters from "../../components/Filters";
import PropertyCard, { Property } from "../../components/PropertyCard";

import "../../components/styles/listings.scss";

export default function Listings() {
  const searchParams = useSearchParams();

  const [sortType, setSortType] = useState("recent");
  const [selectedAmenity, setSelectedAmenity] = useState("");

  const filteredData = useMemo(() => {
    const locationQuery = searchParams.get("location") || "";
    const minPrice = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : 0;
    const maxPrice = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : Infinity;

    let result = properties.filter((item) => {
      const locationMatch =
        locationQuery === "" ||
        item.location.toLowerCase().includes(locationQuery.toLowerCase()) ||
        item.city?.toLowerCase().includes(locationQuery.toLowerCase());

      const priceMatch =
        item.price >= minPrice && item.price <= maxPrice;

      const amenityMatch =
        selectedAmenity === "" ||
        item.amenities.includes(selectedAmenity);

      return locationMatch && priceMatch && amenityMatch;
    });

    result.sort((a, b) => {
      if (a.status === "available" && b.status !== "available")
        return -1;
      if (a.status !== "available" && b.status === "available")
        return 1;

      if (sortType === "low") return a.price - b.price;
      if (sortType === "high") return b.price - a.price;

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

    return result;
  }, [searchParams, sortType, selectedAmenity]);

  return (
    <div className="listing-page">

      {/* LEFT SIDE FILTERS */}
      <Filters
        sortType={sortType}
        selectedAmenity={selectedAmenity}
        onSortChange={setSortType}
        onAmenityChange={setSelectedAmenity}
      />

      {/* RIGHT SIDE CARDS */}
      <div className="cards">
        {filteredData.length === 0 ? (
          <p>No properties found</p>
        ) : (
          filteredData.map((item) => (
            <PropertyCard
              key={item.id}
              property={item}
            />
          ))
        )}
      </div>

    </div>
  );
}
