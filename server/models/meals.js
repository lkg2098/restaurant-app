const db = require("../db");
const pool = require("../pool");

exports.get_meals_by_user_id = async (id) => {
  try {
    const result = await pool.query(
      `select * from meals 
    join meal_members on meals.meal_id = meal_members.meal_id 
    where meal_members.user_id = $1
    order by scheduled_at`,
      [id]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `select *
  //     from meal
  //     join meal_member
  //     on meal.meal_id = meal_member.meal_id
  //     where meal_member.user_id = ?
  //     order by scheduled_at
  //     `,
  //     [id],
  //     (err, result) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(result);
  //     }
  //   );
  // });
};

exports.get_past_meals_by_user_id = async (id) => {
  try {
    const result = await pool.query(
      `select * from meals 
    join meal_members on meals.meal_id = meal_members.meal_id 
    where meal_members.user_id = $1 and meals.scheduled_at < current_date
    order by scheduled_at`,
      [id]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `select *
  //     from meal
  //     join meal_member
  //     on meal.meal_id = meal_member.meal_id
  //     where meal_member.user_id = ? and date(scheduled_at) < date(?)
  //     order by scheduled_at
  //     `,
  //     [id, now],
  //     (err, result) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(result);
  //     }
  //   );
  // });
};

exports.get_future_meals_by_user_id = async (id) => {
  try {
    const result = await pool.query(
      `select * from meals 
    join meal_members on meals.meal_id = meal_members.meal_id 
    where meal_members.user_id = $1 and meals.scheduled_at > current_date
    order by scheduled_at`,
      [id]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `select *
  //     from meal
  //     join meal_member
  //     on meal.meal_id = meal_member.meal_id
  //     where meal_member.user_id = ? and date(scheduled_at) >= date(?)
  //     order by scheduled_at
  //     `,
  //     [id, now],
  //     (err, result) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(result);
  //     }
  //   );
  // });
};

exports.meals_search = async (queryTerm, currentUser) => {
  try {
    const result = await pool.query(
      `select meal_name,
        address,
        scheduled_at as date,
        meal_name like $1 as meal_match,
        address like $1 as address_match
        from meals
        join meal_members
        on meals.meal_id = meal_members.meal_id
        where meal_members.user_id = $2 and (meal_name like $1 or address like $1)
        order by meal_match desc, address_match desc`,
      [`%${queryTerm}%`, currentUser]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `
  //     select meal_name,
  //     address,
  //     date(scheduled_at) as date,
  //     meal_name like ? as meal_match,
  //     address like ? as address_match
  //     from meal
  //     join meal_member
  //     on meal.meal_id = meal_member.meal_id
  //     where meal_member.user_id = ? and (meal_name like ? or address like ?)
  //     order by meal_match desc, address_match desc
  //       `,
  //     [
  //       `%${queryTerm}%`,
  //       `%${queryTerm}%`,
  //       currentUser,
  //       `%${queryTerm}%`,
  //       `%${queryTerm}%`,
  //     ],
  //     (err, result) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       console.log(result);
  //       resolve(result);
  //     }
  //   );
  // });
};

exports.meal_members_search = async (queryTerm, currentUser) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      select distinct user.name, user.username
      from (select meal.meal_id from 
        meal 
        join meal_member 
        on meal.meal_id = meal_member.meal_id 
        where meal_member.user_id = ?) as user_meals
        join meal_member
        on user_meals.meal_id = meal_member.meal_id
        join user
        on meal_member.user_id = user.user_id
        where user.user_id != ? and (user.name like ? or user.username like ?)
      `,
      [currentUser, currentUser, `%${queryTerm}%`, `%${queryTerm}%`],
      (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        resolve(result);
      }
    );
  });
};

exports.meal_member_count = async (meal_id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      select count(user_id)
      from meal_member
      where meal_id = ?
      `,
      [meal_id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        resolve(result);
      }
    );
  });
};

exports.meal_create = async (
  meal_name,
  meal_photo,
  created_at,
  scheduled_at,
  address,
  location_coords,
  radius,
  budget
) => {
  try {
    let result = await pool.query(
      `insert into meals(
  meal_name,
  meal_photo,
  created_at,
  scheduled_at,
  address,
  location_coords,
  radius,
  budget
) values($1, $2, $3, $4, $5, $6, $7, $8) returning meal_id`,
      [
        meal_name,
        meal_photo,
        created_at,
        scheduled_at,
        address,
        location_coords,
        radius,
        budget,
      ]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     `insert into meal (
  //       meal_name,
  //       meal_photo,
  //       created_at,
  //       scheduled_at,
  //       address,
  //       location_lat,
  //       location_long,
  //       radius,
  //       budget_min,
  //       budget_max) values (?,?,?,?,?,?,?,?,?,?) returning meal_id`,
  //     [
  //       meal_name,
  //       meal_photo,
  //       created_at,
  //       scheduled_at,
  //       address,
  //       location_lat,
  //       location_long,
  //       radius,
  //       budget_min,
  //       budget_max,
  //     ],
  //     (err, result) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       }
  //       console.log(result);
  //       resolve(result.meal_id);
  //     }
  //   );
  // });
};

exports.meal_update_meal = async (mealId, mealData) => {
  try {
    const result = await pool.query(
      `
    update meals set meal_name = $1,
    meal_photo = $2,
    scheduled_at = $3,
    address= $4,
    location_coords = $5,
    radius = $6,
    budget = $7
    where meal_id = $8 returning *`,
      [
        mealData.meal_name,
        mealData.meal_photo,
        mealData.scheduled_at,
        mealData.address,
        mealData.location_coords,
        mealData.radius,
        mealData.budget,
        mealId,
      ]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     `update meal set meal_name = ?,
  //     meal_photo = ?,
  //     scheduled_at = ?,
  //     address = ?,
  //     location_lat = ?,
  //     location_long = ?,
  //     radius = ?,
  //     budget_min = ?,
  //     budget_max = ? where meal_id = ? returning *`,
  //     [
  //       mealData.meal_name,
  //       mealData.meal_photo,
  //       mealData.scheduled_at,
  //       mealData.address,
  //       mealData.location_lat,
  //       mealData.location_long,
  //       mealData.radius,
  //       mealData.budget_min,
  //       mealData.budget_max,
  //       mealId,
  //     ],
  //     (err, row) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(row);
  //     }
  //   );
  // });
};

exports.meal_update_chosen_restaurant = async (mealId, restaurant) => {
  try {
    const result = await pool.query(
      `update meals set chosen_restaurant = $1 where meal_id = $2 returning chosen_restaurant`,
      [restaurant, mealId]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     `update meal set chosen_restaurant = ? where meal_id = ? returning chosen_restaurant`,
  //     [restaurant, mealId],
  //     (err, row) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(row);
  //     }
  //   );
  // });
};

exports.meal_update_liked = async (mealId, liked) => {
  try {
    const result = await pool.query(
      `update meals set liked = $1 where meal_id = $2 returning liked`,
      [liked, mealId]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     `update meal set liked = ? where meal_id = ? returning liked`,
  //     [liked, mealId],
  //     (err, row) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(row);
  //     }
  //   );
  // });
};

exports.meal_get_by_id = async (mealId) => {
  try {
    const result = await pool.query("select * from meals where meal_id = $1", [
      mealId,
    ]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(`select * from meal where meal_id = ?`, [mealId], (err, row) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(row);
  //   });
  // });
};

exports.meal_delete = async (mealId) => {
  try {
    const result = await pool.query(`delete from meals where meal_id = $1`, [
      mealId,
    ]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(`delete from meal where meal_id = ?`, [mealId], (err, row) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve();
  //   });
  // });
};
