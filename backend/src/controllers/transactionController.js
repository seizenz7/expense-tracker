const db = require('../config/db');

// GET /api/transactions
async function getTransactions(req, res) {
  try {
    // Ambil user ID dari token yang sudah diverifikasi
    const userId = req.user.id;
    // Ambil semua transaksi milik user
    const result = await db.query(
      `SELECT id, type, amount, category, date, note, created_at
       FROM transactions
       WHERE user_id = $1
       ORDER BY date DESC, id DESC`,
      [userId]
    );
    // Kirim data transaksi ke client
    return res.json({ transactions: result.rows });
  } catch (error) {
    console.error('GetTransactions error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// POST /api/transactions
async function createTransaction(req, res) {
  try {
    // Ambil user ID dari token yang sudah diverifikasi
    const userId = req.user.id;
    // Ambil data dari body request
    const { type, amount, category, date, note } = req.body;
    // Validasi input dasar
    if (!type || !amount || !category || !date) {
      return res.status(400).json({ message: 'type, amount, category, and date are required' });
    }
    // Validasi type
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'type must be income or expense' });
    }
    // Masukkan data transaksi ke database
    const result = await db.query(
      `INSERT INTO transactions (user_id, type, amount, category, date, note)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, type, amount, category, date, note, created_at`,
      [userId, type, amount, category, date, note || null]
    );
    // Ambil transaksi yang baru dibuat
    const transaction = result.rows[0];
    // Kirim respon ke client
    return res.status(201).json({
      message: 'Transaction created',
      transaction,
    });
  } catch (error) {
    console.error('CreateTransaction error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// PUT /api/transactions/:id
async function updateTransaction(req, res) {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;
    const { type, amount, category, date, note } = req.body;

    // Cek apakah transaksi milik user
    const existing = await db.query(
      'SELECT id FROM transactions WHERE id = $1 AND user_id = $2',
      [transactionId, userId]
    );
    if (existing.rowCount === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    // Update data transaksi
    const result = await db.query(
      `UPDATE transactions
       SET type = $1,
           amount = $2,
           category = $3,
           date = $4,
           note = $5
       WHERE id = $6 AND user_id = $7
       RETURNING id, type, amount, category, date, note, created_at`,
      [type, amount, category, date, note || null, transactionId, userId]
    );

    const transaction = result.rows[0];

    return res.json({
      message: 'Transaction updated',
      transaction,
    });
  } catch (error) {
    console.error('UpdateTransaction error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// DELETE /api/transactions/:id
async function deleteTransaction(req, res) {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;
    // Hapus transaksi jika milik user
    const result = await db.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
      [transactionId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('DeleteTransaction error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};