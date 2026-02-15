"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import properties from "@/app/lib/properties";
import PropertyCard from "./PropertyCard";
import { Property } from "@/app/types";
import HorizontalCarousel from "@/app/components/ui/HorizontalCarousel";
import "@/app/styles/plots.scss";

export default function Plots() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const recentlyUploaded = [...properties]
    .sort((a, b) => b.id - a.id)
    .slice(0, 10);

  const availablePlots = properties.filter((item) => {
    if (item.status !== "available") return false;
    if (!searchTerm) return true;

    const lower = searchTerm.toLowerCase();

    return (
      item.location.toLowerCase().includes(lower) ||
      item.city.toLowerCase().includes(lower) ||
      item.price.toString().includes(lower)
    );
  });

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    setRecentlyViewed(viewed);
  }, []);

  const handleViewDetails = (property: Property) => {
    let viewed: Property[] = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]",
    );

    viewed = viewed.filter((item) => item.id !== property.id);
    viewed.unshift(property);
    viewed = viewed.slice(0, 10);

    localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
    setRecentlyViewed(viewed);
  };

  return (
    <div className="plots-page">
      <HorizontalCarousel
        title={`Available Plot ${
          searchTerm ? `(Search: "${searchTerm}")` : ""
        }`}
      >
        {availablePlots.map((item) => (
          <PropertyCard
            key={item.id}
            property={item}
            onView={handleViewDetails}
          />
        ))}
      </HorizontalCarousel>

      <HorizontalCarousel title="Recently Uploaded Plot">
        {recentlyUploaded.map((item) => (
          <PropertyCard
            key={item.id}
            property={item}
            onView={handleViewDetails}
          />
        ))}
      </HorizontalCarousel>

      <HorizontalCarousel title="Recently Viewed Plot">
        {recentlyViewed.map((item) => (
          <PropertyCard
            key={item.id}
            property={item}
            onView={handleViewDetails}
          />
        ))}
      </HorizontalCarousel>
    </div>
  );
}
