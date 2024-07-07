const db = require("../db");

exports.get_preferences = (session_id, user_id) => {
  return new Promise((resolve, reject) => {
    db.all(
      `select preference_tag, want_to_eat 
        from member_preference
        where session_id=? and user_id=?`,
      [session_id, user_id],
      (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(rows);
      }
    );
  });
};

exports.get_wanted_preferences = (session_id, user_id) => {
  return new Promise((resolve, reject) => {
    db.all(
      `select preference_tag
            from member_preference
            where session_id=? and user_id=? and want_to_eat = 1`,
      [session_id, user_id],
      (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(rows);
      }
    );
  });
};

exports.get_unwanted_preferences = (session_id, user_id) => {
  return new Promise((resolve, reject) => {
    db.all(
      `select preference_tag
              from member_preference
              where session_id=? and user_id=? and want_to_eat = 0`,
      [session_id, user_id],
      (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(rows);
      }
    );
  });
};

exports.update_preferences = (toAdd, toDelete, wanted, session_id, user_id) => {
  let input = "";
  // add values to input string and list of tags that will stay
  for (let tag of toAdd) {
    input += `(${session_id}, ${user_id}, "${tag}", ${wanted}),`;
  }

  // delete trailing comma
  if (input.length) {
    input = input.substring(0, input.length - 1);
  }
  console.log(input);

  const tagsToDelete =
    toDelete.reduce((tags, tag, ind) => {
      tags += `"${tag}"`;
      if (ind != toDelete.length - 1) {
        tags += ",";
      }
      return tags;
    }, "(") + ")";
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `insert into member_preference (session_id, user_id, preference_tag, want_to_eat)
        values ${input}`,
        [],
        (err) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          if (tagsToDelete.length == 2) {
            resolve();
          }
        }
      );
      if (tagsToDelete.length > 2) {
        db.run(
          `delete from member_preference 
          where session_id = ? and user_id = ? and want_to_eat = ? and preference_tag in ${tagsToDelete}`,
          [session_id, user_id, wanted],
          (err) => {
            if (err) {
              console.log(err);
              reject(err);
            }
            resolve();
          }
        );
      }
    });
  });
};
