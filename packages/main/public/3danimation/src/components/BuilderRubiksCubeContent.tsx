import React, { useRef, useEffect, useState } from 'react';
import RubiksCubeExperience from './RubiksCubeExperience';

interface BuilderRubiksCubeContentProps {
  height?: string;
  width?: string;
  showPhaseInfo?: boolean;
  enableMouseRotation?: boolean;
  startingPhase?: number;
}

/**
 * Builder.io Content Frame Component
 * 
 * This component wraps the entire sophisticated RubiksCubeExperience
 * exactly as-is for use in Builder.io's middle content frame.
 * 
 * Features:
 * - Full 1040vh sophisticated animation preserved
 * - All 9 phases with precise scroll percentages
 * - Neuroanatomically accurate brain formation
 * - True morphing and ultra-slow spiral
 * - Fits perfectly in Builder.io's three-row structure
 */
export const BuilderRubiksCubeContent: React.FC<BuilderRubiksCubeContentProps> = ({
  height = '100vh',
  width = '100%',
  showPhaseInfo = true,
  enableMouseRotation = true,
  startingPhase = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark as loaded and optionally scroll to starting phase
    setIsLoaded(true);
    
    if (startingPhase > 1 && containerRef.current) {
      const container = containerRef.current;
      const phases = {
        1: 0,      // 0% - Group Rotate
        2: 0.0201, // 2.01% - First Dismantle  
        3: 0.1206, // 12.06% - Settle with Perspective
        4: 0.1448, // 14.48% - (Phase 4 cancelled)
        5: 0.1448, // 14.48% - Rubik's Cube Transform
        6: 0.3138, // 31.38% - Second Dismantle
        7: 0.4103, // 41.03% - Independent Rotation
        8: 0.5069, // 50.69% - Brain Popcorn Transform
        9: 0.7     // 70% - Organic Brain Formation
      };
      
      const phasePercentage = phases[startingPhase as keyof typeof phases] || 0;
      const maxScroll = container.scrollHeight - container.clientHeight;
      const targetScroll = maxScroll * phasePercentage;
      
      // Smooth scroll to starting phase
      setTimeout(() => {
        container.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }, 1000);
    }
  }, [startingPhase]);

  // Apply mouse rotation disable if needed
  useEffect(() => {
    if (!enableMouseRotation) {
      const style = document.createElement('style');
      style.textContent = `
        .builder-content * {
          pointer-events: none !important;
        }
        .builder-content .pointer-events-auto {
          pointer-events: auto !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [enableMouseRotation]);

  if (!isLoaded) {
    return (
      <div 
        className="flex items-center justify-center bg-black text-cyan-400"
        style={{ height, width }}
      >
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-xl mb-2">Loading Sophisticated 3D Experience</p>
          <p className="text-sm opacity-60">9 phases • 729 cubes • Neuroanatomically accurate brain</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="builder-content relative bg-black"
      style={{ height, width }}
    >
      {/* Full Sophisticated Animation - Exactly As-Is */}
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-auto"
        style={{
          // Custom scrollbar for Builder.io compatibility
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 255, 255, 0.6) rgba(26, 26, 26, 0.3)',
        }}
      >
        {/* 
          This is the EXACT same content structure as App.tsx
          The entire 1040vh sophisticated animation preserved perfectly
        */}
        <div style={{ height: '1040vh' }}>
          {/* Fixed 3D Canvas that stays in content frame viewport */}
          <div className="fixed inset-0 z-0" style={{ 
            position: 'absolute', // Changed from fixed for Builder.io compatibility
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0 
          }}>
            <RubiksCubeExperience />
          </div>
          
          {/* Scrollable content to trigger complex 9-phase animation - 1040vh total */}
          <div className="relative z-10 pointer-events-none">
            {/* Phase 1: Group Rotate (0-2.01%) */}
            <div className="h-[21vh] flex items-center justify-center">
              <div className="text-center text-white pointer-events-auto">
                <h1 className="text-4xl font-bold mb-4 text-cyan-400">Ultra-Sophisticated Rubik's Cube</h1>
                <p className="text-xl text-cyan-300 mb-8">React 19 + Three.js 0.172.0 + 4-Octave Noise</p>
                <div className="text-lg opacity-80 mb-4">
                  Phase 1: Mouse-Controlled Group Rotation (0-2.01%)
                </div>
                <div className="text-sm opacity-60">
                  Move mouse to rotate the 1.5x sized unified cube • 27 pieces as one object
                </div>
              </div>
            </div>

            {/* Phase 2: First Dismantle (2.01-12.06%) */}
            <div className="h-[105vh] flex items-center justify-center">
              <div className="text-center text-white pointer-events-auto">
                <h2 className="text-3xl font-bold mb-4 text-orange-400">Phase 2: First Dismantle (2.01-12.06%)</h2>
                <p className="text-lg opacity-80 mb-2">27 large pieces explode into dramatic cloud</p>
                <p className="text-sm opacity-60 mb-2">Screen-adaptive spread with 5% padding • Fills 90% of visible area</p>
                <div className="text-xs opacity-40">
                  Butter-smooth easing • Dynamic spread calculation
                </div>
              </div>
            </div>

            {/* Phase 3: Settle with Perspective (12.06-14.48%) */}
            <div className="h-[25vh] flex items-center justify-center">
              <div className="text-center text-white pointer-events-auto">
                <h2 className="text-3xl font-bold mb-4 text-yellow-400">Phase 3: Settle with Perspective (12.06-14.48%)</h2>
                <p className="text-lg opacity-80 mb-2">Large pieces hold dramatic positions</p>
                <p className="text-sm opacity-60">Perspective scaling: Bottom large (1.0) → Top small (0.25)</p>
              </div>
            </div>

            {/* Phase 4: CANCELLED - Time redistributed */}
            <div className="h-0"></div>

            {/* Phase 5: Rubik's Cube Transform + Showcase (14.48-31.38%) */}
            <div className="h-[169vh] flex items-center justify-center">
              <div className="text-center text-white pointer-events-auto">
                <h2 className="text-3xl font-bold mb-4 text-green-400">Phase 5: Rubik's Cube Transform + Showcase (14.48-31.38%)</h2>
                <p className="text-lg opacity-80 mb-2">Each of 27 pieces becomes its own Rubik's cube</p>
                <p className="text-sm opacity-60 mb-2">27 individual 3×3×3 formations • ENHANCED: Perfect white edge visibility</p>
                <div className="text-xs opacity-40 mb-2">
                  Transform: 14.48-29.38% • Showcase: 29.38-31.38%
                </div>
                <div className="text-xs text-emerald-300">
                  ✨ 2% showcase period with breathing animation & crystal-clear white edges
                </div>
              </div>
            </div>

            {/* Phase 6: Second Dismantle (31.38-41.03%) */}
            <div className="h-[97vh] flex items-center justify-center">
              <div className="text-center text-white pointer-events-auto">
                <h2 className="text-3xl font-bold mb-4 text-blue-400">Phase 6: Second Dismantle (31.38-41.03%)</h2>
                <p className="text-lg opacity-80 mb-2">27 Rubik's cubes → 729 pieces</p>
                <p className="text-sm opacity-60 mb-2">Each 3×3×3 splits into 27 pieces • Fixed constraints</p>
                <div className="text-xs opacity-40">
                  Instanced rendering for 729 pieces • White contrasting edges
                </div>
              </div>
            </div>

            {/* Phase 7: Independent Rotation (41.03-50.69%) */}
            <div className="h-[97vh] flex items-center justify-center">
              <div className="text-center text-white pointer-events-auto">
                <h2 className="text-3xl font-bold mb-4 text-indigo-400">Phase 7: Independent Rotation (41.03-50.69%)</h2>
                <p className="text-lg opacity-80 mb-2">729 pieces with living movement</p>
                <p className="text-sm opacity-60 mb-2">Continuous hovering • Individual rotation axes • All visible</p>
                <div className="text-xs opacity-40">
                  Gentle hovering motion • Unique rotation speeds per piece
                </div>
              </div>
            </div>

            {/* Phase 8: Neuromorphic Brain Transform (50.69-70%) */}
            <div className="h-[193vh] flex items-center justify-center">
              <div className="text-center text-white pointer-events-auto">
                <h2 className="text-3xl font-bold mb-4 text-purple-400">Phase 8: Neuromorphic Brain Transform (50.69-70%)</h2>
                <p className="text-lg opacity-80 mb-2">ULTRA-ENHANCED: Cubes morph into neuromorphic brain tissue</p>
                <p className="text-sm opacity-60 mb-2">Wave-based transformation • 100 cubes simultaneously • 16×16 sphere resolution</p>
                <div className="text-xs opacity-40 mb-2">
                  True morphing with enhanced brain material • Subsurface scattering effect
                </div>
                <div className="text-xs text-pink-300 mb-2">
                  4-octave noise cortical folding • Anatomically accurate regions
                </div>
                <div className="text-xs text-purple-300">
                  ✨ React 19 + Three.js 0.172.0 neuromorphic enhancements
                </div>
              </div>
            </div>

            {/* Phase 9: Ultra-Realistic Brain Formation (70-100%) - EXTENDED 30% RANGE */}
            <div className="h-[312vh] flex items-center justify-center">
              <div className="text-center text-white pointer-events-auto">
                <h2 className="text-3xl font-bold mb-4 text-pink-400">Phase 9: Ultra-Realistic Brain Formation (70-100%)</h2>
                <p className="text-lg opacity-80 mb-2">Ultra-slow spiral → Mouse-rotatable ULTRA-REALISTIC brain</p>
                <p className="text-sm opacity-60 mb-2">EXTENDED 30% spiral range • Neuroanatomically ULTRA-accurate</p>
                <div className="text-xs opacity-40 mb-2">
                  Enhanced 4-octave noise folding • Region-specific cortical complexity
                </div>
                <div className="text-xs text-pink-300 mb-2">
                  Frontal lobe prominence • Enhanced cerebellum foliation • Brain stem narrowing
                </div>
                <div className="text-xs text-cyan-300 mb-2">
                  ULTRA-SLOW VISIBLE SPIRAL: Full 2π rotation over 30% scroll range
                </div>
                <div className="text-xs text-emerald-300">
                  ✨ Neuromorphic cortical detail • Anatomically accurate MRI-based proportions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Builder.io Specific Scroll Hint */}
        {showPhaseInfo && (
          <div className="absolute bottom-4 left-4 z-50 text-white bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-purple-500/30">
            <div className="text-sm font-medium text-purple-400">
              🎯 Builder.io Content Frame
            </div>
            <div className="text-xs text-white/70 mt-1">
              Full 9-phase animation • Scroll within this frame
            </div>
          </div>
        )}
      </div>

      {/* Builder.io Specific Styles for Content Frame */}
      <style jsx>{`
        .builder-content {
          position: relative !important;
          overflow: hidden;
        }
        
        .builder-content * {
          box-sizing: border-box;
        }
        
        .builder-content ::-webkit-scrollbar {
          width: 8px;
        }
        
        .builder-content ::-webkit-scrollbar-track {
          background: rgba(26, 26, 26, 0.3);
        }
        
        .builder-content ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00ffff, #ff4488);
          border-radius: 4px;
        }
        
        .builder-content ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #00dddd, #ff3366);
        }
        
        /* Ensure 3D canvas stays within content frame */
        .builder-content canvas {
          position: absolute !important;
        }
      `}</style>
    </div>
  );
};