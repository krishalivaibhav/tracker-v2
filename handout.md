# Track+ — Project Handout

**Live:** https://tracker-v2-nine.vercel.app  
**Repo:** https://github.com/krishalivaibhav/tracker-v2

---

## What It Is

Track+ is a personal DSA practice tracker and placement prep tool. It covers the full A2Z DSA sheet (473 problems across 26 steps), an AI-powered career tools suite, and a built-in code editor with live test case execution — all in one installable web app.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite 8 |
| Styling | Vanilla CSS (custom design system, dark/light theme) |
| Backend | Vercel Serverless Functions (Node.js) |
| Auth | Google OAuth — HMAC-signed session cookie |
| Code execution | Wandbox (production) · native toolchain (local dev) |
| AI | Groq API — `llama-3.3-70b-versatile` |
| Job search | Adzuna API |
| Hosting | Vercel |

---

## Features

### DSA Sheet
- Full A2Z sheet — 473 problems, 26 steps, nested substeps
- Per-problem: mark solved, add notes, mark for revision
- Progress bars per step and substep
- Hash-based deep linking (`#dsa/2/0`) — browser back button works, tab switches preserve position

### Code Editor
- 5 languages: Python 3, C++, C, Java, JavaScript
- Custom syntax highlighter (no external lib)
- Smart editing: Tab indent/dedent, auto-indent, bracket pairing
- Starter code auto-generated from problem input shape
- Practice timer — stopwatch starts when you open a problem, time saved on close
- Test cases pre-loaded from problem examples; add custom cases; run all in parallel
- Per-case verdict: Correct / Wrong Answer / Error with colour-coded tabs
- Code persisted to localStorage per problem + language — survives page refresh

### Dashboard
- Problems solved count and progress bar
- Streak tracker
- DSA progress by step (bar chart)
- Revision queue — flagged problems with one-click deep navigation (scrolls + flashes the exact row)
- Avg time per difficulty (Easy / Med / Hard) — populated as you use the editor
- Roadmap milestones

### Career Tools (powered by Groq AI)
- **Scan Resume** — ATS score, strengths, improvement areas, role suggestions
- **Analyze** — match score against a job description, missing skills, interview questions
- **Upgrade Resume** — rewrites your resume bullets, generates LaTeX + Overleaf-style HTML preview
- **Job Search** — live listings from Adzuna
- PDF upload (client-side extraction via PDF.js) or paste text

### Auth & Data
- Google OAuth login; app also runs in local mode without sign-in
- Per-user localStorage key (`vk_a2z_v1_${user.id}`)
- One-time migration from legacy shared key on first login

### PWA
- Installable via "Add to Home Screen" on mobile
- Service worker caches the app shell for offline use
- `manifest.json` with icons, theme colour, standalone display

### Mobile UX
- Full-screen code editor with Problem / Code tab toggle
- Problem panel shown first by default
- Mobile bottom nav (Dashboard / DSA / Career)
- Sign-out button in topbar (sidebar is hidden on mobile)

---

## Project Structure

```
tracker-v2/
├── api/
│   ├── auth/          # login, callback, me, logout (Google OAuth)
│   ├── career/
│   │   ├── analyze.js  # resume × JD match via Groq
│   │   ├── scan.js     # standalone CV audit via Groq
│   │   ├── upgrade.js  # ATS rewrite + LaTeX generation via Groq
│   │   └── jobs.js     # Adzuna job search
│   ├── code/
│   │   └── run.js      # code execution (Wandbox / local toolchain)
│   ├── leetcode.js     # LeetCode GraphQL proxy
│   └── gfg.js          # GFG scraper proxy
├── public/
│   ├── manifest.json   # PWA manifest
│   ├── sw.js           # service worker
│   └── icon-{192,512}.png
└── src/
    ├── data.js          # full A2Z DSA sheet data (~473 problems)
    ├── App.jsx          # root state, routing, all handlers
    ├── components/
    │   ├── Dashboard.jsx
    │   ├── Sidebar.jsx / Topbar.jsx
    │   ├── DSASheet/    # StepGrid, StepDetail, SubstepDetail
    │   ├── CodeEditorModal.jsx
    │   ├── CareerTools.jsx
    │   └── LandingPage.jsx
    └── utils/
        ├── storage.js   # localStorage load/save, data shape
        ├── stats.js     # streak, solved counts, progress
        ├── highlighter.js  # custom syntax highlighter (5 languages)
        ├── starterCode.js  # boilerplate generation per language × input shape
        ├── codeRunner.js   # calls /api/code/run
        └── helpers.js
```

---

## Running Locally

```bash
# 1. Install
npm install

# 2. Pull env vars (needs Vercel CLI + project linked)
vercel env pull

# 3. Start dev server
vercel dev
```

The Vite dev server proxies `/api/code/run` to the local toolchain (python3, g++, gcc, javac, node). All other `/api/*` routes are served by Vercel's local function runner.

---

## Environment Variables

| Variable | Used by |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth login |
| `GOOGLE_CLIENT_SECRET` | OAuth login |
| `SESSION_SECRET` | HMAC session cookie signing |
| `GROQ_API_KEY` | All career AI features |
| `GROQ_MODEL` | Optional — defaults to `llama-3.3-70b-versatile` |
| `ADZUNA_APP_ID` | Job search |
| `ADZUNA_APP_KEY` | Job search |
| `ADZUNA_COUNTRY` | Optional — defaults to `in` (India) |

---

## What's Not Done Yet

- **Database persistence** — progress lives in localStorage only; clearing cache or switching devices loses data. Planned: Neon (free Postgres on Vercel) to sync solved status, notes, and streaks server-side.
- **Revision spaced repetition** — the queue exists but has no scheduling logic (e.g. "due today based on last reviewed date").
- **Cumulative time tracking** — timer saves the last session only, not a full history.
- **Heatmap** — GitHub-style problems-per-day chart; needs the DB first.
