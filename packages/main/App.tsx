import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import HomePage from './pages/HomePage';
// Import Architect app from workspace package
import ArchitectLessonsPage from './pages/ArchitectLessonsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import JosoorPage from './pages/josoor/JosoorPage';
import JosoorVisionPage from './pages/josoor/JosoorVisionPage';
import JosoorExplorePage from './pages/josoor/JosoorExplorePage';
import JosoorExploreSystemsPage from './pages/josoor/JosoorExploreSystemsPage';
import JosoorExperiencePage from './pages/josoor/JosoorExperiencePage';
import JosoorExperienceAnalyticsPage from './pages/josoor/JosoorExperienceAnalyticsPage';
import JosoorExecutePage from './pages/josoor/JosoorExecutePage';
import JosoorExecuteUseCasesPage from './pages/josoor/JosoorExecuteUseCasesPage';
import SketchAppPage from './pages/sketchapp/SketchAppPage';
import SketchAppDesignerPage from './pages/sketchapp/SketchAppDesignerPage';
import AuraPage from './pages/aura/AuraPage';
import AuraProjectManagerPage from './pages/aura/AuraProjectManagerPage';
import WeatherMapPage from './pages/WeatherMapPage';

const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <main className="flex-grow">
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
            
            {/* Josoor Routes */}
            <Route path="/josoor" element={<JosoorPage />} />
            <Route path="/josoor/vision" element={<JosoorVisionPage />} />
            <Route path="/josoor/explore/architect" element={<JosoorExplorePage />} />
            <Route path="/josoor/explore/systems" element={<JosoorExploreSystemsPage />} />
            <Route path="/josoor/experience/noor" element={<JosoorExperiencePage />} />
            <Route path="/josoor/experience/analytics" element={<JosoorExperienceAnalyticsPage />} />
            <Route path="/josoor/execute/journey" element={<JosoorExecutePage />} />
            <Route path="/josoor/execute/use-cases" element={<JosoorExecuteUseCasesPage />} />

            {/* SketchApp Routes */}
            <Route path="/sketchapp" element={<SketchAppPage />} />
            <Route path="/sketchapp/designer" element={
              <ProtectedRoute>
                <SketchAppDesignerPage />
              </ProtectedRoute>
            } />

            {/* Architect Lessons Integration */}
            <Route path="/architect" element={<ArchitectLessonsPage />} />

            {/* Aura Routes */}
            <Route path="/aura" element={<AuraPage />} />
            <Route path="/aura/projectmanager" element={
              <ProtectedRoute>
                <AuraProjectManagerPage />
              </ProtectedRoute>
            } />

            {/* Weather Map Route */}
            <Route path="/weathermap" element={<WeatherMapPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;