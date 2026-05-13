import { lcStats, stepSolved, stepProblems, getDailyLog } from '../../utils/stats.js';
import { LC_TOTAL } from '../../utils/storage.js';
import { fmtDate } from '../../utils/helpers.js';
import { useState } from 'react';

const PENCIL_SVG = (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="M9 1.5l3 3-7.5 7.5H1v-3.5L9 1.5zM8 2.5l3 3"/>
  </svg>
);

function DailyLog({ steps, dailyNotes, onNoteSave }) {
  const [openDates, setOpenDates] = useState({});
  const [noteValues, setNoteValues] = useState({});
  const entries = getDailyLog(steps);

  if (!entries.length) {
    return <div className="empty" style={{ padding: '24px 0' }}>No activity yet — solve problems and they'll appear here.</div>;
  }

  return (
    <>
      {entries.slice(0, 60).map(([date, data]) => {
        const note = (dailyNotes || {})[date] || '';
        const total = data.E + data.M + data.H;
        const isOpen = openDates[date];
        const currentNote = noteValues[date] !== undefined ? noteValues[date] : note;

        return (
          <div key={date} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="log-date">{fmtDate(date)}</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{total} problem{total !== 1 ? 's' : ''}</span>
                <span style={{ fontSize: '11.5px', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>
                  {data.E > 0 && <span style={{ color: 'var(--easy)' }}>{data.E}E</span>}
                  {data.M > 0 && <span style={{ color: 'var(--med)', marginLeft: '4px' }}>{data.M}M</span>}
                  {data.H > 0 && <span style={{ color: 'var(--hard)', marginLeft: '4px' }}>{data.H}H</span>}
                </span>
              </div>
              <button className={`btn-note ${note ? 'has-note' : ''}`}
                onClick={() => setOpenDates(p => ({ ...p, [date]: !p[date] }))}
                title={note ? 'Edit note' : 'Add note'}>
                {PENCIL_SVG}
              </button>
            </div>
            {isOpen && (
              <div style={{ marginTop: '8px' }}>
                <textarea
                  className="note-input" style={{ minHeight: '52px' }}
                  placeholder="What did you learn? Patterns, insights..."
                  value={currentNote}
                  onChange={e => setNoteValues(p => ({ ...p, [date]: e.target.value }))}
                  onBlur={() => onNoteSave(date, currentNote)}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default function StepGrid({ data, onStepClick, onNoteSave }) {
  const stats = lcStats(data.steps);

  return (
    <div>
      <div className="page-header pop-in">
        <div>
          <h1 className="page-title">getaway's <em>DSA</em> sheet.</h1>
          <p className="page-sub">473 problems across 18 steps. Check off problems as you solve them.</p>
        </div>
      </div>

      <div className="dash-stats pop-in" style={{ marginBottom: '24px' }}>
        <div className="card tight">
          <div className="card-title">Total Solved</div>
          <div className="stat-val" style={{ color: 'var(--accent)' }}>{stats.total}<sup>/{LC_TOTAL}</sup></div>
          <div className="bar-track" style={{ marginTop: '12px' }}>
            <div className="bar-fill" style={{ width: `${(stats.total/LC_TOTAL*100).toFixed(1)}%` }} />
          </div>
        </div>
        <div className="card tight">
          <div className="card-title">Easy</div>
          <div className="stat-val" style={{ color: 'var(--easy)' }}>{stats.E}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>solved</div>
        </div>
        <div className="card tight">
          <div className="card-title">Medium</div>
          <div className="stat-val" style={{ color: 'var(--med)' }}>{stats.M}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>solved</div>
        </div>
        <div className="card tight">
          <div className="card-title">Hard</div>
          <div className="stat-val" style={{ color: 'var(--hard)' }}>{stats.H}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>solved</div>
        </div>
      </div>

      <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>
        Steps <span style={{ fontSize: '12.5px', fontWeight: 400, color: 'var(--text-muted)' }}>— click a step to see its problems</span>
      </div>

      <div className="step-grid pop-in d1">
        {data.steps.map((step, si) => {
          const solved = stepSolved(step);
          const total  = stepProblems(step);
          const pct    = Math.min(100, solved / Math.max(1, total) * 100).toFixed(0);
          const eD = step.substeps.reduce((a, ss) => a + ss.problems.filter(p => p.done && p.d === 'E').length, 0);
          const mD = step.substeps.reduce((a, ss) => a + ss.problems.filter(p => p.done && p.d === 'M').length, 0);
          const hD = step.substeps.reduce((a, ss) => a + ss.problems.filter(p => p.done && p.d === 'H').length, 0);
          return (
            <div key={step.id} className="step-card" style={{ borderLeftColor: step.color }} onClick={() => onStepClick(si)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: step.color, display: 'grid', placeItems: 'center', color: 'white', fontSize: '10px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>{si+1}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3 }}>{step.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', lineHeight: 1, color: step.color }}>{solved}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ {total}</span>
              </div>
              <div className="bar-track" style={{ marginBottom: '8px' }}>
                <div className="bar-fill" style={{ background: step.color, width: `${pct}%` }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                {eD > 0 && <span style={{ color: 'var(--easy)' }}>●{eD}E</span>}
                {mD > 0 && <span style={{ color: 'var(--med)' }}>●{mD}M</span>}
                {hD > 0 && <span style={{ color: 'var(--hard)' }}>●{hD}H</span>}
                {!eD && !mD && !hD && <span style={{ color: 'var(--text-faint)' }}>Not started</span>}
                <span style={{ color: 'var(--text-faint)', marginLeft: 'auto' }}>{step.substeps.length} sub-steps</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card mt-6 pop-in d2">
        <div className="card-title-row"><div className="card-title">Daily Log</div></div>
        <DailyLog steps={data.steps} dailyNotes={data.dailyNotes} onNoteSave={onNoteSave} />
      </div>
    </div>
  );
}
