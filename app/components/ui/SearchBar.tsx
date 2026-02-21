"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown, IndianRupee } from "lucide-react";
import Slider from "@mui/material/Slider";

export default function SearchBar() {
  const router = useRouter();
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000000]);
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

  const handleSearch = () => {
    const locSlug =
      location && location !== "SELECT" ? location.toLowerCase() : "all-plots";
    const params = new URLSearchParams();
    if (query) params.set("q", query.toLowerCase().replace(/\s+/g, "-"));
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 50000000)
      params.set("maxPrice", priceRange[1].toString());
    const queryString = params.toString();
    const finalUrl = queryString
      ? `/properties/${locSlug}?${queryString}`
      : `/properties/${locSlug}`;
    router.push(finalUrl);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".popover-container") &&
        !target.closest(".input-group")
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
    <div className="w-full max-w-[1200px] mx-auto relative z-[40] px-2 font-['Outfit']">
      <h2 className="text-2xl md:text-[1.5rem] font-black uppercase text-center mt-0 mb-4 tracking-[4px] bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-[var(--foreground)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[reveal3d_1s_ease-out,shimmer-sweep_3s_linear_infinite] md:block hidden drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]">
        FIND YOUR PERFECT PLOT
      </h2>
      <h2 className="md:hidden block text-lg font-black uppercase text-center mt-2.5 mb-[1.2rem] tracking-[2px] bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-[var(--foreground)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[reveal3d_1s_ease-out,shimmer-sweep_3s_linear_infinite] whitespace-nowrap drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]">
        FIND YOUR PERFECT PLOT
      </h2>

      <div className="bg-[var(--card)] border-2 border-[var(--primary)]/50 rounded-[20px] p-2 md:px-2 md:py-2 md:h-auto h-auto flex flex-col md:flex-row gap-3 relative overflow-visible shadow-[0_8px_16px_rgba(0,0,0,0.15)] items-center transition-all duration-300">
        {/* Search Input */}
        <div className="input-group flex-[1.5] w-full min-w-0 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--primary)] pointer-events-none"
            size={18}
            strokeWidth={3}
          />
          <input
            type="text"
            placeholder="SEARCH PROJECT..."
            className="w-full h-full min-h-[50px] md:min-h-[50px] min-h-[40px] pl-12 pr-4 bg-[var(--background)] border-2 border-[var(--primary)]/50 rounded-xl text-[var(--foreground)] font-semibold uppercase tracking-wider outline-none transition-all focus:border-[var(--primary)] focus:shadow-[0_5px_10px_-3px_rgba(var(--primary),0.3)] placeholder:text-[var(--muted)]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setActivePopover("suggestions")}
            onClick={(e) => {
              e.stopPropagation();
              setActivePopover("suggestions");
            }}
          />
          {activePopover === "suggestions" && suggestions.length > 0 && (
            <div className="absolute top-[110%] left-0 w-full bg-[var(--background)] border-2 border-[var(--primary)]/50 rounded-xl p-3 shadow-[0_10px_15px_-5px_rgba(var(--primary-rgb),0.3)] z-[50] animate-[fadeIn_0.15s_ease-out] overflow-y-auto max-h-[300px] scrollbar-hide">
              {suggestions.map((project, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(project);
                    setActivePopover(null);
                  }}
                  className="w-full text-left px-4 py-2 text-[var(--foreground)] bg-transparent border border-transparent rounded-lg font-semibold uppercase tracking-wider text-[0.8rem] cursor-pointer transition-all hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/40"
                >
                  {project}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="popover-container flex-1 w-full min-w-[180px] relative">
          <div
            className="w-full min-h-[50px] md:min-h-[50px] min-h-[40px] px-4 bg-[var(--background)] border-2 border-[var(--primary)]/50 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:border-[var(--primary)]"
            onClick={(e) => {
              e.stopPropagation();
              togglePopover("loc");
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-[0_2px_4px_-1px_rgba(var(--primary-rgb),0.5)]">
                <MapPin size={18} strokeWidth={2.5} className="text-white" />
              </div>
              <div>
                <div className="text-[var(--primary)] text-[0.5rem] font-bold uppercase tracking-wider">
                  CITY
                </div>
                <div className="text-[var(--foreground)] font-bold text-[0.825rem] whitespace-nowrap overflow-hidden text-ellipsis">
                  {location || "SELECT"}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`text-[var(--primary)] transition-transform duration-200 ${activePopover === "loc" ? "rotate-180" : ""}`}
              size={18}
              strokeWidth={3}
            />
          </div>

          {activePopover === "loc" && (
            <div className="absolute top-[110%] left-0 w-full bg-[var(--background)] border-2 border-[var(--primary)]/50 rounded-xl p-3 shadow-[0_10px_15px_-5px_rgba(var(--primary-rgb),0.3)] z-[50] animate-[fadeIn_0.15s_ease-out] overflow-y-auto max-h-[300px] scrollbar-hide">
              {["Hyderabad", "Bangalore", "Chennai", "Mumbai", "Pune"].map(
                (city) => (
                  <button
                    key={city}
                    onClick={() => handleLocationSelect(city)}
                    className="w-full text-left px-4 py-2 text-[var(--foreground)] bg-transparent border border-transparent rounded-lg font-semibold uppercase tracking-wider text-[0.8rem] cursor-pointer transition-all hover:bg-[var(--primary)]/20 hover:border-[var(--primary)]/40"
                  >
                    {city}
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        {/* Price Dropdown */}
        <div className="popover-container flex-1 w-full min-w-[180px] relative">
          <div
            className="w-full min-h-[50px] md:min-h-[50px] min-h-[40px] px-4 bg-[var(--background)] border-2 border-[var(--primary)]/50 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:border-[var(--primary)]"
            onClick={(e) => {
              e.stopPropagation();
              togglePopover("price");
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-[0_2px_4px_-1px_rgba(var(--primary-rgb),0.5)]">
                <IndianRupee
                  size={20}
                  strokeWidth={2.5}
                  className="text-white"
                />
              </div>
              <div>
                <div className="text-[var(--primary)] text-[0.5rem] font-bold uppercase tracking-wider">
                  BUDGET
                </div>
                <div className="text-[var(--foreground)] font-bold text-[0.825rem] whitespace-nowrap overflow-hidden text-ellipsis">
                  {displayPrice}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`text-[var(--primary)] transition-transform duration-200 ${activePopover === "price" ? "rotate-180" : ""}`}
              size={18}
              strokeWidth={3}
            />
          </div>

          {activePopover === "price" && (
            <div className="absolute top-[110%] left-0 w-full min-w-[300px] bg-[var(--background)] border-2 border-[var(--primary)]/50 rounded-xl p-6 shadow-[0_10px_15px_-5px_rgba(var(--primary-rgb),0.3)] z-[50] animate-[fadeIn_0.15s_ease-out]">
              <div className="px-2.5">
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={50000000}
                  step={500000}
                  sx={{
                    color: "var(--primary)",
                    height: 6,
                    "& .MuiSlider-thumb": {
                      width: 24,
                      height: 24,
                      backgroundColor: "#fff",
                      border: "2px solid currentColor",
                      "&:hover, &.Mui-focusVisible, &.Mui-active": {
                        boxShadow: "0 0 0 8px rgba(var(--primary-rgb), 0.16)",
                      },
                    },
                    "& .MuiSlider-rail": {
                      color: "var(--primary)",
                      opacity: 0.3,
                    },
                    "& .MuiSlider-valueLabel": {
                      backgroundColor: "var(--primary)",
                      color: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 0 10px rgba(var(--primary-rgb), 0.5)",
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
        <button
          className="search-btn w-full md:w-auto min-h-[50px] md:min-h-[50px] min-h-[40px] px-6 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] rounded-xl text-white font-extrabold text-base uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-[0_10px_15px_-5px_rgba(var(--primary-rgb),0.6)] shadow-[0_5px_10px_-3px_rgba(0,0,0,0.5)]"
          onClick={handleSearch}
        >
          <Search size={24} strokeWidth={3} />
          SEARCH
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
