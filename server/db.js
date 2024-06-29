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
  // db.all(`drop table user`, [], (err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  // db.all(`drop table session`, [], (err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  // db.all(`drop table session_member`, [], (err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  // db.all(`drop table session_restaurant`, [], (err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
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
            password text not null,
            name text,
            phone_number text,
            profile_image text,
            push_token text
        );`);
        }
        if (value.findIndex((table) => table.name == "session") == -1) {
          db.exec(`
      create table session(
        session_id integer primary key not null,
        session_name text,
        session_photo text,
        created_at text not null,
        scheduled_at text not null,
        address text,
        location_lat integer,
        location_long integer,
        radius integer not null,
        budget_min integer not null,
        budget_max integer not null,
        rating real,
        chosen_restaurant text,
        liked boolean
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
        user_id integer not null,
        approved boolean not null,
        foreign key (session_id) references session(session_id)
        on update cascade
        on delete cascade
        foreign key (user_id) references user(user_id)
        on update cascade
        on delete cascade
      );`);
        }
      }
    })
    .catch((err) => console.log(err));
}

db.addTestData = async () => {
  let passwords = [
    "password",
    "bf123",
    "password123",
    "t1f3b7",
    "boo",
    "karen",
    "jeanVjean",
  ];
  let hashes = await Promise.all(
    passwords.map(async (p) => await bcrypt.hash(p, 8))
  );

  db.all(
    `insert 
    into user (username, password, name, phone_number) 
    values ("Test1", ?, "Terry Bing", "12345678910"),
    ("bob96", ?, "Bob Smith", "12324564122"),
    ("jillian012", ?, "Jillian Morris", "19340576885"), 
    ("rick2014", ?, "Richard Farrow", "13234584903"), 
    ("ghostBoy97", ?, "Casper Theghost", "19760431234"), 
    ("linda45", ?, "Linda Blank", "19293056674"), 
    ("24601", ?, "Jean Valjean", "16053324953")`,
    hashes,
    (err) => {
      if (err) {
        console.log(`Got error ${err}`);
      }
    }
  );
  const now = new Date();
  db.all(
    `insert 
    into session (
      session_name,
      created_at, 
      scheduled_at, 
      address, 
      location_lat, 
      location_long, 
      radius, 
      budget_min, 
      budget_max,
      rating) 
    values (?,?,?,?,?,?,?,?,?,?)`,
    [
      "Birthday Dinner",
      now.toISOString(),
      new Date("April 17, 2023 03:24:00").toISOString(),
      "171 W 4th St, New York, NY 11234",
      100,
      100,
      50,
      10,
      30,
      3.5,
    ],
    (err) => {
      if (err) {
        console.log(`Got error ${err}`);
      }
    }
  );
  db.all(
    `insert into 
    session_member (session_id, user_id, role) 
    values (1,1, "admin"),
    (1,2, "guest"),
    (1,3, "guest"),
    (1,5, "guest"),
    (1,6, "guest"),
    (1,7, "guest")`,
    [],
    (err) => console.log(err)
  );
  db.all(
    `insert into 
  session_restaurant (place_id, session_id, user_id, approved)
  values 
  ("resA", 1, 2, 1),
  ("resA", 1, 6, 1),
  ("resA", 1, 7, 0),
  ("resA", 1, 3, 1),
  ("resA", 1, 1, 1),
  ("resA", 1, 5, 1),

  ("resB", 1, 3, 0),
  ("resB", 1, 6, 0),
  ("resB", 1, 5, 0),
  ("resB", 1, 1, 0),

  ("resC", 1, 6, 1),
  ("resC", 1, 7, 1),
  ("resC", 1, 2, 1),
  ("resC", 1, 1, 1),
  ("resC", 1, 3, 1),

  ("resD", 1, 3, 1),
  ("resD", 1, 5, 1),
  ("resD", 1, 2, 0),

  ("resE", 1, 7, 0),
  ("resE", 1, 3, 1),
  ("resE", 1, 1, 1),
  ("resE", 1, 5, 1),
  ("resE", 1, 3, 0),

  ("resF", 1, 6, 0),
  ("resF", 1, 5, 0),

  ("resG", 1, 1, 0),
  ("resG", 1, 6, 1),
  ("resG", 1, 7, 1),
  ("resG", 1, 2, 0),
  ("resG", 1, 5, 1),
  ("resG", 1, 3, 1),

  ("resH", 1, 3, 1),
  ("resH", 1, 5, 1),
  
  ("resI", 1, 2, 0)
  `,
    [],
    (err) => {
      console.log(err);
    }
  );
};

db.clearTestData = () => {
  db.all(`delete from user`);
  db.all(`delete from session`);
  db.all(`delete from session_member`);
};

module.exports = db;
