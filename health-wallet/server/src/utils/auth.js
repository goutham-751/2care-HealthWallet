const { getAuth } = require('@clerk/express');

function readAuthValue(auth) {
  if (!auth) return null;

  return {
    userId: auth.userId || auth.claims?.sub || auth.sessionClaims?.sub || null,
    email:
      auth.sessionClaims?.email ||
      auth.sessionClaims?.primary_email_address ||
      auth.claims?.email ||
      auth.claims?.primary_email_address ||
      null,
    name:
      auth.sessionClaims?.name ||
      auth.sessionClaims?.full_name ||
      auth.claims?.name ||
      auth.claims?.full_name ||
      null,
  };
}

function resolveAuth(req) {
  const candidates = [];

  try {
    candidates.push(getAuth(req));
  } catch {
    // Older/newer Clerk middleware shapes can throw here; try req.auth below.
  }

  try {
    candidates.push(typeof req.auth === 'function' ? req.auth() : req.auth);
  } catch {
    // Keep falling through to the remaining candidates.
  }

  for (const candidate of candidates) {
    const auth = readAuthValue(candidate);
    if (auth?.userId) return auth;
  }

  return { userId: null, email: null, name: null };
}

function getUserId(req) {
  return resolveAuth(req).userId;
}

module.exports = {
  resolveAuth,
  getUserId,
};
