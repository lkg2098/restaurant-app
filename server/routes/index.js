const express = require("express");
const router = express.Router();
const pool = require("../pool");
const bcrypt = require("bcrypt");

// require user controller
const user_controller = require("../controllers/usersController");
const auth = require("../controllers/auth");
const { verifyToken, refreshToken } = require("../middleware/auth");

router.get("/", verifyToken, auth.user_is_logged_in);

router.get("/test", async (req, res, next) => {
  let passwords = [
    "password",
    "bf123",
    "password123",
    "t1f3b7",
    "boo",
    "karen",
    "jeanVjean",
  ];
  let hashes = await Promise.all(
    passwords.map(async (p) => await bcrypt.hash(p, 8))
  );
  let response = pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(hashes);
  });
});

router.get("/signup", user_controller.user_register_page);

router.post("/signup", auth.register);

router.get("/verifyPhone", auth.get_verification_code);

router.get("/login", user_controller.user_login_page);

router.post("/login", auth.login);

router.post("/refresh", refreshToken);

module.exports = router;
