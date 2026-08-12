export default function About() {
  return (
    <div className="view-panel active">
      <div className="view-title-row" style={{ marginBottom: '30px' }}>
        <div className="view-title-desc">
          <h2>About Aura System Architecture</h2>
          <p>Learn about the core technologies, pipeline architectures, and neural engines driving KC Synergy.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {/* Card 1: AI Translation Core */}
        <div className="glass-card" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(0, 240, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Aura Translation Engine</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Aura integrates heuristic mappings with machine learning models (XGBoost, Random Forest, Q-learning) to dynamically parse, convert, and validate standard EDI X12, XML, and JSON payloads.
          </p>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-primary)' }}>
            ✓ Heuristics (Regex/Structure Matching)<br />
            ✓ Machine Learning (Gradient Boosted Trees)<br />
            ✓ Generative AI (Gemini 3.5 Flash Model Integration)
          </div>
        </div>

        {/* Card 2: B2B Protocols */}
        <div className="glass-card" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-purple)' }}>
            <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>B2B &amp; MFT Gateways</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            KC Synergy establishes AS2 connection tunnels, secure SFTP folders, and JSON APIs. It handles encrypted payloads, validates MDN responses, and dispatches data natively to ERP lines.
          </p>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-purple)' }}>
            ✓ AS2 (HTTPS + SHA-2 Signing)<br />
            ✓ SFTP (Public SSH Key Handshakes)<br />
            ✓ OAuth2 API Endpoints (OAuth 2.0 Auth Server)
          </div>
        </div>

        {/* Card 3: Neural OCR Gateway */}
        <div className="glass-card" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
            <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Fax AI OCR Gateway</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            The Fax AI gateway ingests PDF scans and image faxes, uses OCR bounding coordinate models to extract purchase order headers, tax IDs, and totals, and sends items for human review.
          </p>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--success)' }}>
            ✓ CNN Layout Parsers (98% baseline accuracy)<br />
            ✓ Coordinate Bounding (Dynamic Boxes Mapping)<br />
            ✓ Interactive Verification Panel
          </div>
        </div>
      </div>

      {/* Architecture Spec Panel */}
      <div className="glass-card" style={{ marginTop: '30px', padding: '30px', textAlign: 'left' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>System Specification &amp; Tech Stack</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '8px' }}>Frontend Hub</h4>
            <p>React 19.x &amp; Vite 8.x</p>
            <p>TypeScript Type Safety</p>
            <p>Vanilla CSS Theme System</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '8px' }}>B2B Engine Backend</h4>
            <p>Express 5.x Server</p>
            <p>Node.js Ingestion Pipelines</p>
            <p>Heuristics Compiler</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '8px' }}>AI Integration</h4>
            <p>Gemini LLM API Models</p>
            <p>XGBoost ML Models</p>
            <p>Random Forest Regressor</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '8px' }}>Deployment Spec</h4>
            <p>GitHub Repository Sync</p>
            <p>CI/CD Automated Linting</p>
            <p>ERP Destination Endpoints</p>
          </div>
        </div>
      </div>
    </div>
  );
}
