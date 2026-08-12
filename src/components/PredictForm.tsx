import { ChangeEvent } from 'react';

interface MapperState {
  loaded: boolean;
  fileName: string;
  buyerName: string;
  buyerId: string;
  poNum: string;
  poDate: string;
  itemsCount: number;
  totalQty: number;
  totalPrice: number;
}

interface PredictFormProps {
  mapperState: MapperState;
  handleFileUploadSim: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDemoUpload: () => void;
  isGemini?: boolean;
}

export default function PredictForm({
  mapperState,
  handleFileUploadSim,
  handleDemoUpload,
  isGemini = false,
}: PredictFormProps) {
  const uploaderId = isGemini ? 'mapper-gemini-file-uploader' : 'mapper-file-uploader';

  return (
    <div className="glass-card schema-tree-card">
      <div className="card-title" style={{ fontSize: '0.95rem' }}>
        {isGemini ? 'Source Schema (Gemini)' : 'Source Schema'}
      </div>

      <div className="upload-zone" onClick={() => document.getElementById(uploaderId)?.click()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>Upload Input File</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>JSON, XML, or spec file containing PO1, N1 data</div>
        <input type="file" id={uploaderId} style={{ display: 'none' }} accept=".txt,.json,.csv" onChange={handleFileUploadSim} />
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '15px' }}>
        Click upload zone to simulate Loading purchase order payload...
      </div>

      <div className="schema-tree">
        {mapperState.loaded ? (
          <>
            <div className="tree-node">📄 {mapperState.fileName}</div>
            <div className="tree-node indent"><span>orderHeader{'{ }'}</span></div>
            <div className="tree-node indent-double"><span>poNumber</span><span className="tree-node-val">{mapperState.poNum}</span></div>
            <div className="tree-node indent-double"><span>poDate</span><span className="tree-node-val">{mapperState.poDate}</span></div>
            <div className="tree-node indent"><span>buyer{'{ }'}</span></div>
            <div className="tree-node indent-double"><span>name</span><span className="tree-node-val">{mapperState.buyerName}</span></div>
            <div className="tree-node indent-double"><span>id</span><span className="tree-node-val">{mapperState.buyerId}</span></div>
            <div className="tree-node indent"><span>items[{mapperState.itemsCount}]</span></div>
            <div className="tree-node indent-double"><span>totalQty</span><span className="tree-node-val">{mapperState.totalQty}</span></div>
          </>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '15px' }}>
            No input loaded. Use the file zone or upload demo spec below.
          </div>
        )}
      </div>

      <button className="btn-primary" style={{ padding: '10px 18px', width: '100%', marginTop: '15px' }} onClick={handleDemoUpload}>
        Load EDI 850 Input
      </button>
    </div>
  );
}
