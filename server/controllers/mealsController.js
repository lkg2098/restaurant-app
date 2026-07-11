import asyncHandler from "express-async-handler";
import * as meal_model from "../models/meals.js";
import * as member_model from "../models/members.js";
import * as user_model from "../models/users.js";
import * as restaurant_model from "../models/restaurants.js";
import { parse_meal_body } from "../middleware/mealsMiddleware.js";
import User from "../models/users.js";
import Meal from "../models/meals.js";
import { Op } from "sequelize";
import moment from "moment";

export const meals_list_by_user_id = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    const { time } = req.query;
    const { user_id } = req.decoded;

    try {
      const user = await User.findByPk(user_id);
      let mealFilters = {};

      if (time == "past") {
        mealFilters = {
          where: { scheduled_at: { [Op.lt]: moment().toDate() } },
        };
      } else if (time == "future") {
        mealFilters = {
          where: { scheduled_at: { [Op.gte]: moment().toDate() } },
        };
      } else if (time) {
        res.status(401).json({ error: "Invalid time specified" });
      }

      const meals = await user
        .getMeals(mealFilters)
        .catch((err) => console.log(err));

      res.status(200).json({ meals });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

export const meal_search = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    const meals = await meal_model.meals_search(
      req.body.queryTerm,
      req.decoded.user_id,
    );
    // const users = await meal_model.meal_members_search(
    //   req.body.queryTerm,
    //   req.decoded.user_id
    // );

    res.status(200).json({});
  }
});

export const meal_create = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    const adminId = req.decoded.user_id;

    try {
      const {
        meal_name,
        meal_photo,
        scheduled_at,
        location_id,
        location_coords,
        radius,
        budget,
      } = parse_meal_body(req);
      //create meal
      let meal = await Meal.create({
        meal_name,
        meal_photo,
        scheduled_at,
        location_id,
        location_coords,
        radius,
        budget,
      });

      if (!meal) {
        res.status(500).json({ error: "Could not create meal" });
      }

      // add admin user
      await Guest.create({ meal_id: meal.id, user_id: req.decoded.user_id });

      if (meal) {
        res.status(200).json({ meal_id: meal });
      } else {
        res
          .status(401)
          .json({ error: "Insufficient data. Could not create meal" });
      }
    } catch (err) {
      res.status(500).json({ error: `Could not create meal: ${err}` });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

export const meal_get_by_id = asyncHandler(async (req, res, next) => {
  //verifies membership
  const meal = await meal_model
    .meal_get_by_id(req.params.mealId, req.decoded.member_id)
    .catch((err) => {
      console.log(err);
    });
  console.log(meal);
  res.status(200).json({ meal: meal, userRole: req.decoded.role });
});

export const meal_delete = asyncHandler(async (req, res, next) => {
  //checks if admin
  if (req.decoded.role && req.decoded.role == "admin") {
    try {
      const meal = await Meal.findByPk(req.params.mealId);
      if (!meal) {
        throw new Error(`Meal ${req.params.mealId} does not exist`);
      } else {
        await meal.destroy();
      }
      res.status(200).json();
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

export const meal_update = asyncHandler(async (req, res, next) => {
  // verifies membership

  const meal = await Meal.findByPk(req.params.mealId);

  if (req.decoded.role && req.decoded.role == "admin") {
    const updatedMeal = await meal.update({ ...req.body });
    if (updatedMeal) {
      res.status(200).json(updatedMeal);
    } else {
      res.status(401).json({ error: "Could not update meal" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

export const meal_update_chosen_restaurant = asyncHandler(async (req, res) => {
  const meal = await Meal.findByPk(req.params.mealId);
  if (!meal) {
    res.status(404).json({ error: "Meal does not exist" });
  } else {
    await meal.update({ ...req.body });

    res.status(200).json();
  }
});

export const meal_check_round = asyncHandler(async (req, res, next) => {
  const meal = await Meal.findByPk(req.params.mealId);

  if (meal.round == 0) {
    let unseenResCount = await meal.getUnseenRestaurantCountByGuestId(
      req.decoded.guest_id,
    );
    if (unseenResCount == 0) {
      meal.round = await meal.update({ round: meal.round + 1 });
    }
    res.status(200).json({ meal_round: meal.round });
  } else {
    let unrankedMembers = await meal_model.get_remaining_unranked_members(
      req.params.mealId,
    );
    if (unrankedMembers.length > 0) {
      res.status(200).json({
        remainingMembers: unrankedMembers.map((item) => item.member_id),
      });
    } else {
      let chosen_restaurant = await meal_model.choose_best_ranked(
        req.params.mealId,
      );
      res.status(200).json({ chosen_restaurant });
    }
  }
});

export const meal_update_round = asyncHandler(async (req, res, next) => {
  const meal = await Meal.findByPk(req.params.mealId);
  await meal.update({ round: meal.round + 1 });
  res.status(200).json({});
});
