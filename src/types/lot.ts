export interface Lot {
  id: string;
  date: string;
  name: string;
  tagline: string;
  location: {
    address?: string;
    city: string;
    county: string;
    state: string;
    zip?: string;
    coordinates: { lat: number; lng: number };
  };
  price: number;
  acreage: number;
  dimensions?: string;
  apn?: string;
  features: string[];
  description: string;
  details: {
    roadConditions?: string;
    utilities?: string;
    water?: string;
    sewer?: string;
    zoning?: string;
    annualTaxes?: number;
    terrain?: string;
    subdivision?: string;
    restrictions?: string;
  };
  media: {
    video?: string;
    poster: string;
    photos: { url: string; alt: string; caption?: string }[];
  };
  contact: {
    phone?: string;
    email: string;
    listingUrl?: string;
  };
}
