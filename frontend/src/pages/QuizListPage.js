import React, { useState, useEffect, useCallback } from 'react'; // <-- Import useCallback
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';

function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIX: Wrap loadQuizzes in useCallback
  const loadQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getQuizzes();
      setQuizzes(response.quizzes);
      setError(null);
    } catch (err) {
      setError('Failed to load quizzes: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array as it uses no external variables

  // FIX: Add loadQuizzes to the dependency array
  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]); // Now loadQuizzes is a stable dependency

// ... rest of the code is unchanged and safe

  if (loading) {
    return (
      <div className="loading">
        <p>⏳ Loading quizzes...</p>
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
    <div className="quiz-list-page">
      <h1 className="page-title">🎓 Educational Quizzes</h1>
      <p className="page-description">
        Test your knowledge about online safety and abuse recognition. 
        Learn how to identify different types of abuse and protect yourself online.
      </p>

      {quizzes.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>
            No quizzes available yet.
          </p>
        </div>
      ) : (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <Link 
              key={quiz.id} 
              to={`/quiz/${quiz.id}`}
              className="quiz-card"
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#2d3748' }}>
                {quiz.title}
              </h2>
              <p style={{ color: '#718096', marginBottom: '1rem', lineHeight: '1.6' }}>
                {quiz.description}
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                <span style={{ color: '#667eea', fontWeight: '500' }}>
                  {quiz.questionCount} Questions
                </span>
                <span style={{ color: '#667eea', fontWeight: '500' }}>
                  Take Quiz →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="card" style={{ marginTop: '2rem', background: '#eef2ff' }}>
        <h2 className="card-title">💡 Why Take These Quizzes?</h2>
        <ul style={{ lineHeight: '1.8', paddingLeft: '1.5rem' }}>
          <li>Learn to recognize different types of online abuse</li>
          <li>Understand how to properly document evidence</li>
          <li>Know when and how to report incidents</li>
          <li>Protect yourself and others from online harm</li>
        </ul>
      </div>
    </div>
  );
}

export default QuizListPage;
