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
  MessageCircle,
  PhoneCall,
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
      className="bg-[var(--background)] text-[var(--foreground)] font-['Outfit'] pb-[76px] md:pb-16 flex flex-col items-center transition-colors duration-300"
      onClick={() => setShowUnitDropdown(false)}
    >
      {/* ── Smart Sticky Header Bar ── */}
      {/* Desktop spacer so content doesn't go under the fixed bar */}
      <div className="hidden lg:block w-full h-[60px] shrink-0" />
      <div className="w-full sticky top-[48px] md:top-[55px] lg:fixed lg:top-[55px] lg:left-0 z-[1000] bg-gradient-to-r from-[var(--card)] via-[var(--background)]/95 to-[var(--card)] backdrop-blur-xl border-b-2 border-[var(--primary)]/40 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300">
        {/* ══ MOBILE HEADER ══ */}
        <div className="md:hidden">
          {/* Row 1: Title + Location */}
          <div className="flex flex-col items-center justify-center px-4 pt-2 pb-1 border-b border-[var(--border)]/40 text-center">
            <div className="text-[0.9rem] font-black text-[var(--foreground)] uppercase tracking-tight line-clamp-2 leading-tight w-full">
              {property.title}
            </div>
            <div className="flex items-center justify-center gap-1 text-[var(--muted)] text-[0.65rem] font-semibold">
              <MapPin size={10} className="text-[var(--primary)] shrink-0" />
              {property.location}, {property.city}
            </div>
          </div>
          {/* Row 2: Back | Price | Share | Save */}
          <div className="flex items-stretch h-[50px]">
            {/* Back */}
            <button
              onClick={() => router.back()}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-transparent border-none text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all cursor-pointer"
            >
              <ChevronDown
                size={16}
                className="rotate-90 text-[var(--primary)]"
              />
              <span className="text-[0.6rem] font-bold uppercase">Back</span>
            </button>
            <div className="w-px h-4 bg-[var(--border)] self-center" />
            {/* Price */}
            <div className="flex-[2] flex flex-col items-center justify-center">
              <span className="text-[0.55rem] text-[var(--muted)] font-bold uppercase tracking-widest leading-none">
                Total Price
              </span>
              <span className="text-[0.95rem] font-black text-[var(--primary)] leading-tight">
                {formatPrice(property.price)}
              </span>
            </div>
            <div className="w-px h-4 bg-[var(--border)] self-center" />
            {/* Share */}
            <button
              className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-transparent border-none text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all cursor-pointer"
              onClick={() => {
                const slugText =
                  property.slug ||
                  property.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                const citySlug = property.city
                  .toLowerCase()
                  .replace(/\s+/g, "-");
                const shareUrl = `${window.location.origin}/property/${citySlug}/${slugText}-${property.id}`;
                if (navigator.share) {
                  navigator
                    .share({ title: property.title, url: shareUrl })
                    .catch(console.error);
                } else {
                  navigator.clipboard.writeText(shareUrl);
                }
              }}
            >
              <Share2 size={14} className="text-[var(--primary)]" />
              <span className="text-[0.6rem] font-bold uppercase">Share</span>
            </button>
            <div className="w-px h-4 bg-[var(--border)] self-center" />
            {/* Save */}
            <button className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-transparent border-none text-[var(--muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer group/hrt">
              <Heart
                size={14}
                className="text-[var(--primary)] group-hover/hrt:text-rose-500 group-hover/hrt:fill-rose-500 transition-colors"
              />
              <span className="text-[0.6rem] font-bold uppercase">Save</span>
            </button>
          </div>
        </div>

        {/* ══ DESKTOP HEADER (single row) ══ */}
        <div className="hidden md:flex max-w-[1400px] mx-auto items-stretch h-[56px] px-1 gap-0">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex flex-col items-center justify-center gap-0.5 px-3 min-w-[48px] bg-transparent border-none text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all cursor-pointer shrink-0"
          >
            <ChevronDown
              size={18}
              className="rotate-90 text-[var(--primary)]"
            />
            <span className="text-[0.7rem] font-bold uppercase">Back</span>
          </button>

          <div className="w-px h-4 bg-[var(--border)] self-center" />

          {/* Title + Location */}
          <div className="flex flex-1 flex-col justify-center px-3 min-w-0">
            <div className="text-[0.9rem] font-black text-[var(--foreground)] uppercase tracking-tight truncate leading-tight">
              {property.title}
            </div>
            <div className="flex items-center gap-1 text-[var(--muted)] text-[0.7rem] font-semibold truncate">
              <MapPin size={11} className="text-[var(--primary)] shrink-0" />
              {property.location}, {property.city}
            </div>
          </div>

          <div className="w-px h-4 bg-[var(--border)] self-center" />

          {/* Price */}
          <div className="flex flex-col items-center justify-center px-3 shrink-0">
            <span className="text-[0.6rem] text-[var(--muted)] font-bold uppercase tracking-widest leading-none">
              Price
            </span>
            <span className="text-[1rem] font-black text-[var(--primary)] leading-tight">
              {formatPrice(property.price)}
            </span>
          </div>

          <div className="w-px h-4 bg-[var(--border)] self-center" />

          {/* Area chip + unit switcher */}
          <div
            className="relative flex flex-col items-center justify-center px-3 cursor-pointer group shrink-0 hover:bg-[var(--primary)]/5 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setShowUnitDropdown(!showUnitDropdown);
            }}
          >
            <span className="text-[0.6rem] text-[var(--muted)] font-bold uppercase tracking-widest leading-none">
              Area
            </span>
            <div className="flex items-center gap-0.5 text-[0.9rem] font-black text-[var(--foreground)]">
              <Ruler size={12} className="text-[var(--primary)]" />
              {getConvertedArea()}
              <span className="text-[0.7rem] font-semibold text-[var(--muted)]">
                {unitLabels[unit]}
              </span>
              <ChevronDown
                size={13}
                className="text-[var(--primary)] transition-transform duration-300 group-hover:rotate-180"
              />
            </div>
            {showUnitDropdown && (
              <div className="absolute top-[calc(100%+2px)] left-0 bg-[var(--card)] border border-[var(--primary)]/40 rounded-xl p-1.5 min-w-[130px] shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(var(--primary-rgb),0.15)] z-[1001] flex flex-col gap-0.5 backdrop-blur-2xl">
                {Object.keys(unitLabels).map((key) => (
                  <button
                    key={key}
                    className={`w-full text-left px-3 py-2 text-sm font-bold border-none cursor-pointer rounded-lg transition-all hover:bg-[var(--primary)]/15 ${
                      unit === key
                        ? "text-[var(--primary)] bg-[var(--primary)]/10"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
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

          {/* Rate */}
          <div className="flex flex-col items-center justify-center px-3 shrink-0">
            <span className="text-[0.6rem] text-[var(--muted)] font-bold uppercase tracking-widest leading-none">
              Rate
            </span>
            <div className="flex items-center gap-0.5 text-[0.8rem] font-bold text-[var(--foreground)]">
              <Tag size={11} className="text-[var(--primary)] shrink-0" />
              <span className="truncate max-w-[100px]">{getUnitPrice()}</span>
            </div>
          </div>

          <div className="w-px h-4 bg-[var(--border)] self-center" />

          {/* Share */}
          <button
            className="flex flex-col items-center justify-center gap-0.5 px-3 min-w-[44px] bg-transparent border-none text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all cursor-pointer shrink-0"
            onClick={() => {
              const slugText =
                property.slug ||
                property.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
              const citySlug = property.city.toLowerCase().replace(/\s+/g, "-");
              const shareUrl = `${window.location.origin}/property/${citySlug}/${slugText}-${property.id}`;
              if (navigator.share) {
                navigator
                  .share({ title: property.title, url: shareUrl })
                  .catch(console.error);
              } else {
                navigator.clipboard.writeText(shareUrl);
              }
            }}
          >
            <Share2 size={14} className="text-[var(--primary)]" />
            <span className="text-[0.7rem] font-bold uppercase">Share</span>
          </button>

          {/* Save */}
          <button className="flex flex-col items-center justify-center gap-0.5 px-3 min-w-[44px] bg-transparent border-none text-[var(--muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer shrink-0 group/hrt">
            <Heart
              size={14}
              className="text-[var(--primary)] group-hover/hrt:text-rose-500 group-hover/hrt:fill-rose-500 transition-colors"
            />
            <span className="text-[0.7rem] font-bold uppercase">Save</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 max-w-[1400px] w-full px-5 mt-8">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          {/* Gallery Strip */}
          <div
            className="grid gap-2 rounded-2xl overflow-hidden cursor-pointer group"
            style={{ gridTemplateColumns: "2fr 1fr 1fr", height: "240px" }}
            onClick={() => setShowGallery(true)}
          >
            {galleryImages.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden ${idx === 0 ? "row-span-1" : ""}`}
              >
                <img
                  src={img}
                  alt={`${property.title} ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {idx === 2 && galleryImages.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                    <ImageIcon size={24} className="text-[var(--primary)]" />
                    <span className="text-white text-sm font-black">
                      +{galleryImages.length - 3} Photos
                    </span>
                  </div>
                )}
              </div>
            ))}
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

        {/* Right Column - Agent Card (desktop only — mobile uses sticky bottom CTA bar) */}
        <div className="hidden lg:block relative lg:sticky lg:top-[110px] h-fit">
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

      {/* ── Mobile Sticky Bottom CTA Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[999] flex items-stretch h-[64px] bg-[var(--card)]/95 backdrop-blur-xl border-t-2 border-[var(--primary)]/30 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        {/* Enquiry Button */}
        <button className="flex-1 flex items-center justify-center gap-2 bg-[var(--primary)] text-[var(--background)] font-extrabold text-[0.9rem] uppercase tracking-wider transition-all active:scale-95 cursor-pointer">
          <MessageCircle size={18} strokeWidth={2.5} />
          Enquiry
        </button>

        {/* Divider */}
        <div className="w-px bg-[var(--primary)]/30 shrink-0" />

        {/* Contact Card */}
        <button className="flex-1 flex items-center justify-center gap-3 px-4 bg-transparent hover:bg-[var(--primary)]/5 transition-all active:scale-[0.98] cursor-pointer">
          {/* Call icon replacing avatar */}
          <div className="w-9 h-9 shrink-0 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] border border-[var(--primary)]/20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)]">
            <PhoneCall size={16} strokeWidth={2.5} />
          </div>
          {/* Info */}
          <div className="flex flex-col items-start min-w-0">
            <span className="text-[0.75rem] font-extrabold text-[var(--foreground)] leading-tight truncate max-w-[110px]">
              {property.sellerName || "Verified Agent"}
            </span>
            <span className="text-[0.7rem] text-[var(--primary)] font-bold font-mono tracking-wider leading-tight">
              {getMaskedContact(property.contact)}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
