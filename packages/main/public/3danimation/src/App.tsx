import React from "react";
import RubiksCubeExperience from "./components/RubiksCubeExperienceProper";
import "./styles/globals.css";

export default function App() {
  return (
    <div className="bg-black" style={{ height: '1140vh' }}>
      {/* Fixed 3D Canvas that stays in viewport */}
      <div className="fixed inset-0 z-0">
        <RubiksCubeExperience />
      </div>
      
      {/* Scrollable content to trigger complex 10-phase animation - 1140vh total (added 100vh for new Phase 6) */}
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

        {/* Phase 5: Rubik's Cube Transform (14.48-26.32%) */}
        <div className="h-[118vh] flex items-center justify-center">
          <div className="text-center text-white pointer-events-auto">
            <h2 className="text-3xl font-bold mb-4 text-green-400">Phase 5: Rubik's Cube Transform (14.48-26.32%)</h2>
            <p className="text-lg opacity-80 mb-2">Each of 27 pieces becomes its own Rubik's cube</p>
            <p className="text-sm opacity-60 mb-2">27 individual 3×3×3 formations appearing</p>
            <div className="text-xs opacity-40">
              Original pieces fade as mini-Rubik's cubes appear
            </div>
          </div>
        </div>

        {/* Phase 6: NEW - Rubik's Cube Showcase (26.32-35.09%) */}
        <div className="h-[100vh] flex items-center justify-center">
          <div className="text-center text-white pointer-events-auto">
            <h2 className="text-3xl font-bold mb-4 text-emerald-400">✨ Phase 6: Rubik's Cube Showcase (26.32-35.09%)</h2>
            <p className="text-lg opacity-80 mb-2">FULL DISPLAY: 27 perfect Rubik's cubes with crystal-clear white edges</p>
            <p className="text-sm opacity-60 mb-2">Complete visibility • Individual rotations • Perfect contrast</p>
            <div className="text-xs opacity-40 mb-2">
              Dedicated showcase phase • Breathing animations • Living movement
            </div>
            <div className="text-xs text-emerald-300">
              🎯 NEW PHASE: Full appreciation of 27 mini-Rubik's cubes
            </div>
          </div>
        </div>

        {/* Phase 7: Second Dismantle (35.09-43.86%) */}
        <div className="h-[100vh] flex items-center justify-center">
          <div className="text-center text-white pointer-events-auto">
            <h2 className="text-3xl font-bold mb-4 text-blue-400">Phase 7: Second Dismantle (35.09-43.86%)</h2>
            <p className="text-lg opacity-80 mb-2">27 Rubik's cubes → 729 pieces</p>
            <p className="text-sm opacity-60 mb-2">Each 3×3×3 splits into 27 pieces • Fixed constraints</p>
            <div className="text-xs opacity-40">
              Instanced rendering for 729 pieces • White contrasting edges
            </div>
          </div>
        </div>

        {/* Phase 8: Independent Rotation (43.86-52.63%) */}
        <div className="h-[100vh] flex items-center justify-center">
          <div className="text-center text-white pointer-events-auto">
            <h2 className="text-3xl font-bold mb-4 text-indigo-400">Phase 8: Independent Rotation (43.86-52.63%)</h2>
            <p className="text-lg opacity-80 mb-2">729 pieces with living movement</p>
            <p className="text-sm opacity-60 mb-2">Continuous hovering • Individual rotation axes • All visible</p>
            <div className="text-xs opacity-40">
              Gentle hovering motion • Unique rotation speeds per piece
            </div>
          </div>
        </div>

        {/* Phase 9: Neuromorphic Brain Transform (52.63-70.18%) */}
        <div className="h-[200vh] flex items-center justify-center">
          <div className="text-center text-white pointer-events-auto">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">Phase 9: Neuromorphic Brain Transform (52.63-70.18%)</h2>
            <p className="text-lg opacity-80 mb-2">ULTRA-ENHANCED: Cubes morph into neuromorphic brain tissue</p>
            <p className="text-sm opacity-60 mb-2">Wave-based transformation • 100 cubes simultaneously • 16×16 sphere resolution</p>
            <div className="text-xs opacity-40 mb-2">
              FIXED: Pink brain material with WHITE edges for contrast
            </div>
            <div className="text-xs text-pink-300 mb-2">
              4-octave noise cortical folding • Anatomically accurate regions
            </div>
            <div className="text-xs text-purple-300">
              ✨ React 19 + Three.js 0.172.0 neuromorphic enhancements
            </div>
          </div>
        </div>

        {/* Phase 10: Ultra-Realistic Brain Formation (70.18-100%) - EXTENDED RANGE */}
        <div className="h-[340vh] flex items-center justify-center">
          <div className="text-center text-white pointer-events-auto">
            <h2 className="text-3xl font-bold mb-4 text-pink-400">Phase 10: Ultra-Realistic Brain Formation (70.18-100%)</h2>
            <p className="text-lg opacity-80 mb-2">Ultra-slow spiral → Mouse-rotatable ULTRA-REALISTIC brain</p>
            <p className="text-sm opacity-60 mb-2">ENHANCED: Thousands of equal-sized brain pieces • No perspective scaling</p>
            <div className="text-xs opacity-40 mb-2">
              Enhanced 4-octave noise folding • Region-specific cortical complexity
            </div>
            <div className="text-xs text-pink-300 mb-2">
              Frontal lobe prominence • Enhanced cerebellum foliation • Brain stem narrowing
            </div>
            <div className="text-xs text-cyan-300 mb-2">
              ULTRA-SLOW VISIBLE SPIRAL: Full 2π rotation over extended range
            </div>
            <div className="text-xs text-emerald-300">
              🚀 ENHANCED: 3000+ equal-sized brain pieces for ultra-realistic detail
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}