interface NavbarProps {
  username: string;
  onLogout: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  setCopilotSubTab: (tab: string) => void;
}

export default function Navbar({
  username,
  onLogout,
  activeView,
  setActiveView,
  setCopilotSubTab,
}: NavbarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <svg style={{ width: '28px', height: '28px', strokeWidth: '2.5' }} viewBox="0 0 100 100" fill="none">
          <rect x="25" y="25" width="50" height="50" rx="12" fill="url(#nav-logo-grad)" />
          <path d="M40 40 L60 60 M60 40 L40 60" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <defs>
            <linearGradient id="nav-logo-grad" x1="25" y1="25" x2="75" y2="75">
              <stop stopColor="#0ea5e9" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <span className="sidebar-brand-text">KC Synergy</span>
      </div>

      <div className="menu-section">
        <div className="menu-section-label">General Operations</div>
        <button className={`menu-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          Dashboard
        </button>
        <button className={`menu-item ${activeView === 'copilot-studio' ? 'active' : ''}`} onClick={() => { setActiveView('copilot-studio'); setCopilotSubTab('chat'); }}>
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          AI Integration Copilot
        </button>

        <div className="menu-section-label" style={{ marginTop: '20px' }}>Connections &amp; Formats</div>
        <button className={`menu-item ${activeView === 'partners' ? 'active' : ''}`} onClick={() => setActiveView('partners')}>
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          Partner Manager
        </button>
        <button className={`menu-item ${activeView === 'mft' ? 'active' : ''}`} onClick={() => setActiveView('mft')}>
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          MFT Transfer
        </button>
        <button className={`menu-item ${activeView === 'fax-ai' ? 'active' : ''}`} onClick={() => setActiveView('fax-ai')}>
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          Fax AI (Core Fax)
        </button>

        <div className="menu-section-label" style={{ marginTop: '20px' }}>Analysis &amp; Security</div>
        <button className={`menu-item ${activeView === 'monitor' ? 'active' : ''}`} onClick={() => setActiveView('monitor')}>
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          Transaction Monitor
        </button>
        <button className={`menu-item ${activeView === 'admin-config' ? 'active' : ''}`} onClick={() => setActiveView('admin-config')}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          Admin &amp; AI Config
        </button>
        <button className={`menu-item ${activeView === 'about' ? 'active' : ''}`} onClick={() => setActiveView('about')}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
          About Aura System
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="user-avatar">{(username || 'Sarah Jenkins').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</div>
        <div className="user-info">
          <div className="user-name">{username || 'Sarah Jenkins'}</div>
          <div className="user-role">Lead Integrations Architect</div>
        </div>
        <button className="btn-logout" onClick={onLogout} title="Log Out">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
        </button>
      </div>
    </aside>
  );
}
