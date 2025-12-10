const app = require('./app');
const dotenv = require('dotenv');
const { pool } = require('./config/db');

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Tes koneksi ke database
    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL database');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1); // Keluar kalau koneksi DB gagal
  }
}

startServer();