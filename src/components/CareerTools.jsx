import { useState, useRef } from 'react';

function e(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function chips(arr, cls) { return (arr||[]).map(s => `<span class="career-chip ${cls}">${e(s)}</span>`).join(''); }
function li(arr) { return (arr||[]).map(s => `<li>${e(s)}</li>`).join(''); }

async function ensurePdfJs() {
  if (window._pdfJsLoaded) return;
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      window._pdfJsLoaded = true;
      resolve();
    };
    s.onerror = () => reject(new Error('Failed to load PDF.js'));
    document.head.appendChild(s);
  });
}

async function extractPdfText(file) {
  await ensurePdfJs();
  const buf = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map(it => it.str).join(' '));
  }
  return pages.join('\n');
}

function buildOverleafHtml(data) {
  let h = '<div class="overleaf-paper">';
  if (data.name) h += `<div class="overleaf-name">${e(data.name)}</div>`;
  if (data.contact?.length) h += `<div class="overleaf-contact">${data.contact.map(c => e(c)).join(' | ')}</div>`;
  if (data.summary) {
    h += `<div class="overleaf-sec-title">Summary</div><hr class="overleaf-rule">`;
    h += `<p class="overleaf-summary">${e(data.summary)}</p>`;
  }
  if (data.experience?.length) {
    h += `<div class="overleaf-sec-title">Experience</div><hr class="overleaf-rule">`;
    for (const x of data.experience) {
      h += `<div class="overleaf-entry-row"><span><b>${e(x.title)}</b></span><span>${e(x.date)}</span></div>`;
      h += `<div class="overleaf-entry-sub"><span><i>${e(x.org)}</i></span><span><i>${e(x.location)}</i></span></div>`;
      if (x.bullets?.length) h += `<ul class="overleaf-list">${x.bullets.map(b => `<li>${e(b)}</li>`).join('')}</ul>`;
    }
  }
  if (data.projects?.length) {
    h += `<div class="overleaf-sec-title">Projects</div><hr class="overleaf-rule">`;
    for (const p of data.projects) {
      const head = p.tech ? `<b>${e(p.title)}</b> | <i>${e(p.tech)}</i>` : `<b>${e(p.title)}</b>`;
      h += `<div class="overleaf-entry-row"><span>${head}</span><span>${e(p.date||'')}</span></div>`;
      if (p.bullets?.length) h += `<ul class="overleaf-list">${p.bullets.map(b => `<li>${e(b)}</li>`).join('')}</ul>`;
    }
  }
  if (data.skills?.length) {
    h += `<div class="overleaf-sec-title">Technical Skills</div><hr class="overleaf-rule">`;
    h += data.skills.map(s => `<div class="overleaf-skill-row">${e(s)}</div>`).join('');
  }
  if (data.education?.length) {
    h += `<div class="overleaf-sec-title">Education</div><hr class="overleaf-rule">`;
    for (const ed of data.education) {
      h += `<div class="overleaf-entry-row"><span><b>${e(ed.institution)}</b></span><span>${e(ed.location||'')}</span></div>`;
      h += `<div class="overleaf-entry-sub"><span><i>${e(ed.degree||'')}</i></span><span><i>${e(ed.date||'')}</i></span></div>`;
    }
  }
  if (data.certifications?.length) {
    h += `<div class="overleaf-sec-title">Certifications</div><hr class="overleaf-rule">`;
    h += data.certifications.map(c => `<div class="overleaf-skill-row">• ${e(c)}</div>`).join('');
  }
  h += '</div>';
  return h;
}

export default function CareerTools() {
  const [resumeMode,   setResumeMode]   = useState('upload');
  const [file,         setFile]         = useState(null);
  const [resumeText,   setResumeText]   = useState('');
  const [pasteText,    setPasteText]    = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [jd,           setJd]           = useState('');
  const [scanScore,    setScanScore]    = useState(0);
  const [scanResults,  setScanResults]  = useState(null);
  const [actionResults,setActionResults]= useState(null);
  const [loading,      setLoading]      = useState(null); // 'scan'|'analyze'|'jobs'|'upgrade'
  const [latexStr,     setLatexStr]     = useState('');
  const fileInputRef = useRef(null);
  const originalPaneRef = useRef(null);

  async function getResumeText() {
    if (resumeMode === 'paste') return pasteText.trim();
    if (!file) return '';
    return extractPdfText(file);
  }

  function setFileData(f) {
    setFile(f);
  }

  async function handleScan() {
    setLoading('scan');
    setScanResults(null);
    setActionResults(null);
    try {
      const text = await getResumeText();
      if (!text) { alert('Upload a PDF or paste your resume text first.'); return; }
      setResumeText(text);
      setSelectedRole('');
      const res = await fetch('/api/career/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setScanScore(data.cv_score ?? 0);
      setScanResults(data);
    } catch (err) {
      setScanResults({ error: err.message });
    } finally {
      setLoading(null);
    }
  }

  async function careerAction(endpoint, loadingKey) {
    if (!resumeText) { setActionResults({ error: 'No resume text — please scan your resume first.' }); return; }
    setLoading(loadingKey);
    setActionResults(null);
    try {
      const body = { resume_text: resumeText, target_role: selectedRole };
      if (jd) body.job_description = jd;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      setActionResults({ error: err.message });
      return null;
    } finally {
      setLoading(null);
    }
  }

  async function handleAnalyze() {
    const data = await careerAction('/api/career/analyze', 'analyze');
    if (data) setActionResults({ type: 'analyze', data });
  }

  async function handleJobs() {
    if (!selectedRole) { setActionResults({ error: 'Select a role first.' }); return; }
    setLoading('jobs');
    setActionResults(null);
    try {
      const res = await fetch('/api/career/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setActionResults({ type: 'jobs', data });
    } catch (err) {
      setActionResults({ error: err.message });
    } finally {
      setLoading(null);
    }
  }

  async function handleUpgrade() {
    const data = await careerAction('/api/career/upgrade', 'upgrade');
    if (data) {
      if (data.latex_resume) setLatexStr(data.latex_resume);
      setActionResults({ type: 'upgrade', data });
      // Render original pane after state update
      setTimeout(() => fillOriginalPane(), 100);
    }
  }

  async function fillOriginalPane() {
    const el = originalPaneRef.current;
    if (!el) return;
    if (file) {
      try {
        await ensurePdfJs();
        const buf = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
        el.innerHTML = '';
        const availWidth = (el.parentElement?.clientWidth || el.clientWidth || 400) - 28;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const defaultVp = page.getViewport({ scale: 1 });
          const scale = availWidth / defaultVp.width;
          const vp = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = vp.width; canvas.height = vp.height;
          await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
          el.appendChild(canvas);
        }
        return;
      } catch {}
    }
    el.innerHTML = `<pre class="compare-text-pre">${e(resumeText)}</pre>`;
  }

  function copyLatex() {
    navigator.clipboard.writeText(latexStr).then(() => {});
  }

  function downloadLatex() {
    if (!latexStr) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([latexStr], { type: 'text/plain' }));
    a.download = 'resume.tex';
    a.click();
  }

  // ─── Render scan results ───────────────────────────────────────────
  function renderScanResults(data) {
    const score = data.cv_score ?? 0;
    const sc = score >= 75 ? 'career-score-high' : score >= 50 ? 'career-score-mid' : 'career-score-low';
    return (
      <div className="career-results-grid" style={{ marginTop: '20px' }}>
        <div className="career-result-card career-score-card">
          <div className="career-score-label">CV Score</div>
          <div className={`career-score-value ${sc}`}>{score}</div>
          <div className="career-score-sub">{data.current_status || ''}</div>
          {data.profile_summary && <p className="career-summary-text">{data.profile_summary}</p>}
        </div>
        <div className="career-result-card">
          <div className="career-card-title">Top Strengths</div>
          <div className="career-chips" dangerouslySetInnerHTML={{ __html: chips(data.top_strengths, 'chip-green') || '<span style="color:var(--text-faint)">—</span>' }} />
          <div className="career-card-title" style={{ marginTop: '14px' }}>Improvement Areas</div>
          <div className="career-chips" dangerouslySetInnerHTML={{ __html: chips(data.improvement_areas, 'chip-red') || '<span style="color:var(--text-faint)">—</span>' }} />
        </div>
        <div className="career-result-card career-full-width">
          <div className="career-card-title">Suggested Roles — select one to continue</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {(data.recommended_roles || []).map(r => (
              <button key={r} className={`career-role-chip ${selectedRole === r ? 'active' : ''}`}
                onClick={() => setSelectedRole(r)}>
                {r}
              </button>
            ))}
          </div>
          {selectedRole && (
            <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginBottom: '10px' }}>
                Selected: <strong style={{ color: 'var(--accent)' }}>{selectedRole}</strong>
              </div>
              <textarea className="career-textarea career-jd-textarea"
                placeholder="Paste the job description for deeper analysis (optional)…"
                style={{ marginBottom: '12px' }}
                value={jd} onChange={e => setJd(e.target.value)} />
              <div className="career-actions" style={{ marginBottom: 0 }}>
                <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading === 'analyze'}>
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="12" height="12"><circle cx="6" cy="6" r="4"/><path d="M10 10l2 2"/></svg>
                  {loading === 'analyze' ? 'Analyzing…' : 'Analyze Match'}
                </button>
                <button className="btn" onClick={handleJobs} disabled={loading === 'jobs'}>
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="12" height="12"><rect x="1" y="4" width="12" height="8" rx="1"/><path d="M4 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/></svg>
                  {loading === 'jobs' ? 'Searching…' : 'Find Jobs'}
                </button>
                <button className="btn" onClick={handleUpgrade} disabled={loading === 'upgrade'}>
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="12" height="12"><path d="M7 2v10M3 6l4-4 4 4"/></svg>
                  {loading === 'upgrade' ? 'Upgrading… (15–30s)' : 'Upgrade Resume'}
                </button>
              </div>
            </div>
          )}
        </div>
        {data.ats_suggestions?.length > 0 && (
          <div className="career-result-card career-full-width">
            <div className="career-card-title">ATS Suggestions</div>
            <ul className="career-list" dangerouslySetInnerHTML={{ __html: li(data.ats_suggestions) }} />
          </div>
        )}
        {data.improved_bullets?.length > 0 && (
          <div className="career-result-card career-full-width">
            <div className="career-card-title">Improved Bullet Points</div>
            <ul className="career-list career-list-bullets" dangerouslySetInnerHTML={{ __html: li(data.improved_bullets) }} />
          </div>
        )}
      </div>
    );
  }

  function renderActionResults(ar) {
    if (ar.error) return <div className="career-error">{ar.error}</div>;
    if (ar.type === 'analyze') return renderAnalysisResults(ar.data);
    if (ar.type === 'jobs') return renderJobResults(ar.data);
    if (ar.type === 'upgrade') return renderUpgradeResults(ar.data);
    return null;
  }

  function renderAnalysisResults(data) {
    const score = data.match_score ?? 0;
    const sc = score >= 75 ? 'career-score-high' : score >= 50 ? 'career-score-mid' : 'career-score-low';
    const tailor = data.tailor_my_resume || {};
    return (
      <div className="career-results-grid" style={{ marginTop: '16px' }}>
        <div className="career-result-card career-score-card">
          <div className="career-score-label">ATS Match Score</div>
          <div className={`career-score-value ${sc}`}>{score}</div>
          <div className="career-score-sub">out of 100</div>
          {data.resume_summary && <p className="career-summary-text">{data.resume_summary}</p>}
        </div>
        <div className="career-result-card">
          <div className="career-card-title">Skills Matched</div>
          <div className="career-chips" dangerouslySetInnerHTML={{ __html: chips(data.matching_skills, 'chip-green') || '<span style="color:var(--text-faint)">None identified</span>' }} />
          <div className="career-card-title" style={{ marginTop: '14px' }}>Missing Skills</div>
          <div className="career-chips" dangerouslySetInnerHTML={{ __html: chips(data.missing_skills, 'chip-red') || '<span style="color:var(--text-faint)">None</span>' }} />
        </div>
        {data.ats_suggestions?.length > 0 && (
          <div className="career-result-card career-full-width">
            <div className="career-card-title">ATS Suggestions</div>
            <ul className="career-list" dangerouslySetInnerHTML={{ __html: li(data.ats_suggestions) }} />
          </div>
        )}
        {data.improved_bullets?.length > 0 && (
          <div className="career-result-card career-full-width">
            <div className="career-card-title">Improved Bullet Points</div>
            <ul className="career-list career-list-bullets" dangerouslySetInnerHTML={{ __html: li(data.improved_bullets) }} />
          </div>
        )}
        {tailor.improved_professional_summary && (
          <div className="career-result-card career-full-width">
            <div className="career-card-title">Tailored Professional Summary</div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{tailor.improved_professional_summary}</p>
            {tailor.stronger_project_bullets?.length > 0 && (
              <>
                <div className="career-card-title" style={{ marginTop: '12px' }}>Stronger Project Bullets</div>
                <ul className="career-list career-list-bullets" dangerouslySetInnerHTML={{ __html: li(tailor.stronger_project_bullets) }} />
              </>
            )}
            {tailor.suggested_skills_keywords?.length > 0 && (
              <>
                <div className="career-card-title" style={{ marginTop: '12px' }}>Suggested Keywords</div>
                <div className="career-chips" dangerouslySetInnerHTML={{ __html: chips(tailor.suggested_skills_keywords, 'chip-green') }} />
              </>
            )}
          </div>
        )}
        {data.interview_questions?.length > 0 && (
          <div className="career-result-card career-full-width">
            <div className="career-card-title">Likely Interview Questions</div>
            <ul className="career-list" dangerouslySetInnerHTML={{ __html: li(data.interview_questions) }} />
          </div>
        )}
      </div>
    );
  }

  function renderJobResults(data) {
    const jobs = data.jobs || [];
    if (!jobs.length) {
      return <div className="career-error">No jobs found for "{data.query || selectedRole}". Try a broader role title.</div>;
    }
    return (
      <>
        <div style={{ marginTop: '16px', marginBottom: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
          {data.count || jobs.length} listings for <strong>{data.query || ''}</strong>
        </div>
        <div className="career-results-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
          {jobs.map((j, i) => (
            <div key={i} className="career-result-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>{j.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{j.company}{j.location ? ` · ${j.location}` : ''}</div>
                </div>
                {j.url && <a href={j.url} target="_blank" rel="noopener" className="btn btn-sm" style={{ flexShrink: 0, fontSize: '11px' }}>Apply</a>}
              </div>
              {j.salary && <div style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '6px' }}>{j.salary}</div>}
              {j.description && <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{j.description}…</div>}
              {j.created && <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '6px' }}>{j.created}</div>}
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderUpgradeResults(data) {
    const before = scanScore || data.ats_score_before || 0;
    const after  = data.ats_score_after ?? 0;
    const latex  = data.latex_resume || '';
    const overleafHtml = buildOverleafHtml(data);
    return (
      <div className="career-results-grid" style={{ marginTop: '16px' }}>
        <div className="career-result-card career-score-card">
          <div className="career-score-label">ATS Score</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', justifyContent: 'center' }}>
            <span className="career-score-value career-score-low" style={{ fontSize: '32px' }}>{before}</span>
            <svg viewBox="0 0 16 10" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" width="20"><path d="M1 9L8 1l7 8"/></svg>
            <span className="career-score-value career-score-high" style={{ fontSize: '32px' }}>{after}</span>
          </div>
          <div className="career-score-sub">before → after</div>
        </div>
        {data.improvement_summary && (
          <div className="career-result-card">
            <div className="career-card-title">Improvement Summary</div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{data.improvement_summary}</p>
            {data.key_improvements?.length > 0 && (
              <ul className="career-list" style={{ marginTop: '10px' }} dangerouslySetInnerHTML={{ __html: li(data.key_improvements) }} />
            )}
          </div>
        )}
        <div className="career-result-card career-full-width">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div className="career-card-title" style={{ margin: 0 }}>Resume Comparison</div>
            {latex && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-sm" onClick={copyLatex}>Copy LaTeX</button>
                <button className="btn btn-sm btn-primary" onClick={downloadLatex}>Download .tex</button>
              </div>
            )}
          </div>
          <div className="compare-split">
            <div className="compare-pane">
              <div className="compare-pane-label">Original</div>
              <div ref={originalPaneRef}><div className="career-loading"><span className="career-spinner" />  Rendering…</div></div>
            </div>
            <div className="compare-pane compare-pane-upgraded">
              <div className="compare-pane-label">Upgraded — Overleaf Preview</div>
              <div dangerouslySetInnerHTML={{ __html: overleafHtml }} />
            </div>
          </div>
          {latex && (
            <details style={{ marginTop: '12px' }}>
              <summary style={{ fontSize: '12px', color: 'var(--text-faint)', cursor: 'pointer', userSelect: 'none' }}>Show LaTeX source</summary>
              <textarea className="career-latex-area" spellCheck="false" readOnly style={{ marginTop: '8px' }} value={latex} onChange={() => {}} />
            </details>
          )}
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div className="page-title">Career Tools</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0' }}>
          ATS analysis, job search &amp; LaTeX resume export — powered by Groq AI.
        </p>
      </div>

      <div className="career-upload-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Your Resume</span>
          <div className="career-mode-tabs">
            <button className={`career-mode-tab ${resumeMode === 'upload' ? 'active' : ''}`} onClick={() => setResumeMode('upload')}>Upload PDF</button>
            <button className={`career-mode-tab ${resumeMode === 'paste' ? 'active' : ''}`} onClick={() => setResumeMode('paste')}>Paste Text</button>
          </div>
        </div>

        {resumeMode === 'upload' ? (
          <div className="career-upload-zone"
            onDragOver={ev => { ev.preventDefault(); ev.currentTarget.classList.add('drag-over'); }}
            onDragLeave={ev => ev.currentTarget.classList.remove('drag-over')}
            onDrop={ev => {
              ev.preventDefault(); ev.currentTarget.classList.remove('drag-over');
              const f = ev.dataTransfer?.files?.[0];
              if (f && f.type === 'application/pdf') setFileData(f);
            }}>
            <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }}
              onChange={ev => { const f = ev.target.files?.[0]; if (f) setFileData(f); }} />
            {file ? (
              <div className="career-file-selected">
                <svg viewBox="0 0 16 16" fill="none" stroke="#4caf50" strokeWidth="1.5" strokeLinecap="round" width="16" height="16"><path d="M2 8.5l4 4 8-8"/></svg>
                <span style={{ fontSize: '13px', color: 'var(--text)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                <button className="career-file-clear" onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} title="Remove">✕</button>
              </div>
            ) : (
              <div className="career-upload-prompt">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" style={{ color: 'var(--text-faint)', marginBottom: '10px' }}><rect x="5" y="2" width="18" height="24" rx="2"/><path d="M19 2v7h4M9 14h10M9 18h7"/></svg>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Drop your PDF here</div>
                <button className="btn btn-ghost btn-sm" type="button" onClick={() => fileInputRef.current?.click()}>Browse file</button>
              </div>
            )}
          </div>
        ) : (
          <textarea className="career-textarea" style={{ marginTop: '10px' }}
            placeholder="Paste your resume here — plain text works best…"
            value={pasteText} onChange={e => setPasteText(e.target.value)} />
        )}

        <button className="btn btn-primary" onClick={handleScan} disabled={loading === 'scan'}
          style={{ marginTop: '14px', alignSelf: 'flex-start' }}>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="12" height="12"><rect x="1" y="1" width="12" height="12" rx="2"/><path d="M4 7h6M4 4.5h6M4 9.5h4"/></svg>
          {loading === 'scan' ? (
            <><span className="career-spinner" /> Scanning…</>
          ) : 'Scan Resume'}
        </button>
      </div>

      {scanResults && (
        <div>
          {scanResults.error
            ? <div className="career-error" style={{ marginTop: '16px' }}>{scanResults.error}</div>
            : renderScanResults(scanResults)
          }
          {(loading === 'analyze' || loading === 'jobs' || loading === 'upgrade') && (
            <div className="career-loading" style={{ marginTop: '16px' }}>
              <span className="career-spinner" />
              {loading === 'analyze' ? ' Analyzing your resume…' : loading === 'jobs' ? ' Searching for jobs…' : ' Upgrading resume — this may take 15–30 s…'}
            </div>
          )}
          {actionResults && <div style={{ marginTop: '16px' }}>{renderActionResults(actionResults)}</div>}
        </div>
      )}
    </div>
  );
}
