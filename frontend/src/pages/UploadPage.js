import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

function UploadPage() {
  const navigate = useNavigate();
  
  // Form state
  const [reporterName, setReporterName] = useState('');
  const [notes, setNotes] = useState('');
  const [textContent, setTextContent] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadedFileIds, setUploadedFileIds] = useState([]);
  
  // Classification state
  const [classification, setClassification] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Alert state
  const [alert, setAlert] = useState(null);

  // Hero messages state
  const messages = [
    "You are safe here. Take the first step to protect yourself.",
    "Your voice matters. Your safety matters.",
    "Every story deserves to be heard. Every incident deserves protection.",
    "Digital abuse stops with awareness. Start here, start safe.",
    "One click at a time, one step closer to safety."
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Rotate hero messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prevIndex =>
        prevIndex === messages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  // Upload files to server
  const handleUploadFiles = async () => {
    if (files.length === 0) {
      setAlert({ type: 'error', message: 'Please select at least one file' });
      return;
    }

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('notes', notes);
      formData.append('reporterName', reporterName);
      formData.append('textContent', textContent);

      const response = await apiService.uploadFiles(formData);
      setUploadedFileIds(response.files.map(f => f.id));
      setAlert({ type: 'success', message: `${response.files.length} file(s) uploaded successfully!` });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to upload files: ' + error.message });
    }
  };

  // Classify text content
  const handleClassify = async () => {
    const textToClassify = textContent || notes;
    
    if (!textToClassify || textToClassify.trim().length === 0) {
      setAlert({ type: 'error', message: 'Please provide text content or notes to classify' });
      return;
    }

    setIsClassifying(true);
    setAlert(null);

    try {
      const result = await apiService.classifyText(textToClassify);
      setClassification(result);
      setAlert({ type: 'success', message: 'Text classified successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Classification failed: ' + error.message });
    } finally {
      setIsClassifying(false);
    }
  };

  // Save complete case
  const handleSaveCase = async () => {
    if (!notes || notes.trim().length === 0) {
      setAlert({ type: 'error', message: 'Please provide case notes' });
      return;
    }

    setIsSaving(true);
    setAlert(null);

    try {
      const caseData = {
        reporterName: reporterName || 'Anonymous',
        notes,
        fileIds: uploadedFileIds,
        classification: classification || null,
        occurredAt: new Date().toISOString()
      };

      const response = await apiService.saveCase(caseData);
      setAlert({ type: 'success', message: 'Case saved successfully!' });
      
      // Redirect to case detail page after 2 seconds
      setTimeout(() => {
        navigate(`/case/${response.case.id}`);
      }, 2000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save case: ' + error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="upload-page">
      <h1 className="page-title">Report Abuse</h1>
      <h2 className="text-2xl md:text-4xl font-semibold">
          {messages[currentMessageIndex]}
        </h2>
      <p className="page-description">
        Document and report online abuse safely. Upload evidence files, describe what happened,
        and get AI assistance in classifying the type of abuse.
      </p>

      {/* Alert Messages */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {/* File Upload Section */}
      <div className="card">
        <h2 className="card-title">📁 Upload Evidence Files</h2>
        <div className="form-group">
          <label className="file-input">
            <input 
              type="file" 
              multiple 
              accept="image/*,.pdf,.txt"
              onChange={handleFileChange}
            />
            <div>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📤</p>
              <p>Click to select files or drag and drop</p>
              <p style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem' }}>
                Accepted: Images, PDFs, Text files
              </p>
            </div>
          </label>
          
          {files.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Selected files:</strong></p>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                ))}
              </ul>
              <button className="btn btn-secondary" onClick={handleUploadFiles}>
                Upload Files
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Case Details Section */}
      <div className="card">
        <h2 className="card-title">📝 Case Details</h2>
        
        <div className="form-group">
          <label className="form-label">Your Name (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Leave blank to remain anonymous"
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Describe What Happened *</label>
          <textarea
            className="form-textarea"
            placeholder="Provide details about the incident, including dates, usernames, and context..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Text Content to Classify (Optional)</label>
          <textarea
            className="form-textarea"
            placeholder="Paste the actual abusive text here for AI classification..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
          <p style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem' }}>
            If empty, we'll classify based on your notes above.
          </p>
        </div>
      </div>

      {/* Classification Section */}
      <div className="card">
        <h2 className="card-title">🤖 AI Classification</h2>
        <p>Use AI to automatically classify the type of abuse</p>
        
        <button 
          className="btn btn-primary" 
          onClick={handleClassify}
          disabled={isClassifying}
          style={{ marginTop: '1rem' }}
        >
          {isClassifying ? 'Classifying...' : 'Classify Text'}
        </button>

        {classification && (
          <div className="classification-result">
            <span className={`classification-badge badge-${classification.label}`}>
              {classification.label.replace('_', ' ').toUpperCase()}
            </span>
            <p><strong>Confidence:</strong> {(classification.confidence * 100).toFixed(1)}%</p>
            <p><strong>Explanation:</strong> {classification.explanation}</p>
            {classification.evidence && classification.evidence.length > 0 && (
              <div>
                <p><strong>Evidence:</strong></p>
                <ul>
                  {classification.evidence.map((item, index) => (
                    <li key={index}><em>"{item}"</em></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Case Button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleSaveCase}
          disabled={isSaving || !notes}
          style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
        >
          {isSaving ? 'Saving...' : '💾 Save Case'}
        </button>
      </div>
    </div>
  );
}

export default UploadPage;
