"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  MapPin,
  Home,
  Tag,
  CheckCircle,
  ArrowLeft,
  X,
  Image as ImageIcon,
  ChevronDown,
  Ruler,
  Share2,
  Heart,
} from "lucide-react";

import properties from "@/app/lib/properties";
import "@/app/styles/PropertyDetail.scss";
import GalleryModal from "@/app/components/shared/GalleryModal";
import PropertyCard from "./PropertyCard";
import HorizontalCarousel from "@/app/components/ui/HorizontalCarousel";
import { Property } from "@/app/types";
import { getAmenityIcon } from "@/app/lib/amenities";

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const city = params?.city as string;
  const slug = params?.slug as string;

  const [showGallery, setShowGallery] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  let property = properties.find((p) => p.slug === slug);
  // Fallback for ID-based URLs
  if (!property) {
    property = properties.find((p) => p.id.toString() === slug);
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleViewDetails = (p: Property) => {
    let viewed: Property[] = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]",
    );
    viewed = viewed.filter((item) => item.id !== p.id);
    viewed.unshift(p);
    viewed = viewed.slice(0, 10);
    localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
  };

  const relatedProperties = properties
    .filter((p) => p.city === property?.city && p.id !== property?.id)
    .slice(0, 8);

  const galleryImages: string[] = [
    ...(Array.isArray(property.image) ? property.image : [property.image]),
    ...(Array.isArray(properties[0]?.image)
      ? properties[0].image
      : [properties[0]?.image]),
    ...(Array.isArray(properties[1]?.image)
      ? properties[1].image
      : [properties[1]?.image]),
    ...(Array.isArray(properties[2]?.image)
      ? properties[2].image
      : [properties[2]?.image]),
    ...(Array.isArray(properties[3]?.image)
      ? properties[3].image
      : [properties[3]?.image]),
  ].filter((img): img is string => typeof img === "string");

  const [unit, setUnit] = useState("sqft");
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const conversions: Record<string, number> = {
    sqyd: 1 / 9,
    sqft: 1,
    gunta: 1 / 1089, // 1 Gunta = 1089 sqft
    acre: 1 / 43560,
  };

  const unitLabels: Record<string, string> = {
    sqyd: "Sq.Yd",
    sqft: "Sq.Ft",
    gunta: "Gunta",
    acre: "Acre",
  };

  const getConvertedArea = () => {
    if (!property.area) return "0";
    const factor = conversions[unit] || 1;
    const val = property.area * factor;
    return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹ ${(price / 100000).toFixed(2)} L`;
    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  const getUnitPrice = () => {
    if (!property.area || !property.price) return "0";
    const factor = conversions[unit] || 1;
    const areaInUnit = property.area * factor;
    const unitPrice = property.price / areaInUnit;
    return `₹ ${unitPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} per ${unitLabels[unit]}`;
  };

  const getMaskedContact = (contact?: string) => {
    if (!contact) return "91-XXXXXXXXXX";
    // Format: 91-834****
    const prefix = contact.startsWith("91") ? "91-" : "";
    const cleanNum = contact.replace(/^91/, "");
    return `${prefix}${cleanNum.substring(0, 3)}****`;
  };

  return (
    <>
      <div
        className="property-detail-page"
        onClick={() => setShowUnitDropdown(false)}
      >
        <div className="sticky-property-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="header-property-title">{property.title}</h1>
              <div className="header-property-location">
                <MapPin size={14} /> {property.location}, {property.city}
              </div>
            </div>

            <div className="header-right">
              <div className="header-values-stack">
                <div className="header-price-value">
                  {formatPrice(property.price)}
                </div>

                <div className="header-secondary-row">
                  <div className="header-unit-converter">
                    <div className="unit-display">
                      <Ruler size={14} />
                      <span>
                        {getConvertedArea()} {unitLabels[unit]}
                      </span>
                    </div>
                    <div className="unit-dropdown-wrapper">
                      <button
                        className="unit-dropdown-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowUnitDropdown(!showUnitDropdown);
                        }}
                      >
                        {unitLabels[unit]} <ChevronDown size={14} />
                      </button>
                      {showUnitDropdown && (
                        <div className="unit-dropdown-menu">
                          {Object.keys(unitLabels).map((key) => (
                            <button
                              key={key}
                              className={`unit-option ${unit === key ? "active" : ""}`}
                              onClick={() => {
                                setUnit(key);
                                setShowUnitDropdown(false);
                              }}
                            >
                              {unitLabels[key]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="header-info-divider" />

                  <div className="header-unit-price">{getUnitPrice()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-container">
          {/* LEFT COLUMN */}
          <div className="left-column">
            <div className="image-section">
              <img
                src={
                  Array.isArray(property.image)
                    ? property.image[0]
                    : property.image
                }
                alt={property.title}
                className="main-img"
                onClick={() => setShowGallery(true)}
              />

              <div className="image-action-buttons">
                <button
                  className="img-action-btn share-btn"
                  title="Share Property"
                >
                  <Share2 size={18} />
                </button>
                <button
                  className="img-action-btn love-btn"
                  title="Save to Favorites"
                >
                  <Heart size={18} />
                </button>
              </div>

              <button
                className="gallery-trigger-btn"
                onClick={() => setShowGallery(true)}
              >
                <ImageIcon size={16} /> {galleryImages.length}
              </button>
            </div>

            {/* Overview */}
            <div className="section-card">
              <h2 className="section-title">Property Overview</h2>

              <div className="overview-grid">
                <div className="overview-item">
                  <div className="overview-icon-wrapper">
                    <Ruler size={20} />
                  </div>
                  <div className="overview-text">
                    <span>Super Area</span>
                    <strong>
                      {getConvertedArea()} {unitLabels[unit]}
                    </strong>
                  </div>
                </div>

                <div className="overview-item">
                  <div className="overview-icon-wrapper">
                    <Home size={20} />
                  </div>
                  <div className="overview-text">
                    <span>Property Type</span>
                    <strong>{property.type}</strong>
                  </div>
                </div>

                <div className="overview-item">
                  <div className="overview-icon-wrapper">
                    <MapPin size={20} />
                  </div>
                  <div className="overview-text">
                    <span>Location</span>
                    <strong>{property.city}</strong>
                  </div>
                </div>

                <div className="overview-item">
                  <div className="overview-icon-wrapper">
                    <Tag size={20} />
                  </div>
                  <div className="overview-text">
                    <span>Status</span>
                    <strong>Ready to Move</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="section-card">
              <h2 className="section-title">Description</h2>
              <p className="description-text">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="section-card">
              <h2 className="section-title">Amenities</h2>
              <div className="amenities-list">
                {(showAllAmenities
                  ? property.amenities || []
                  : (property.amenities || []).slice(0, 5)
                ).map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    {getAmenityIcon(amenity)}
                    {amenity}
                  </div>
                ))}

                {(property.amenities || []).length > 5 && (
                  <button
                    className="show-more-amenities"
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                  >
                    {showAllAmenities ? (
                      <>
                        Less <ChevronDown className="rotate-180" size={14} />
                      </>
                    ) : (
                      <>
                        Show More +
                        {/* {(property.amenities || []).length - 5} */}
                        <ChevronDown size={14} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-column">
            <div className="agent-card">
              <h2 className="agent-card-title">Agent Information</h2>

              <div className="agent-info-wrapper">
                <div className="agent-avatar">
                  {property.sellerName?.charAt(0) || "A"}
                </div>
                <div className="agent-details">
                  <div className="agent-name">
                    {property.sellerName || "Verified Agent"}
                  </div>
                  <div className="agent-type">
                    {property.sellerType || "Consultant"}
                  </div>
                  <div className="agent-contact">
                    {getMaskedContact(property.contact)}
                  </div>
                </div>
              </div>

              <div className="agent-actions">
                <button className="inquiry-btn">Contact Agent</button>
                <button className="contact-btn">Get Phone Number</button>
              </div>
            </div>
          </div>
        </div>

        {relatedProperties.length > 0 && (
          <div className="related-section">
            <HorizontalCarousel title="Related Plots You May Like">
              {relatedProperties.map((item) => (
                <PropertyCard
                  key={item.id}
                  property={item}
                  onView={handleViewDetails}
                />
              ))}
            </HorizontalCarousel>
          </div>
        )}
      </div>

      <GalleryModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        images={galleryImages}
        title={property.title}
      />
    </>
  );
}
