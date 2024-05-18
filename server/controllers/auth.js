const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user_model = require("../models/users");

exports.register = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  let user = await user_model.get_user_by_username(username);
  if (user) {
    res.status(401).send({ error: "Invalid username" });
  } else {
    const passwordHash = bcrypt.hash(password, 8);
    let userId = await user_model
      .create_user(username, passwordHash)
      .catch((err) => res.status(500).send({ error: err }));
    let accessToken = jwt.sign(
      { user_id: userId, username: username },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    let refreshToken = jwt.sign(
      { username: username },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "10d",
      }
    );
    res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  }
});
