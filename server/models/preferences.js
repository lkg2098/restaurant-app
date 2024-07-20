const db = require("../db");
const pool = require("../pool");

exports.get_preferences = async (meal_id, user_id) => {
  try {
    const result = await pool.query(
      `select preference_tag, want_to_eat
    from member_preferences
    where meal_id = $1 and user_id = $2`,
      [meal_id, user_id]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `select preference_tag, want_to_eat
  //       from member_preference
  //       where meal_id=? and user_id=?`,
  //     [meal_id, user_id],
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

exports.get_wanted_preferences = async (meal_id, user_id) => {
  try {
    const result = await pool.query(
      `select preference_tag from member_preferences
    where meal_id = $1 and user_id = $2 and want_to_eat = 'true'`,
      [meal_id, user_id]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `select preference_tag
  //           from member_preference
  //           where meal_id=? and user_id=? and want_to_eat = 1`,
  //     [meal_id, user_id],
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

exports.get_unwanted_preferences = async (meal_id, user_id) => {
  try {
    const result = await pool.query(
      `select preference_tag from member_preferences
    where meal_id = $1 and user_id = $2 and want_to_eat = 'false'`,
      [meal_id, user_id]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `select preference_tag
  //             from member_preference
  //             where meal_id=? and user_id=? and want_to_eat = 0`,
  //     [meal_id, user_id],
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

exports.update_preferences = async (
  toAdd,
  toDelete,
  wanted,
  meal_id,
  user_id
) => {
  let input = "";
  // add values to input string and list of tags that will stay
  for (let tag of toAdd) {
    input += `(${meal_id}, ${user_id}, '${tag}', '${wanted}'),`;
  }
  console.log(input);
  // delete trailing comma
  if (input.length) {
    input = input.substring(0, input.length - 1);
  }
  console.log(input);

  const tagsToDelete =
    toDelete.reduce((tags, tag, ind) => {
      tags += `'${tag}'`;
      if (ind != toDelete.length - 1) {
        tags += ",";
      }
      return tags;
    }, "(") + ")";
  try {
    const result = await pool.query(
      `insert into member_preferences (meal_id, user_id, preference_tag, want_to_eat)
    values ${input} returning preference_tag, want_to_eat`,
      []
    );
    if (tagsToDelete.length > 2) {
      await pool.query(
        `delete from member_preferences where meal_id = $1 and user_id = $2
    and preference_tag in ${tagsToDelete}`,
        [meal_id, user_id]
      );
    }
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.serialize(() => {
  //     db.run(
  //       `insert into member_preference (meal_id, user_id, preference_tag, want_to_eat)
  //       values ${input}`,
  //       [],
  //       (err) => {
  //         if (err) {
  //           console.log(err);
  //           reject(err);
  //         }
  //         if (tagsToDelete.length == 2) {
  //           resolve();
  //         }
  //       }
  //     );
  //     if (tagsToDelete.length > 2) {
  //       db.run(
  //         `delete from member_preference
  //         where meal_id = ? and user_id = ? and want_to_eat = ? and preference_tag in ${tagsToDelete}`,
  //         [meal_id, user_id, wanted],
  //         (err) => {
  //           if (err) {
  //             console.log(err);
  //             reject(err);
  //           }
  //           resolve();
  //         }
  //       );
  //     }
  //   });
  // });
};
