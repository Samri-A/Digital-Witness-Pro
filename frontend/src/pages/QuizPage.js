import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/apiService';

function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Quiz state
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // FIX 1: Wrap loadQuiz in useCallback and define it BEFORE useEffect
  // We include [quizId] in the dependency array so the function updates if the ID changes
  const loadQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getQuiz(quizId);
      setQuiz(response);
      setError(null);
    } catch (err) {
      setError('Failed to load quiz: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  // FIX 2: Add loadQuiz to the dependency array
  useEffect(() => {
    loadQuiz(); 
  }, [loadQuiz]);

  const handleChoiceSelect = (questionId, choiceId) => {
    if (submitted) return; // Can't change answers after submission
    
    setAnswers({
      ...answers,
      [questionId]: choiceId
    });
  };

  const handleSubmit = async () => {
    // Validate all questions answered
    if (Object.keys(answers).length !== quiz.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      
      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([questionId, choiceId]) => ({
        questionId,
        choiceId
      }));

      const response = await apiService.submitQuiz(quizId, formattedAnswers);
      setResults(response);
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit quiz: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="loading">
        <p>⏳ Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="alert alert-error">
          {error}
        </div>
        <Link to="/quizzes" className="btn btn-secondary">← Back to Quizzes</Link>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="alert alert-error">
        Quiz not found
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/quizzes" className="btn btn-secondary">← Back to Quizzes</Link>
      </div>

      <h1 className="page-title">{quiz.title}</h1>
      <p className="page-description">{quiz.description}</p>

      {/* Show score if submitted */}
      {submitted && results && (
        <div className="card" style={{ background: '#eef2ff', textAlign: 'center' }}>
          <div className="score-display">
            {results.score}
          </div>
          <p style={{ fontSize: '1.2rem', color: '#4a5568' }}>
            You got {results.correctCount} out of {results.totalQuestions} questions correct!
          </p>
        </div>
      )}

      {/* Quiz Questions */}
      {quiz.questions.map((question, qIndex) => {
        const userAnswerId = answers[question.id];
        const result = submitted ? results.results.find(r => r.questionId === question.id) : null;
        
        return (
          <div key={question.id} className="quiz-question">
            <h3 style={{ marginBottom: '0.5rem' }}>
              Question {qIndex + 1} of {quiz.questions.length}
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              {question.text}
            </p>

            {question.imageUrl && (
              <img 
                src={question.imageUrl} 
                alt="Question" 
                style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '1rem' }}
              />
            )}

            <div className="quiz-choices">
              {question.choices.map((choice) => {
                const isSelected = userAnswerId === choice.id;
                const isCorrect = submitted && result && choice.id === result.correctChoiceId;
                const isIncorrect = submitted && result && isSelected && choice.id !== result.correctChoiceId;
                
                let buttonClass = 'choice-button';
                if (submitted) {
                  if (isCorrect) buttonClass += ' correct';
                  else if (isIncorrect) buttonClass += ' incorrect';
                } else if (isSelected) {
                  buttonClass += ' selected';
                }

                return (
                  <button
                    key={choice.id}
                    className={buttonClass}
                    onClick={() => handleChoiceSelect(question.id, choice.id)}
                    disabled={submitted}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {submitted && isCorrect && <span>✅</span>}
                      {submitted && isIncorrect && <span>❌</span>}
                      <span>{choice.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Show explanation after submission */}
            {submitted && result && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: result.isCorrect ? '#f0fff4' : '#fff5f5',
                borderRadius: '8px',
                borderLeft: `4px solid ${result.isCorrect ? '#48bb78' : '#f56565'}`
              }}>
                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                  {result.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                </p>
                {!result.isCorrect && (
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Correct answer:</strong> {result.correctChoiceText}
                  </p>
                )}
                <p><strong>Explanation:</strong> {result.explanation}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Submit/Retake Buttons */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        {!submitted ? (
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length !== quiz.questions.length}
            style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
          >
            {submitting ? 'Submitting...' : 'Submit Answers'}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleRetake}
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            >
              🔄 Retake Quiz
            </button>
            <Link 
              to="/quizzes" 
              className="btn btn-secondary"
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            >
              View All Quizzes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
