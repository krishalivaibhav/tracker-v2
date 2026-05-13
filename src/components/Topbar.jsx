import { useState, useEffect } from 'react';
import { computeStreak } from '../utils/stats.js';

const TAB_LABELS = { dashboard: 'Dashboard', leetcode: 'DSA Sheet', career: 'Career Tools' };

export default function Topbar({ activeTab, steps, theme, onToggleTheme, user, onLogout }) {
  const streak = computeStreak(steps);
  const isDark = theme === 'dark';

  const initials = user
    ? (() => { const p = user.name.split(' '); return (p[0][0] + (p[1]?.[0] || '')).toUpperCase(); })()
    : null;

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span className="breadcrumb-current">{TAB_LABELS[activeTab] || 'Dashboard'}</span>
      </div>
      <div className="streak-chip" style={{ marginLeft: 'auto' }}>
        <svg className="flame" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2S5 5.5 5 8.5a3 3 0 0 0 6 0C11 5.5 8 2 8 2zm0 4s-1.5 1.5-1.5 2.5a1.5 1.5 0 0 0 3 0C9.5 7.5 8 6 8 6z"/>
        </svg>
        <span>{streak}</span>&nbsp;day streak
      </div>
      <button className="icon-btn" onClick={onToggleTheme} title="Toggle dark mode">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="14" height="14">
          {isDark
            ? <path d="M13.5 10A5.5 5.5 0 0 1 6 2.5a5.5 5.5 0 1 0 7.5 7.5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            : <><circle cx="8" cy="8" r="3"/><path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.6 3.6l.7.7M11.7 11.7l.7.7M3.6 12.4l.7-.7M11.7 4.3l.7-.7"/></>
          }
        </svg>
      </button>
      {user && (
        <button className="topbar-signout" onClick={onLogout} title="Sign out">
          {user.avatar
            ? <img src={user.avatar} alt="" style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} />
            : <span className="topbar-avatar">{initials}</span>
          }
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="12" height="12" style={{ flexShrink: 0 }}>
            <path d="M5 1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M9 10l3-3-3-3M12 7H5"/>
          </svg>
        </button>
      )}
    </header>
  );
}
