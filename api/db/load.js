const { getUser } = require('../_lib/auth.js');
const { getDb, ensureTable } = require('../_lib/db.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const user = getUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const sql = getDb();
  await ensureTable(sql);

  const rows = await sql`SELECT data FROM user_data WHERE user_id = ${user.id}`;

  res.setHeader('Cache-Control', 'no-store, private');
  res.json({ data: rows[0]?.data ?? null });
};
