const sqlite3 = require("sqlite3").verbose();

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
  db.exec(`
      create table user(
          user_id integer primary key not null,
          username test unique not null,
          password text not null
      );
      insert into user(username, password)
          values('testUser', 'password123'),
              ('testUser2', 'secret123')`);
}

module.exports = db;
