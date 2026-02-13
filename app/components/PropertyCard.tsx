"use client";

import { useRouter } from "next/navigation";
import { MapPin, Phone, User, CheckCircle, ArrowRight } from "lucide-react";
import "./styles/PropertyCard.scss";

export interface Property {
  id: number;
  title: string;
  location: string;
  city: string;
  price: number;
  image: string;
  status: string;
  area?: number;
  description?: string;
}

interface Props {
  property: Property;
  onView?: (property: Property) => void;
  variant?: "card" | "list";
}

export default function PropertyCard({ property, onView, variant = "card" }: Props) {
  const router = useRouter();

  const formatPrice = (price: number) =>
    price >= 10000000 
      ? `₹ ${(price / 10000000).toFixed(2)} Cr` 
      : `₹ ${(price / 100000).toFixed(2)} L`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) onView(property);
    router.push(`/property/${property.id}`);
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Displaying Owner Contact...");
  };

  if (variant === "list") {
    return (
      <div className="property-list-card" onClick={handleClick}>
        {/* Left: Image */}
        <div className="list-card-image">
          <img src={property.image} alt={property.title} />
          <div className="photo-badge">20+ Photos</div>
          <div className="verified-badge"><CheckCircle size={12}/> Verified</div>
        </div>

        {/* Middle: Details */}
        <div className="list-card-details">
          <div className="list-header">
            <h3>{property.title}</h3>
            <span className="project-name">in {property.location}</span>
          </div>

          <div className="list-features-grid">
            <div className="feature-box">
              <span className="label">CARPET AREA</span>
              <span className="value">{property.area || 1200} sqft</span>
            </div>
            <div className="feature-box">
              <span className="label">STATUS</span>
              <span className="value">{property.status}</span>
            </div>
            <div className="feature-box">
              <span className="label">FLOOR</span>
              <span className="value">2 out of 5</span>
            </div>
            <div className="feature-box">
              <span className="label">TRANSACTION</span>
              <span className="value">Resale</span>
            </div>
          </div>

          <p className="list-description">
            {property.description?.substring(0, 100) || "Premium property located in prime area with excellent amenities..."}...
          </p>
          
          <div className="owner-info">
            <User size={16} />
            <span>Owner: Suresh Kumar</span>
          </div>
        </div>

        {/* Right: Price & Actions */}
        <div className="list-card-actions">
           <div className="price-section">
             <div className="main-price">{formatPrice(property.price)}</div>
             <div className="sqft-price">₹ {(property.price / (property.area || 1200)).toFixed(0)} per sqft</div>
           </div>

           <div className="action-buttons">
             <button className="contact-owner-btn" onClick={handleContact}>Contact Owner</button>
             <button className="get-phone-btn" onClick={handleContact}>Get Phone No.</button>
           </div>
        </div>
      </div>
    );
  }

  // Default Carousel Card
  return (
    <div className="card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <img src={property.image} alt={property.title} />
      <h3>{property.title}</h3>
      <p><MapPin size={14}/> {property.location}, {property.city}</p>
      <h4>{formatPrice(property.price)}</h4>

      <button>
        View Details <ArrowRight size={14} />
      </button>
    </div>
  );
}
