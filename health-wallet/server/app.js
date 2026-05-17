require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { clerkMiddleware } = require('@clerk/express');
const db = require('./src/db/db');
const { resolveAuth, getUserId } = require('./src/utils/auth');

const reportRoutes = require('./src/routes/reports');
const vitalRoutes = require('./src/routes/vitals');
const shareRoutes = require('./src/routes/shares');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    // Allow all localhost ports
    if (origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disable caching for API routes
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Initialize Clerk (sets up req.auth)
app.use(clerkMiddleware());

// Make getUserId available to route files
app.use((req, res, next) => {
  req.getUserId = () => getUserId(req);
  req.getAuthContext = () => resolveAuth(req);
  next();
});

// Auth protection middleware (replaces deprecated requireAuth)
function requireAuthentication(req, res, next) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Sync user to DB
  try {
    const auth = resolveAuth(req);
    const email = auth.email || `${userId}@clerk.local`;
    const name = auth.name || 'User';
    db.prepare(`
      INSERT INTO users (id, email, name)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email = excluded.email,
        name = excluded.name
    `).run(userId, email, name);
  } catch (err) {
    console.error('[AUTH] Failed to sync user:', err.message);
    return res.status(500).json({ error: 'Failed to sync authenticated user' });
  }
  
  next();
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/debug/db', (req, res) => {
  try {
    const reports = db.prepare('SELECT * FROM reports').all();
    const users = db.prepare('SELECT * FROM users').all();
    res.json({ reports_count: reports.length, users_count: users.length, reports, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/auth', (req, res) => {
  const userId = getUserId(req);
  res.json({ authenticated: !!userId, userId });
});

app.use('/api/reports', requireAuthentication, reportRoutes);
app.use('/api/vitals', requireAuthentication, vitalRoutes);
app.use('/api/shares', requireAuthentication, shareRoutes);

// Error handling
app.use((err, req, res) => {
  console.error('[ERROR]', err.message || err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`\n🏥 Health Wallet API is LIVE`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📂 Uploads: ${path.join(__dirname, 'uploads')}\n`);
});

// Keep process alive
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the existing server before restarting.`);
    process.exit(1);
  } else {
    console.error('[CRITICAL] Server error:', err);
  }
});

process.on('uncaughtException', (err) => console.error('[CRITICAL] Uncaught:', err));
process.on('unhandledRejection', (reason) => console.error('[CRITICAL] Unhandled:', reason));

module.exports = app;
