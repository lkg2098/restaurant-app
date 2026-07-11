import MealRestaurant from "../meal_restaurants.js";
import { restaurant as restaurantFactory } from "./restaurant.js";

export async function mealRestaurant({ meal_id }) {
  const restaurant = await restaurantFactory();
  return MealRestaurant.create({ meal_id, restaurant_id: restaurant.id });
}
