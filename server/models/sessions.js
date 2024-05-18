const db = require("../db");

exports.session_create = async (latitude, longitude) => {
  let now = new Date();
  return new Promise((resolve, reject) => {
    db.all(
      `insert into session (created_at, location_lat, location_long) values (?,?,?) returning session_id`,
      [now.toISOString(), latitude, longitude],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result[0].session_id);
      }
    );
  });
};
