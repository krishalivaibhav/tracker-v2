# Track+ — Changelog & Upgrade Log

## Migration: Vanilla JS → React + Vite

The entire frontend was rewritten from ~2100 lines of imperative DOM manipulation
into a proper component tree.

**Why it helped:**
- Code editor state (multi-language, test cases, highlight overlay) would have been
  unmanageable in vanilla JS
- Vite gives tree-shaking, content-hashed bundles, and a proper dev server
- Mobile panel toggling and modal state are trivial with React hooks

**Files introduced:**
- `src/main.jsx` — React entry point
- `src/App.jsx` — root state (auth, data, routing, modals)
- `src/components/` — 11 components (Sidebar, Topbar, Dashboard, DSASheet/*, CareerTools,
  CodeEditorModal, AppModal, LandingPage)
- `src/utils/` — 6 pure utility modules (storage, stats, helpers, highlighter,
  starterCode, codeRunner)

---

## Features Added / Upgraded

### Code Editor
- **5-language support:** Python 3, C++, Java, C, JavaScript
- **Syntax highlighting** — custom tokeniser (no external lib) for all 5 languages
- **Smart editor:** Tab indent/dedent, auto-indent on Enter, bracket pairing,
  skip-over closing bracket
- **Starter code generation** — boilerplate auto-generated from the problem's input
  shape (single int, array, two arrays, etc.) for every language
- **Wandbox integration** — production code execution via Wandbox (free, no API key,
  real GCC/OpenJDK/Node on Linux); local dev falls back to native toolchain
  (python3 / g++ / gcc / javac / node)

### Test Cases & Verdicts
- All examples from problem data pre-loaded as test cases (Case 1, Case 2 …)
- **▶ Run** runs all cases in parallel, colours each tab green ✓ or red ✗
- Per-case verdict: **Correct / Wrong Answer / Error** with colour-coded output box
- **+ Add** button for custom test cases with editable input + expected output

### Problem Descriptions
- Server-side proxy fetches live problem HTML from **LeetCode GraphQL API** (tries LC
  first, falls back to GFG, then generated description)
- GFG scraper extracts problem content from `__NEXT_DATA__` JSON — no scraping fragility
- **LC ↗ / GFG ↗** link buttons open the problem directly in a new tab

### Mobile UX
- Full-screen code modal with **Problem / Code** tab toggle (mobile only)
- Problem panel fills entire height when active — scrollable statement + examples
- Toolbar wraps on small screens instead of overflowing
- Problem table scrolls horizontally on narrow screens
- Mobile bottom nav with Home / Dashboard / DSA / Career

### Auth & Data
- Google OAuth via `/api/auth/login` → callback → HMAC-signed session cookie
- Per-user localStorage key (`vk_a2z_v1_${user.id}`) — one-time migration from
  shared key on first login
- Graceful local mode (no auth required) — app works fully offline / without sign-in
- bfcache restore re-checks auth

### Security (vercel.json headers)
- `Content-Security-Policy` — restricts scripts, styles, fonts, images, workers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Auth routes: `Cache-Control: no-store, private`

---

## Planned Upgrades (not yet done)

### 1. Database Persistence — highest priority
**Problem:** all progress lives in `localStorage`. Clear cache, switch devices, or
use phone after solving on desktop → everything resets. Streak is meaningless if it
can survive a browser wipe.

**Plan:** Neon (free Postgres on Vercel) + a handful of API routes to sync solved
status, notes, and daily log. Google Auth already gives every user a stable ID.

### 2. Persist Code Per Problem
**Problem:** code written in the editor is gone on page refresh — `codeStore` is
React state only.

**Plan:** `localStorage` keyed by `${userId}-${slug}-${lang}`. Low effort, makes the
editor feel like an actual notebook.

### 3. PWA (Progressive Web App)
**Problem:** on mobile it's a browser tab, not an installed app.

**Plan:** `manifest.json` + service worker. The DSA sheet data is static so it can be
fully cached — works offline. Adds "Add to Home Screen" prompt.

### 4. Revision System
Mark problems for revision. Spaced-repetition queue surfaced on the Dashboard
("3 problems due for review today"). Pairs well with the streak system.

### 5. Practice Timer
Per-problem stopwatch that starts when you open the editor, stops when you mark
solved. Track average time per difficulty over time.

### 6. Detailed Analytics
Problems solved per day (heatmap like GitHub), breakdown by difficulty/topic/step,
time-to-solve distribution. Needs DB first.
