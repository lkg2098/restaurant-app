const express = require("express");
const router = express.Router();

// require user controller
const user_controller = require("../controllers/usersController");
const session_controller = require("../controllers/sessionsController");
const member_controller = require("../controllers/membersController");

//user info
router.get("/", user_controller.users_list);

router.post("/search", user_controller.users_query_username);

router.get("/:id/account", user_controller.user_get_by_id);

router.get("/:username", user_controller.user_get_by_username);

router.put("/:id/username", user_controller.user_update_username);

router.put("/:id/password", user_controller.user_update_password);

router.delete("/:id", user_controller.user_delete);

//session info
router.get("/:id/sessions", session_controller.sessions_list_by_user_id);

router.post("/:id/sessions/new", session_controller.session_create);

router.get("/:id/sessions/:sessionId", session_controller.session_get_by_id);

router.put("/:id/sessions/:sessionId", session_controller.session_update);

router.delete("/:id/sessions/delete", session_controller.session_delete);

// session members
router.get(
  "/:id/sessions/:sessionId/members",
  member_controller.session_members_get
);

router.post(
  "/:id/sessions/:sessionId/members/new",
  member_controller.session_members_add
);

router.delete(
  "/:id/sessions/:sessionId/members/:memberId",
  member_controller.session_members_delete
);

module.exports = router;
