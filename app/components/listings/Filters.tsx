"use client";

import Slider from "@mui/material/Slider";
import { RotateCcw, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AMENITY_OPTIONS, getAmenityIcon } from "@/app/lib/amenities";

interface FiltersProps {
  sortType: string;
  selectedAmenities: string[];
  selectedType: string;
  selectedApproval: string;
  selectedFacing: string;
  selectedStatus: string;
  selectedRoadWidth: string;
  selectedPossession: string;
  isGatedOnly: boolean;
  priceRange: number[];
  areaRange: number[];
  areaUnit: string;
  selectedOwnership: string;
  selectedRoadType: string;
  selectedSellerType: string;
  isCornerPlot: boolean;
  noRoadHit: boolean;
  onlyRegularShape: boolean;
  noTJunction: boolean;
  noCornerPlot: boolean;
  onlyVastu: boolean;
  onSortChange: (value: string) => void;
  onAmenitiesChange: (value: string[]) => void;
  onTypeChange: (value: string) => void;
  onApprovalChange: (value: string) => void;
  onFacingChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoadWidthChange: (value: string) => void;
  onPossessionChange: (value: string) => void;
  onGatedToggle: (value: boolean) => void;
  onPriceChange: (value: number[]) => void;
  onAreaChange: (value: number[]) => void;
  onAreaUnitChange: (value: string) => void;
  onOwnershipChange: (value: string) => void;
  onRoadTypeChange: (value: string) => void;
  onSellerTypeChange: (value: string) => void;
  onCornerPlotToggle: (value: boolean) => void;
  onNoRoadHitToggle: (value: boolean) => void;
  onOnlyRegularShapeToggle: (value: boolean) => void;
  onNoTJunctionToggle: (value: boolean) => void;
  onNoCornerPlotToggle: (value: boolean) => void;
  onOnlyVastuToggle: (value: boolean) => void;
  showTitle?: boolean;
}

export default function Filters({
  sortType,
  selectedAmenities,
  selectedType,
  selectedApproval,
  selectedFacing,
  selectedStatus,
  selectedRoadWidth,
  selectedPossession,
  isCornerPlot,
  areaUnit,
  priceRange,
  areaRange,
  selectedOwnership,
  selectedRoadType,
  selectedSellerType,
  onSortChange,
  onAmenitiesChange,
  onTypeChange,
  onApprovalChange,
  onFacingChange,
  onStatusChange,
  onRoadWidthChange,
  onPossessionChange,
  isGatedOnly,
  onGatedToggle,
  onPriceChange,
  onAreaChange,
  onAreaUnitChange,
  onOwnershipChange,
  onRoadTypeChange,
  onSellerTypeChange,
  onCornerPlotToggle,
  noRoadHit,
  onlyRegularShape,
  noTJunction,
  noCornerPlot,
  onlyVastu,
  onNoRoadHitToggle,
  onOnlyRegularShapeToggle,
  onNoTJunctionToggle,
  onNoCornerPlotToggle,
  onOnlyVastuToggle,
  showTitle = true,
}: FiltersProps) {
  const amenitiesList = ["All", ...AMENITY_OPTIONS];
  const propertyTypes = ["All", "Residential", "Villa", "Farm", "Commercial"];
  const approvals = ["All", "HMDA", "DTCP", "Grama Panchayath"];
  const facingsList = [
    "All",
    "East",
    "West",
    "North",
    "South",
    "North-East",
    "North-West",
    "South-East",
    "South-West",
  ];
  const statuses = ["All", "Available", "Sold", "Coming Soon"];
  const roadWidths = ["All", "30", "33", "40", "60", "100"];
  const possessions = ["All", "Immediate", "3 Months", "6 Months", "1 Year"];
  const ownerships = ["All", "Freehold", "GPA", "Registered", "Lease"];
  const roadTypes = ["All", "Black Top", "CC Road", "Metal Road"];
  const sellerTypes = ["All", "Owner", "Agent", "Advisor", "Company"];

  const [showAllFacing, setShowAllFacing] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showPrefDropdown, setShowPrefDropdown] = useState(false);
  const [showAmenitiesDropdown, setShowAmenitiesDropdown] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLDivElement>(null);
  const prefRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node))
        setShowSortDropdown(false);
      if (unitRef.current && !unitRef.current.contains(event.target as Node))
        setShowUnitDropdown(false);
      if (prefRef.current && !prefRef.current.contains(event.target as Node))
        setShowPrefDropdown(false);
      if (
        amenitiesRef.current &&
        !amenitiesRef.current.contains(event.target as Node)
      )
        setShowAmenitiesDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReset = () => {
    onSortChange("recent");
    onAmenitiesChange([]);
    onTypeChange("");
    onApprovalChange("");
    onFacingChange("");
    onStatusChange("");
    onRoadWidthChange("");
    onPossessionChange("");
    onOwnershipChange("");
    onRoadTypeChange("");
    onSellerTypeChange("");
    onGatedToggle(false);
    onCornerPlotToggle(false);
    onNoRoadHitToggle(false);
    onOnlyRegularShapeToggle(false);
    onNoTJunctionToggle(false);
    onNoCornerPlotToggle(false);
    onOnlyVastuToggle(false);
    onPriceChange([0, 50000000]);
    onAreaChange([0, 10000]);
    onAreaUnitChange("sqyd");
  };

  const formatPrice = (value: number) =>
    value >= 100000
      ? `${(value / 100000).toFixed(1).replace(".0", "")}L`
      : `${value}`;

  return (
    <div className="bg-[var(--card)] backdrop-blur-[12px] border-r border-[var(--primary)]/20 w-full p-6 pb-10 h-full overflow-y-auto shadow-[10px_0_30px_-15px_rgba(0,0,0,0.5)] text-[var(--foreground)] transition-colors duration-300">
      {showTitle && (
        <div className="sticky -top-6 z-20 bg-[var(--card)]/95 backdrop-blur-md px-6 py-4 -mx-6 mb-6 flex justify-between items-center border-b-2 border-[var(--primary)]/20 gap-2.5">
          <h3 className="text-xl font-extrabold text-[var(--primary)] uppercase tracking-[1.5px] m-0 flex items-center gap-2.5 before:content-[''] before:w-1 before:h-[18px] before:bg-[var(--secondary)] before:rounded-sm">
            Filters
          </h3>
          <button
            className="bg-transparent border-none text-[var(--muted)] text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors"
            onClick={handleReset}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      )}

      {/* SORT SECTION */}
      <div className="mb-[30px] relative z-[50]">
        <h4 className="text-[0.85rem] mb-[15px] text-[var(--secondary)] font-bold uppercase">
          Sort By
        </h4>
        <div className="relative w-full" ref={sortRef}>
          <button
            className="w-full flex items-center justify-between p-2.5 bg-[var(--background)]/60 border border-[var(--primary)]/20 rounded-xl text-[var(--foreground)] font-semibold cursor-pointer"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <span>
              {sortType === "recent"
                ? "Recently Added"
                : sortType === "low"
                  ? "Price: Low to High"
                  : "Price: High to Low"}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${showSortDropdown ? "rotate-180" : ""}`}
            />
          </button>
          {showSortDropdown && (
            <div className="absolute top-full left-0 w-full mt-1.5 bg-[var(--card)] border border-[var(--secondary)]/40 rounded-xl p-1.5 z-[110] flex flex-col gap-1 shadow-2xl">
              {[
                { id: "recent", label: "Recently Added" },
                { id: "low", label: "Price: Low to High" },
                { id: "high", label: "Price: High to Low" },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`w-full p-2.5 bg-transparent border-none text-[var(--muted)] cursor-pointer rounded-lg flex items-center justify-between gap-2.5 transition-all hover:bg-[var(--primary)]/10 ${sortType === item.id ? "bg-[var(--primary)]/10 text-[var(--primary)]" : ""}`}
                  onClick={() => {
                    onSortChange(item.id);
                    setShowSortDropdown(false);
                  }}
                >
                  {item.label}
                  {sortType === item.id && <CheckCircle size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PREFERENCES */}
      <div className="mb-[30px] relative z-[45]">
        <h4 className="text-[0.85rem] mb-[15px] text-[var(--secondary)] font-bold uppercase">
          Avoid / Preference
        </h4>
        <div className="relative w-full" ref={prefRef}>
          <button
            className="w-full flex items-center justify-between p-2.5 bg-[var(--background)]/60 border border-[var(--primary)]/20 rounded-xl text-[var(--foreground)] font-semibold cursor-pointer"
            onClick={() => setShowPrefDropdown(!showPrefDropdown)}
          >
            <span>
              {[
                noRoadHit && "No",
                onlyRegularShape && "Reg",
                noTJunction && "No T",
                noCornerPlot && "No Cor",
                onlyVastu && "Vastu",
                isGatedOnly && "Gated",
                isCornerPlot && "Corner",
              ].filter(Boolean).length || "Select Preferences"}
              {[
                noRoadHit,
                onlyRegularShape,
                noTJunction,
                noCornerPlot,
                onlyVastu,
                isGatedOnly,
                isCornerPlot,
              ].filter(Boolean).length > 0
                ? " Active"
                : ""}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${showPrefDropdown ? "rotate-180" : ""}`}
            />
          </button>
          {showPrefDropdown && (
            <div className="absolute top-full left-0 w-full mt-1.5 bg-[var(--card)] border border-[var(--secondary)]/40 rounded-xl p-1.5 z-[110] flex flex-col gap-1 shadow-2xl">
              {[
                {
                  label: "No Road Hit",
                  active: noRoadHit,
                  toggle: () => onNoRoadHitToggle(!noRoadHit),
                },
                {
                  label: "Regular Shape Only",
                  active: onlyRegularShape,
                  toggle: () => onOnlyRegularShapeToggle(!onlyRegularShape),
                },
                {
                  label: "No T-Junction",
                  active: noTJunction,
                  toggle: () => onNoTJunctionToggle(!noTJunction),
                },
                {
                  label: "No Corner Plot",
                  active: noCornerPlot,
                  toggle: () => onNoCornerPlotToggle(!noCornerPlot),
                },
                {
                  label: "Vastu OK Only",
                  active: onlyVastu,
                  toggle: () => onOnlyVastuToggle(!onlyVastu),
                },
                {
                  label: "Gated Community Only",
                  active: isGatedOnly,
                  toggle: () => onGatedToggle(!isGatedOnly),
                },
                {
                  label: "Corner Plot Only",
                  active: isCornerPlot,
                  toggle: () => onCornerPlotToggle(!isCornerPlot),
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className={`w-full p-2.5 bg-transparent border-none text-[var(--muted)] cursor-pointer rounded-lg flex items-center justify-between gap-2.5 transition-all hover:bg-[var(--primary)]/10 ${item.active ? "bg-[var(--primary)]/10 text-[var(--primary)]" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.toggle();
                  }}
                >
                  {item.label}
                  {item.active && <CheckCircle size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AMENITIES */}
      <div className="mb-[30px] relative z-[40]">
        <h4 className="text-[0.85rem] mb-[15px] text-[var(--secondary)] font-bold uppercase">
          Amenities
        </h4>
        <div className="relative w-full" ref={amenitiesRef}>
          <button
            className="w-full flex items-center justify-between p-2.5 bg-[var(--background)]/60 border border-[var(--primary)]/20 rounded-xl text-[var(--foreground)] font-semibold cursor-pointer"
            onClick={() => setShowAmenitiesDropdown(!showAmenitiesDropdown)}
          >
            <span>
              {selectedAmenities.length > 0
                ? `${selectedAmenities.length} Selected`
                : "Select Amenities"}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${showAmenitiesDropdown ? "rotate-180" : ""}`}
            />
          </button>
          {showAmenitiesDropdown && (
            <div className="absolute top-full left-0 w-full mt-1.5 bg-[var(--card)] border border-[var(--secondary)]/40 rounded-xl p-1.5 z-[110] flex flex-col gap-1 shadow-2xl max-h-[250px] overflow-y-auto">
              {amenitiesList
                .filter((a) => a !== "All")
                .map((amenity) => {
                  const isActive = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      className={`w-full p-2.5 bg-transparent border-none text-[var(--muted)] cursor-pointer rounded-lg flex items-center justify-between gap-2.5 transition-all hover:bg-[var(--primary)]/10 ${isActive ? "bg-[var(--primary)]/10 text-[var(--primary)]" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAmenitiesChange(
                          isActive
                            ? selectedAmenities.filter((a) => a !== amenity)
                            : [...selectedAmenities, amenity],
                        );
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                      {isActive && <CheckCircle size={14} />}
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* GRID BUTTONS FOR OTHER FILTERS */}
      {[
        {
          label: "Status",
          list: statuses,
          selected: selectedStatus,
          setter: onStatusChange,
        },
        {
          label: "Possession",
          list: possessions,
          selected: selectedPossession,
          setter: onPossessionChange,
        },
        {
          label: "Property Type",
          list: propertyTypes,
          selected: selectedType,
          setter: onTypeChange,
        },
        {
          label: "Approval",
          list: approvals,
          selected: selectedApproval,
          setter: onApprovalChange,
        },
        {
          label: "Ownership",
          list: ownerships,
          selected: selectedOwnership,
          setter: onOwnershipChange,
        },
        {
          label: "Road Type",
          list: roadTypes,
          selected: selectedRoadType,
          setter: onRoadTypeChange,
        },
        {
          label: "Seller Type",
          list: sellerTypes,
          selected: selectedSellerType,
          setter: onSellerTypeChange,
        },
      ].map((section, idx) => (
        <div key={idx} className="mb-[30px]">
          <h4 className="text-[0.85rem] mb-[15px] text-[var(--secondary)] font-bold uppercase">
            {section.label}
          </h4>
          <div className="flex flex-wrap gap-2">
            {section.list.map((item) => {
              const value = item === "All" ? "" : item;
              const isActive = section.selected === value;
              return (
                <button
                  key={item}
                  className={`px-3 py-2 rounded-xl bg-[var(--background)]/40 text-[var(--muted)] text-[0.75rem] cursor-pointer border border-[var(--border)] transition-all hover:border-[var(--primary)]/50 ${isActive ? "bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white border-none shadow-[0_0_10px_rgba(var(--primary),0.3)]" : ""}`}
                  onClick={() => section.setter(value)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* FACING (with show more) */}
      <div className="mb-[30px]">
        <h4 className="text-[0.85rem] mb-[15px] text-[var(--secondary)] font-bold uppercase">
          Facing
        </h4>
        <div className="flex flex-wrap gap-2">
          {(showAllFacing ? facingsList : facingsList.slice(0, 5)).map(
            (facing) => {
              const value = facing === "All" ? "" : facing;
              const isActive = selectedFacing === value;
              return (
                <button
                  key={facing}
                  className={`px-3 py-2 rounded-xl bg-[var(--background)]/40 text-[var(--muted)] text-[0.75rem] cursor-pointer border border-[var(--border)] transition-all hover:border-[var(--primary)]/50 ${isActive ? "bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white border-none shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" : ""}`}
                  onClick={() => onFacingChange(value)}
                >
                  {facing}
                </button>
              );
            },
          )}
        </div>
        {facingsList.length > 5 && (
          <button
            className="mt-2 bg-transparent border-none text-[var(--primary)] cursor-pointer flex items-center gap-1 text-[13px] font-semibold hover:text-[var(--foreground)] transition-colors"
            onClick={() => setShowAllFacing(!showAllFacing)}
          >
            {showAllFacing ? (
              <>
                <ChevronUp size={14} /> Show Less
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Show More ({facingsList.length - 5})
              </>
            )}
          </button>
        )}
      </div>

      {/* ROAD WIDTH */}
      <div className="mb-[30px]">
        <h4 className="text-[0.85rem] mb-[15px] text-[var(--secondary)] font-bold uppercase">
          Road Width (ft)
        </h4>
        <div className="flex flex-wrap gap-2">
          {roadWidths.map((rw) => {
            const value = rw === "All" ? "" : rw;
            const isActive = selectedRoadWidth === value;
            return (
              <button
                key={rw}
                className={`px-3 py-2 rounded-xl bg-[var(--background)]/40 text-[var(--muted)] text-[0.75rem] cursor-pointer border border-[var(--border)] transition-all hover:border-[var(--primary)]/50 ${isActive ? "bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white border-none shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" : ""}`}
                onClick={() => onRoadWidthChange(value)}
              >
                {rw} {rw !== "All" && "ft"}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRICE RANGE */}
      <div className="mb-[30px]">
        <h4 className="text-[0.85rem] mb-[15px] text-[var(--secondary)] font-bold uppercase">
          Price Range
        </h4>
        <div className="px-1.5">
          <Slider
            value={priceRange}
            onChange={(_, newValue) => onPriceChange(newValue as number[])}
            valueLabelDisplay="auto"
            min={0}
            max={50000000}
            step={500000}
            sx={{
              color: "var(--primary)",
              height: 6,
              "& .MuiSlider-thumb": {
                width: 18,
                height: 18,
                backgroundColor: "#fff",
                border: "2px solid currentColor",
              },
              "& .MuiSlider-rail": { color: "var(--muted)", opacity: 0.3 },
            }}
          />
          <div className="flex justify-between items-center mt-2.5 text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
            <span className="flex items-center gap-1 text-[var(--primary)]">
              <IndianRupee size={12} /> {formatPrice(priceRange[0])}
            </span>
            <span className="opacity-30">-</span>
            <span className="flex items-center gap-1 text-[var(--primary)]">
              <IndianRupee size={12} /> {formatPrice(priceRange[1])}
            </span>
          </div>
        </div>
      </div>

      {/* AREA RANGE */}
      <div className="mb-[30px] relative">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[0.85rem] text-[var(--secondary)] font-bold uppercase m-0">
            Area
          </h4>
          <div className="relative" ref={unitRef}>
            <button
              className="flex items-center gap-1.5 bg-[var(--background)]/80 border border-[var(--secondary)]/30 text-[var(--foreground)] px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-[var(--secondary)]/10 hover:border-[var(--secondary)] hover:text-white"
              onClick={() => setShowUnitDropdown(!showUnitDropdown)}
            >
              <span>
                {
                  {
                    sqyd: "Sq.Yd",
                    sqft: "Sq.Ft",
                    gunta: "Gunta",
                    acre: "Acre",
                    cent: "Cent",
                  }[areaUnit]
                }
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${showUnitDropdown ? "rotate-180" : ""}`}
              />
            </button>
            {showUnitDropdown && (
              <div className="absolute bottom-full right-0 mb-1.5 bg-[var(--card)] border border-[var(--secondary)]/30 rounded-lg p-1 min-w-[100px] shadow-2xl z-[110]">
                {["sqyd", "sqft", "gunta", "acre", "cent"].map((unit) => (
                  <button
                    key={unit}
                    className={`w-full text-center p-2 text-[0.8rem] rounded-md transition-all hover:bg-[var(--primary)]/10 ${areaUnit === unit ? "text-[var(--primary)] bg-[var(--primary)]/10" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
                    onClick={() => {
                      onAreaUnitChange(unit);
                      setShowUnitDropdown(false);
                    }}
                  >
                    {
                      {
                        sqyd: "Sq.Yd",
                        sqft: "Sq.Ft",
                        gunta: "Gunta",
                        acre: "Acre",
                        cent: "Cent",
                      }[unit]
                    }
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="px-1.5">
          <Slider
            value={areaRange}
            onChange={(_, newValue) => onAreaChange(newValue as number[])}
            valueLabelDisplay="auto"
            min={0}
            max={
              areaUnit === "acre"
                ? 10
                : areaUnit === "gunta" || areaUnit === "cent"
                  ? 100
                  : 10000
            }
            step={areaUnit === "acre" || areaUnit === "cent" ? 0.1 : 1}
            sx={{
              color: "var(--secondary)",
              height: 6,
              "& .MuiSlider-thumb": {
                width: 18,
                height: 18,
                backgroundColor: "#fff",
                border: "2px solid currentColor",
              },
              "& .MuiSlider-rail": { color: "var(--muted)", opacity: 0.3 },
            }}
          />
          <div className="flex justify-between items-center mt-2.5 text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
            <span className="text-[var(--secondary)]">
              {areaRange[0]}{" "}
              {
                {
                  sqyd: "Sq.Yd",
                  sqft: "Sq.Ft",
                  gunta: "Gunta",
                  acre: "Acre",
                  cent: "Cent",
                }[areaUnit]
              }
            </span>
            <span className="opacity-30">-</span>
            <span className="text-[var(--secondary)]">
              {areaRange[1]}{" "}
              {
                {
                  sqyd: "Sq.Yd",
                  sqft: "Sq.Ft",
                  gunta: "Gunta",
                  acre: "Acre",
                  cent: "Cent",
                }[areaUnit]
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IndianRupee({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </svg>
  );
}
