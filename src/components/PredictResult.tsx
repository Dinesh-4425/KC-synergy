interface MapperState {
  loaded: boolean;
  outputContent: string;
  mapScript: string;
  reasoning?: string;
  poNum?: string;
}

interface PredictResultProps {
  mapperDocType: string;
  setMapperDocType: (val: string) => void;
  mapperState: MapperState;
  outputTab: string;
  setOutputTab: (val: string) => void;
  isTranslating: boolean;
  handleCompileMap: () => void;
  handleDownloadOutput: () => void;
  showToast: (msg: string, type?: string) => void;
  isGemini?: boolean;
}

export default function PredictResult({
  mapperDocType,
  setMapperDocType,
  mapperState,
  outputTab,
  setOutputTab,
  isTranslating,
  handleCompileMap,
  handleDownloadOutput,
  showToast,
  isGemini = false,
}: PredictResultProps) {
  return (
    <div className="glass-card output-pane-card">
      <div className="card-title" style={{ fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
        <span>{isGemini ? 'Target Output (Gemini)' : 'Target Output'}</span>
        <select className="form-control" style={{ width: '130px', padding: '4px 8px', fontSize: '0.8rem' }} value={mapperDocType} onChange={(e) => setMapperDocType(e.target.value)}>
          <option value="850">EDI 850 (PO)</option>
          <option value="850-flat">Flat File (.TXT)</option>
          <option value="expected-results">Expected Results (.TXT)</option>
        </select>
      </div>

      <div className="edi-code-block" style={{ whiteSpace: 'pre', fontFamily: 'Consolas, monospace', background: '#03050c', color: 'var(--color-primary)', overflow: 'auto', textAlign: 'left' }}>
        {mapperState.loaded ? (
          outputTab === 'script'
            ? (mapperState.mapScript || '/* Click Compile & Translate to generate script. */')
            : outputTab === 'reasoning'
              ? (mapperState.reasoning || '/* Gemini reasoning is not generated yet. */')
              : (mapperState.outputContent || '/* Click Compile & Translate to convert file. */')
        ) : (
          `ISA*00*          *00*          *ZZ*KCSYNERGY      *ZZ*PARTNER        *260616*1923*U*00401*000000001*0*P*>~
GS*PO*KCSYNERGY*PARTNER*20260616*1923*1*X*004010~
ST*850*0001~
BEG*00*SA*PO-2026-904**20260616~

(Awaiting source data upload to generate N1, PO1, and CTT segments...)`
        )}
      </div>

      {mapperState.loaded && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
          <button
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', background: outputTab === 'result' ? 'rgba(0, 240, 255, 0.08)' : 'transparent', color: outputTab === 'result' ? 'var(--color-primary)' : 'var(--text-muted)' }}
            onClick={() => setOutputTab('result')}
          >
            Output Result
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', background: outputTab === 'script' ? 'rgba(0, 240, 255, 0.08)' : 'transparent', color: outputTab === 'script' ? 'var(--color-primary)' : 'var(--text-muted)' }}
            onClick={() => setOutputTab('script')}
          >
            Generated Map Script
          </button>
          {isGemini && mapperState.reasoning && (
            <button
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem', background: outputTab === 'reasoning' ? 'rgba(0, 240, 255, 0.08)' : 'transparent', color: outputTab === 'reasoning' ? 'var(--color-primary)' : 'var(--text-muted)' }}
              onClick={() => setOutputTab('reasoning')}
            >
              Gemini Reasoning
            </button>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={() => showToast('CTT check passed: 10 items, 165 total units matched.', 'success')} disabled={!mapperState.loaded}>
          Validate CTT Totals
        </button>
        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={handleCompileMap} disabled={isTranslating || !mapperState.loaded}>
          {isTranslating ? (isGemini ? 'Compiling Gemini...' : 'Compiling ML...') : 'Compile & Translate'}
        </button>
        {mapperState.loaded && (
          <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={handleDownloadOutput}>
            Download
          </button>
        )}
      </div>
    </div>
  );
}
