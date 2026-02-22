"use strict";

const { Pool } = require("pg");
const config = require("./env");

const pool = new Pool({
  connectionString: config.database.url,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  if (config.server.isDev) {
    console.log("Connected to PostgreSQL");
  }
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err.message);
  process.exit(1);
});

module.exports = {
  // query helper - use this everywhere instead of pool.query directly
  query: (text, params) => pool.query(text, params),
  // expose pool for transactions
  pool,
};
