const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const user_model = require("../models/users");

exports.verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).send({ error: "Not authorized" });
      } else {
        res.status(200).send({
          message: `Authorized user ${decodedToken.user_id} - ${decodedToken.username}`,
        });
      }
    });
  } else {
    res.status(401).send({ error: "Not authorized, token not available" });
  }
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.headers.authorization;

  if (refreshToken) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET,
      async (err, decodedToken) => {
        if (err) {
          // wrong refresh token
          res.status(401).send({ error: "Not authorized" });
        } else {
          const user = await user_model
            .get_user_by_username(decodedToken.username)
            .catch((err) => res.status(500).send({ error: err }));
          console.log(user);
          const newAccessToken = jwt.sign(
            { user_id: user.user_id, username: decodedToken.username },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
          );
          res.status(200).json({ accessToken: newAccessToken });
        }
      }
    );
  } else {
    res.status(401).send({ error: "Not authorized" });
  }
});
