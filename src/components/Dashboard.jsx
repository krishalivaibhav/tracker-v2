import { lcStats, lcLinkedSolved, computeStreak, lastSolvedDate, stepSolved, stepProblems } from '../utils/stats.js';
import { fmtDate } from '../utils/helpers.js';
import { LC_TOTAL } from '../utils/storage.js';

export default function Dashboard({ data, user, onTabChange, onOpenRevisionProblem, onReviewDone }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const stats = lcStats(data.steps);
  const pct = (stats.total / LC_TOTAL * 100).toFixed(0);
  const streak = computeStreak(data.steps);
  const lastSolved = lastSolvedDate(data.steps);

  const todayStr = new Date().toISOString().slice(0, 10);
  const revisionDue = [], revisionUpcoming = [];
  const timeBuckets = { E: [], M: [], H: [] };
  const activityMap = {};
  data.steps.forEach((step, si) => {
    step.substeps.forEach((ss, ssi) => {
      ss.problems.forEach((p, pi) => {
        if (p.revision) {
          const due = !p.nextReview || p.nextReview <= todayStr;
          (due ? revisionDue : revisionUpcoming).push({ p, step, ss, si, ssi, pi });
        }
        if (p.lastTime > 0 && p.d) timeBuckets[p.d]?.push(p.lastTime);
        if (p.done && p.solvedOn) activityMap[p.solvedOn] = (activityMap[p.solvedOn] || 0) + 1;
      });
    });
  });

  // 52-week heatmap: start from Sunday of current week, go back 51 weeks
  const heatStart = new Date();
  heatStart.setDate(heatStart.getDate() - heatStart.getDay() - 51 * 7);
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const weeks = Array.from({ length: 52 }, (_, wi) => {
    const days = Array.from({ length: 7 }, (_, di) => {
      const d = new Date(heatStart);
      d.setDate(heatStart.getDate() + wi * 7 + di);
      const s = d.toISOString().slice(0, 10);
      return { date: s, count: activityMap[s] || 0, future: s > todayStr };
    });
    const firstDay = new Date(days[0].date);
    const monthLabel = (wi === 0 || firstDay.getDate() <= 7) ? MONTHS[firstDay.getMonth()] : '';
    return { days, monthLabel };
  });
  const hasTimeData = Object.values(timeBuckets).some(a => a.length > 0);
  function avgTime(arr) {
    if (!arr.length) return null;
    const s = Math.round(arr.reduce((a,b) => a+b, 0) / arr.length);
    return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  }

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
          <p className="page-sub">{stats.total}/{LC_TOTAL} problems solved</p>
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
        {hasTimeData && (
          <div className="card tight">
            <div className="card-title">Avg Time</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {[['E','Easy','var(--easy)'],['M','Med','var(--med)'],['H','Hard','var(--hard)']].map(([key,label,color]) => {
                const t = avgTime(timeBuckets[key]);
                if (!t) return null;
                return (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color }}>{label}</span>
                    <span style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{t}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-faint)', marginTop: '10px' }}>
              {Object.values(timeBuckets).flat().length} sessions recorded
            </div>
          </div>
        )}
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

      {(revisionDue.length > 0 || revisionUpcoming.length > 0) && (
        <div className="card mt-6 pop-in d2">
          <div className="card-title-row">
            <div className="card-title">
              Revision Queue
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--med)', marginLeft: '6px' }}>
                {revisionDue.length} due
              </span>
              {revisionUpcoming.length > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-faint)', marginLeft: '6px' }}>
                  · {revisionUpcoming.length} upcoming
                </span>
              )}
            </div>
            <button className="btn btn-sm btn-ghost" onClick={() => onTabChange('leetcode')}>go to DSA →</button>
          </div>
          {revisionDue.length === 0 && (
            <div style={{ fontSize: '13px', color: 'var(--text-faint)', padding: '12px 0' }}>
              All caught up! Next review in {revisionUpcoming[0]?.p.nextReview || '—'}.
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            {revisionDue.map(({ p, step, ss, si, ssi, pi }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'var(--surface-2)', borderRadius: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: step.color, flexShrink: 0 }} />
                <button onClick={() => onOpenRevisionProblem(si, ssi, pi)}
                  style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.t}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '1px' }}>{step.name.replace(/\s*\[.*?\]/g, '').trim()} · {ss.name}</div>
                </button>
                {p.d === 'E' && <span className="diff diff-easy" style={{ flexShrink: 0 }}>Easy</span>}
                {p.d === 'M' && <span className="diff diff-medium" style={{ flexShrink: 0 }}>Med</span>}
                {p.d === 'H' && <span className="diff diff-hard" style={{ flexShrink: 0 }}>Hard</span>}
                <button onClick={() => onReviewDone(si, ssi, pi)}
                  title="Mark as reviewed"
                  style={{ flexShrink: 0, background: 'var(--easy-soft)', border: '1px solid var(--easy)', color: 'var(--easy)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                  ✓ Done
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card mt-6 pop-in d2">
        <div className="card-title-row">
          <div className="card-title">Activity</div>
          <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>last 12 months</span>
        </div>
        <div style={{ overflowX: 'auto', paddingBottom: '4px', marginTop: '8px' }}>
          <div style={{ display: 'flex', gap: '3px', width: 'max-content' }}>
            {weeks.map(({ days, monthLabel }, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ height: '12px', fontSize: '9px', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>
                  {monthLabel}
                </div>
                {days.map(({ date, count, future }, di) => {
                  const bg = future || count === 0 ? 'var(--surface-2)'
                    : count === 1 ? 'rgba(34,197,94,0.3)'
                    : count === 2 ? 'rgba(34,197,94,0.6)'
                    : 'var(--easy)';
                  return (
                    <div key={di}
                      title={!future && count > 0 ? `${date}: ${count} solved` : date}
                      style={{ width: '14px', height: '14px', borderRadius: '3px', background: bg, flexShrink: 0 }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '10px', fontSize: '11px', color: 'var(--text-faint)' }}>
          <span>Less</span>
          {[0,1,2,3].map(n => (
            <div key={n} style={{ width: '10px', height: '10px', borderRadius: '2px', flexShrink: 0,
              background: n===0 ? 'var(--surface-2)' : n===1 ? 'rgba(34,197,94,0.3)' : n===2 ? 'rgba(34,197,94,0.6)' : 'var(--easy)'
            }} />
          ))}
          <span>More</span>
          <span style={{ marginLeft: 'auto' }}>{Object.values(activityMap).reduce((a,b) => a+b, 0)} problems in last 12 months</span>
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
