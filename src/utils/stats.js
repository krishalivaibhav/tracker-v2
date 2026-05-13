export function lcStats(steps) {
  let E = 0, M = 0, H = 0;
  for (const step of steps) for (const ss of step.substeps) for (const p of ss.problems)
    if (p.done) { if (p.d === 'E') E++; else if (p.d === 'M') M++; else H++; }
  return { E, M, H, total: E + M + H };
}

export function lcLinkedSolved(steps) {
  let n = 0;
  for (const step of steps) for (const ss of step.substeps) for (const p of ss.problems)
    if (p.done && p.lc) n++;
  return n;
}

export function stepProblems(step) {
  return step.substeps.reduce((a, ss) => a + ss.problems.length, 0);
}

export function stepSolved(step) {
  return step.substeps.reduce((a, ss) => a + ss.problems.filter(p => p.done).length, 0);
}

export function substepSolved(ss) {
  return ss.problems.filter(p => p.done).length;
}

export function allDates(steps) {
  const s = new Set();
  for (const step of steps) for (const ss of step.substeps) for (const p of ss.problems)
    if (p.done && p.solvedOn) s.add(p.solvedOn);
  return s;
}

export function computeStreak(steps) {
  const dates = allDates(steps);
  if (!dates.size) return 0;
  const td = new Date().toISOString().slice(0, 10);
  const yd = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (!dates.has(td) && !dates.has(yd)) return 0;
  let n = 0, d = new Date(((dates.has(td)) ? td : yd) + 'T12:00:00');
  while (dates.has(d.toISOString().slice(0, 10))) { n++; d = new Date(d - 86400000); }
  return n;
}

export function lastSolvedDate(steps) {
  let latest = null;
  for (const step of steps) for (const ss of step.substeps) for (const p of ss.problems)
    if (p.done && p.solvedOn && (!latest || p.solvedOn > latest)) latest = p.solvedOn;
  return latest;
}

export function getDailyLog(steps) {
  const byDate = {};
  for (const step of steps) for (const ss of step.substeps) for (const p of ss.problems)
    if (p.done && p.solvedOn) { if (!byDate[p.solvedOn]) byDate[p.solvedOn] = { E: 0, M: 0, H: 0 }; byDate[p.solvedOn][p.d]++; }
  return Object.entries(byDate).sort((a, b) => b[0].localeCompare(a[0]));
}
