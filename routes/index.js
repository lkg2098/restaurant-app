const express = require("express");
const router = express.Router();

// require user controller
const user_controller = require("../controllers/usersController");

router.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

router.get("/signup", user_controller.user_register);

// router.post("/signup", user_controller.user_register);

router.get("/login", user_controller.user_login_page);

router.use("/login", user_controller.user_login);

module.exports = router;
