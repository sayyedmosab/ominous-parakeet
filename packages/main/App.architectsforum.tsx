import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArchitectsForumPage from './pages/ArchitectsForumPage';
import SimpleTestPage from './pages/SimpleTestPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AuthCallback from './pages/auth/AuthCallback';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

// Simple test component to verify routing
const TestRoute = () => {
  return (
    <div style={{ padding: '20px', background: 'yellow', minHeight: '100vh' }}>
      <h1>TEST ROUTE WORKING!</h1>
      <p>If you can see this, routing is working correctly.</p>
      <p>The /test route is loading this component instead of SimpleTestPage.</p>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ArchitectsForumPage />} />
              <Route path="/forum" element={<ArchitectsForumPage />} />
              <Route path="/test" element={<TestRoute />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<ArchitectsForumPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;