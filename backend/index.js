const express = require('express');
const app = express();
const PORT = 3000;

// Middleware untuk parsing JSON body
app.use(express.json());

// Route sederhana untuk cek kesehatan server
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});