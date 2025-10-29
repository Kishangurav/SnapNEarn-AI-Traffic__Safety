import React, { useState, useEffect } from 'react';
import { getAllViolations, getRecentViolations, getTotalViolations } from '../utils/contract';
import { getIPFSUrl } from '../utils/ipfs';
import './ViewViolations.css';

const ViewViolations = () => {
  const [violations, setViolations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState('recent'); // 'recent' or 'all'
  const [selectedViolation, setSelectedViolation] = useState(null);

  useEffect(() => {
    loadViolations();
  }, [viewMode]);

  const loadViolations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get total count
      const count = await getTotalViolations();
      setTotalCount(count);

      // Load violations based on view mode
      let data;
      if (viewMode === 'all') {
        data = await getAllViolations();
      } else {
        data = await getRecentViolations(10);
      }

      setViolations(data.reverse()); // Show newest first
    } catch (err) {
      console.error('Error loading violations:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleViewImage = (violation) => {
    setSelectedViolation(violation);
  };

  const closeModal = () => {
    setSelectedViolation(null);
  };

  return (
    <div className="view-violations-container">
      <div className="violations-header">
        <div className="header-content">
          <h2>🔍 Blockchain Violation Records</h2>
          <p className="subtitle">
            Decentralized traffic violation database on Ethereum
          </p>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Total Violations</span>
            <span className="stat-value">{totalCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Displayed</span>
            <span className="stat-value">{violations.length}</span>
          </div>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'recent' ? 'active' : ''}`}
            onClick={() => setViewMode('recent')}
          >
            Recent (10)
          </button>
          <button
            className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            All Violations
          </button>
          <button className="refresh-btn" onClick={loadViolations}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading violations from blockchain...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p>Error: {error}</p>
          <button onClick={loadViolations} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && violations.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No Violations Found</h3>
          <p>Be the first to report a traffic violation!</p>
        </div>
      )}

      {!isLoading && !error && violations.length > 0 && (
        <div className="violations-grid">
          {violations.map((violation) => (
            <div key={violation.id} className="violation-card">
              <div className="card-header">
                <span className="violation-id">ID: #{violation.id}</span>
                {violation.verified && (
                  <span className="verified-badge">✅ Verified</span>
                )}
              </div>

              <div
                className="violation-image"
                onClick={() => handleViewImage(violation)}
              >
                <img
                  src={getIPFSUrl(violation.imageHash)}
                  alt={`Violation ${violation.id}`}
                  loading="lazy"
                />
                <div className="image-overlay">
                  <span>🔍 View Full</span>
                </div>
              </div>

              <div className="card-body">
                <div className="violation-type">
                  <span className="type-icon">🚨</span>
                  <span className="type-text">{violation.violationType}</span>
                </div>

                <div className="violation-details">
                  <div className="detail-row">
                    <span className="detail-label">Reporter</span>
                    <a
                      href={`https://sepolia.etherscan.io/address/${violation.reporter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-value link"
                    >
                      {formatAddress(violation.reporter)}
                    </a>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Timestamp</span>
                    <span className="detail-value">
                      {formatDate(violation.timestamp)}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">IPFS CID</span>
                    <a
                      href={getIPFSUrl(violation.imageHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-value link ipfs-cid"
                      title={violation.imageHash}
                    >
                      {violation.imageHash.slice(0, 12)}...
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedViolation && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>

            <img
              src={getIPFSUrl(selectedViolation.imageHash)}
              alt={`Violation ${selectedViolation.id}`}
              className="modal-image"
            />

            <div className="modal-details">
              <h3>
                Violation #{selectedViolation.id} - {selectedViolation.violationType}
              </h3>

              <div className="modal-info">
                <div className="info-item">
                  <strong>Reporter:</strong>
                  <a
                    href={`https://sepolia.etherscan.io/address/${selectedViolation.reporter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedViolation.reporter}
                  </a>
                </div>

                <div className="info-item">
                  <strong>Timestamp:</strong>
                  <span>{formatDate(selectedViolation.timestamp)}</span>
                </div>

                <div className="info-item">
                  <strong>IPFS CID:</strong>
                  <a
                    href={getIPFSUrl(selectedViolation.imageHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedViolation.imageHash}
                  </a>
                </div>

                <div className="info-item">
                  <strong>Status:</strong>
                  <span>
                    {selectedViolation.verified ? '✅ Verified' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewViolations;
