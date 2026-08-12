interface DiagramsDocProps {
  mapperEngine: string;
  geminiModel?: string;
  isGeminiMode: boolean;
}

export default function DiagramsDoc({
  mapperEngine,
  geminiModel = 'gemini-3.5-flash',
  isGeminiMode,
}: DiagramsDocProps) {
  if (isGeminiMode) {
    return (
      <div className="pipeline-flow-diagram" style={{ marginTop: '5px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>Real-time Gemini AI Pipeline</div>
        <svg viewBox="0 0 280 70" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <style>{`
              @keyframes dashAnimation {
                to { stroke-dashoffset: -20; }
              }
              @keyframes pulseNodeGemini {
                0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px var(--color-primary)); }
                50% { transform: scale(1.08); filter: drop-shadow(0 0 14px var(--color-primary)); }
              }
            `}</style>
          </defs>

          {/* Pipelines */}
          <path d="M 50 35 L 140 35" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
          <path d="M 50 35 L 140 35" stroke="var(--color-primary)" strokeWidth="3" strokeDasharray="6 6" style={{ animation: 'dashAnimation 1.5s linear infinite' }} />

          <path d="M 140 35 L 230 35" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
          <path d="M 140 35 L 230 35" stroke="var(--success)" strokeWidth="3" strokeDasharray="6 6" style={{ animation: 'dashAnimation 1.5s linear infinite' }} />

          {/* Nodes */}
          <circle cx="35" cy="35" r="16" fill="rgba(0, 240, 255, 0.08)" stroke="var(--color-primary)" strokeWidth="1.5" />
          <text x="35" y="38" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">SRC</text>

          <circle cx="140" cy="35" r="19" fill="rgba(59, 130, 246, 0.15)" stroke="var(--color-primary)" strokeWidth="2" style={{ transformOrigin: '140px 35px', animation: 'pulseNodeGemini 2.5s infinite ease-in-out' }} />
          <text x="140" y="38" fill="#fff" fontSize="7" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">GEMINI</text>

          <circle cx="245" cy="35" r="16" fill="rgba(16, 185, 129, 0.08)" stroke="var(--success)" strokeWidth="1.5" />
          <text x="245" y="38" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">OUT</text>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px', padding: '0 4px', fontWeight: 600 }}>
          <span>JSON / EDI</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{geminiModel.toUpperCase()}</span>
          <span>X12/Flat</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pipeline-flow-diagram" style={{ marginTop: '10px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>Real-time ML Mapping Pipeline</div>
      <svg viewBox="0 0 280 70" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <style>{`
            @keyframes dashAnimation {
              to { stroke-dashoffset: -20; }
            }
            @keyframes pulseNode {
              0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px var(--color-purple)); }
              50% { transform: scale(1.06); filter: drop-shadow(0 0 10px var(--color-purple)); }
            }
          `}</style>
        </defs>

        {/* Pipelines */}
        <path d="M 50 35 L 140 35" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
        <path d="M 50 35 L 140 35" stroke="var(--color-primary)" strokeWidth="3" strokeDasharray="6 6" style={{ animation: 'dashAnimation 1.5s linear infinite' }} />

        <path d="M 140 35 L 230 35" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
        <path d="M 140 35 L 230 35" stroke="var(--success)" strokeWidth="3" strokeDasharray="6 6" style={{ animation: 'dashAnimation 1.5s linear infinite' }} />

        {/* Nodes */}
        <circle cx="35" cy="35" r="16" fill="rgba(0, 240, 255, 0.08)" stroke="var(--color-primary)" strokeWidth="1.5" />
        <text x="35" y="38" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">SRC</text>

        <circle cx="140" cy="35" r="19" fill="rgba(168, 85, 247, 0.12)" stroke="var(--color-purple)" strokeWidth="2" style={{ transformOrigin: '140px 35px', animation: 'pulseNode 3s infinite ease-in-out' }} />
        <text x="140" y="38" fill="#fff" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">AURA</text>

        <circle cx="245" cy="35" r="16" fill="rgba(16, 185, 129, 0.08)" stroke="var(--success)" strokeWidth="1.5" />
        <text x="245" y="38" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">OUT</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px', padding: '0 4px', fontWeight: 600 }}>
        <span>JSON / EDI</span>
        <span style={{ color: 'var(--color-purple)', fontWeight: 700 }}>{mapperEngine.toUpperCase()}</span>
        <span>X12/Flat</span>
      </div>
    </div>
  );
}
