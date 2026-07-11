import pool from "../pool.js";
import { Sequelize, DataTypes, Op } from "sequelize";
import db from "../config/database.js";
import Guest from "./guests.js";
import GuestPreference from "./guest_preferences.js";
import User from "./users.js";
import Preference from "./preferences.js";
import MealRestaurant from "./meal_restaurants.js";
import GuestRestaurant from "./guest_restaurants.js";

const Meal = db.define("meal", {
  meal_name: { type: DataTypes.STRING, allowNull: true },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  location_id: { type: DataTypes.STRING, allowNull: false },
  latitude: { type: DataTypes.FLOAT, allowNull: true },
  longitude: { type: DataTypes.FLOAT, allowNull: true },
  radius: { type: DataTypes.INTEGER, allowNull: true },
  budget: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
    validate: {
      hasLength2(value) {
        return value.length === 2;
      },
    },
  },
  chosen_restaurant: { type: DataTypes.INTEGER, allowNull: true },
  round: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 2 },
  },
});

Meal.prototype.getUnseenRestaurantCountByGuestId = async function (guest_id) {
  const allUnvetoedRestaurants = await MealRestaurant.findAll({
    include: [
      {
        model: GuestRestaurant,
        as: "GuestRestaurants",
        where: { vetoed: true },
        required: false,
      },
    ],
    where: {
      meal_id: this.id,
      "$GuestRestaurants.id$": { [Op.eq]: null }, // Only keep records with no match
    },
  });

  if (!allUnvetoedRestaurants.length) {
    return 0;
  }

  const seenRestaurantsCount = await GuestRestaurant.count({
    where: {
      meal_restaurant_id: {
        [Op.in]: allUnvetoedRestaurants.map((restaurant) => restaurant.id),
      },
      guest_id,
      [Op.or]: {
        approved: { [Op.ne]: null },
        hidden_from_user: true,
      },
    },
  });

  return allUnvetoedRestaurants.length - seenRestaurantsCount;
};

export default Meal;

// export const update_meal_round = async (meal_id) => {
//   try {
//     const result = await pool.query(
//       `update meals set round = (oldData.round + 1)
//       from (select meal_id, round from meals
//               where meals.meal_id = $1) as oldData
//               where meals.meal_id = oldData.meal_id
//               and not exists (select 1 from meal_members
//                                 left join member_restaurants
//                                 on meal_members.member_id = member_restaurants.member_id
//                                 join meals on meal_members.meal_id = meals.meal_id
//                                 where meal_members.meal_id = $1 and
//                                 (member_restaurants.approved is null
//                                 or member_restaurants.approved = meals.round)
//                                 order by meal_members.member_id) returning meals.round;`,
//       [meal_id]
//     );
//     return result?.rows?.length > 0;
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

export const choose_best_ranked = async (meal_id) => {
  try {
    let result = await pool.query(
      `update meals set chosen_restaurant = best.res_id from (select res_id, mul(case when rank is not null then (5/rank::numeric)
                         when approved = 1 then 1 
                         when approved = -1 then score * 10
                         else score end) as ranked_score,
               mul(score) as raw_score,
               count(case when approved = -1 then 1 end) as dislikes
               from (select 
                     res_id, 
                     me_r.meal_res_id as meal_res_id,
                     approved, 
                     score, 
                     rank,
                     count(case when vetoed = 't' then 1 end) over (partition by res_id, me_r.meal_res_id) as vetoed
                     from (select meal_res_id, res_id, meal_id 
                     from meal_restaurants 
                     where meal_id = $1 
                     and is_open 
                     and in_budget) as me_r
                     join meal_members as mm on me_r.meal_id = mm.meal_id
                     join member_restaurants as mem_r on me_r.meal_res_id = mem_r.meal_res_id
                     and mem_r.member_id = mm.member_id) as data where vetoed = 0
               group by res_id, meal_res_id
               order by ranked_score, dislikes, raw_score
               limit 1) as best where meals.meal_id = $1 returning chosen_restaurant`,
      [meal_id],
    );
    return result.rows[0].chosen_restaurant;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const get_remaining_unranked_members = async (meal_id) => {
  try {
    let result = await pool.query(
      `select member_id
from (select mm.member_id, count(case when rank is not null then 1 end) as ranked,
  count(distinct mem_r.meal_res_id) as dislikes
  from 
      (select member_id 
       from meal_members 
       where meal_id = $1) as mm
  left join (select meal_res_id, member_id, rank 
             from member_restaurants 
             where approved =-1)as mem_r 
  on mm.member_id = mem_r.member_id
  group by mm.member_id) as data
  where case when dislikes < 5  
then ranked < dislikes 
else ranked != 5 end`,
      [meal_id],
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const get_future_meals_by_user_id = async (id) => {
  try {
    const result = await pool.query(
      `select my_meals.*, 
      array_agg((case when other_members.name is not null 
      then other_members.name 
      else other_members.username end)) as members 
      from (select meals.* from meals 
              join meal_members on meals.meal_id = meal_members.meal_id 
              where meal_members.user_id = $1 
              and meals.scheduled_at > current_date) as my_meals
              left join (select * from meal_members 
                      join users on meal_members.user_id = users.user_id 
                      where meal_members.user_id != $1 
                      order by users.name, users.username) as other_members 
      on my_meals.meal_id = other_members.meal_id 
      group by my_meals.meal_id, 
      my_meals.meal_name, 
      my_meals.meal_photo, 
      my_meals.created_at, 
      my_meals.scheduled_at, 
      my_meals.location_id, 
      my_meals.location_coords,
      my_meals.radius, 
      my_meals.budget, 
      my_meals.chosen_restaurant, 
      my_meals.liked,
      my_meals.round 
      order by my_meals.scheduled_at`,
      [id],
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const meals_search = async (queryTerm, currentUser) => {
  try {
    const result = await pool.query(
      `select meal_name,
        scheduled_at as date
        from meals
        join meal_members
        on meals.meal_id = meal_members.meal_id
        where meal_members.user_id = $2 and meal_name like $1`,
      [`%${queryTerm}%`, currentUser],
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// export const meal_members_search = async (queryTerm, currentUser) => {
//   return new Promise((resolve, reject) => {
//     db.all(
//       `
//       select distinct user.name, user.username
//       from (select meal.meal_id from
//         meal
//         join meal_member
//         on meal.meal_id = meal_member.meal_id
//         where meal_member.user_id = ?) as user_meals
//         join meal_member
//         on user_meals.meal_id = meal_member.meal_id
//         join user
//         on meal_member.user_id = user.user_id
//         where user.user_id != ? and (user.name like ? or user.username like ?)
//       `,
//       [currentUser, currentUser, `%${queryTerm}%`, `%${queryTerm}%`],
//       (err, result) => {
//         if (err) {
//           reject(err);
//         }
//         console.log(result);
//         resolve(result);
//       }
//     );
//   });
// };

export const meal_create = async (
  meal_name,
  meal_photo,
  created_at,
  scheduled_at,
  location_id,
  location_coords,
  radius,
  budget,
) => {
  try {
    let result = await pool.query(
      `insert into meals(
  meal_name,
  meal_photo,
  created_at,
  scheduled_at,
  location_id,
  location_coords,
  radius,
  budget
) values($1, $2, $3, $4, $5, $6, $7, $8) returning meal_id`,
      [
        meal_name,
        meal_photo,
        created_at,
        scheduled_at,
        location_id,
        location_coords,
        radius,
        budget,
      ],
    );
    return result.rows[0].meal_id;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const meal_update_meal = async (mealId, mealData) => {
  try {
    const result = await pool.query(
      `
    update meals set meal_name = $1,
    meal_photo = $2,
    scheduled_at = $3,
    location_id= $4,
    location_coords = $5,
    radius = $6,
    budget = $7
    where meal_id = $8 returning *`,
      [
        mealData.meal_name,
        mealData.meal_photo,
        mealData.scheduled_at,
        mealData.location_id,
        mealData.location_coords,
        mealData.radius,
        mealData.budget,
        mealId,
      ],
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const meal_update_chosen_restaurant = async (mealId, restaurant) => {
  try {
    const result = await pool.query(
      `update meals set chosen_restaurant = $1 where meal_id = $2 returning chosen_restaurant`,
      [restaurant, mealId],
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const meal_update_liked = async (mealId, liked) => {
  try {
    const result = await pool.query(
      `update meals set liked = $1 where meal_id = $2 returning liked`,
      [liked, mealId],
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const meal_get_by_id = async (mealId, guestId) => {
  try {
    const meal = await Meal.findByPk(mealId);

    const guests = await Guest.findAll({
      where: { meal_id: mealId, [Op.not]: { id: guestId } },
      include: { model: User, as: "user" },
    });

    const badTags = await GuestPreference.findAll({
      where: { guest_id: guestId, wants: false },
      include: { model: Preference, attributes: ["tag_name"] },
    });

    const guestNames = guests.map((guest) => guest.user.guest_name);
    const guestIds = guests.map((guest) => guest.id);

    return {
      ...meal.dataValues,
      guests: guestNames,
      guest_ids: guestIds,
      bad_tags: badTags,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
