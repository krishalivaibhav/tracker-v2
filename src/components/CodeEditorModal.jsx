import { useEffect, useRef, useState } from 'react';
import { highlight } from '../utils/highlighter.js';
import { starterCode, buildProblemDesc } from '../utils/starterCode.js';
import { runCode } from '../utils/codeRunner.js';

export default function CodeEditorModal({ data, context, lang, codeStore, onClose, onLangChange, onMarkDone }) {
  const { si, ssi, pi } = context;
  const problem = data.steps[si].substeps[ssi].problems[pi];
  const codeKey = `${problem.s}-${lang}`;
  const initialCode = codeStore[codeKey] !== undefined ? codeStore[codeKey] : starterCode(problem, lang);

  const taRef     = useRef(null);
  const preRef    = useRef(null);
  const gutterRef = useRef(null);

  const [stdin,   setStdin]   = useState((problem.examples?.[0]?.input ?? ''));
  const [output,  setOutput]  = useState(null);
  const [running, setRunning] = useState(false);
  const [descHtml, setDescHtml] = useState(() => buildProblemDesc(problem));

  // Load problem description: try LeetCode first, then GFG
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
            if (!cancelled && d?.html) {
              setDescHtml(`<div class="lc-desc">${d.html}</div>`);
              return;
            }
          }
        } catch {}
      }
      if (gfg) {
        try {
          const r = await fetch(`/api/gfg?url=${encodeURIComponent(gfg)}`);
          if (!cancelled && r.ok) {
            const d = await r.json();
            if (!cancelled && d?.html) {
              setDescHtml(`<div class="gfg-desc">${d.html.replace(/\s*style="[^"]*"/g, '')}</div>`);
            }
          }
        } catch {}
      }
    }

    load();
    return () => { cancelled = true; };
  }, [problem.s]);

  // Set textarea value when lang or initial code changes
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.value = codeStore[`${problem.s}-${lang}`] !== undefined
      ? codeStore[`${problem.s}-${lang}`]
      : starterCode(problem, lang);
    refresh();
  }, [lang, problem.s]);

  // Initialize on mount
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.value = initialCode;
    refresh();
  }, []);

  function refresh() {
    const ta     = taRef.current;
    const pre    = preRef.current;
    const gutter = gutterRef.current;
    if (!ta || !pre || !gutter) return;
    pre.innerHTML = highlight(ta.value, lang) + '\n';
    const n = ta.value.split('\n').length;
    if (parseInt(gutter.dataset.n || '0') !== n) {
      gutter.dataset.n = String(n);
      gutter.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n');
    }
  }

  // Editor event listeners
  useEffect(() => {
    const ta     = taRef.current;
    const pre    = preRef.current;
    const gutter = gutterRef.current;
    if (!ta || !pre || !gutter) return;

    const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
    const OPEN  = new Set(Object.keys(PAIRS));
    const CLOSE = new Set(Object.values(PAIRS));

    const onInput  = () => refresh();
    const onScroll = () => { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; gutter.scrollTop = ta.scrollTop; };
    const onKeydown = e => {
      const s = ta.selectionStart, end = ta.selectionEnd, v = ta.value;
      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          const ls = v.lastIndexOf('\n', s-1)+1;
          const sp = v.slice(ls).match(/^ {1,4}/);
          if (sp) { ta.value = v.slice(0,ls)+v.slice(ls+sp[0].length); ta.selectionStart=ta.selectionEnd=Math.max(ls,s-sp[0].length); refresh(); }
        } else {
          ta.value = v.slice(0,s)+'    '+v.slice(end); ta.selectionStart=ta.selectionEnd=s+4; refresh();
        }
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const ls = v.lastIndexOf('\n', s-1)+1;
        const line = v.slice(ls, s);
        const ind  = line.match(/^(\s*)/)[1];
        const xtra = /[:{([{]\s*$/.test(line.trimEnd()) ? '    ' : '';
        const ins  = '\n' + ind + xtra;
        ta.value = v.slice(0,s)+ins+v.slice(end); ta.selectionStart=ta.selectionEnd=s+ins.length; refresh();
        return;
      }
      if (e.key === 'Backspace' && s === end) {
        const prev = v[s-1], next = v[s];
        if (prev && PAIRS[prev] === next) {
          e.preventDefault(); ta.value = v.slice(0,s-1)+v.slice(s+1); ta.selectionStart=ta.selectionEnd=s-1; refresh();
        }
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
      if (CLOSE.has(e.key) && v[s]===e.key && s===end) {
        e.preventDefault(); ta.selectionStart=ta.selectionEnd=s+1;
      }
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

  function getCurrentCode() {
    return taRef.current?.value || '';
  }

  function handleClose() {
    onClose(getCurrentCode());
  }

  function handleLangChange(newLang) {
    onLangChange(newLang, getCurrentCode());
  }

  async function handleRun() {
    setRunning(true);
    setOutput(null);
    try {
      const out = await runCode(lang, getCurrentCode(), stdin);
      setOutput(out.trim());
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="code-modal">
        <div className="code-modal-header">
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '2px' }}>
              Step {si+1} · {data.steps[si].name}
            </div>
            <div className="code-modal-title">{problem.t}</div>
          </div>
          <button className="btn btn-ghost" onClick={handleClose}>✕ Close</button>
        </div>

        <div className="code-modal-body">
          <div className="code-modal-desc" dangerouslySetInnerHTML={{ __html: descHtml }} />

          <div className="code-modal-editor-wrap">
            <div className="code-modal-toolbar">
              <select className="code-lang-select" value={lang} onChange={e => handleLangChange(e.target.value)}>
                <option value="python">Python 3</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>
              <button className="btn btn-primary btn-sm" onClick={handleRun} disabled={running}>
                {running ? (['cpp', 'c', 'java'].includes(lang) ? '⏳ Compiling…' : '⏳ Running…') : '▶ Run'}
              </button>
              {problem.lc && (
                <a
                  href={`https://leetcode.com/problems/${problem.lc}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm"
                >
                  LC ↗
                </a>
              )}
              {problem.gfg && (
                <a
                  href={problem.gfg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm"
                >
                  GFG ↗
                </a>
              )}
              <button
                className="btn btn-sm"
                onClick={() => onMarkDone(si, ssi, pi)}
                style={problem.done ? { background: 'var(--easy)', color: 'white', borderColor: 'var(--easy)' } : {}}
              >
                {problem.done ? 'Marked Solved ✓' : 'Mark as Solved'}
              </button>
            </div>

            <div className="stdin-wrap">
              <div className="stdin-label">Stdin</div>
              <textarea
                className="stdin-textarea"
                placeholder="Input for your program (one value per line)…"
                spellCheck="false"
                value={stdin}
                onChange={e => setStdin(e.target.value)}
              />
            </div>

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

            {output !== null && (
              <div className="code-output-wrap">
                <div className="code-output-label">Output</div>
                <pre className="code-output-pre">{output}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
