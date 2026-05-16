const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'healthwallet-dev-secret-key-2026';
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, generateRefreshToken, verifyToken, JWT_SECRET };
