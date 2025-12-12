import axios from 'axios';

// Base API URL - uses proxy in package.json for development
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API Service
 * Handles all communication with backend API
 */

const apiService = {
  // =============================================================================
  // UPLOAD ENDPOINTS
  // =============================================================================

  /**
   * Upload files
   * @param {FormData} formData - Form data containing files and metadata
   */
  uploadFiles: async (formData) => {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get file URL
   * @param {string} fileId - File ID
   */
  getFileUrl: (fileId) => {
    return `${API_BASE_URL}/uploads/${fileId}`;
  },

  // =============================================================================
  // CLASSIFICATION ENDPOINTS
  // =============================================================================

  /**
   * Classify text content
   * @param {string} text - Text to classify
   * @param {string} caseId - Optional case ID to update
   */
  classifyText: async (text, caseId = null) => {
    const response = await api.post('/classifyText', { text, caseId });
    return response.data;
  },

  // =============================================================================
  // CASE ENDPOINTS
  // =============================================================================

  /**
   * Save a new case
   * @param {Object} caseData - Case data
   */
  saveCase: async (caseData) => {
    const response = await api.post('/saveCase', caseData);
    return response.data;
  },

  /**
   * Get all cases
   */
  getCases: async () => {
    const response = await api.get('/getCases');
    return response.data;
  },

  /**
   * Get specific case details
   * @param {string} caseId - Case ID
   */
  getCase: async (caseId) => {
    const response = await api.get(`/getCase/${caseId}`);
    return response.data;
  },

  /**
   * Generate PDF report for a case
   * @param {string} caseId - Case ID
   */
  generatePDF: async (caseId) => {
    const response = await api.post('/generatePDF', { caseId }, {
      responseType: 'blob', // Important for downloading files
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `case-report-${caseId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  },

  // =============================================================================
  // QUIZ ENDPOINTS
  // =============================================================================

  /**
   * Get all available quizzes
   */
  getQuizzes: async () => {
    const response = await api.get('/getQuizzes');
    return response.data;
  },

  /**
   * Get specific quiz
   * @param {string} quizId - Quiz ID
   */
  getQuiz: async (quizId) => {
    const response = await api.get(`/getQuiz?quizId=${quizId}`);
    return response.data;
  },

  /**
   * Submit quiz answers
   * @param {string} quizId - Quiz ID
   * @param {Array} answers - Array of {questionId, choiceId}
   */
  submitQuiz: async (quizId, answers) => {
    const response = await api.post('/submitQuiz', { quizId, answers });
    return response.data;
  },

  // =============================================================================
  // HEALTH CHECK
  // =============================================================================

  /**
   * Check API health
   */
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default apiService;
