const Pool = require("pg").Pool;
// const pool = new Pool({
//   user: "lauren",
//   host: "localhost",
//   database: "api",
//   password: process.env.POSTGRESQL_PASSWORD,
//   port: 5432,
// });

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONFIG_LINK,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.clearTestData = async () => {
  await pool.query("DELETE FROM users WHERE username IN ($1,$2,$3)", [
    "john",
    "milly",
    "john2",
  ]);
  await pool.query("DELETE FROM meals WHERE address = $1", [
    "100 Cherry Ln Brewster, NY 10000",
  ]);
  await pool.query(`DELETE FROM meal_restaurants WHERE place_id = $1`, [
    "resM",
  ]);
  await pool.query(
    "DELETE FROM member_preferences WHERE meal_id = 27 AND preference_tag in ('thai_restaurant','pizza_restaurant')",
    []
  );
};

module.exports = pool;
