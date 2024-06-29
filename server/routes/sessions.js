const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const { verify_session_member } = require("../middleware/sessionsMiddleware");

const session_controller = require("../controllers/sessionsController");
const member_controller = require("../controllers/membersController");
const restaurant_controller = require("../controllers/restaurantsController");

// list sessions
router.get("/", verifyToken, session_controller.sessions_list_by_user_id);

// search sessions
router.post("/search", verifyToken, session_controller.session_search);

// create session
router.post("/new", verifyToken, session_controller.session_create);

// get session by id
router.get(
  "/:sessionId",
  verifyToken,
  verify_session_member,
  session_controller.session_get_by_id
);

// update session
router.put(
  "/:sessionId",
  verifyToken,
  verify_session_member,
  session_controller.session_update
);

// delete session
router.delete(
  "/:sessionId",
  verifyToken,
  verify_session_member,
  session_controller.session_delete
);

// session members
router.get(
  "/:sessionId/members",
  verifyToken,
  verify_session_member,
  member_controller.session_members_get
);

// add member
router.post(
  "/:sessionId/members/new",
  verifyToken,
  verify_session_member,
  member_controller.session_members_add
);

router.delete(
  "/:sessionId/members/:userId",
  verifyToken,
  verify_session_member,
  member_controller.session_members_delete
);

// session restaurants
router.get(
  "/:sessionId/restaurants",
  verifyToken,
  verify_session_member,
  restaurant_controller.restaurants_get_by_session
);

router.post(
  "/:sessionId/restaurants",
  verifyToken,
  verify_session_member,
  restaurant_controller.restaurant_add
);

router.put(
  "/:sessionId/restaurants",
  verifyToken,
  verify_session_member,
  restaurant_controller.restaurant_update
);

router.delete(
  "/:sessionId/restaurants/:placeId",
  verifyToken,
  verify_session_member,
  restaurant_controller.restaurant_delete
);

router.delete(
  "/:sessionId/restaurants",
  verifyToken,
  verify_session_member,
  restaurant_controller.clear_session_restaurants
);

module.exports = router;
