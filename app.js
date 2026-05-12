// app.js — Vaibhav Placement Tracker · Striver A2Z Edition

/* ─── Constants ─────────────────────────────────────────────── */
const PLACEMENT_DATE = new Date('2026-10-01');
let STORE_KEY = 'vk_a2z_v1';
const LC_TOTAL = 473;
let currentUser = null;

/* ─── Default Projects ──────────────────────────────────────── */
const DEFAULT_PROJECTS = [
  { id: 1, name: 'AI Resume & Job Match Analyzer', stack: 'FastAPI · Groq · OpenAI · Ollama · Docker', status: 'complete',
    tasks: [
      { text: 'Write clean README with screenshots', done: false },
      { text: 'Add demo GIF or video', done: false },
      { text: 'Ensure consistent commit history', done: false },
      { text: 'Pin repo on GitHub profile', done: false },
    ]},
  { id: 2, name: 'Gesture-Controlled Vision Platform', stack: 'Python · OpenCV · MediaPipe · TouchDesigner', status: 'complete',
    tasks: [
      { text: 'Write clean README with screenshots', done: false },
      { text: 'Add demo video of all 3 modes', done: false },
      { text: 'Pin repo on GitHub profile', done: false },
    ]},
  { id: 3, name: 'Concrete Strength Prediction Engine', stack: 'Python · Scikit-learn · NumPy · Matplotlib', status: 'complete',
    tasks: [
      { text: 'Write clean README with results', done: false },
      { text: 'Add feature importance chart to README', done: false },
    ]},
  { id: 4, name: 'RAG / LangChain Project (Build This!)', stack: 'LangChain · Hugging Face · Python · FastAPI', status: 'not_started',
    tasks: [
      { text: 'Pick a use case (doc Q&A, knowledge base...)', done: false },
      { text: 'Implement RAG pipeline with LangChain', done: false },
      { text: 'Integrate a Hugging Face embedding model', done: false },
      { text: 'Add a simple API or UI layer', done: false },
      { text: 'Containerize with Docker', done: false },
      { text: 'Write README and push to GitHub', done: false },
      { text: 'Pin repo on GitHub profile', done: false },
    ]},
];

/* ─── Persistence (slug-based) ──────────────────────────────── */
function freshData() {
  return {
    progress: {},
    dailyNotes: {},
    applications: [],
    projects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)),
    cgpa: { current: 7.16, afterSem: 5 },
  };
}

function load() {
  const raw = localStorage.getItem(STORE_KEY);
  let d = null;
  if (raw) { try { d = JSON.parse(raw); } catch {} }
  const base = d || freshData();

  // One-time migration from old tracker key
  if (!d) {
    const old = localStorage.getItem('vk_tracker_v2');
    if (old) {
      try {
        const od = JSON.parse(old);
        base.applications = od.applications || [];
        if (od.projects) base.projects = od.projects;
        if (od.cgpa) base.cgpa = od.cgpa;
        if (od.leetcode?.topics) {
          for (const t of od.leetcode.topics) {
            for (const p of (t.problems || [])) {
              if (p.done) base.progress[p.s] = { done: true, solvedOn: p.solvedOn || null, note: p.note || '' };
            }
          }
        }
        if (od.leetcode?.dailyNotes) base.dailyNotes = od.leetcode.dailyNotes;
      } catch {}
    }
  }

  // Rebuild steps from A2Z_STEPS source of truth, overlay stored progress
  base.steps = A2Z_STEPS.map(step => ({
    ...step,
    substeps: step.substeps.map(ss => ({
      ...ss,
      problems: ss.problems.map(p => {
        const prog = base.progress[p.s];
        return prog ? { ...p, ...prog } : { ...p };
      }),
    })),
  }));

  if (!base.dailyNotes) base.dailyNotes = {};
  return base;
}

function save(d) {
  const progress = {};
  for (const step of d.steps) {
    for (const ss of step.substeps) {
      for (const p of ss.problems) {
        if (p.done || p.note) progress[p.s] = { done: !!p.done, solvedOn: p.solvedOn || null, note: p.note || '' };
      }
    }
  }
  localStorage.setItem(STORE_KEY, JSON.stringify({
    progress, dailyNotes: d.dailyNotes,
    applications: d.applications, projects: d.projects, cgpa: d.cgpa,
  }));
}

/* ─── State ─────────────────────────────────────────────────── */
let D;
let activeTab = 'dashboard';
let selectedStep = null;
let selectedSubstep = null;
let codeEditorContext = null; // { si, ssi, pi }
let codeStore = {};           // { slug-lang: code }
let currentCodeLang = 'python';

/* ─── Stats ─────────────────────────────────────────────────── */
function lcStats() {
  let E = 0, M = 0, H = 0;
  for (const step of D.steps) for (const ss of step.substeps) for (const p of ss.problems)
    if (p.done) { if (p.d === 'E') E++; else if (p.d === 'M') M++; else H++; }
  return { E, M, H, total: E + M + H };
}
function lcTotal() { return lcStats().total; }
function lcLinkedSolved() {
  let n = 0;
  for (const step of D.steps) for (const ss of step.substeps) for (const p of ss.problems)
    if (p.done && p.lc) n++;
  return n;
}
function stepProblems(step) { return step.substeps.reduce((a, ss) => a + ss.problems.length, 0); }
function stepSolved(step)   { return step.substeps.reduce((a, ss) => a + ss.problems.filter(p => p.done).length, 0); }
function substepSolved(ss)  { return ss.problems.filter(p => p.done).length; }

function allDates() {
  const s = new Set();
  for (const step of D.steps) for (const ss of step.substeps) for (const p of ss.problems)
    if (p.done && p.solvedOn) s.add(p.solvedOn);
  return s;
}
function computeStreak() {
  const dates = allDates();
  if (!dates.size) return 0;
  const td = today(), yd = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (!dates.has(td) && !dates.has(yd)) return 0;
  let n = 0, d = new Date(((dates.has(td)) ? td : yd) + 'T12:00:00');
  while (dates.has(d.toISOString().slice(0, 10))) { n++; d = new Date(d - 86400000); }
  return n;
}
function lastSolvedDate() {
  let latest = null;
  for (const step of D.steps) for (const ss of step.substeps) for (const p of ss.problems)
    if (p.done && p.solvedOn && (!latest || p.solvedOn > latest)) latest = p.solvedOn;
  return latest;
}
function getDailyLog() {
  const byDate = {};
  for (const step of D.steps) for (const ss of step.substeps) for (const p of ss.problems)
    if (p.done && p.solvedOn) { if (!byDate[p.solvedOn]) byDate[p.solvedOn] = {E:0,M:0,H:0}; byDate[p.solvedOn][p.d]++; }
  return Object.entries(byDate).sort((a, b) => b[0].localeCompare(a[0]));
}

/* ─── Display helpers ───────────────────────────────────────── */
function daysUntil(d) { return Math.max(0, Math.ceil((d - new Date()) / 86400000)); }
function today() { return new Date().toISOString().slice(0, 10); }
function fmtDate(s) {
  if (!s) return '';
  return new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function diffBadge(d) {
  if (d === 'E') return '<span class="diff diff-easy">Easy</span>';
  if (d === 'M') return '<span class="diff diff-medium">Medium</span>';
  return '<span class="diff diff-hard">Hard</span>';
}
function statusBadge(s) {
  const cls = { Wishlist:'badge-gray', Applied:'badge-blue', OA:'badge-purple', Interview:'badge-yellow', Offer:'badge-green', Rejected:'badge-red' };
  return `<span class="badge ${cls[s]||'badge-gray'}">${s}</span>`;
}
function projectStatusBadge(s) {
  if (s === 'complete')    return '<span class="badge badge-green">Complete</span>';
  if (s === 'in_progress') return '<span class="badge badge-yellow">In Progress</span>';
  return '<span class="badge badge-gray">Not Started</span>';
}

/* ─── Navigation ────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'home',      label: 'Home',        icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><path d="M1.5 6.5L8 1.5l6.5 5V14a.5.5 0 0 1-.5.5H10V10H6v4.5H2a.5.5 0 0 1-.5-.5V6.5z"/></svg>', special: true },
  { id: 'dashboard', label: 'Dashboard',   icon: '<svg viewBox="0 0 16 16" fill="currentColor" class="nav-icon"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>' },
  { id: 'leetcode',  label: 'DSA Sheet',   icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="nav-icon"><path d="M3.5 5L1.5 8l2 3M12.5 5l2 3-2 3M9.5 2.5l-3 11"/></svg>' },
  { id: 'career',    label: 'Career Tools',icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><rect x="1" y="4" width="14" height="10" rx="1.5"/><path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M8 9h.01"/></svg>' },
];

function renderNav() {
  const lcSolved = lcLinkedSolved();
  const badges = { leetcode: `${lcSolved}/${LC_TOTAL}` };
  document.getElementById('sidebar-nav').innerHTML = NAV_ITEMS.map(item => `
    <button class="nav-item ${activeTab === item.id ? 'active' : ''}" onclick="switchTab('${item.id}')">
      ${item.icon} ${item.label}
      ${badges[item.id] ? `<span class="nav-badge">${badges[item.id]}</span>` : ''}
    </button>`).join('');
  const TAB_LABELS = { dashboard: 'Dashboard', leetcode: 'DSA Sheet', career: 'Career Tools' };
  document.getElementById('topbar-page').textContent = TAB_LABELS[activeTab] || 'Dashboard';
  document.getElementById('topbar-streak-val').textContent = computeStreak();
  document.getElementById('sidebar-lc-count').textContent = `${lcSolved} / ${LC_TOTAL}`;
  document.getElementById('sidebar-xp-fill').style.width = `${Math.min(100, lcSolved / LC_TOTAL * 100).toFixed(1)}%`;
  // Sync mobile nav
  document.querySelectorAll('.mobile-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === activeTab);
  });
}

function switchTab(id) {
  if (id === 'home') { showLanding(); return; }
  activeTab = id;
  localStorage.setItem('vk_active_tab', id);
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  if (id !== 'leetcode') { selectedStep = null; selectedSubstep = null; }
  renderNav();
  renderSection(id);
  document.getElementById('content-area').scrollTop = 0;
}

function renderSection(id) {
  if (id === 'dashboard') renderDashboard();
  if (id === 'leetcode')  renderLeetcode();
  if (id === 'career')    renderCareer();
}

/* ─── Theme ─────────────────────────────────────────────────── */
function applyThemeIcon() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  icon.innerHTML = isDark
    ? '<path d="M13.5 10A5.5 5.5 0 0 1 6 2.5a5.5 5.5 0 1 0 7.5 7.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>'
    : '<circle cx="8" cy="8" r="3"/><path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.6 3.6l.7.7M11.7 11.7l.7.7M3.6 12.4l.7-.7M11.7 4.3l.7-.7"/>';
}
function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('vk_theme', next);
  applyThemeIcon();
  if (window._monacoEditor) {
    window.monaco.editor.setTheme(next === 'dark' ? 'vs-dark' : 'vs');
  }
}

/* ─── Dashboard ─────────────────────────────────────────────── */
function renderDashboard() {
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const stats = lcStats();
  const days = daysUntil(PLACEMENT_DATE);
  const pct = (stats.total / LC_TOTAL * 100).toFixed(0);

  const stepBars = D.steps.slice(0, 9).map(step => {
    const s = stepSolved(step);
    const tot = stepProblems(step);
    const p = Math.min(100, s / Math.max(1, tot) * 100).toFixed(0);
    return `<div class="bar-row">
      <div class="bar-row-name">${step.name.replace(/\s*\[.*?\]/g,'').trim()}</div>
      <div class="bar-track"><div class="bar-fill" style="background:${step.color};width:${p}%"></div></div>
      <div class="bar-row-val">${s}/${tot}</div>
    </div>`;
  }).join('');

  const milestones = [
    { label: 'Start getaway\'s DSA grind', done: lcTotal() > 0, date: 'May 2026' },
    { label: 'Reach 50 problems', done: lcTotal() >= 50, date: 'Jun 2026' },
    { label: 'Reach 100 problems', done: lcTotal() >= 100, date: 'Jul 2026' },
    { label: 'Reach 200 problems', done: lcTotal() >= 200, date: 'Aug 2026' },
    { label: 'Reach 300 problems', done: lcTotal() >= 300, date: 'Sep 2026' },
    { label: 'Complete the DSA Sheet (473)', done: lcTotal() >= 473, date: 'Oct 2026' },
    { label: 'Placement season begins', done: false, date: 'Oct 2026' },
  ];

  const milestoneRows = milestones.map(m => `
    <div class="milestone-item">
      <div style="width:20px;height:20px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;font-size:10px;font-weight:700;
        background:${m.done ? 'var(--easy-soft)' : 'var(--surface-2)'};
        color:${m.done ? 'var(--easy)' : 'var(--text-faint)'};
        border:1px solid ${m.done ? 'var(--easy)' : 'var(--border)'};">${m.done ? '✓' : '○'}</div>
      <span style="flex:1;${m.done ? 'text-decoration:line-through;color:var(--text-faint);' : ''}">${m.label}</span>
      <span style="font-size:11px;color:var(--text-faint);">${m.date}</span>
    </div>`).join('');

  document.getElementById('tab-dashboard').innerHTML = `
    <div class="page-header pop-in">
      <div>
        <h1 class="page-title">${greet}, <em>${currentUser?.name?.split(' ')[0] || 'there'}</em>.</h1>
        <p class="page-sub">${days} days to placement season · ${stats.total}/${LC_TOTAL} problems solved</p>
      </div>
    </div>
    <div class="dash-stats pop-in">
      <div class="card tight">
        <div class="card-title">DSA Progress</div>
        <div class="stat-val" style="color:var(--accent)">${stats.total}<sup>/${LC_TOTAL}</sup></div>
        <div class="bar-track" style="margin-top:12px;"><div class="bar-fill" style="width:${pct}%"></div></div>
        <div style="display:flex;gap:10px;font-size:11px;color:var(--text-muted);margin-top:8px;">
          <span style="color:var(--easy)">● ${stats.E}E</span>
          <span style="color:var(--med)">● ${stats.M}M</span>
          <span style="color:var(--hard)">● ${stats.H}H</span>
        </div>
      </div>
      <div class="card tight">
        <div class="card-title">Streak</div>
        <div class="stat-val" style="color:#C2410C">${computeStreak()}<sup>days</sup></div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:12px;">${lastSolvedDate() ? 'Last: ' + fmtDate(lastSolvedDate()) : 'Solve a problem to start!'}</div>
      </div>
      <div class="card tight">
        <div class="card-title">On LeetCode</div>
        <div class="stat-val" style="color:#F97316">${lcLinkedSolved()}<sup>/${LC_TOTAL}</sup></div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:12px;">LC-linked solved</div>
      </div>
    </div>
    <div class="pop-in d1">
      <div class="card">
        <div class="card-title-row">
          <div class="card-title">DSA by Step</div>
          <button class="btn btn-sm btn-ghost" onclick="switchTab('leetcode')">view all →</button>
        </div>
        ${stepBars}
        ${D.steps.length > 9 ? `<div style="font-size:11.5px;color:var(--text-faint);margin-top:8px;">+${D.steps.length - 9} more steps — click "view all"</div>` : ''}
      </div>
    </div>
    <div class="card mt-6 pop-in d2">
      <div class="card-title">Roadmap Milestones</div>
      ${milestoneRows}
    </div>`;
}

/* ─── A2Z — 3-level navigation ──────────────────────────────── */
function renderLeetcode() {
  if (selectedStep !== null && selectedSubstep !== null) renderSubstepDetail();
  else if (selectedStep !== null) renderStepDetail();
  else renderStepGrid();
}

/* Level 1: Step grid */
function renderStepGrid() {
  const stats = lcStats();
  const el = document.getElementById('tab-leetcode');
  el.innerHTML = `
    <div class="page-header pop-in">
      <div>
        <h1 class="page-title">getaway's <em>DSA</em> sheet.</h1>
        <p class="page-sub">473 problems across 18 steps. Check off problems as you solve them.</p>
      </div>
    </div>
    <div class="dash-stats pop-in" style="margin-bottom:24px;">
      <div class="card tight">
        <div class="card-title">Total Solved</div>
        <div class="stat-val" style="color:var(--accent)">${stats.total}<sup>/${LC_TOTAL}</sup></div>
        <div class="bar-track" style="margin-top:12px;"><div class="bar-fill" style="width:${(stats.total/LC_TOTAL*100).toFixed(1)}%"></div></div>
      </div>
      <div class="card tight">
        <div class="card-title">Easy</div>
        <div class="stat-val" style="color:var(--easy)">${stats.E}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:8px;">solved</div>
      </div>
      <div class="card tight">
        <div class="card-title">Medium</div>
        <div class="stat-val" style="color:var(--med)">${stats.M}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:8px;">solved</div>
      </div>
      <div class="card tight">
        <div class="card-title">Hard</div>
        <div class="stat-val" style="color:var(--hard)">${stats.H}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:8px;">solved</div>
      </div>
    </div>
    <div style="font-size:15px;font-weight:600;margin-bottom:14px;">
      Steps <span style="font-size:12.5px;font-weight:400;color:var(--text-muted);">— click a step to see its problems</span>
    </div>
    <div class="step-grid pop-in d1" id="step-grid"></div>
    <div class="card mt-6 pop-in d2">
      <div class="card-title-row"><div class="card-title">Daily Log</div></div>
      <div id="lc-log-list"></div>
    </div>`;

  document.getElementById('step-grid').innerHTML = D.steps.map((step, si) => {
    const solved = stepSolved(step);
    const total = stepProblems(step);
    const pct = Math.min(100, solved / Math.max(1, total) * 100).toFixed(0);
    const eD = step.substeps.reduce((a, ss) => a + ss.problems.filter(p => p.done && p.d === 'E').length, 0);
    const mD = step.substeps.reduce((a, ss) => a + ss.problems.filter(p => p.done && p.d === 'M').length, 0);
    const hD = step.substeps.reduce((a, ss) => a + ss.problems.filter(p => p.done && p.d === 'H').length, 0);
    const diffPips = [
      eD > 0 ? `<span style="color:var(--easy)">●${eD}E</span>` : '',
      mD > 0 ? `<span style="color:var(--med)">●${mD}M</span>` : '',
      hD > 0 ? `<span style="color:var(--hard)">●${hD}H</span>` : '',
    ].filter(Boolean).join(' ');
    return `<div class="step-card" style="border-left-color:${step.color}" onclick="openStep(${si})">
      <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;">
        <div style="width:22px;height:22px;border-radius:6px;background:${step.color};display:grid;place-items:center;color:white;font-size:10px;font-weight:700;flex-shrink:0;margin-top:1px;">${si+1}</div>
        <div style="font-size:13px;font-weight:600;line-height:1.3;">${step.name}</div>
      </div>
      <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:8px;">
        <span style="font-family:var(--font-display);font-size:26px;line-height:1;color:${step.color}">${solved}</span>
        <span style="font-size:12px;color:var(--text-muted)">/ ${total}</span>
      </div>
      <div class="bar-track" style="margin-bottom:8px;"><div class="bar-fill" style="background:${step.color};width:${pct}%"></div></div>
      <div style="display:flex;align-items:center;gap:8px;font-size:11px;">
        ${diffPips || '<span style="color:var(--text-faint)">Not started</span>'}
        <span style="color:var(--text-faint);margin-left:auto;">${step.substeps.length} sub-steps</span>
      </div>
    </div>`;
  }).join('');

  renderLogSection();
}

/* Level 2: Step detail (sub-step list) */
function openStep(si) {
  selectedStep = si;
  selectedSubstep = null;
  renderStepDetail();
  document.getElementById('content-area').scrollTop = 0;
}

function renderStepDetail() {
  const step = D.steps[selectedStep];
  const el = document.getElementById('tab-leetcode');
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
      <button class="btn btn-ghost" onclick="backToSteps()">← All Steps</button>
      <div>
        <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${step.color};margin-bottom:1px;">Step ${selectedStep+1}</div>
        <div style="font-size:20px;font-weight:700;letter-spacing:-0.02em;">${step.name}</div>
      </div>
    </div>
    <div class="substep-list" id="substep-list"></div>`;

  document.getElementById('substep-list').innerHTML = step.substeps.map((ss, ssi) => {
    const solved = substepSolved(ss);
    const total = ss.problems.length;
    const pct = Math.min(100, solved / Math.max(1, total) * 100).toFixed(0);
    const eT = ss.problems.filter(p => p.d === 'E').length;
    const mT = ss.problems.filter(p => p.d === 'M').length;
    const hT = ss.problems.filter(p => p.d === 'H').length;
    return `<div class="substep-card" onclick="openSubstep(${selectedStep},${ssi})">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div style="font-size:14px;font-weight:600;">${ss.name}</div>
        <div style="font-size:12px;color:var(--text-muted);flex-shrink:0;margin-left:12px;">${solved} / ${total} done</div>
      </div>
      <div class="bar-track" style="margin-bottom:8px;"><div class="bar-fill" style="background:${step.color};width:${pct}%"></div></div>
      <div style="display:flex;align-items:center;gap:10px;font-size:11px;">
        ${eT > 0 ? `<span style="color:var(--easy)">${eT} Easy</span>` : ''}
        ${mT > 0 ? `<span style="color:var(--med)">${mT} Medium</span>` : ''}
        ${hT > 0 ? `<span style="color:var(--hard)">${hT} Hard</span>` : ''}
        <span style="color:var(--text-faint);margin-left:auto;font-size:12px;">→</span>
      </div>
    </div>`;
  }).join('');
}

function backToSteps() {
  selectedStep = null;
  selectedSubstep = null;
  renderStepGrid();
  document.getElementById('content-area').scrollTop = 0;
}

/* Level 3: Sub-step detail (problem table) */
function openSubstep(si, ssi) {
  selectedStep = si;
  selectedSubstep = ssi;
  renderSubstepDetail();
  document.getElementById('content-area').scrollTop = 0;
}

function backToStep() {
  selectedSubstep = null;
  renderStepDetail();
  document.getElementById('content-area').scrollTop = 0;
}

const PENCIL_SVG = `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M9 1.5l3 3-7.5 7.5H1v-3.5L9 1.5zM8 2.5l3 3"/></svg>`;

function renderSubstepDetail() {
  const step = D.steps[selectedStep];
  const ss = step.substeps[selectedSubstep];
  const solved = substepSolved(ss);
  const total = ss.problems.length;
  const pct = Math.min(100, solved / Math.max(1, total) * 100).toFixed(0);
  const prevSsi = selectedSubstep > 0 ? selectedSubstep - 1 : null;
  const nextSsi = selectedSubstep < step.substeps.length - 1 ? selectedSubstep + 1 : null;

  const probRows = ss.problems.map((p, pi) => {
    const hasNote = !!p.note;
    const notePreview = p.note
      ? `<div style="font-size:11px;color:var(--text-faint);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:360px;">${p.note.replace(/</g,'&lt;')}</div>`
      : '';
    let nameCell;
    if (p.lc) {
      nameCell = `<a href="https://leetcode.com/problems/${p.lc}/" target="_blank" class="prob-link ${p.done?'done':''}">${p.t}<img src="leetcode.png" class="platform-logo" alt="LC"></a>${notePreview}`;
    } else {
      const gfgLogo = p.gfg ? `<img src="gfg.png" class="platform-logo" alt="GFG">` : '';
      nameCell = `<button class="prob-editor-btn ${p.done?'done':''}" onclick="openCodeEditor(${selectedStep},${selectedSubstep},${pi})">${p.t}${gfgLogo} <span class="editor-hint">▶ editor</span></button>${notePreview}`;
    }
    return `
      <tr class="row">
        <td style="width:38px;"><input type="checkbox" class="prob-cb" ${p.done?'checked':''} onchange="toggleProblem(${selectedStep},${selectedSubstep},${pi},this.checked)"></td>
        <td class="num">${pi+1}.</td>
        <td>${nameCell}</td>
        <td>${diffBadge(p.d)}</td>
        <td style="width:32px;">
          <button class="btn-note ${hasNote?'has-note':''}" onclick="toggleNote(${selectedStep},${selectedSubstep},${pi})" title="${hasNote?'Edit note':'Add note'}">${PENCIL_SVG}</button>
        </td>
      </tr>
      <tr class="note-row" id="note-row-${selectedStep}-${selectedSubstep}-${pi}" style="display:none">
        <td colspan="5" class="note-row">
          <textarea class="note-input" placeholder="Your notes, approach, key insight, edge cases..." onblur="saveNote(${selectedStep},${selectedSubstep},${pi},this.value)" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'">${(p.note||'').replace(/</g,'&lt;').replace(/`/g,'&#96;')}</textarea>
        </td>
      </tr>`;
  }).join('');

  document.getElementById('tab-leetcode').innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:20px;flex-wrap:wrap;">
      <button class="btn btn-ghost btn-sm" onclick="backToSteps()">← Steps</button>
      <span style="color:var(--text-faint);">/</span>
      <button class="btn btn-ghost btn-sm" onclick="backToStep()">${step.name.replace(/\s*\[.*?\]/g,'').trim()}</button>
      <span style="color:var(--text-faint);">/</span>
      <span style="font-size:13px;font-weight:500;color:var(--text);">${ss.name}</span>
    </div>
    <div class="detail-header">
      <div>
        <div style="font-size:10.5px;font-weight:700;color:${step.color};text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px;">Step ${selectedStep+1} · ${step.name}</div>
        <div style="font-size:20px;font-weight:700;letter-spacing:-0.02em;">${ss.name}</div>
      </div>
      <div class="detail-stats">
        <div class="detail-stat">
          <div class="detail-stat-val" style="color:${step.color}">${solved}/${total}</div>
          <div class="detail-stat-label">done</div>
        </div>
        <div class="detail-stat">
          <div class="detail-stat-val" style="color:var(--easy)">${ss.problems.filter(p=>p.done&&p.d==='E').length}/${ss.problems.filter(p=>p.d==='E').length}</div>
          <div class="detail-stat-label">Easy</div>
        </div>
        <div class="detail-stat">
          <div class="detail-stat-val" style="color:var(--med)">${ss.problems.filter(p=>p.done&&p.d==='M').length}/${ss.problems.filter(p=>p.d==='M').length}</div>
          <div class="detail-stat-label">Med</div>
        </div>
      </div>
    </div>
    <div style="margin-bottom:20px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px;"><span>Progress</span><span>${pct}%</span></div>
      <div class="bar-track" style="height:8px;"><div class="bar-fill" style="background:${step.color};width:${pct}%"></div></div>
    </div>
    <div class="card" style="padding:0;overflow:hidden;">
      <table class="ptable">
        <thead><tr><th style="width:38px;"></th><th style="width:40px;">#</th><th>Problem</th><th style="width:90px;">Difficulty</th><th style="width:32px;"></th></tr></thead>
        <tbody>${probRows}</tbody>
      </table>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px;">
      ${prevSsi !== null ? `<button class="btn btn-ghost btn-sm" onclick="openSubstep(${selectedStep},${prevSsi})">← ${step.substeps[prevSsi].name}</button>` : ''}
      ${nextSsi !== null ? `<button class="btn btn-ghost btn-sm" onclick="openSubstep(${selectedStep},${nextSsi})">${step.substeps[nextSsi].name} →</button>` : ''}
    </div>`;
}

function toggleProblem(si, ssi, pi, val) {
  D.steps[si].substeps[ssi].problems[pi].done = val;
  D.steps[si].substeps[ssi].problems[pi].solvedOn = val ? today() : null;
  save(D);
  renderSubstepDetail();
  renderNav();
}

function toggleNote(si, ssi, pi) {
  const row = document.getElementById(`note-row-${si}-${ssi}-${pi}`);
  if (!row) return;
  const hidden = row.style.display === 'none';
  row.style.display = hidden ? '' : 'none';
  if (hidden) { const ta = row.querySelector('textarea'); ta.style.height='auto'; ta.style.height=Math.max(64,ta.scrollHeight)+'px'; ta.focus(); }
}

function saveNote(si, ssi, pi, val) {
  D.steps[si].substeps[ssi].problems[pi].note = val.trim();
  save(D);
  const row = document.getElementById(`note-row-${si}-${ssi}-${pi}`);
  if (row) {
    const prev = row.previousElementSibling;
    if (prev) { const btn = prev.querySelector('.btn-note'); if (btn) btn.classList.toggle('has-note', !!val.trim()); }
  }
}

/* ─── Activity log ──────────────────────────────────────────── */
function renderLogSection() {
  const el = document.getElementById('lc-log-list');
  if (!el) return;
  const entries = getDailyLog();
  if (!entries.length) {
    el.innerHTML = '<div class="empty" style="padding:24px 0;">No activity yet — solve problems and they\'ll appear here.</div>';
    return;
  }
  el.innerHTML = entries.slice(0, 60).map(([date, data]) => {
    const note = (D.dailyNotes || {})[date] || '';
    const total = data.E + data.M + data.H;
    const counts = [
      data.E > 0 ? `<span style="color:var(--easy)">${data.E}E</span>` : '',
      data.M > 0 ? `<span style="color:var(--med)">${data.M}M</span>` : '',
      data.H > 0 ? `<span style="color:var(--hard)">${data.H}H</span>` : '',
    ].filter(Boolean).join('&thinsp;');
    return `<div style="padding:10px 0;border-bottom:1px solid var(--border);">
      <div style="display:flex;align-items:center;gap:10px;">
        <div class="log-date">${fmtDate(date)}</div>
        <div style="flex:1;"><span style="font-size:13px;font-weight:500;">${total} problem${total!==1?'s':''}</span>
          <span style="font-size:11.5px;margin-left:8px;font-family:var(--font-mono);">${counts}</span></div>
        <button class="btn-note ${note?'has-note':''}" onclick="toggleDayNote('${date}')" title="${note?'Edit note':'Add note'}">${PENCIL_SVG}</button>
      </div>
      <div id="day-note-row-${date}" style="${note?'':'display:none;'}margin-top:8px;">
        <textarea class="note-input" style="min-height:52px;" placeholder="What did you learn? Patterns, insights..." onblur="saveDailyNote('${date}',this.value)" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'">${note.replace(/</g,'&lt;')}</textarea>
      </div>
    </div>`;
  }).join('');
}

function toggleDayNote(date) {
  const row = document.getElementById(`day-note-row-${date}`);
  if (!row) return;
  const hidden = row.style.display === 'none';
  row.style.display = hidden ? '' : 'none';
  if (hidden) { const ta = row.querySelector('textarea'); ta.style.height='auto'; ta.style.height=Math.max(52,ta.scrollHeight)+'px'; ta.focus(); }
}

function saveDailyNote(date, val) {
  if (!D.dailyNotes) D.dailyNotes = {};
  D.dailyNotes[date] = val.trim();
  save(D);
  const row = document.getElementById(`day-note-row-${date}`);
  if (row) { const btn = row.parentElement.querySelector('.btn-note'); if (btn) btn.classList.toggle('has-note', !!val.trim()); }
}

/* ─── Code Editor ───────────────────────────────────────────── */
const MONACO_LANG_MAP = { python: 'python', cpp: 'cpp' };

/* Analyse a raw example-input string and return a shape descriptor */
function _analyseInput(rawInput, type) {
  if (type === 'pattern') return { shape: 'single_int' };
  const s = String(rawInput || '').trim();
  if (!s) return { shape: 'custom' };

  const lines = s.split('\n');
  const isNum = v => v !== '' && !isNaN(v);

  const l0 = lines[0].trim().split(/\s+/).filter(Boolean);
  const l1 = lines.length > 1 ? lines[1].trim().split(/\s+/).filter(Boolean) : [];

  if (lines.length === 1) {
    if (l0.length === 1)  return isNum(l0[0]) ? { shape: 'single_int' }  : { shape: 'single_str' };
    if (l0.length === 2)  return l0.every(isNum) ? { shape: 'two_ints_sameline' } : { shape: 'two_strs_sameline' };
    if (l0.every(isNum)) return { shape: 'array_sameline', n: l0.length };
    // mixed: first token could be a string label
    return { shape: 'custom' };
  }

  if (lines.length === 2) {
    if (l0.length === 1 && isNum(l0[0]) && l1.length > 1 && l1.every(isNum))
      return { shape: 'n_then_array' };
    if (l0.length === 1 && l1.length === 1)
      return { shape: 'two_ints_twolines' };
    if (l0.length > 1 && l1.length > 1)
      return { shape: 'two_arrays' };
  }

  if (lines.length === 3) {
    if (l0.length === 1 && isNum(l0[0]))
      return { shape: 'n_then_two_arrays' };
  }

  return { shape: 'custom' };
}

function starterCode(problem, lang) {
  const type   = problem.type || 'custom';
  const firstEx = (problem.examples || [])[0];
  const { shape } = _analyseInput(firstEx ? firstEx.input : '', type);

  const py = {
    single_int:        'n = int(input())\n\n# your solution here\n',
    single_str:        's = input()\n\n# your solution here\n',
    two_ints_sameline: 'a, b = map(int, input().split())\n\n# your solution here\n',
    two_strs_sameline: 'a, b = input().split()\n\n# your solution here\n',
    two_ints_twolines: 'a = int(input())\nb = int(input())\n\n# your solution here\n',
    n_then_array:      'n = int(input())\narr = list(map(int, input().split()))\n\n# your solution here\n',
    array_sameline:    'arr = list(map(int, input().split()))\n\n# your solution here\n',
    two_arrays:        'arr1 = list(map(int, input().split()))\narr2 = list(map(int, input().split()))\n\n# your solution here\n',
    n_then_two_arrays: 'n = int(input())\narr1 = list(map(int, input().split()))\narr2 = list(map(int, input().split()))\n\n# your solution here\n',
    pattern:           'n = int(input())\n\n# print pattern here\nfor i in range(1, n + 1):\n    print("*" * i)\n',
    custom:            '# your solution here\n',
  };

  const cpp_head = '#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n';
  const cpp_tail = '  // your solution here\n  return 0;\n}\n';
  const cpp = {
    single_int:        cpp_head + '  int n; cin >> n;\n\n' + cpp_tail,
    single_str:        cpp_head + '  string s; cin >> s;\n\n' + cpp_tail,
    two_ints_sameline: cpp_head + '  int a, b; cin >> a >> b;\n\n' + cpp_tail,
    two_strs_sameline: cpp_head + '  string a, b; cin >> a >> b;\n\n' + cpp_tail,
    two_ints_twolines: cpp_head + '  int a, b; cin >> a >> b;\n\n' + cpp_tail,
    n_then_array:      cpp_head + '  int n; cin >> n;\n  vector<int> arr(n);\n  for(int i = 0; i < n; i++) cin >> arr[i];\n\n' + cpp_tail,
    array_sameline:    cpp_head + '  int x;\n  vector<int> arr;\n  while(cin >> x) arr.push_back(x);\n\n' + cpp_tail,
    two_arrays:        cpp_head + '  int n; cin >> n;\n  vector<int> a(n), b(n);\n  for(int i=0;i<n;i++) cin>>a[i];\n  for(int i=0;i<n;i++) cin>>b[i];\n\n' + cpp_tail,
    n_then_two_arrays: cpp_head + '  int n; cin >> n;\n  vector<int> a(n), b(n);\n  for(int i=0;i<n;i++) cin>>a[i];\n  for(int i=0;i<n;i++) cin>>b[i];\n\n' + cpp_tail,
    pattern:           cpp_head + '  int n; cin >> n;\n  for(int i=1;i<=n;i++){\n    for(int j=0;j<i;j++) cout<<"*";\n    cout<<"\\n";\n  }\n  return 0;\n}\n',
    custom:            cpp_head + cpp_tail,
  };

  if (lang === 'python') return py[shape] || py.custom;
  if (lang === 'cpp')    return cpp[shape] || cpp.custom;
  return '# your solution here\n';
}

/* ─── In-browser runtimes (no external API) ─────────────────── */

let _pyodideReady = null;
let _jscppReady = null;

function _loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

function _getPyodide() {
  if (!_pyodideReady) {
    const CDN = 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/';
    _pyodideReady = _loadScript(CDN + 'pyodide.js')
      .then(() => window.loadPyodide({ indexURL: CDN }))
      .then(py => {
        // Pre-warm: set up stdout capture template once
        py.runPython('import sys, io, builtins, traceback');
        return py;
      });
  }
  return _pyodideReady;
}

function _getJSCPP() {
  if (!_jscppReady) {
    _jscppReady = _loadScript('https://cdn.jsdelivr.net/npm/JSCPP@2.1.2/dist/JSCPP.es5.min.js');
  }
  return _jscppReady;
}

async function _runPython(code, stdinText) {
  const py = await _getPyodide();
  py.globals.set('_user_code', code);
  py.globals.set('_stdin_data', py.toPy(stdinText.split('\n')));

  const output = await py.runPythonAsync(`
_buf = io.StringIO()
_old_out, _old_err = sys.stdout, sys.stderr
sys.stdout = sys.stderr = _buf
_si = [0]

def _inp(prompt=''):
    i = _si[0]; _si[0] += 1
    lines = list(_stdin_data)
    return str(lines[i]) if i < len(lines) else ''

builtins.input = _inp

try:
    exec(str(_user_code), {})
except SystemExit:
    pass
except Exception:
    _buf.write(traceback.format_exc())
finally:
    sys.stdout = _old_out
    sys.stderr = _old_err

_buf.getvalue()
`);
  return output || '(no output)';
}

function _runCpp(code, stdinText) {
  return new Promise(resolve => {
    let out = '';
    try {
      JSCPP.run(code, stdinText, {
        stdio: { write: s => { out += s; } },
        maxTimeout: 8000,
      });
      resolve(out || '(no output)');
    } catch(e) {
      // JSCPP often throws objects not Errors
      const msg = (e && e.message) ? e.message : (e && e.msg) ? e.msg : String(e);
      resolve('Runtime Error:\n' + msg);
    }
  });
}

function _buildProblemDesc(problem) {
  const esc = s => String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;');

  /* ── Input format description derived from the first example ── */
  const firstEx = (problem.examples || [])[0];
  const { shape } = _analyseInput(firstEx ? firstEx.input : '', problem.type || 'custom');
  const inputFmtMap = {
    single_int:        'A single integer on one line.',
    single_str:        'A single string on one line.',
    two_ints_sameline: 'A single line containing two space-separated integers.',
    two_strs_sameline: 'A single line containing two space-separated strings.',
    two_ints_twolines: 'Two lines, each containing one integer.',
    n_then_array:      'Line 1: integer N (array size).\nLine 2: N space-separated integers.',
    array_sameline:    'A single line of space-separated integers.',
    two_arrays:        'Line 1: N space-separated integers.\nLine 2: N space-separated integers.',
    n_then_two_arrays: 'Line 1: integer N.\nLine 2: N integers (first array).\nLine 3: N integers (second array).',
    pattern:           'A single integer N.',
    custom:            'See examples below.',
  };
  const inputFmt = inputFmtMap[shape] || 'See examples below.';

  /* ── Output format: infer from first example output ── */
  const firstOut = firstEx ? String(firstEx.output).trim() : '';
  const outIsNum = firstOut !== '' && !isNaN(firstOut);
  const outIsMultiLine = firstOut.includes('\n');
  const outputFmt = outIsMultiLine
    ? 'Multiple lines as described in the problem.'
    : outIsNum ? 'A single number.'
    : firstOut.toLowerCase() === 'true' || firstOut.toLowerCase() === 'false'
      ? '"true" or "false" (case-insensitive).'
      : 'A single line of output.';

  /* ── Constraints ── */
  const constraintsMap = {
    E: '1 ≤ N ≤ 10<sup>5</sup>',
    M: '1 ≤ N ≤ 10<sup>5</sup> &nbsp;·&nbsp; Values may be negative',
    H: '1 ≤ N ≤ 10<sup>6</sup> &nbsp;·&nbsp; Optimise for time and space',
  };
  const constraints = constraintsMap[problem.d] || '1 ≤ N ≤ 10<sup>5</sup>';

  /* ── Examples ── */
  const examplesHtml = (problem.examples || []).map((ex, idx) => `
    <div class="prob-example">
      <div class="prob-example-label">Example ${idx + 1}</div>
      <div class="prob-io-grid">
        <div class="prob-io-box">
          <div class="prob-io-label">Input</div>
          <pre class="prob-io-pre">${esc(ex.input)}</pre>
        </div>
        <div class="prob-io-box">
          <div class="prob-io-label">Output</div>
          <pre class="prob-io-pre">${esc(ex.output)}</pre>
        </div>
      </div>
      ${ex.explanation ? `<div class="prob-explanation"><strong>Explanation:</strong> ${esc(ex.explanation)}</div>` : ''}
    </div>`).join('');

  return `
    <div class="prob-header">
      <div class="prob-title">${esc(problem.t)}</div>
      <div class="prob-badges">${diffBadge(problem.d)}${problem.gfg ? `&nbsp;<a href="${problem.gfg}" target="_blank" class="prob-gfg-link">GFG ↗</a>` : ''}</div>
    </div>

    <div class="prob-section">
      <div class="prob-section-body prob-statement">${(problem.desc || '').replace(/\n/g,'<br>')}</div>
    </div>

    <div class="prob-section">
      <div class="prob-section-title">Input Format</div>
      <div class="prob-section-body">${inputFmt.replace(/\n/g,'<br>')}</div>
    </div>

    <div class="prob-section">
      <div class="prob-section-title">Output Format</div>
      <div class="prob-section-body">${outputFmt}</div>
    </div>

    <div class="prob-section">
      <div class="prob-section-title">Constraints</div>
      <div class="prob-section-body">${constraints}</div>
    </div>

    ${examplesHtml ? `<div class="prob-section"><div class="prob-section-title">Examples</div>${examplesHtml}</div>` : ''}`;
}

function openCodeEditor(si, ssi, pi) {
  codeEditorContext = { si, ssi, pi };
  currentCodeLang = 'python';
  const problem = D.steps[si].substeps[ssi].problems[pi];

  document.getElementById('code-modal-title').textContent = problem.t;
  document.getElementById('code-modal-step-label').textContent = `Step ${si+1} · ${D.steps[si].name}`;

  const descEl = document.getElementById('code-modal-desc');
  descEl.innerHTML = _buildProblemDesc(problem);

  if (problem.gfg) {
    descEl.innerHTML = '<div class="gfg-loading">Loading description from GFG…</div>';
    fetch(`/api/gfg?url=${encodeURIComponent(problem.gfg)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.html) { descEl.innerHTML = _buildProblemDesc(problem); return; }
        const clean = data.html.replace(/\s*style="[^"]*"/g, '');
        descEl.innerHTML = `<div class="gfg-desc">${clean}</div>`;
      })
      .catch(() => { descEl.innerHTML = _buildProblemDesc(problem); });
  }

  _syncMarkDoneBtn(problem);
  document.getElementById('code-lang-select').value = currentCodeLang;
  document.getElementById('code-output-wrap').style.display = 'none';

  // Auto-populate stdin from the first example
  const firstEx = (problem.examples || [])[0];
  const stdinEl = document.getElementById('code-stdin');
  if (stdinEl && firstEx) stdinEl.value = String(firstEx.input);
  else if (stdinEl) stdinEl.value = '';

  document.getElementById('code-modal').style.display = 'flex';
  loadMonaco(() => { setupCodeEditor(si, ssi, pi, currentCodeLang); });

  // Pre-warm runtimes in background so first Run is fast
  if (currentCodeLang === 'python') _getPyodide().catch(() => {});
  else _getJSCPP().catch(() => {});
}

function _syncMarkDoneBtn(problem) {
  const btn = document.getElementById('mark-done-btn');
  if (!btn) return;
  if (problem.done) {
    btn.textContent = 'Marked Solved ✓';
    btn.style.cssText = 'background:var(--easy);color:white;border-color:var(--easy);';
  } else {
    btn.textContent = 'Mark as Solved';
    btn.style.cssText = '';
  }
}

function loadMonaco(cb) {
  if (window._monacoLoaded) { cb(); return; }
  if (window._monacoLoading) { const iv = setInterval(() => { if (window._monacoLoaded || window._monacoFailed) { clearInterval(iv); cb(); } }, 100); return; }
  window._monacoLoading = true;
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
  script.onerror = () => { window._monacoFailed = true; window._monacoLoading = false; cb(); };
  script.onload = () => {
    require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
    require(['vs/editor/editor.main'], () => { window._monacoLoaded = true; window._monacoLoading = false; cb(); });
  };
  document.head.appendChild(script);
}

function setupCodeEditor(si, ssi, pi, lang) {
  const problem = D.steps[si].substeps[ssi].problems[pi];
  const key = `${problem.s}-${lang}`;
  const code = codeStore[key] !== undefined ? codeStore[key] : starterCode(problem, lang);
  const container = document.getElementById('monaco-container');

  if (window._monacoFailed || !window.monaco) {
    container.innerHTML = `<textarea id="code-textarea" spellcheck="false" style="width:100%;height:100%;min-height:300px;font-family:var(--font-mono);font-size:13px;padding:12px;border:none;outline:none;background:var(--surface-2);color:var(--text);resize:none;">${code.replace(/</g,'&lt;')}</textarea>`;
    return;
  }
  if (window._monacoEditor) { window._monacoEditor.dispose(); window._monacoEditor = null; }
  window._monacoEditor = window.monaco.editor.create(container, {
    value: code,
    language: MONACO_LANG_MAP[lang] || 'python',
    theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'vs-dark' : 'vs',
    fontSize: 13,
    fontFamily: "'Geist Mono', ui-monospace, monospace",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    automaticLayout: true,
    padding: { top: 10 },
  });
}

function getEditorCode() {
  if (window._monacoEditor) return window._monacoEditor.getValue();
  const ta = document.getElementById('code-textarea');
  return ta ? ta.value : '';
}

function switchCodeLang(lang) {
  if (!codeEditorContext) return;
  const { si, ssi, pi } = codeEditorContext;
  const problem = D.steps[si].substeps[ssi].problems[pi];
  codeStore[`${problem.s}-${currentCodeLang}`] = getEditorCode();
  currentCodeLang = lang;
  setupCodeEditor(si, ssi, pi, lang);
  document.getElementById('code-output-wrap').style.display = 'none';
}

async function runUserCode() {
  const btn = document.getElementById('run-code-btn');
  btn.disabled = true;
  const code = getEditorCode();
  const stdin = (document.getElementById('code-stdin') || {}).value || '';
  try {
    if (currentCodeLang === 'python') {
      btn.textContent = _pyodideReady ? '⏳ Running…' : '⏳ Loading Python (first run)…';
      const out = await _runPython(code, stdin);
      showCodeOutput(out.trim());
    } else if (currentCodeLang === 'cpp') {
      btn.textContent = _jscppReady ? '⏳ Running…' : '⏳ Loading C++ runtime…';
      await _getJSCPP();
      const out = await _runCpp(code, stdin);
      showCodeOutput(out.trim());
    }
  } catch(e) {
    showCodeOutput('Error: ' + e.message);
  } finally {
    btn.disabled = false; btn.textContent = '▶ Run';
  }
}

function showCodeOutput(text) {
  const wrap = document.getElementById('code-output-wrap');
  document.getElementById('code-output-pre').textContent = text;
  wrap.style.display = '';
}

function markCodeProblemDone() {
  if (!codeEditorContext) return;
  const { si, ssi, pi } = codeEditorContext;
  const p = D.steps[si].substeps[ssi].problems[pi];
  p.done = !p.done;
  p.solvedOn = p.done ? today() : null;
  save(D);
  _syncMarkDoneBtn(p);
  renderNav();
}

function closeCodeModal() {
  if (codeEditorContext) {
    const { si, ssi, pi } = codeEditorContext;
    const problem = D.steps[si].substeps[ssi].problems[pi];
    codeStore[`${problem.s}-${currentCodeLang}`] = getEditorCode();
  }
  document.getElementById('code-modal').style.display = 'none';
  if (selectedStep !== null && selectedSubstep !== null) renderSubstepDetail();
}

/* ─── Applications ──────────────────────────────────────────── */
function renderApplications() {
  const apps = D.applications;
  document.getElementById('tab-applications').innerHTML = `
    <div class="page-header pop-in">
      <div>
        <h1 class="page-title">Job <em>Applications</em>.</h1>
        <p class="page-sub">Track your application pipeline from wishlist to offer.</p>
      </div>
      <button class="btn btn-primary" onclick="openAppModal()">+ Add Application</button>
    </div>
    <div class="dash-stats pop-in" style="grid-template-columns:repeat(4,1fr);">
      <div class="card tight"><div class="card-title">Applied</div><div class="stat-val" style="color:#2563EB">${apps.filter(a=>a.status!=='Wishlist').length}</div></div>
      <div class="card tight"><div class="card-title">In Progress</div><div class="stat-val" style="color:var(--accent)">${apps.filter(a=>['OA','Interview'].includes(a.status)).length}</div></div>
      <div class="card tight"><div class="card-title">Offers</div><div class="stat-val" style="color:var(--easy)">${apps.filter(a=>a.status==='Offer').length}</div></div>
      <div class="card tight"><div class="card-title">Wishlist</div><div class="stat-val" style="color:var(--text-muted)">${apps.filter(a=>a.status==='Wishlist').length}</div></div>
    </div>
    <div class="card mt-6 pop-in d1" id="app-table-wrap"></div>`;

  if (apps.length === 0) {
    document.getElementById('app-table-wrap').innerHTML = '<div class="empty">No applications yet. Add your first one!</div>';
    return;
  }
  const rows = [...apps].reverse().map((a, ri) => {
    const i = apps.length - 1 - ri;
    return `<tr>
      <td style="font-weight:600;">${a.company}</td>
      <td style="color:var(--text-muted)">${a.role}</td>
      <td>${statusBadge(a.status)}</td>
      <td style="color:var(--text-faint);font-size:12px;">${fmtDate(a.date)}</td>
      <td style="max-width:200px;color:var(--text-muted);font-size:12px;">${a.notes||'—'}</td>
      <td style="white-space:nowrap;">
        <button class="btn btn-sm btn-ghost" onclick="editApp(${i})">Edit</button>
        <button class="btn-icon" onclick="deleteApp(${i})">✕</button>
      </td></tr>`;
  }).join('');
  document.getElementById('app-table-wrap').innerHTML = `
    <table class="app-table">
      <thead><tr><th>Company</th><th>Role</th><th>Status</th><th>Date</th><th>Notes</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function openAppModal(id) {
  document.getElementById('app-modal-title').textContent = id != null ? 'Edit Application' : 'Add Application';
  document.getElementById('app-edit-id').value = id != null ? id : '';
  if (id != null) {
    const a = D.applications[id];
    document.getElementById('app-company').value = a.company;
    document.getElementById('app-role').value = a.role;
    document.getElementById('app-status').value = a.status;
    document.getElementById('app-date').value = a.date;
    document.getElementById('app-notes').value = a.notes || '';
  } else {
    document.getElementById('app-company').value = '';
    document.getElementById('app-role').value = '';
    document.getElementById('app-status').value = 'Applied';
    document.getElementById('app-date').value = today();
    document.getElementById('app-notes').value = '';
  }
  document.getElementById('app-modal').style.display = 'flex';
}
function editApp(i) { openAppModal(i); }
function deleteApp(i) {
  if (!confirm(`Delete ${D.applications[i].company}?`)) return;
  D.applications.splice(i, 1);
  save(D); renderApplications(); renderDashboard(); renderNav();
}
function saveApp() {
  const company = document.getElementById('app-company').value.trim();
  if (!company) { alert('Enter a company name.'); return; }
  const obj = {
    company,
    role: document.getElementById('app-role').value.trim(),
    status: document.getElementById('app-status').value,
    date: document.getElementById('app-date').value,
    notes: document.getElementById('app-notes').value.trim(),
  };
  const id = document.getElementById('app-edit-id').value;
  if (id !== '') D.applications[parseInt(id)] = obj; else D.applications.push(obj);
  save(D); closeModal('app-modal'); renderApplications(); renderDashboard(); renderNav();
}

/* ─── Projects ──────────────────────────────────────────────── */
function renderProjects() {
  document.getElementById('tab-projects').innerHTML = `
    <div class="page-header pop-in">
      <div>
        <h1 class="page-title">Project <em>Checklist</em>.</h1>
        <p class="page-sub">Ship clean READMEs, demos, and the RAG project before placement season.</p>
      </div>
    </div>
    <div class="grid-2 pop-in d1" id="projects-grid"></div>`;

  document.getElementById('projects-grid').innerHTML = D.projects.map((p, pi) => {
    const done = p.tasks.filter(t => t.done).length;
    const total = p.tasks.length;
    const pct = total ? (done / total * 100).toFixed(0) : 0;
    const tasks = p.tasks.map((t, ti) => `
      <li class="project-task ${t.done?'done':''}">
        <input type="checkbox" ${t.done?'checked':''} onchange="toggleTask(${pi},${ti},this.checked)">
        <span>${t.text}</span>
      </li>`).join('');
    return `<div class="project-card">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px;">
        <div><div class="project-name">${p.name}</div><div class="project-stack">${p.stack}</div></div>
        ${projectStatusBadge(p.status)}
      </div>
      <div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-faint);margin-bottom:5px;"><span>Tasks</span><span>${done}/${total}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      </div>
      <ul class="project-tasks">${tasks}</ul>
    </div>`;
  }).join('');
}

function toggleTask(pi, ti, val) {
  D.projects[pi].tasks[ti].done = val;
  const p = D.projects[pi];
  const allDone = p.tasks.every(t => t.done), anyDone = p.tasks.some(t => t.done);
  if (allDone) p.status = 'complete'; else if (anyDone) p.status = 'in_progress';
  save(D); renderProjects(); renderDashboard(); renderNav();
}

/* ─── CGPA ──────────────────────────────────────────────────── */
function renderCGPA() {
  const cgpa = D.cgpa.current;
  const pct = Math.min(100, ((cgpa - 6) / (10 - 6)) * 100).toFixed(1);
  const color = cgpa >= 7.5 ? 'var(--easy)' : cgpa >= 7.0 ? 'var(--med)' : 'var(--hard)';
  const semLabels = ['','Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'];

  document.getElementById('tab-cgpa').innerHTML = `
    <div class="page-header pop-in">
      <div>
        <h1 class="page-title">CGPA <em>Tracker</em>.</h1>
        <p class="page-sub">Current: ${cgpa.toFixed(2)} after ${semLabels[D.cgpa.afterSem]}. Target: 7.5+</p>
      </div>
    </div>
    <div class="grid-2 pop-in d1">
      <div class="card">
        <div class="card-title">Current CGPA</div>
        <div class="cgpa-display" style="color:${color}">${cgpa.toFixed(2)}</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:6px;">${semLabels[D.cgpa.afterSem]} · Target: 7.5+</div>
        <div style="margin-top:18px;">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-faint);margin-bottom:6px;"><span>6.0</span><span>→ current</span><span>7.5 target</span><span>10.0</span></div>
          <div class="bar-track" style="height:10px;"><div class="bar-fill" style="background:${color};width:${pct}%"></div></div>
        </div>
        <div style="margin-top:24px;" class="divider"></div>
        <div style="font-size:13px;font-weight:600;margin-bottom:12px;">Update CGPA</div>
        <div class="form-row" style="margin-bottom:12px;">
          <div class="form-group">
            <label class="form-label">New CGPA</label>
            <input type="number" id="cgpa-input" step="0.01" min="0" max="10" placeholder="e.g. 7.35">
          </div>
          <div class="form-group" style="max-width:130px;">
            <label class="form-label">After Sem</label>
            <select id="cgpa-sem-input">
              <option value="5">Sem 5</option>
              <option value="6">Sem 6</option>
              <option value="7">Sem 7</option>
              <option value="8">Sem 8</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary" onclick="updateCGPA()">Save</button>
      </div>
      <div class="card">
        <div class="card-title">What each level unlocks</div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:4px;">
          <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:var(--r-md);background:var(--hard-soft);">
            <span class="badge badge-red">&lt; 7.0</span>
            <span style="font-size:13px;">Filtered by most Indian MNCs</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:var(--r-md);background:var(--med-soft);">
            <span class="badge badge-yellow">7.0 – 7.49</span>
            <span style="font-size:13px;">TCS, Wipro, Infosys, most startups</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:var(--r-md);background:var(--easy-soft);border:1px solid rgba(22,163,74,.3);">
            <span class="badge badge-green">7.5 – 7.99</span>
            <span style="font-size:13px;font-weight:500;">Mid-size product companies</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:var(--r-md);background:var(--accent-soft);">
            <span class="badge badge-purple">8.0+</span>
            <span style="font-size:13px;">Opens most campus doors</span>
          </div>
        </div>
        <div style="margin-top:16px;font-size:12.5px;color:var(--text-muted);line-height:1.55;border-top:1px solid var(--border);padding-top:14px;">
          Your CGPA of <strong style="color:${color}">${cgpa.toFixed(2)}</strong> is in the
          <strong>${cgpa >= 8.0 ? '8.0+ tier' : cgpa >= 7.5 ? '7.5–7.99 tier' : cgpa >= 7.0 ? '7.0–7.49 tier' : 'below 7.0 tier'}</strong>.
          ${cgpa < 7.5 ? ' Push above 7.5 this semester — it unlocks significantly more companies.' : ' Great position, focus on DSA and projects now.'}
        </div>
      </div>
    </div>`;

  document.getElementById('cgpa-sem-input').value = Math.min(8, D.cgpa.afterSem + 1);
}

function updateCGPA() {
  const val = parseFloat(document.getElementById('cgpa-input').value);
  const sem = parseInt(document.getElementById('cgpa-sem-input').value);
  if (isNaN(val) || val < 0 || val > 10) { alert('Enter a valid CGPA (0–10).'); return; }
  D.cgpa.current = val; D.cgpa.afterSem = sem;
  save(D); renderCGPA(); renderDashboard(); renderNav();
  document.getElementById('cgpa-input').value = '';
}

/* ─── Career Tools ──────────────────────────────────────────── */

let _careerFile = null;
let _careerResumeText = '';
let _careerSelectedRole = '';
let _careerScanScore = 0;
let _careerUpgradeData = null;
let _pdfJsLoaded = false;

async function _ensurePdfJs() {
  if (_pdfJsLoaded) return;
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      _pdfJsLoaded = true;
      resolve();
    };
    s.onerror = () => reject(new Error('Failed to load PDF.js'));
    document.head.appendChild(s);
  });
}

async function _extractPdfText(file) {
  await _ensurePdfJs();
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map(it => it.str).join(' '));
  }
  return pages.join('\n');
}

async function _careerGetText() {
  const isUpload = document.getElementById('career-mode-upload')?.classList.contains('active');
  if (!isUpload) return document.getElementById('career-resume')?.value?.trim() || '';
  if (!_careerFile) return '';
  return _extractPdfText(_careerFile);
}

function renderCareer() {
  _careerFile = null;
  _careerResumeText = '';
  _careerSelectedRole = '';
  _careerScanScore = 0;
  _careerUpgradeData = null;
  document.getElementById('tab-career').innerHTML = `
    <div class="page-header" style="margin-bottom:24px;">
      <div class="page-title">Career Tools</div>
      <p style="color:var(--text-muted);font-size:13px;margin:4px 0 0;">ATS analysis, job search &amp; LaTeX resume export — powered by Groq AI.</p>
    </div>
    <div class="career-upload-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <span style="font-size:13px;font-weight:600;color:var(--text);">Your Resume</span>
        <div class="career-mode-tabs">
          <button class="career-mode-tab active" id="career-mode-upload" onclick="careerSetResumeMode('upload')">Upload PDF</button>
          <button class="career-mode-tab" id="career-mode-paste" onclick="careerSetResumeMode('paste')">Paste Text</button>
        </div>
      </div>
      <div id="career-upload-zone" class="career-upload-zone"
           ondragover="event.preventDefault();this.classList.add('drag-over')"
           ondragleave="this.classList.remove('drag-over')"
           ondrop="careerHandleDrop(event)">
        <input type="file" id="career-file-input" accept=".pdf" style="display:none" onchange="careerHandleFileSelect(this)" />
        <div id="career-upload-prompt" class="career-upload-prompt">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" width="32" height="32" style="color:var(--text-faint);margin-bottom:10px;"><rect x="5" y="2" width="18" height="24" rx="2"/><path d="M19 2v7h4M9 14h10M9 18h7"/></svg>
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">Drop your PDF here</div>
          <button class="btn btn-ghost btn-sm" type="button" onclick="document.getElementById('career-file-input').click()">Browse file</button>
        </div>
        <div id="career-file-selected" class="career-file-selected" style="display:none;">
          <svg viewBox="0 0 16 16" fill="none" stroke="#4caf50" stroke-width="1.5" stroke-linecap="round" width="16" height="16"><path d="M2 8.5l4 4 8-8"/></svg>
          <span id="career-file-name" style="font-size:13px;color:var(--text);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>
          <button class="career-file-clear" onclick="careerClearFile()" title="Remove">✕</button>
        </div>
      </div>
      <textarea id="career-resume" class="career-textarea" style="display:none;margin-top:10px;" placeholder="Paste your resume here — plain text works best…"></textarea>
      <button class="btn btn-primary" id="career-scan-btn" onclick="careerScan()" style="margin-top:14px;align-self:flex-start;">
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="12" height="12"><rect x="1" y="1" width="12" height="12" rx="2"/><path d="M4 7h6M4 4.5h6M4 9.5h4"/></svg>
        Scan Resume
      </button>
    </div>
    <div id="career-results"></div>`;
}

function careerSetResumeMode(mode) {
  const uploadZone = document.getElementById('career-upload-zone');
  const pasteArea  = document.getElementById('career-resume');
  const btnUpload  = document.getElementById('career-mode-upload');
  const btnPaste   = document.getElementById('career-mode-paste');
  if (mode === 'upload') {
    uploadZone.style.display = '';
    pasteArea.style.display  = 'none';
    btnUpload.classList.add('active');
    btnPaste.classList.remove('active');
  } else {
    uploadZone.style.display = 'none';
    pasteArea.style.display  = '';
    btnUpload.classList.remove('active');
    btnPaste.classList.add('active');
  }
}

function careerHandleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type === 'application/pdf') _careerSetFile(file);
}

function careerHandleFileSelect(input) {
  const file = input.files?.[0];
  if (file) _careerSetFile(file);
}

function _careerSetFile(file) {
  _careerFile = file;
  document.getElementById('career-file-name').textContent = file.name;
  document.getElementById('career-upload-prompt').style.display = 'none';
  document.getElementById('career-file-selected').style.display = 'flex';
}

function careerClearFile() {
  _careerFile = null;
  document.getElementById('career-file-input').value = '';
  document.getElementById('career-upload-prompt').style.display = '';
  document.getElementById('career-file-selected').style.display = 'none';
  document.getElementById('career-file-name').textContent = '';
}

function _esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function _chips(arr, cls) { return (arr||[]).map(s=>`<span class="career-chip ${cls}">${_esc(s)}</span>`).join(''); }
function _li(arr) { return (arr||[]).map(s=>`<li>${_esc(s)}</li>`).join(''); }

function _careerSetLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.style.opacity = loading ? '0.6' : '';
}

function _careerShowError(msg, container) {
  document.getElementById(container || 'career-results').innerHTML =
    `<div class="career-error">${_esc(msg)}</div>`;
}

async function careerScan() {
  _careerSetLoading('career-scan-btn', true);
  document.getElementById('career-results').innerHTML =
    `<div class="career-loading"><span class="career-spinner"></span> Scanning your resume…</div>`;
  try {
    const text = await _careerGetText();
    if (!text) { _careerShowError('Upload a PDF or paste your resume text first.'); return; }
    _careerResumeText = text;
    _careerSelectedRole = '';
    const res = await fetch('/api/career/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_text: text }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    _renderScanResults(data);
  } catch (err) {
    _careerShowError(err.message);
  } finally {
    _careerSetLoading('career-scan-btn', false);
  }
}

function _renderScanResults(data) {
  const score = data.cv_score ?? 0;
  _careerScanScore = score;
  const sc = score >= 75 ? 'career-score-high' : score >= 50 ? 'career-score-mid' : 'career-score-low';
  const roleChips = (data.recommended_roles || []).map(r =>
    `<button class="career-role-chip" data-role="${_esc(r)}" onclick="careerSelectRole(this)">${_esc(r)}</button>`
  ).join('');
  document.getElementById('career-results').innerHTML = `
    <div class="career-results-grid" style="margin-top:20px;">
      <div class="career-result-card career-score-card">
        <div class="career-score-label">CV Score</div>
        <div class="career-score-value ${sc}">${score}</div>
        <div class="career-score-sub">${_esc(data.current_status || '')}</div>
        ${data.profile_summary ? `<p class="career-summary-text" id="career-profile-summary">${_esc(data.profile_summary)}</p>` : ''}
      </div>
      <div class="career-result-card">
        <div class="career-card-title">Top Strengths</div>
        <div class="career-chips">${_chips(data.top_strengths, 'chip-green') || '<span style="color:var(--text-faint)">—</span>'}</div>
        <div class="career-card-title" style="margin-top:14px;">Improvement Areas</div>
        <div class="career-chips">${_chips(data.improvement_areas, 'chip-red') || '<span style="color:var(--text-faint)">—</span>'}</div>
      </div>
      <div class="career-result-card career-full-width">
        <div class="career-card-title">Suggested Roles — select one to continue</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;" id="career-role-chips">${roleChips}</div>
        <div id="career-role-actions" style="display:none;margin-top:18px;padding-top:16px;border-top:1px solid var(--border);">
          <div style="font-size:12px;color:var(--text-faint);margin-bottom:10px;">
            Selected: <strong id="career-selected-role-display" style="color:var(--accent)"></strong>
          </div>
          <textarea id="career-jd" class="career-textarea career-jd-textarea" placeholder="Paste the job description for deeper analysis (optional)…" style="margin-bottom:12px;"></textarea>
          <div class="career-actions" style="margin-bottom:0;">
            <button class="btn btn-primary" id="career-analyze-btn" onclick="careerAnalyze()">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="12" height="12"><circle cx="6" cy="6" r="4"/><path d="M10 10l2 2"/></svg>
              Analyze Match
            </button>
            <button class="btn" id="career-jobs-btn" onclick="careerFindJobs()">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="12" height="12"><rect x="1" y="4" width="12" height="8" rx="1"/><path d="M4 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/></svg>
              Find Jobs
            </button>
            <button class="btn" id="career-upgrade-btn" onclick="careerUpgrade()">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="12" height="12"><path d="M7 2v10M3 6l4-4 4 4"/></svg>
              Upgrade Resume
            </button>
          </div>
        </div>
      </div>
      ${data.ats_suggestions?.length ? `<div class="career-result-card career-full-width"><div class="career-card-title">ATS Suggestions</div><ul class="career-list">${_li(data.ats_suggestions)}</ul></div>` : ''}
      ${data.improved_bullets?.length ? `<div class="career-result-card career-full-width"><div class="career-card-title">Improved Bullet Points</div><ul class="career-list career-list-bullets">${_li(data.improved_bullets)}</ul></div>` : ''}
    </div>
    <div id="career-action-results"></div>`;
}

function careerSelectRole(btn) {
  _careerSelectedRole = btn.dataset.role || btn.textContent.trim();
  document.querySelectorAll('.career-role-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('career-role-actions').style.display = '';
  document.getElementById('career-selected-role-display').textContent = _careerSelectedRole;
  document.getElementById('career-action-results').innerHTML = '';
}

async function _careerAction(endpoint, btnId, loadingMsg, renderFn) {
  if (!_careerResumeText) {
    _careerShowError('No resume text — please scan your resume first.', 'career-action-results');
    return;
  }
  _careerSetLoading(btnId, true);
  document.getElementById('career-action-results').innerHTML =
    `<div class="career-loading" style="margin-top:16px;"><span class="career-spinner"></span> ${loadingMsg}</div>`;
  try {
    const jd = document.getElementById('career-jd')?.value?.trim() || '';
    const body = { resume_text: _careerResumeText, target_role: _careerSelectedRole };
    if (jd) body.job_description = jd;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    renderFn(data);
  } catch (err) {
    _careerShowError(err.message, 'career-action-results');
  } finally {
    _careerSetLoading(btnId, false);
  }
}

function careerAnalyze() {
  _careerAction('/api/career/analyze', 'career-analyze-btn', 'Analyzing your resume…', _renderAnalysisResults);
}

function careerFindJobs() {
  if (!_careerSelectedRole) {
    _careerShowError('Select a role first.', 'career-action-results');
    return;
  }
  _careerSetLoading('career-jobs-btn', true);
  document.getElementById('career-action-results').innerHTML =
    `<div class="career-loading" style="margin-top:16px;"><span class="career-spinner"></span> Searching for jobs…</div>`;
  fetch('/api/career/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: _careerSelectedRole }),
  })
    .then(r => r.json().then(d => ({ ok: r.ok, d })))
    .then(({ ok, d }) => { if (!ok) throw new Error(d.error || 'Error fetching jobs'); _renderJobResults(d); })
    .catch(err => _careerShowError(err.message, 'career-action-results'))
    .finally(() => _careerSetLoading('career-jobs-btn', false));
}

function careerUpgrade() {
  _careerAction('/api/career/upgrade', 'career-upgrade-btn', 'Upgrading resume — this may take 15–30 s…', _renderUpgradeResults);
}

function _renderAnalysisResults(data) {
  document.getElementById('career-profile-summary')?.remove();
  const score = data.match_score ?? 0;
  const sc = score >= 75 ? 'career-score-high' : score >= 50 ? 'career-score-mid' : 'career-score-low';
  const tailor = data.tailor_my_resume || {};
  document.getElementById('career-action-results').innerHTML = `
    <div class="career-results-grid" style="margin-top:16px;">
      <div class="career-result-card career-score-card">
        <div class="career-score-label">ATS Match Score</div>
        <div class="career-score-value ${sc}">${score}</div>
        <div class="career-score-sub">out of 100</div>
        ${data.resume_summary ? `<p class="career-summary-text">${_esc(data.resume_summary)}</p>` : ''}
      </div>
      <div class="career-result-card">
        <div class="career-card-title">Skills Matched</div>
        <div class="career-chips">${_chips(data.matching_skills,'chip-green')||'<span style="color:var(--text-faint)">None identified</span>'}</div>
        <div class="career-card-title" style="margin-top:14px;">Missing Skills</div>
        <div class="career-chips">${_chips(data.missing_skills,'chip-red')||'<span style="color:var(--text-faint)">None</span>'}</div>
      </div>
      ${data.ats_suggestions?.length?`<div class="career-result-card career-full-width"><div class="career-card-title">ATS Suggestions</div><ul class="career-list">${_li(data.ats_suggestions)}</ul></div>`:''}
      ${data.improved_bullets?.length?`<div class="career-result-card career-full-width"><div class="career-card-title">Improved Bullet Points</div><ul class="career-list career-list-bullets">${_li(data.improved_bullets)}</ul></div>`:''}
      ${tailor.improved_professional_summary?`<div class="career-result-card career-full-width"><div class="career-card-title">Tailored Professional Summary</div><p style="font-size:13px;color:var(--text-muted);line-height:1.6;margin:0;">${_esc(tailor.improved_professional_summary)}</p>${tailor.stronger_project_bullets?.length?`<div class="career-card-title" style="margin-top:12px;">Stronger Project Bullets</div><ul class="career-list career-list-bullets">${_li(tailor.stronger_project_bullets)}</ul>`:''} ${tailor.suggested_skills_keywords?.length?`<div class="career-card-title" style="margin-top:12px;">Suggested Keywords</div><div class="career-chips">${_chips(tailor.suggested_skills_keywords,'chip-green')}</div>`:''}</div>`:''}
      ${data.interview_questions?.length?`<div class="career-result-card career-full-width"><div class="career-card-title">Likely Interview Questions</div><ul class="career-list">${_li(data.interview_questions)}</ul></div>`:''}
    </div>`;
}

function _renderJobResults(data) {
  const jobs = data.jobs || [];
  if (!jobs.length) {
    _careerShowError(`No jobs found for "${data.query || _careerSelectedRole}". Try a broader role title.`, 'career-action-results');
    return;
  }
  const cards = jobs.map(j => `
    <div class="career-result-card">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px;">
        <div>
          <div style="font-weight:600;font-size:13px;color:var(--text);">${_esc(j.title)}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${_esc(j.company)}${j.location ? ` · ${_esc(j.location)}` : ''}</div>
        </div>
        ${j.url ? `<a href="${_esc(j.url)}" target="_blank" rel="noopener" class="btn btn-sm" style="flex-shrink:0;font-size:11px;">Apply</a>` : ''}
      </div>
      ${j.salary ? `<div style="font-size:12px;color:var(--accent);margin-bottom:6px;">${_esc(j.salary)}</div>` : ''}
      ${j.description ? `<div style="font-size:12px;color:var(--text-muted);line-height:1.5;">${_esc(j.description)}…</div>` : ''}
      ${j.created ? `<div style="font-size:11px;color:var(--text-faint);margin-top:6px;">${_esc(j.created)}</div>` : ''}
    </div>`).join('');
  document.getElementById('career-action-results').innerHTML = `
    <div style="margin-top:16px;margin-bottom:12px;font-size:13px;color:var(--text-muted);">
      ${data.count || jobs.length} listings for <strong>${_esc(data.query || '')}</strong>
    </div>
    <div class="career-results-grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));">${cards}</div>`;
}

function _buildOverleafHtml(data) {
  const e = _esc;
  let h = '<div class="overleaf-paper">';
  if (data.name) h += `<div class="overleaf-name">${e(data.name)}</div>`;
  if (data.contact?.length) h += `<div class="overleaf-contact">${data.contact.map(c => e(c)).join(' | ')}</div>`;
  if (data.summary) {
    h += `<div class="overleaf-sec-title">Summary</div><hr class="overleaf-rule">`;
    h += `<p class="overleaf-summary">${e(data.summary)}</p>`;
  }
  if (data.experience?.length) {
    h += `<div class="overleaf-sec-title">Experience</div><hr class="overleaf-rule">`;
    for (const x of data.experience) {
      h += `<div class="overleaf-entry-row"><span><b>${e(x.title)}</b></span><span>${e(x.date)}</span></div>`;
      h += `<div class="overleaf-entry-sub"><span><i>${e(x.org)}</i></span><span><i>${e(x.location)}</i></span></div>`;
      if (x.bullets?.length) h += `<ul class="overleaf-list">${x.bullets.map(b=>`<li>${e(b)}</li>`).join('')}</ul>`;
    }
  }
  if (data.projects?.length) {
    h += `<div class="overleaf-sec-title">Projects</div><hr class="overleaf-rule">`;
    for (const p of data.projects) {
      const head = p.tech ? `<b>${e(p.title)}</b> | <i>${e(p.tech)}</i>` : `<b>${e(p.title)}</b>`;
      h += `<div class="overleaf-entry-row"><span>${head}</span><span>${e(p.date||'')}</span></div>`;
      if (p.bullets?.length) h += `<ul class="overleaf-list">${p.bullets.map(b=>`<li>${e(b)}</li>`).join('')}</ul>`;
    }
  }
  if (data.skills?.length) {
    h += `<div class="overleaf-sec-title">Technical Skills</div><hr class="overleaf-rule">`;
    h += data.skills.map(s => `<div class="overleaf-skill-row">${e(s)}</div>`).join('');
  }
  if (data.education?.length) {
    h += `<div class="overleaf-sec-title">Education</div><hr class="overleaf-rule">`;
    for (const ed of data.education) {
      h += `<div class="overleaf-entry-row"><span><b>${e(ed.institution)}</b></span><span>${e(ed.location||'')}</span></div>`;
      h += `<div class="overleaf-entry-sub"><span><i>${e(ed.degree||'')}</i></span><span><i>${e(ed.date||'')}</i></span></div>`;
    }
  }
  if (data.certifications?.length) {
    h += `<div class="overleaf-sec-title">Certifications</div><hr class="overleaf-rule">`;
    h += data.certifications.map(c => `<div class="overleaf-skill-row">• ${e(c)}</div>`).join('');
  }
  h += '</div>';
  return h;
}

async function _fillOriginalPane(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (_careerFile) {
    try {
      await _ensurePdfJs();
      const buf = await _careerFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      el.innerHTML = '';
      const paneWidth = el.parentElement?.clientWidth || el.clientWidth || 400;
      const availWidth = paneWidth - 28; // account for padding
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const defaultVp = page.getViewport({ scale: 1 });
        const scale = availWidth / defaultVp.width;
        const vp = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
        el.appendChild(canvas);
      }
      return;
    } catch {}
  }
  el.innerHTML = `<pre class="compare-text-pre">${_esc(_careerResumeText)}</pre>`;
}

function _renderUpgradeResults(data) {
  const before = _careerScanScore || data.ats_score_before || 0;
  const after  = data.ats_score_after  ?? 0;
  const latex  = data.latex_resume || '';
  if (latex) window._careerLatex = latex;
  _careerUpgradeData = data;

  const overleafHtml = _buildOverleafHtml(data);

  document.getElementById('career-action-results').innerHTML = `
    <div class="career-results-grid" style="margin-top:16px;">
      <div class="career-result-card career-score-card">
        <div class="career-score-label">ATS Score</div>
        <div style="display:flex;align-items:baseline;gap:8px;justify-content:center;">
          <span class="career-score-value career-score-low" style="font-size:32px;">${before}</span>
          <svg viewBox="0 0 16 10" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" width="20"><path d="M1 9L8 1l7 8"/></svg>
          <span class="career-score-value career-score-high" style="font-size:32px;">${after}</span>
        </div>
        <div class="career-score-sub">before → after</div>
      </div>
      ${data.improvement_summary?`<div class="career-result-card"><div class="career-card-title">Improvement Summary</div><p style="font-size:13px;color:var(--text-muted);line-height:1.6;margin:0;">${_esc(data.improvement_summary)}</p>${data.key_improvements?.length?`<ul class="career-list" style="margin-top:10px;">${_li(data.key_improvements)}</ul>`:''}</div>`:''}
      <div class="career-result-card career-full-width">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div class="career-card-title" style="margin:0;">Resume Comparison</div>
          <div style="display:flex;gap:8px;">${latex?`<button class="btn btn-sm" onclick="careerCopyLatex(event)">Copy LaTeX</button><button class="btn btn-sm btn-primary" onclick="careerDownloadLatex()">Download .tex</button>`:''}</div>
        </div>
        <div class="compare-split">
          <div class="compare-pane">
            <div class="compare-pane-label">Original</div>
            <div id="compare-original-fill"><div class="career-loading"><span class="career-spinner"></span> Rendering…</div></div>
          </div>
          <div class="compare-pane compare-pane-upgraded">
            <div class="compare-pane-label">Upgraded — Overleaf Preview</div>
            ${overleafHtml}
          </div>
        </div>
        ${latex?`<details style="margin-top:12px;"><summary style="font-size:12px;color:var(--text-faint);cursor:pointer;user-select:none;">Show LaTeX source</summary><textarea id="career-latex-output" class="career-latex-area" spellcheck="false" readonly style="margin-top:8px;">${_esc(latex)}</textarea></details>`:''}
      </div>
    </div>`;

  _fillOriginalPane('compare-original-fill');
}

function careerCopyLatex(e) {
  const latex = window._careerLatex || document.getElementById('career-latex-output')?.value || '';
  navigator.clipboard.writeText(latex).then(() => {
    const btn = e.target;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy LaTeX', 1500);
  });
}

function careerDownloadLatex() {
  const latex = window._careerLatex || document.getElementById('career-latex-output')?.value || '';
  if (!latex) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([latex], { type: 'text/plain' }));
  a.download = 'resume.tex';
  a.click();
}

/* ─── Modal helpers ─────────────────────────────────────────── */
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

/* ─── Landing page ──────────────────────────────────────────── */
const LANDING_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Push yourself, because no one else is going to do it for you.", author: null },
  { text: "Great things never come from comfort zones.", author: null },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: null },
  { text: "Dream it. Wish it. Do it.", author: null },
  { text: "Your only limit is your mind.", author: null },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
];

let _quoteIdx = Math.floor(Math.random() * LANDING_QUOTES.length);
let _quoteTimer = null;
let _particlesRaf = null;

function _startQuotes() {
  const tEl = document.getElementById('landing-quote-text');
  const aEl = document.getElementById('landing-quote-author');
  if (!tEl) return;
  function show(idx) {
    const q = LANDING_QUOTES[idx % LANDING_QUOTES.length];
    tEl.style.opacity = '0';
    setTimeout(() => {
      tEl.textContent = q.text;
      if (aEl) aEl.textContent = q.author ? `— ${q.author}` : '';
      tEl.style.opacity = '1';
    }, 350);
  }
  show(_quoteIdx);
  _quoteTimer = setInterval(() => { _quoteIdx = (_quoteIdx + 1) % LANDING_QUOTES.length; show(_quoteIdx); }, 5000);
}

function _stopQuotes() {
  if (_quoteTimer) { clearInterval(_quoteTimer); _quoteTimer = null; }
}

function _startParticles() {
  const canvas = document.getElementById('landing-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const N = Math.min(90, Math.floor(W * H / 12000));
  const pts = Array.from({ length: N }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
    r: Math.random() * 1.8 + .6,
  }));
  const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  window.addEventListener('resize', onResize);
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139,92,246,.7)';
      ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${.18 * (1 - d/130)})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }
    _particlesRaf = requestAnimationFrame(frame);
  }
  frame();
  return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(_particlesRaf); };
}

let _stopParticlesFn = null;

function showLanding() {
  const lp = document.getElementById('landing-page');
  if (!lp) return;
  lp.style.display = 'flex';
  document.querySelector('.app').style.display = 'none';
  if (currentUser) {
    const signInBtns = lp.querySelectorAll('.landing-google-btn, .landing-cta');
    signInBtns.forEach(b => b.style.display = 'none');
    const enterBtn = document.getElementById('landing-enter-btn');
    if (enterBtn) {
      enterBtn.style.display = 'inline-flex';
      enterBtn.textContent = `Enter App, ${currentUser.name.split(' ')[0]} →`;
    }
  }
  _stopParticlesFn = _startParticles();
  _startQuotes();
}

function hideLanding() {
  const lp = document.getElementById('landing-page');
  if (lp) lp.style.display = 'none';
  document.querySelector('.app').style.display = 'grid';
  if (_stopParticlesFn) { _stopParticlesFn(); _stopParticlesFn = null; }
  _stopQuotes();
}

/* ─── Auth ──────────────────────────────────────────────────── */
async function initAuth() {
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      currentUser = await res.json();
      STORE_KEY = `vk_a2z_v1_${currentUser.id}`;
    } else if (res.status === 401) {
      showLanding();
      return;
    }
  } catch {
    // No API server (local file:// mode) — run as single-user without auth
  }
  initApp();
}

function initApp() {
  document.querySelector('.app').style.display = 'grid';
  document.getElementById('landing-page').style.display = 'none';
  // One-time migration: move data from the old shared key to the user-specific key
  if (currentUser && !localStorage.getItem(STORE_KEY)) {
    const legacy = localStorage.getItem('vk_a2z_v1');
    if (legacy) localStorage.setItem(STORE_KEY, legacy);
  }

  D = load();

  if (currentUser) {
    const nameEl = document.getElementById('user-display-name');
    if (nameEl) nameEl.textContent = currentUser.name;

    const avatarEl = document.getElementById('user-avatar-el');
    if (avatarEl) {
      if (currentUser.avatar) {
        avatarEl.innerHTML = `<img src="${currentUser.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" alt="">`;
        avatarEl.style.padding = '0';
      } else {
        const parts = currentUser.name.split(' ');
        avatarEl.textContent = (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
      }
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.style.display = 'flex';
  }

  activeTab = localStorage.getItem('vk_active_tab') || 'dashboard';
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.getElementById('tab-' + activeTab).classList.add('active');
  renderNav();
  renderSection(activeTab);
}

/* ─── Boot ──────────────────────────────────────────────────── */
applyThemeIcon();
initAuth();
