interface Partner {
  id: string;
  name: string;
  code: string;
  status: string;
  protocol: string;
  volume: string;
  maps: number;
}

interface DatabaseViewerProps {
  partners: Partner[];
  activeView: string;
  setIsOnboardModalOpen: (open: boolean) => void;
  setOnboardStep: (step: number) => void;
}

export default function DatabaseViewer({
  partners,
  activeView,
  setIsOnboardModalOpen,
  setOnboardStep,
}: DatabaseViewerProps) {
  if (activeView === 'partners') {
    return (
      <div className="view-panel active">
        <div className="view-title-row">
          <div className="view-title-desc">
            <h2>Trading Integrations</h2>
            <p>Onboard and configure secure communication connections with your external partners</p>
          </div>
          <button className="btn-icon-pair" onClick={() => { setIsOnboardModalOpen(true); setOnboardStep(1); }}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Onboard Partner
          </button>
        </div>

        <div className="partner-grid">
          {partners.map(partner => (
            <div key={partner.id} className="glass-card partner-card">
              <div className="partner-header">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="partner-logo-box">{partner.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</div>
                  <div style={{ textAlign: 'left' }}>
                    <h3 className="partner-name">{partner.name}</h3>
                    <span className="partner-code">{partner.code}</span>
                  </div>
                </div>
                <span className={`partner-status ${partner.status === 'Active' ? 'active' : 'pending'}`}>{partner.status}</span>
              </div>
              <div className="partner-details">
                <div>
                  <p className="partner-detail-label">Protocol</p>
                  <span className="partner-detail-val">{partner.protocol}</span>
                </div>
                <div>
                  <p className="partner-detail-label">Data Volume</p>
                  <span className="partner-detail-val">{partner.volume}</span>
                </div>
                <div>
                  <p className="partner-detail-label">Active Maps</p>
                  <span className="partner-detail-val">{partner.maps} Configured</span>
                </div>
                <div>
                  <p className="partner-detail-label">SLA Rate</p>
                  <span className="partner-detail-val" style={{ color: 'var(--success)' }}>99.98%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // MFT Secure Transfer view
  return (
    <div className="view-panel active">
      <div className="view-title-row">
        <div className="view-title-desc">
          <h2>MFT Secure Transfers</h2>
          <p>Monitor secure file transfer connection endpoints and server availability</p>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="glass-card">
          <h4>SFTP Gateway</h4>
          <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '8px' }}>sftp.kc-synergy.com:22</p>
          <div style={{ marginTop: '15px', color: 'var(--success)', fontWeight: 700 }}>Online</div>
        </div>
        <div className="glass-card">
          <h4>AS2 Gateway</h4>
          <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '8px' }}>https://as2.kc-synergy.com/as2</p>
          <div style={{ marginTop: '15px', color: 'var(--success)', fontWeight: 700 }}>Online</div>
        </div>
      </div>
    </div>
  );
}
