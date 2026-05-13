import { lcLinkedSolved } from '../utils/stats.js';
import { LC_TOTAL } from '../utils/storage.js';

const NAV_ITEMS = [
  { id: 'home',     label: 'Home',
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M1.5 6.5L8 1.5l6.5 5V14a.5.5 0 0 1-.5.5H10V10H6v4.5H2a.5.5 0 0 1-.5-.5V6.5z"/></svg>,
    special: true },
  { id: 'dashboard', label: 'Dashboard',
    icon: <svg viewBox="0 0 16 16" fill="currentColor" className="nav-icon"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg> },
  { id: 'leetcode', label: 'DSA Sheet',
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="nav-icon"><path d="M3.5 5L1.5 8l2 3M12.5 5l2 3-2 3M9.5 2.5l-3 11"/></svg> },
  { id: 'career',   label: 'Career Tools',
    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><rect x="1" y="4" width="14" height="10" rx="1.5"/><path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M8 9h.01"/></svg> },
];

export default function Sidebar({ activeTab, steps, user, onTabChange, onLogout }) {
  const lcSolved = lcLinkedSolved(steps);
  const pct = Math.min(100, lcSolved / LC_TOTAL * 100).toFixed(1);

  const initials = user
    ? (() => { const parts = user.name.split(' '); return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase(); })()
    : 'VK';

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">T+</div>
        <div className="brand-name">Track<span>+</span></div>
      </div>

      <div className="nav-section-label">Workspace</div>
      <nav className="nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            {item.icon} {item.label}
            {item.id === 'leetcode' && (
              <span className="nav-badge">{lcSolved}/{LC_TOTAL}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="user-card">
        <div className="user-row">
          <div className="avatar" style={{ padding: user?.avatar ? 0 : undefined }}>
            {user?.avatar
              ? <img src={user.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="" />
              : initials}
          </div>
          <div>
            <div className="user-name">{user?.name || 'Guest'}</div>
          </div>
        </div>
        <div>
          <div className="xp-text" style={{ marginBottom: '5px' }}>
            <span>LeetCode</span>
            <span>{lcSolved} / {LC_TOTAL}</span>
          </div>
          <div className="xp-bar">
            <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {user && (
          <a href="#" onClick={e => { e.preventDefault(); onLogout(); }}
            style={{ display: 'flex', marginTop: '10px', fontSize: '11.5px', color: 'var(--text-faint)', textDecoration: 'none', alignItems: 'center', gap: '5px' }}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="11" height="11">
              <path d="M5 1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M9 10l3-3-3-3M12 7H5"/>
            </svg>
            Sign out
          </a>
        )}
      </div>
    </aside>
  );
}
