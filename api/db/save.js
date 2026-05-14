const { getUser } = require('../_lib/auth.js');
const { getDb, ensureTable } = require('../_lib/db.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const user = getUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { progress, dailyNotes, applications, projects, cgpa } = req.body || {};
  const data = { progress, dailyNotes, applications, projects, cgpa };

  const sql = getDb();
  await ensureTable(sql);

  await sql`
    INSERT INTO user_data (user_id, data, updated_at)
    VALUES (${user.id}, ${data}, NOW())
    ON CONFLICT (user_id) DO UPDATE
      SET data = EXCLUDED.data, updated_at = NOW()
  `;

  res.setHeader('Cache-Control', 'no-store, private');
  res.json({ ok: true });
};
