const db = require("../db");
const pool = require("../pool");

exports.meal_restaurant_create = async (data) => {
  let { meal_id, place_id, user_id, approved } = data;
  try {
    const result = await pool.query(
      `insert into meal_restaurants
    (place_id, meal_id, user_id, approved)
    values($1,$2,$3,$4) returning place_id`,
      [place_id, meal_id, user_id, approved]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     `insert into meal_restaurant
  //     (place_id, meal_id, user_id, approved)
  //     values (?,?,?,?) returning place_id;`,
  //     [place_id, meal_id, user_id, approved],
  //     (err, row) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       } else {
  //         if (row) {
  //           resolve(row);
  //         } else {
  //           reject("Could not add restaurant data");
  //         }
  //       }
  //     }
  //   );
  // });
};

exports.meal_restaurants_get = async (mealId, memberCount) => {
  try {
    const result = await pool.query(
      `select counts.place_id as place_id,
  counts.dislikes,
  power(2, responses_needed) * power(10,counts.dislikes) as score,
  counts.responses_needed from 
  (select place_id,
    count(case when not approved then 1 end) as dislikes,
    $1 - count(distinct user_id) as responses_needed
    from meal_restaurants
    where meal_id = $2
    group by place_id) as counts
    order by responses_needed = 0, score`,
      [memberCount, mealId]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `select counts.place_id as place_id,
  //     counts.dislikes,
  //     power(2, responses_needed) * power(10, counts.dislikes) as score,
  //     counts.responses_needed
  //      from
  //         (select place_id,
  //         count(case when not approved then 1 end) as dislikes,
  //         ? - count(distinct user_id) as responses_needed
  //         from meal_restaurant
  //         where meal_id = ?
  //         group by place_id) as counts
  //         order by responses_needed = 0, score;`,
  //     [memberCount, mealId],
  //     (err, rows) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       } else {
  //         resolve(rows);
  //       }
  //     }
  //   );
  // });
};

exports.get_restaurant_by_ids = async (mealId, userId, placeId) => {
  try {
    const result = await pool.query(
      `select * from meal_restaurants
    where meal_id = $1 and user_id = $2 and place_id = $3`,
      [mealId, userId, placeId]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     `select * from meal_restaurant
  //     where meal_id = ? and user_id = ? and place_id = ?`,
  //     [mealId, userId, placeId],
  //     (err, row) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       } else {
  //         resolve(row);
  //       }
  //     }
  //   );
  // });
};

exports.meal_restaurants_get_by_user = async (mealId, userId) => {
  try {
    const result = await pool.query(
      `select place_id, approved from meal_restaurants where meal_id=$1 and user_id = $2`,
      [mealId, userId]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `select
  //         place_id, approved
  //         from meal_restaurant
  //         where meal_id = ? and user_id = ?`,
  //     [mealId, userId],
  //     (err, rows) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       } else {
  //         if (rows) {
  //           resolve(rows);
  //         } else {
  //           reject("Could not get restaurants for user");
  //         }
  //       }
  //     }
  //   );
  // });
};

exports.meal_restaurant_delete = async (mealId, userId, place_id) => {
  try {
    await pool.query(
      `delete from meal_restaurants
    where meal_id = $1 and user_id = $2 and place_id = $3`,
      [mealId, userId, place_id]
    );
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     `delete from meal_restaurant
  //     where meal_id=? and user_id =? and place_id = ?`,
  //     [mealId, userId, place_id],
  //     (err, row) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       }
  //       resolve();
  //     }
  //   );
  // });
};

exports.clear_meal_restaurants = async (mealId) => {
  try {
    await pool.query(`delete from meal_restaurants where meal_id = $1`, [
      mealId,
    ]);
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     `delete from meal_restaurant
  //     where meal_id=?`,
  //     [mealId],
  //     (err, row) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       }
  //       resolve();
  //     }
  //   );
  // });
};

exports.meal_restaurant_update = async (data) => {
  let { meal_id, place_id, user_id, approved } = data;
  try {
    const result = await pool.query(
      `update meal_restaurants set
    approved= $1 where place_id = $2 and meal_id = $3 and user_id = $4 returning approved`,
      [approved, place_id, meal_id, user_id]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     `update meal_restaurant set
  //       approved = ?
  //       where place_id = ? and meal_id=? and user_id = ?  returning approved;`,
  //     [approved, place_id, meal_id, user_id],
  //     (err, row) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       } else {
  //         if (row) {
  //           resolve(row);
  //         } else {
  //           reject("Could not add restaurant data");
  //         }
  //       }
  //     }
  //   );
  // });
};
