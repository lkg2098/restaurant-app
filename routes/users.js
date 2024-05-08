const express = require("express");
const router = express.Router();

// require user controller
const user_controller = require("../controllers/usersController");

router.get("/", user_controller.users_list);

router.get("/:id/account", user_controller.user_get_by_id);

router.get("/:username", user_controller.user_get_by_username);

router.get("/:id/account/update", user_controller.user_update_page);

router.get("/:id/account/update", user_controller.user_update);

router.get("/:id/delete", user_controller.user_delete);

module.exports = router;
