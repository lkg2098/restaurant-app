const asyncHandler = require("express-async-handler");
const restaurant_model = require("../models/restaurants");
const member_model = require("../models/members");

exports.restaurants_get_by_meal = asyncHandler(async (req, res, next) => {
  // NEED TO IMPLEMENT WITH PROBABILITIES!!!!!!!!!

  // create an empty map - google api list will check this map for repeat instances
  const allSessionRestaurants = {};
  const likedRestaurants = [];
  const dislikedRestaurants = [];
  // get all restaurants for this user from the meal (all seen restaurants)
  let user_restaurants = await restaurant_model.meal_restaurants_get_by_user(
    req.params.mealId,
    req.decoded.user_id
  );
  for (let ur of user_restaurants) {
    allSessionRestaurants[ur.place_id] = { user_approved: ur.approved == 1 };
  }
  // get all meal restaurants - count all accepted true and accepted false for each
  let memberCount = await member_model.get_members_count(req.params.mealId);
  console.log(memberCount);
  let restaurants = await restaurant_model.meal_restaurants_get(
    req.params.mealId,
    memberCount
  );
  console.log(restaurants);

  for (let r of restaurants) {
    if (!allSessionRestaurants[r.place_id]) {
      // add to liked and disliked lists if the user hasn't seen them before
      if (r.dislikes == 0 && r.responses_needed != 0) {
        // will be sorted because sql response sorted by score
        likedRestaurants.push(r.place_id);
      } else if (r.responses_needed != 0) {
        // will be sorted because sql response sorted by score
        dislikedRestaurants.push(r.place_id);
      }

      // then add the meal data to the data map
      allSessionRestaurants[r.place_id] = {
        score: r.score,
        responses_neededL: r.responses_needed,
      };
    } else {
      allSessionRestaurants[r.place_id].score = r.score;
      allSessionRestaurants[r.place_id].responses_needed = r.responses_needed;
    }
  }

  res.status(200).send({
    seenByUser: user_restaurants,
    mealRestaurants: restaurants,
    // restaurantsMap: allSessionRestaurants,
    // likedRestaurants: likedRestaurants,
    // dislikedRestaurants: dislikedRestaurants,
  });
});

exports.restaurant_add = asyncHandler(async (req, res, next) => {
  const { place_id } = req.body;
  const { approved } = req.query;
  if (place_id && (approved == 0 || approved == 1)) {
    let restaurant = await restaurant_model.get_restaurant_by_ids(
      req.params.mealId,
      req.decoded.user_id,
      req.body.place_id
    );

    if (!restaurant) {
      let id = await restaurant_model.meal_restaurant_create({
        place_id: place_id,
        approved: approved,
        meal_id: req.params.mealId,
        user_id: req.decoded.user_id,
      });

      if (id) {
        res
          .status(200)
          .json({ message: "Successfully added", liked: approved == 1 });
      } else {
        res.status(500).json({ error: "Could not add restaurant data" });
      }
    } else {
      res.status(401).json({ error: "Restaurant already exists" });
    }
  } else {
    res.status(401).json({ error: "Missing restaurant data" });
  }
});

exports.restaurant_update = asyncHandler(async (req, res, next) => {
  const { place_id } = req.body;
  const { approved } = req.query;
  if (place_id && (approved == 0 || approved == 1)) {
    let restaurant = await restaurant_model.get_restaurant_by_ids(
      req.params.mealId,
      req.decoded.user_id,
      req.body.place_id
    );

    if (restaurant) {
      let id = await restaurant_model.meal_restaurant_update({
        place_id: place_id,
        approved: approved,
        meal_id: req.params.mealId,
        user_id: req.decoded.user_id,
      });

      if (id) {
        res
          .status(200)
          .json({ message: "Successfully updated", liked: approved == 1 });
      } else {
        res.status(500).json({ error: "Could not update restaurant data" });
      }
    } else {
      res.status(401).json({ error: "Restaurant does not exist" });
    }
  } else {
    res.status(401).json({ error: "Missing restaurant data" });
  }
  res.send("not implemented - update meal restaurant");
});

exports.restaurant_delete = asyncHandler(async (req, res, next) => {
  if (req.params.mealId && req.decoded.user_id && req.params.placeId) {
    await restaurant_model.meal_restaurant_delete(
      req.params.mealId,
      req.decoded.user_id,
      req.params.placeId
    );
    res.status(200).json({ message: "Successfully deleted" });
  } else {
    res.status(401).json({ error: "Could not delete restaurant" });
  }
});

exports.clear_meal_restaurants = asyncHandler(async (req, res, next) => {
  if (req.params.mealId) {
    await restaurant_model.clear_meal_restaurants(req.params.mealId);
    res.status(200).json({ message: "Successfully deleted" });
  } else {
    res.status(401).json({ error: "Could not delete restaurant" });
  }
});
