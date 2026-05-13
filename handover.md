# Track+ — Handover Document

**Date:** 2026-05-13  
**Project directory:** `/Users/vaibhavkrishali/Desktop/projects/test/tracker-v2`  
**Git branch:** `main`  
**Last commit:** `fafb04a` — Fix commit author email for Vercel deployment

---

## What is this project?

**Track+** is a personal DSA & placement companion. It is a Vite + React frontend migration with Node.js serverless API routes deployed on Vercel.

**Features:**
- DSA Sheet — Striver A2Z sheet with progress tracking, streak counter, and in-browser code editor
- AI Resume Scanner — ATS score, strengths, improvement areas, and rewritten bullets via Groq
- Resume Upgrade — AI rewrites your resume for a target role with side-by-side preview
- Job Tracker — Track applications with status, notes, and stats
- Landing page — Animated hero with particle network and rotating motivational quotes

**Tech stack:**
- Vite + React migration in progress. React owns the app shell; feature screens are being converted from legacy DOM rendering one by one.
- Node.js serverless functions on Vercel
- Google OAuth for authentication (PKCE state verification, signed HMAC session cookies)
- Groq (`llama-3.3-70b-versatile`) for AI features
- PDF.js for resume parsing and preview
- Adzuna API for live job listings

---

## Project structure

```
tracker-v2/
├── index.html          # Main SPA HTML shell
├── src/
│   ├── main.jsx        # React entry
│   ├── App.jsx         # React-owned shell bridge
│   ├── legacy-shell.html # Existing HTML shell rendered by React during migration
│   ├── legacy-app.js   # Existing frontend JS while screens are migrated incrementally
│   ├── data.js         # DSA problem data
│   └── styles.css      # All styles
├── public/
│   ├── gfg.png
│   └── leetcode.png
├── api/
│   ├── gfg.js          # Proxy: scrapes GFG problem metadata
│   ├── auth/
│   │   ├── login.js    # Initiates Google OAuth flow
│   │   ├── callback.js # Handles OAuth callback, sets signed session cookie
│   │   ├── me.js       # Returns current user from session cookie
│   │   └── logout.js   # Clears session cookie
│   └── career/
│       ├── analyze.js  # AI resume analysis against job description (Groq)
│       ├── jobs.js     # Live job listings via Adzuna API
│       ├── scan.js     # ATS resume scan
│       └── upgrade.js  # AI resume rewrite for a target role
├── vercel.json         # Security headers / CSP
├── package.json        # Vite scripts and frontend dev dependency
├── .env.example        # Template for required env vars (untracked, not committed)
├── gfg.png             # Untracked asset
└── leetcode.png        # Untracked asset
```

---

## Vercel deployment

**Vercel project:** `tracker-v2`  
**Org:** `krishalivaibhavs-projects`  
**Project ID:** `prj_GyhBHEEOn8BAz0uiYiUlep07hv2J`  
**Org ID:** `team_yjNB2zUbMJ0t0CgRV3NrkjPw`  
**Production URL:** https://tracker-v2-nine.vercel.app  

### What was done in this session

1. Ran preflight checks — Vercel CLI v53.4.0 present, project already linked.
2. Deployed a **preview** build with `vercel` (no `--prod` flag).
3. Preview deployed successfully:
   - URL: https://tracker-v2-c8pvev12x-krishalivaibhavs-projects.vercel.app
   - Status: READY
   - Region: iad1 (Washington D.C.)
   - 5 serverless functions deployed: `api/auth/callback`, `api/auth/login`, `api/auth/logout`, `api/auth/me`, `api/career/analyze` (+ more)

### To promote to production

```bash
vercel --prod
```

> This will push to the live production URL (tracker-v2-nine.vercel.app) and affect real users. Confirm before running.

---

## Environment variables

Required vars (set these on Vercel dashboard or via `vercel env add`):

| Variable | Purpose |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `SESSION_SECRET` | 32+ char random string for HMAC session signing |
| `GROQ_API_KEY` | Groq API key for AI features |
| `GROQ_MODEL` | Model name, e.g. `llama-3.3-70b-versatile` |
| `APP_URL` | Full base URL, e.g. `https://tracker-v2-nine.vercel.app` |
| `ADZUNA_APP_ID` | Adzuna job search app ID (has fallback hardcoded) |
| `ADZUNA_APP_KEY` | Adzuna job search app key (has fallback hardcoded) |

**Google OAuth redirect URI** must be registered in Google Cloud Console:
- `http://localhost:3000/api/auth/callback` (local)
- `https://tracker-v2-nine.vercel.app/api/auth/callback` (production)
- Add any new Vercel preview URLs as needed

---

## Local development

```bash
cp .env.example .env.local   # fill in your keys
npm install
npm run dev      # frontend only
vercel dev       # frontend + serverless API routes
```

---

## Uncommitted files (local only, not in git)

These three files exist locally but have not been committed:
- `.env.example` — env var template file
- `gfg.png` — asset (likely for landing page or DSA sheet)
- `leetcode.png` — asset (likely for landing page or DSA sheet)

Commit them when ready:
```bash
git add .env.example gfg.png leetcode.png
git commit -m "Add env example and platform assets"
```

---

## Recent git history

```
fafb04a Fix commit author email for Vercel deployment
fe7ebaa Use OAuth user's first name in dashboard greeting
c40b5b3 Remove CGPA planner from README features
cf70bc5 Initial commit — Track+ placement tracker
```

---

## Known state / next steps

- Preview is live but not yet promoted to production.
- The frontend now builds with Vite through `npm run build`; Vercel should deploy the generated `dist/` output while keeping `api/` serverless routes.
- `package.json` has Vite scripts and a `vite` dev dependency.
- Adzuna API keys are currently hardcoded as fallbacks in `api/career/jobs.js` — should be moved to env vars for security.
