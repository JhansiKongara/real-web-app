"use client";

import { useRouter } from "next/navigation";

export interface Property {
  id: number;
  title: string;
  location: string;
  city: string;
  price: number;
  image: string;
  status: string;
}

interface Props {
  property: Property;
  onView?: (property: Property) => void;
}

export default function PropertyCard({ property, onView }: Props) {
  const router = useRouter();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN").format(price);

  const handleClick = () => {
    if (onView) onView(property);
    router.push(`/property/${property.id}`);
  };

  return (
    <div className="card">
      <img src={property.image} alt={property.title} />
      <h3>{property.title}</h3>
      <p>Location: {property.location}</p>
      <p>City: {property.city}</p>
      <h4>₹{formatPrice(property.price)}</h4>

      <button onClick={handleClick}>
        View Details →
      </button>
    </div>
  );
}
