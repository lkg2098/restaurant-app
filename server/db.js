const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

let db = new sqlite3.Database(
  "./database.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
      console.log("couldn't open database");
      // createDatabase();
      return;
    } else if (err) {
      console.log("Getting error " + err);
      exit(1);
    }
    // createTables(db);
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
  // db.all(`drop table member_preference`, [], (err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  db.serialize(() => {
    db.run(`
    create table if not exists user(
        user_id integer primary key not null,
        username text unique not null,
        password text not null,
        name text,
        phone_number text,
        profile_image text,
        push_token text
    );`);
    db.run(`
      create table if not exists session(
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
        chosen_restaurant text,
        liked boolean
      );`);
    db.run(`
      create table if not exists session_member(
        member_id integer primary key not null,
        role text not null check(role = "admin" or role = "guest"),
        min_rating real,
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
    db.exec(`
          create table if not exists member_preference(
            preference_id integer primary key not null,
            session_id integer not null,
            user_id integer not null,
            preference_tag varchar not null,
            want_to_eat boolean not null,
            foreign key (session_id) references session(session_id)
            on update cascade
            on delete cascade
            foreign key (user_id) references user(user_id)
            on update cascade
            on delete cascade
            );
      `);
    db.exec(`
      create table if not exists session_restaurant(
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
  });
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
  const now = new Date();

  // ('Test1','$2b$08$Om/tZKUFHf/wLBApjRuv4.PLl6NfXmnk1pSqKVTrl6w0Qtjw19ZVK','Terry Bing','1111111111','terry@example.com'),
  // ('bob96','$2b$08$ibhlWhVyzRpzFvq.LJ668.sUfpxn7r8zZrw8SgD6Ji1PKDM/IvdEm','Bob Smith','2222222222','bob@example.com'),
  // ('jillian012','$2b$08$KSZUk7VtEJPyHgrAERgzCuLE9bkYC3eIosU7iTcSWy168YAp/WwEq','Jillian Morris','33333333333','jillian12@example.com'),
  // ('rick2014','$2b$08$PDf.0mqfnZvWZKwqfffUXOj50wpowEdQ6fN19QWGq6.ElMiXskAmS','Richard Farrow','4444444444','rick@example.com'),
  // ('ghostBoy97','$2b$08$uJfG/5jMmDIuOQ6wk9On0ujnHLF4MA9W02f/fg0jISz7CFVJEhaWu','Casper Theghost','5555555555','casper@example.com'),
  // ('linda45','$2b$08$tAum7PThmQ7pNjVJEXrYh.Wsq5vrrcvhYiExOzfx12MTcVxRIkFS2','Linda Blank','7777777777','linda@example.com'),
  // ('24601','$2b$08$409KEFO5K6RiWuLJXxtgR.6J/efUmo8eyydgIq//GFSZm9ioU5ltC','Jean Valjean','2460124601','jvj@example.com')
  db.serialize(() => {
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
      budget_max) 
    values (?,?,?,?,?,?,?,?,?)`,
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
    values (27,1, 'admin'),
    (27,2, 'guest'),
    (27,3, 'guest'),
    (27,5, 'guest'),
    (27,6, 'guest'),
    (27,7, 'guest')`,
      [],
      (err) => console.log(err)
    );
    db.all(
      `insert into 
  session_restaurant (place_id, session_id, user_id, approved)
  values 
  ('resA', 27, 2, 'true'),
  ('resA', 27, 6, 'true'),
  ('resA', 27, 7, 'false'),
  ('resA', 27, 3, 'true'),
  ('resA', 27, 1, 'true'),
  ('resA', 27, 5, 'true'),

  ('resB', 27, 3, 'false'),
  ('resB', 27, 6, 'false'),
  ('resB', 27, 5, 'false'),
  ('resB', 27, 1, 'false'),

  ('resC', 27, 6, 'true'),
  ('resC', 27, 7, 'true'),
  ('resC', 27, 2, 'true'),
  ('resC', 27, 1, 'true'),
  ('resC', 27, 3, 'true'),

  ('resD', 27, 3, 'true'),
  ('resD', 27, 5, 'true'),
  ('resD', 27, 2, 'false'),

  ('resE', 27, 7, 'false'),
  ('resE', 27, 3, 'true'),
  ('resE', 27, 1, 'true'),
  ('resE', 27, 5, 'true'),
  ('resE', 27, 3, 'false'),

  ('resF', 27, 6, 'false'),
  ('resF', 27, 5, 'false'),

  ('resG', 27, 1, 'false'),
  ('resG', 27, 6, 'true'),
  ('resG', 27, 7, 'true'),
  ('resG', 27, 2, 'false'),
  ('resG', 27, 5, 'true'),
  ('resG', 27, 3, 'true'),

  ('resH', 27, 3, 'true'),
  ('resH', 27, 5, 'true'),
  
  ('resI', 27, 2, 'false')
  `,
      [],
      (err) => {
        console.log(err);
      }
    );
    db.all(
      `insert into member_preference(session_id, user_id, preference_tag, want_to_eat) 
    values (1,1, 'chinese_restaurant', 'true'),
    (1,1,'mexican_restaurant','true'),
    (1,1, 'lebanese_restaurant','false'),
    (1,1,'american_restaurant', 'false')`,
      [],
      (err) => {
        console.log(err);
      }
    );
  });
};

db.clearTestData = () => {
  db.all(`delete from user`);
  db.all(`delete from session`);
  db.all(`delete from session_member`);
  db.all("delete from member_preference");
};

module.exports = db;
