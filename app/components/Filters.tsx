"use client";

interface FiltersProps {
  sortType: string;
  selectedAmenity: string;
  onSortChange: (value: string) => void;
  onAmenityChange: (value: string) => void;
}

export default function Filters({
  sortType,
  selectedAmenity,
  onSortChange,
  onAmenityChange,
}: FiltersProps) {
  const amenities = ["All", "Parking", "Water", "Swimming Pool", "Security"];

  return (
    <div className="filters">
      <h3>Filters</h3>

      <div className="filter-section">
        <h4>Sort By</h4>
        <select
          value={sortType}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="recent">Recently Added</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      <div className="filter-section">
        <h4>Amenities</h4>
        <div className="amenities-buttons">
          {amenities.map((amenity) => {
            const value = amenity === "All" ? "" : amenity;

            return (
              <button
                key={amenity}
                className={selectedAmenity === value ? "active" : ""}
                onClick={() => onAmenityChange(value)}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
