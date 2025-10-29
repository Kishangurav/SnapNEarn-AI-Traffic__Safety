import React, { useState } from 'react';
import { uploadViolationToIPFS } from '../utils/ipfs';
import { addViolation, connectWallet } from '../utils/contract';
import './UploadViolation.css';

const UploadViolation = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [violationType, setViolationType] = useState('No Helmet');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [ipfsCID, setIpfsCID] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);

  const violationTypes = [
    'No Helmet',
    'Red Light Violation',
    'Wrong Lane',
    'Overspeeding',
    'No Seatbelt',
    'Using Phone',
    'Other',
  ];

  const handleConnect = async () => {
    try {
      const account = await connectWallet();
      setConnectedAccount(account.address);
      setUploadStatus(`✅ Connected: ${account.address.slice(0, 6)}...${account.address.slice(-4)}`);
    } catch (error) {
      setUploadStatus(`❌ Connection failed: ${error.message}`);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('❌ Please select an image file');
      return;
    }

    if (!connectedAccount) {
      setUploadStatus('❌ Please connect your wallet first');
      return;
    }

    setIsUploading(true);
    setUploadStatus('⏳ Step 1/3: Uploading image to IPFS...');
    setIpfsCID(null);
    setTransactionHash(null);

    try {
      // Step 1: Upload to IPFS
      const metadata = {
        violationType,
        timestamp: new Date().toISOString(),
        reporter: connectedAccount,
      };

      const { imageCID, imageUrl } = await uploadViolationToIPFS(selectedFile, metadata);
      
      setIpfsCID(imageCID);
      setUploadStatus(`✅ Uploaded to IPFS: ${imageCID}`);

      // Step 2: Add to blockchain
      setUploadStatus('⏳ Step 2/3: Adding to blockchain...');
      const result = await addViolation(imageCID, violationType);

      setTransactionHash(result.transactionHash);
      setUploadStatus(
        `✅ Success! Violation ID: ${result.violationId} | TX: ${result.transactionHash.slice(0, 10)}...`
      );

      // Reset form
      setTimeout(() => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setViolationType('No Helmet');
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`❌ Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-violation-container">
      <div className="upload-card">
        <h2>🚨 Report Traffic Violation</h2>
        <p className="subtitle">Upload evidence to blockchain with IPFS</p>

        {/* Wallet Connection */}
        {!connectedAccount ? (
          <button onClick={handleConnect} className="connect-btn">
            🔌 Connect MetaMask
          </button>
        ) : (
          <div className="connected-badge">
            ✅ Connected: {connectedAccount.slice(0, 6)}...{connectedAccount.slice(-4)}
          </div>
        )}

        {/* File Upload */}
        <div className="upload-section">
          <label htmlFor="file-input" className="file-label">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="preview-image" />
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📸</span>
                <p>Click to select violation image</p>
                <p className="file-hint">JPG, PNG, GIF (Max 10MB)</p>
              </div>
            )}
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
          />
        </div>

        {/* Violation Type */}
        <div className="form-group">
          <label htmlFor="violation-type">Violation Type</label>
          <select
            id="violation-type"
            value={violationType}
            onChange={(e) => setViolationType(e.target.value)}
            className="violation-select"
            disabled={isUploading}
          >
            {violationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || !connectedAccount}
          className="upload-btn"
        >
          {isUploading ? '⏳ Uploading...' : '📤 Upload to Blockchain'}
        </button>

        {/* Status */}
        {uploadStatus && (
          <div className={`status-message ${uploadStatus.startsWith('❌') ? 'error' : 'success'}`}>
            {uploadStatus}
          </div>
        )}

        {/* IPFS CID Display */}
        {ipfsCID && (
          <div className="result-box">
            <h4>📦 IPFS CID</h4>
            <code>{ipfsCID}</code>
            <a
              href={`https://ipfs.io/ipfs/${ipfsCID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="view-link"
            >
              🔗 View on IPFS
            </a>
          </div>
        )}

        {/* Transaction Hash Display */}
        {transactionHash && (
          <div className="result-box">
            <h4>🔗 Transaction Hash</h4>
            <code>{transactionHash}</code>
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="view-link"
            >
              🔍 View on Etherscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadViolation;
