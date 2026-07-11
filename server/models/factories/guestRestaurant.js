import GuestRestaurant from "../guest_restaurants.js";

export async function guestRestaurant({
  guest_id,
  meal_restaurant_id,
  approved,
  score,
  hidden_from_user,
  rank,
  vetoed,
}) {
  return GuestRestaurant.create({
    meal_restaurant_id,
    guest_id,
    approved,
    score,
    hidden_from_user,
    rank,
    vetoed,
  });
}
