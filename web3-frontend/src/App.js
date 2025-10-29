import React, { useState } from 'react';
import UploadViolation from './components/UploadViolation';
import ViewViolations from './components/ViewViolations';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🚨</span>
            <h1>SnapNEarn</h1>
          </div>
          <p className="tagline">Decentralized Traffic Violation Reporting on Ethereum</p>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📤 Upload Violation
          </button>
          <button
            className={`nav-tab ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            🔍 View Records
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'upload' && <UploadViolation />}
        {activeTab === 'view' && <ViewViolations />}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>🔗 Powered by Ethereum + IPFS</p>
          <div className="footer-links">
            <a
              href="https://sepolia.etherscan.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Etherscan
            </a>
            <span>•</span>
            <a href="https://ipfs.io" target="_blank" rel="noopener noreferrer">
              IPFS
            </a>
            <span>•</span>
            <a
              href="https://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              MetaMask
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
