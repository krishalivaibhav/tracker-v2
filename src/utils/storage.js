import { A2Z_STEPS } from '../data.js';

export const PLACEMENT_DATE = new Date('2026-10-01');
export const LC_TOTAL = 473;

export const DEFAULT_PROJECTS = [
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

export function freshData() {
  return {
    progress: {},
    dailyNotes: {},
    applications: [],
    projects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)),
    cgpa: { current: 7.16, afterSem: 5 },
  };
}

export function loadData(storeKey) {
  const raw = localStorage.getItem(storeKey);
  let d = null;
  if (raw) { try { d = JSON.parse(raw); } catch {} }
  const base = d || freshData();

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

export function saveData(storeKey, d) {
  const progress = {};
  for (const step of d.steps) {
    for (const ss of step.substeps) {
      for (const p of ss.problems) {
        if (p.done || p.note) progress[p.s] = { done: !!p.done, solvedOn: p.solvedOn || null, note: p.note || '' };
      }
    }
  }
  localStorage.setItem(storeKey, JSON.stringify({
    progress, dailyNotes: d.dailyNotes,
    applications: d.applications, projects: d.projects, cgpa: d.cgpa,
  }));
}
