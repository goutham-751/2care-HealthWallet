const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('../db/db');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/reports — List user's reports
router.get('/', (req, res) => {
  try {
    const { type, date_from, date_to, search, sort = 'newest' } = req.query;
    let query = 'SELECT * FROM reports WHERE user_id = ?';
    const params = [req.auth.userId];

    if (type) { query += ' AND report_type = ?'; params.push(type); }
    if (date_from) { query += ' AND report_date >= ?'; params.push(date_from); }
    if (date_to) { query += ' AND report_date <= ?'; params.push(date_to); }
    if (search) { query += ' AND (title LIKE ? OR notes LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    query += sort === 'oldest' ? ' ORDER BY report_date ASC' : ' ORDER BY report_date DESC';

    const reports = db.prepare(query).all(...params);

    // Attach vitals for each report
    const getVitals = db.prepare('SELECT * FROM report_vitals WHERE report_id = ?');
    const getShares = db.prepare(`
      SELECT rs.id, rs.can_download, rs.shared_at, u.name, u.email 
      FROM report_shares rs JOIN users u ON rs.shared_with_id = u.id 
      WHERE rs.report_id = ? AND rs.owner_id = ?
    `);

    const result = reports.map(r => ({
      ...r,
      vitals: getVitals.all(r.id),
      shared_with: getShares.all(r.id, req.auth.userId)
    }));

    res.json(result);
  } catch (err) {
    console.error('List reports error:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// POST /api/reports — Upload a report
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const { title, report_type, report_date, notes, vitals } = req.body;

    if (!title || !report_type || !report_date) {
      return res.status(400).json({ error: 'Title, report type, and date are required' });
    }

    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    const filePath = req.file.filename;

    const result = db.prepare(
      'INSERT INTO reports (user_id, title, report_type, report_date, file_path, file_type, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(req.auth.userId, title, report_type, report_date, filePath, fileType, notes || null);

    // Insert associated vitals
    if (vitals) {
      const parsed = typeof vitals === 'string' ? JSON.parse(vitals) : vitals;
      const insertVital = db.prepare('INSERT INTO report_vitals (report_id, vital_type, value, unit) VALUES (?, ?, ?, ?)');
      for (const v of parsed) {
        insertVital.run(result.lastInsertRowid, v.type || v.vital_type, v.value, v.unit);
      }
    }

    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(result.lastInsertRowid);
    const reportVitals = db.prepare('SELECT * FROM report_vitals WHERE report_id = ?').all(report.id);

    res.status(201).json({ ...report, vitals: reportVitals });
  } catch (err) {
    console.error('Upload report error:', err);
    res.status(500).json({ error: 'Failed to upload report' });
  }
});

// GET /api/reports/:id — Single report
router.get('/:id', (req, res) => {
  try {
    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);

    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Check access: owner or shared
    if (report.user_id !== req.auth.userId) {
      const share = db.prepare('SELECT id FROM report_shares WHERE report_id = ? AND shared_with_id = ?').get(report.id, req.auth.userId);
      if (!share) return res.status(403).json({ error: 'Access denied' });
    }

    const vitals = db.prepare('SELECT * FROM report_vitals WHERE report_id = ?').all(report.id);
    const shared_with = db.prepare(`
      SELECT rs.id, rs.can_download, rs.shared_at, u.name, u.email 
      FROM report_shares rs JOIN users u ON rs.shared_with_id = u.id 
      WHERE rs.report_id = ? AND rs.owner_id = ?
    `).all(report.id, report.user_id);

    res.json({ ...report, vitals, shared_with });
  } catch (err) {
    console.error('Get report error:', err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// PUT /api/reports/:id — Update metadata
router.put('/:id', (req, res) => {
  try {
    const report = db.prepare('SELECT * FROM reports WHERE id = ? AND user_id = ?').get(req.params.id, req.auth.userId);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    const { title, report_type, report_date, notes } = req.body;
    db.prepare('UPDATE reports SET title = ?, report_type = ?, report_date = ?, notes = ? WHERE id = ?')
      .run(title || report.title, report_type || report.report_type, report_date || report.report_date, notes !== undefined ? notes : report.notes, report.id);

    const updated = db.prepare('SELECT * FROM reports WHERE id = ?').get(report.id);
    res.json(updated);
  } catch (err) {
    console.error('Update report error:', err);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// DELETE /api/reports/:id
router.delete('/:id', (req, res) => {
  try {
    const report = db.prepare('SELECT * FROM reports WHERE id = ? AND user_id = ?').get(req.params.id, req.auth.userId);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Delete file
    const filePath = path.join(__dirname, '..', '..', 'uploads', report.file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    db.prepare('DELETE FROM reports WHERE id = ?').run(report.id);
    res.json({ message: 'Report deleted' });
  } catch (err) {
    console.error('Delete report error:', err);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

// GET /api/reports/:id/file — Download/stream file
router.get('/:id/file', (req, res) => {
  try {
    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Check access
    if (report.user_id !== req.auth.userId) {
      const share = db.prepare('SELECT can_download FROM report_shares WHERE report_id = ? AND shared_with_id = ?').get(report.id, req.auth.userId);
      if (!share) return res.status(403).json({ error: 'Access denied' });
      if (!share.can_download) return res.status(403).json({ error: 'Download not permitted' });
    }

    const filePath = path.join(__dirname, '..', '..', 'uploads', report.file_path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

    res.sendFile(filePath);
  } catch (err) {
    console.error('Download file error:', err);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

module.exports = router;
