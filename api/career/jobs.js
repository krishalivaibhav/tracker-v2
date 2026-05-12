module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { role } = req.body || {};
  const query = String(role || '').trim();
  if (!query) return res.status(400).json({ error: 'role is required.' });

  const appId  = process.env.ADZUNA_APP_ID  || '9fb3be8f';
  const appKey = process.env.ADZUNA_APP_KEY || 'e3b6d45d47289f6ace2bf472e3425862';
  const country = process.env.ADZUNA_COUNTRY || 'in';

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?` +
    `app_id=${appId}&app_key=${appKey}&results_per_page=8&what=${encodeURIComponent(query)}&content-type=application/json`;

  try {
    const adzunaRes = await fetch(url);
    if (!adzunaRes.ok) throw new Error(`Adzuna ${adzunaRes.status}`);
    const data = await adzunaRes.json();

    const jobs = (data.results || []).map(j => ({
      title:       j.title || '',
      company:     j.company?.display_name || '',
      location:    j.location?.display_name || '',
      salary:      j.salary_min ? `₹${Math.round(j.salary_min/1000)}k – ₹${Math.round(j.salary_max/1000)}k` : '',
      description: (j.description || '').slice(0, 200),
      url:         j.redirect_url || '',
      created:     j.created?.slice(0, 10) || '',
    }));

    res.json({ jobs, query, count: data.count || jobs.length });
  } catch (err) {
    res.status(502).json({ error: err.message, jobs: [] });
  }
};
