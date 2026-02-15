export interface Property {
    id: number;
    title: string;
    slug?: string; // For SEO URLs
    location: string;
    city: string;
    state?: string;
    price: number;
    area: number; // Sq.Ft
    type: string;
    image: string | string[];
    label?: string; // Custom label from JSON
    description: string;
    amenities?: string[];
    status: string;
    featured: boolean;
    createdAt: string;
    // Optional fields for the enhanced design
    imageCount?: number;
    sellerName?: string;
    sellerType?: string;
    contact?: string;
    // New fields for advanced filtering
    facing?: string;
    roadWidth?: number | string;
    possession?: string;
    isGated?: boolean;
    isCornerPlot?: boolean;
    ownership?: string;
    roadType?: string;
    hasRoadHit?: boolean;
    isRegularShape?: boolean;
    hasTJunction?: boolean;
    isVastuCompliance?: boolean;
}
