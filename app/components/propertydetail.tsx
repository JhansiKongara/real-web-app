"use client";

import { useParams } from "next/navigation";
import properties from "../../public/data/script";

export default function PropertyDetail() {
  const params = useParams();
  const id = params?.id as string;

  const property = properties.find(
    (p) => p.id.toString() === id
  );

  if (!property) {
    return <p style={{ padding: "20px" }}>Property not found</p>;
  }

  return (
    <div className="property-detail-page" style={{ padding: "20px" }}>
      <h1>{property.title}</h1>

      <img
        src={property.image}
        alt={property.title}
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "12px",
        }}
      />

      <p>
        <strong>Location:</strong> {property.location},{" "}
        {property.city}
      </p>

      <p>
        <strong>Price:</strong> ₹
        {property.price.toLocaleString("en-IN")}
      </p>

      <p>
        <strong>Area:</strong> {property.area} sqft
      </p>

      <p>
        <strong>Type:</strong> {property.type}
      </p>

      <p>
        <strong>Status:</strong> {property.status}
      </p>

      <p>
        <strong>Description:</strong> {property.description}
      </p>

      <div>
        <strong>Amenities:</strong>{" "}
        {property.amenities.map((a, i) => (
          <span
            key={i}
            style={{ marginRight: "10px" }}
          >
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}
