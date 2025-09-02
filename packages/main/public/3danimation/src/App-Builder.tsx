import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BuilderComponent, builder } from '@builder.io/react';
import { RubiksCubeExperience } from './components/RubiksCubeExperience';
import { BuilderPage } from './components/BuilderPage';
import './components/BuilderIntegration'; // Register custom components

// Configure Builder.io
builder.init('YOUR_BUILDER_PUBLIC_KEY'); // Replace with your actual key

// Navigation component
const Navigation = () => {
  const location = useLocation();
  const isExperiencePage = location.pathname === '/experience';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isExperiencePage ? 'bg-black/20 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          to="/" 
          className={`text-xl font-bold ${
            isExperiencePage ? 'text-white' : 'text-gray-900'
          }`}
        >
          Neural Cube
        </Link>
        
        <div className="flex space-x-6">
          <Link 
            to="/" 
            className={`transition-colors ${
              isExperiencePage 
                ? 'text-white/80 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/experience" 
            className={`transition-colors ${
              isExperiencePage 
                ? 'text-cyan-400 hover:text-cyan-300' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            3D Experience
          </Link>
          <Link 
            to="/about" 
            className={`transition-colors ${
              isExperiencePage 
                ? 'text-white/80 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Pure 3D Experience Page
const ExperiencePage = () => {
  return (
    <div className="size-full bg-black min-h-screen">
      <RubiksCubeExperience />
    </div>
  );
};

// Builder.io managed pages
const BuilderManagedPage = ({ path }: { path: string }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    builder
      .get('page', {
        url: path,
        options: {
          includeRefs: true,
        },
      })
      .promise()
      .then((content) => {
        setContent(content);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [path]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!content) {
    // Fallback content if Builder.io page not found
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Neural Transformation Experience
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience the evolution from geometric precision to organic intelligence
          </p>
          <Link 
            to="/experience"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            Start Experience
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <BuilderComponent model="page" content={content} />
    </div>
  );
};

// Main App with routing
export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        
        <Routes>
          {/* Pure 3D Experience - no Builder.io interference */}
          <Route path="/experience" element={<ExperiencePage />} />
          
          {/* Builder.io managed pages */}
          <Route path="/" element={<BuilderManagedPage path="/" />} />
          <Route path="/about" element={<BuilderManagedPage path="/about" />} />
          <Route path="/features" element={<BuilderManagedPage path="/features" />} />
          
          {/* Catch-all for Builder.io dynamic pages */}
          <Route path="*" element={<BuilderManagedPage path={window.location.pathname} />} />
        </Routes>
      </div>
    </Router>
  );
}