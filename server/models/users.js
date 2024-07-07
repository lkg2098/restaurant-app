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

exports.create_user = async (username, password, phone_number) => {
  return new Promise((resolve, reject) => {
    db.all(
      `insert into user(username, password, phone_number) values(?,?,?) returning *`,
      [username, password, phone_number],
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

exports.update_name = async (id, name) => {
  return new Promise((resolve, reject) => {
    db.run(`update user set name = ? where user_id = ?`, [name, id], (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve();
    });
  });
};

exports.update_phone_number = async (id, phone) => {
  return new Promise((resolve, reject) => {
    db.run(
      `update user set phone_number = ? where user_id = ?`,
      [phone, id],
      (err) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve();
      }
    );
  });
};

exports.update_profile_image = async (id, url) => {
  return new Promise((resolve, reject) => {
    db.run(
      `update user set profile_image = ? where user_id = ?`,
      [url, id],
      (err) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve();
      }
    );
  });
};

exports.update_push_token = async (id, token) => {
  return new Promise((resolve, reject) => {
    db.run(
      `update user set push_token = ? where user_id = ?`,
      [token, id],
      (err) => {
        if (err) {
          console.log(err);
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

exports.search_users = (queryTerm, searcher) => {
  return new Promise((resolve, reject) => {
    db.all(
      `select username, name from user where (username like ? or name like ?) and username != ?`,
      [`%${queryTerm}%`, `%${queryTerm}%`, searcher],
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

exports.get_many_ids_by_usernames = (usernames) => {
  const queries = usernames.join("' , '");
  return new Promise((resolve, reject) => {
    db.all(
      `select user_id from user where username in ('${queries}')`,
      [],
      (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      }
    );
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

exports.check_existing_phone = (phone_number) => {
  return new Promise((resolve, reject) => {
    db.get(
      `select user_id from user where phone_number = ?`,
      phone_number,
      (err, row) => {
        if (err) {
          console.log(`Got error ${err}`);
          reject(err);
        }
        resolve(row);
      }
    );
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
