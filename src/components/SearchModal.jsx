import { useState, useEffect, useRef } from 'react';

function DiffBadge({ d }) {
  if (d === 'E') return <span className="diff diff-easy">Easy</span>;
  if (d === 'M') return <span className="diff diff-medium">Medium</span>;
  return <span className="diff diff-hard">Hard</span>;
}

export default function SearchModal({ steps, onOpen, onClose }) {
  const [query,     setQuery]     = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef  = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Flatten all problems from all steps/substeps
  const allProblems = [];
  steps.forEach((step, si) => {
    step.substeps.forEach((ss, ssi) => {
      ss.problems.forEach((p, pi) => {
        allProblems.push({ p, si, ssi, pi, stepName: step.name.replace(/\s*\[.*?\]/g, '').trim() });
      });
    });
  });

  const q = query.trim().toLowerCase();
  const results = q
    ? allProblems.filter(({ p }) => p.t.toLowerCase().includes(q)).slice(0, 25)
    : allProblems.slice(0, 25);

  useEffect(() => { setActiveIdx(0); }, [query]);

  // Scroll active item into view
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${activeIdx}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  function pick(item) {
    onOpen(item.si, item.ssi, item.pi);
    onClose();
  }

  function handleKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); return; }
    if (e.key === 'Enter' && results[activeIdx]) { pick(results[activeIdx]); return; }
    if (e.key === 'Escape') { onClose(); }
  }

  return (
    <div className="search-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="search-modal" role="dialog" aria-modal="true">

        <div className="search-input-wrap">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" width="15" height="15" className="search-icon">
            <circle cx="6.5" cy="6.5" r="4.5"/><path d="M11 11l3 3"/>
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search problems…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="search-esc" onClick={onClose}>Esc</kbd>
        </div>

        <div className="search-results" ref={listRef}>
          {results.length === 0 && q && (
            <div className="search-empty">No problems found for "{query}"</div>
          )}
          {results.map((item, idx) => (
            <button
              key={`${item.si}-${item.ssi}-${item.pi}`}
              data-idx={idx}
              className={`search-result${idx === activeIdx ? ' active' : ''}`}
              onClick={() => pick(item)}
              onMouseEnter={() => setActiveIdx(idx)}
            >
              <span className="search-result-left">
                <span className="search-result-title">{item.p.t}</span>
                <span className="search-result-step">{item.stepName}</span>
              </span>
              <span className="search-result-right">
                {item.p.done && <span className="search-result-done">✓</span>}
                <DiffBadge d={item.p.d} />
                {item.p.lc && <img src="leetcode.png" className="platform-logo" alt="LC" style={{ width: 14, height: 14, verticalAlign: 'middle' }} />}
                {item.p.gfg && <img src="gfg.png" className="platform-logo" alt="GFG" style={{ width: 14, height: 14, verticalAlign: 'middle' }} />}
              </span>
            </button>
          ))}
        </div>

        <div className="search-footer">
          {q ? `${results.length} result${results.length !== 1 ? 's' : ''}` : `${allProblems.length} problems`}
          <span className="search-footer-keys">↑↓ navigate &nbsp;·&nbsp; ↵ open &nbsp;·&nbsp; Esc close</span>
        </div>

      </div>
    </div>
  );
}
