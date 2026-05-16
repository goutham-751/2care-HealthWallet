const express = require('express');
const db = require('../db/db');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();
router.use(authenticate);

// GET /api/vitals — Get vitals with filters
router.get('/', (req, res) => {
  try {
    const { type, from, to, range } = req.query;
    let query = 'SELECT * FROM vitals WHERE user_id = ?';
    const params = [req.user.id];

    if (type) { query += ' AND vital_type = ?'; params.push(type); }

    if (range) {
      const days = parseInt(range);
      if (!isNaN(days)) {
        query += ' AND recorded_at >= datetime("now", ?)';
        params.push(`-${days} days`);
      }
    } else {
      if (from) { query += ' AND recorded_at >= ?'; params.push(from); }
      if (to) { query += ' AND recorded_at <= ?'; params.push(to); }
    }

    query += ' ORDER BY recorded_at DESC';

    const vitals = db.prepare(query).all(...params);
    res.json(vitals);
  } catch (err) {
    console.error('Get vitals error:', err);
    res.status(500).json({ error: 'Failed to fetch vitals' });
  }
});

// POST /api/vitals — Log a new vital
router.post('/', (req, res) => {
  try {
    const { vital_type, value, unit, recorded_at, note } = req.body;

    if (!vital_type || value === undefined || !unit) {
      return res.status(400).json({ error: 'vital_type, value, and unit are required' });
    }

    const result = db.prepare(
      'INSERT INTO vitals (user_id, vital_type, value, unit, recorded_at, note) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(req.user.id, vital_type, value, unit, recorded_at || new Date().toISOString(), note || null);

    const vital = db.prepare('SELECT * FROM vitals WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(vital);
  } catch (err) {
    console.error('Log vital error:', err);
    res.status(500).json({ error: 'Failed to log vital' });
  }
});

// DELETE /api/vitals/:id
router.delete('/:id', (req, res) => {
  try {
    const vital = db.prepare('SELECT * FROM vitals WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!vital) return res.status(404).json({ error: 'Vital not found' });

    db.prepare('DELETE FROM vitals WHERE id = ?').run(vital.id);
    res.json({ message: 'Vital deleted' });
  } catch (err) {
    console.error('Delete vital error:', err);
    res.status(500).json({ error: 'Failed to delete vital' });
  }
});

module.exports = router;
