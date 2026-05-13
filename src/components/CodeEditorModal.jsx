import { useEffect, useRef, useState } from 'react';
import { highlight } from '../utils/highlighter.js';
import { starterCode, buildProblemDesc } from '../utils/starterCode.js';
import { runCode } from '../utils/codeRunner.js';

function initCases(problem) {
  const exs = problem.examples || [];
  if (exs.length === 0) return [{ input: '', expected: '', actual: null, status: null }];
  return exs.map(ex => ({
    input:    String(ex.input  ?? '').trim(),
    expected: String(ex.output ?? '').trim(),
    actual: null, status: null,
  }));
}

export default function CodeEditorModal({ data, context, lang, codeStore, onClose, onLangChange, onMarkDone }) {
  const { si, ssi, pi } = context;
  const problem = data.steps[si].substeps[ssi].problems[pi];
  const initialCode = codeStore[`${problem.s}-${lang}`] !== undefined
    ? codeStore[`${problem.s}-${lang}`]
    : starterCode(problem, lang);

  const taRef     = useRef(null);
  const preRef    = useRef(null);
  const gutterRef = useRef(null);

  const [cases,       setCases]       = useState(() => initCases(problem));
  const [activeCase,  setActiveCase]  = useState(0);
  const [running,     setRunning]     = useState(false);
  const [descHtml,    setDescHtml]    = useState(() => buildProblemDesc(problem));
  const [mobilePanel, setMobilePanel] = useState('code');

  // Clear results when language changes (old output no longer valid)
  useEffect(() => {
    setCases(prev => prev.map(c => ({ ...c, actual: null, status: null })));
  }, [lang]);

  // Load LC / GFG description
  useEffect(() => {
    const { lc, gfg } = problem;
    if (!lc && !gfg) return;
    let cancelled = false;
    async function load() {
      if (lc) {
        try {
          const r = await fetch(`/api/leetcode?slug=${encodeURIComponent(lc)}`);
          if (!cancelled && r.ok) {
            const d = await r.json();
            if (!cancelled && d?.html) { setDescHtml(`<div class="lc-desc">${d.html}</div>`); return; }
          }
        } catch {}
      }
      if (gfg) {
        try {
          const r = await fetch(`/api/gfg?url=${encodeURIComponent(gfg)}`);
          if (!cancelled && r.ok) {
            const d = await r.json();
            if (!cancelled && d?.html) { setDescHtml(`<div class="gfg-desc">${d.html.replace(/\s*style="[^"]*"/g, '')}</div>`); }
          }
        } catch {}
      }
    }
    load();
    return () => { cancelled = true; };
  }, [problem.s]);

  // Sync editor when language or problem changes
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.value = codeStore[`${problem.s}-${lang}`] !== undefined
      ? codeStore[`${problem.s}-${lang}`]
      : starterCode(problem, lang);
    refresh();
  }, [lang, problem.s]);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.value = initialCode;
    refresh();
  }, []);

  function refresh() {
    const ta = taRef.current, pre = preRef.current, gutter = gutterRef.current;
    if (!ta || !pre || !gutter) return;
    pre.innerHTML = highlight(ta.value, lang) + '\n';
    const n = ta.value.split('\n').length;
    if (parseInt(gutter.dataset.n || '0') !== n) {
      gutter.dataset.n = String(n);
      gutter.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n');
    }
  }

  useEffect(() => {
    const ta = taRef.current, pre = preRef.current, gutter = gutterRef.current;
    if (!ta || !pre || !gutter) return;
    const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
    const OPEN = new Set(Object.keys(PAIRS)), CLOSE = new Set(Object.values(PAIRS));
    const onInput  = () => refresh();
    const onScroll = () => { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; gutter.scrollTop = ta.scrollTop; };
    const onKeydown = e => {
      const s = ta.selectionStart, end = ta.selectionEnd, v = ta.value;
      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          const ls = v.lastIndexOf('\n', s-1)+1, sp = v.slice(ls).match(/^ {1,4}/);
          if (sp) { ta.value = v.slice(0,ls)+v.slice(ls+sp[0].length); ta.selectionStart=ta.selectionEnd=Math.max(ls,s-sp[0].length); refresh(); }
        } else {
          ta.value = v.slice(0,s)+'    '+v.slice(end); ta.selectionStart=ta.selectionEnd=s+4; refresh();
        }
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const ls = v.lastIndexOf('\n', s-1)+1, line = v.slice(ls, s);
        const ind = line.match(/^(\s*)/)[1], xtra = /[:{([{]\s*$/.test(line.trimEnd()) ? '    ' : '';
        const ins = '\n' + ind + xtra;
        ta.value = v.slice(0,s)+ins+v.slice(end); ta.selectionStart=ta.selectionEnd=s+ins.length; refresh();
        return;
      }
      if (e.key === 'Backspace' && s === end) {
        const prev = v[s-1], next = v[s];
        if (prev && PAIRS[prev] === next) { e.preventDefault(); ta.value = v.slice(0,s-1)+v.slice(s+1); ta.selectionStart=ta.selectionEnd=s-1; refresh(); }
        return;
      }
      if (OPEN.has(e.key) && !e.ctrlKey && !e.metaKey) {
        const cl = PAIRS[e.key];
        if ((e.key==='"'||e.key==="'") && /\w/.test(v[end])) return;
        e.preventDefault();
        const sel = v.slice(s,end);
        if (sel) { ta.value=v.slice(0,s)+e.key+sel+cl+v.slice(end); ta.selectionStart=s+1; ta.selectionEnd=end+1; }
        else     { ta.value=v.slice(0,s)+e.key+cl+v.slice(end); ta.selectionStart=ta.selectionEnd=s+1; }
        refresh(); return;
      }
      if (CLOSE.has(e.key) && v[s]===e.key && s===end) { e.preventDefault(); ta.selectionStart=ta.selectionEnd=s+1; }
    };
    ta.addEventListener('input',   onInput);
    ta.addEventListener('scroll',  onScroll);
    ta.addEventListener('keydown', onKeydown);
    return () => {
      ta.removeEventListener('input',   onInput);
      ta.removeEventListener('scroll',  onScroll);
      ta.removeEventListener('keydown', onKeydown);
    };
  }, [lang]);

  function getCurrentCode() { return taRef.current?.value || ''; }
  function handleClose()    { onClose(getCurrentCode()); }
  function handleLangChange(newLang) { onLangChange(newLang, getCurrentCode()); }

  function updateCase(i, field, val) {
    setCases(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val, actual: null, status: null } : c));
  }

  async function handleRun() {
    setRunning(true);
    const code    = getCurrentCode();
    const results = await Promise.allSettled(cases.map(c => runCode(lang, code, c.input)));
    setCases(prev => prev.map((c, i) => {
      const r = results[i];
      if (r.status === 'fulfilled') {
        const actual   = r.value.trim();
        const expected = c.expected.trim();
        return { ...c, actual, status: !expected ? 'run' : actual === expected ? 'pass' : 'fail' };
      }
      return { ...c, actual: 'Error: ' + (r.reason?.message || 'unknown'), status: 'error' };
    }));
    setRunning(false);
  }

  function addCase() {
    setCases(prev => [...prev, { input: '', expected: '', actual: null, status: null }]);
    setActiveCase(cases.length);
  }

  const cur = cases[activeCase] || cases[0];

  const verdictLabel = {
    pass:  '✓ Correct',
    fail:  '✗ Wrong Answer',
    error: '⚠ Error',
    run:   'Output',
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="code-modal">

        {/* Header */}
        <div className="code-modal-header">
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '2px' }}>
              Step {si+1} · {data.steps[si].name}
            </div>
            <div className="code-modal-title">{problem.t}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Mobile-only panel toggle */}
            <div className="mobile-panel-toggle">
              <button className={`mpanel-btn ${mobilePanel === 'desc' ? 'active' : ''}`} onClick={() => setMobilePanel('desc')}>Problem</button>
              <button className={`mpanel-btn ${mobilePanel === 'code' ? 'active' : ''}`} onClick={() => setMobilePanel('code')}>Code</button>
            </div>
            <button className="btn btn-ghost" onClick={handleClose}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="code-modal-body">

          {/* Left: description */}
          <div
            className={`code-modal-desc${mobilePanel !== 'desc' ? ' mobile-hidden' : ''}`}
            dangerouslySetInnerHTML={{ __html: descHtml }}
          />

          {/* Right: editor + test cases */}
          <div className={`code-modal-editor-wrap${mobilePanel !== 'code' ? ' mobile-hidden' : ''}`}>

            {/* Toolbar */}
            <div className="code-modal-toolbar">
              <select className="code-lang-select" value={lang} onChange={e => handleLangChange(e.target.value)}>
                <option value="python">Python 3</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>
              <button className="btn btn-primary btn-sm" onClick={handleRun} disabled={running}>
                {running ? (['cpp','c','java'].includes(lang) ? '⏳ Compiling…' : '⏳ Running…') : '▶ Run'}
              </button>
              {problem.lc && (
                <a href={`https://leetcode.com/problems/${problem.lc}/`} target="_blank" rel="noopener noreferrer" className="btn btn-sm">LC ↗</a>
              )}
              {problem.gfg && (
                <a href={problem.gfg} target="_blank" rel="noopener noreferrer" className="btn btn-sm">GFG ↗</a>
              )}
              <button
                className="btn btn-sm"
                onClick={() => onMarkDone(si, ssi, pi)}
                style={problem.done ? { background: 'var(--easy)', color: '#fff', borderColor: 'var(--easy)' } : {}}
              >
                {problem.done ? '✓ Solved' : 'Mark Solved'}
              </button>
            </div>

            {/* Code editor */}
            <div className="editor-root">
              <div className="editor-gutter" ref={gutterRef} />
              <div className="editor-main">
                <pre className="editor-pre" ref={preRef} aria-hidden="true" />
                <textarea
                  ref={taRef}
                  className="editor-textarea"
                  spellCheck="false"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              </div>
            </div>

            {/* Test cases */}
            <div className="test-cases-wrap">
              <div className="test-cases-bar">
                {cases.map((c, i) => (
                  <button
                    key={i}
                    className={`test-tab${activeCase === i ? ' active' : ''}${c.status ? ` tc-${c.status}` : ''}`}
                    onClick={() => setActiveCase(i)}
                  >
                    Case {i + 1}
                    {c.status === 'pass'  && <span className="tc-icon pass-icon">✓</span>}
                    {c.status === 'fail'  && <span className="tc-icon fail-icon">✗</span>}
                    {c.status === 'error' && <span className="tc-icon err-icon">!</span>}
                  </button>
                ))}
                <button className="test-tab-add" onClick={addCase} title="Add test case">+</button>
              </div>

              <div className="test-io-grid">
                <div>
                  <div className="stdin-label">Input</div>
                  <textarea
                    className="stdin-textarea"
                    value={cur.input}
                    onChange={e => updateCase(activeCase, 'input', e.target.value)}
                    placeholder="stdin…"
                    spellCheck="false"
                  />
                </div>
                <div>
                  <div className="stdin-label">Expected</div>
                  <textarea
                    className="stdin-textarea"
                    value={cur.expected}
                    onChange={e => updateCase(activeCase, 'expected', e.target.value)}
                    placeholder="expected output…"
                    spellCheck="false"
                  />
                </div>
              </div>

              {cur.actual !== null && (
                <div className={`verdict-wrap tc-${cur.status}`}>
                  <span className="verdict-badge">{verdictLabel[cur.status] || 'Output'}</span>
                  <pre className="verdict-pre">{cur.actual}</pre>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
