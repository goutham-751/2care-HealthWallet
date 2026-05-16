require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { clerkMiddleware, requireAuth } = require('@clerk/express');
const db = require('./src/db/db');

const reportRoutes = require('./src/routes/reports');
const vitalRoutes = require('./src/routes/vitals');
const shareRoutes = require('./src/routes/shares');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk Middleware
app.use(clerkMiddleware());

// Auto-sync User Middleware
const syncUser = (req, res, next) => {
  if (req.auth && req.auth.userId) {
    try {
      // Lazy insert user if they don't exist yet
      db.prepare('INSERT OR IGNORE INTO users (id, email, name) VALUES (?, ?, ?)').run(
        req.auth.userId,
        req.auth.claims?.email_addresses?.[0] || 'unknown@clerk.com', // fallback
        'User' // Clerk frontend doesn't necessarily pass name in JWT claims by default, handle in webhooks if needed
      );
    } catch (err) {
      console.error('Error syncing user:', err);
    }
  }
  next();
};

// API Routes
app.use('/api/reports', requireAuth(), syncUser, reportRoutes);
app.use('/api/vitals', requireAuth(), syncUser, vitalRoutes);
app.use('/api/shares', requireAuth(), syncUser, shareRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (err.message && err.message.includes('Only PDF')) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🏥 Health Wallet API running on http://localhost:${PORT}`);
  console.log(`📋 Routes: /api/auth, /api/reports, /api/vitals, /api/shares\n`);
});

module.exports = app;
