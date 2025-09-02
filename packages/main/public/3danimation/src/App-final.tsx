import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BuilderComponent, builder } from '@builder.io/react';
import { RubiksCubeExperience } from './components/RubiksCubeExperience';

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
        
        {/* Pure 3D experience page (your current setup) */}
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