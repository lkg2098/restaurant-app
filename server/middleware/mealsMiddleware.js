import asyncHandler from "express-async-handler";
import * as member_model from "../models/members.js";
import * as meal_model from "../models/meals.js";

export const verify_meal_member = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    const mealId = req.params.mealId;
    const member = await member_model
      .get_valid_meal_member(mealId, req.decoded.user_id)
      .catch((err) => res.status(500).json({ error: err }));

    if (member) {
      req.decoded = {
        ...req.decoded,
        role: member.role,
        member_id: member.member_id,
      };
      next();
    } else {
      console.log("Not authorized, user not in meal");
      return res
        .status(401)
        .json({ error: "Not authorized, user not in meal" });
    }
  } else {
    console.log("Not authorized");
    return res.status(401).json({ error: "Not authorized" });
  }
});

export const parse_meal_body = (req) => {
  return {
    meal_name: req.body.meal_name,
    scheduled_at: req.body.scheduled_at,
    location_id: req.body.location_id,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    radius: req.body.radius,
    budget: req.body.budget,
    chosen_restaurant: req.body.chosen_restaurant,
    liked: req.body.liked,
  };
};

export const check_meal_round = asyncHandler(async (req, res, next) => {
  let updated = await meal_model.meal_check_round(req.params.mealId);
  res.status(200).json({ meal_round_updated: false });
});
