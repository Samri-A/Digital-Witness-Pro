import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import pages
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import CaseDetailPage from './pages/CaseDetailPage';
import QuizListPage from './pages/QuizListPage';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Header */}
        <header className="App-header">
          <div className="container">
            <h1 className="logo">🛡️ Digital Witness Pro</h1>
            <nav className="nav">
              <Link to="/" className="nav-link">Report Abuse</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/quizzes" className="nav-link">Learn & Quiz</Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/case/:caseId" element={<CaseDetailPage />} />
            <Route path="/quizzes" element={<QuizListPage />} />
            <Route path="/quiz/:quizId" element={<QuizPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="App-footer">
          <div className="container">
            <p>© 2024 Digital Witness Pro | Helping document and report online abuse safely</p>
            <p className="disclaimer">This is a demonstration MVP. Always contact local authorities for serious threats.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
