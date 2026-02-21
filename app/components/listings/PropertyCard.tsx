"use client";

import React, { useState, useEffect, useRef } from "react";
import { Property } from "@/app/types";
import {
  MapPin,
  Heart,
  LandPlot,
  ArrowRight,
  Image as ImageIcon,
  Phone,
  MessageSquare,
  Pause,
  Play,
  ChevronDown,
} from "lucide-react";
import { getAmenityIcon } from "@/app/lib/amenities";
import { useRouter } from "next/navigation";
import GalleryModal from "@/app/components/shared/GalleryModal";

interface PropertyCardProps {
  property: Property;
  onView?: (property: Property) => void;
  variant?: "card" | "list";
}

export default function PropertyCard({
  property,
  onView,
  variant = "card",
}: PropertyCardProps) {
  const router = useRouter();
  const [unit, setUnit] = useState("sqyd");
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUnitDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Derived values
  const title = property.title;
  const location =
    property.location && property.city
      ? `${property.location}, ${property.city}`
      : property.location || property.city;
  const priceVal = property.price;
  const sqYards = property.area ? property.area / 9 : 0;

  const image = Array.isArray(property.image)
    ? property.image[0]
    : property.image;

  const imageCount =
    property.imageCount ||
    (Array.isArray(property.image) ? property.image.length : 1);
  const sellerName = property.sellerName;
  const sellerType = property.sellerType;
  const contact = property.contact;

  const handleView = () => {
    if (onView) onView(property);
    const slug = property.slug || property.id;
    const citySlug = property.city.toLowerCase().replace(/\s+/g, "-");
    router.push(`/property/${citySlug}/${slug}`);
  };

  const formatPrice = (p: number) => {
    if (p >= 10000000) return `₹ ${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000) return `₹ ${(p / 100000).toFixed(2)} L`;
    return `₹ ${p.toLocaleString()}`;
  };

  const price = priceVal ? formatPrice(priceVal) : null;

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const scroll = () => {
      if (!isPaused && !isHovered) {
        const maxScroll =
          scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (maxScroll > 0) {
          if (scrollContainer.scrollLeft >= maxScroll) {
            setIsPaused(true);
          } else {
            scrollContainer.scrollLeft += 0.8;
          }
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isHovered]);

  const conversions: Record<string, number> = {
    sqyd: 1,
    sqft: 9,
    gunta: 1 / 121,
    acre: 1 / 4840,
    cent: 1 / 48.4,
  };

  const unitLabels: Record<string, string> = {
    sqyd: "Sq.Yd",
    sqft: "Sq.Ft",
    gunta: "Gunta",
    acre: "Acre",
    cent: "Cent",
  };

  const getConvertedArea = () => {
    if (!sqYards) return null;
    const val = sqYards * conversions[unit];
    return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const getUnitPrice = () => {
    if (!sqYards || !priceVal) return null;
    const areaInSelectedUnit = sqYards * conversions[unit];
    if (areaInSelectedUnit === 0) return null;
    const unitPrice = priceVal / areaInSelectedUnit;

    if (unitPrice > 100000) {
      return `₹ ${(unitPrice / 100000).toFixed(2)} L / ${unitLabels[unit]}`;
    }
    return `₹ ${Math.round(unitPrice).toLocaleString()} / ${unitLabels[unit]}`;
  };

  const getMaskedContact = () => {
    if (!contact) return "";
    return contact.replace(/(\d{3})\d{7}/, "$1XXXXXXX");
  };

  const displayAmenities = property.amenities || [];

  const amenitiesList = displayAmenities.map((name) => ({
    icon: getAmenityIcon(name),
    label: name,
  }));

  const convertedAreaDisplay = getConvertedArea();
  const unitPriceDisplay = getUnitPrice();

  return (
    <div
      className={`relative flex flex-col w-full min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] hover:border-[var(--primary)] group overflow-visible h-[460px] cursor-pointer ${
        showUnitDropdown ? "z-[9999]" : "z-0"
      }`}
    >
      {/* Background Image / Overlay Variant */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl pointer-events-none">
        {image && (
          <img
            src={image}
            alt={title || "Property"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/60 to-transparent"></div>
      </div>

      {/* Top Badges */}
      <div className="absolute top-[10px] left-[10px] flex items-center gap-2 z-[31]">
        {(property.label || property.status) && (
          <div className="bg-[var(--primary)] backdrop-blur-sm px-2.5 py-1 rounded-md text-[0.65rem] font-extrabold uppercase shadow-lg border border-white/20 whitespace-nowrap text-white">
            {property.label ||
              (property.status === "available"
                ? "Plot For Sale"
                : property.status)}
          </div>
        )}

        {imageCount !== undefined && imageCount > 0 && (
          <button
            className="bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md text-[0.65rem] font-semibold text-white flex items-center gap-1.5 border border-white/15 whitespace-nowrap cursor-pointer transition-all hover:bg-[var(--primary)]/20 hover:border-[var(--primary)] hover:text-[var(--primary)] pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              setShowGallery(true);
            }}
          >
            <ImageIcon size={12} className="text-[var(--primary)]" />
            <span>{imageCount} Photos</span>
          </button>
        )}
      </div>

      <button className="absolute top-[10px] right-[10px] w-7 h-7 rounded-full bg-[var(--background)]/60 backdrop-blur-sm flex items-center justify-center border border-white/20 cursor-pointer transition-all hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] group/fav z-[31]">
        <Heart size={16} className="text-white group-hover/fav:fill-white" />
      </button>

      {/* Main Content Area - Pushed to Bottom */}
      <div className="relative mt-auto p-3 flex flex-col gap-1.5 z-10 w-full bg-gradient-to-t from-black/70 to-transparent pt-0 rounded-b-2xl">
        {(title || location) && (
          <div className="mb-0.5">
            {title && (
              <h3 className="m-0 text-lg font-bold leading-tight bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                {title}
              </h3>
            )}
            {location && (
              <div className="flex items-center gap-1 text-[0.85rem] text-[var(--foreground)] mt-1 font-medium">
                <MapPin size={14} className="text-[var(--primary)] shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        )}

        {/* Amenities Marquee */}
        {amenitiesList.length > 0 && (
          <div
            className="mt-1 relative w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="text-[0.6rem] uppercase text-[var(--muted)] mb-0.5 font-bold tracking-wider pl-0.5">
              PLOT AMENITIES{" "}
              <span className="text-[var(--primary)] ml-1">
                ({amenitiesList.length})
              </span>
            </div>

            <button
              className="absolute right-0 top-[62%] -translate-y-1/2 bg-[var(--primary)]/90 border border-[var(--primary)]/50 shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)] rounded-l-full w-6.5 h-8 flex items-center justify-center cursor-pointer z-[18] text-white transition-all hover:bg-[var(--primary)] hover:w-7.5"
              onClick={(e) => {
                e.stopPropagation();
                if (isPaused && scrollRef.current) {
                  const maxScroll =
                    scrollRef.current.scrollWidth -
                    scrollRef.current.clientWidth;
                  if (scrollRef.current.scrollLeft >= maxScroll - 5) {
                    scrollRef.current.scrollLeft = 0;
                  }
                }
                setIsPaused(!isPaused);
              }}
            >
              {isPaused ? (
                <Play size={10} className="fill-white stroke-white ml-1" />
              ) : (
                <Pause size={10} className="fill-white stroke-white ml-1" />
              )}
            </button>

            <div
              className="w-full bg-[var(--background)]/30 backdrop-blur-sm rounded-lg py-2 px-1 border border-[var(--primary)]/20 overflow-x-auto whitespace-nowrap scrollbar-hide flex items-center"
              ref={scrollRef}
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              }}
            >
              <div className="flex gap-4 px-8 w-max">
                {amenitiesList.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center gap-0.5 text-[var(--foreground)] min-w-[50px] shrink-0"
                  >
                    <div className="text-[var(--primary)] drop-shadow-[0_0_4px_rgba(var(--primary-rgb),0.5)]">
                      {amenity.icon}
                    </div>
                    <span className="text-[0.6rem] font-bold uppercase opacity-90 drop-shadow-md">
                      {amenity.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Area Calculator */}
        {convertedAreaDisplay && (
          <div className="bg-[var(--background)]/80 backdrop-blur-sm p-2 rounded-lg border border-[var(--primary)]/20 flex justify-between items-center mt-0.5 shadow-inner z-20">
            <div className="flex items-center gap-1">
              <LandPlot size={16} className="text-[var(--primary)]" />
              <span className="text-sm font-bold text-[var(--primary)] drop-shadow-[0_0_2px_rgba(var(--primary-rgb),0.5)]">
                Area: {convertedAreaDisplay} {unitLabels[unit]}
              </span>
            </div>

            <div className="relative ml-2 z-50 shrink-0" ref={dropdownRef}>
              <button
                className="px-2 py-1 text-xs bg-[var(--card)] border border-[var(--primary)]/40 text-[var(--primary)] rounded-lg flex items-center justify-between gap-1.5 transition-all hover:border-[var(--primary)] hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)] hover:text-[var(--foreground)] cursor-pointer w-[80px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUnitDropdown(!showUnitDropdown);
                }}
              >
                {unitLabels[unit]}
                <ChevronDown size={14} className="text-[var(--primary)]" />
              </button>

              {showUnitDropdown && (
                <div className="absolute bottom-[110%] right-0 mb-1 min-w-[100px] bg-[var(--card)] border border-[var(--primary)]/30 rounded-lg p-1 flex flex-col gap-0.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-[9999]">
                  {Object.entries(unitLabels).map(([key, label]) => (
                    <button
                      key={key}
                      className={`p-2 text-xs text-[var(--muted)] bg-transparent border-none cursor-pointer rounded-md transition-all hover:bg-[var(--primary)]/20 hover:text-[var(--primary)] flex justify-center w-full ${
                        unit === key
                          ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setUnit(key);
                        setShowUnitDropdown(false);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Seller Info Row */}
        {(sellerName || contact) && (
          <div className="flex justify-between items-center bg-[var(--background)]/70 backdrop-blur-sm p-2 rounded-xl mt-0.5 border border-[var(--border)] gap-2.5">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {sellerName && (
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-white font-bold text-[0.8rem] shrink-0 shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)] border border-white/20">
                  {sellerName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col justify-center overflow-hidden">
                {sellerName && (
                  <span className="text-[0.75rem] font-bold text-[var(--foreground)] truncate drop-shadow-md">
                    {sellerName}
                  </span>
                )}
                <div className="flex items-center gap-1 truncate text-[var(--foreground)]">
                  {sellerType && (
                    <span className="text-[0.55rem] text-[var(--secondary)] font-bold uppercase drop-shadow-md">
                      {sellerType}
                    </span>
                  )}
                  {sellerType && contact && (
                    <span className="text-[var(--muted)] text-[0.55rem]">
                      |
                    </span>
                  )}
                  {contact && (
                    <span className="text-[0.6rem] font-mono tracking-tighter drop-shadow-md opacity-80">
                      {getMaskedContact()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-1.5 shrink-0">
              <button className="px-2 py-1 rounded-lg text-[0.6rem] font-extrabold cursor-pointer border-none flex items-center justify-center gap-1 transition-all uppercase whitespace-nowrap bg-gradient-to-br from-[var(--secondary)]/80 to-[var(--secondary)]/100 text-white border border-[var(--secondary)]/60 shadow-[0_0_15px_rgba(var(--secondary-rgb),0.4),0_4px_8px_rgba(0,0,0,0.3)] hover:from-[var(--secondary)] hover:to-[var(--secondary)] hover:border-[var(--primary)] hover:scale-105 active:scale-95">
                <MessageSquare size={10} className="animate-pulse" /> Enquiry
              </button>
              <button className="px-2 py-1 rounded-lg text-[0.6rem] font-extrabold cursor-pointer border-none flex items-center justify-center gap-1 transition-all uppercase whitespace-nowrap bg-gradient-to-br from-[var(--primary)]/80 to-[var(--primary)]/100 text-white border border-[var(--primary)]/60 shadow-[0_0_15px_rgba(var(--primary-rgb),0.4),0_4px_8px_rgba(0,0,0,0.3)] hover:from-[var(--primary)] hover:to-[var(--primary)] hover:border-[var(--secondary)] hover:scale-105 active:scale-95">
                <Phone size={10} className="animate-pulse" /> Contact
              </button>
            </div>
          </div>
        )}

        {/* Card Footer Block */}
        <div className="flex justify-between items-center mt-1">
          {price && (
            <div className="flex flex-col">
              <div className="text-[1.35rem] font-extrabold text-[var(--foreground)] leading-none drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]">
                {price}
              </div>
              {unitPriceDisplay && (
                <div className="text-[0.7rem] text-[var(--muted)] mt-1 font-medium drop-shadow-md">
                  {unitPriceDisplay}
                </div>
              )}
            </div>
          )}

          <button
            className="bg-gradient-to-r from-[var(--primary)]/30 to-[var(--secondary)]/30 backdrop-blur-sm border border-[var(--secondary)] text-[var(--foreground)] px-4 py-2 rounded-full text-[0.75rem] font-bold uppercase tracking-wider cursor-pointer transition-all hover:bg-[var(--secondary)]/50 hover:shadow-[0_0_15px_var(--secondary)] flex items-center gap-1.5 shadow-md group/details"
            onClick={handleView}
          >
            Details{" "}
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover/details:translate-x-1"
            />
          </button>
        </div>
      </div>

      <GalleryModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        images={
          property.image
            ? Array.isArray(property.image)
              ? property.image
              : [property.image]
            : []
        }
        title={title}
      />
    </div>
  );
}
