export type DietaryRestriction =
  | "Vegetarian"
  | "Vegan"
  | "Dairy Free"
  | "Nut Free"
  | "Gluten Free";

export type Meal = {
  name: string;
  date: Date;
  budget: Array<number>;
  distance: number;
  rating: number;
  location: Array<number>;
  diets: Array<DietaryRestriction>;
};
