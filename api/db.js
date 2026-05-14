const { getUser } = require('./_lib/auth.js');
const { getDb, ensureTable } = require('./_lib/db.js');

module.exports = async function handler(req, res) {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const sql = getDb();
  await ensureTable(sql);

  res.setHeader('Cache-Control', 'no-store, private');

  if (req.method === 'GET') {
    const rows = await sql`SELECT data FROM user_data WHERE user_id = ${user.id}`;
    return res.json({ data: rows[0]?.data ?? null });
  }

  if (req.method === 'POST') {
    const { progress, dailyNotes, applications, projects, cgpa } = req.body || {};
    const data = { progress, dailyNotes, applications, projects, cgpa };
    await sql`
      INSERT INTO user_data (user_id, data, updated_at)
      VALUES (${user.id}, ${data}, NOW())
      ON CONFLICT (user_id) DO UPDATE
        SET data = EXCLUDED.data, updated_at = NOW()
    `;
    return res.json({ ok: true });
  }

  res.status(405).end();
};
