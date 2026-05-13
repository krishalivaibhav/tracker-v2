// ── Groq helper ────────────────────────────────────────────────────────────
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

// ── LaTeX builder ──────────────────────────────────────────────────────────
function e(s) {
  const map = {
    '\\':'\\textbackslash{}','&':'\\&','%':'\\%','$':'\\$','#':'\\#',
    '_':'\\_','{':'\\{','}':'\\}','~':'\\textasciitilde{}','^':'\\textasciicircum{}',
    '–':'--','—':'---','•':'\\textbullet{}',
    '“':'``','”':"''",'\'':'`','’':"'",
  };
  return String(s||'').split('').map(c => map[c]!==undefined?map[c]:c).join('');
}

const PREAMBLE = String.raw`%-------------------------
% Resume in Latex — Jake Gutierrez template
%------------------------
\documentclass[letterpaper,11pt]{article}
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}
\pagestyle{fancy}\fancyhf{}\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}
\urlstyle{same}\raggedbottom\raggedright
\setlength{\tabcolsep}{0in}
\titleformat{\section}{\vspace{-4pt}\scshape\raggedright\large}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]
\pdfgentounicode=1
\newcommand{\resumeItem}[1]{\item\small{{#1 \vspace{-2pt}}}}
\newcommand{\resumeSubheading}[4]{\vspace{-2pt}\item
  \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
    \textbf{#1} & #2 \\
    \textit{\small#3} & \textit{\small #4} \\
  \end{tabular*}\vspace{-7pt}}
\newcommand{\resumeProjectHeading}[2]{\item
  \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
    \small#1 & #2 \\
  \end{tabular*}\vspace{-7pt}}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}
\begin{document}`;

function contactLinks(arr) {
  if (!arr?.length) return 'email $|$ linkedin $|$ github';
  return arr.map(t => {
    t = String(t).trim();
    if (t.includes('@')) return `\\href{mailto:${e(t)}}{\\underline{${e(t)}}}`;
    if (t.includes('linkedin.com') || t.includes('github.com') || t.startsWith('http')) {
      const url = t.startsWith('http') ? t : `https://${t}`;
      return `\\href{${e(url)}}{\\underline{${e(t)}}}`;
    }
    return e(t);
  }).join(' $|$ ');
}

function buildLatex(d) {
  let doc = PREAMBLE + '\n\n';
  doc += `%----------HEADING----------\n\\begin{center}\n    \\textbf{\\Huge \\scshape ${e(d.name||'Name')}} \\\\ \\vspace{1pt}\n    \\small ${contactLinks(d.contact)}\n\\end{center}\n\n`;

  if (d.summary) {
    doc += `%-----------SUMMARY-----------\n\\section{Summary}\n\\begin{itemize}[leftmargin=0.15in, label={}]\n  \\small{\\item{${e(d.summary)}}}\n\\end{itemize}\n\n`;
  }

  if (d.experience?.length) {
    doc += `%-----------EXPERIENCE-----------\n\\section{Experience}\n  \\resumeSubHeadingListStart\n\n`;
    for (const x of d.experience) {
      doc += `    \\resumeSubheading\n      {${e(x.title)}}{${e(x.date)}}\n      {${e(x.org)}}{${e(x.location)}}\n`;
      if (x.bullets?.length) {
        doc += `      \\resumeItemListStart\n`;
        for (const b of x.bullets) doc += `        \\resumeItem{${e(b)}}\n`;
        doc += `      \\resumeItemListEnd\n`;
      }
      doc += '\n';
    }
    doc += `  \\resumeSubHeadingListEnd\n\n`;
  }

  if (d.projects?.length) {
    doc += `%-----------PROJECTS-----------\n\\section{Projects}\n  \\resumeSubHeadingListStart\n\n`;
    for (const p of d.projects) {
      let heading = `\\textbf{${e(p.title)}}`;
      if (p.tech) heading += ` $|$ \\emph{${e(p.tech)}}`;
      doc += `    \\resumeProjectHeading\n      {${heading}}{${e(p.date||'')}}\n`;
      if (p.bullets?.length) {
        doc += `      \\resumeItemListStart\n`;
        for (const b of p.bullets) doc += `        \\resumeItem{${e(b)}}\n`;
        doc += `      \\resumeItemListEnd\n`;
      }
      doc += '\n';
    }
    doc += `  \\resumeSubHeadingListEnd\n\n`;
  }

  if (d.skills?.length) {
    const lines = d.skills.map(ln => {
      if (ln.includes(':')) {
        const [lbl, vals] = ln.split(':', 2);
        return `    \\textbf{${e(lbl.trim())}}{: ${e(vals.trim())}} \\\\`;
      }
      return `    ${e(ln)} \\\\`;
    }).join('\n').replace(/\s*\\\\$/, '');
    doc += `%-----------SKILLS-----------\n\\section{Skills}\n\\begin{itemize}[leftmargin=0.15in, label={}]\n  \\small{\\item{\n${lines}\n  }}\n\\end{itemize}\n\n`;
  }

  if (d.education?.length) {
    doc += `%-----------EDUCATION-----------\n\\section{Education}\n  \\resumeSubHeadingListStart\n`;
    for (const ed of d.education) {
      doc += `    \\resumeSubheading\n      {${e(ed.institution)}}{${e(ed.location||'')}}\n      {${e(ed.degree||'')}}{${e(ed.date||'')}}\n`;
    }
    doc += `  \\resumeSubHeadingListEnd\n\n`;
  }

  if (d.certifications?.length) {
    const lines = d.certifications.map(c => `    ${e(c)} \\\\`).join('\n').replace(/\s*\\\\$/, '');
    doc += `%-----------CERTIFICATIONS-----------\n\\section{Certifications}\n\\begin{itemize}[leftmargin=0.15in, label={}]\n  \\small{\\item{\n${lines}\n  }}\n\\end{itemize}\n\n`;
  }

  doc += '\\end{document}\n';
  return doc;
}

// ── Normalizers ─────────────────────────────────────────────────────────────
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

// ── Prompt ──────────────────────────────────────────────────────────────────
const SYSTEM = `
You are an expert ATS recruiter and resume writer.
Rewrite the candidate's resume to be ATS-optimized for the target role.
Return the COMPLETE improved resume as structured JSON. Return valid JSON only — no markdown.

Rules:
- Do not invent employers, degrees, dates, or projects not in the original resume.
- Preserve ALL experience and project entries; do not drop any.
- Rewrite bullets with strong action verbs, metrics, and quantified impact.
- Organize skills into 3–4 concise category lines like "Languages: Python, SQL".
- summary: 2–3 sentences, ATS-optimized, tailored to the target role.
- ats_score_after must be >= ats_score_before.
- contact: array of contact strings from the resume (email, LinkedIn, GitHub, phone).
- certifications: array of strings, or empty array.

Required JSON shape:
{
  "ats_score_before": 0,
  "ats_score_after": 0,
  "improvement_summary": "",
  "key_improvements": [],
  "name": "",
  "contact": [],
  "summary": "",
  "experience": [{"title":"","org":"","location":"","date":"","bullets":[]}],
  "projects": [{"title":"","tech":"","date":"","bullets":[]}],
  "skills": [],
  "education": [{"institution":"","location":"","degree":"","date":""}],
  "certifications": []
}
`.trim();

// ── Handler ─────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { resume_text, target_role, job_description } = req.body || {};
  if (!nText(resume_text))  return res.status(400).json({ error: 'resume_text is required.' });
  if (!nText(target_role))  return res.status(400).json({ error: 'target_role is required.' });

  const jd = nText(job_description)
    ? `Selected Role: ${target_role}\n\n${job_description}`
    : `Target Role: ${target_role}\nGenerate an ATS-optimized upgraded resume. Preserve section structure, improve clarity, keywords, and impact.`;

  const user = `Target Role / Job Context:\n${jd}\n\nCandidate Resume:\n${resume_text}`;

  try {
    const raw = await callGroq(SYSTEM, user);

    const before = nScore(raw.ats_score_before);
    let after    = nScore(raw.ats_score_after);
    if (after <= before) after = Math.min(100, before + 8);

    const latex = buildLatex(raw);

    res.json({
      ats_score_before:    before,
      ats_score_after:     after,
      improvement_summary: nText(raw.improvement_summary),
      key_improvements:    nList(raw.key_improvements),
      latex_resume:        latex,
      name:                nText(raw.name),
      contact:             nList(raw.contact),
      summary:             nText(raw.summary),
      experience: (raw.experience || []).map(x => ({
        title:    nText(x.title),   org:      nText(x.org),
        location: nText(x.location), date:    nText(x.date),
        bullets:  nList(x.bullets),
      })),
      projects: (raw.projects || []).map(p => ({
        title:   nText(p.title), tech:    nText(p.tech),
        date:    nText(p.date),  bullets: nList(p.bullets),
      })),
      skills: nList(raw.skills),
      education: (raw.education || []).map(ed => ({
        institution: nText(ed.institution), location: nText(ed.location),
        degree:      nText(ed.degree),      date:     nText(ed.date),
      })),
      certifications: nList(raw.certifications),
    });
  } catch (err) {
    res.status(err.status || 502).json({ error: err.message });
  }
};
