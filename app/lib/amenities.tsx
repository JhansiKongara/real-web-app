import React from "react";
import {
  Droplets,
  Zap,
  Shield,
  Car,
  Dumbbell,
  Users,
  Trees,
  Route,
  Waves,
  Wifi,
  Wind,
  Sun,
  Home,
  ShoppingCart,
  GraduationCap,
  Hospital,
  Building2,
  Fence,
  Camera,
  Lightbulb,
  Flame,
  Sprout,
  PlaySquare,
  UtensilsCrossed,
  Baby,
  Dog,
  Bike,
  Bus,
  Train,
  Plane,
} from "lucide-react";

export interface AmenityConfig {
  name: string;
  icon: React.ReactElement;
  category:
    | "essential"
    | "recreational"
    | "security"
    | "connectivity"
    | "lifestyle";
}

// Comprehensive amenities configuration with icons
export const AMENITIES_CONFIG: Record<string, AmenityConfig> = {
  // Essential Amenities
  Water: {
    name: "Water",
    icon: <Droplets className="w-4 h-4" />,
    category: "essential",
  },
  Electricity: {
    name: "Electricity",
    icon: <Zap className="w-4 h-4" />,
    category: "essential",
  },
  Road: {
    name: "Road",
    icon: <Route className="w-4 h-4" />,
    category: "essential",
  },
  "Street Light": {
    name: "Street Light",
    icon: <Lightbulb className="w-4 h-4" />,
    category: "essential",
  },
  Drainage: {
    name: "Drainage",
    icon: <Droplets className="w-4 h-4" />,
    category: "essential",
  },

  // Security
  Security: {
    name: "Security",
    icon: <Shield className="w-4 h-4" />,
    category: "security",
  },
  "24/7 Security": {
    name: "24/7 Security",
    icon: <Shield className="w-4 h-4" />,
    category: "security",
  },
  CCTV: {
    name: "CCTV",
    icon: <Camera className="w-4 h-4" />,
    category: "security",
  },
  "Gated Community": {
    name: "Gated Community",
    icon: <Fence className="w-4 h-4" />,
    category: "security",
  },

  // Parking
  Parking: {
    name: "Parking",
    icon: <Car className="w-4 h-4" />,
    category: "essential",
  },
  "Covered Parking": {
    name: "Covered Parking",
    icon: <Car className="w-4 h-4" />,
    category: "essential",
  },
  "Visitor Parking": {
    name: "Visitor Parking",
    icon: <Car className="w-4 h-4" />,
    category: "essential",
  },

  // Recreational
  Gym: {
    name: "Gym",
    icon: <Dumbbell className="w-4 h-4" />,
    category: "recreational",
  },
  Club: {
    name: "Club",
    icon: <Users className="w-4 h-4" />,
    category: "recreational",
  },
  "Club House": {
    name: "Club House",
    icon: <Home className="w-4 h-4" />,
    category: "recreational",
  },
  Park: {
    name: "Park",
    icon: <Trees className="w-4 h-4" />,
    category: "recreational",
  },
  Garden: {
    name: "Garden",
    icon: <Sprout className="w-4 h-4" />,
    category: "recreational",
  },
  "Swimming Pool": {
    name: "Swimming Pool",
    icon: <Waves className="w-4 h-4" />,
    category: "recreational",
  },
  "Kids Play Area": {
    name: "Kids Play Area",
    icon: <Baby className="w-4 h-4" />,
    category: "recreational",
  },
  "Indoor Games": {
    name: "Indoor Games",
    icon: <PlaySquare className="w-4 h-4" />,
    category: "recreational",
  },

  // Connectivity
  Wifi: {
    name: "Wifi",
    icon: <Wifi className="w-4 h-4" />,
    category: "connectivity",
  },
  Internet: {
    name: "Internet",
    icon: <Wifi className="w-4 h-4" />,
    category: "connectivity",
  },
  "Broadband Ready": {
    name: "Broadband Ready",
    icon: <Wifi className="w-4 h-4" />,
    category: "connectivity",
  },

  // Lifestyle & Convenience
  "Power Backup": {
    name: "Power Backup",
    icon: <Zap className="w-4 h-4" />,
    category: "essential",
  },
  "Solar Panels": {
    name: "Solar Panels",
    icon: <Sun className="w-4 h-4" />,
    category: "lifestyle",
  },
  "Rain Water Harvesting": {
    name: "Rain Water Harvesting",
    icon: <Droplets className="w-4 h-4" />,
    category: "lifestyle",
  },
  "Waste Management": {
    name: "Waste Management",
    icon: <Wind className="w-4 h-4" />,
    category: "lifestyle",
  },
  Restaurant: {
    name: "Restaurant",
    icon: <UtensilsCrossed className="w-4 h-4" />,
    category: "lifestyle",
  },
  "Shopping Center": {
    name: "Shopping Center",
    icon: <ShoppingCart className="w-4 h-4" />,
    category: "lifestyle",
  },
  Stores: {
    name: "Stores",
    icon: <ShoppingCart className="w-4 h-4" />,
    category: "lifestyle",
  },
  Mall: {
    name: "Mall",
    icon: <Building2 className="w-4 h-4" />,
    category: "lifestyle",
  },
  School: {
    name: "School",
    icon: <GraduationCap className="w-4 h-4" />,
    category: "lifestyle",
  },
  Hospital: {
    name: "Hospital",
    icon: <Hospital className="w-4 h-4" />,
    category: "lifestyle",
  },
  "Pet Friendly": {
    name: "Pet Friendly",
    icon: <Dog className="w-4 h-4" />,
    category: "lifestyle",
  },

  // Transportation
  "Bike Track": {
    name: "Bike Track",
    icon: <Bike className="w-4 h-4" />,
    category: "recreational",
  },
  "Bus Stop": {
    name: "Bus Stop",
    icon: <Bus className="w-4 h-4" />,
    category: "connectivity",
  },
  "Metro Station": {
    name: "Metro Station",
    icon: <Train className="w-4 h-4" />,
    category: "connectivity",
  },
  Airport: {
    name: "Airport",
    icon: <Plane className="w-4 h-4" />,
    category: "connectivity",
  },

  // Gas/Fuel
  "Gas Pipeline": {
    name: "Gas Pipeline",
    icon: <Flame className="w-4 h-4" />,
    category: "essential",
  },
};

// Helper function to get amenity icon
export const getAmenityIcon = (amenityName: string): React.ReactElement => {
  const config = AMENITIES_CONFIG[amenityName];
  if (config) {
    return config.icon;
  }
  // Default fallback icon
  return <Shield className="w-4 h-4" />;
};

// Helper function to get all amenity names
export const getAllAmenityNames = (): string[] => {
  return Object.keys(AMENITIES_CONFIG);
};

// Helper function to get amenities by category
export const getAmenitiesByCategory = (
  category: AmenityConfig["category"],
): AmenityConfig[] => {
  return Object.values(AMENITIES_CONFIG).filter((a) => a.category === category);
};

// Export amenity names as array for filters
export const AMENITY_OPTIONS = Object.keys(AMENITIES_CONFIG).sort();
