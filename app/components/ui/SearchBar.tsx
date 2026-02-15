"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown, IndianRupee } from "lucide-react";
import Slider from "@mui/material/Slider";
import "@/app/styles/neon-search.scss";

export default function SearchBar() {
  const router = useRouter();
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState(""); // New state for project search
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000000]); // 0 to 5CR
  const [displayPrice, setDisplayPrice] = useState("₹0L - ₹5Cr");

  const togglePopover = (id: string) => {
    setActivePopover(activePopover === id ? null : id);
  };

  const handleLocationSelect = (loc: string) => {
    setLocation(loc);
    setActivePopover(null);
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    const minL = (newValue as number[])[0] / 100000;
    const maxL = (newValue as number[])[1] / 100000;
    const minText =
      minL >= 100 ? `${(minL / 100).toFixed(1)}Cr` : `${Math.floor(minL)}L`;
    const maxText =
      maxL >= 100 ? `${(maxL / 100).toFixed(1)}Cr` : `${Math.floor(maxL)}L`;
    setDisplayPrice(`₹${minText} - ₹${maxText}`);
  };

  const applyPriceFilter = () => {
    setActivePopover(null);
  };

  const handleSearch = () => {
    // SEO Friendly URL Construction
    const locSlug =
      location && location !== "SELECT" ? location.toLowerCase() : "all-plots";

    const params = new URLSearchParams();

    // Only add query params if they exist/differ from defaults
    if (query) params.set("q", query.toLowerCase().replace(/\s+/g, "-")); // Slugify query for cleaner URL if preferred, or keep standard 'q'

    // Price params (only if filtered)
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 50000000)
      params.set("maxPrice", priceRange[1].toString());

    const queryString = params.toString();
    const finalUrl = queryString
      ? `/properties/${locSlug}?${queryString}`
      : `/properties/${locSlug}`;

    router.push(finalUrl);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !(event.target as HTMLElement).closest(".popover-container") &&
        !(event.target as HTMLElement).closest(".input-group")
      ) {
        setActivePopover(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const suggestions = [
    "Premium Plot",
    "Open Land",
    "Luxury Villa",
    "Gachibowli",
    "Whitefield",
    "Beachside Plot",
    "Hillview",
    "Mumbai",
    "Kompally",
    "Corner Plot",
  ].filter((s) => s.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="neon-wrapper">
      <h2 className="search-title">FIND YOUR PERFECT PLOT</h2>
      <div className="neon-container">
        {/* Search Input */}
        <div className="input-group">
          <Search className="icon" size={18} strokeWidth={3} />
          <input
            type="text"
            placeholder="SEARCH PROJECT..."
            className="neon-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setActivePopover("suggestions")}
            onClick={(e) => {
              e.stopPropagation();
              setActivePopover("suggestions");
            }}
          />
          {activePopover === "suggestions" && suggestions.length > 0 && (
            <div
              className="popover-content custom-scrollbar"
              style={{ top: "100%", marginTop: "0.5rem" }}
            >
              {suggestions.map((project, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(project);
                    setActivePopover(null);
                  }}
                  className="dropdown-item"
                >
                  {project}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location Dropdown (City Selection) */}
        <div className="popover-container loc">
          <div
            className="popover-btn"
            onClick={(e) => {
              e.stopPropagation();
              togglePopover("loc");
            }}
          >
            <div className="btn-content">
              <div className="icon-box">
                <MapPin size={18} strokeWidth={2.5} />
              </div>
              <div className="text-content">
                <div className="label">CITY</div>
                <div className="value">{location || "SELECT"}</div>
              </div>
            </div>
            <ChevronDown
              className={`chevron ${activePopover === "loc" ? "open" : ""}`}
              strokeWidth={3}
            />
          </div>

          {activePopover === "loc" && (
            <div className="popover-content custom-scrollbar">
              {["Hyderabad", "Bangalore", "Chennai", "Mumbai", "Pune"].map(
                (city) => (
                  <button
                    key={city}
                    onClick={() => handleLocationSelect(city)}
                    className="dropdown-item"
                  >
                    {city}
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        {/* Price Dropdown */}
        <div className="popover-container price">
          <div
            className="popover-btn"
            onClick={(e) => {
              e.stopPropagation();
              togglePopover("price");
            }}
          >
            <div className="btn-content">
              <div
                className="icon-box"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #f97316)",
                }}
              >
                <IndianRupee size={20} strokeWidth={2.5} />
              </div>
              <div className="text-content">
                <div className="label">BUDGET</div>
                <div className="value">{displayPrice}</div>
              </div>
            </div>
            <ChevronDown
              className={`chevron ${activePopover === "price" ? "open" : ""}`}
              strokeWidth={3}
            />
          </div>

          {activePopover === "price" && (
            <div
              className="popover-content"
              style={{ minWidth: "300px", padding: "1.5rem 1rem" }}
            >
              <div style={{ padding: "0 10px" }}>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={50000000} // 5 Crores
                  step={500000} // 5 Lakhs
                  sx={{
                    color: "#ec4899",
                    height: 6,
                    "& .MuiSlider-thumb": {
                      width: 24,
                      height: 24,
                      backgroundColor: "#fff",
                      border: "2px solid currentColor",
                      "&:hover, &.Mui-focusVisible, &.Mui-active": {
                        boxShadow: "0 0 0 8px rgba(236, 72, 153, 0.16)",
                      },
                    },
                    "& .MuiSlider-rail": {
                      color: "#fbcfe8",
                      opacity: 0.5,
                    },
                    "& .MuiSlider-valueLabel": {
                      backgroundColor: "#a855f7",
                      color: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 0 10px rgba(168, 85, 247, 0.5)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button className="search-btn" onClick={handleSearch}>
          <Search size={28} strokeWidth={3} />
          SEARCH
        </button>
      </div>
    </div>
  );
}
