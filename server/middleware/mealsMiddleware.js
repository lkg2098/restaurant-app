const asyncHandler = require("express-async-handler");
const member_model = require("../models/members");

exports.verify_meal_member = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    const mealId = req.params.mealId;
    const member = await member_model
      .get_valid_meal_member(mealId, req.decoded.user_id)
      .catch((err) => res.status(500).json({ error: err }));

    if (member) {
      req.decoded = { ...req.decoded, role: member.role };
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

exports.parse_meal_body = (req) => {
  return {
    meal_name: req.body.meal_name,
    meal_photo: req.body.meal_photo,
    created_at: new Date().toISOString(),
    scheduled_at: req.body.scheduled_at,
    address: req.body.address,
    location_coords: req.body.location_coords,
    radius: req.body.radius,
    budget: req.body.budget,
    restaurant: req.body.restaurant,
    liked: req.body.liked,
  };
};
