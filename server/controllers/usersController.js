const asyncHandler = require("express-async-handler");
const user_model = require("../models/users");
const user_middleware = require("../middleware/usersMiddleware");
const bcrypt = require("bcrypt");

// displays user registrations page
exports.user_register_page = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .json({ message: "Not implemented: user registration GET page" });
});

// creates a new user in the DB
exports.user_register = asyncHandler(async (req, res, next) => {
  let { username, password } = req.body;
  let existingUser = await user_model.get_user_by_username(username);

  if (!existingUser) {
    let hashedPassword = await user_middleware.hash_password(password);
    await user_model.create_user(username, hashedPassword).catch((error) => {
      console.log(error);
      res.status(500).send({ error: error });
    });

    res.status(200).json({ message: "Registered successfully" });
  } else {
    res.status(401).send({ error: "This username is taken" });
  }
});

// displays update user information page
exports.user_update_page = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: user update GET page");
});

// update user information
exports.user_update_username = asyncHandler(async (req, res, next) => {
  let { username, password, newUsername } = req.body;
  let authenticated = await user_middleware.verify_user(username, password);
  if (authenticated.error) {
    if (
      authenticated.error == "Invalid username" ||
      authenticated.error == "Incorrect password"
    ) {
      res.status(401).send({ error: "Could not authenticate user" });
    } else {
      res.status(500).send(authenticated);
    }
  } else {
    let existingUser = await user_model.get_user_by_username(newUsername);
    if (!existingUser) {
      let update = await user_model
        .update_username(req.params.id, newUsername)
        .catch((err) => {
          res.status(500).send({ error: err });
        });
      res.status(200).send();
    }
  }
});

exports.user_update_password = asyncHandler(async (req, res, next) => {
  let { username, password, newPassword } = req.body;
  let authenticated = await user_middleware.verify_user(username, password);

  if (authenticated.error) {
    if (
      authenticated.error == "Invalid username" ||
      authenticated.error == "Incorrect password"
    ) {
      res.status(401).send({ error: "Could not authenticate user" });
    } else {
      res.status(500).send(authenticated);
    }
  } else {
    let passwordHash = await user_middleware.hash_password(newPassword);

    let update = await user_model
      .update_password(req.params.id, passwordHash)
      .catch((err) => {
        res.status(500).send({ error: err });
      });
    res.status(200).send();
  }
});
// get user by id (for account info page)
exports.user_get_by_id = asyncHandler(async (req, res, next) => {
  let user = await user_model.get_user_by_id(req.params.id);

  if (user) {
    res.status(200).json({ user: user });
  } else {
    res.status(404).json({ error: "user not found" });
  }
});

// get user by username (for searching and displaying user page)
exports.user_get_by_username = asyncHandler(async (req, res, next) => {
  let user = await user_model.get_user_by_username(req.params.username);
  if (user) {
    res.status(200).json({ user: user });
  } else {
    res.status(404).json({ error: "user not found" });
  }
});

// display login page
exports.user_login_page = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: user login GET page");
});

// verify user login info
exports.user_login = asyncHandler(async (req, res, next) => {
  let { username, password } = req.body;

  let authenticated = await user_middleware.verify_user(username, password);

  if (authenticated.error) {
    if (
      authenticated.error == "Incorrect password" ||
      authenticated.error == "Invalid username"
    ) {
      res.status(401).send(authenticated);
    } else {
      res.status(500).send(authenticated);
    }
  } else {
    res.status(200).json({ message: "Login successful" });
  }
});

// list users
exports.users_list = asyncHandler(async (req, res, next) => {
  let allUsers = user_model.list_users();
  allUsers.then((users) => {
    console.log(users);
    res.status(200).json({ users: users });
  });
});

// query users by username autocomplete
exports.users_query_username = asyncHandler(async (req, res, next) => {
  let queryTerm = req.body.queryTerm;
  let usernames = await user_model.search_usernames(queryTerm).catch((err) => {
    res.status(401).json({ message: "Something went wrong" });
  });
  res.status(200).json({ users: usernames });
});

// delete user
exports.user_delete = asyncHandler(async (req, res, next) => {
  let deleted = await user_model.delete_user(req.params.id).catch((err) => {
    res.status(500).send({ error: err });
  });
  res.status(200).json({ message: "Successfully deleted" });
});
