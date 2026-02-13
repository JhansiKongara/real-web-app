"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  MapPin,
  Home,
  Ruler,
  Tag,
  CheckCircle,
  ArrowLeft,
  X,
  Image as ImageIcon,
} from "lucide-react";

import properties from "../../public/data/script";
import "./styles/PropertyDetail.scss";

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [showGallery, setShowGallery] = useState(false);

  const property = properties.find((p) => p.id.toString() === id);

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

  const galleryImages = [
    property.image,
    properties[0]?.image,
    properties[1]?.image,
    properties[2]?.image,
    properties[3]?.image,
  ].filter(Boolean);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN").format(price);

  return (
    <>
      <div className="property-detail-page">
        <button onClick={() => router.back()} className="back-btn">
          <ArrowLeft size={16} /> Back to Search
        </button>

        <div className="detail-container">
          {/* LEFT COLUMN */}
          <div className="left-column">
            <div className="image-section">
              <img
                src={property.image}
                alt={property.title}
                className="main-img"
                onClick={() => setShowGallery(true)}
              />

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
                    <strong>{property.area} sqft</strong>
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
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <CheckCircle size={16} className="text-green-600" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-column">
            <div className="price-card">
              <h1 className="property-title">{property.title}</h1>

              <div className="property-location">
                <MapPin size={16} /> {property.location}, {property.city}
              </div>

              <div className="price-value">
                ₹{formatPrice(property.price)}
              </div>

              <div className="price-unit">
                @ ₹{(property.price / property.area).toFixed(0)} per sqft
              </div>

              <button className="inquiry-btn">Contact Agent</button>
              <button className="contact-btn">Get Phone Number</button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 FULL SCREEN GALLERY MODAL */}
      {showGallery && (
        <div
          className="gallery-modal"
          onClick={() => setShowGallery(false)}
        >
          <div
            className="gallery-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setShowGallery(false)}
            >
              <X size={24} />
            </button>

            <div className="horizontal-gallery">
              {galleryImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Gallery ${index}`}
                  className="gallery-img"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
