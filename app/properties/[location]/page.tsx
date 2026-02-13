"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

import properties from "../../../public/data/script";
import "../../components/styles/listings.scss";

interface Property {
  id: number;
  title: string;
  location: string;
  city?: string;
  price: number;
  image: string;
  status: string;
  createdAt: string;
  description: string;
  amenities: string[];
}

export default function Listings() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filteredData, setFilteredData] = useState<Property[]>([]);
  const [sortType, setSortType] = useState<string>("recent");
  const [selectedAmenity, setSelectedAmenity] = useState<any>("");

  const formatPrice = (price: number) =>
    `₹${(price / 100000).toFixed(1).replace(".0", "")} Lakhs`;

  useEffect(() => {
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

      const priceMatch = item.price >= minPrice && item.price <= maxPrice;

      const amenityMatch =
        selectedAmenity === "" || item.amenities.includes(selectedAmenity);

      return locationMatch && priceMatch && amenityMatch;
    });

    result.sort((a, b) => {
      if (a.status === "available" && b.status !== "available") return -1;
      if (a.status !== "available" && b.status === "available") return 1;

      if (sortType === "low") return a.price - b.price;
      if (sortType === "high") return b.price - a.price;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredData(result);
  }, [searchParams, sortType, selectedAmenity]);

  return (
    <div className="listing-page">
      {/* LEFT FILTERS */}
      <div className="filters">
        <h3>Filters</h3>

        <div className="filter-section">
          <h4>Sort By</h4>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="recent">Recently Added</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        <div className="filter-section">
          <h4>Amenities</h4>
          <div className="amenities-buttons">
            {["All", "Parking", "Water", "Swimming Pool", "Security"].map(
              (amenity) => (
                <button
                  key={amenity}
                  className={
                    selectedAmenity === (amenity === "All" ? "" : amenity)
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedAmenity(amenity === "All" ? "" : amenity)
                  }
                >
                  {amenity}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* RIGHT CARDS */}
      <div className="cards">
        {filteredData.length === 0 ? (
          <p>No properties found</p>
        ) : (
          filteredData.map((item) => (
            <div
              key={item.id}
              className="card"
              onClick={() => router.push(`/property/${item.id}`)}
            >
              <div className="card-image">
                <img src={item.image} alt={item.title} />

                <div className="price-badge">{formatPrice(item.price)}</div>
              </div>

              <div className="card-body">
                <h4 className="property-title">{item.title}</h4>
                <p className="location">
                  <MapPin size={16} className="location-icon" />
                  {item.location}
                </p>

                <div className="divider"></div>

                <div className="description-section">
                  <p className="property-description">
                    {item.description.length > 80
                      ? item.description.slice(0, 80) + "..."
                      : item.description}
                  </p>
                </div>

                <button className="contact-btn">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
