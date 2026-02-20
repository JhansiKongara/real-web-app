import PropertyDetail from "@/app/components/listings/PropertyDetail";
import properties from "@/app/lib/properties";
import { Metadata } from "next";

type Props = {
  params: Promise<{ city: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, slug } = await params;

  // Find the property
  let property = properties.find((p) => p.slug === slug);
  if (!property) {
    property = properties.find((p) => p.id.toString() === slug);
  }

  if (!property) {
    return {
      title: "Property Not Found",
      description: "The requested property could not be found.",
    };
  }

  const cityName = property.city;
  const location = property.location;
  const type = property.type;
  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(property.price);

  return {
    title: `${property.title} | ${type} in ${location}, ${cityName}`,
    description: `${property.description} Located in ${location}, ${cityName}. Price: ${price}. Area: ${property.area} sqft. ${property.amenities?.length ? `Amenities: ${property.amenities.join(", ")}.` : ""} Contact us for more details.`,
    keywords: `${type}, ${location}, ${cityName}, real estate, property for sale, plot for sale, ${property.amenities?.join(", ")}`,
  };
}

export default function PropertyPage() {
  return <PropertyDetail />;
}
