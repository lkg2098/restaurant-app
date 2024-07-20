const asyncHandler = require("express-async-handler");
const meal_model = require("../models/meals");
const member_model = require("../models/members");
const user_model = require("../models/users");
const { parse_meal_body } = require("../middleware/mealsMiddleware");

exports.meals_list_by_user_id = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    const { time } = req.query;
    console.log(time);
    if (!time) {
      const meals = await meal_model
        .get_meals_by_user_id(req.decoded.user_id)
        .catch((err) => res.status(500).json({ error: err }));
      console.log(meals);
      res.status(200).json({ meals: meals });
    } else if (time == "past") {
      const meals = await meal_model
        .get_past_meals_by_user_id(req.decoded.user_id)
        .catch((err) => res.status(500).json({ error: err }));
      res.status(200).json({ meals: meals });
    } else if (time == "future") {
      const meals = await meal_model
        .get_future_meals_by_user_id(req.decoded.user_id)
        .catch((err) => res.status(500).json({ error: err }));
      res.status(200).json({ meals: meals });
    } else {
      res.status(401).json({ error: "Invalid time specified" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

exports.meal_search = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    const meals = await meal_model.meals_search(
      req.body.queryTerm,
      req.decoded.user_id
    );
    // const users = await meal_model.meal_members_search(
    //   req.body.queryTerm,
    //   req.decoded.user_id
    // );

    // const memberCount = await meal_model.meal_member_count(1);
    res.status(200).json({});
  }
});

exports.meal_create = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    console.log(req.body);
    const adminId = req.decoded.user_id;
    console.log(adminId);
    // verify that admin user exists
    const adminUser = await user_model
      .get_user_by_id(adminId)
      .catch((err) =>
        res.status(500).json({ error: "Server Internal Error: " + err })
      );
    console.log(adminUser);
    if (adminUser) {
      const {
        meal_name,
        meal_photo,
        created_at,
        scheduled_at,
        address,
        location_coords,
        radius,
        budget,
      } = parse_meal_body(req);
      console.log(req.body);
      //create meal
      let meal = await meal_model.meal_create(
        meal_name,
        meal_photo,
        created_at,
        scheduled_at,
        address,
        location_coords,
        radius,
        budget
      );

      // add admin user
      await member_model.member_create(meal.meal_id, adminId, "admin");

      if (meal) {
        res.status(200).json({ meal_id: meal.meal_id });
      } else {
        res
          .status(401)
          .json({ error: "Insufficient data. Could not create meal" });
      }
    } else {
      res.status(404).json({ error: "Admin user not found" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

exports.meal_get_by_id = asyncHandler(async (req, res, next) => {
  //verifies membership
  const meal = await meal_model
    .meal_get_by_id(req.params.mealId)
    .catch((err) => {
      console.log(err);
    });
  console.log(meal);
  res.status(200).json({ meal: meal, userRole: req.decoded.role });
});

exports.meal_delete = asyncHandler(async (req, res, next) => {
  //checks if admin
  if (req.decoded.role && req.decoded.role == "admin") {
    await meal_model.meal_delete(req.params.mealId).catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
    res.status(200).json();
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

exports.meal_update = asyncHandler(async (req, res, next) => {
  // verifies membership
  const meal = parse_meal_body(req);

  if (meal.restaurant) {
    const updatedMeal = await meal_model
      .meal_update_chosen_restaurant(req.params.mealId, meal.restaurant)
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
    if (updatedMeal) {
      res.status(200).json(updatedMeal);
    } else {
      res.status(401).json({ error: "Could not add chosen restaurant" });
    }
  } else if (meal.liked !== undefined) {
    const updatedMeal = await meal_model.meal_update_liked(
      req.params.mealId,
      meal.liked
    );
    if (updatedMeal) {
      res.status(200).json({ liked: updatedMeal.liked == 1 });
    } else {
      res.status(401).json({ error: "Could not update meal" });
    }
  } else {
    if (req.decoded.role && req.decoded.role == "admin") {
      const updatedMeal = await meal_model
        .meal_update_meal(req.params.mealId, meal)
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
      if (updatedMeal) {
        res.status(200).json(updatedMeal);
      } else {
        res.status(401).json({ error: "Could not update meal" });
      }
    } else {
      res.status(401).json({ error: "Not authorized" });
    }
  }
});
