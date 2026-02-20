"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/app/styles/PropertyCard.scss";
import { Property } from "@/app/types";
import {
  MapPin,
  Heart,
  LandPlot,
  ArrowRight,
  Droplets,
  Zap,
  Shield,
  TreePine,
  Image as ImageIcon,
  Phone,
  MessageSquare,
  School,
  ShoppingBag,
  Bus,
  Dumbbell,
  Utensils,
  Stethoscope,
  Landmark,
  Plane,
  Train,
  Coffee,
  Pause,
  Play,
  Wifi,
  Car,
  CheckCircle,
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
  const sqYards = property.area ? property.area / 9 : 0; // Assuming input area is Sq.Ft

  // Dynamic Image Selection (First image if array)
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

  // Format price for display
  const formatPrice = (p: number) => {
    if (p >= 10000000) return `₹ ${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000) return `₹ ${(p / 100000).toFixed(2)} L`;
    return `₹ ${p.toLocaleString()}`;
  };

  const price = priceVal ? formatPrice(priceVal) : null;

  // Auto-Scroll Logic - Stop after one complete loop
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
            // Stop at the end instead of looping
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

  // Unit Conversion Factors (Base: Sq.Yds)
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
      className={`plot-card holo-theme holo-overlay ${
        showUnitDropdown ? "dropdown-active" : ""
      }`}
    >
      <div
        className="card-image"
        onClick={() => setShowGallery(true)}
        style={{ cursor: "pointer" }}
      >
        {image && <img src={image} alt={title || "Property"} />}

        <div className="card-top-badges">
          {/* Dynamic Label from JSON */}
          {(property.label || property.status) && (
            <div className="status-tag">
              {property.label ||
                (property.status === "available"
                  ? "Plot For Sale"
                  : property.status)}
            </div>
          )}

          {imageCount !== undefined && imageCount > 0 && (
            <div className="image-count">
              <ImageIcon size={12} />
              <span>{imageCount} Photos</span>
            </div>
          )}
        </div>

        <button className="fav-btn" title="Add to Favorites">
          <Heart size={16} color="white" />
        </button>
      </div>

      <div className="card-content">
        {(title || location) && (
          <div className="card-header">
            {title && <h3>{title}</h3>}
            {location && (
              <div className="location">
                <MapPin />
                <span>{location}</span>
              </div>
            )}
          </div>
        )}

        {/* Amenities Section - Conditionally Rendered */}
        {amenitiesList.length > 0 && (
          <div
            className="amenities-marquee-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            <div className="amenities-label">
              PLOT AMENITIES{" "}
              <span style={{ color: "#22d3ee", marginLeft: "4px" }}>
                ({amenitiesList.length})
              </span>
            </div>

            <button
              className="marquee-control-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (isPaused && scrollRef.current) {
                  const maxScroll =
                    scrollRef.current.scrollWidth -
                    scrollRef.current.clientWidth;
                  // If at the end, restart from beginning
                  if (scrollRef.current.scrollLeft >= maxScroll - 5) {
                    scrollRef.current.scrollLeft = 0;
                  }
                }
                setIsPaused(!isPaused);
              }}
            >
              {isPaused ? (
                <Play size={10} fill="white" />
              ) : (
                <Pause size={10} fill="white" />
              )}
            </button>

            <div className="amenities-marquee-container" ref={scrollRef}>
              <div className="amenities-track">
                {amenitiesList.map((amenity, index) => (
                  <div key={index} className="amenity-icon-item">
                    {amenity.icon}
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {convertedAreaDisplay && (
          <div className="area-calculator">
            <div className="flex items-center gap-1">
              <LandPlot size={16} style={{ color: "#22d3ee" }} />
              <span className="area-value">
                Plot Area: {convertedAreaDisplay} {unitLabels[unit]}
              </span>
            </div>

            <div className="custom-card-dropdown" ref={dropdownRef}>
              <button
                className="dropdown-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUnitDropdown(!showUnitDropdown);
                }}
              >
                {unitLabels[unit]}
                <ChevronDown size={14} />
              </button>

              {showUnitDropdown && (
                <div className="dropdown-menu">
                  {Object.entries(unitLabels).map(([key, label]) => (
                    <button
                      key={key}
                      className={`dropdown-item ${unit === key ? "active" : ""}`}
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

        {(sellerName || contact) && (
          <div className="seller-row">
            <div className="seller-info">
              {sellerName && (
                <div className="seller-avatar">{sellerName.charAt(0)}</div>
              )}
              <div className="seller-details">
                {sellerName && <span className="name">{sellerName}</span>}
                {(sellerType || contact) && (
                  <div className="sub-details">
                    {sellerType && (
                      <span className="type-badge">{sellerType}</span>
                    )}
                    {sellerType && contact && (
                      <span className="separator">•</span>
                    )}
                    {contact && (
                      <span className="contact">{getMaskedContact()}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="seller-actions">
              <button className="btn-action-label enquiry">
                <MessageSquare /> Enquiry
              </button>
              <button className="btn-action-label contact">
                <Phone /> Contact
              </button>
            </div>
          </div>
        )}

        <div className="card-footer">
          {price && (
            <div className="price-block">
              <div className="price">{price}</div>
              {unitPriceDisplay && (
                <div className="unit-price">{unitPriceDisplay}</div>
              )}
            </div>
          )}

          <button className="btn-details" onClick={handleView}>
            View Details <ArrowRight size={14} />
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
