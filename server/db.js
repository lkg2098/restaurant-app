const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

let db = new sqlite3.Database(
  "./database.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
      console.log("couldn't open database");
      createDatabase();
      return;
    } else if (err) {
      console.log("Getting error " + err);
      exit(1);
    }
    createTables(db);
  }
);

function createDatabase() {
  let newdb = new sqlite3.Database("database.db", (err) => {
    if (err) {
      console.log("Getting error " + err);
      exit(1);
    }
    createTables(newdb);
  });
}

function createTables(db) {
  db.all(`pragma foreign_keys = on;`, [], (err) => {
    if (err) {
      console.log(err);
    }
  });
  let tables = new Promise((resolve, reject) => {
    db.all(
      `
      select name 
  from 
  sqlite_master 
  where 
  type='table' and name in (?,?,?,?);`,
      ["user", "session", "session_member", "session_restaurant"],
      (err, rows) => {
        if (err) {
          console.log(err);
          reject();
        }
        resolve(rows);
      }
    );
  });
  tables
    .then((value) => {
      if (value.length < 4) {
        if (value.findIndex((table) => table.name == "user") == -1) {
          db.exec(`
        create table user(
            user_id integer primary key not null,
            username text unique not null,
            password text not null
        );`);
        }
        if (value.findIndex((table) => table.name == "session") == -1) {
          db.exec(`
      create table session(
        session_id integer primary key not null,
        created_at text not null,
        location_lat integer not null,
        location_long integer not null,
        chosen_restaurant text
      );`);
        }
        if (value.findIndex((table) => table.name == "session_member") == -1) {
          db.exec(`
          create table session_member(
            member_id integer primary key not null,
            role text not null check(role = "admin" or role = "guest"),
            user_id interger not null,
            session_id integer not null,
            foreign key (session_id) references session(session_id)
            on update cascade
            on delete cascade
            foreign key (user_id) references user(user_id)
            on update cascade
            on delete cascade
            );
      `);
        }
        if (
          value.findIndex((table) => table.name == "session_restaurant") == -1
        ) {
          db.exec(`
      create table session_restaurant(
        place_id text not null,
        session_id integer not null,
        approved_by integer default 0 not null
      );`);
        }
      }
    })
    .catch((err) => console.log(err));
}

db.addTestData = async () => {
  let passwords = ["password", "bf123", "password123", "t1f3b7", "boo"];
  let passwordHashes = await Promise.all(
    passwords.map(async (p) => await bcrypt.hash(p, 8))
  );
  db.all(
    `insert into user (username, password) values ("Test1", ?),("bob96", ?),("jillian012", ?), ("rick2014", ?), ("ghostBoy97", ?)`,
    passwordHashes,
    (err) => {
      if (err) {
        console.log(`Got error ${err}`);
      }
    }
  );
};

db.clearTestData = () => {
  db.all(`delete from user`);
  db.all(`delete from session`);
  // db.all(`delete from session_member`);
};

module.exports = db;
