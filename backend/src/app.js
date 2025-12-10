const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

dotenv.config();

const app = express();

// Middleware untuk parsing JSON body
app.use(express.json());

// Route sederhana untuk cek server
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routing untuk auth dan transactions
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

module.exports = app;