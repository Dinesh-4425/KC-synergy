interface XgbParams {
  eta: number;
  maxDepth: number;
  nEstimators: number;
}

interface RfParams {
  nTrees: number;
  maxFeatures: string;
}

interface ModelEvaluatorProps {
  mapperEngine: string;
  setMapperEngine: (val: string) => void;
  xgbParams: XgbParams;
  setXgbParams: (val: XgbParams) => void;
  rfParams: RfParams;
  setRfParams: (val: RfParams) => void;
  geminiModel: string;
  setGeminiModel: (val: string) => void;
  geminiInstructions: string;
  setGeminiInstructions: (val: string) => void;
  isAdminView?: boolean;
  showToast?: (msg: string, type?: string) => void;
  isGeminiMode?: boolean;
}

export default function ModelEvaluator({
  mapperEngine,
  setMapperEngine,
  xgbParams,
  setXgbParams,
  rfParams,
  setRfParams,
  geminiModel,
  setGeminiModel,
  geminiInstructions,
  setGeminiInstructions,
  isAdminView = false,
  showToast,
  isGeminiMode = false,
}: ModelEvaluatorProps) {
  if (isAdminView) {
    return (
      <div className="view-panel active">
        <div className="view-title-row">
          <div className="view-title-desc">
            <h2>Admin &amp; AI Configuration Settings</h2>
            <p>Control routing algorithms, private SSH credentials, and AI models settings</p>
          </div>
        </div>
        <div className="glass-card" style={{ maxWidth: '600px', textAlign: 'left' }}>
          <div className="form-group">
            <label>Default AI Translation Model</label>
            <select className="form-control" value={mapperEngine} onChange={(e) => setMapperEngine(e.target.value)}>
              <option value="heuristic">Heuristic Rule-Map (v2.0)</option>
              <option value="random-forest">Random Forest Classifier (Ensemble v1)</option>
              <option value="xgb">XGBoost Gradient Boosting (v3.2 Premium)</option>
              <option value="reinforcement">Reinforcement Q-Learning Engine (Aura v3)</option>
            </select>
          </div>
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label>System Credentials String</label>
            <input type="text" className="form-control" value="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC8kC..." disabled />
          </div>
          <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => showToast && showToast('Configuration rules saved successfully.', 'success')}>
            Save Configuration
          </button>
        </div>
      </div>
    );
  }

  if (isGeminiMode) {
    return (
      <div className="glass-card schema-tree-card" style={{ gap: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div className="card-title" style={{ fontSize: '0.95rem' }}>Gemini AI Map Rules</div>

        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Gemini Model</label>
          <select className="form-control" style={{ width: '100%', padding: '10px', borderColor: 'var(--color-primary)' }} value={geminiModel} onChange={(e) => setGeminiModel(e.target.value)}>
            <option value="gemini-3.5-flash">Gemini 3.5 Flash (Default)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Reasoning)</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash (Experimental)</option>
          </select>
        </div>

        <div className="form-group" style={{ margin: 0, textAlign: 'left' }}>
          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>System Prompt / Mapping Instructions</label>
          <textarea
            className="form-control"
            rows={4}
            style={{ width: '100%', resize: 'none', background: '#0a0d14', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'inherit', fontSize: '0.8rem', borderRadius: '10px', padding: '10px' }}
            value={geminiInstructions}
            onChange={(e) => setGeminiInstructions(e.target.value)}
            placeholder="Enter custom prompt instructions for mapping elements (e.g. format dates, custom checksum checks...)"
          />
        </div>
      </div>
    );
  }

  // Visual Map Rules Tuning View
  return (
    <div className="glass-card schema-tree-card" style={{ gap: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
      <div className="card-title" style={{ fontSize: '0.95rem' }}>Visual Map Rules</div>

      <select className="form-control" style={{ width: '100%', padding: '10px', borderColor: 'var(--color-purple)' }} value={mapperEngine} onChange={(e) => setMapperEngine(e.target.value)}>
        <option value="heuristic">Heuristic Rule-Map</option>
        <option value="random-forest">Random Forest Classifier</option>
        <option value="xgb">XGBoost Gradient Boosting</option>
        <option value="reinforcement">Reinforcement Q-Learning</option>
      </select>

      {mapperEngine === 'xgb' && (
        <div className="xgb-tuning-panel" style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginTop: '10px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)' }}>XGBoost Hyperparameters</div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Learning Rate (eta):</span>
              <span style={{ fontWeight: 'bold', color: '#fff' }}>{xgbParams.eta}</span>
            </div>
            <input type="range" min="0.01" max="0.3" step="0.01" value={xgbParams.eta} onChange={(e) => setXgbParams({ ...xgbParams, eta: parseFloat(e.target.value) })} style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Max Depth:</span>
              <span style={{ fontWeight: 'bold', color: '#fff' }}>{xgbParams.maxDepth}</span>
            </div>
            <input type="range" min="3" max="10" step="1" value={xgbParams.maxDepth} onChange={(e) => setXgbParams({ ...xgbParams, maxDepth: parseInt(e.target.value) })} style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Estimators (Trees):</span>
              <span style={{ fontWeight: 'bold', color: '#fff' }}>{xgbParams.nEstimators}</span>
            </div>
            <input type="range" min="50" max="300" step="10" value={xgbParams.nEstimators} onChange={(e) => setXgbParams({ ...xgbParams, nEstimators: parseInt(e.target.value) })} style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
          </div>
        </div>
      )}

      {mapperEngine === 'random-forest' && (
        <div className="rf-tuning-panel" style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginTop: '10px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-purple)' }}>Random Forest Settings</div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Number of Trees:</span>
              <span style={{ fontWeight: 'bold', color: '#fff' }}>{rfParams.nTrees}</span>
            </div>
            <input type="range" min="50" max="300" step="10" value={rfParams.nTrees} onChange={(e) => setRfParams({ ...rfParams, nTrees: parseInt(e.target.value) })} style={{ width: '100%', accentColor: 'var(--color-purple)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Max Features:</span>
              <span style={{ fontWeight: 'bold', color: '#fff' }}>{rfParams.maxFeatures}</span>
            </div>
            <select className="form-control" style={{ width: '100%', padding: '6px', fontSize: '0.75rem', background: '#0a0d14', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} value={rfParams.maxFeatures} onChange={(e) => setRfParams({ ...rfParams, maxFeatures: e.target.value })}>
              <option value="sqrt">sqrt (Square Root)</option>
              <option value="log2">log2 (Log base 2)</option>
              <option value="none">None (Use all features)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
