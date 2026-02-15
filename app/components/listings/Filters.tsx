"use client";

import Slider from "@mui/material/Slider";
import {
  Car,
  Droplets,
  Waves,
  ShieldCheck,
  LayoutGrid,
  IndianRupee,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Wind,
  Zap,
  Shield,
  TreePine,
  Wifi,
  Coffee,
  School,
  ShoppingBag,
  Dumbbell,
  Utensils,
  Stethoscope,
  Bus,
  Train,
  Plane,
  Landmark,
  CheckCircle,
  Tent,
} from "lucide-react";
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
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
      if (unitRef.current && !unitRef.current.contains(event.target as Node)) {
        setShowUnitDropdown(false);
      }
      if (prefRef.current && !prefRef.current.contains(event.target as Node)) {
        setShowPrefDropdown(false);
      }
      if (
        amenitiesRef.current &&
        !amenitiesRef.current.contains(event.target as Node)
      ) {
        setShowAmenitiesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    <div className="filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <button
          className="reset-btn"
          onClick={handleReset}
          title="Reset All Filters"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* SORT SECTION */}
      <div className={`filter-section ${showSortDropdown ? "active" : ""}`}>
        <h4>Sort By</h4>
        <div className="custom-dropdown-container" ref={sortRef}>
          <button
            className="dropdown-trigger"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <span>
              {sortType === "recent"
                ? "Recently Added"
                : sortType === "low"
                  ? "Price: Low to High"
                  : "Price: High to Low"}
            </span>
            <ChevronDown size={16} className={showSortDropdown ? "open" : ""} />
          </button>

          {showSortDropdown && (
            <div className="dropdown-menu">
              {[
                { id: "recent", label: "Recently Added" },
                { id: "low", label: "Price: Low to High" },
                { id: "high", label: "Price: High to Low" },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`dropdown-item ${sortType === item.id ? "active" : ""}`}
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

      {/* PREFERENCES / AVOID LIST */}
      <div className={`filter-section ${showPrefDropdown ? "active" : ""}`}>
        <h4>Avoid / Preference</h4>
        <div className="custom-dropdown-container" ref={prefRef}>
          <button
            className="dropdown-trigger"
            onClick={() => setShowPrefDropdown(!showPrefDropdown)}
          >
            <span>
              {[
                noRoadHit && "No Road Hit",
                onlyRegularShape && "Regular Shape",
                noTJunction && "No T-Junction",
                noCornerPlot && "No Corner Plot",
                onlyVastu && "Vastu OK",
                isGatedOnly && "Gated Only",
                isCornerPlot && "Corner Plot",
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
            <ChevronDown size={16} className={showPrefDropdown ? "open" : ""} />
          </button>

          {showPrefDropdown && (
            <div className="dropdown-menu">
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
                  className={`dropdown-item ${item.active ? "active" : ""}`}
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

      {/* AMENITIES SECTION - DROPDOWN */}
      <div
        className={`filter-section ${showAmenitiesDropdown ? "active" : ""}`}
      >
        <h4>Amenities</h4>
        <div className="custom-dropdown-container" ref={amenitiesRef}>
          <button
            className="dropdown-trigger"
            onClick={() => setShowAmenitiesDropdown(!showAmenitiesDropdown)}
          >
            <span>
              {selectedAmenities.length > 0
                ? `${selectedAmenities.length} Selected`
                : "Select Amenities"}
            </span>
            <ChevronDown
              size={16}
              className={showAmenitiesDropdown ? "open" : ""}
            />
          </button>

          {showAmenitiesDropdown && (
            <div className="dropdown-menu">
              {amenitiesList
                .filter((a) => a !== "All")
                .map((amenity) => {
                  const isActive = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      className={`dropdown-item ${isActive ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newAmenities = isActive
                          ? selectedAmenities.filter((a) => a !== amenity)
                          : [...selectedAmenities, amenity];
                        onAmenitiesChange(newAmenities);
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
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

      <div className="filter-section">
        <h4>Status</h4>
        <div className="amenities-buttons">
          {statuses.map((status) => {
            const value = status === "All" ? "" : status;
            const isActive = selectedStatus === value;
            return (
              <button
                key={status}
                className={isActive ? "active" : ""}
                onClick={() => onStatusChange(value)}
              >
                <span>{status}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* POSSESSION */}
      <div className="filter-section">
        <h4>Possession</h4>
        <div className="amenities-buttons">
          {possessions.map((p) => {
            const value = p === "All" ? "" : p;
            const isActive = selectedPossession === value;
            return (
              <button
                key={p}
                className={isActive ? "active" : ""}
                onClick={() => onPossessionChange(value)}
              >
                <span>{p}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PROPERTY TYPE */}
      <div className="filter-section">
        <h4>Property Type</h4>
        <div className="amenities-buttons">
          {propertyTypes.map((type) => {
            const value = type === "All" ? "" : type;
            const isActive = selectedType === value;
            return (
              <button
                key={type}
                className={isActive ? "active" : ""}
                onClick={() => onTypeChange(value)}
              >
                <span>{type}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* APPROVAL TYPE */}
      <div className="filter-section">
        <h4>Approval</h4>
        <div className="amenities-buttons">
          {approvals.map((approval) => {
            const value = approval === "All" ? "" : approval;
            const isActive = selectedApproval === value;
            return (
              <button
                key={approval}
                className={isActive ? "active" : ""}
                onClick={() => onApprovalChange(value)}
              >
                <span>{approval}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* OWNERSHIP TYPE */}
      <div className="filter-section">
        <h4>Ownership</h4>
        <div className="amenities-buttons">
          {ownerships.map((o) => {
            const value = o === "All" ? "" : o;
            const isActive = selectedOwnership === value;
            return (
              <button
                key={o}
                className={isActive ? "active" : ""}
                onClick={() => onOwnershipChange(value)}
              >
                <span>{o}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FACING */}
      <div className="filter-section">
        <h4>Facing</h4>
        <div className="amenities-buttons">
          {(showAllFacing ? facingsList : facingsList.slice(0, 5)).map(
            (facing) => {
              const value = facing === "All" ? "" : facing;
              const isActive = selectedFacing === value;
              return (
                <button
                  key={facing}
                  className={isActive ? "active" : ""}
                  onClick={() => onFacingChange(value)}
                >
                  <span>{facing}</span>
                </button>
              );
            },
          )}
        </div>
        {facingsList.length > 5 && (
          <button
            className="show-more-btn"
            onClick={() => setShowAllFacing(!showAllFacing)}
            style={{
              marginTop: "8px",
              background: "none",
              border: "none",
              color: "#22d3ee",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "13px",
            }}
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
      <div className="filter-section">
        <h4>Road Width (ft)</h4>
        <div className="amenities-buttons">
          {roadWidths.map((rw) => {
            const value = rw === "All" ? "" : rw;
            const isActive = selectedRoadWidth === value;
            return (
              <button
                key={rw}
                className={isActive ? "active" : ""}
                onClick={() => onRoadWidthChange(value)}
              >
                <span>
                  {rw} {rw !== "All" && "ft"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ROAD TYPE */}
      <div className="filter-section">
        <h4>Road Type</h4>
        <div className="amenities-buttons">
          {roadTypes.map((rt) => {
            const value = rt === "All" ? "" : rt;
            const isActive = selectedRoadType === value;
            return (
              <button
                key={rt}
                className={isActive ? "active" : ""}
                onClick={() => onRoadTypeChange(value)}
              >
                <span>{rt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELLER TYPE */}
      <div className="filter-section">
        <h4>Seller Type</h4>
        <div className="amenities-buttons">
          {sellerTypes.map((st) => {
            const value = st === "All" ? "" : st;
            const isActive = selectedSellerType === value;
            return (
              <button
                key={st}
                className={isActive ? "active" : ""}
                onClick={() => onSellerTypeChange(value)}
              >
                <span>{st}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PRICE RANGE SLIDER */}
      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="slider-container">
          <Slider
            value={priceRange}
            onChange={(_, newValue) => onPriceChange(newValue as number[])}
            valueLabelDisplay="auto"
            min={0}
            max={50000000}
            step={500000}
            sx={{
              color: "#22d3ee",
              height: 6,
              "& .MuiSlider-thumb": {
                width: 18,
                height: 18,
                backgroundColor: "#fff",
                border: "2px solid currentColor",
              },
              "& .MuiSlider-rail": { color: "#94a3b8", opacity: 0.3 },
            }}
          />
          <div className="price-indicators">
            <span>
              <IndianRupee size={12} /> {formatPrice(priceRange[0])}
            </span>
            <span className="separator">-</span>
            <span>
              <IndianRupee size={12} /> {formatPrice(priceRange[1])}
            </span>
          </div>
        </div>
      </div>

      {/* AREA RANGE SLIDER */}
      <div
        className={`filter-section ${showUnitDropdown ? "active" : ""}`}
        style={{ overflow: "visible" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
            position: "relative",
          }}
        >
          <h4 style={{ margin: 0 }}>Area</h4>
          <div className="custom-dropdown-container mini" ref={unitRef}>
            <button
              className="dropdown-trigger"
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
                className={showUnitDropdown ? "open" : ""}
              />
            </button>

            {showUnitDropdown && (
              <div className="dropdown-menu">
                {["sqyd", "sqft", "gunta", "acre", "cent"].map((unit) => (
                  <button
                    key={unit}
                    className={`dropdown-item ${areaUnit === unit ? "active" : ""}`}
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
        <div className="slider-container">
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
              color: "#a855f7",
              height: 6,
              "& .MuiSlider-thumb": {
                width: 18,
                height: 18,
                backgroundColor: "#fff",
                border: "2px solid currentColor",
              },
              "& .MuiSlider-rail": { color: "#94a3b8", opacity: 0.3 },
            }}
          />
          <div className="price-indicators">
            <span style={{ color: "#a855f7" }}>
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
            <span className="separator">-</span>
            <span style={{ color: "#a855f7" }}>
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
