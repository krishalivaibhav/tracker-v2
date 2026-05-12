# Track+

Your personal DSA & placement companion — track every problem, every application, every opportunity, powered by AI.

**Live:** https://tracker-v2-nine.vercel.app

## Features

- **DSA Sheet** — Striver A2Z sheet with progress tracking, streak counter, and in-browser code editor
- **AI Resume Scanner** — ATS score, strengths, improvement areas, and rewritten bullets via Groq
- **Resume Upgrade** — AI-rewrites your resume for a target role with side-by-side Overleaf-style preview
- **Job Tracker** — Track applications with status, notes, and stats
- **CGPA Planner** — Forecast semester GPA
- **Landing page** — Animated hero with particle network and rotating motivational quotes

## Stack

- Vanilla JS + CSS (no framework)
- Node.js serverless functions on Vercel
- Google OAuth for auth
- Groq (llama-3.3-70b-versatile) for AI features
- PDF.js for resume parsing and preview

## Local setup

```bash
cp .env.local.example .env.local   # fill in your keys
npm install
vercel dev
```

Required env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`, `GROQ_API_KEY`, `GROQ_MODEL`, `APP_URL`
