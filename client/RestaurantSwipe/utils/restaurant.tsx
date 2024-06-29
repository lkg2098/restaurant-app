export default class Restaurant {
  id: string;
  score: number | null;
  disliked: boolean;
  seenByUser: boolean;
  name?: string;
  address?: string;
  location?: { latitude: string; longitude: string };
  rating?: number | null;
  priceLevel?: string;
  rating_count?: number;
  hours?: Array<string>;
  photos?: Array<string>;
  types?: Array<string>;
  accessibilityOptions?: any;
  website?: string;

  constructor(
    id: string,
    score: number | null,
    disliked: boolean,
    seenByUser: boolean,
    name?: string,
    address?: string,
    location?: { latitude: string; longitude: string },
    rating?: number,
    priceLevel?: string,
    rating_count?: number,
    hours?: Array<string>,
    photos?: Array<string>,
    types?: Array<string>,
    accessibilityOptions?: any,
    website?: string
  ) {
    this.id = id;
    this.score = score || null;
    this.disliked = disliked;
    this.seenByUser = seenByUser;
    this.name = name;
    this.address = address;
    this.location = location;
    this.rating = rating;
    this.priceLevel = priceLevel;
    this.rating_count = rating_count;
    this.hours = hours;
    this.photos = photos;
    this.types = types;
    this.accessibilityOptions = accessibilityOptions;
    this.website = website;
  }
}
