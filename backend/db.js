const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",   // ❌ WRONG for Render
//   database: "marketplace",
//   password: "1234",
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;

