# KC Synergy - Sterling B2B EDI Integration Hub & Aura Translation Studio

KC Synergy is a modern React B2B portal that combines secure file transfer protocols (AS2, SFTP, APIs) with machine learning pipelines (XGBoost, Random Forest, Reinforcement Q-Learning) and generative AI (Gemini 3.5 Flash) to dynamically ingest, compile, and validate trade integrations.

## 🚀 Features

- **Aura AI Studio**: Visual EDI Mapper and interactive Gemini Chat assisting integrations architects.
- **Visual Mapping Pipelines**: High-performance translation compiler with hyperparameter tuners.
- **Partner Manager**: Dynamic onboarding wizard for trade connections (SAP, Oracle, databases).
- **Fax AI OCR Review**: Interactive verification panel displaying OCR extracted parameters.
- **Transaction Monitor**: Correlation logs journey inspector for full audits.
- **Fully Modular**: Structured into individual React components for clean extension.
- **TypeScript Type-Safety**: Strictly typed React architecture.

## 📂 Project Architecture

```
src/
├── components/
│   ├── About.tsx           # Architecture specification details
│   ├── DatabaseViewer.tsx  # Partner and MFT transfers viewer
│   ├── DiagramsDoc.tsx     # Real-time ML and Gemini pipeline diagrams
│   ├── Hero.tsx            # KPI Cards and dashboard summary
│   ├── HistoryLog.tsx      # Transaction table & inspected journeys
│   ├── Home.tsx            # State coordinator & core wrapper layout
│   ├── Login.tsx           # Credentials and SSO sign-on view
│   ├── ModelEvaluator.tsx  # ML parameter controllers & Gemini instructions
│   ├── Navbar.tsx          # Left sidebar view switcher
│   ├── PredictForm.tsx     # EDI & JSON file upload tree display
│   ├── PredictResult.tsx   # Compiled scripts & output files downloader
│   └── ProjectReport.tsx   # Fax AI document validator
├── App.tsx                 # Login/Main view router
├── main.tsx                # Bootstrap React entrypoint
└── index.css               # Premium styling system
```

## 🛠️ Build & Run

### Install Dependencies
```bash
npm install
```

### Dev Server
```bash
npm run dev
```

### Build Production Bundle
```bash
npm run build
```
