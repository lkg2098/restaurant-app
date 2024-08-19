const db = require("../db");
const pool = require("../pool");

exports.member_create = async (mealId, userId, role) => {
  try {
    let result = await pool.query(
      "insert into meal_members(user_id, meal_id, role) values($1,$2,$3) returning member_id",
      [userId, mealId, role]
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `insert into meal_member (user_id,meal_id,role) values (?,?,?)`,
  //     [userId, mealId, role],
  //     (err, result) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       } else {
  //         resolve();
  //       }
  //     }
  //   );
  // });
};

exports.member_create_many = async (mealId, userIds) => {
  let values = userIds
    .map((userId) => `(${userId},${mealId},'guest')`)
    .join(",");

  try {
    const result = await pool.query(
      `insert into meal_members(user_id, meal_id, role) values ${values} returning member_id`,
      []
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `insert into meal_member (user_id, meal_id, role) values ${values}`,
  //     [],
  //     (err) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       } else {
  //         resolve();
  //       }
  //     }
  //   );
  // });
};

exports.get_valid_meal_member = async (mealId, userId) => {
  try {
    const result = await pool.query(
      "select member_id, role from meal_members where meal_id = $1 and user_id = $2",
      [mealId, userId]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     ` select role
  //       from meal_member
  //       where meal_id = ? and user_id = ?`,
  //     [mealId, userId],
  //     (err, row) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       }
  //       resolve(row);
  //     }
  //   );
  // });
};

exports.get_meal_members = async (mealId, memberId) => {
  try {
    const result = await pool.query(
      `select users.user_id, users.name, users.username, meal_members.role
  from users
  join meal_members
  on users.user_id = meal_members.user_id
  where meal_members.meal_id = $1 and meal_members.member_id != $2`,
      [mealId, memberId]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `
  //       select user.user_id, user.username, meal_member.role
  //       from user
  //       join meal_member
  //       on user.user_id = meal_member.user_id
  //       where meal_member.meal_id = ? `,
  //     [mealId],

  //     (err, rows) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       }
  //       resolve(rows);
  //     }
  //   );
  // });
};

exports.get_members_count = async (mealId) => {
  try {
    const result = await pool.query(
      `select count(distinct user_id) as member_count
    from meal_members
    group by meal_id
    having meal_id = $1`,
      [mealId]
    );
    return result.rows[0].member_count;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     `
  //       select count(distinct user_id) as member_count
  //       from meal_member
  //       group by meal_id
  //       having meal_id = ?
  //       `,
  //     [mealId],

  //     (err, row) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       }
  //       if (row) {
  //         resolve(row.member_count);
  //       } else {
  //         reject("Could not get meal members");
  //       }
  //     }
  //   );
  // });
};

exports.get_existing_member_ids = async (mealId) => {
  try {
    const result = await pool.query(
      "select user_id from meal_members where meal_id=$1",
      [mealId]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `
  //       select user_id
  //       from meal_member
  //       where meal_id = ? `,
  //     [mealId],

  //     (err, rows) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       }
  //       resolve(rows);
  //     }
  //   );
  // });
};

exports.get_bad_tags = async (mealId, userId) => {
  try {
    const result = await pool.query(
      `select bad_tags from meal_members where meal_id = $1 and user_id = $2`,
      [mealId, userId]
    );
    return result.rows[0].bad_tags;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.get_min_rating = async (mealId, userId) => {
  try {
    const result = await pool.query(
      `select min_rating from meal_members where meal_id = $1 and user_id = $2`,
      [mealId, userId]
    );
    return result.rows[0].min_rating;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.member_get_settings = async (mealId, userId) => {
  try {
    const result = await pool.query(
      `select min_rating, bad_tags from meal_members where meal_id = $1 and user_id = $2`,
      [mealId, userId]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.member_update_bad_tags = async (memberId, tagList) => {
  try {
    const result = await pool.query(
      `update meal_members set bad_tags = $1 where member_id=$2 returning bad_tags`,
      [tagList, memberId]
    );
    return result.rows[0].bad_tags;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.member_update_min_rating = async (memberId, rating) => {
  console.log(memberId);
  console.log(rating);
  try {
    const result = await pool.query(
      `update meal_members set min_rating = $1 where member_id=$2 returning min_rating`,
      [rating, memberId]
    );
    return result.rows[0].min_rating;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.member_delete = async (mealId, userId) => {
  try {
    await pool.query(
      "delete from meal_members where meal_id = $1 and user_id = $2",
      [mealId, userId]
    );
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `
  //       delete
  //       from meal_member
  //       where meal_id = ? and user_id = ?`,
  //     [mealId, userId],
  //     (err, rows) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       }
  //       resolve(rows);
  //     }
  //   );
  // });
};
