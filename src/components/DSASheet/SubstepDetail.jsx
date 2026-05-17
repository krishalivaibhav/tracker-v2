import { useState, useEffect, useRef } from 'react';
import { substepSolved } from '../../utils/stats.js';
import { today } from '../../utils/helpers.js';

function DiffBadge({ d }) {
  if (d === 'E') return <span className="diff diff-easy">Easy</span>;
  if (d === 'M') return <span className="diff diff-medium">Medium</span>;
  return <span className="diff diff-hard">Hard</span>;
}

const PENCIL_SVG = (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="M9 1.5l3 3-7.5 7.5H1v-3.5L9 1.5zM8 2.5l3 3"/>
  </svg>
);

const REVISION_SVG = (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="M11.5 7A4.5 4.5 0 1 1 7 2.5M11.5 2.5v3h-3"/>
  </svg>
);

export default function SubstepDetail({ data, stepIdx, substepIdx, highlightPi, onBackToSteps, onBackToStep, onOpenSubstep, onToggleProblem, onToggleRevision, onSaveNote, onOpenCodeEditor }) {
  const step = data.steps[stepIdx];
  const ss   = step.substeps[substepIdx];
  const solved = substepSolved(ss);
  const total  = ss.problems.length;
  const pct    = Math.min(100, solved / Math.max(1, total) * 100).toFixed(0);
  const prevSsi = substepIdx > 0 ? substepIdx - 1 : null;
  const nextSsi = substepIdx < step.substeps.length - 1 ? substepIdx + 1 : null;

  const [openNotes, setOpenNotes] = useState({});
  const [noteValues, setNoteValues] = useState(() => {
    const vals = {};
    ss.problems.forEach((p, pi) => { if (p.note) vals[pi] = p.note; });
    return vals;
  });

  const highlightRef = useRef(null);
  useEffect(() => {
    if (highlightPi == null || !highlightRef.current) return;
    highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightPi]);

  function toggleNote(pi) {
    setOpenNotes(prev => ({ ...prev, [pi]: !prev[pi] }));
    if (!openNotes[pi]) {
      setNoteValues(prev => ({ ...prev, [pi]: ss.problems[pi].note || '' }));
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBackToSteps}>← Steps</button>
        <span style={{ color: 'var(--text-faint)' }}>/</span>
        <button className="btn btn-ghost btn-sm" onClick={onBackToStep}>{step.name.replace(/\s*\[.*?\]/g, '').trim()}</button>
        <span style={{ color: 'var(--text-faint)' }}>/</span>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{ss.name}</span>
      </div>

      <div className="detail-header">
        <div>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: step.color, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '2px' }}>Step {stepIdx+1} · {step.name.replace(/\s*\[.*?\]/g, '').trim()}</div>
          <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>{ss.name}</div>
        </div>
        <div className="detail-stats">
          <div className="detail-stat">
            <div className="detail-stat-val" style={{ color: step.color }}>{solved}/{total}</div>
            <div className="detail-stat-label">done</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-val" style={{ color: 'var(--easy)' }}>
              {ss.problems.filter(p => p.done && p.d === 'E').length}/{ss.problems.filter(p => p.d === 'E').length}
            </div>
            <div className="detail-stat-label">Easy</div>
          </div>
          <div className="detail-stat">
            <div className="detail-stat-val" style={{ color: 'var(--med)' }}>
              {ss.problems.filter(p => p.done && p.d === 'M').length}/{ss.problems.filter(p => p.d === 'M').length}
            </div>
            <div className="detail-stat-label">Med</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>Progress</span><span>{pct}%</span>
        </div>
        <div className="bar-track" style={{ height: '8px' }}>
          <div className="bar-fill" style={{ background: step.color, width: `${pct}%` }} />
        </div>
      </div>

      <div className="card substep-table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="ptable">
          <thead>
            <tr><th style={{ width: '38px' }}></th><th style={{ width: '40px' }}>#</th><th>Problem</th><th style={{ width: '90px' }}>Difficulty</th><th style={{ width: '26px' }}></th></tr>
          </thead>
          <tbody>
            {ss.problems.map((p, pi) => {
              const hasNote = !!(noteValues[pi] !== undefined ? noteValues[pi] : p.note);
              const noteOpen = !!openNotes[pi];
              const noteVal  = noteValues[pi] !== undefined ? noteValues[pi] : (p.note || '');

              let nameCell;
              nameCell = (
                <button className={`prob-editor-btn ${p.done ? 'done' : ''}`} onClick={() => onOpenCodeEditor(stepIdx, substepIdx, pi)}>
                  {p.t}
                  {p.lc && <img src="leetcode.png" className="platform-logo" alt="LC" />}
                  {p.gfg && <img src="gfg.png" className="platform-logo" alt="GFG" />}
                  {' '}<span className="editor-hint">▶ editor</span>
                </button>
              );

              return (
                <>
                  <tr key={`prob-${pi}`} ref={pi === highlightPi ? highlightRef : null} className={`row${pi === highlightPi ? ' row-flash' : ''}`}>
                    <td style={{ width: '38px' }}>
                      <input type="checkbox" className="prob-cb" checked={!!p.done}
                        onChange={e => onToggleProblem(stepIdx, substepIdx, pi, e.target.checked)} />
                    </td>
                    <td className="num">{pi+1}.</td>
                    <td>
                      {nameCell}
                      <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                        {p.note && (
                          <div style={{ fontSize: '11px', color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                            {p.note}
                          </div>
                        )}
                        {p.lastTime > 0 && (
                          <div style={{ fontSize: '11px', color: 'var(--text-faint)', flexShrink: 0 }}>
                            ⏱ {Math.floor(p.lastTime/60)}:{String(p.lastTime%60).padStart(2,'0')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td><DiffBadge d={p.d} /></td>
                    <td style={{ width: '26px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                        <button className={`btn-note ${hasNote ? 'has-note' : ''}`}
                          onClick={() => toggleNote(pi)}
                          title={hasNote ? 'Edit note' : 'Add note'}>
                          {PENCIL_SVG}
                        </button>
                        <button
                          className={`btn-note ${p.revision ? 'has-note' : ''}`}
                          onClick={() => onToggleRevision(stepIdx, substepIdx, pi)}
                          title={p.revision ? 'Remove from revision' : 'Mark for revision'}
                          style={p.revision ? { color: 'var(--med)' } : {}}>
                          {REVISION_SVG}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {noteOpen && (
                    <tr key={`note-${pi}`} className="note-row">
                      <td colSpan="5" className="note-row">
                        <textarea
                          className="note-input"
                          placeholder="Your notes, approach, key insight, edge cases..."
                          value={noteVal}
                          onChange={e => setNoteValues(prev => ({ ...prev, [pi]: e.target.value }))}
                          onBlur={() => onSaveNote(stepIdx, substepIdx, pi, noteVal)}
                        />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        {prevSsi !== null && (
          <button className="btn btn-ghost btn-sm" onClick={() => onOpenSubstep(stepIdx, prevSsi)}>
            ← {step.substeps[prevSsi].name}
          </button>
        )}
        {nextSsi !== null && (
          <button className="btn btn-ghost btn-sm" onClick={() => onOpenSubstep(stepIdx, nextSsi)}>
            {step.substeps[nextSsi].name} →
          </button>
        )}
      </div>
    </div>
  );
}
