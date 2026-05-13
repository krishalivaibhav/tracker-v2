const SYSTEM = `
You are an expert recruiter and ATS evaluator.
Compare the candidate resume with the job description and return a detailed fit analysis.
Return valid JSON only — no markdown.

Required JSON shape:
{
  "match_score": 0,
  "matching_skills": [],
  "missing_skills": [],
  "resume_summary": "",
  "ats_suggestions": [],
  "improved_bullets": [],
  "interview_questions": [],
  "tailor_my_resume": {
    "improved_professional_summary": "",
    "stronger_project_bullets": [],
    "suggested_skills_keywords": []
  }
}

Rules:
- match_score: integer 0–100.
- matching_skills / missing_skills: concise skill terms, not sentences.
- ats_suggestions: 4–6 actionable, specific improvements.
- improved_bullets: 4–6 rewritten, stronger bullet points.
- interview_questions: 5–7 likely questions for this role.
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

  const { resume_text, target_role, job_description } = req.body || {};
  if (!nText(resume_text)) return res.status(400).json({ error: 'resume_text is required.' });
  if (!nText(target_role) && !nText(job_description))
    return res.status(400).json({ error: 'Provide a target_role or job_description.' });

  const jd = nText(job_description)
    ? (nText(target_role) ? `Selected Role: ${target_role}\n\n${job_description}` : job_description)
    : `Target Role: ${target_role}\nEvaluate responsibilities, required technical skills, collaboration ability, and communication expectations for this role.`;

  const user = `Job Description:\n${jd}\n\nCandidate Resume:\n${resume_text}`;

  try {
    const raw = await callGroq(SYSTEM, user);
    const t = raw.tailor_my_resume || {};
    res.json({
      match_score:         nScore(raw.match_score),
      matching_skills:     nList(raw.matching_skills),
      missing_skills:      nList(raw.missing_skills),
      resume_summary:      nText(raw.resume_summary),
      ats_suggestions:     nList(raw.ats_suggestions),
      improved_bullets:    nList(raw.improved_bullets),
      interview_questions: nList(raw.interview_questions),
      tailor_my_resume: {
        improved_professional_summary: nText(t.improved_professional_summary),
        stronger_project_bullets:      nList(t.stronger_project_bullets),
        suggested_skills_keywords:     nList(t.suggested_skills_keywords),
      },
    });
  } catch (err) {
    res.status(err.status || 502).json({ error: err.message });
  }
};
