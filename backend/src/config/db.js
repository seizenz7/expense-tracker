const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); // Memuat variabel dari .env

// Membuat connection pool ke PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Fungsi helper untuk menjalankan query
// query(text, params) akan kita gunakan di controller
async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

module.exports = {
  query,
  pool,
};