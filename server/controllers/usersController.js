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
    let existingUsername = false;
    let existingPhoneNumber = false;

    if (username) {
      existingUsername = await user_model.get_user_by_username(username);
    }

    if (phone) {
      existingPhoneNumber = await user_model.check_existing_phone(phone);
    }

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
  let { username, phoneNumber } = req.body;

  let { usernameExists, phoneNumberExists } = await this.verifyCredentials(
    username,
    phoneNumber
  );
  if (!usernameExists && !phoneNumberExists) {
    res.status(200).json({
      message: "Verified username and phone number!",
      loginInfo: { username, phoneNumber },
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
  let { newUsername } = req.body;
  if (!newUsername || req.decoded.username == newUsername) {
    res.status(401).json({ error: "Invalid new username" });
  } else {
    let existingUser = await user_model.get_user_by_username(newUsername);

    if (!existingUser) {
      let update = await user_model.update_username(
        req.decoded.user_id,
        newUsername
      );

      let accessTokens = generate_auth_tokens(req.decoded.user_id, newUsername);

      res
        .status(200)
        .json({ ...accessTokens, message: "Username updated successfully" });
    } else {
      res.status(401).json({ error: "Username taken" });
    }
  }
});

exports.user_update_password = asyncHandler(async (req, res, next) => {
  let { newPassword } = req.body;
  if (!newPassword) {
    res.status(401).json({ error: "Invalid new password" });
  } else {
    let passwordHash = await bcrypt.hash(newPassword, 8);
    await user_model.update_password(req.params.id, passwordHash);

    res.status(200).json();
  }
});

exports.user_update = asyncHandler(async (req, res, next) => {
  const { name, phone_number, profile_image, push_token } = req.body;

  if (name) {
    await user_model.update_name(req.decoded.user_id, name);
    res.status(200).json({ message: "Successfully updated" });
  } else if (phone_number) {
    await user_model.update_phone_number(req.decoded.user_id, phone_number);
    res.status(200).json({ message: "Successfully updated" });
  } else if (profile_image) {
    await user_model.update_profile_image(req.decoded.user_id, profile_image);
    res.status(200).json({ message: "Successfully updated" });
  } else if (push_token) {
    await user_model.update_push_token(req.decoded.user_id, push_token);
    res.status(200).json({ message: "Successfully updated" });
  } else {
    res.status(401).json({ error: "Invalid values" });
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
  let users = await user_model.list_users();
  res.status(200).json({ users: users });
});

// query users by username autocomplete
exports.users_query_username = asyncHandler(async (req, res, next) => {
  let queryTerm = req.body.queryTerm;
  let users = await user_model
    .search_users(queryTerm, req.decoded.username)
    .catch((err) => {
      res.status(401).json({ message: "Something went wrong" });
    });
  res.status(200).json({ users: users });
});

// delete user
exports.user_delete = asyncHandler(async (req, res, next) => {
  if (req.decoded) {
    let deleted = await user_model
      .delete_user(req.decoded.user_id)
      .catch((err) => {
        res.status(500).json({ error: err });
      });
    res.status(200).json({ message: "Successfully deleted" });
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
});
