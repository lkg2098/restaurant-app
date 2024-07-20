const asyncHandler = require("express-async-handler");
const preferences_model = require("../models/preferences");

exports.get_preferences_for_meal = asyncHandler(async (req, res, next) => {
  const { mealId } = req.params;
  const { user_id } = req.decoded;
  const { wanted } = req.query;
  let preferences = [];
  if (!wanted) {
    preferences = await preferences_model.get_preferences(mealId, user_id);
    res.status(200).json({ preferences: preferences });
  } else if (wanted === "0") {
    preferences = await preferences_model.get_unwanted_preferences(
      mealId,
      user_id
    );
    res.status(200).json({ preferences: preferences });
  } else if (wanted === "1") {
    preferences = await preferences_model.get_wanted_preferences(
      mealId,
      user_id
    );
    res.status(200).json({ preferences: preferences });
  } else {
    res.status(401).json({ error: "Invalid query value" });
  }
});

exports.update_preferences = asyncHandler(async (req, res, next) => {
  const { mealId } = req.params;
  const { user_id } = req.decoded;
  const { toDelete } = req.body;
  const toAdd = req.toAddCleaned;
  const wanted = req.query.wanted;

  if (toAdd.length || toDelete.length) {
    await preferences_model.update_preferences(
      toAdd,
      toDelete,
      wanted,
      mealId,
      user_id
    );

    res.status(200).json({ message: "Successfully updated preferences" });
  } else {
    res.status(200).json({ message: "Already up to date" });
  }
});
