const express = require('express');
const db = require('../db/db');
const { getAuth } = require('@clerk/express');

const router = express.Router();

// Helper to get robust userId
const getUserId = (req) => {
  const auth = (typeof req.auth === 'function') ? req.auth() : (req.auth || getAuth(req));
  return auth?.userId || auth?.claims?.sub;
};

// POST /api/shares — Share a report with a user by email
router.post('/', (req, res) => {
  try {
    const { report_id, email, can_download } = req.body;
    const userId = getUserId(req);

    if (!report_id || !email) {
      return res.status(400).json({ error: 'report_id and email are required' });
    }

    // Verify ownership
    const report = db.prepare('SELECT * FROM reports WHERE id = ? AND user_id = ?').get(report_id, userId);
    if (!report) return res.status(404).json({ error: 'Report not found or not yours' });

    // Find target user
    const targetUser = db.prepare('SELECT id, name, email FROM users WHERE email = ?').get(email);
    if (!targetUser) return res.status(404).json({ error: 'User not found with that email' });

    if (targetUser.id === userId) {
      return res.status(400).json({ error: 'Cannot share with yourself' });
    }

    // Check if already shared
    const existing = db.prepare('SELECT id FROM report_shares WHERE report_id = ? AND shared_with_id = ?').get(report_id, targetUser.id);
    if (existing) return res.status(409).json({ error: 'Already shared with this user' });

    const result = db.prepare(
      'INSERT INTO report_shares (report_id, owner_id, shared_with_id, shared_with_email, can_download) VALUES (?, ?, ?, ?, ?)'
    ).run(report_id, userId, targetUser.id, targetUser.email, can_download ? 1 : 0);

    const share = db.prepare('SELECT * FROM report_shares WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...share, shared_with: targetUser });
  } catch (err) {
    console.error('Share error:', err);
    res.status(500).json({ error: 'Failed to share report' });
  }
});

// GET /api/shares/mine — My outgoing shares
router.get('/mine', (req, res) => {
  try {
    const userId = getUserId(req);
    const shares = db.prepare(`
      SELECT rs.*, r.title, r.report_type, r.report_date, u.name as shared_with_name, u.email as shared_with_email
      FROM report_shares rs
      JOIN reports r ON rs.report_id = r.id
      JOIN users u ON rs.shared_with_id = u.id
      WHERE rs.owner_id = ?
      ORDER BY rs.shared_at DESC
    `).all(userId);

    res.json(shares);
  } catch (err) {
    console.error('Get my shares error:', err);
    res.status(500).json({ error: 'Failed to fetch shares' });
  }
});

// GET /api/shares/with-me — Reports shared with me
router.get('/with-me', (req, res) => {
  try {
    const userId = getUserId(req);
    const shared = db.prepare(`
      SELECT rs.*, r.title, r.report_type, r.report_date, r.file_type, r.notes, u.name as shared_by_name, u.email as shared_by_email
      FROM report_shares rs
      JOIN reports r ON rs.report_id = r.id
      JOIN users u ON rs.owner_id = u.id
      WHERE rs.shared_with_id = ?
      ORDER BY rs.shared_at DESC
    `).all(userId);

    res.json(shared);
  } catch (err) {
    console.error('Get shared with me error:', err);
    res.status(500).json({ error: 'Failed to fetch shared reports' });
  }
});

// DELETE /api/shares/:id — Revoke share
router.delete('/:id', (req, res) => {
  try {
    const userId = getUserId(req);
    const share = db.prepare('SELECT * FROM report_shares WHERE id = ? AND owner_id = ?').get(req.params.id, userId);
    if (!share) return res.status(404).json({ error: 'Share not found' });

    db.prepare('DELETE FROM report_shares WHERE id = ?').run(share.id);
    res.json({ message: 'Share revoked' });
  } catch (err) {
    console.error('Revoke share error:', err);
    res.status(500).json({ error: 'Failed to revoke share' });
  }
});

module.exports = router;
