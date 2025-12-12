import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';

function DashboardPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCases();
      setCases(response.cases);
      setError(null);
    } catch (err) {
      setError('Failed to load cases: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  //
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <p>⏳ Loading cases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title">📊 Case Dashboard</h1>
      <p className="page-description">
        View and manage all reported cases. Click on any case to see full details and generate reports.
      </p>

      {cases.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>
            No cases reported yet. <Link to="/">Report your first case</Link>
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', color: '#718096' }}>
            <p>Total Cases: <strong>{cases.length}</strong></p>
          </div>

          <div className="cases-grid">
            {cases.map((caseItem) => (
              <Link 
                key={caseItem.id} 
                to={`/case/${caseItem.id}`} 
                className="case-card"
              >
                <div className="case-id">
                  Case ID: {caseItem.id.substring(0, 8)}...
                </div>

                {caseItem.reporterName && (
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>Reporter:</strong> {caseItem.reporterName}
                  </div>
                )}

                {caseItem.classificationLabel && (
                  <span className={`classification-badge badge-${caseItem.classificationLabel}`}>
                    {caseItem.classificationLabel.replace('_', ' ').toUpperCase()}
                  </span>
                )}

                <p className="case-snippet">
                  {caseItem.notesSnippet}
                </p>

                <div className="case-meta">
                  <span>📎 {caseItem.fileCount} file(s)</span>
                  <span>{formatDate(caseItem.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
