const asyncHandler = require("express-async-handler");
const session_model = require("../models/sessions");
const member_model = require("../models/members");
const user_model = require("../models/users");

exports.sessions_list_by_user_id = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: GET all sessions for user");
});

exports.session_create = asyncHandler(async (req, res, next) => {
  const adminId = req.params.id;
  const adminUser = await user_model
    .get_user_by_id(adminId)
    .catch((err) =>
      res.status(500).send({ error: "Server Internal Error: " + err })
    );
  if (adminUser) {
    const { latitude, longitude, guestUserIds } = req.body;

    //create session
    let sessionId = await session_model
      .session_create(latitude, longitude)
      .catch((err) =>
        res
          .status(500)
          .send({ error: "Could not create session. Error: " + err })
      );
    console.log(sessionId);

    await member_model
      .member_create(sessionId, req.params.id, "admin")
      .catch((err) =>
        res
          .status(500)
          .send({ error: "Could not add session member. Error: " + err })
      );
    if (guestUserIds.length) {
      await member_model
        .member_create_many(sessionId, guestUserIds)
        .catch((err) =>
          res
            .status(500)
            .send({ error: "Could not add session member. Error: " + err })
        );
    }
    res.status(200).json({ sessionId: sessionId });
  } else {
    res.status(404).send({ error: "Admin user not found" });
  }
});

exports.session_get_by_id = asyncHandler(async (req, res, next) => {
  //verifies membership
  res.send("Not implemented: GET session by id");
});

exports.session_delete = asyncHandler(async (req, res, next) => {
  //checks if admin
  res.send("Not implemented: DELETE session by id");
});

exports.session_update = asyncHandler(async (req, res, next) => {
  // verifies membership
  res.send("Not implemented: PUT session update");
});
