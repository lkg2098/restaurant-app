const bcrypt = require("bcrypt");

const user_model = require("../models/users");

exports.register_user = async (username, password) => {
  let existingUser = await user_model.get_user_by_username(username);
  if (!existingUser) {
    console.log("here");
    let hashedPassword = await bcrypt.hash(password, 8);
    await user_model.create_user(username, hashedPassword);
    return { username: username, password: hashedPassword };
  }
  return "this username is taken";
};
