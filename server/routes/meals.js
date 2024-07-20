const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const { verify_meal_member } = require("../middleware/mealsMiddleware");
const {
  prevent_duplicate_preferences,
} = require("../middleware/preferencesMiddleware");

const meal_controller = require("../controllers/mealsController");
const member_controller = require("../controllers/membersController");
const restaurant_controller = require("../controllers/restaurantsController");
const preference_controller = require("../controllers/preferencesController");

// list meals
router.get("/", verifyToken, meal_controller.meals_list_by_user_id);

// search meals
router.post("/search", verifyToken, meal_controller.meal_search);

// create meal
router.post("/new", verifyToken, meal_controller.meal_create);

// get meal by id
router.get(
  "/:mealId",
  verifyToken,
  verify_meal_member,
  meal_controller.meal_get_by_id
);

// update meal
router.put(
  "/:mealId",
  verifyToken,
  verify_meal_member,
  meal_controller.meal_update
);

// delete meal
router.delete(
  "/:mealId",
  verifyToken,
  verify_meal_member,
  meal_controller.meal_delete
);

// meal members
router.get(
  "/:mealId/members",
  verifyToken,
  verify_meal_member,
  member_controller.meal_members_get
);

// add member
router.post(
  "/:mealId/members/new",
  verifyToken,
  verify_meal_member,
  member_controller.meal_members_add
);

// get member preferences
router.get(
  "/:mealId/preferences",
  verifyToken,
  verify_meal_member,
  preference_controller.get_preferences_for_meal
);

// add or update preferences
router.post(
  "/:mealId/preferences",
  verifyToken,
  verify_meal_member,
  prevent_duplicate_preferences,
  preference_controller.update_preferences
);

router.delete(
  "/:mealId/members/:userId",
  verifyToken,
  verify_meal_member,
  member_controller.meal_members_delete
);

// meal restaurants
router.get(
  "/:mealId/restaurants",
  verifyToken,
  verify_meal_member,
  restaurant_controller.restaurants_get_by_meal
);

router.post(
  "/:mealId/restaurants",
  verifyToken,
  verify_meal_member,
  restaurant_controller.restaurant_add
);

router.put(
  "/:mealId/restaurants",
  verifyToken,
  verify_meal_member,
  restaurant_controller.restaurant_update
);

router.delete(
  "/:mealId/restaurants/:placeId",
  verifyToken,
  verify_meal_member,
  restaurant_controller.restaurant_delete
);

router.delete(
  "/:mealId/restaurants",
  verifyToken,
  verify_meal_member,
  restaurant_controller.clear_meal_restaurants
);

module.exports = router;
