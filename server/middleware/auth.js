const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const user_model = require("../models/users");

exports.verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    let tokenArray = token.split(" ");

    jwt.verify(tokenArray[1], process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Not authorized" });
      } else {
        req.decoded = decodedToken;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ error: "Not authorized, token not available" });
  }
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.headers.authorization;
  console.log("refreshing token...");
  if (refreshToken) {
    let tokenArray = refreshToken.split(" ");

    jwt.verify(
      tokenArray[1],
      process.env.REFRESH_SECRET,
      async (err, decodedToken) => {
        if (err) {
          // wrong refresh token
          res.status(401).json({ error: "Not authorized" });
        } else {
          const user = await user_model
            .get_user_by_username(decodedToken.username)
            .catch((err) => res.status(500).json({ error: err }));
          console.log(user);
          if (user) {
            const newAccessToken = jwt.sign(
              { user_id: user.user_id, username: decodedToken.username },
              process.env.JWT_SECRET,
              { expiresIn: "10m" }
            );
            res.status(200).json({ accessToken: newAccessToken });
          } else {
            res.status(401).json({ error: "User no longer exists" });
          }
        }
      }
    );
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});
