import { MouseEvent } from 'react';

interface Transaction {
  id: string;
  timestamp: string;
  sender: string;
  receiver: string;
  type: string;
  protocol: string;
  status: string;
  details: string;
}

interface Partner {
  id: string;
  name: string;
  code: string;
  status: string;
  protocol: string;
  volume: string;
  maps: number;
}

interface Fax {
  id: string;
  vendor: string;
  ponum: string;
  taxid: string;
  total: string;
  items: number;
}

interface HeroProps {
  transactions: Transaction[];
  partners: Partner[];
  pendingFaxes: Fax[];
  handleMouseMoveKpi: (e: MouseEvent<HTMLDivElement>) => void;
}

export default function Hero({
  transactions,
  partners,
  pendingFaxes,
  handleMouseMoveKpi,
}: HeroProps) {
  return (
    <div className="dashboard-grid">
      <div className="glass-card kpi-card" onMouseMove={handleMouseMoveKpi}>
        <div className="kpi-icon blue">
          <svg viewBox="0 0 24 24"><line x1="22" y1="12" x2="2" y2="12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
        </div>
        <div className="kpi-info">
          <div className="kpi-value">99.98%</div>
          <div className="kpi-label">SLA Integrity</div>
        </div>
      </div>

      <div className="glass-card kpi-card" onMouseMove={handleMouseMoveKpi}>
        <div className="kpi-icon purple">
          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
        </div>
        <div className="kpi-info">
          <div className="kpi-value">{transactions.length * 15 + 120}</div>
          <div className="kpi-label">Data Volume (24h)</div>
        </div>
      </div>

      <div className="glass-card kpi-card" onMouseMove={handleMouseMoveKpi}>
        <div className="kpi-icon green">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        </div>
        <div className="kpi-info">
          <div className="kpi-value">{partners.length}</div>
          <div className="kpi-label">Active Partners</div>
        </div>
      </div>

      <div className="glass-card kpi-card" onMouseMove={handleMouseMoveKpi}>
        <div className="kpi-icon warning">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        </div>
        <div className="kpi-info">
          <div className="kpi-value" id="kpi-fax-queue">{pendingFaxes.length}</div>
          <div className="kpi-label">Pending Faxes</div>
        </div>
      </div>
    </div>
  );
}

export function IntegrationInsights() {
  return (
    <div className="glass-card" style={{ display: 'flex', flex: '1', flexDirection: 'column', gap: '20px' }}>
      <div className="card-title">Integration Insights</div>
      <div className="insights-list">
        <div className="insight-card info">
          <div className="insight-icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
          </div>
          <div className="insight-text-wrapper">
            <div className="insight-title">AS2 Channel Verified</div>
            <div className="insight-desc">Walmart link is operating with zero packet drops. Certified key active.</div>
          </div>
        </div>

        <div className="insight-card warning">
          <div className="insight-icon">
            <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </div>
          <div className="insight-text-wrapper">
            <div className="insight-title">Low Confidence Invoice</div>
            <div className="insight-desc">DHL Express has a scanned tax receipt queue with low OCR confidence values.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
