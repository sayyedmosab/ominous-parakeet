import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import HomePage from './pages/HomePage';
import ThreeDAnimationPage from './pages/ThreeDAnimationPage';
// Import Architect app from workspace package
import ArchitectLessonsPage from './pages/ArchitectLessonsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import JosoorVisionPage from './pages/josoor/JosoorVisionPage';
import RoadmapPage from './pages/RoadmapPage';
import ArchitectsForumPage from './pages/ArchitectsForumPage';
import SimpleTestPage from './pages/SimpleTestPage';

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

const AppLayout: React.FC = () => {
  return (
    <div className="grid grid-rows-[auto,1fr,auto] h-screen bg-gray-100 text-gray-800">
      <Header />
      <main className="overflow-y-auto min-h-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            

            {/* Main Navigation Routes (existing only) */}
            <Route path="/about" element={<JosoorVisionPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/forum" element={<ArchitectsForumPage />} />
            <Route path="/test" element={<SimpleTestPage />} />
            <Route path="/architect" element={<ArchitectLessonsPage />} />
            <Route path="/3danimation" element={<ThreeDAnimationPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
