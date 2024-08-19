const express = require("express");
const router = express.Router();
const pool = require("../pool");
const bcrypt = require("bcrypt");

// require user controller
const user_controller = require("../controllers/usersController");
const auth = require("../controllers/auth");
const { verifyToken, refreshToken } = require("../middleware/auth");

router.get("/", verifyToken, auth.user_is_logged_in);

router.get("/signup", user_controller.user_register_page);

router.post("/signup", auth.register);

router.get("/verifyPhone", auth.get_verification_code);

router.get("/login", user_controller.user_login_page);

router.post("/login", auth.login);

router.post("/refresh", refreshToken);

module.exports = router;
