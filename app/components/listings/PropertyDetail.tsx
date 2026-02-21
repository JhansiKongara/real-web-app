"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  MapPin,
  Home,
  Tag,
  ImageIcon,
  ChevronDown,
  Ruler,
  Share2,
  Heart,
} from "lucide-react";

import properties from "@/app/lib/properties";
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

  let property: Property | undefined;

  if (typeof window !== "undefined") {
    // Attempt to perfectly match via localStorage to avoid needing ID in the URL
    const stored = localStorage.getItem("selectedProperty");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Property;
        // Verify the stored property actually matches the URL we are on
        const parsedSlug =
          parsed.slug ||
          parsed.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        const expectedUniqueSlug = `${parsedSlug}-${parsed.id}`;

        if (expectedUniqueSlug === slug || parsedSlug === slug) {
          property = parsed;
        }
      } catch (e) {
        console.error("Failed to parse stored property");
      }
    }
  }

  // Fallbacks: If direct page reload or shared link, look it up in the DB
  if (!property) {
    property = properties.find((p) => p.slug === slug);
  }
  if (!property) {
    // Extract ID from the end of the slug (e.g., luxury-villa-105)
    const slugParts = slug?.split("-");
    const extractedId = slugParts ? slugParts[slugParts.length - 1] : null;
    property = properties.find((p) => p.id.toString() === extractedId);
  }
  if (!property) {
    // Extract ID from the beginning of the slug (legacy support)
    const extractedId = slug?.split("-")[0];
    property = properties.find((p) => p.id.toString() === extractedId);
  }
  if (!property) {
    property = properties.find((p) => p.id.toString() === slug);
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[var(--muted)] bg-[var(--background)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/80 shadow-[0_4px_15px_rgba(var(--primary-rgb),0.3)] transition-all"
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
  ].filter((img): img is string => typeof img === "string");

  const [unit, setUnit] = useState("sqft");
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const conversions: Record<string, number> = {
    sqyd: 1 / 9,
    sqft: 1,
    gunta: 1 / 1089,
    acre: 1 / 43560,
  };

  const unitLabels: Record<string, string> = {
    sqyd: "Sq.Yd",
    sqft: "Sq.Ft",
    gunta: "Gunta",
    acre: "Acre",
  };

  const getConvertedArea = () => {
    if (!property?.area) return "0";
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
    if (!property?.area || !property?.price) return "0";
    const factor = conversions[unit] || 1;
    const areaInUnit = property.area * factor;
    const unitPrice = property.price / areaInUnit;
    return `₹ ${unitPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} per ${unitLabels[unit]}`;
  };

  const getMaskedContact = (contact?: string) => {
    if (!contact) return "91-XXXXXXXXXX";
    const prefix = contact.startsWith("91") ? "91-" : "";
    const cleanNum = contact.replace(/^91/, "");
    return `${prefix}${cleanNum.substring(0, 3)}****`;
  };

  return (
    <div
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-['Outfit'] pb-16 flex flex-col items-center transition-colors duration-300"
      onClick={() => setShowUnitDropdown(false)}
    >
      {/* Sticky Premium Header */}
      <div className="w-full sticky top-0 z-[1000] bg-[var(--card)]/95 backdrop-blur-md border-b border-[var(--primary)]/20 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1400px] w-full mx-auto px-10 flex flex-col md:flex-row justify-between items-center md:items-center gap-4 md:gap-0">
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <h1 className="text-2xl md:text-[1.6rem] font-bold text-[var(--foreground)] leading-tight tracking-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-[var(--muted)] text-sm font-medium">
              <MapPin size={16} className="text-[var(--primary)]" />{" "}
              {property.location}, {property.city}
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end text-left md:text-right w-full md:w-auto">
            <div className="text-3xl font-extrabold text-[var(--foreground)] leading-none mb-1">
              {formatPrice(property.price)}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 relative">
                <div className="flex items-center gap-1.5 text-[var(--foreground)] font-semibold text-sm">
                  <Ruler size={14} className="text-[var(--muted)]" />
                  <span>
                    {getConvertedArea()} {unitLabels[unit]}
                  </span>
                </div>
                <div className="relative">
                  <button
                    className="flex items-center gap-1 bg-[var(--background)]/80 border border-[var(--border)] text-[var(--foreground)] px-2.5 py-1 rounded text-[0.8rem] font-bold hover:bg-[var(--primary)]/10 hover:border-[var(--primary)] transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUnitDropdown(!showUnitDropdown);
                    }}
                  >
                    {unitLabels[unit]} <ChevronDown size={14} />
                  </button>
                  {showUnitDropdown && (
                    <div className="absolute top-full mt-2 right-0 bg-[var(--card)] border border-[var(--border)] rounded p-1 min-w-[110px] shadow-2xl z-[1001] flex flex-col gap-px animate-in fade-in slide-in-from-bottom-2">
                      {Object.keys(unitLabels).map((key) => (
                        <button
                          key={key}
                          className={`w-full text-left p-2.5 text-[0.85rem] font-semibold rounded-sm transition-all hover:bg-[var(--primary)]/10 ${unit === key ? "text-[var(--primary)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
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
              <div className="w-px h-3.5 bg-[var(--border)]" />
              <div className="text-[0.85rem] text-[var(--primary)] font-bold uppercase tracking-wider">
                {getUnitPrice()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 max-w-[1400px] w-full px-5 mt-8">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <div className="relative rounded-xl overflow-hidden h-[300px] md:h-[500px] bg-black border border-[var(--primary)]/40 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2),inset_0_0_15px_rgba(var(--primary-rgb),0.1)] group">
            <img
              src={
                Array.isArray(property.image)
                  ? property.image[0]
                  : property.image
              }
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 cursor-pointer group-hover:scale-105"
              onClick={() => setShowGallery(true)}
            />

            {/* Corner accents */}
            <div className="absolute inset-0 pointer-events-none border-2 border-transparent bg-[linear-gradient(45deg,rgba(var(--primary-rgb),0.5)_0%,transparent_20%)_top_left/100%_100%_no-repeat,linear-gradient(-135deg,rgba(var(--primary-rgb),0.5)_0%,transparent_20%)_bottom_right/100%_100%_no-repeat] opacity-50 z-[5]"></div>

            <div className="absolute top-5 left-5 flex gap-3 z-10">
              <button
                className="bg-black/70 backdrop-blur-md text-[var(--primary)] border border-[var(--primary)]/50 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all hover:bg-black hover:scale-105"
                onClick={() => setShowGallery(true)}
              >
                <ImageIcon size={16} /> {galleryImages.length}
              </button>
            </div>

            <div className="absolute top-5 right-5 flex gap-3 z-10">
              <button className="w-10 h-10 rounded-full bg-[var(--background)]/70 backdrop-blur-md border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center transition-all hover:bg-[var(--primary)]/20 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:scale-110">
                <Share2 size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-[var(--background)]/70 backdrop-blur-md border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center transition-all hover:bg-[var(--accent)]/20 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-110">
                <Heart size={18} />
              </button>
            </div>
          </div>

          {/* Overview */}
          <section className="bg-[var(--card)]/60 backdrop-blur-xl p-6 rounded-2xl border border-[var(--primary)]/20 shadow-2xl transition-all duration-300">
            <h2 className="text-xl font-extrabold mb-4 flex items-center gap-3 uppercase tracking-wider before:content-[''] after:flex-1 after:h-px after:bg-gradient-to-r after:from-[var(--primary)] after:to-transparent">
              Property Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  icon: <Ruler size={20} />,
                  label: "Super Area",
                  value: `${getConvertedArea()} ${unitLabels[unit]}`,
                },
                {
                  icon: <Home size={20} />,
                  label: "Property Type",
                  value: property.type,
                },
                {
                  icon: <MapPin size={20} />,
                  label: "Location",
                  value: property.city,
                },
                {
                  icon: <Tag size={20} />,
                  label: "Status",
                  value: "Ready to Move",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/10"
                >
                  <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center text-[var(--primary)] shadow-[0_0_8px_rgba(var(--primary),0.2)]">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.65rem] text-[var(--muted)] uppercase tracking-[0.5px] leading-none mb-0.5">
                      {item.label}
                    </span>
                    <strong className="text-sm font-bold leading-tight">
                      {item.value}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="bg-[var(--card)]/60 backdrop-blur-xl p-6 rounded-2xl border border-[var(--primary)]/20 shadow-2xl transition-all duration-300">
            <h2 className="text-xl font-extrabold mb-4 flex items-center gap-3 uppercase tracking-wider after:flex-1 after:h-px after:bg-gradient-to-r after:from-[var(--primary)] after:to-transparent">
              Description
            </h2>
            <p className="text-[var(--muted)] leading-relaxed text-base">
              {property.description}
            </p>
          </section>

          {/* Amenities */}
          <section className="bg-[var(--card)]/60 backdrop-blur-xl p-6 rounded-2xl border border-[var(--primary)]/20 shadow-2xl transition-all duration-300">
            <h2 className="text-xl font-extrabold mb-4 flex items-center gap-3 uppercase tracking-wider after:flex-1 after:h-px after:bg-gradient-to-r after:from-[var(--primary)] after:to-transparent">
              Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {(showAllAmenities
                ? property.amenities || []
                : (property.amenities || []).slice(0, 5)
              ).map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-[0.85rem] text-[var(--foreground)] p-2 bg-[var(--primary)]/5 rounded-lg border border-[var(--primary)]/10"
                >
                  <span className="text-[var(--primary)] shrink-0">
                    {getAmenityIcon(amenity)}
                  </span>
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
              {(property.amenities || []).length > 5 && (
                <button
                  className="flex items-center justify-center gap-1.5 bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)] p-2 rounded-lg text-sm font-bold transition-all hover:bg-[var(--primary)] hover:text-[var(--background)] w-fit"
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                >
                  {showAllAmenities ? (
                    <>
                      Less <ChevronDown className="rotate-180" size={14} />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown size={14} />
                    </>
                  )}
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Agent Card */}
        <div className="relative lg:sticky lg:top-[110px] h-fit order-first lg:order-none">
          <div className="bg-gradient-to-br from-[var(--card)]/95 to-[var(--background)]/95 backdrop-blur-2xl p-8 rounded-[20px] border border-[var(--primary)]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-100 transition-all duration-300">
            <h2 className="text-sm font-extrabold text-[var(--muted)] uppercase tracking-[2px] mb-6 flex items-center gap-2.5 after:flex-1 after:h-px after:bg-[var(--muted)]/20">
              Agent Information
            </h2>

            <div className="flex items-center gap-5 mb-8 p-5 bg-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/10">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-2xl font-extrabold text-[var(--background)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] border-2 border-[var(--primary)] shrink-0">
                {property.sellerName?.charAt(0) || "A"}
              </div>
              <div>
                <div className="text-xl font-bold text-[var(--foreground)] leading-tight">
                  {property.sellerName || "Verified Agent"}
                </div>
                <div className="text-[0.85rem] text-[var(--primary)] font-semibold uppercase tracking-wide">
                  {property.sellerType || "Consultant"}
                </div>
                <div className="text-[1.1rem] text-[var(--primary)] font-bold font-mono tracking-wider mt-1">
                  {getMaskedContact(property.contact)}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button className="w-full py-4 bg-[var(--primary)] text-[var(--background)] font-extrabold text-base uppercase tracking-wider rounded-lg transition-all hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(var(--primary-rgb),0.6)] cursor-pointer">
                Contact Agent
              </button>
              <button className="w-full py-3.5 bg-transparent border border-[var(--primary)]/50 text-[var(--primary)] font-bold text-base rounded-lg transition-all hover:bg-[var(--primary)]/10 hover:border-[var(--primary)] cursor-pointer">
                Get Phone Number
              </button>
            </div>
          </div>
        </div>
      </div>

      {relatedProperties.length > 0 && (
        <div className="w-full max-w-[1400px] mt-16 px-5 pt-10 border-t border-[var(--primary)]/10">
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

      <GalleryModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        images={galleryImages}
        title={property.title}
      />
    </div>
  );
}
