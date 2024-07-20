const db = require("../db");
const pool = require("../pool");

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
  try {
    const result = await pool.query(
      "INSERT INTO users(username, password, phone_number) values($1,$2,$3) returning *",
      [username, password, phone_number]
    );

    return result.rows[0];
  } catch (err) {
    throw err;
  }
  // return new Promise((resolve, reject) => {
  // db.all(
  //   `insert into user(username, password, phone_number) values(?,?,?) returning *`,
  //   [username, password, phone_number],
  //   (err, row) => {
  //     if (err) {
  //       console.log(`Got error ${err}`);
  //       reject(err);
  //     }
  //     resolve(row[0].user_id);
  //   }
  // );
  // });
};

exports.update_username = async (id, username) => {
  try {
    const result = await pool.query(
      "update users set username = $1 where user_id = $2 returning username",
      [username, id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `update user set username = ? where user_id = ?`,
  //     [username, id],
  //     (err, row) => {
  //       if (err) {
  //         console.log(`Got error ${err}`);
  //         reject(err);
  //       }
  //       resolve();
  //     }
  //   );
  // });
};

exports.update_password = async (id, passwordHash) => {
  try {
    await pool.query("update users set password = $1 where user_id = $2", [
      passwordHash,
      id,
    ]);
  } catch (err) {
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `update user set password = ? where user_id = ?`,
  //     [passwordHash, id],
  //     (err, row) => {
  //       if (err) {
  //         console.log(`Got error ${err}`);
  //         reject(err);
  //       }
  //       resolve();
  //     }
  //   );
  // });
};

exports.update_name = async (id, name) => {
  try {
    const result = await pool.query(
      "update users set name = $1 where user_id = $2 returning name",
      [name, id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.run(`update user set name = ? where user_id = ?`, [name, id], (err) => {
  //     if (err) {
  //       console.log(err);
  //       reject(err);
  //     }
  //     resolve();
  //   });
  // });
};

exports.update_phone_number = async (id, phone) => {
  try {
    const result = await pool.query(
      "update users set phone_number = $1 where user_id = $2 returning phone_number",
      [phone, id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.run(
  //     `update user set phone_number = ? where user_id = ?`,
  //     [phone, id],
  //     (err) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       }
  //       resolve();
  //     }
  //   );
  // });
};

exports.update_email = async (id, email) => {
  try {
    const result = await pool.query(
      "update users set email = $1 where user_id = $2 returning email",
      [email, id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.run(
  //     `update user set email = ? where user_id = ?`,
  //     [email, id],
  //     (err) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       }
  //       resolve();
  //     }
  //   );
  // });
};

exports.update_profile_image = async (id, url) => {
  try {
    const result = await pool.query(
      "update users set profile_image = $1 where user_id = $2 returning profile_image",
      [url, id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.run(
  //     `update user set profile_image = ? where user_id = ?`,
  //     [url, id],
  //     (err) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       }
  //       resolve();
  //     }
  //   );
  // });
};

exports.update_push_token = async (id, token) => {
  try {
    const result = await pool.query(
      "update users set push_token = $1 where user_id = $2 returning push_token",
      [token, id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.run(
  //     `update user set push_token = ? where user_id = ?`,
  //     [token, id],
  //     (err) => {
  //       if (err) {
  //         console.log(err);
  //         reject(err);
  //       }
  //       resolve();
  //     }
  //   );
  // });
};

exports.list_users = async () => {
  try {
    let result = await pool.query("select * from users", []);
    return result.rows;
  } catch (err) {
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(`select * from user`, [], (err, rows) => {
  //     if (err) {
  //       console.log(`Got error ${err}`);
  //       reject(err);
  //     }
  //     resolve(rows);
  //   });
  // });
};

exports.search_users = async (queryTerm, searcher) => {
  try {
    let result = await pool.query(
      "select username, name from users where (username like $1 or name like $1) and username != $2",
      [`%${queryTerm}%`, searcher]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `select username, name from user where (username like ? or name like ?) and username != ?`,
  //     [`%${queryTerm}%`, `%${queryTerm}%`, searcher],
  //     (err, rows) => {
  //       if (err) {
  //         console.log(`Got error ${err}`);
  //         reject(err);
  //       }
  //       resolve(rows);
  //     }
  //   );
  // });
};

exports.get_user_by_id = async (id) => {
  try {
    const result = await pool.query("select * from users where user_id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.get(`select * from user where user_id = ?`, id, (err, row) => {
  //     if (err) {
  //       console.log(`Got error ${err}`);
  //       reject(err);
  //     }

  //     resolve(row);
  //   });
  // });
};

exports.get_many_ids_by_usernames = async (usernames) => {
  const queries = usernames.join("' , '");
  try {
    const result = await pool.query(
      `select user_id from users 
    where username in ('${queries}')`,
      []
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(
  //     `select user_id from user where username in ('${queries}')`,
  //     [],
  //     (err, rows) => {
  //       if (err) {
  //         console.log(err);
  //       }
  //       resolve(rows);
  //     }
  //   );
  // });
};

exports.get_user_by_username = async (username) => {
  try {
    let result = await pool.query("select * from users where username = $1", [
      username,
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
  // return new Promise((resolve, reject) => {
  // db.get(`select * from user where username = ?`, username, (err, row) => {
  //   if (err) {
  //     console.log(`Got error ${err}`);
  //     reject(err);
  //   }

  //   resolve(row);
  // });
  // });
};

exports.check_existing_phone = async (phone_number) => {
  try {
    let result = await pool.query(
      "select user_id from users where phone_number = $1",
      [phone_number]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
  // db.get(
  //   `select user_id from user where phone_number = ?`,
  //   phone_number,
  //   (err, row) => {
  //     if (err) {
  //       console.log(`Got error ${err}`);
  //       reject(err);
  //     }
  //     resolve(row);
  //   }
  // );
};

exports.delete_user = async (id) => {
  try {
    await pool.query("delete from users where user_id = $1", [id]);
  } catch (err) {
    throw err;
  }
  // return new Promise((resolve, reject) => {
  //   db.all(`delete from user where user_id = ?`, id, (err) => {
  //     if (err) {
  //       console.log(`Got error ${err}`);
  //       reject(err);
  //     }
  //     resolve();
  //   });
  // });
};
