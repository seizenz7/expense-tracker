const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Middleware untuk melindungi route yang butuh user login
function authMiddleware(req, res, next) {
    // Ambil token dari header Authorization
  const authHeader = req.headers['authorization']; // Header: Authorization: Bearer <token>
    // Cek apakah header ada
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Cek format header token. Format header biasanya: "Bearer token_here"
  const parts = authHeader.split(' ');
  // Cek apakah formatnya benar
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid Authorization format' });
  }

  // Ambil tokennya
  const token = parts[1];

  try {
    // Verifikasi token menggunakan secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan data user dari token di req.user (misalnya: { id, email })
    req.user = { id: decoded.id, email: decoded.email };

    // Lanjut ke handler berikutnya
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;