const asyncHandler = require("express-async-handler");
const member_model = require("../models/members");

exports.verify_session_member = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    const sessionId = req.params.sessionId;

    const member = await member_model
      .get_valid_session_member(sessionId, req.decoded.user_id)
      .catch((err) => res.status(500).json({ error: err }));
    if (member) {
      req.decoded = { ...req.decoded, role: member.role };
      next();
    } else {
      console.log("Not authorized, user not in session");
      return res
        .status(401)
        .json({ error: "Not authorized, user not in session" });
    }
  } else {
    console.log("Not authorized");
    return res.status(401).json({ error: "Not authorized" });
  }
});

exports.parse_session_body = (req) => {
  return {
    session_name: req.body.session_name,
    session_photo: req.body.session_photo,
    created_at: new Date().toISOString(),
    scheduled_at: req.body.scheduled_at,
    address: req.body.address,
    location_lat: req.body.location_lat,
    location_long: req.body.location_long,
    radius: req.body.radius,
    budget_min: req.body.budget_min,
    budget_max: req.body.budget_max,
    restaurant: req.body.restaurant,
    liked: req.body.liked,
  };
};
