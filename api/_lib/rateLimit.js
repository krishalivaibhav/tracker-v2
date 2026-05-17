const { getDb } = require('./db');
const { getUser } = require('./auth');

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS rate_limits (
      id       TEXT PRIMARY KEY,
      count    INT NOT NULL DEFAULT 1,
      reset_at TIMESTAMPTZ NOT NULL
    )
  `;
}

function getIdentifier(req) {
  const user = getUser(req);
  if (user?.id) return `u:${user.id}`;
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown';
  return `ip:${ip}`;
}

/**
 * Check and increment a rate limit counter.
 * Returns { allowed, remaining, resetAt }.
 * Fails open (allows request) if DB is unavailable.
 */
async function checkRateLimit(req, endpoint, dailyLimit) {
  const sql = getDb();
  await ensureTable(sql);

  const identifier = getIdentifier(req);
  const windowKey  = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const id = `${identifier}:${endpoint}:${windowKey}`;

  const resetAt = new Date();
  resetAt.setUTCHours(24, 0, 0, 0);
  const resetIso = resetAt.toISOString();

  try {
    const rows = await sql`
      INSERT INTO rate_limits (id, count, reset_at)
      VALUES (${id}, 1, ${resetIso})
      ON CONFLICT (id) DO UPDATE
        SET count = CASE
              WHEN rate_limits.reset_at <= NOW() THEN 1
              ELSE rate_limits.count + 1
            END,
            reset_at = CASE
              WHEN rate_limits.reset_at <= NOW() THEN ${resetIso}::timestamptz
              ELSE rate_limits.reset_at
            END
      RETURNING count, reset_at
    `;
    const { count, reset_at } = rows[0];
    const allowed = count <= dailyLimit;
    return { allowed, remaining: Math.max(0, dailyLimit - count), resetAt: reset_at };
  } catch {
    return { allowed: true, remaining: dailyLimit, resetAt: resetIso };
  }
}

function rateLimitExceeded(res, resetAt) {
  const reset = new Date(resetAt);
  res.setHeader('X-RateLimit-Reset', reset.toUTCString());
  return res.status(429).json({
    error: `Daily free-tier limit reached. Resets at ${reset.toUTCString()}.`,
    reset_at: reset.toISOString(),
  });
}

module.exports = { checkRateLimit, rateLimitExceeded };
