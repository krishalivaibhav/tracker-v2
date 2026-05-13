import { lcStats, lcLinkedSolved, computeStreak, lastSolvedDate, stepSolved, stepProblems } from '../utils/stats.js';
import { daysUntil, fmtDate } from '../utils/helpers.js';
import { LC_TOTAL, PLACEMENT_DATE } from '../utils/storage.js';

export default function Dashboard({ data, user, onTabChange }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const stats = lcStats(data.steps);
  const days = daysUntil(PLACEMENT_DATE);
  const pct = (stats.total / LC_TOTAL * 100).toFixed(0);
  const streak = computeStreak(data.steps);
  const lastSolved = lastSolvedDate(data.steps);

  const milestones = [
    { label: "Start getaway's DSA grind", done: stats.total > 0, date: 'May 2026' },
    { label: 'Reach 50 problems',         done: stats.total >= 50,  date: 'Jun 2026' },
    { label: 'Reach 100 problems',        done: stats.total >= 100, date: 'Jul 2026' },
    { label: 'Reach 200 problems',        done: stats.total >= 200, date: 'Aug 2026' },
    { label: 'Reach 300 problems',        done: stats.total >= 300, date: 'Sep 2026' },
    { label: 'Complete the DSA Sheet (473)', done: stats.total >= 473, date: 'Oct 2026' },
    { label: 'Placement season begins',   done: false, date: 'Oct 2026' },
  ];

  return (
    <div>
      <div className="page-header pop-in">
        <div>
          <h1 className="page-title">{greet}, <em>{user?.name?.split(' ')[0] || 'there'}</em>.</h1>
          <p className="page-sub">{days} days to placement season · {stats.total}/{LC_TOTAL} problems solved</p>
        </div>
      </div>

      <div className="dash-stats pop-in">
        <div className="card tight">
          <div className="card-title">DSA Progress</div>
          <div className="stat-val" style={{ color: 'var(--accent)' }}>{stats.total}<sup>/{LC_TOTAL}</sup></div>
          <div className="bar-track" style={{ marginTop: '12px' }}>
            <div className="bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span style={{ color: 'var(--easy)' }}>● {stats.E}E</span>
            <span style={{ color: 'var(--med)' }}>● {stats.M}M</span>
            <span style={{ color: 'var(--hard)' }}>● {stats.H}H</span>
          </div>
        </div>
        <div className="card tight">
          <div className="card-title">Streak</div>
          <div className="stat-val" style={{ color: '#C2410C' }}>{streak}<sup>days</sup></div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
            {lastSolved ? 'Last: ' + fmtDate(lastSolved) : 'Solve a problem to start!'}
          </div>
        </div>
        <div className="card tight">
          <div className="card-title">On LeetCode</div>
          <div className="stat-val" style={{ color: '#F97316' }}>{lcLinkedSolved(data.steps)}<sup>/{LC_TOTAL}</sup></div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>LC-linked solved</div>
        </div>
      </div>

      <div className="pop-in d1">
        <div className="card">
          <div className="card-title-row">
            <div className="card-title">DSA by Step</div>
            <button className="btn btn-sm btn-ghost" onClick={() => onTabChange('leetcode')}>view all →</button>
          </div>
          {data.steps.slice(0, 9).map(step => {
            const s = stepSolved(step);
            const tot = stepProblems(step);
            const p = Math.min(100, s / Math.max(1, tot) * 100).toFixed(0);
            return (
              <div key={step.id} className="bar-row">
                <div className="bar-row-name">{step.name.replace(/\s*\[.*?\]/g, '').trim()}</div>
                <div className="bar-track"><div className="bar-fill" style={{ background: step.color, width: `${p}%` }} /></div>
                <div className="bar-row-val">{s}/{tot}</div>
              </div>
            );
          })}
          {data.steps.length > 9 && (
            <div style={{ fontSize: '11.5px', color: 'var(--text-faint)', marginTop: '8px' }}>
              +{data.steps.length - 9} more steps — click "view all"
            </div>
          )}
        </div>
      </div>

      <div className="card mt-6 pop-in d2">
        <div className="card-title">Roadmap Milestones</div>
        {milestones.map((m, i) => (
          <div key={i} className="milestone-item">
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
              display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: 700,
              background: m.done ? 'var(--easy-soft)' : 'var(--surface-2)',
              color: m.done ? 'var(--easy)' : 'var(--text-faint)',
              border: `1px solid ${m.done ? 'var(--easy)' : 'var(--border)'}`,
            }}>{m.done ? '✓' : '○'}</div>
            <span style={{ flex: 1, ...(m.done ? { textDecoration: 'line-through', color: 'var(--text-faint)' } : {}) }}>{m.label}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{m.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
