import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export enum WeightUnits {
  LB = "lb",
  G = "g",
  OZ = "oz",
  KG = "kg",
}
export enum ProductStatus {
  ACTIVE = "Active",
  DRAFT = "Draft",
}
export const weightUnitsArray = ["lb", "g", "oz", "kg"];

export const productStatuses = ["Active", "Draft"];

export const productCategories = [
  { label: "--", value: "" },
  { label: "Animals & Pet Supplies", value: "animals_pet_supplies" },
  { label: "Apparel & Accessories", value: "apparel_accessories" },
  { label: "Arts & Entertainment", value: "arts_entertainment" },
  { label: "Automotive", value: "automotive" },
  { label: "Baby & Toddler", value: "baby_toddler" },
  { label: "Beauty & Personal Care", value: "beauty_personal_care" },
  { label: "Books & Literature", value: "books_literature" },
  { label: "Business & Industrial", value: "business_industrial" },
  { label: "Computers & Electronics", value: "computers_electronics" },
  { label: "Education", value: "education" },
  { label: "Finance & Banking", value: "finance_banking" },
  { label: "Food & Drink", value: "food_drink" },
  { label: "Games & Toys", value: "games_toys" },
  { label: "Gifts & Occasions", value: "gifts_occasions" },
  { label: "Health & Fitness", value: "health_fitness" },
  { label: "Home & Garden", value: "home_garden" },
  { label: "Internet & Telecom", value: "internet_telecom" },
  { label: "Jobs & Careers", value: "jobs_careers" },
  { label: "Law & Government", value: "law_government" },
  { label: "News & Media", value: "news_media" },
  { label: "Online Communities", value: "online_communities" },
  { label: "People & Society", value: "people_society" },
  { label: "Pets & Animals", value: "pets_animals" },
  { label: "Real Estate", value: "real_estate" },
  { label: "Reference", value: "reference" },
  { label: "Science", value: "science" },
  { label: "Shopping", value: "shopping" },
  { label: "Sports & Recreation", value: "sports_recreation" },
  { label: "Travel", value: "travel" },
  { label: "Beauty", value: "beauty" },
  { label: "Fashion", value: "fashion" },
  { label: "Design", value: "design" },
  { label: "Art", value: "art" },
  { label: "Crafts", value: "crafts" },
  { label: "Photography", value: "photography" },
  { label: "Music", value: "music" },
  { label: "Movies", value: "movies" },
  { label: "TV Shows", value: "tv_shows" },
  { label: "Performing Arts", value: "performing_arts" },
  { label: "Events", value: "events" },
  { label: "Fine Arts", value: "fine_arts" },
  { label: "Dance", value: "dance" },
  { label: "Comics", value: "comics" },
  { label: "Theater", value: "theater" },
  { label: "Architecture", value: "architecture" },
  { label: "History", value: "history" },
  { label: "Philosophy", value: "philosophy" },
  { label: "Religion", value: "religion" },
  { label: "Writing", value: "writing" },
];

export const truncateText = (str: string) => {
  if (str.length < 25) return str;
  return str.substring(0, 25) + "...";
};
