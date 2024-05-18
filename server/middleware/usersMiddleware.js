const bcrypt = require("bcrypt");

const user_model = require("../models/users");

exports.hash_password = async (password) => {
  return await bcrypt.hash(password, 8);
};

exports.verify_user = async (username, password) => {
  let user = await user_model.get_user_by_username(username);
  if (!user) {
    return { error: "Invalid username" };
  }

  let authenticated = await bcrypt
    .compare(password, user.password)
    .catch((err) => {
      return { error: err };
    });
  if (authenticated) {
    return { message: "Login successful" };
  } else if (authenticated.error) {
    return { error: authenticated.error };
  } else {
    return { error: "Incorrect password" };
  }
};
