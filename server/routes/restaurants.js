const express = require("express");
const router = express.Router();

const google_controller = require("../controllers/googleController");
const { verifyToken } = require("../middleware/auth");
const { verify_meal_member } = require("../middleware/mealsMiddleware");

router.get("/", google_controller.nearby_search);

router.get("/test", verifyToken, google_controller.sample_google_data);

module.exports = router;
