const SYSTEM = `
You are an expert ATS recruiter performing a standalone resume quality audit.
Assess clarity, impact, measurable outcomes, technical coverage, and communication strength.
Return valid JSON only — no markdown, no extra keys.

Required JSON shape:
{
  "cv_score": 0,
  "current_status": "",
  "profile_summary": "",
  "recommended_roles": [],
  "resume_summary": "",
  "top_strengths": [],
  "improvement_areas": [],
  "ats_suggestions": [],
  "improved_bullets": []
}

Rules:
- cv_score: integer 0–100.
- current_status: one of "Entry Level", "Early Career", "Mid Level", "Senior Level".
- recommended_roles: 6–8 concise role titles suited to this resume.
- top_strengths: 4–6 key strengths.
- improvement_areas: 3–5 specific gaps to address.
- ats_suggestions: 4–6 actionable improvements.
- improved_bullets: 4–6 rewritten, stronger resume bullets.
`.trim();

async function callGroq(system, user) {
  const apiKey = process.env.GROQ_API_KEY;
  const model  = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);

  let res;
  try {
    res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model, temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
    });
  } catch (err) {
    if (err.name === 'AbortError') { const e = new Error('AI request timed out — please try again.'); e.status = 504; throw e; }
    throw err;
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json();
  if (res.status === 429) { const e = new Error('AI service is rate-limited — please wait a moment and try again.'); e.status = 429; throw e; }
  if (!res.ok) { const e = new Error(data.error?.message || `Groq error ${res.status}`); e.status = 502; throw e; }
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    const e = new Error('AI returned an unexpected response — please try again.'); e.status = 502; throw e;
  }
}

function nScore(v) { return Math.max(0, Math.min(100, parseInt(v) || 0)); }
function nText(v)  { return String(v || '').trim(); }
function nList(v)  {
  if (!v) return [];
  if (typeof v === 'string') return v.trim() ? [v.trim()] : [];
  if (Array.isArray(v)) return v.map(i =>
    typeof i === 'object' ? nText(i.description || i.text || i.note || '') : nText(i)
  ).filter(Boolean);
  return [];
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { resume_text } = req.body || {};
  if (!nText(resume_text)) return res.status(400).json({ error: 'resume_text is required.' });

  try {
    const raw = await callGroq(SYSTEM, `Candidate Resume:\n${resume_text}`);
    res.json({
      cv_score:          nScore(raw.cv_score),
      current_status:    nText(raw.current_status) || 'Early Career',
      profile_summary:   nText(raw.profile_summary),
      recommended_roles: nList(raw.recommended_roles).slice(0, 8),
      resume_summary:    nText(raw.resume_summary),
      top_strengths:     nList(raw.top_strengths),
      improvement_areas: nList(raw.improvement_areas),
      ats_suggestions:   nList(raw.ats_suggestions),
      improved_bullets:  nList(raw.improved_bullets),
    });
  } catch (err) {
    res.status(err.status || 502).json({ error: err.message });
  }
};
