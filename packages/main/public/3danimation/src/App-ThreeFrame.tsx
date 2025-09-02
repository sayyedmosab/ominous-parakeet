import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BuilderComponent, builder } from '@builder.io/react';
import RubiksCubeExperience from './components/RubiksCubeExperience';
import { BuilderRubiksCubeContent } from './components/BuilderRubiksCubeContent';

// Import your Builder.io component registrations
import './components/BuilderIntegration';

// Initialize Builder.io with your public API key
builder.init('YOUR_BUILDER_PUBLIC_KEY'); // Replace with your actual key

// React 19 Loading Component
function Loading() {
  return (
    <div className="flex items-center justify-center size-full bg-black text-cyan-400">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading 3D Experience...</p>
      </div>
    </div>
  );
}

// Example Three-Row Layout Component
function ThreeRowLayoutExample() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* TOP FRAME: Navigation */}
      <nav className="bg-white shadow-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">3D Experience Site</h1>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-gray-900">Home</a>
              <a href="#about" className="text-gray-700 hover:text-gray-900">About</a>
              <a href="#experience" className="text-gray-700 hover:text-gray-900">Experience</a>
            </div>
          </div>
        </div>
      </nav>

      {/* MIDDLE FRAME: Main Content - This is where the sophisticated animation goes */}
      <main className="flex-1 relative bg-black">
        <BuilderRubiksCubeContent
          height="100%"
          width="100%"
          showPhaseInfo={true}
          enableMouseRotation={true}
          startingPhase={1}
        />
      </main>

      {/* BOTTOM FRAME: Footer */}
      <footer className="bg-gray-900 text-white z-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#about" className="text-gray-300 hover:text-white">About</a></li>
                <li><a href="#careers" className="text-gray-300 hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Technology</h3>
              <ul className="mt-4 space-y-4">
                <li><span className="text-gray-300">React 19 + Three.js 0.172.0</span></li>
                <li><span className="text-gray-300">4-Octave Noise Brain Formation</span></li>
                <li><span className="text-gray-300">729 Instanced Cubes</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Features</h3>
              <ul className="mt-4 space-y-4">
                <li><span className="text-gray-300">9 Animation Phases</span></li>
                <li><span className="text-gray-300">Mouse-Controlled Rotation</span></li>
                <li><span className="text-gray-300">Ultra-Slow Spiral Formation</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Experience</h3>
              <ul className="mt-4 space-y-4">
                <li><span className="text-gray-300">Scroll within frame to animate</span></li>
                <li><span className="text-gray-300">True morphing transformations</span></li>
                <li><span className="text-gray-300">Neuroanatomically accurate</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-center text-gray-400">
              © 2024 3D Experience. Powered by Builder.io integration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Builder.io managed pages (your three-row layout) */}
        <Route 
          path="/" 
          element={
            <Suspense fallback={<Loading />}>
              <BuilderComponent model="page" />
            </Suspense>
          } 
        />
        <Route 
          path="/about" 
          element={
            <Suspense fallback={<Loading />}>
              <BuilderComponent model="page" />
            </Suspense>
          } 
        />
        <Route 
          path="/features" 
          element={
            <Suspense fallback={<Loading />}>
              <BuilderComponent model="page" />
            </Suspense>
          } 
        />
        
        {/* Pure 3D experience page (your original sophisticated setup) */}
        <Route 
          path="/experience" 
          element={
            <Suspense fallback={<Loading />}>
              <div className="size-full bg-black">
                <RubiksCubeExperience />
              </div>
            </Suspense>
          } 
        />
        
        {/* Demo three-row layout */}
        <Route 
          path="/demo" 
          element={
            <Suspense fallback={<Loading />}>
              <ThreeRowLayoutExample />
            </Suspense>
          } 
        />
        
        {/* Catch-all for Builder.io pages */}
        <Route 
          path="*" 
          element={
            <Suspense fallback={<Loading />}>
              <BuilderComponent model="page" />
            </Suspense>
          } 
        />
      </Routes>
    </Router>
  );
}