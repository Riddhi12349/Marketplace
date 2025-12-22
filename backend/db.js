const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres123",
  database: "marketplaceDB",
  port: 5432,
});

module.exports = pool;