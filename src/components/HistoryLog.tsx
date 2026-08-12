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

interface HistoryLogProps {
  transactions: Transaction[];
  setActiveTraceTx: (tx: Transaction) => void;
  isMonitorView?: boolean;
}

export default function HistoryLog({
  transactions,
  setActiveTraceTx,
  isMonitorView = false,
}: HistoryLogProps) {
  if (isMonitorView) {
    return (
      <div className="view-panel active">
        <div className="view-title-row">
          <div className="view-title-desc">
            <h2>Transaction Monitor Logs</h2>
            <p>Audit and inspect connection histories and mapped payloads</p>
          </div>
        </div>
        <div className="glass-card">
          <div className="activity-table-wrapper">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>ID</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Format Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.timestamp}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>{tx.id}</td>
                    <td><strong>{tx.sender}</strong></td>
                    <td>{tx.receiver}</td>
                    <td>{tx.type}</td>
                    <td>
                      <span className={`status-badge ${tx.status === 'Success' ? 'success' : tx.status === 'Warning' ? 'warning' : 'danger'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={() => setActiveTraceTx(tx)}>
                        Inspect Journey
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Live Log Stream View
  return (
    <div className="glass-card">
      <div className="card-title">
        <span>Transaction Log Stream</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Live Tracking</span>
      </div>
      <div className="activity-table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Transaction ID</th>
              <th>Sender</th>
              <th>Format Type</th>
              <th>Protocol</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.timestamp.split(' ')[1] || tx.timestamp}</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>{tx.id}</td>
                <td><strong>{tx.sender}</strong></td>
                <td>{tx.type}</td>
                <td><span className="protocol-badge">{tx.protocol}</span></td>
                <td>
                  <span className={`status-badge ${tx.status === 'Success' ? 'success' : tx.status === 'Warning' ? 'warning' : 'danger'}`}>
                    {tx.status}
                  </span>
                </td>
                <td>
                  <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setActiveTraceTx(tx)}>
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
