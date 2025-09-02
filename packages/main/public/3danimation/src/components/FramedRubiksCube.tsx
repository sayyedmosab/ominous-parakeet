import React, { useRef, useEffect } from 'react';
import RubiksCubeExperience from './RubiksCubeExperience';

interface FramedRubiksCubeProps {
  height?: string;
  width?: string;
  enableDebug?: boolean;
  autoPlay?: boolean;
  containerStyle?: 'rounded' | 'sharp' | 'bordered';
  showScrollHint?: boolean;
}

export const FramedRubiksCube: React.FC<FramedRubiksCubeProps> = ({
  height = '600px',
  width = '100%',
  enableDebug = false,
  autoPlay = true,
  containerStyle = 'rounded',
  showScrollHint = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Frame styling based on containerStyle prop
  const getFrameClasses = () => {
    const baseClasses = "relative overflow-hidden bg-black";
    
    switch (containerStyle) {
      case 'rounded':
        return `${baseClasses} rounded-xl shadow-2xl border border-gray-800`;
      case 'sharp':
        return `${baseClasses} shadow-2xl border border-gray-800`;
      case 'bordered':
        return `${baseClasses} rounded-lg border-4 border-cyan-500/30 shadow-2xl shadow-cyan-500/20`;
      default:
        return `${baseClasses} rounded-xl shadow-2xl border border-gray-800`;
    }
  };

  useEffect(() => {
    if (!autoPlay || !containerRef.current) return;

    // Auto-scroll within the frame to demonstrate the animation
    const container = containerRef.current;
    let scrollDirection = 1;
    let currentScroll = 0;
    
    const autoScrollDemo = () => {
      if (!container) return;
      
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollSpeed = 2;
      
      currentScroll += scrollSpeed * scrollDirection;
      
      if (currentScroll >= maxScroll) {
        scrollDirection = -1;
      } else if (currentScroll <= 0) {
        scrollDirection = 1;
        // Pause at the top before starting again
        setTimeout(() => {}, 2000);
      }
      
      container.scrollTop = Math.max(0, Math.min(currentScroll, maxScroll));
    };

    // Start auto-demo after a delay
    const demoTimeout = setTimeout(() => {
      const demoInterval = setInterval(autoScrollDemo, 50);
      
      // Stop demo when user interacts
      const stopDemo = () => {
        clearInterval(demoInterval);
        container.removeEventListener('wheel', stopDemo);
        container.removeEventListener('touchstart', stopDemo);
        container.removeEventListener('mousedown', stopDemo);
      };
      
      container.addEventListener('wheel', stopDemo, { passive: true });
      container.addEventListener('touchstart', stopDemo, { passive: true });
      container.addEventListener('mousedown', stopDemo);
      
      // Auto-stop demo after 30 seconds
      setTimeout(stopDemo, 30000);
      
    }, 3000); // Start demo after 3 seconds

    return () => {
      clearTimeout(demoTimeout);
    };
  }, [autoPlay]);

  return (
    <div className="w-full">
      {/* Frame Container */}
      <div 
        className={getFrameClasses()}
        style={{ height, width }}
      >
        {/* 3D Animation Container */}
        <div 
          ref={containerRef}
          className="relative w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-gray-800/20"
          style={{
            // Custom scrollbar for better aesthetics
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(6, 182, 212, 0.5) rgba(31, 41, 55, 0.2)',
          }}
        >
          <RubiksCubeExperience />
          
          {/* Hide debug info if disabled */}
          {!enableDebug && (
            <style jsx>{`
              .fixed.top-4.right-4 {
                display: none !important;
              }
            `}</style>
          )}
          
          {/* Scroll Hint Overlay */}
          {showScrollHint && (
            <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent py-6">
              <div className="text-center text-white/80">
                <div className="animate-bounce mb-2">
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <p className="text-sm">Scroll within this frame to experience the transformation</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Frame Border Glow Effect */}
        <div className="absolute inset-0 rounded-xl pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-transparent to-cyan-500/20 opacity-50"></div>
        </div>
      </div>
      
      {/* Frame Controls/Info */}
      <div className="mt-4 text-center text-gray-600">
        <p className="text-sm">
          🎮 Mouse rotation • 📜 Scroll to transform • 🧠 9 animation phases
        </p>
        <div className="flex justify-center mt-2 space-x-4 text-xs">
          <span className="px-2 py-1 bg-gray-100 rounded">Height: {height}</span>
          <span className="px-2 py-1 bg-gray-100 rounded">Debug: {enableDebug ? 'On' : 'Off'}</span>
          <span className="px-2 py-1 bg-gray-100 rounded">AutoPlay: {autoPlay ? 'On' : 'Off'}</span>
        </div>
      </div>
    </div>
  );
};