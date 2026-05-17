require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { clerkMiddleware, getAuth } = require('@clerk/express');
const db = require('./src/db/db');

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

// Helper to get userId from any Clerk version
function getUserId(req) {
  try {
    // Try getAuth first (recommended approach)
    const auth = getAuth(req);
    if (auth && auth.userId) return auth.userId;
    if (auth && auth.claims && auth.claims.sub) return auth.claims.sub;
  } catch (e) { /* fall through */ }
  
  try {
    // Try req.auth as function (some Clerk versions)
    if (typeof req.auth === 'function') {
      const auth = req.auth();
      if (auth && auth.userId) return auth.userId;
      if (auth && auth.claims && auth.claims.sub) return auth.claims.sub;
    }
    // Try req.auth as object
    if (req.auth && typeof req.auth === 'object') {
      if (req.auth.userId) return req.auth.userId;
      if (req.auth.claims && req.auth.claims.sub) return req.auth.claims.sub;
    }
  } catch (e) { /* fall through */ }
  
  return null;
}

// Make getUserId available to route files
app.use((req, res, next) => {
  req.getUserId = () => getUserId(req);
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
    const auth = getAuth(req);
    const email = auth?.sessionClaims?.email || auth?.claims?.email || `${userId}@clerk.com`;
    const name = auth?.sessionClaims?.name || auth?.claims?.name || 'User';
    db.prepare('INSERT OR REPLACE INTO users (id, email, name) VALUES (?, ?, ?)').run(userId, email, name);
  } catch (err) {
    // Non-fatal — user may already exist
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
app.use((err, req, res, next) => {
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
    console.error(`Port ${PORT} is already in use. Trying ${PORT + 1}...`);
    server.listen(PORT + 1);
  } else {
    console.error('[CRITICAL] Server error:', err);
  }
});

process.on('uncaughtException', (err) => console.error('[CRITICAL] Uncaught:', err));
process.on('unhandledRejection', (reason) => console.error('[CRITICAL] Unhandled:', reason));

module.exports = app;
