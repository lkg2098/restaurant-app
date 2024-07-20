const asyncHandler = require("express-async-handler");
const preference_model = require("../models/preferences");

exports.prevent_duplicate_preferences = asyncHandler(async (req, res, next) => {
  const { mealId } = req.params;
  const { user_id } = req.decoded;
  const { toAdd } = req.body;
  const wanted = req.query.wanted;

  if (!wanted) {
    res.status(401).json({ error: "Missing query parameter" });
  } else if (wanted === "1") {
    if (toAdd.length) {
      let oldPreferences = await preference_model.get_wanted_preferences(
        mealId,
        user_id
      );
      let oldPrefSet = new Set(oldPreferences.map((p) => p.preference_tag));
      let newPrefSet = new Set(toAdd);
      let cleaned = newPrefSet.difference(oldPrefSet);
      req.toAddCleaned = [...cleaned];
      next();
    } else {
      req.toAddCleaned = toAdd;
      next();
    }
  } else if (wanted === "0") {
    if (toAdd.length) {
      let oldPreferences = await preference_model.get_unwanted_preferences(
        mealId,
        user_id
      );
      let oldPrefSet = new Set(oldPreferences.map((p) => p.preference_tag));
      let newPrefSet = new Set(toAdd);
      let cleaned = newPrefSet.difference(oldPrefSet);
      req.toAddCleaned = [...cleaned];
      next();
    } else {
      req.toAddCleaned = toAdd;
      next();
    }
  } else {
    res.status(401).json({ error: "Invalid query value" });
  }
});
