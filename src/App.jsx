import { useState, useEffect, useCallback } from 'react';
import { loadData, saveData } from './utils/storage.js';
import { today } from './utils/helpers.js';
import { warmupCodeApi } from './utils/codeRunner.js';
import LandingPage from './components/LandingPage.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import DSASheet from './components/DSASheet/index.jsx';
import CareerTools from './components/CareerTools.jsx';
import CodeEditorModal from './components/CodeEditorModal.jsx';
import AppModal from './components/AppModal.jsx';

export default function App() {
  const [user,          setUser]          = useState(null);
  const [authChecked,   setAuthChecked]   = useState(false);
  const [view,          setView]          = useState('loading'); // 'loading'|'landing'|'app'
  const [data,          setData]          = useState(null);
  const [activeTab,     setActiveTab]     = useState('dashboard');
  const [selectedStep,  setSelectedStep]  = useState(null);
  const [selectedSub,   setSelectedSub]   = useState(null);
  const [codeCtx,       setCodeCtx]       = useState(null);   // {si,ssi,pi}
  const [codeLang,      setCodeLang]      = useState('python');
  const [codeStore,     setCodeStore]     = useState({});
  const [appModal,      setAppModal]      = useState(null);   // null|{mode,id}
  const [theme,         setTheme]         = useState(() => localStorage.getItem('vk_theme') || 'dark');

  const storeKey = user ? `vk_a2z_v1_${user.id}` : 'vk_a2z_v1';

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vk_theme', theme);
  }, [theme]);

  // Auth check on mount
  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => {
        if (r.ok) return r.json();
        if (r.status === 401) return null;
        return null;
      })
      .then(u => {
        if (u) {
          setUser(u);
          setView('app');
        } else {
          setView('landing');
        }
      })
      .catch(() => {
        // No API (local mode) — run without auth
        setView('app');
      })
      .finally(() => setAuthChecked(true));
  }, []);

  // Load data once auth is resolved
  useEffect(() => {
    if (!authChecked) return;
    const key = user ? `vk_a2z_v1_${user.id}` : 'vk_a2z_v1';
    // One-time migration from shared key to user-specific key
    if (user && !localStorage.getItem(key)) {
      const legacy = localStorage.getItem('vk_a2z_v1');
      if (legacy) localStorage.setItem(key, legacy);
    }
    const d = loadData(key);
    setData(d);
    setActiveTab(localStorage.getItem('vk_active_tab') || 'dashboard');
    warmupCodeApi();
  }, [authChecked, user]);

  // Hash routing: read on mount and on hashchange
  useEffect(() => {
    if (view !== 'app' || !data) return;
    function applyHash() {
      const raw = location.hash.slice(1);
      if (!raw) return;
      const [seg, stepStr, ssStr] = raw.split('/');
      const tab = seg === 'dsa' ? 'leetcode' : (seg || null);
      if (!tab) return;
      setActiveTab(tab);
      localStorage.setItem('vk_active_tab', tab);
      if (tab === 'leetcode' && stepStr !== undefined) {
        setSelectedStep(parseInt(stepStr, 10));
        setSelectedSub(ssStr !== undefined ? parseInt(ssStr, 10) : null);
      } else {
        setSelectedStep(null); setSelectedSub(null);
      }
    }
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [view, !!data]);

  // bfcache restore: re-check auth
  useEffect(() => {
    const handler = e => { if (e.persisted) { setAuthChecked(false); } };
    window.addEventListener('pageshow', handler);
    return () => window.removeEventListener('pageshow', handler);
  }, []);

  function persistData(newData) {
    setData(newData);
    saveData(storeKey, newData);
  }

  function switchTab(id) {
    if (id === 'home') { setView('landing'); return; }
    setActiveTab(id);
    localStorage.setItem('vk_active_tab', id);
    setSelectedStep(null); setSelectedSub(null);
    history.pushState(null, '', '#' + (id === 'leetcode' ? 'dsa' : id));
  }

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }

  async function handleLogout() {
    try { await fetch('/api/auth/logout', { cache: 'no-store' }); } catch {}
    if (user) localStorage.removeItem(`vk_a2z_v1_${user.id}`);
    localStorage.removeItem('vk_active_tab');
    location.replace('/');
  }

  // ─── DSA handlers ───────────────────────────────────────────────────
  function openStep(si) {
    setSelectedStep(si); setSelectedSub(null);
    history.pushState(null, '', `#dsa/${si}`);
  }
  function openSubstep(si, ssi) {
    setSelectedStep(si); setSelectedSub(ssi);
    history.pushState(null, '', `#dsa/${si}/${ssi}`);
  }
  function backToSteps() {
    setSelectedStep(null); setSelectedSub(null);
    history.pushState(null, '', '#dsa');
  }
  function backToStep() {
    setSelectedSub(null);
    history.pushState(null, '', `#dsa/${selectedStep}`);
  }

  function toggleProblem(si, ssi, pi, val) {
    const next = JSON.parse(JSON.stringify(data));
    next.steps[si].substeps[ssi].problems[pi].done = val;
    next.steps[si].substeps[ssi].problems[pi].solvedOn = val ? today() : null;
    persistData(next);
  }

  function saveNote(si, ssi, pi, val) {
    const next = JSON.parse(JSON.stringify(data));
    next.steps[si].substeps[ssi].problems[pi].note = val.trim();
    persistData(next);
  }

  function saveDailyNote(date, val) {
    const next = JSON.parse(JSON.stringify(data));
    if (!next.dailyNotes) next.dailyNotes = {};
    next.dailyNotes[date] = val.trim();
    persistData(next);
  }

  // ─── Code editor handlers ────────────────────────────────────────────
  function openCodeEditor(si, ssi, pi) {
    setCodeCtx({ si, ssi, pi });
    setCodeLang('python');
  }

  function handleCodeClose(savedCode) {
    if (codeCtx) {
      const { si, ssi, pi } = codeCtx;
      const key = `${data.steps[si].substeps[ssi].problems[pi].s}-${codeLang}`;
      setCodeStore(prev => ({ ...prev, [key]: savedCode }));
    }
    setCodeCtx(null);
  }

  function handleLangChange(newLang, codeForOldLang) {
    if (codeCtx) {
      const { si, ssi, pi } = codeCtx;
      const oldKey = `${data.steps[si].substeps[ssi].problems[pi].s}-${codeLang}`;
      setCodeStore(prev => ({ ...prev, [oldKey]: codeForOldLang }));
    }
    setCodeLang(newLang);
  }

  function markCodeProblemDone(si, ssi, pi) {
    const next = JSON.parse(JSON.stringify(data));
    const p = next.steps[si].substeps[ssi].problems[pi];
    p.done = !p.done;
    p.solvedOn = p.done ? today() : null;
    persistData(next);
  }

  // ─── App modal handlers ──────────────────────────────────────────────
  function saveApp(obj) {
    const next = JSON.parse(JSON.stringify(data));
    if (appModal.id != null) next.applications[appModal.id] = obj;
    else next.applications.push(obj);
    persistData(next);
    setAppModal(null);
  }

  function deleteApp(i) {
    if (!confirm(`Delete ${data.applications[i].company}?`)) return;
    const next = JSON.parse(JSON.stringify(data));
    next.applications.splice(i, 1);
    persistData(next);
  }

  // ─── Render ─────────────────────────────────────────────────────────
  if (view === 'loading') return null;

  if (view === 'landing') {
    return <LandingPage user={user} onEnterApp={() => setView('app')} />;
  }

  if (!data) return null;

  return (
    <>
      <div className="app">
        <Sidebar
          activeTab={activeTab}
          steps={data.steps}
          user={user}
          onTabChange={switchTab}
          onLogout={handleLogout}
        />
        <div className="main">
          <Topbar
            activeTab={activeTab}
            steps={data.steps}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <main className="content" id="content-area">
            {activeTab === 'dashboard' && (
              <Dashboard data={data} user={user} onTabChange={switchTab} />
            )}
            {activeTab === 'leetcode' && (
              <DSASheet
                data={data}
                selectedStep={selectedStep}
                selectedSubstep={selectedSub}
                onStepClick={openStep}
                onSubstepClick={openSubstep}
                onBackToSteps={backToSteps}
                onBackToStep={backToStep}
                onOpenSubstep={openSubstep}
                onToggleProblem={toggleProblem}
                onSaveNote={saveNote}
                onDailyNoteSave={saveDailyNote}
                onOpenCodeEditor={openCodeEditor}
              />
            )}
            {activeTab === 'career' && <CareerTools />}
          </main>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="mobile-nav">
        {[
          { id: 'home', label: 'Home', icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 6.5L8 1.5l6.5 5V14a.5.5 0 0 1-.5.5H10V10H6v4.5H2a.5.5 0 0 1-.5-.5V6.5z"/></svg> },
          { id: 'dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg> },
          { id: 'leetcode', label: 'DSA', icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3.5 5L1.5 8l2 3M12.5 5l2 3-2 3M9.5 2.5l-3 11"/></svg> },
          { id: 'career', label: 'Career', icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="14" height="10" rx="1.5"/><path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M8 9h.01"/></svg> },
        ].map(item => (
          <button key={item.id} className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => switchTab(item.id)}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {codeCtx && (
        <CodeEditorModal
          data={data}
          context={codeCtx}
          lang={codeLang}
          codeStore={codeStore}
          onClose={handleCodeClose}
          onLangChange={handleLangChange}
          onMarkDone={markCodeProblemDone}
        />
      )}

      {appModal && (
        <AppModal
          mode={appModal.mode}
          initial={appModal.id != null ? data.applications[appModal.id] : null}
          onSave={saveApp}
          onClose={() => setAppModal(null)}
        />
      )}
    </>
  );
}
