import { useState, FormEvent } from 'react';

interface LoginProps {
  onLogin: (userId: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [userId, setUserId] = useState<string>('Sarah Jenkins');
  const [password, setPassword] = useState<string>('••••••••');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('User ID is required');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLogin(userId);
    }, 1000);
  };

  const handleSso = (provider: string) => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setIsLoading(false);
      onLogin(`${provider} User`);
    }, 1200);
  };

  return (
    <div className="login-container">
      {/* Glow Orbs in Background */}
      <div className="bg-glow-container">
        <div className="bg-glow-orb orb-blue"></div>
        <div className="bg-glow-orb orb-purple"></div>
      </div>

      <div className="login-card">
        {/* Modern React-styled SVG Logo */}
        <svg className="brand-logo-react" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="25" width="50" height="50" rx="14" fill="url(#login-logo-grad)" />
          <path d="M40 40 L60 60 M60 40 L40 60" stroke="#00f0ff" strokeWidth="6" strokeLinecap="round" />
          <defs>
            <linearGradient id="login-logo-grad" x1="25" y1="25" x2="75" y2="75" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0ea5e9" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        <h1 className="login-title">KC Synergy</h1>
        <p className="login-subtitle">Sterling B2B EDI Integration Hub &amp; Translation Studio</p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontSize: '0.85rem', fontWeight: 600 }}>{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <div className="input-icon-wrapper">
              <input
                type="text"
                id="userId"
                className="form-control"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                disabled={isLoading}
              />
              <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Security Password</label>
            <div className="input-icon-wrapper">
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className="spinner-ring" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" style={{ width: '18px', height: '18px' }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(2, 4, 10, 0.15)" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#02040a" strokeLinecap="round" />
                </svg>
                Initializing Aura Session...
              </>
            ) : (
              <>
                <span>Initialize Session</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px', marginLeft: '2px' }}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="sso-divider">OR SSO VERIFICATION</div>

        <div className="sso-buttons">
          <button className="sso-btn" onClick={() => handleSso('Okta')} disabled={isLoading}>
            Okta Verified
          </button>
          <button className="sso-btn" onClick={() => handleSso('AzureAD')} disabled={isLoading}>
            Azure AD
          </button>
        </div>

        <div className="system-status-indicator">
          <span className="status-dot"></span>
          <span>Aura Engine v2026.1 Online</span>
        </div>
      </div>
    </div>
  );
}
