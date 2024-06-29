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

exports.get_valid_session_member = async (sessionId, userId) => {
  return new Promise((resolve, reject) => {
    db.get(
      ` select role
        from session_member
        where session_id = ? and user_id = ?`,
      [sessionId, userId],
      (err, row) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(row);
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
        resolve(rows);
      }
    );
  });
};

exports.get_members_count = async (sessionId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
        select count(distinct user_id) as member_count
        from session_member
        group by session_id
        having session_id = ?
        `,
      [sessionId],

      (err, row) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        if (row) {
          resolve(row.member_count);
        } else {
          reject("Could not get session members");
        }
      }
    );
  });
};

exports.get_existing_member_ids = async (sessionId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
        select *
        from session_member
        where session_id = ? `,
      [sessionId],

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

exports.member_delete = async (sessionId, userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
        delete
        from session_member
        where session_id = ? and user_id = ?`,
      [sessionId, userId],
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
