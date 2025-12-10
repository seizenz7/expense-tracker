const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../config/db');

dotenv.config();

// Jumlah salt rounds untuk bcrypt
const SALT_ROUNDS = 10;

// Helper untuk membuat JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },       // payload
    process.env.JWT_SECRET,                   // secret
    { expiresIn: process.env.JWT_EXPIRES_IN } // misal "7d"
  );
}

// POST /api/auth/register
async function register(req, res) {
  try {
    // Ambil data dari body request
    const { name, email, password } = req.body;

    // Validasi sangat dasar
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }

    // Cek apakah email sudah dipakai
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Simpan user ke DB
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );

    // Ambil user yang baru dibuat
    const user = result.rows[0];

    // Buat token
    const token = generateToken(user);

    return res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    // Cari user berdasarkan email
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Ambil data user
    const user = result.rows[0];

    // Bandingkan password dengan hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Buat token
    const token = generateToken(user);

    // Hilangkan password_hash dari response
    delete user.password_hash;

    return res.json({
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/auth/me
async function getMe(req, res) {
  try {
    const userId = req.user.id;

    const result = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    return res.json({ user });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
  getMe,
};