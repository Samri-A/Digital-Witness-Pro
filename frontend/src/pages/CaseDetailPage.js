import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/apiService';

function CaseDetailPage() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // FIX: Wrap loadCase in useCallback and define it BEFORE useEffect
  const loadCase = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getCase(caseId);
      setCaseData(response.case);
      setError(null);
    } catch (err) {
      setError('Failed to load case: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [caseId]); // Only recreate function if caseId changes

  useEffect(() => {
    loadCase();
  }, [loadCase]);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      await apiService.generatePDF(caseId);
      // PDF download is handled by the service
    } catch (err) {
      alert('Failed to generate PDF: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <p>⏳ Loading case details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="alert alert-error">
          {error}
        </div>
        <Link to="/dashboard" className="btn btn-secondary">← Back to Dashboard</Link>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="alert alert-error">
        Case not found
      </div>
    );
  }

  return (
    <div className="case-detail-page">
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/dashboard" className="btn btn-secondary">← Back to Dashboard</Link>
      </div>

      <h1 className="page-title">Case Details</h1>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ color: '#718096', marginBottom: '0.5rem' }}>
              Case ID: <strong>{caseData.id}</strong>
            </p>
            {caseData.reporterName && (
              <p style={{ color: '#718096' }}>
                Reporter: <strong>{caseData.reporterName}</strong>
              </p>
            )}
          </div>
          
          <button 
            className="btn btn-success" 
            onClick={handleDownloadPDF}
            disabled={downloading}
          >
            {downloading ? '⏳ Generating...' : '📄 Download PDF Report'}
          </button>
        </div>

        {caseData.occurredAt && (
          <p style={{ color: '#718096', marginBottom: '0.5rem' }}>
            Occurred: <strong>{formatDate(caseData.occurredAt)}</strong>
          </p>
        )}
        
        <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
          Reported: <strong>{formatDate(caseData.createdAt)}</strong>
        </p>

        {caseData.classificationLabel && (
          <div style={{ marginBottom: '1.5rem' }}>
            <span className={`classification-badge badge-${caseData.classificationLabel}`}>
              {caseData.classificationLabel.replace('_', ' ').toUpperCase()}
            </span>
            {caseData.classificationConfidence && (
              <span style={{ marginLeft: '1rem', color: '#718096' }}>
                Confidence: {(caseData.classificationConfidence * 100).toFixed(1)}%
              </span>
            )}
          </div>
        )}

        {caseData.classificationExplanation && (
          <div className="classification-result" style={{ marginBottom: '1.5rem' }}>
            <strong>AI Explanation:</strong>
            <p>{caseData.classificationExplanation}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">📝 Case Notes</h2>
        <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {caseData.notes}
        </p>
      </div>

      {caseData.files && caseData.files.length > 0 && (
        <div className="card">
          <h2 className="card-title">📎 Evidence Files ({caseData.files.length})</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {caseData.files.map((file) => (
              <div 
                key={file.id} 
                style={{ 
                  padding: '1rem', 
                  background: '#f7fafc', 
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {file.filename}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#718096' }}>
                    {file.mimetype} • Uploaded {formatDate(file.uploadedAt)}
                  </p>
                </div>
                <a 
                  href={apiService.getFileUrl(file.id)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseDetailPage;
