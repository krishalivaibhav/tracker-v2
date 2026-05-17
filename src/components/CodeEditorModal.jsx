import { useEffect, useRef, useState, useCallback } from 'react';
import { highlight } from '../utils/highlighter.js';
import { starterCode, splitStarterCode, extractStoredBody, buildProblemDesc } from '../utils/starterCode.js';
import { runCode } from '../utils/codeRunner.js';

const HINT_LABELS = ['Nudge', 'Hint', 'Approach', 'Full Solution'];
const HINT_DESCS  = [
  'A question to point you in the right direction',
  'The key pattern or technique',
  'Step-by-step algorithm',
  'Complete solution walkthrough',
];

const PROVIDERS = {
  groq:      { name: 'Groq',   label: 'Free' },
  openai:    { name: 'OpenAI', label: null },
  gemini:    { name: 'Gemini', label: null },
  anthropic: { name: 'Claude', label: null },
};

// Shown before a key is tested — minimal placeholders
const FALLBACK_MODELS = {
  groq:      ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
  openai:    [],
  gemini:    [],
  anthropic: [],
};

const DEFAULT_CONFIG = { provider: 'groq', model: 'llama-3.3-70b-versatile', keys: {}, verifiedModels: {} };

function loadConfig() {
  try { return { ...DEFAULT_CONFIG, ...JSON.parse(localStorage.getItem('mentor_config') || '{}') }; }
  catch { return DEFAULT_CONFIG; }
}

function friendlyError(msg = '') {
  const m = msg.toLowerCase();
  if (m.includes('429') || m.includes('rate limit') || m.includes('quota'))
    return 'Rate limit / quota exceeded — wait a moment or check your plan.';
  if (m.includes('401') || m.includes('invalid') || m.includes('incorrect') || m.includes('api key'))
    return 'Invalid API key — double-check it on your provider dashboard.';
  if (m.includes('403')) return 'Access denied — your key may not have permission for this model.';
  if (m.includes('fetch') || m.includes('network')) return 'Network error — check your connection.';
  return msg || 'Connection failed — try again.';
}

const GEAR_SVG = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <circle cx="8" cy="8" r="2.5"/>
    <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M3.2 12.8l1.1-1.1M11.7 4.3l1.1-1.1"/>
  </svg>
);

function MentorSettings({ config, onChange }) {
  const needsKey   = config.provider !== 'groq';
  const currentKey = config.keys?.[config.provider] || '';
  const [testState, setTestState] = useState(null); // null | 'testing' | 'ok' | 'error'
  const [testMsg,   setTestMsg]   = useState('');
  const [verified,  setVerified]  = useState(false);

  // When provider changes, check if we already have verified models for it
  const savedModels = config.verifiedModels?.[config.provider] || FALLBACK_MODELS[config.provider] || [];

  async function handleTest() {
    setTestState('testing');
    setTestMsg('');
    setVerified(false);
    try {
      const res = await fetch('/api/dsa/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action:       'list_models',
          provider:     config.provider,
          user_api_key: needsKey ? currentKey : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
      const models = data.models || [];
      if (!models.length) throw new Error('No models returned — key may be invalid.');

      // Persist verified models and auto-select first
      const nextConfig = {
        ...config,
        model: models.includes(config.model) ? config.model : models[0],
        verifiedModels: { ...config.verifiedModels, [config.provider]: models },
      };
      onChange(nextConfig);
      setTestState('ok');
      setTestMsg(`Connected · ${models.length} model${models.length !== 1 ? 's' : ''} available.`);
      setVerified(true);
    } catch (err) {
      setTestState('error');
      setTestMsg(friendlyError(err.message));
    }
  }

  const modelList = verified
    ? (config.verifiedModels?.[config.provider] || savedModels)
    : savedModels;

  return (
    <div className={`mentor-settings-panel${verified ? ' verified' : ''}`}>
      <div className="mentor-settings-label">AI Provider</div>
      <div className="mentor-provider-pills">
        {Object.entries(PROVIDERS).map(([id, p]) => (
          <button
            key={id}
            className={`mentor-provider-pill${config.provider === id ? ' active' : ''}`}
            onClick={() => {
              setTestState(null); setTestMsg(''); setVerified(false);
              const prev = { ...DEFAULT_CONFIG, ...config };
              const prevModels = prev.verifiedModels?.[id] || FALLBACK_MODELS[id] || [];
              onChange({ ...prev, provider: id, model: prevModels[0] || '' });
            }}
          >
            {p.name}
            {p.label && <span className="mentor-provider-badge">{p.label}</span>}
          </button>
        ))}
      </div>

      {needsKey && (
        <>
          <div className="mentor-settings-label" style={{ marginTop: '10px' }}>
            API Key
            <span className="mentor-key-hint"> · saved in browser only, never stored on our server</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="password"
              className="mentor-key-input"
              placeholder={`Paste your ${PROVIDERS[config.provider].name} API key…`}
              value={currentKey}
              onChange={e => {
                setTestState(null); setTestMsg(''); setVerified(false);
                onChange({ ...config, keys: { ...config.keys, [config.provider]: e.target.value } });
              }}
              autoComplete="off"
            />
            <button
              className={`mentor-test-btn${testState === 'ok' ? ' ok' : testState === 'error' ? ' err' : ''}`}
              onClick={handleTest}
              disabled={!currentKey || testState === 'testing'}
            >
              {testState === 'testing' ? '…' : testState === 'ok' ? '✓' : testState === 'error' ? '✗' : 'Test'}
            </button>
          </div>
          {testMsg && (
            <div className={`mentor-test-msg${testState === 'ok' ? ' ok' : ' err'}`}>{testMsg}</div>
          )}
          {!currentKey && (
            <div className="mentor-key-warning">Paste your API key then click Test to load available models.</div>
          )}
          {currentKey && !testMsg && (
            <div className="mentor-key-warning" style={{ color: 'var(--text-faint)' }}>Click Test to verify your key and load available models.</div>
          )}
        </>
      )}

      {modelList.length > 0 && (
        <>
          <div className="mentor-settings-label" style={{ marginTop: '10px' }}>
            Model {needsKey && !verified && savedModels.length > 0 && <span className="mentor-key-hint">(from last verified session)</span>}
          </div>
          <select
            className="mentor-model-select"
            value={config.model}
            onChange={e => onChange({ ...config, model: e.target.value })}
          >
            {modelList.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </>
      )}
    </div>
  );
}

function extractBodyFromAI(code, langName) {
  const trimmed = code.trim();

  // Only strip class Solution wrappers (LeetCode style) — everything else is passed through
  // intact. Stripping standalone defs/imports causes data loss (code after the def gets dropped).
  if (langName === 'python') {
    const lines = trimmed.split('\n');
    const classIdx = lines.findIndex(l => /^class\s+\w+/.test(l));
    if (classIdx !== -1) {
      const defIdx = lines.findIndex((l, i) => i > classIdx && /^\s+def\s+/.test(l));
      if (defIdx !== -1) {
        const bodyIndent = (lines[defIdx].match(/^(\s+)/)?.[1] || '    ') + '    ';
        const bodyLines = [];
        for (let i = defIdx + 1; i < lines.length; i++) {
          const line = lines[i];
          if (line.trim() === '') { bodyLines.push(''); continue; }
          if (!line.startsWith(bodyIndent)) break;
          bodyLines.push(line.slice(bodyIndent.length));
        }
        while (bodyLines.length && !bodyLines[bodyLines.length - 1].trim()) bodyLines.pop();
        if (bodyLines.length) return bodyLines.join('\n') + '\n';
      }
    }
  }

  return trimmed + '\n';
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseLCExamples(html) {
  const examples = [];
  // Isolate each <pre> block
  const preRe = /<pre>([\s\S]*?)<\/pre>/gi;
  let m;
  while ((m = preRe.exec(html)) !== null) {
    // Strip all HTML tags, decode common entities, normalise whitespace
    const text = m[1]
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
      .trim();
    const inM  = text.match(/Input:\s*([\s\S]*?)(?=Output:|$)/i);
    const outM = text.match(/Output:\s*([\s\S]*?)(?=Explanation:|Constraints:|$)/i);
    if (inM && outM) {
      const input    = inM[1].trim();
      const expected = outM[1].trim();
      if (input && expected) examples.push({ input, expected });
    }
  }
  return examples;
}

function MsgBody({ content, isStreaming, onSendToEditor }) {
  if (!content) return isStreaming ? <span className="mentor-cursor" /> : null;

  // Split on fenced code blocks: ```lang\ncode\n```
  const parts = content.split(/(```[\w]*\n[\s\S]*?```)/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^```([\w]*)\n([\s\S]*?)```$/);
        if (m) {
          const codeLang = m[1] || 'code';
          const code     = m[2];
          return (
            <div key={i} className="mentor-code-block">
              <div className="mentor-code-header">
                <span className="mentor-code-lang">{codeLang}</span>
                {!isStreaming && (
                  <button className="mentor-code-send" onClick={() => onSendToEditor(code)}>
                    → Send to Editor
                  </button>
                )}
              </div>
              <pre className="mentor-code-pre">{code}</pre>
            </div>
          );
        }
        return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
      })}
    </>
  );
}

function MentorPanel({ problem, descHtml, lang, getCurrentCode, boilerplateHeader, boilerplateFooter, onSendToEditor, messages, setMessages, prefill, onClearPrefill }) {
  const [input,        setInput]        = useState('');
  const [streaming,    setStreaming]    = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [config,       setConfig]       = useState(loadConfig);
  const scrollRef = useRef(null);
  const abortRef  = useRef(null);

  useEffect(() => {
    if (prefill) { setInput(prefill); onClearPrefill?.(); }
  }, [prefill]);

  function updateConfig(next) {
    setConfig(next);
    localStorage.setItem('mentor_config', JSON.stringify(next));
  }

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const ask = useCallback(async (level, customText) => {
    if (streaming) return;
    if (abortRef.current) abortRef.current.abort();

    const userMsg = customText ?? HINT_LABELS[level];
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch('/api/dsa/hint', {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_title:      problem.t,
          problem_slug:       problem.lc || null,
          problem_desc:       stripHtml(descHtml).slice(0, 3000),
          problem_type:       'custom',
          user_code:          getCurrentCode(),
          boilerplate_header: boilerplateHeader || '',
          boilerplate_footer: boilerplateFooter || '',
          lang,
          messages:           newMessages.map(m => ({ role: m.role, content: m.content })),
          level:              level ?? -1,
          provider:           config.provider,
          model:              config.model,
          user_api_key:       config.provider !== 'groq' ? (config.keys?.[config.provider] || '') : undefined,
        }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') continue;
          try {
            const chunk = JSON.parse(payload);
            if (chunk.error) throw new Error(chunk.error);
            if (chunk.token) {
              setMessages(prev => {
                const up = [...prev];
                up[up.length - 1] = { ...up[up.length - 1], content: up[up.length - 1].content + chunk.token };
                return up;
              });
            }
          } catch (parseErr) {
            if (parseErr.message && !parseErr.message.startsWith('JSON')) throw parseErr;
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setMessages(prev => {
        const up = [...prev];
        up[up.length - 1] = { ...up[up.length - 1], content: `Error: ${err.message}` };
        return up;
      });
    } finally {
      setStreaming(false);
    }
  }, [streaming, messages, setMessages, problem, descHtml, lang, getCurrentCode]);

  function handleSend() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput('');
    ask(-1, text);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  const providerName = PROVIDERS[config.provider]?.name || config.provider;
  const hasKey = config.provider === 'groq' || !!(config.keys?.[config.provider]);

  return (
    <div className="mentor-panel">
      <div className="mentor-intro">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <div className="mentor-intro-title">AI Mentor</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              className={`mentor-gear-btn${settingsOpen ? ' active' : ''}`}
              onClick={() => setSettingsOpen(v => !v)}
              title="Model settings"
            >
              {GEAR_SVG}
              <span style={{ fontSize: '11px' }}>{providerName} · {config.model.split('-').slice(0,2).join('-')}</span>
            </button>
            {messages.length > 0 && (
              <button
                className="mentor-new-chat-btn"
                onClick={() => { if (abortRef.current) abortRef.current.abort(); setMessages([]); }}
                title="Start a new chat"
              >
                + New chat
              </button>
            )}
          </div>
        </div>
        {settingsOpen && <MentorSettings config={config} onChange={updateConfig} />}
        {!settingsOpen && (
          <div className="mentor-intro-sub">
            {hasKey
              ? `Using ${config.model} · code blocks go straight to the editor.`
              : `⚠ Add a ${providerName} API key in settings to start.`}
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="mentor-messages" ref={scrollRef}>
          {messages.map((m, i) => {
            const isLast = i === messages.length - 1;
            return (
              <div key={i} className={`mentor-msg mentor-msg-${m.role}`}>
                {m.role === 'assistant' && <div className="mentor-msg-label">Mentor</div>}
                {m.role === 'user'      && <div className="mentor-msg-label you">You</div>}
                <div className="mentor-msg-body">
                  <MsgBody
                    content={m.content}
                    isStreaming={streaming && isLast && m.role === 'assistant'}
                    onSendToEditor={onSendToEditor}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mentor-quick-btns">
        {HINT_LABELS.map((label, lvl) => (
          <button key={lvl} className="mentor-quick-btn" onClick={() => ask(lvl)}
            disabled={streaming || !hasKey} title={HINT_DESCS[lvl]}>
            {label}
          </button>
        ))}
      </div>

      <div className="mentor-input-row">
        <textarea
          className="mentor-input"
          placeholder="Ask anything about this problem…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={2}
          disabled={streaming}
        />
        <button className="mentor-send-btn" onClick={handleSend} disabled={!input.trim() || streaming || !hasKey}>
          {streaming ? '…' : '↑'}
        </button>
      </div>
    </div>
  );
}

function initCases(problem) {
  const exs = problem.examples || [];
  if (exs.length === 0) return [{ input: '', expected: '', actual: null, status: null }];
  return exs.map(ex => ({
    input:    String(ex.input  ?? '').trim(),
    expected: String(ex.output ?? '').trim(),
    actual: null, status: null,
  }));
}

function countDisplayLines(s) {
  if (!s) return 0;
  const parts = s.split('\n');
  return parts.length - (s.endsWith('\n') ? 1 : 0);
}

function resizeBoilerplateTa(ta) {
  if (!ta) return;
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 'px';
}

export default function CodeEditorModal({ data, context, lang, codeStore, onClose, onLangChange, onMarkDone }) {
  const { si, ssi, pi } = context;
  const problem = data.steps[si].substeps[ssi].problems[pi];

  // Compute 3-section split defaults for current problem + lang
  const { header, body: defaultBody, footer } = splitStarterCode(problem, lang);

  // Load initial values — support new { h, b, f } format and old string format
  const [initHeader, initBody, initFooter] = (() => {
    const stored = codeStore[`${problem.s}-${lang}`];
    if (!stored) return [header, defaultBody, footer];
    if (typeof stored === 'object' && 'b' in stored)
      return [stored.h ?? header, stored.b ?? defaultBody, stored.f ?? footer];
    // Old string format: full code stored as one string
    return [header, extractStoredBody(stored, header, footer), footer];
  })();

  const taRef        = useRef(null);
  const preRef       = useRef(null);
  const gutterRef    = useRef(null);
  const headerTaRef  = useRef(null);
  const footerTaRef  = useRef(null);
  const casesInitRef = useRef(false);
  const headerRef    = useRef(initHeader); // tracks current header textarea value for body gutter offset

  const [cases,          setCases]          = useState(() => initCases(problem));
  const [activeCase,     setActiveCase]     = useState(0);
  const [running,        setRunning]        = useState(false);
  const [descHtml,       setDescHtml]       = useState(() => buildProblemDesc(problem));
  const [mobilePanel,    setMobilePanel]    = useState('desc');
  const [leftPanel,      setLeftPanel]      = useState('desc');
  const [mentorMessages, setMentorMessages] = useState([]);
  const [mentorPrefill,  setMentorPrefill]  = useState(null);
  const [elapsed,        setElapsed]        = useState(0);
  const [headerLines,    setHeaderLines]    = useState(() => countDisplayLines(initHeader));
  const [bodyLineCount,  setBodyLineCount]  = useState(() => initBody.split('\n').length);
  const [footerLines,    setFooterLines]    = useState(() => countDisplayLines(initFooter));
  const timerRef = useRef(null);
  const startRef = useRef(Date.now());

  // Stopwatch
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

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
            if (!cancelled && d?.html) {
              setDescHtml(`<div class="lc-desc">${d.html}</div>`);
              if (!casesInitRef.current) {
                const parsed = parseLCExamples(d.html);
                if (parsed.length > 0) {
                  setCases(parsed.map(ex => ({ ...ex, actual: null, status: null })));
                  setActiveCase(0);
                  casesInitRef.current = true;
                }
              }
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
            if (!cancelled && d?.html) { setDescHtml(`<div class="gfg-desc">${d.html.replace(/\s*style="[^"]*"/g, '')}</div>`); }
          }
        } catch {}
      }
    }
    load();
    return () => { cancelled = true; };
  }, [problem.s]);

  // Sync all 3 sections when language or problem changes
  useEffect(() => {
    const { header: h, body: defBody, footer: f } = splitStarterCode(problem, lang);
    const stored = codeStore[`${problem.s}-${lang}`];
    let newH, newB, newF;
    if (stored && typeof stored === 'object' && 'b' in stored) {
      newH = stored.h ?? h; newB = stored.b ?? defBody; newF = stored.f ?? f;
    } else if (typeof stored === 'string') {
      newH = h; newB = extractStoredBody(stored, h, f); newF = f;
    } else {
      newH = h; newB = defBody; newF = f;
    }
    if (headerTaRef.current) { headerTaRef.current.value = newH; resizeBoilerplateTa(headerTaRef.current); }
    if (taRef.current) taRef.current.value = newB;
    if (footerTaRef.current) { footerTaRef.current.value = newF; resizeBoilerplateTa(footerTaRef.current); }
    headerRef.current = newH;
    setHeaderLines(countDisplayLines(newH));
    setFooterLines(countDisplayLines(newF));
    refresh();
  }, [lang, problem.s]);

  useEffect(() => {
    if (taRef.current) taRef.current.value = initBody;
    if (headerTaRef.current) { headerTaRef.current.value = initHeader; resizeBoilerplateTa(headerTaRef.current); }
    if (footerTaRef.current) { footerTaRef.current.value = initFooter; resizeBoilerplateTa(footerTaRef.current); }
    refresh();
  }, []);

  function refresh() {
    const ta = taRef.current, pre = preRef.current, gutter = gutterRef.current;
    if (!ta || !pre || !gutter) return;
    pre.innerHTML = highlight(ta.value, lang) + '\n';
    const n = ta.value.split('\n').length;
    const offset = countDisplayLines(headerRef.current || '');
    if (parseInt(gutter.dataset.n || '0') !== n || parseInt(gutter.dataset.o || '0') !== offset) {
      gutter.dataset.n = String(n);
      gutter.dataset.o = String(offset);
      gutter.textContent = Array.from({ length: n }, (_, i) => offset + i + 1).join('\n');
    }
    setBodyLineCount(n);
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

  // Returns the full runnable code (header + body + footer)
  function getCurrentCode() {
    return (headerTaRef.current?.value ?? '') + (taRef.current?.value ?? '') + (footerTaRef.current?.value ?? '');
  }
  function getSavedParts() {
    return { h: headerTaRef.current?.value ?? '', b: taRef.current?.value ?? '', f: footerTaRef.current?.value ?? '' };
  }
  function fmtTime(s) { const m = Math.floor(s/60); return `${m}:${String(s%60).padStart(2,'0')}`; }
  function handleClose()    { onClose(getSavedParts(), elapsed); }
  function handleLangChange(newLang) { onLangChange(newLang, getSavedParts()); }
  function sendToEditor(code) {
    if (!taRef.current) return;
    const body = extractBodyFromAI(code, lang);
    taRef.current.value = body.replace(/\n$/, '');
    refresh();
  }
  function handleReset() {
    if (!window.confirm('Reset to starter code? Your current code will be lost.')) return;
    const { header: h, body: defBody, footer: f } = splitStarterCode(problem, lang);
    if (headerTaRef.current) { headerTaRef.current.value = h; resizeBoilerplateTa(headerTaRef.current); }
    if (taRef.current) taRef.current.value = defBody.replace(/\n$/, '');
    if (footerTaRef.current) { footerTaRef.current.value = f; resizeBoilerplateTa(footerTaRef.current); }
    headerRef.current = h;
    setHeaderLines(countDisplayLines(h));
    setFooterLines(countDisplayLines(f));
    refresh();
  }

  function sendErrorToMentor(caseData) {
    const { input, expected, actual, status } = caseData;
    const text = status === 'error'
      ? `I got an error running my code:\n\`\`\`\n${actual}\n\`\`\``
      : `My code gives the wrong answer.\nInput:\n${input}\nExpected:\n${expected}\nGot:\n${actual}`;
    setMentorPrefill(text);
    setLeftPanel('mentor');
    setMobilePanel('desc');
  }

  function updateCase(i, field, val) {
    setCases(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val, actual: null, status: null } : c));
  }

  async function handleRun() {
    setRunning(true);
    const code = getCurrentCode();
    // Run sequentially — concurrent Wandbox requests hit container spawn limits
    const results = [];
    for (const c of cases) {
      try { results.push({ status: 'fulfilled', value: await runCode(lang, code, c.input) }); }
      catch (err) { results.push({ status: 'rejected', reason: err }); }
    }
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
              <button className={`mpanel-btn ${mobilePanel === 'desc' ? 'active' : ''}`} onClick={() => { setMobilePanel('desc'); setLeftPanel('desc'); }}>Problem</button>
              <button className={`mpanel-btn ${mobilePanel === 'desc' && leftPanel === 'mentor' ? 'active' : ''}`} onClick={() => { setMobilePanel('desc'); setLeftPanel('mentor'); }}>Mentor</button>
              <button className={`mpanel-btn ${mobilePanel === 'code' ? 'active' : ''}`} onClick={() => setMobilePanel('code')}>Code</button>
            </div>
            <button className="btn btn-ghost" onClick={handleClose}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="code-modal-body">

          {/* Left: description / mentor */}
          <div className={`code-modal-desc${mobilePanel !== 'desc' ? ' mobile-hidden' : ''}`} style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="left-panel-tabs">
              <button className={`left-tab${leftPanel === 'desc' ? ' active' : ''}`} onClick={() => setLeftPanel('desc')}>Problem</button>
              <button className={`left-tab${leftPanel === 'mentor' ? ' active' : ''}`} onClick={() => setLeftPanel('mentor')}>AI Mentor</button>
            </div>
            {leftPanel === 'desc' ? (
              <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }} dangerouslySetInnerHTML={{ __html: descHtml }} />
            ) : (
              <MentorPanel
                problem={problem}
                descHtml={descHtml}
                lang={lang}
                getCurrentCode={getCurrentCode}
                boilerplateHeader={header}
                boilerplateFooter={footer}
                onSendToEditor={code => { sendToEditor(code); setMobilePanel('code'); }}
                messages={mentorMessages}
                setMessages={setMentorMessages}
                prefill={mentorPrefill}
                onClearPrefill={() => setMentorPrefill(null)}
              />
            )}
          </div>

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
              <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums', minWidth: '36px' }}>
                ⏱ {fmtTime(elapsed)}
              </span>
              <button className="btn btn-sm" onClick={handleReset} title="Reset to starter code" style={{ color: 'var(--text-muted)' }}>
                ↺ Reset
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

            {/* Code editor — 3 sections: editable boilerplate header, editable body, editable boilerplate footer */}
            <div className="editor-root">
              {header && (
                <div className="editor-locked-section editor-locked-top">
                  <div className="editor-gutter editor-locked-gutter">
                    {Array.from({ length: headerLines }, (_, i) => i + 1).join('\n')}
                  </div>
                  <textarea
                    ref={headerTaRef}
                    className="editor-boilerplate-textarea"
                    spellCheck="false"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    onInput={e => {
                      headerRef.current = e.target.value;
                      setHeaderLines(countDisplayLines(e.target.value));
                      resizeBoilerplateTa(e.target);
                      refresh();
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        const ta = e.target, s = ta.selectionStart, v = ta.value;
                        ta.value = v.slice(0, s) + '    ' + v.slice(s);
                        ta.selectionStart = ta.selectionEnd = s + 4;
                        resizeBoilerplateTa(ta);
                      }
                    }}
                  />
                  <span className="editor-locked-badge">boilerplate</span>
                </div>
              )}

              <div className="editor-body-section">
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

              {footer && (
                <div className="editor-locked-section editor-locked-bottom">
                  <div className="editor-gutter editor-locked-gutter">
                    {Array.from({ length: footerLines }, (_, i) => headerLines + bodyLineCount + i + 1).join('\n')}
                  </div>
                  <textarea
                    ref={footerTaRef}
                    className="editor-boilerplate-textarea"
                    spellCheck="false"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    onInput={e => {
                      setFooterLines(countDisplayLines(e.target.value));
                      resizeBoilerplateTa(e.target);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        const ta = e.target, s = ta.selectionStart, v = ta.value;
                        ta.value = v.slice(0, s) + '    ' + v.slice(s);
                        ta.selectionStart = ta.selectionEnd = s + 4;
                        resizeBoilerplateTa(ta);
                      }
                    }}
                  />
                  <span className="editor-locked-badge">boilerplate</span>
                </div>
              )}
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
                  <div className="verdict-top">
                    <span className="verdict-badge">{verdictLabel[cur.status] || 'Output'}</span>
                    {(cur.status === 'error' || cur.status === 'fail') && (
                      <button className="ask-mentor-btn" onClick={() => sendErrorToMentor(cur)}>
                        → Ask mentor
                      </button>
                    )}
                  </div>
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
