const asyncHandler = require("express-async-handler");
const user_model = require("../models/users");
const { generate_auth_tokens } = require("./auth");
const bcrypt = require("bcrypt");

// displays user registrations page
exports.user_register_page = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .json({ message: "Not implemented: user registration GET page" });
});

exports.verifyCredentials = async (username, phone) => {
  try {
    let existingUsername = await user_model.get_user_by_username(username);
    let existingPhoneNumber = await user_model.check_existing_phone(phone);
    return {
      usernameExists: Boolean(existingUsername),
      phoneNumberExists: Boolean(existingPhoneNumber),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};
exports.user_verify_unique = asyncHandler(async (req, res, next) => {
  let { username, phoneNumber, password } = req.body.loginInfo;
  console.log(req.body.loginInfo);
  let { usernameExists, phoneNumberExists } = await this.verifyCredentials(
    username,
    phoneNumber
  );
  if (!usernameExists && !phoneNumberExists) {
    let passwordHash = await bcrypt.hash(password, 8);
    res.status(200).json({
      message: "Verified username and phone number!",
      loginInfo: { username, phoneNumber, password: passwordHash },
    });
  } else {
    res.status(401).json({
      usernameExists,
      phoneNumberExists,
    });
  }
});

// displays update user information page
exports.user_update_page = asyncHandler(async (req, res, next) => {
  res.json("Not implemented: user update GET page");
});

// update user information
exports.user_update_username = asyncHandler(async (req, res, next) => {
  if (req.decoded && req.decoded.user_id == req.params.id) {
    let { newUsername } = req.body;
    if (!newUsername || req.decoded.username == newUsername) {
      res.status(401).json({ error: "Invalid new username" });
    } else {
      let existingUser = await user_model.get_user_by_username(newUsername);

      if (!existingUser) {
        let update = await user_model
          .update_username(req.decoded.user_id, newUsername)
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
          });

        let accessTokens = generate_auth_tokens(
          req.decoded.user_id,
          newUsername
        );

        res
          .status(200)
          .json({ ...accessTokens, message: "Username updated successfully" });
      } else {
        res.status(401).json({ error: "Username taken" });
      }
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

exports.user_update_password = asyncHandler(async (req, res, next) => {
  if (req.decoded && req.decoded.user_id == req.params.id) {
    let { newPassword } = req.body;
    if (!newPassword) {
      res.status(401).json({ error: "Invalid new password" });
    } else {
      let passwordHash = await bcrypt.hash(newPassword, 8);
      await user_model
        .update_password(req.params.id, passwordHash)
        .catch((err) => {
          res.status(500).json({ error: err });
        });
      res.status(200).json();
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

// get user by id (for account info page)
exports.user_get_by_id = asyncHandler(async (req, res, next) => {
  if (req.decoded && req.decoded.user_id) {
    let user = await user_model.get_user_by_id(req.decoded.user_id);

    if (user) {
      res.status(200).json({ user: user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});

// get user by username (for searching and displaying user page)
exports.user_get_by_username = asyncHandler(async (req, res, next) => {
  let user = await user_model.get_user_by_username(req.params.username);
  if (user) {
    res.status(200).json({ user: user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// display login page
exports.user_login_page = asyncHandler(async (req, res, next) => {
  res.json("Not implemented: user login GET page");
});

// list users
exports.users_list = asyncHandler(async (req, res, next) => {
  let allUsers = user_model.list_users();
  allUsers.then((users) => {
    res.status(200).json({ users: users });
  });
});

// query users by username autocomplete
exports.users_query_username = asyncHandler(async (req, res, next) => {
  let queryTerm = req.body.queryTerm;
  let users = await user_model.search_users(queryTerm).catch((err) => {
    res.status(401).json({ message: "Something went wrong" });
  });
  res.status(200).json({ users: users });
});

// delete user
exports.user_delete = asyncHandler(async (req, res, next) => {
  if (req.decoded && req.decoded.user_id == req.params.id) {
    let deleted = await user_model.delete_user(req.params.id).catch((err) => {
      res.status(500).json({ error: err });
    });
    res.status(200).json({ message: "Successfully deleted" });
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});
