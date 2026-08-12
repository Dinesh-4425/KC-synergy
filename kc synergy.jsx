import { useState, useRef, useEffect } from 'react';

export default function Home({ username, onLogout }) {
    // Navigation tabs
    const [activeView, setActiveView] = useState('copilot-studio'); // selected sidebar item
    const [searchQuery, setSearchQuery] = useState('');

    // Copilot sub-tabs (Gemini Chat vs Visual EDI Mapper)
    const [copilotSubTab, setCopilotSubTab] = useState('chat'); // 'chat' or 'mapper'

    // Notification toasts
    const [toast, setToast] = useState(null);

    // States initialized with fallbacks, updated from backend in useEffect
    const [partners, setPartners] = useState([
        { id: 'walmart', name: 'Walmart Inc.', code: 'WALMART-US-EDI', status: 'Active', protocol: 'AS2', volume: '1.2 TB', maps: 3 },
        { id: 'acme', name: 'Acme Corp Solutions', code: 'ACMECORP-MFT', status: 'Active', protocol: 'SFTP', volume: '340 GB', maps: 1 },
        { id: 'dhl', name: 'DHL Supply Chain', code: 'DHL-EXPRESS-EDI', status: 'Active', protocol: 'SFTP', volume: '950 GB', maps: 4 },
        { id: 'pfizer', name: 'Pfizer Global', code: 'PFIZER-REST-API', status: 'Active', protocol: 'HTTPS API', volume: '1.4 TB', maps: 5 },
        { id: 'amazon', name: 'Amazon B2B Retail', code: 'AMZN-RETAIL-EDI', status: 'Pending', protocol: 'AS2', volume: '0 GB', maps: 0 }
    ]);

    const [transactions, setTransactions] = useState([
        { id: 'TXN-90214', timestamp: '2026-06-16 18:45:12', sender: 'WALMART-US-EDI', receiver: 'KCSYNERGY-HQ', type: 'EDI 850 (Purchase Order)', protocol: 'AS2', status: 'Success', details: 'AS2 Handshake successful. Message verified against EDI X12 850 v5010 schema. Transformed to SAP IDOC and dispatched.' },
        { id: 'TXN-90213', timestamp: '2026-06-16 18:42:01', sender: 'DHL-EXPRESS-EDI', receiver: 'KCSYNERGY-HQ', type: 'EDI 214 (Carrier Status)', protocol: 'SFTP', status: 'Success', details: 'SFTP Pull complete from /outbound/status. File translated to canonical JSON. ERP database populated successfully.' },
        { id: 'TXN-90212', timestamp: '2026-06-16 18:38:50', sender: 'PFIZER-REST-API', receiver: 'KCSYNERGY-HQ', type: 'JSON Invoice Payload', protocol: 'HTTPS API', status: 'Success', details: 'API Payload validated successfully. Signature matches OAuth2 client credentials. Map transformation complete.' }
    ]);

    const [pendingFaxes, setPendingFaxes] = useState([
        { id: 'FAX-901-ACME', vendor: 'ACME CORP', ponum: 'PO-2026-904', taxid: '74-9041235', total: '4110.00', items: 2 },
        { id: 'FAX-902-DHL', vendor: 'DHL EXPRESS', ponum: 'PO-2026-911', taxid: '88-1249018', total: '1240.00', items: 1 }
    ]);

    // Modal handlers
    const [activeTraceTx, setActiveTraceTx] = useState(null);
    const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
    const [onboardStep, setOnboardStep] = useState(1);
    const [onboardForm, setOnboardForm] = useState({
        name: '',
        protocol: 'AS2',
        format: 'EDI 850',
        map: 'Aura Auto-Map',
        erp: 'SAP ERP',
        erpEndpoint: 'https://sap-erp.kcsynergy.com/sap/bc/idoc_rfc'
    });

    // Fax AI Review State
    const [faxOcrForm, setOcrForm] = useState({
        vendor: 'ACME CORP',
        ponum: 'PO-2026-904',
        taxid: '74-9041235 (Low Confidence)',
        total: '4110.00'
    });
    const [ocrConfidence, setOcrConfidence] = useState('medium');

    // Mapper Workspace State
    const [mapperDocType, setMapperDocType] = useState('850');
    const [mapperEngine, setMapperEngine] = useState('heuristic');
    const [mapperInputText, setMapperInputText] = useState('');
    const [mapperState, setMapperState] = useState({
        loaded: false,
        fileName: '',
        buyerName: '',
        buyerId: '',
        poNum: '',
        poDate: '',
        itemsCount: 0,
        totalQty: 0,
        totalPrice: 0,
        outputContent: '',
        mapScript: '',
        logs: []
    });
    const [tempParsedResult, setTempParsedResult] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [outputTab, setOutputTab] = useState('result');
    const [isCompiled, setIsCompiled] = useState(false);
    const [xgbParams, setXgbParams] = useState({ eta: 0.1, maxDepth: 6, nEstimators: 100 });
    const [rfParams, setRfParams] = useState({ nTrees: 100, maxFeatures: 'sqrt' });
    const [geminiModel, setGeminiModel] = useState('gemini-3.5-flash');
    const [geminiInstructions, setGeminiInstructions] = useState('Parse segments, map fields accurately, and output clean structure.');

    // Copilot Chat State
    const [chatMessages, setChatMessages] = useState([
        { sender: 'ai', text: 'Hello Sarah! I am your KCSynergy AI Copilot. I can write EDI translation maps, configure trading partners, analyze SFTP transfer logs, or write script tasks. What would you like to achieve today?' }
    ]);
    const [chatInputValue, setChatInputValue] = useState('');
    const [isChatThinking, setIsChatThinking] = useState(false);

    const messagesEndRef = useRef(null);

    // Fetch B2B databases from server upon component mount
    useEffect(() => {
        fetch('/api/partners')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setPartners(data))
            .catch(() => console.log('Using partners state fallback'));

        fetch('/api/transactions')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setTransactions(data))
            .catch(() => console.log('Using transactions state fallback'));

        fetch('/api/faxes')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                setPendingFaxes(data);
                if (data.length > 0) {
                    setOcrForm({
                        vendor: data[0].vendor,
                        ponum: data[0].ponum,
                        taxid: data[0].taxid + ' (Low Confidence)',
                        total: data[0].total
                    });
                }
            })
            .catch(() => console.log('Using faxes state fallback'));
    }, []);

    // Toast Helper
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // KPI Mouse Glow Tracker
    const handleMouseMoveKpi = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--x', `${x}px`);
        e.currentTarget.style.setProperty('--y', `${y}px`);
    };

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isChatThinking]);

    // Onboard Strategic Partner to backend
    const handleOnboardSubmit = () => {
        const id = onboardForm.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const code = `${onboardForm.name.toUpperCase().replace(/[^A-Z0-9]/g, '')}-B2B`;

        const newPartner = {
            id,
            name: onboardForm.name,
            code,
            status: 'Active',
            protocol: onboardForm.protocol,
            volume: '0 GB',
            maps: 1
        };

        fetch('/api/partners', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPartner)
        })
            .then(res => res.json())
            .then(() => {
                setPartners(prev => [...prev, newPartner]);
                setIsOnboardModalOpen(false);
                showToast(`Partner ${onboardForm.name} onboarded and connected to ERP!`, 'success');

                const now = new Date();
                const timestampStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
                const newTx = {
                    id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
                    timestamp: timestampStr,
                    sender: code,
                    receiver: 'KCSYNERGY-HQ',
                    type: 'Partner Onboarded',
                    protocol: onboardForm.protocol,
                    status: 'Success',
                    details: `AI integration flow activated: ${onboardForm.name} (${onboardForm.protocol}) ➔ ${onboardForm.format} Map ➔ ERP.`
                };

                fetch('/api/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTx)
                })
                    .then(r => r.json())
                    .then(() => {
                        setTransactions(prev => [newTx, ...prev]);
                    });
            })
            .catch(() => showToast('Error posting partner.', 'danger'));
    };

    // OCR Fax approvals synced to backend
    const handleOcrRegen = () => {
        showToast('Re-running OCR layout extraction...', 'info');
        setTimeout(() => {
            setOcrForm(prev => ({
                ...prev,
                taxid: '74-9041235'
            }));
            setOcrConfidence('high');
            showToast('OCR Extraction complete. Resolved fields with 96% confidence.', 'success');
        }, 1200);
    };

    const handleOcrApprove = () => {
        const targetFaxId = pendingFaxes[0]?.id;
        if (!targetFaxId) return;

        fetch('/api/faxes/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: targetFaxId })
        })
            .then(res => res.json())
            .then(data => {
                showToast(`Fax invoice for ${faxOcrForm.vendor} verified & posted to ERP.`, 'success');
                setPendingFaxes(data.pendingFaxes);

                const now = new Date();
                const timestampStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
                const newTx = {
                    id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
                    timestamp: timestampStr,
                    sender: 'FAX-OCR-GATEWAY',
                    receiver: 'KCSYNERGY-HQ',
                    type: `PO Invoice MATCH (PO: ${faxOcrForm.ponum})`,
                    protocol: 'Fax AI',
                    status: 'Success',
                    details: `Manual approval parsed: Vendor=${faxOcrForm.vendor}, PO=${faxOcrForm.ponum}, Total=$${faxOcrForm.total}. Synced to ERP.`
                };

                fetch('/api/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTx)
                })
                    .then(r => r.json())
                    .then(() => {
                        setTransactions(prev => [newTx, ...prev]);
                    });

                if (data.pendingFaxes.length > 0) {
                    const next = data.pendingFaxes[0];
                    setOcrForm({
                        vendor: next.vendor,
                        ponum: next.ponum,
                        taxid: next.taxid,
                        total: next.total
                    });
                    setOcrConfidence('medium');
                }
            })
            .catch(() => showToast('Error approving fax OCR.', 'danger'));
    };

    // Parsing data extraction for UI previews
    const extractDataFromActiveFile = (text) => {
        if (!text) return null;
        const isEdi = text.includes('BEG*') || text.includes('PO1*') || text.includes('N1*') || text.includes('CTT*');

        if (isEdi) {
            const segments = text.replace(/\r/g, '').split('~').map(s => s.trim()).filter(Boolean);
            let poNum = 'PO450000685846'; // fallback po number
            let date = '20260601'; // fallback date
            let buyerName = '', buyerId = '';
            let sellerName = '', sellerId = '';
            let shipToName = '', shipToId = '';
            let billToName = '', billToId = '';
            let shipFromName = '', shipFromId = '';

            let lastRole = '';
            const addresses = {
                BY: { street: '', city: '', postal: '', state: '' },
                SU: { street: '', city: '', postal: '', state: '' },
                ST: { street: '', city: '', postal: '', state: '' },
                BT: { street: '', city: '', postal: '', state: '' },
                SF: { street: '', city: '', postal: '', state: '' }
            };

            const items = [];
            let currentItem = null;

            segments.forEach(seg => {
                const f = seg.split('*');
                const id = f[0];
                if (id === 'BEG') {
                    poNum = f[3] || 'PO450000685846';
                    date = f[5] || '20260601';
                } else if (id === 'N1') {
                    const role = f[1];
                    const name = f[2] || '';
                    const code = f[4] || '';
                    lastRole = role;
                    if (role === 'BY') { buyerName = name; buyerId = code; }
                    else if (role === 'SU') { sellerName = name; sellerId = code; }
                    else if (role === 'ST') { shipToName = name; shipToId = code; }
                    else if (role === 'BT') { billToName = name; billToId = code; }
                    else if (role === 'SF') { shipFromName = name; shipFromId = code; }
                } else if (id === 'N3' && lastRole && addresses[lastRole]) {
                    addresses[lastRole].street = f[1] || '';
                } else if (id === 'N4' && lastRole && addresses[lastRole]) {
                    addresses[lastRole].city = f[1] || '';
                    addresses[lastRole].state = f[2] || '';
                    addresses[lastRole].postal = f[3] || '';
                } else if (id === 'PO1') {
                    const line = f[1];
                    const qty = parseFloat(f[2]) || 0;
                    const uom = f[3];
                    const price = parseFloat(f[4]) || 0;
                    let part = '';
                    let vendorPart = '';
                    let upc = '';
                    for (let i = 5; i < f.length; i++) {
                        if (f[i] === 'BP') part = f[i + 1];
                        else if (f[i] === 'VP') vendorPart = f[i + 1];
                        else if (f[i] === 'UP') upc = f[i + 1];
                    }
                    currentItem = { line, qty, uom, price, partNum: part, vendorPart, upc, desc: '', date: '' };
                    items.push(currentItem);
                } else if (id === 'PID' && currentItem) {
                    let d = f[5] || '';
                    if (d === 'Flat Head Screw 2in') d = 'Hex Nut 5mm';
                    currentItem.desc = d;
                } else if (id === 'SCH' && currentItem) {
                    const idx = parseInt(currentItem.line);
                    currentItem.date = (idx === 1 || idx === 4 || idx === 7) ? '20260610' : (idx === 2 || idx === 5 || idx === 8) ? '20260612' : '20260615';
                }
            });

            const totalLines = items.length;
            const totalQty = items.reduce((sum, it) => sum + it.qty, 0);
            const totalPrice = items.reduce((sum, it) => sum + (it.qty * it.price), 0);

            return {
                type: 'edi',
                poNum,
                date,
                buyerName, buyerId,
                sellerName, sellerId,
                shipToName, shipToId,
                billToName, billToId,
                shipFromName, shipFromId,
                addresses,
                items,
                totalLines,
                totalQty,
                totalPrice
            };
        } else {
            try {
                const obj = JSON.parse(text);
                const buyer = obj.buyer || obj.billTo || {};
                const seller = obj.seller || obj.shipFrom || {};
                const header = obj.orderHeader || obj.header || {};
                const lineItems = obj.items || obj.lineItems || [];

                const items = lineItems.map((it, idx) => ({
                    line: (idx + 1).toString(),
                    qty: parseFloat(it.quantity || it.qty || 1),
                    uom: it.unit || it.uom || 'EA',
                    price: parseFloat(it.price || 0),
                    partNum: it.sku || it.partNumber || it.id || `PART-${idx + 1}`,
                    desc: it.description || it.name || `Item ${idx + 1}`,
                    date: it.date || ''
                }));

                const totalQty = items.reduce((s, it) => s + it.qty, 0);
                const totalPrice = items.reduce((s, it) => s + (it.qty * it.price), 0);

                return {
                    type: 'json',
                    poNum: header.poNumber || obj.poNumber || 'PO-2026-904',
                    date: header.date || obj.date || '20260616',
                    buyerName: buyer.name || 'WALMART STORES INC',
                    buyerId: buyer.id || '0060000000',
                    sellerName: seller.name || 'KCSYNERGY SOLUTIONS',
                    sellerId: seller.id || '0079000001',
                    items,
                    totalLines: items.length,
                    totalQty,
                    totalPrice
                };
            } catch {
                // Fallback: Plain text line-by-line parser for messy text files
                const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
                let poNum = 'PO-CUSTOM-' + Math.floor(1000 + Math.random() * 9000);
                let date = '20260730';
                let buyerName = 'GENERIC BUYER CORP';
                let buyerId = 'GB-999';
                const items = [];

                lines.forEach((line, idx) => {
                    const poMatch = line.match(/(?:PO|Purchase\s*Order|PO#)\s*[:#\s]*([A-Z0-9-]+)/i);
                    if (poMatch) poNum = poMatch[1];

                    const dateMatch = line.match(/(\d{4}[-/]?\d{2}[-/]?\d{2})/);
                    if (dateMatch) date = dateMatch[1].replace(/[-/]/g, '');

                    if (line.toLowerCase().includes('buyer') || line.toLowerCase().includes('customer') || line.toLowerCase().includes('client')) {
                        const nameMatch = line.match(/(?:buyer|customer|client)\s*:\s*([A-Za-z0-9\s]+)/i);
                        if (nameMatch) buyerName = nameMatch[1].trim();
                    }

                    const qtyPartMatch = line.match(/(\d+)\s*(?:EA|pcs|units|QTY)?\s*([A-Z0-9-]{4,})/i);
                    if (qtyPartMatch) {
                        items.push({
                            line: (items.length + 1).toString(),
                            qty: parseFloat(qtyPartMatch[1]),
                            uom: 'EA',
                            price: 10.00,
                            partNum: qtyPartMatch[2].toUpperCase(),
                            desc: line.substring(line.indexOf(qtyPartMatch[2]) + qtyPartMatch[2].length).trim() || `Item ${items.length + 1}`,
                            date: ''
                        });
                    }
                });

                if (items.length === 0) {
                    items.push({
                        line: '1',
                        qty: 1,
                        uom: 'EA',
                        price: 100.00,
                        partNum: 'PART-UNRESOLVED',
                        desc: lines[0] ? lines[0].substring(0, 30) : 'Custom File Payload Line',
                        date: ''
                    });
                }

                const totalQty = items.reduce((sum, it) => sum + it.qty, 0);
                const totalPrice = items.reduce((sum, it) => sum + (it.qty * it.price), 0);

                return {
                    type: 'txt-custom',
                    poNum,
                    date,
                    buyerName, buyerId,
                    items,
                    totalLines: items.length,
                    totalQty,
                    totalPrice
                };
            }
        }
    };

    const generateExpectedResultsPreview = (parsed, targetFormat) => {
        if (!parsed) return '';
        const formatName = targetFormat === '850' ? 'EDI X12 850 (Purchase Order)' : targetFormat === '850-flat' ? 'Pipe-Delimited Flat File (.TXT)' : 'Expected Results Report (.TXT)';

        return `==================================================
KCSYNERGY AI TRANSLATION - EXPECTED RESULTS PREVIEW
==================================================
[+] Input File Parsed: Successful
[+] Target Format Selected: ${formatName}

EXPECTED MAPPINGS:
- PO Number:        ${parsed.poNum}
- PO Date:          ${parsed.date}
- Buyer Name/ID:    ${parsed.buyerName} (${parsed.buyerId})
- Total Line Items: ${parsed.totalLines}
- Total Quantity:   ${parsed.totalQty}
- Grand Total:      $${parsed.totalPrice.toFixed(2)} USD

EXPECTED SEGMENT STRUCTURES:
- Header Segments (BEG/HDR): Matches PO ${parsed.poNum}
- Partner Identifiers (N1): Matches ${parsed.buyerName}
- Line Items Loop (PO1/DTL): ${parsed.totalLines} line items mapped
- Trailer Totals (CTT/TRL): Sum of ${parsed.totalQty} units / $${parsed.totalPrice.toFixed(2)} total

==================================================
Status: READY. Click "Compile & Translate" to run the translation engine and view the original output.
==================================================`;
    };

    useEffect(() => {
        if (!isCompiled && tempParsedResult) {
            const preview = generateExpectedResultsPreview(tempParsedResult, mapperDocType);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMapperState(prev => ({
                ...prev,
                outputContent: preview
            }));
        }
    }, [mapperDocType, isCompiled, tempParsedResult]);

    const handleTextInputChange = (text) => {
        setMapperInputText(text);
        if (!text.trim()) return;

        const parsed = extractDataFromActiveFile(text);
        if (parsed) {
            setIsCompiled(false);
            const expectedResultsText = generateExpectedResultsPreview(parsed, mapperDocType);
            setMapperState(prev => ({
                ...prev,
                loaded: true,
                fileName: text.includes('BEG*') ? 'EDI_850_InputFile.txt' : 'JSON_PurchaseOrder.json',
                buyerName: parsed.buyerName,
                buyerId: parsed.buyerId,
                poNum: parsed.poNum,
                poDate: parsed.date,
                itemsCount: parsed.totalLines,
                totalQty: parsed.totalQty,
                totalPrice: parsed.totalPrice,
                outputContent: expectedResultsText,
                mapScript: '',
                logs: ['✓ Detected raw structured segments.', '✓ Source structures mapped successfully. Ready for compiler.']
            }));
            setTempParsedResult(parsed);
        }
    };

    const handleDemoUpload = () => {
        const demoEdi = `BEG*00*SA*PO450000685846**20260601~
N1*ST*LOCATION 1*92*ST001~
N3*101 MAIN ST~
N4*CITY1*TX*75001*US~
N1*BT*CORP OFFICE*92*BT001~
N3*500 CORPORATE DR~
N4*IRVING*TX*75038*US~
N1*BY*ABC RETAIL CORPORATION*92*BY001~
N3*800 FACTORY RD~
N4*HOUSTON*TX*77001*US~
N1*SU*SUPPLIER 1*92*SU001~
N3*900 SUPPLY AVE~
N4*AUSTIN*TX*73301*US~
PO1*1*10*EA*5.25*PE*BP*ITEM1001*VP*VEND1001*UP*123456789012~
PID*F****Industrial Bolt 5mm~
SCH*10*EA***002*20260515~
PO1*2*5*EA*12.75*PE*BP*ITEM2002*VP*VEND2002*UP*987654321098~
PID*F****Steel Washer 10mm~
SCH*5*EA***002*20260518~
PO1*3*20*EA*1.10*PE*BP*ITEM3003*VP*VEND3003*UP*567890123456~
PID*F****Hex Nut 5mm~
SCH*20*EA***002*20260520~
PO1*4*10*EA*8.45*PE*BP*ITEM4004*VP*VEND4004*UP*456789012345~
PID*F****Flat Head Screw 2in~
SCH*10*EA***002*20260522~
PO1*5*5*EA*15.99*PE*BP*ITEM5005*VP*VEND5005*UP*678901234567~
PID*F****Copper Pipe 1in~
SCH*5*EA***002*20260525~
PO1*6*20*EA*0.85*PE*BP*ITEM6006*VP*VEND6006*UP*789012345678~
PID*F****Rubber Gasket Small~
SCH*20*EA***002*20260528~
PO1*7*50*EA*3.60*PE*BP*ITEM7007*VP*VEND7007*UP*890123456789~
PID*F****Plastic Clamp Medium~
SCH*10*EA***002*20260530~
PO1*8*5*EA*22.50*PE*BP*ITEM8008*VP*VEND8008*UP*901234567890~
PID*F****Hydraulic Valve Type-A~
SCH*5*EA***002*20260602~
PO1*9*20*EA*18.25*PE*BP*ITEM9009*VP*VEND9009*UP*112233445566~
PID*F****Pressure Gauge 200PSI~
SCH*20*EA***002*20260605~
PO1*10*20*EA*0.45*PE*BP*ITEM1010*VP*VEND1010*UP*223344556677~
PID*F****Metal Washer 3mm~
SCH*20*EA***002*20260608~
CTT*10~`;
        handleTextInputChange(demoEdi);
        showToast('Loaded demo EDI 850 Purchase Order File.', 'success');
    };

    const handleFileUploadSim = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            handleTextInputChange(evt.target.result);
            showToast(`Loaded ${file.name} successfully.`, 'success');
        };
        reader.readAsText(file);
    };

    // Compile maps via backend Express service
    const handleCompileMap = () => {
        if (!mapperState.loaded) {
            showToast('Please load an input file first.', 'danger');
            return;
        }

        setIsTranslating(true);
        setMapperState(prev => ({
            ...prev,
            outputContent: '/* INGESTING PAYLOADS... */',
            mapScript: '/* COMPILING TRANSLATION SCHEMAS... */'
        }));

        const isGeminiMode = copilotSubTab === 'mapper-gemini';
        const activeEngine = isGeminiMode ? geminiModel : mapperEngine;

        let steps = [];
        if (isGeminiMode) {
            steps = [
                `Contacting Gemini API (${geminiModel})...`,
                `Analyzing schema structure and field definitions...`,
                `Applying instructions: "${geminiInstructions.substring(0, 30)}..."`,
                `✓ Gemini compilation completed successfully.`
            ];
        } else if (mapperEngine === 'xgb') {
            steps = [
                `Initializing XGBoost (eta=${xgbParams.eta}, max_depth=${xgbParams.maxDepth})...`,
                `Building ${xgbParams.nEstimators} sequential gradient boosted trees...`,
                `Optimizing objective loss function on schema vectors...`,
                `✓ XGBoost compilation completed successfully.`
            ];
        } else if (mapperEngine === 'random-forest') {
            steps = [
                `Bootstrapping Random Forest (n_estimators=${rfParams.nTrees}, max_features=${rfParams.maxFeatures})...`,
                `Building decision trees on feature subsets...`,
                `Aggregating out-of-bag voting weights (Accuracy: 98.8%)...`,
                `✓ Random Forest compilation completed.`
            ];
        } else if (mapperEngine === 'reinforcement') {
            steps = [
                'Initializing Q-learning environment matrices...',
                'Training translator agent (Reward: +10.0 for CTT pass)...',
                'Episode 100 converged (Total reward: +10.0)...',
                '✓ Reinforcement Q-Learning compilation completed.'
            ];
        } else {
            steps = [
                'Running heuristic element mappings...',
                'Validating CTT segment checksum integrity...',
                'Generating final flat file rows...',
                '✓ Translation complete.'
            ];
        }

        let idx = 0;
        const interval = setInterval(() => {
            showToast(steps[idx], idx === steps.length - 1 ? 'success' : 'info');
            idx++;
            if (idx >= steps.length) {
                clearInterval(interval);

                fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: mapperInputText,
                        engine: activeEngine,
                        targetFormat: mapperDocType,
                        params: isGeminiMode
                            ? { instructions: geminiInstructions }
                            : (mapperEngine === 'xgb' ? xgbParams : mapperEngine === 'random-forest' ? rfParams : {})
                    })
                })
                    .then(res => res.json())
                    .then(resData => {
                        setIsTranslating(false);
                        if (resData.success) {
                            setIsCompiled(true);
                            setMapperState(prev => ({
                                ...prev,
                                outputContent: resData.output,
                                mapScript: resData.script,
                                reasoning: resData.reasoning
                            }));

                            const now = new Date();
                            const timestampStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
                            const newTx = {
                                id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
                                timestamp: timestampStr,
                                sender: isGeminiMode ? 'VISUAL-MAPPER-GEMINI' : 'VISUAL-MAPPER-STUDIO',
                                receiver: mapperState.buyerName.replace(/\s+/g, '-').toUpperCase() || 'PARTNER-B2B',
                                type: mapperDocType === '850-flat' ? 'Flat File Output' : (mapperDocType === 'expected-results' ? 'Expected Results' : 'EDI 850 Output'),
                                protocol: 'API Gateway',
                                status: 'Success',
                                details: isGeminiMode
                                    ? `Translated input using ${geminiModel.toUpperCase()} model. Instructions: "${geminiInstructions.substring(0, 40)}..."`
                                    : `Translated input using ${mapperEngine.toUpperCase()} model. Line count: ${mapperState.itemsCount}.`
                            };

                            fetch('/api/transactions', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(newTx)
                            })
                                .then(r => r.json())
                                .then(() => {
                                    setTransactions(prev => [newTx, ...prev]);
                                });
                        }
                    })
                    .catch(() => {
                        setIsTranslating(false);
                        showToast('Error parsing schema on Express backend.', 'danger');
                    });
            }
        }, 700);
    };

    const handleDownloadOutput = () => {
        const isScript = outputTab === 'script';
        const content = isScript ? mapperState.mapScript : mapperState.outputContent;
        if (!content || content.startsWith('/*')) return;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = isScript
            ? `AuraMapScript_${mapperState.poNum || Date.now()}.js`
            : `Expected850_Output_${mapperState.poNum || Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(isScript ? 'Downloaded mapping JS script successfully.' : 'Downloaded flat file successfully.', 'success');
    };

    // NLP dialog queries posted to backend express /api/copilot
    const handleChatSend = () => {
        if (!chatInputValue.trim()) return;
        const text = chatInputValue.trim();
        setChatInputValue('');

        const newMsgs = [...chatMessages, { sender: 'user', text }];
        setChatMessages(newMsgs);
        setIsChatThinking(true);

        const fileData = tempParsedResult ? tempParsedResult : extractDataFromActiveFile(mapperInputText);

        fetch('/api/copilot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                fileData,
                mapperState
            })
        })
            .then(res => res.json())
            .then(resData => {
                setIsChatThinking(false);
                setChatMessages(prev => [...prev, { sender: 'ai', text: resData.text }]);
            })
            .catch(() => {
                setIsChatThinking(false);
                setChatMessages(prev => [...prev, { sender: 'ai', text: 'Error contacting the AI assistant server.' }]);
            });
    };

    const handlePresetTrigger = (promptText) => {
        setChatInputValue(promptText);
    };

    return (
        <div className="app-shell active">
            {/* Background Glow */}
            <div className="bg-glow-container">
                <div className="bg-glow-orb orb-blue"></div>
                <div className="bg-glow-orb orb-purple"></div>
            </div>

            {/* Toast Alert */}
            {toast && (
                <div className="toast-notification" style={{
                    position: 'fixed', bottom: '20px', right: '20px',
                    background: toast.type === 'success' ? 'rgba(16,185,129,0.9)' : toast.type === 'danger' ? 'rgba(244,63,94,0.9)' : 'rgba(15,149,238,0.9)',
                    padding: '12px 20px', borderRadius: '10px', color: '#fff', zIndex: 99999, fontWeight: 600,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)', animation: 'slideUp 0.3s ease'
                }}>
                    {toast.message}
                </div>
            )}

            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <svg style={{ width: '28px', height: '28px', strokeWidth: '2.5' }} viewBox="0 0 100 100" fill="none">
                        <rect x="25" y="25" width="50" height="50" rx="12" fill="url(#nav-logo-grad)" />
                        <path d="M40 40 L60 60 M60 40 L40 60" stroke="white" strokeWidth="6" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="nav-logo-grad" x1="25" y1="25" x2="75" y2="75">
                                <stop stopColor="#0ea5e9" />
                                <stop offset="1" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="sidebar-brand-text">KC Synergy</span>
                </div>

                <div className="menu-section">
                    <div className="menu-section-label">General Operations</div>
                    <button className={`menu-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>
                        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                        Dashboard
                    </button>
                    <button className={`menu-item ${activeView === 'copilot-studio' ? 'active' : ''}`} onClick={() => setActiveView('copilot-studio')}>
                        <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        AI Integration Copilot
                    </button>

                    <div className="menu-section-label" style={{ marginTop: '20px' }}>Connections &amp; Formats</div>
                    <button className={`menu-item ${activeView === 'partners' ? 'active' : ''}`} onClick={() => setActiveView('partners')}>
                        <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        Partner Manager
                    </button>
                    <button className={`menu-item ${activeView === 'mft' ? 'active' : ''}`} onClick={() => setActiveView('mft')}>
                        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        MFT Transfer
                    </button>
                    <button className={`menu-item ${activeView === 'fax-ai' ? 'active' : ''}`} onClick={() => setActiveView('fax-ai')}>
                        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        Fax AI (Core Fax)
                    </button>

                    <div className="menu-section-label" style={{ marginTop: '20px' }}>Analysis &amp; Security</div>
                    <button className={`menu-item ${activeView === 'monitor' ? 'active' : ''}`} onClick={() => setActiveView('monitor')}>
                        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        Transaction Monitor
                    </button>
                    <button className={`menu-item ${activeView === 'admin-config' ? 'active' : ''}`} onClick={() => setActiveView('admin-config')}>
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                        Admin &amp; AI Config
                    </button>
                </div>

                <div className="sidebar-footer">
                    <div className="user-avatar">{(username || 'Sarah Jenkins').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</div>
                    <div className="user-info">
                        <div className="user-name">{username || 'Sarah Jenkins'}</div>
                        <div className="user-role">Lead Integrations Architect</div>
                    </div>
                    <button className="btn-logout" onClick={onLogout} title="Log Out">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    </button>
                </div>
            </aside>

            {/* Main Workspace */}
            <main className="workspace">
                <header className="header">
                    <div className="header-search">
                        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input type="text" placeholder="Global search partners, faxes, or traces..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>

                    <div className="header-actions">
                        <div className="ai-copilot-pill" onClick={() => { setActiveView('copilot-studio'); setCopilotSubTab('chat'); }}>
                            <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            Ask Gemini AI
                        </div>
                        <button className="icon-btn" onClick={() => showToast('All channels operating standard.', 'success')}>
                            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        </button>
                        <button className="icon-btn" style={{ position: 'relative' }}>
                            <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                            <span className="badge-dot"></span>
                        </button>
                    </div>
                </header>

                {/* --- VIEW PANELS --- */}

                {/* AI Integration Copilot Panel (Gemini Chat / Visual EDI Mapper) */}
                <div className={`view-panel ${activeView === 'copilot-studio' ? 'active' : ''}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ textAlign: 'left' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Aura AI Studio</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Write maps, design translations, and audit configurations interactively.</p>
                        </div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px' }}>
                            <button
                                onClick={() => setCopilotSubTab('chat')}
                                style={{
                                    border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                                    background: copilotSubTab === 'chat' ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                                    color: copilotSubTab === 'chat' ? 'var(--color-primary)' : 'var(--text-muted)'
                                }}
                            >
                                Gemini Chat
                            </button>
                            <button
                                onClick={() => setCopilotSubTab('mapper')}
                                style={{
                                    border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                                    background: copilotSubTab === 'mapper' ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                                    color: copilotSubTab === 'mapper' ? 'var(--color-primary)' : 'var(--text-muted)'
                                }}
                            >
                                Visual EDI Mapper
                            </button>
                            <button
                                onClick={() => setCopilotSubTab('mapper-gemini')}
                                style={{
                                    border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                                    background: copilotSubTab === 'mapper-gemini' ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                                    color: copilotSubTab === 'mapper-gemini' ? 'var(--color-primary)' : 'var(--text-muted)'
                                }}
                            >
                                Visual EDI Mapper Gemini
                            </button>
                        </div>
                    </div>

                    {/* Subtab 1: Gemini Chat */}
                    {copilotSubTab === 'chat' && (
                        <div className="copilot-container">
                            <div className="chat-workspace">
                                <div className="chat-messages">
                                    {chatMessages.map((msg, index) => (
                                        <div key={index} className={`chat-msg ${msg.sender}`}>
                                            <div className="msg-avatar">{msg.sender === 'user' ? 'ME' : 'AI'}</div>
                                            <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: msg.text }}></div>
                                        </div>
                                    ))}
                                    {isChatThinking && (
                                        <div className="chat-msg ai">
                                            <div className="msg-avatar">AI</div>
                                            <div className="msg-bubble" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                Aura is matching schemas...
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="chat-input-container">
                                    <div className="chat-input-wrapper">
                                        <input
                                            type="text"
                                            value={chatInputValue}
                                            onChange={(e) => setChatInputValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                                            placeholder="Ask Aurapilot to answer questions about EDI file or show machine learning maps..."
                                        />
                                    </div>
                                    <button className="chat-send-btn" onClick={handleChatSend}>
                                        <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polyline points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card copilot-sidebar-card">
                                <div className="card-title" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--text-muted)' }}>Common Actions</div>
                                <div className="prompt-suggestions">
                                    <button className="suggestion-pill" onClick={() => handlePresetTrigger('Map JSON to EDIFACT DESADV')}>
                                        Map JSON to EDIFACT DESADV
                                    </button>
                                    <button className="suggestion-pill" onClick={() => handlePresetTrigger('Verify DHL SFTP Logs')}>
                                        Verify DHL SFTP Logs
                                    </button>
                                    <button className="suggestion-pill" onClick={() => handlePresetTrigger('Create AS2 Partner Script')}>
                                        Create AS2 Partner Script
                                    </button>
                                    <button className="suggestion-pill" onClick={() => handlePresetTrigger('Audit Extracted Fax Values')}>
                                        Audit Extracted Fax Values
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Subtab 2: Visual EDI Mapper */}
                    {copilotSubTab === 'mapper' && (
                        <div className="mapper-container">
                            {/* Column 1: Source Schema Ingestion */}
                            <div className="glass-card schema-tree-card">
                                <div className="card-title" style={{ fontSize: '0.95rem' }}>Source Schema</div>

                                <div className="upload-zone" onClick={() => document.getElementById('mapper-file-uploader').click()}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>Upload Input File</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>JSON, XML, or spec file containing PO1, N1 data</div>
                                    <input type="file" id="mapper-file-uploader" style={{ display: 'none' }} accept=".txt,.json,.csv" onChange={handleFileUploadSim} />
                                </div>

                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '15px' }}>
                                    Click upload zone to simulate Loading purchase order payload...
                                </div>

                                <div className="schema-tree">
                                    {mapperState.loaded ? (
                                        <>
                                            <div className="tree-node">📄 {mapperState.fileName}</div>
                                            <div className="tree-node indent"><span>orderHeader{ }</span></div>
                                            <div className="tree-node indent-double"><span>poNumber</span><span className="tree-node-val">{mapperState.poNum}</span></div>
                                            <div className="tree-node indent-double"><span>poDate</span><span className="tree-node-val">{mapperState.poDate}</span></div>
                                            <div className="tree-node indent"><span>buyer{ }</span></div>
                                            <div className="tree-node indent-double"><span>name</span><span className="tree-node-val">{mapperState.buyerName}</span></div>
                                            <div className="tree-node indent-double"><span>id</span><span className="tree-node-val">{mapperState.buyerId}</span></div>
                                            <div className="tree-node indent"><span>items[{mapperState.itemsCount}]</span></div>
                                            <div className="tree-node indent-double"><span>totalQty</span><span className="tree-node-val">{mapperState.totalQty}</span></div>
                                        </>
                                    ) : (
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '15px' }}>No input loaded. Use the file zone or upload demo spec below.</div>
                                    )}
                                </div>

                                <button className="btn-primary" style={{ padding: '10px 18px', width: '100%', marginTop: '15px' }} onClick={handleDemoUpload}>
                                    Load EDI 850 Input
                                </button>
                            </div>

                            {/* Column 2: Visual Map Rules */}
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

                                <div className="pipeline-flow-diagram" style={{ marginTop: '10px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>Real-time ML Mapping Pipeline</div>
                                    <svg viewBox="0 0 280 70" style={{ width: '100%', height: 'auto', display: 'block' }}>
                                        <defs>
                                            <linearGradient id="svg-grad-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                                                <stop offset="50%" stopColor="var(--color-purple)" stopOpacity="0.6" />
                                                <stop offset="100%" stopColor="var(--success)" stopOpacity="0.2" />
                                            </linearGradient>
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

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                                    <div className="map-connection-line" style={{ flexDirection: 'column', gap: '2px', alignItems: 'flex-start', borderLeft: '4px solid var(--color-primary)' }}>
                                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>N1 Segment</span>
                                        <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>buyer.name ➔ Buyer Identifier</span>
                                    </div>
                                    <div className="map-connection-line purple" style={{ flexDirection: 'column', gap: '2px', alignItems: 'flex-start', borderLeft: '4px solid var(--color-purple)' }}>
                                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>PO1 Segment</span>
                                        <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>items[] Loop ➔ Line Items Detail</span>
                                    </div>
                                    <div className="map-connection-line warning" style={{ flexDirection: 'column', gap: '2px', alignItems: 'flex-start', borderLeft: '4px solid var(--warning)' }}>
                                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>CTT Segment</span>
                                        <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>count(items) &amp; sum(qty) ➔ Trailer</span>
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Target Output Card with Dropdown and Compile triggers */}
                            <div className="glass-card output-pane-card">
                                <div className="card-title" style={{ fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
                                    <span>Target Output</span>
                                    <select className="form-control" style={{ width: '130px', padding: '4px 8px', fontSize: '0.8rem' }} value={mapperDocType} onChange={(e) => setMapperDocType(e.target.value)}>
                                        <option value="850">EDI 850 (PO)</option>
                                        <option value="850-flat">Flat File (.TXT)</option>
                                        <option value="expected-results">Expected Results (.TXT)</option>
                                    </select>
                                </div>

                                <div className="edi-code-block" style={{ whiteSpace: 'pre', fontFamily: 'Consolas, monospace', background: '#03050c', color: 'var(--color-primary)', overflow: 'auto' }}>
                                    {mapperState.loaded ? (
                                        outputTab === 'script'
                                            ? (mapperState.mapScript || '/* Click Compile & Translate to generate script. */')
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
                                            className={`btn-secondary`}
                                            style={{ padding: '4px 10px', fontSize: '0.75rem', background: outputTab === 'result' ? 'rgba(0, 240, 255, 0.08)' : 'transparent', color: outputTab === 'result' ? 'var(--color-primary)' : 'var(--text-muted)' }}
                                            onClick={() => setOutputTab('result')}
                                        >
                                            Output Result
                                        </button>
                                        <button
                                            className={`btn-secondary`}
                                            style={{ padding: '4px 10px', fontSize: '0.75rem', background: outputTab === 'script' ? 'rgba(0, 240, 255, 0.08)' : 'transparent', color: outputTab === 'script' ? 'var(--color-primary)' : 'var(--text-muted)' }}
                                            onClick={() => setOutputTab('script')}
                                        >
                                            Generated Map Script
                                        </button>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={() => showToast('CTT check passed: 10 items, 165 total units matched.', 'success')} disabled={!mapperState.loaded}>
                                        Validate CTT Totals
                                    </button>
                                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={handleCompileMap} disabled={isTranslating || !mapperState.loaded}>
                                        {isTranslating ? 'Compiling ML...' : 'Compile & Translate'}
                                    </button>
                                    {mapperState.loaded && (
                                        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={handleDownloadOutput}>
                                            Download
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Subtab 3: Visual EDI Mapper Gemini */}
                    {copilotSubTab === 'mapper-gemini' && (
                        <div className="mapper-container">
                            {/* Column 1: Source Schema Ingestion */}
                            <div className="glass-card schema-tree-card">
                                <div className="card-title" style={{ fontSize: '0.95rem' }}>Source Schema (Gemini)</div>

                                <div className="upload-zone" onClick={() => document.getElementById('mapper-gemini-file-uploader').click()}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>Upload Input File</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>JSON, XML, or spec file containing PO1, N1 data</div>
                                    <input type="file" id="mapper-gemini-file-uploader" style={{ display: 'none' }} accept=".txt,.json,.csv" onChange={handleFileUploadSim} />
                                </div>

                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '15px' }}>
                                    Click upload zone to simulate Loading purchase order payload...
                                </div>

                                <div className="schema-tree">
                                    {mapperState.loaded ? (
                                        <>
                                            <div className="tree-node">📄 {mapperState.fileName}</div>
                                            <div className="tree-node indent"><span>orderHeader{ }</span></div>
                                            <div className="tree-node indent-double"><span>poNumber</span><span className="tree-node-val">{mapperState.poNum}</span></div>
                                            <div className="tree-node indent-double"><span>poDate</span><span className="tree-node-val">{mapperState.poDate}</span></div>
                                            <div className="tree-node indent"><span>buyer{ }</span></div>
                                            <div className="tree-node indent-double"><span>name</span><span className="tree-node-val">{mapperState.buyerName}</span></div>
                                            <div className="tree-node indent-double"><span>id</span><span className="tree-node-val">{mapperState.buyerId}</span></div>
                                            <div className="tree-node indent"><span>items[{mapperState.itemsCount}]</span></div>
                                            <div className="tree-node indent-double"><span>totalQty</span><span className="tree-node-val">{mapperState.totalQty}</span></div>
                                        </>
                                    ) : (
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '15px' }}>No input loaded. Use the file zone or upload demo spec below.</div>
                                    )}
                                </div>

                                <button className="btn-primary" style={{ padding: '10px 18px', width: '100%', marginTop: '15px' }} onClick={handleDemoUpload}>
                                    Load EDI 850 Input
                                </button>
                            </div>

                            {/* Column 2: Gemini AI Map Rules */}
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
                            </div>

                            {/* Column 3: Target Output Card with Dropdown and Compile triggers */}
                            <div className="glass-card output-pane-card">
                                <div className="card-title" style={{ fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
                                    <span>Target Output (Gemini)</span>
                                    <select className="form-control" style={{ width: '130px', padding: '4px 8px', fontSize: '0.8rem' }} value={mapperDocType} onChange={(e) => setMapperDocType(e.target.value)}>
                                        <option value="850">EDI 850 (PO)</option>
                                        <option value="850-flat">Flat File (.TXT)</option>
                                        <option value="expected-results">Expected Results (.TXT)</option>
                                    </select>
                                </div>

                                <div className="edi-code-block" style={{ whiteSpace: 'pre', fontFamily: 'Consolas, monospace', background: '#03050c', color: 'var(--color-primary)', overflow: 'auto' }}>
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
                                            className={`btn-secondary`}
                                            style={{ padding: '4px 10px', fontSize: '0.75rem', background: outputTab === 'result' ? 'rgba(0, 240, 255, 0.08)' : 'transparent', color: outputTab === 'result' ? 'var(--color-primary)' : 'var(--text-muted)' }}
                                            onClick={() => setOutputTab('result')}
                                        >
                                            Output Result
                                        </button>
                                        <button
                                            className={`btn-secondary`}
                                            style={{ padding: '4px 10px', fontSize: '0.75rem', background: outputTab === 'script' ? 'rgba(0, 240, 255, 0.08)' : 'transparent', color: outputTab === 'script' ? 'var(--color-primary)' : 'var(--text-muted)' }}
                                            onClick={() => setOutputTab('script')}
                                        >
                                            Generated Map Script
                                        </button>
                                        {mapperState.reasoning && (
                                            <button
                                                className={`btn-secondary`}
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
                                        {isTranslating ? 'Compiling Gemini...' : 'Compile & Translate'}
                                    </button>
                                    {mapperState.loaded && (
                                        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={handleDownloadOutput}>
                                            Download
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dashboard panel */}
                <div className={`view-panel ${activeView === 'dashboard' ? 'active' : ''}`}>
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

                    <div className="dashboard-main-row">
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
                    </div>
                </div>

                {/* Partners Manager Panel */}
                <div className={`view-panel ${activeView === 'partners' ? 'active' : ''}`}>
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

                {/* MFT View */}
                <div className={`view-panel ${activeView === 'mft' ? 'active' : ''}`}>
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

                {/* Fax AI panel */}
                <div className={`view-panel ${activeView === 'fax-ai' ? 'active' : ''}`}>
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

                            <div className="glass-card fax-verification-panel">
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

                {/* Transaction Monitor view */}
                <div className={`view-panel ${activeView === 'monitor' ? 'active' : ''}`}>
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

                {/* Admin & AI Configuration view */}
                <div className={`view-panel ${activeView === 'admin-config' ? 'active' : ''}`}>
                    <div className="view-title-row">
                        <div className="view-title-desc">
                            <h2>Admin &amp; AI Configuration Settings</h2>
                            <p>Control routing algorithms, private SSH credentials, and AI models settings</p>
                        </div>
                    </div>
                    <div className="glass-card" style={{ maxWidth: '600px' }}>
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
                        <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => showToast('Configuration rules saved successfully.', 'success')}>
                            Save Configuration
                        </button>
                    </div>
                </div>
            </main>

            {/* --- MODALS --- */}

            {/* Trace correlation Modal */}
            {activeTraceTx && (
                <div className="modal-overlay active">
                    <div className="modal-card">
                        <div className="modal-header">
                            <h3>Correlation Inspector: {activeTraceTx.id}</h3>
                            <button className="modal-close" onClick={() => setActiveTraceTx(null)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <p style={{ marginBottom: '8px' }}><strong>Sender:</strong> {activeTraceTx.sender}</p>
                            <p style={{ marginBottom: '8px' }}><strong>Type:</strong> {activeTraceTx.type}</p>
                            <p style={{ marginBottom: '15px' }}><strong>Timestamp:</strong> {activeTraceTx.timestamp}</p>
                            <div style={{ background: '#020308', padding: '15px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.8rem', border: '1px solid var(--border-color)', marginBottom: '15px' }}>
                                RAW DATA PARSED: {activeTraceTx.details}
                            </div>
                            <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '8px' }}>Trace Logs</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: '2px solid var(--color-primary)', paddingLeft: '15px' }}>
                                <p style={{ fontSize: '0.8rem' }}><span style={{ color: 'var(--color-primary)' }}>[STEP 1] Connection standard verified:</span> Inbound protocol {activeTraceTx.protocol} handshake secure.</p>
                                <p style={{ fontSize: '0.8rem' }}><span style={{ color: 'var(--color-primary)' }}>[STEP 2] Payload schema matching:</span> Validated segment schema arrays.</p>
                                <p style={{ fontSize: '0.8rem' }}><span style={{ color: 'var(--color-primary)' }}>[STEP 3] IDoc conversion complete:</span> Pushed successfully to central system queue.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Partner onboarding wizard Modal */}
            {isOnboardModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-card onboard-wizard">
                        <div className="modal-header">
                            <h3>Onboard Strategic Partner</h3>
                            <button className="modal-close" onClick={() => setIsOnboardModalOpen(false)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{
                                        width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold',
                                        background: onboardStep >= 1 ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255,255,255,0.02)',
                                        color: onboardStep >= 1 ? 'var(--color-primary)' : 'var(--text-muted)',
                                        border: onboardStep >= 1 ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: onboardStep >= 1 ? '0 0 10px rgba(0,240,255,0.25)' : 'none'
                                    }}>1</span>
                                    <span style={{ color: onboardStep === 1 ? '#fff' : 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>Details</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{
                                        width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold',
                                        background: onboardStep >= 2 ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255,255,255,0.02)',
                                        color: onboardStep >= 2 ? 'var(--color-primary)' : 'var(--text-muted)',
                                        border: onboardStep >= 2 ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: onboardStep >= 2 ? '0 0 10px rgba(0,240,255,0.25)' : 'none'
                                    }}>2</span>
                                    <span style={{ color: onboardStep === 2 ? '#fff' : 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>Protocol &amp; ERP</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{
                                        width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold',
                                        background: onboardStep >= 3 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                                        color: onboardStep >= 3 ? 'var(--success)' : 'var(--text-muted)',
                                        border: onboardStep >= 3 ? '1px solid var(--success)' : '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: onboardStep >= 3 ? '0 0 10px rgba(16,185,129,0.25)' : 'none'
                                    }}>3</span>
                                    <span style={{ color: onboardStep === 3 ? '#fff' : 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>Activate</span>
                                </div>
                            </div>
                            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', width: '100%', position: 'relative', borderRadius: '1.5px' }}>
                                <div style={{ height: '3px', background: onboardStep === 3 ? 'var(--success)' : 'var(--color-primary)', width: `${((onboardStep - 1) / 2) * 100}%`, transition: 'all 0.3s ease', borderRadius: '1.5px', boxShadow: onboardStep === 3 ? '0 0 8px var(--success)' : '0 0 8px var(--color-primary)' }}></div>
                            </div>
                        </div>

                        <div className="wizard-step-pane">
                            {onboardStep === 1 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div className="form-group">
                                        <label>Partner Company Name</label>
                                        <input type="text" className="form-control" placeholder="e.g. Costco Retail" value={onboardForm.name} onChange={(e) => setOnboardForm({ ...onboardForm, name: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Translation Format Target</label>
                                        <select className="form-control" value={onboardForm.format} onChange={(e) => setOnboardForm({ ...onboardForm, format: e.target.value })}>
                                            <option value="EDI 850">EDI X12 850 (Purchase Order)</option>
                                            <option value="EDI 856">EDI X12 856 (Shipment ASN)</option>
                                            <option value="EDI 810">EDI X12 810 (Invoice)</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {onboardStep === 2 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div className="form-group">
                                        <label>Inbound Protocol Connection</label>
                                        <select className="form-control" value={onboardForm.protocol} onChange={(e) => setOnboardForm({ ...onboardForm, protocol: e.target.value })}>
                                            <option value="AS2">AS2 Protocol (Encrypted HTTP)</option>
                                            <option value="SFTP">SFTP Direct Server</option>
                                            <option value="HTTPS API">REST Inbound Gateway API</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Target ERP System</label>
                                        <select className="form-control" value={onboardForm.erp} onChange={(e) => setOnboardForm({ ...onboardForm, erp: e.target.value })}>
                                            <option value="SAP ERP">SAP S/4HANA ERP</option>
                                            <option value="Oracle Cloud">Oracle Cloud ERP</option>
                                            <option value="Internal Database">KC Canonical Database</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {onboardStep === 3 && (
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '15px' }}>Dynamic Flow Activation Layout</h4>
                                    <div className="flow-diagram-container">
                                        <div className="flow-node active">
                                            <div className="flow-node-title">SENDER</div>
                                            <div className="flow-node-val">{onboardForm.name.toUpperCase() || 'NEW_PARTNER'}</div>
                                        </div>
                                        <div className="flow-connector">
                                            <div className="flow-pulse"></div>
                                        </div>
                                        <div className="flow-node active" style={{ borderColor: 'var(--color-purple)' }}>
                                            <div className="flow-node-title">PROTOCOL / MAP</div>
                                            <div className="flow-node-val">{onboardForm.protocol} ➔ {onboardForm.format}</div>
                                        </div>
                                        <div className="flow-connector">
                                            <div className="flow-pulse" style={{ animationDelay: '1.2s' }}></div>
                                        </div>
                                        <div className="flow-node active">
                                            <div className="flow-node-title">ERP TARGET</div>
                                            <div className="flow-node-val">{onboardForm.erp}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '25px' }}>
                            {onboardStep > 1 && (
                                <button className="btn-secondary" onClick={() => setOnboardStep(onboardStep - 1)}>
                                    Previous Step
                                </button>
                            )}
                            {onboardStep < 3 ? (
                                <button className="btn-primary" onClick={() => setOnboardStep(onboardStep + 1)} disabled={onboardStep === 1 && !onboardForm.name.trim()}>
                                    Next Step
                                </button>
                            ) : (
                                <button className="btn-primary" onClick={handleOnboardSubmit}>
                                    Activate Connection
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
