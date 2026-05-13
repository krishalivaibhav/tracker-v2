const crypto = require('crypto');

function parseCookies(header) {
  const out = {};
  for (const part of (header || '').split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }
  return out;
}

function verifySession(token, secret) {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;
  const data = token.slice(0, dot);
  const sig  = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  if (sig !== expected) return null;
  try { return JSON.parse(Buffer.from(data, 'base64url').toString()); } catch { return null; }
}

module.exports = function handler(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const user    = verifySession(cookies.session, process.env.SESSION_SECRET);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  res.setHeader('Cache-Control', 'no-store, private');
  res.json(user);
};
