const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user_model = require("../models/users");
const user_controller = require("./usersController");

exports.user_is_logged_in = (req, res, next) => {
  res.status(200).json({ message: "Successfully logged in!" });
};
exports.generate_auth_tokens = (user_id, username) => {
  let accessToken = jwt.sign(
    { user_id: user_id, username: username },
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

  return { accessToken: accessToken, refreshToken: refreshToken };
};

exports.register = asyncHandler(async (req, res, next) => {
  const { username, password, phoneNumber } = req.body;
  console.log(req.body);
  const { usernameExists, phoneNumberExists } =
    await user_controller.verifyCredentials(username, phoneNumber);
  if (usernameExists) {
    res.status(401).json({ error: "This username is taken" });
  } else if (phoneNumberExists) {
    res.status(401).json({ error: "This phone number is taken" });
  } else {
    let passwordHash = await bcrypt.hash(password, 8);
    let userId = await user_model
      .create_user(username, passwordHash, phoneNumber)
      .catch((err) => res.status(500).json({ error: err }));
    let accessTokens = this.generate_auth_tokens(userId, username);
    res
      .status(200)
      .json({ ...accessTokens, message: "Registered successfully", userId });
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  let user = await user_model
    .get_user_by_username(username)
    .catch((err) => res.status(500).json({ error: err }));

  if (user) {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        if (result) {
          let accessTokens = this.generate_auth_tokens(user.user_id, username);
          res
            .status(200)
            .json({ ...accessTokens, message: "Login successful" });
        } else {
          res.status(401).json({ error: "Incorrect password" });
        }
      }
    });
  } else {
    res.status(401).json({ error: "Invalid username" });
  }
});
