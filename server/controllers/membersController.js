const asyncHandler = require("express-async-handler");
const member_model = require("../models/members");

exports.session_members_get = asyncHandler(async (req, res, next) => {
  let members = await member_model
    .get_session_members(req.params.sessionId)
    .catch((err) => res.status(500).send({ error: err }));
  // console.log(members);
  res.send("Not implemented: LIST all session members");
});

exports.session_members_add = asyncHandler(async (req, res, next) => {
  //checks if admin
  res.send("Not implemented: POST session members");
});

exports.session_members_delete = asyncHandler(async (req, res, next) => {
  //checks if admin or removing self
  res.send("Not implemented: DELETE session members");
});
