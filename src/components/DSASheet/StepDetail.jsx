import { substepSolved } from '../../utils/stats.js';

export default function StepDetail({ data, stepIdx, onBack, onSubstepClick }) {
  const step = data.steps[stepIdx];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button className="btn btn-ghost" onClick={onBack}>← All Steps</button>
        <div>
          <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: step.color, marginBottom: '1px' }}>Step {stepIdx+1}</div>
          <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>{step.name}</div>
        </div>
      </div>

      <div className="substep-list">
        {step.substeps.map((ss, ssi) => {
          const solved = substepSolved(ss);
          const total  = ss.problems.length;
          const pct    = Math.min(100, solved / Math.max(1, total) * 100).toFixed(0);
          const eT = ss.problems.filter(p => p.d === 'E').length;
          const mT = ss.problems.filter(p => p.d === 'M').length;
          const hT = ss.problems.filter(p => p.d === 'H').length;
          return (
            <div key={ss.id} className="substep-card" onClick={() => onSubstepClick(stepIdx, ssi)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{ss.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '12px' }}>{solved} / {total} done</div>
              </div>
              <div className="bar-track" style={{ marginBottom: '8px' }}>
                <div className="bar-fill" style={{ background: step.color, width: `${pct}%` }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px' }}>
                {eT > 0 && <span style={{ color: 'var(--easy)' }}>{eT} Easy</span>}
                {mT > 0 && <span style={{ color: 'var(--med)' }}>{mT} Medium</span>}
                {hT > 0 && <span style={{ color: 'var(--hard)' }}>{hT} Hard</span>}
                <span style={{ color: 'var(--text-faint)', marginLeft: 'auto', fontSize: '12px' }}>→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
