interface Fax {
  id: string;
  vendor: string;
  ponum: string;
  taxid: string;
  total: string;
  items: number;
}

interface FaxOcrForm {
  vendor: string;
  ponum: string;
  taxid: string;
  total: string;
}

interface ProjectReportProps {
  pendingFaxes: Fax[];
  faxOcrForm: FaxOcrForm;
  setOcrForm: (val: FaxOcrForm) => void;
  ocrConfidence: string;
  handleOcrRegen: () => void;
  handleOcrApprove: () => void;
}

export default function ProjectReport({
  pendingFaxes,
  faxOcrForm,
  setOcrForm,
  ocrConfidence,
  handleOcrRegen,
  handleOcrApprove,
}: ProjectReportProps) {
  return (
    <div className="view-panel active">
      <div className="view-title-row">
        <div className="view-title-desc">
          <h2>Fax AI Review</h2>
          <p>Verify details extracted from document scans. Correct low confidence matches below.</p>
        </div>
      </div>

      {pendingFaxes.length > 0 ? (
        <div className="fax-split-grid">
          <div className="fax-doc-viewport">
            <div className="ocr-bounding-box" style={{ top: '130px', left: '150px', width: '180px', height: '35px' }}></div>
            <div className="mock-fax-header">
              <span className="mock-fax-title">{faxOcrForm.vendor}</span>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>FAX INCOMING RECPT</p>
            </div>
            <div className="fax-meta-row">
              <div>
                <p className="fax-meta-label">BILL TO</p>
                <p>KC SYNERGY CORP</p>
                <p>800 LAS COLINAS BLVD, TX</p>
              </div>
              <div>
                <p className="fax-meta-label">INVOICE SPEC</p>
                <p><strong>PO NUM:</strong> {faxOcrForm.ponum}</p>
                <p><strong>TAX ID:</strong> 74-9041235</p>
              </div>
            </div>
            <table className="fax-table">
              <thead>
                <tr>
                  <th>QTY</th>
                  <th>ITEM</th>
                  <th>DESC</th>
                  <th>UNIT</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>SRV-HW</td>
                  <td>Enterprise Hard Drive Arrays</td>
                  <td>$4,110.00</td>
                  <td>$4,110.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="glass-card fax-verification-panel" style={{ textAlign: 'left' }}>
            <div className="card-title">Extract Field Results</div>
            <div className="verification-fields-list">
              <div className="ocr-field-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="ocr-field-label">Vendor Name</div>
                    <input type="text" className="ocr-field-val-input" value={faxOcrForm.vendor} onChange={(e) => setOcrForm({ ...faxOcrForm, vendor: e.target.value })} />
                  </div>
                  <span className="confidence-badge high">98% Match</span>
                </div>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', width: '100%' }}>
                  <div style={{ width: '98%', height: '100%', background: 'var(--success)' }}></div>
                </div>
              </div>

              <div className="ocr-field-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="ocr-field-label">Purchase Order Link</div>
                    <input type="text" className="ocr-field-val-input" value={faxOcrForm.ponum} onChange={(e) => setOcrForm({ ...faxOcrForm, ponum: e.target.value })} />
                  </div>
                  <span className="confidence-badge high">99% Match</span>
                </div>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', width: '100%' }}>
                  <div style={{ width: '99%', height: '100%', background: 'var(--success)' }}></div>
                </div>
              </div>

              <div className="ocr-field-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px', borderColor: ocrConfidence === 'medium' ? 'var(--warning)' : 'var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="ocr-field-label">Tax ID Number</div>
                    <input type="text" className="ocr-field-val-input" style={{ color: ocrConfidence === 'medium' ? 'var(--warning)' : '#fff' }} value={faxOcrForm.taxid} onChange={(e) => setOcrForm({ ...faxOcrForm, taxid: e.target.value })} />
                  </div>
                  <span className={`confidence-badge ${ocrConfidence === 'high' ? 'high' : 'medium'}`}>
                    {ocrConfidence === 'high' ? '96% Match' : '65% Match'}
                  </span>
                </div>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', width: '100%' }}>
                  <div style={{ width: ocrConfidence === 'high' ? '96%' : '65%', height: '100%', background: ocrConfidence === 'high' ? 'var(--success)' : 'var(--warning)', transition: 'all 0.4s ease' }}></div>
                </div>
              </div>

              <div className="ocr-field-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="ocr-field-label">Total Amount</div>
                    <input type="text" className="ocr-field-val-input" value={faxOcrForm.total} onChange={(e) => setOcrForm({ ...faxOcrForm, total: e.target.value })} />
                  </div>
                  <span className="confidence-badge high">99% Match</span>
                </div>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', width: '100%' }}>
                  <div style={{ width: '99%', height: '100%', background: 'var(--success)' }}></div>
                </div>
              </div>
            </div>
            <div className="verification-actions">
              <button className="btn-secondary" style={{ flex: 1 }} onClick={handleOcrRegen}>
                Regenerate OCR
              </button>
              <button className="btn-primary" style={{ flex: 1.2 }} onClick={handleOcrApprove}>
                Approve &amp; Post PO
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '50px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--success)' }}>✓ All documents resolved</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>There are no outstanding faxes in the verification queue.</p>
        </div>
      )}
    </div>
  );
}
