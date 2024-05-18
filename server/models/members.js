const db = require("../db");

exports.member_create = async (sessionId, userId, role) => {
  return new Promise((resolve, reject) => {
    db.all(
      `insert into session_member (user_id,session_id,role) values (?,?,?)`,
      [userId, sessionId, role],
      (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(result);
          resolve();
        }
      }
    );
  });
};

exports.member_create_many = async (sessionId, userIds) => {
  let values = userIds
    .map((userId) => `(${userId},${sessionId},"guest")`)
    .join(",");

  return new Promise((resolve, reject) => {
    db.all(
      `insert into session_member (user_id, session_id, role) values ${values}`,
      [],
      (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

exports.get_session_members = async (sessionId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
            select user.user_id, user.username, session_member.role
            from user
            join session_member
            on user.user_id = session_member.user_id
          where session_member.session_id = ? `,
      [sessionId],

      (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(rows);
        resolve(rows);
      }
    );
  });
};
