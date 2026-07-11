import GuestPreference from "../../../models/guest_preferences.js";
import GuestRestaurant from "../../../models/guest_restaurants.js";
import Guest from "../../../models/guests.js";
import MealRestaurant from "../../../models/meal_restaurants.js";
import Meal from "../../../models/meals.js";
import Restaurant from "../../../models/restaurants.js";
import User from "../../../models/users.js";

export default async function truncate() {
  await GuestRestaurant.destroy({ truncate: { cascade: true } });
  await MealRestaurant.destroy({ truncate: { cascade: true } });
  await Restaurant.destroy({ truncate: { cascade: true } });
  await GuestPreference.destroy({ truncate: { cascade: true } });
  await Guest.destroy({ truncate: { cascade: true } });
  await Meal.destroy({ truncate: { cascade: true } });
  await User.destroy({ truncate: { cascade: true } });
}
