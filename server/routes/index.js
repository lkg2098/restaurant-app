const express = require("express");
const router = express.Router();

// require user controller
const user_controller = require("../controllers/usersController");
const auth = require("../controllers/auth");
const { verifyToken, refreshToken } = require("../middleware/auth");

router.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

router.get("/signup", user_controller.user_register_page);

router.post("/signup", auth.register);

router.get("/login", user_controller.user_login_page);

router.post("/login", auth.login);

router.post("/refresh", refreshToken);

module.exports = router;
