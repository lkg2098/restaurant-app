const express = require("express");
const router = express.Router();

// require user controller
const user_controller = require("../controllers/usersController");
const session_controller = require("../controllers/sessionsController");
const member_controller = require("../controllers/membersController");
const { verifyToken } = require("../middleware/auth");

//user info
router.get("/", verifyToken, user_controller.users_list);

router.post("/verifyUser", user_controller.user_verify_unique);

router.post("/search", verifyToken, user_controller.users_query_username);

router.get("/account", verifyToken, user_controller.user_get_by_id);

router.put("/account", verifyToken, user_controller.user_update);

router.get("/:username", user_controller.user_get_by_username);

router.put(
  "/account/username",
  verifyToken,
  user_controller.user_update_username
);

router.put(
  "/account/password",
  verifyToken,
  user_controller.user_update_password
);

router.delete("/:id", verifyToken, user_controller.user_delete);

module.exports = router;
