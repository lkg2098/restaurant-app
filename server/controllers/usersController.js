const asyncHandler = require("express-async-handler");
const user_model = require("../models/users");
const user_middleware = require("../middleware/usersMiddleware");

// displays user registrations page
exports.user_register_page = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: user registration GET page");
});

// creates a new user in the DB
exports.user_register = asyncHandler(async (req, res, next) => {
  console.log("here");
  let newUser = user_middleware.register_user("newishUser1", "passwordToHash");

  res.send(`new user`);
});

// displays update user information page
exports.user_update_page = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: user update GET page");
});

// update user information
exports.user_update = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: user update POST");
});

// get user by id (for account info page)
exports.user_get_by_id = asyncHandler(async (req, res, next) => {
  let user = await user_model.get_user_by_id(req.params.id);

  if (user) {
    res.send(JSON.stringify(user));
  } else {
    res.status(404).send("404: user not found");
  }
});

// get user by username (for searching and displaying user page)
exports.user_get_by_username = asyncHandler(async (req, res, next) => {
  let user = await user_model.get_user_by_username(req.params.username);
  if (user) {
    res.send(JSON.stringify(user));
  } else {
    res.status(404).send("404: user not found");
  }
});

// display login page
exports.user_login_page = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: user login GET page");
});

// verify user login info
exports.user_login = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: user login GET");
});

// list users
exports.users_list = asyncHandler(async (req, res, next) => {
  let allUsers = user_model.list_users();
  allUsers.then((users) => {
    console.log(users);
    res.send(JSON.stringify(users));
  });
});

// delete user
exports.user_delete = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: delete user");
});
