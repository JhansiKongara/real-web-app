"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";

import properties from "@/app/lib/properties";
import Filters from "@/app/components/listings/Filters";
import PropertyCard from "@/app/components/listings/PropertyCard";
import { Property } from "@/app/types";

import "@/app/styles/listings.scss";

import {
  Filter,
  X,
  RotateCcw,
  ChevronDown,
  ArrowUpDown,
  CheckCircle,
} from "lucide-react";

export default function Listings() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locationParam = (params.location as string) || "all";

  const [sortType, setSortType] = useState("recent");
  // Multi-select state for Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [selectedType, setSelectedType] = useState("");
  const [selectedApproval, setSelectedApproval] = useState("");
  const [selectedFacing, setSelectedFacing] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRoadWidth, setSelectedRoadWidth] = useState("");
  const [selectedPossession, setSelectedPossession] = useState("");
  const [selectedOwnership, setSelectedOwnership] = useState("");
  const [selectedRoadType, setSelectedRoadType] = useState("");
  const [selectedSellerType, setSelectedSellerType] = useState("");
  const [isGatedOnly, setIsGatedOnly] = useState(false);
  const [isCornerPlot, setIsCornerPlot] = useState(false);
  const [noRoadHit, setNoRoadHit] = useState(false);
  const [onlyRegularShape, setOnlyRegularShape] = useState(false);
  const [noTJunction, setNoTJunction] = useState(false);
  const [noCornerPlot, setNoCornerPlot] = useState(false);
  const [onlyVastu, setOnlyVastu] = useState(false);
  const [areaUnit, setAreaUnit] = useState("sqyd");
  const [priceRange, setPriceRange] = useState<number[]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 50000000,
  ]);
  const [areaRange, setAreaRange] = useState<number[]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMobile, setShowSortMobile] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Body Scroll Lock for Mobile Filters
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showFilters]);

  // Handle outside click for mobile sort
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortMobile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearAllFilters = () => {
    setSortType("recent");
    setSelectedAmenities([]);
    setSelectedType("");
    setSelectedApproval("");
    setSelectedFacing("");
    setSelectedStatus("");
    setSelectedRoadWidth("");
    setSelectedPossession("");
    setSelectedOwnership("");
    setSelectedRoadType("");
    setSelectedSellerType("");
    setIsGatedOnly(false);
    setIsCornerPlot(false);
    setNoRoadHit(false);
    setOnlyRegularShape(false);
    setNoTJunction(false);
    setNoCornerPlot(false);
    setOnlyVastu(false);
    setPriceRange([0, 50000000]);
    setAreaRange([0, 10000]);
    setAreaUnit("sqyd");
  };

  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedAmenities.length > 0) count++;
    if (selectedType) count++;
    if (selectedApproval) count++;
    if (selectedFacing) count++;
    if (selectedStatus) count++;
    if (selectedRoadWidth) count++;
    if (selectedPossession) count++;
    if (selectedOwnership) count++;
    if (selectedRoadType) count++;
    if (selectedSellerType) count++;
    if (isGatedOnly) count++;
    if (isCornerPlot) count++;
    if (noRoadHit) count++;
    if (onlyRegularShape) count++;
    if (noTJunction) count++;
    if (noCornerPlot) count++;
    if (onlyVastu) count++;
    if (priceRange[0] > 0 || priceRange[1] < 50000000) count++;
    if (areaRange[0] > 0 || areaRange[1] < 10000) count++;
    return count;
  }, [
    selectedAmenities,
    selectedType,
    selectedApproval,
    selectedFacing,
    selectedStatus,
    selectedRoadWidth,
    selectedPossession,
    selectedOwnership,
    selectedRoadType,
    selectedSellerType,
    isGatedOnly,
    isCornerPlot,
    noRoadHit,
    onlyRegularShape,
    noTJunction,
    noCornerPlot,
    onlyVastu,
    priceRange,
    areaRange,
  ]);

  const filteredData = useMemo(() => {
    const decodedLocation = decodeURIComponent(locationParam).toLowerCase();
    // Treat "all-plots" same as "all" for filtering
    const locationQuery =
      decodedLocation === "all" || decodedLocation === "all-plots"
        ? ""
        : decodedLocation;
    const projectQuery = (searchParams.get("q") || "").replace(/-/g, " ");
    const minPrice = priceRange[0];
    const maxPrice = priceRange[1];

    // Unit Conversion for Filtering
    const conversions: Record<string, number> = {
      sqyd: 1,
      sqft: 9,
      gunta: 1 / 121,
      acre: 1 / 4840,
    };

    const minAreaInSqYd = areaRange[0] / conversions[areaUnit];
    const maxAreaInSqYd = areaRange[1] / conversions[areaUnit];

    let result = properties.filter((item) => {
      const locationMatch =
        locationQuery === "" ||
        item.location.toLowerCase().includes(locationQuery) ||
        item.city?.toLowerCase().includes(locationQuery);

      const projectMatch =
        projectQuery === "" ||
        item.title.toLowerCase().includes(projectQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(projectQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(projectQuery.toLowerCase());

      const priceMatch = item.price >= minPrice && item.price <= maxPrice;

      // Area is stored as SqFt in DB (script.ts), convert to SqYd for internal logic
      const itemAreaSqYd = (item.area || 0) / 9;
      const areaMatch =
        itemAreaSqYd >= minAreaInSqYd && itemAreaSqYd <= maxAreaInSqYd;

      // Filter Logic: Property must have ALL selected amenities (AND logic)
      const amenityMatch =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) =>
          (item.amenities || []).includes(amenity),
        );

      const typeMatch =
        selectedType === "" ||
        item.type.toLowerCase().includes(selectedType.toLowerCase());

      const approvalMatch =
        selectedApproval === "" ||
        item.type.toLowerCase().includes(selectedApproval.toLowerCase());

      const facingMatch =
        selectedFacing === "" ||
        (item as any).facing?.toLowerCase() === selectedFacing.toLowerCase();

      const statusMatch =
        selectedStatus === "" ||
        item.status.toLowerCase() === selectedStatus.toLowerCase();

      const roadMatch =
        selectedRoadWidth === "" ||
        (item as any).roadWidth?.toString() === selectedRoadWidth;

      const possessionMatch =
        selectedPossession === "" ||
        (item as any).possession?.toLowerCase() ===
          selectedPossession.toLowerCase();

      const ownershipMatch =
        selectedOwnership === "" ||
        (item as any).ownership?.toLowerCase() ===
          selectedOwnership.toLowerCase();

      const roadTypeMatch =
        selectedRoadType === "" ||
        (item as any).roadType?.toLowerCase() ===
          selectedRoadType.toLowerCase();

      const gatedMatch = !isGatedOnly || (item as any).isGated === true;
      const cornerMatch = !isCornerPlot || (item as any).isCornerPlot === true;

      const noRoadHitMatch = !noRoadHit || (item as any).hasRoadHit === false;
      const regularShapeMatch =
        !onlyRegularShape || (item as any).isRegularShape === true;
      const tJunctionMatch =
        !noTJunction || (item as any).hasTJunction === false;
      const noCornerMatch =
        !noCornerPlot || (item as any).isCornerPlot === false;
      const vastuMatch = !onlyVastu || (item as any).isVastuCompliance === true;

      const sellerMatch =
        selectedSellerType === "" ||
        (item as any).sellerType?.toLowerCase() ===
          selectedSellerType.toLowerCase();

      return (
        locationMatch &&
        projectMatch &&
        priceMatch &&
        areaMatch &&
        amenityMatch &&
        typeMatch &&
        approvalMatch &&
        facingMatch &&
        statusMatch &&
        roadMatch &&
        possessionMatch &&
        gatedMatch &&
        ownershipMatch &&
        roadTypeMatch &&
        cornerMatch &&
        sellerMatch &&
        noRoadHitMatch &&
        regularShapeMatch &&
        tJunctionMatch &&
        noCornerMatch &&
        vastuMatch
      );
    });

    result.sort((a, b) => {
      if (a.status === "available" && b.status !== "available") return -1;
      if (a.status !== "available" && b.status === "available") return 1;
      if (sortType === "low") return a.price - b.price;
      if (sortType === "high") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [
    searchParams,
    sortType,
    selectedAmenities,
    selectedType,
    selectedApproval,
    selectedFacing,
    selectedStatus,
    selectedRoadWidth,
    selectedPossession,
    selectedOwnership,
    selectedRoadType,
    selectedSellerType,
    isGatedOnly,
    isCornerPlot,
    noRoadHit,
    onlyRegularShape,
    noTJunction,
    noCornerPlot,
    onlyVastu,
    priceRange,
    areaRange,
    areaUnit,
    locationParam,
  ]);

  return (
    <div className="listing-page">
      {/* MOBILE OVERLAY */}
      {showFilters && (
        <div
          className="mobile-filter-overlay"
          onClick={() => setShowFilters(false)}
        ></div>
      )}

      {/* LEFT SIDE FILTERS */}
      <div className={`filters-wrapper ${showFilters ? "active" : ""}`}>
        <div className="mobile-filter-header">
          <h3>Filters</h3>
          <button onClick={() => setShowFilters(false)}>
            <X size={24} />
          </button>
        </div>
        <Filters
          sortType={sortType}
          selectedAmenities={selectedAmenities}
          selectedType={selectedType}
          selectedApproval={selectedApproval}
          selectedFacing={selectedFacing}
          selectedStatus={selectedStatus}
          selectedRoadWidth={selectedRoadWidth}
          selectedPossession={selectedPossession}
          selectedOwnership={selectedOwnership}
          selectedRoadType={selectedRoadType}
          selectedSellerType={selectedSellerType}
          isGatedOnly={isGatedOnly}
          isCornerPlot={isCornerPlot}
          noRoadHit={noRoadHit}
          onlyRegularShape={onlyRegularShape}
          noTJunction={noTJunction}
          noCornerPlot={noCornerPlot}
          onlyVastu={onlyVastu}
          areaUnit={areaUnit}
          priceRange={priceRange}
          areaRange={areaRange}
          onSortChange={setSortType}
          onAmenitiesChange={setSelectedAmenities}
          onTypeChange={setSelectedType}
          onApprovalChange={setSelectedApproval}
          onFacingChange={setSelectedFacing}
          onStatusChange={setSelectedStatus}
          onRoadWidthChange={setSelectedRoadWidth}
          onPossessionChange={setSelectedPossession}
          onOwnershipChange={setSelectedOwnership}
          onRoadTypeChange={setSelectedRoadType}
          onSellerTypeChange={setSelectedSellerType}
          onGatedToggle={setIsGatedOnly}
          onCornerPlotToggle={setIsCornerPlot}
          onNoRoadHitToggle={setNoRoadHit}
          onOnlyRegularShapeToggle={setOnlyRegularShape}
          onNoTJunctionToggle={setNoTJunction}
          onNoCornerPlotToggle={setNoCornerPlot}
          onOnlyVastuToggle={setOnlyVastu}
          onAreaUnitChange={setAreaUnit}
          onPriceChange={setPriceRange}
          onAreaChange={setAreaRange}
        />
        <div className="mobile-filter-footer">
          <button className="reset-btn-mobile" onClick={clearAllFilters}>
            Reset All
          </button>
          <button className="apply-btn" onClick={() => setShowFilters(false)}>
            Show {filteredData.length} Results
          </button>
        </div>
      </div>

      {/* RIGHT SIDE CONTENT */}
      <div className="content-area">
        <div className="results-header">
          {/* DESKTOP VIEW */}
          <div className="title-row desktop-only">
            <div className="title-info">
              <h2>
                {locationParam === "all" || locationParam === "all-plots"
                  ? "All Available Plots"
                  : `Plots in ${locationParam.charAt(0).toUpperCase() + locationParam.slice(1)}`}
              </h2>
              <span className="results-count">
                {filteredData.length} Properties Found
              </span>
            </div>
          </div>

          {/* MOBILE VIEW ACTIONS */}
          <div className="mobile-action-bar">
            <button className="action-btn" onClick={clearAllFilters}>
              <RotateCcw size={14} /> Clear
            </button>

            <div className="action-divider"></div>

            <div
              style={{
                position: "relative",
                flex: 1,
                display: "flex",
                justifyContent: "center",
              }}
              ref={sortRef}
            >
              <button
                className={`action-btn ${showSortMobile ? "active" : ""}`}
                onClick={() => setShowSortMobile(!showSortMobile)}
              >
                <ArrowUpDown size={14} />
                <span>Sort</span>
              </button>

              {showSortMobile && (
                <div className="mobile-sort-dropdown">
                  {[
                    { id: "recent", label: "Recently Added" },
                    { id: "low", label: "Price: Low to High" },
                    { id: "high", label: "Price: High to Low" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      className={`sort-option ${sortType === item.id ? "active" : ""}`}
                      onClick={() => {
                        setSortType(item.id);
                        setShowSortMobile(false);
                      }}
                    >
                      <span>{item.label}</span>
                      {sortType === item.id && <CheckCircle size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="action-divider"></div>

            <button
              className="action-btn filter-main"
              onClick={() => setShowFilters(true)}
            >
              <Filter size={14} />
              Filters
              {appliedFiltersCount > 0 && (
                <span className="filter-chip">{appliedFiltersCount}</span>
              )}
            </button>

            {appliedFiltersCount > 0 && (
              <>
                <div className="action-divider"></div>
                <div className="action-btn results-count-block">
                  <span className="count-num">{filteredData.length}</span>
                  <span className="count-label">Results</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="cards">
          {filteredData.length === 0 ? (
            <div className="no-results">
              <h3>No properties match your filters</h3>
              <p>Try adjusting your price range or clearing some filters.</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))
          )}
        </div>

        {/* Dynamic SEO Content Section */}
        <section className="listing-seo-content">
          <div className="seo-card">
            <div className="seo-header">
              <div className="icon-badge">✨</div>
              <h2>
                <span>Market Insights</span>
                Real Estate Investment:{" "}
                {locationParam === "all" || locationParam === "all-plots"
                  ? "Hyderabad"
                  : locationParam.charAt(0).toUpperCase() +
                    locationParam.slice(1)}
              </h2>
            </div>
            <div className="seo-body">
              <p className="intro">
                Exploring{" "}
                {locationParam === "all" || locationParam === "all-plots"
                  ? "real estate"
                  : locationParam.charAt(0).toUpperCase() +
                    locationParam.slice(1)}{" "}
                presents an exceptional opportunity for long-term capital
                appreciation. As Hyderabad continues its rapid expansion, this
                region has become a focal point for premium developments.
              </p>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Regulatory Clarity</strong>
                  <p>
                    Our listings prioritize HMDA and DTCP approved layouts,
                    ensuring hassle-free registration and bank loan facility.
                  </p>
                </div>
                <div className="info-item">
                  <strong>Strategic Connectivity</strong>
                  <p>
                    Proximity to the Outer Ring Road (ORR) and proposed IT
                    corridors makes this a high-yield investment zone.
                  </p>
                </div>
                <div className="info-item">
                  <strong>Future Potential</strong>
                  <p>
                    With massive infrastructure growth planned, properties in
                    this region are poised for significant value appreciation.
                  </p>
                </div>
              </div>
              <p className="seo-footer-note">
                Whether you seek a gated community plot for your dream home or a
                strategic land parcel for investment, we offer verified options
                with clear titles.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
