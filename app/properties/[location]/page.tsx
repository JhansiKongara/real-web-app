"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";

import properties from "@/app/lib/properties";
import Filters from "@/app/components/listings/Filters";
import PropertyCard from "@/app/components/listings/PropertyCard";
import { Property } from "@/app/types";

import { Filter, X, RotateCcw, ArrowUpDown, CheckCircle } from "lucide-react";

export default function Listings() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locationParam = (params.location as string) || "all";

  const [sortType, setSortType] = useState("recent");
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

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showFilters]);

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
    const locationQuery =
      decodedLocation === "all" || decodedLocation === "all-plots"
        ? ""
        : decodedLocation;
    const projectQuery = (searchParams.get("q") || "").replace(/-/g, " ");
    const minPrice = priceRange[0];
    const maxPrice = priceRange[1];

    const conversions: Record<string, number> = {
      sqyd: 1,
      sqft: 9,
      gunta: 1 / 121,
      acre: 1 / 4840,
    };
    const minAreaInSqYd = areaRange[0] / (conversions[areaUnit] || 1);
    const maxAreaInSqYd = areaRange[1] / (conversions[areaUnit] || 1);

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
      const itemAreaSqYd = (item.area || 0) / 9;
      const areaMatch =
        itemAreaSqYd >= minAreaInSqYd && itemAreaSqYd <= maxAreaInSqYd;
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
    <div className="flex flex-col lg:flex-row p-0 gap-0 mt-0 bg-[var(--background)] min-h-0 relative lg:h-[calc(100vh-173.5px)] lg:overflow-hidden">
      {/* MOBILE OVERLAY */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]"
          onClick={() => setShowFilters(false)}
        ></div>
      )}

      {/* LEFT SIDE FILTERS */}
      <div
        className={`fixed lg:relative top-[55px] lg:top-0 right-[-100%] lg:right-0 w-full lg:w-[320px] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] z-[2000] lg:z-[100] h-[calc(100%-55px)] lg:h-full bg-[var(--card)] lg:bg-transparent flex flex-col ${showFilters ? "right-0" : ""}`}
      >
        <div className="flex lg:hidden justify-between items-center p-6 border-b border-[var(--primary)]/10">
          <h3 className="text-[var(--foreground)] m-0 uppercase font-bold">
            Filters
          </h3>
          <button
            className="bg-[var(--primary)]/10 border-none text-[var(--foreground)] cursor-pointer w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-[var(--accent)]/20 hover:text-[var(--accent)]"
            onClick={() => setShowFilters(false)}
          >
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

        <div className="flex lg:hidden gap-3 p-5 bg-[var(--card)] border-t border-[var(--primary)]/10">
          <button
            className="flex-[0.4] p-3.5 bg-[var(--primary)]/5 text-[var(--muted)] rounded-xl border border-[var(--primary)]/10 font-bold"
            onClick={clearAllFilters}
          >
            Reset All
          </button>
          <button
            className="flex-1 p-3.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl border-none font-extrabold"
            onClick={() => setShowFilters(false)}
          >
            Show {filteredData.length} Results
          </button>
        </div>
      </div>

      {/* RIGHT SIDE CONTENT */}
      <div className="flex-1 flex flex-col gap-4 p-8 lg:p-2.5 lg:px-5 min-w-0 lg:h-full lg:overflow-y-auto scrollbar-gutter-stable scrollbar-hide">
        <div className="bg-[var(--card)] lg:p-4 lg:px-6 rounded-2xl lg:border border-[var(--border)] lg:shadow-sm p-0 border-none shadow-none">
          {/* DESKTOP VIEW */}
          <div className="hidden lg:flex justify-between items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-[1.4rem] font-extrabold text-[var(--foreground)]">
                {locationParam === "all" || locationParam === "all-plots"
                  ? "All Available Plots"
                  : `Plots in ${locationParam.charAt(0).toUpperCase() + locationParam.slice(1)}`}
              </h2>
              <span className="text-[var(--muted)] text-[0.85rem]">
                {filteredData.length} Properties Found
              </span>
            </div>
          </div>

          {/* MOBILE VIEW ACTIONS */}
          <div className="lg:hidden flex items-center w-full h-[52px] bg-[var(--card)] fixed top-[55px] left-0 z-[1000] px-2.5 border-b-2 border-[var(--primary)]/30 shadow-lg before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-gradient-to-r before:from-[var(--primary)]/50 before:to-[var(--secondary)]/50 before:shadow-[0_0_8px_rgba(var(--primary-rgb),0.2)]">
            <button
              className="flex-1 h-full bg-transparent border-none text-[var(--muted)] text-[0.7rem] flex flex-col items-center justify-center gap-0.5 font-bold uppercase relative active:bg-[var(--primary)]/10"
              onClick={clearAllFilters}
            >
              <RotateCcw size={14} className="text-[var(--primary)]" /> Clear
            </button>

            <div className="w-[1px] h-4 bg-[var(--border)]"></div>

            <div className="relative flex-1 flex justify-center" ref={sortRef}>
              <button
                className={`flex-1 h-full bg-transparent border-none text-[var(--muted)] text-[0.7rem] flex flex-col items-center justify-center gap-0.5 font-bold uppercase relative active:bg-[var(--primary)]/10 ${showSortMobile ? "text-[var(--foreground)] bg-[var(--primary)]/10" : ""}`}
                onClick={() => setShowSortMobile(!showSortMobile)}
              >
                <ArrowUpDown size={14} className="text-[var(--primary)]" /> Sort
              </button>

              {showSortMobile && (
                <div className="absolute top-[102%] left-0 w-[180px] bg-[var(--card)] border border-[var(--primary)]/50 rounded-xl p-1.5 shadow-2xl z-[2000] flex flex-col gap-1.5 animate-[fadeIn_0.3s_ease]">
                  {[
                    { id: "recent", label: "Recently Added" },
                    { id: "low", label: "Price: Low to High" },
                    { id: "high", label: "Price: High to Low" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      className={`w-full flex justify-between items-center p-3 text-[var(--foreground)] bg-transparent border-none text-left rounded-lg font-bold text-xs uppercase ${sortType === item.id ? "bg-[var(--primary)]/10 text-[var(--primary)]" : ""}`}
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

            <div className="w-[1px] h-4 bg-[var(--border)]"></div>

            <button
              className="flex-1 h-full bg-transparent border-none text-[var(--foreground)] text-[0.7rem] flex flex-col items-center justify-center gap-0.5 font-bold uppercase relative active:bg-[var(--primary)]/10"
              onClick={() => setShowFilters(true)}
            >
              <Filter size={14} className="text-[var(--secondary)]" /> Filters
              {appliedFiltersCount > 0 && (
                <span className="absolute top-1.5 right-[22%] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white text-[0.6rem] min-w-[17px] h-[17px] rounded-full flex items-center justify-center font-black">
                  {appliedFiltersCount}
                </span>
              )}
            </button>

            {appliedFiltersCount > 0 && (
              <>
                <div className="w-[1px] h-4 bg-[var(--border)]"></div>
                <div className="flex-1 h-full bg-transparent border-none text-[var(--muted)] text-[0.7rem] flex flex-col items-center justify-center gap-0.5 font-bold uppercase relative cursor-default">
                  <span className="text-[1.1rem] font-black text-[var(--primary)] leading-none">
                    {filteredData.length}
                  </span>
                  <span className="text-[0.6rem] text-[var(--muted)]">
                    Results
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 md:pt-[105px] pt-[105px] lg:pt-0">
          {filteredData.length === 0 ? (
            <div className="col-span-full text-center py-16 px-5 bg-[var(--card)] rounded-[20px] text-[var(--muted)] border border-[var(--border)]">
              <h3 className="text-lg font-bold">
                No properties match your filters
              </h3>
              <p>Try adjusting your price range or clearing some filters.</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))
          )}
        </div>

        {/* Dynamic SEO Content Section */}
        <section className="mt-2.5 pb-0 flex justify-center lg:mt-0 lg:pb-4">
          <div className="relative bg-[var(--card)] rounded-xl lg:rounded-[20px] p-4 lg:p-6 lg:px-10 max-w-[1280px] w-[95%] lg:w-full overflow-hidden shadow-2xl border border-[var(--primary)]/10 before:absolute before:inset-[-50%] before:bg-[radial-gradient(circle_at_30%_30%,rgba(var(--primary-rgb),0.15)_0%,transparent_40%),radial-gradient(circle_at_70%_70%,rgba(var(--secondary-rgb),0.15)_0%,transparent_40%)] before:opacity-80 before:z-0">
            <div className="relative z-[1] text-center mb-2 lg:mb-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-lg lg:rounded-xl flex items-center justify-center text-base lg:text-xl m-0 mx-auto mb-1.5 lg:mb-2 shadow-lg">
                ✨
              </div>
              <h2 className="text-[1.1rem] lg:text-2xl font-black text-[var(--foreground)] m-0 tracking-tight">
                <span className="block text-[0.65rem] lg:text-sm uppercase tracking-[2px] text-[var(--primary)] mb-0.5 lg:mb-1">
                  Market Insights
                </span>
                Real Estate Investment:{" "}
                {locationParam === "all" || locationParam === "all-plots"
                  ? "Hyderabad"
                  : locationParam.charAt(0).toUpperCase() +
                    locationParam.slice(1)}
              </h2>
            </div>
            <div className="relative z-[1]">
              <p className="text-[var(--muted)] text-[0.85rem] lg:text-[0.95rem] leading-tight lg:leading-normal text-center mb-2 lg:mb-4 max-w-3xl mx-auto">
                Exploring{" "}
                {locationParam === "all" || locationParam === "all-plots"
                  ? "real estate"
                  : locationParam.charAt(0).toUpperCase() +
                    locationParam.slice(1)}{" "}
                presents an exceptional opportunity for long-term capital
                appreciation.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4 mb-3 lg:mb-4">
                {[
                  {
                    title: "Regulatory Clarity",
                    text: "Our listings prioritize HMDA and DTCP approved layouts, ensuring hassle-free registration.",
                  },
                  {
                    title: "Strategic Connectivity",
                    text: "Proximity to the Outer Ring Road (ORR) and proposed IT corridors makes this a high-yield zone.",
                  },
                  {
                    title: "Future Potential",
                    text: "With massive infrastructure growth planned, properties are poised for significant appreciation.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-[var(--primary)]/5 p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-[var(--primary)]/10 transition-all hover:bg-[var(--primary)]/10 hover:-translate-y-1 hover:border-[var(--primary)]/30"
                  >
                    <strong className="block text-[var(--foreground)] text-[0.85rem] lg:text-base mb-1 lg:mb-2 flex items-center gap-1.5 lg:gap-2 after:content-['→'] after:text-[var(--primary)] after:text-[0.7rem] lg:after:text-[0.9rem]">
                      {item.title}
                    </strong>
                    <p className="text-[var(--muted)] text-[0.8rem] lg:text-[0.85rem] m-0 leading-normal">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[var(--foreground)] opacity-90 text-[0.75rem] lg:text-[0.85rem] text-center p-3 rounded-lg bg-gradient-to-r from-[var(--primary)]/5 to-[var(--secondary)]/5 border border-dashed border-[var(--primary)]/10 m-0">
                Whether you seek a gated community plot for your dream home or a
                strategic land parcel for investment, we offer verified options
                with clear titles.
              </p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
