const db = require("../db");

exports.get_tables = () => {
  let data = db.serialize(function () {
    db.all(
      "select name from sqlite_master where type='table'",
      function (err, tables) {
        console.log(tables);
      }
    );
  });
  return data;
};

exports.create_user = async (username, password) => {
  return new Promise((resolve, reject) => {
    db.all(
      `insert into user(username, password) values(?,?) returning user_id`,
      [username, password],
      (err, row) => {
        if (err) {
          console.log(`Got error ${err}`);
          reject(err);
        }
        resolve(row[0].user_id);
      }
    );
  });
};

exports.update_username = async (id, username) => {
  return new Promise((resolve, reject) => {
    db.all(
      `update user set username = ? where user_id = ?`,
      [username, id],
      (err, row) => {
        if (err) {
          console.log(`Got error ${err}`);
          reject(err);
        }
        resolve();
      }
    );
  });
};

exports.update_password = async (id, passwordHash) => {
  return new Promise((resolve, reject) => {
    db.all(
      `update user set password = ? where user_id = ?`,
      [passwordHash, id],
      (err, row) => {
        if (err) {
          console.log(`Got error ${err}`);
          reject(err);
        }
        resolve();
      }
    );
  });
};

exports.list_users = () => {
  return new Promise((resolve, reject) => {
    db.all(`select * from user`, [], (err, rows) => {
      if (err) {
        console.log(`Got error ${err}`);
        reject(err);
      }
      resolve(rows);
    });
  });
};

exports.search_usernames = (queryTerm) => {
  return new Promise((resolve, reject) => {
    db.all(
      `select username from user where username like ?`,
      `%${queryTerm}%`,
      (err, rows) => {
        if (err) {
          console.log(`Got error ${err}`);
          reject(err);
        }
        resolve(rows);
      }
    );
  });
};

exports.get_user_by_id = (id) => {
  return new Promise((resolve, reject) => {
    db.get(`select * from user where user_id = ?`, id, (err, row) => {
      if (err) {
        console.log(`Got error ${err}`);
        reject(err);
      }

      resolve(row);
    });
  });
};

exports.get_user_by_username = (username) => {
  return new Promise((resolve, reject) => {
    db.get(`select * from user where username = ?`, username, (err, row) => {
      if (err) {
        console.log(`Got error ${err}`);
        reject(err);
      }

      resolve(row);
    });
  });
};

exports.delete_user = (id) => {
  return new Promise((resolve, reject) => {
    db.all(`delete from user where user_id = ?`, id, (err) => {
      if (err) {
        console.log(`Got error ${err}`);
        reject(err);
      }
      resolve();
    });
  });
};
