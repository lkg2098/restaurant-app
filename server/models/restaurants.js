const db = require("../db");

exports.session_restaurant_create = async (data) => {
  let { session_id, place_id, user_id, approved } = data;
  return new Promise((resolve, reject) => {
    db.get(
      `insert into session_restaurant 
      (place_id, session_id, user_id, approved) 
      values (?,?,?,?) returning place_id;`,
      [place_id, session_id, user_id, approved],
      (err, row) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          if (row) {
            resolve(row);
          } else {
            reject("Could not add restaurant data");
          }
        }
      }
    );
  });
};

exports.session_restaurants_get = async (sessionId, memberCount) => {
  return new Promise((resolve, reject) => {
    db.all(
      `select counts.place_id as place_id, 
      counts.dislikes, 
      power(2, responses_needed) * power(10, counts.dislikes) as score,
      counts.responses_needed
       from
          (select place_id,
          count(case when not approved then 1 end) as dislikes,
          ? - count(distinct user_id) as responses_needed
          from session_restaurant
          where session_id = ?
          group by place_id) as counts
          order by responses_needed = 0, score;`,
      [memberCount, sessionId],
      (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

exports.get_restaurant_by_ids = async (sessionId, userId, placeId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `select * from session_restaurant 
      where session_id = ? and user_id = ? and place_id = ?`,
      [sessionId, userId, placeId],
      (err, row) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

exports.session_restaurants_get_by_user = async (sessionId, userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `select 
          place_id, approved
          from session_restaurant
          where session_id = ? and user_id = ?`,
      [sessionId, userId],
      (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          if (rows) {
            resolve(rows);
          } else {
            reject("Could not get restaurants for user");
          }
        }
      }
    );
  });
};

exports.session_restaurant_delete = async (sessionId, userId, place_id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `delete from session_restaurant 
      where session_id=? and user_id =? and place_id = ?`,
      [sessionId, userId, place_id],
      (err, row) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve();
      }
    );
  });
};

exports.clear_session_restaurants = async (sessionId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `delete from session_restaurant 
      where session_id=?`,
      [sessionId],
      (err, row) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve();
      }
    );
  });
};

exports.session_restaurant_update = async (data) => {
  let { session_id, place_id, user_id, approved } = data;
  return new Promise((resolve, reject) => {
    db.get(
      `update session_restaurant set
        approved = ?  
        where place_id = ? and session_id=? and user_id = ?  returning approved;`,
      [approved, place_id, session_id, user_id],
      (err, row) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          if (row) {
            resolve(row);
          } else {
            reject("Could not add restaurant data");
          }
        }
      }
    );
  });
};
