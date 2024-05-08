const { resolve } = require("path");
const { exit } = require("process");

const sqlite3 = require("sqlite3").verbose();
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
      `insert into user(username, password) values(?,?)`,
      [username, password],
      (err) => {
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
