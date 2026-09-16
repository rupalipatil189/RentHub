export interface Apartmentdata {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  furnished: string;
  amenities?: string[];
  images: string[];
  ownerId: string;
  ownerName: string;
  availableFrom: string;
}