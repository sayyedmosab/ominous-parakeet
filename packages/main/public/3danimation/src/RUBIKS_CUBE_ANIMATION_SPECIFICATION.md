# RUBIK'S CUBE 3D INTERACTIVE ANIMATION - ULTRA-DETAILED SPECIFICATION

## 🎯 CORE VISION
A sophisticated 3D Rubik's cube that transforms through 10 precise scroll-triggered phases, from a unified rotating cube to 729 mini-cubes that become brains merging into one large brain. Each phase must be directly scroll-responsive with smooth 60fps performance and DRAMATIC visual impact.

## 🚨 CRITICAL PROBLEM DIAGNOSIS
**CURRENT ISSUE**: Animation is broken because spread values have been over-constrained:
- Current code uses: `maxSpreadX = 35, maxSpreadY = 20, maxSpreadZ = 25` 
- This creates minimal spreading instead of dramatic explosion
- **SOLUTION**: Restore original dramatic spreading with proper screen adaptation

## 🎨 VISUAL REQUIREMENTS
- **Cube Color**: Fluorescent neon blue (#00ffff) with emissive glow
- **Edges**: White contrasting wireframe edges (#ffffff) for distinctness
- **Scene**: Dark atmospheric theme with multiple colored lights
- **Performance**: Smooth 60fps, no jerky animations
- **Responsiveness**: Direct scroll synchronization without excessive smoothing/lerping
- **Screen Bounds**: Effects adapt to screen size while maintaining dramatic spread

## 📐 TECHNICAL FOUNDATION
- **Original Cube Size**: 8.55 units per cube piece
- **Cube Spacing**: 9.9 units (creates tight 3x3x3 formation)  
- **Camera Distance**: 50 units from origin
- **Total Scroll Height**: 500vh (5x viewport height)
- **Phase Transitions**: Immediate, scroll-driven (no smoothing delays)
- **Viewport Detection**: Use `window.innerWidth` and `window.innerHeight` for screen adaptation
- **Z-Distance Scaling**: Objects further from camera appear smaller naturally

---

## 🎬 PHASE-BY-PHASE DETAILED SPECIFICATION

### PHASE 1: GROUP ROTATE (0% - 20% scroll)
**Duration**: 100vh of scroll
**State**: Single unified massive cube

**Behavior**:
- **Mouse Control**: ACTIVE - full 360° rotation on both X and Y axes
- **Rotation Strength**: 1.0 (full sensitivity)
- **Cube State**: All 27 pieces stay in original grid positions
  - Position: [x * 9.9, y * 9.9, z * 9.9] where x,y,z = -1,0,1
- **Visual Effect**: Massive cohesive cube rotating as one unit
- **Lighting**: Full atmospheric lighting reveals cube details

**Technical Notes**:
- Group rotation applied to parent group, not individual cubes
- Individual cube positions remain unchanged
- Smooth mouse tracking with immediate response

---

### PHASE 2: FIRST DISMANTLE (20% - 35% scroll)  
**Duration**: 75vh of scroll (15% of total)
**State**: 27 individual cubes spreading apart DRAMATICALLY across entire screen

## 🚨 EXACT IMPLEMENTATION FOR DRAMATIC SPREAD

### **SCREEN ADAPTATION FORMULAS**:
```javascript
// Dynamic screen-based spread calculation
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;
const aspectRatio = viewportWidth / viewportHeight;

// Calculate field of view coverage at camera distance (50 units)
const fov = 75; // degrees
const fovRad = (fov * Math.PI) / 180;
const screenWidth3D = 2 * Math.tan(fovRad / 2) * 50; // ~63 units
const screenHeight3D = screenWidth3D / aspectRatio; // ~35 units for 16:9

// Dramatic spread ranges (USE THESE VALUES)
const maxSpreadX = screenWidth3D * 0.8; // ~50 units (80% of screen width)
const maxSpreadY = screenHeight3D * 0.8; // ~28 units (80% of screen height)  
const maxSpreadZ = 60; // Deep Z spread for 3D effect
```

### **BASESPREAD GENERATION** (Run once during cube creation):
```javascript
// Generate dramatic baseSpread for each cube (PRESERVE THESE VALUES)
baseSpread: [
  (Math.random() - 0.5) * 2,  // -1 to +1 normalized range
  (Math.random() - 0.5) * 2,  // -1 to +1 normalized range
  (Math.random() - 0.5) * 2   // -1 to +1 normalized range
]
```

### **POSITION CALCULATION** (Run every frame during Phase 2):
```javascript
const dismantleProgress = (scrollProgress - 0.20) / 0.15; // 0 to 1

// CRITICAL: Apply full dramatic spread
position = [
  cubeData.position[0] + cubeData.baseSpread[0] * dismantleProgress * maxSpreadX,
  cubeData.position[1] + cubeData.baseSpread[1] * dismantleProgress * maxSpreadY,
  cubeData.position[2] + cubeData.baseSpread[2] * dismantleProgress * maxSpreadZ
];
```

### **VISUAL BEHAVIOR**:
- **Mouse Control**: DISABLED - group rotation locked at [0,0,0]
- **Animation**: Cubes fly from tight formation to dramatic spread positions
- **Scale**: All cubes maintain original size (scale = 1.0) 
[USER: INCORRECT, IMPLEMENT A PERSPECTIVE EFFECT AS EXPLAINED IN LATER SECTIONS. HAVING THIS STATEMENT AT START RISKS AN AI READING INITIAL PART AND ASSUMING THERE IS NO SCALING]
- **Screen Coverage**: Cubes spread across 80% of visible screen area
- **3D Depth**: Full Z-axis spread for dramatic 3D effect

### **EXPECTED VISUAL RESULT**: 
- Cubes explode outward from center in all directions
- Some cubes fly to screen edges, others stay near center  
- Full 3D depth variation with cubes at different Z distances [MAKE SURE THIS IS ACHIEVED IN THE MANNER I EXPLAINED FOR PERSPECTIVE EFFECT]
- Dramatic "explosion" effect that fills most of the screen
- No cube clustering - each has unique random position
- Smooth transition from tight formation to wide spread over 15% scroll

---

### PHASE 3: SETTLE PAUSE (35% - 45% scroll)
**Duration**: 50vh of scroll (10% of total)
**State**: 27 cubes hold spread positions with perspective scaling [THIS IS NOT A SUDDEN STATE, THE SCALING STARTS FROM DISMANTLINGTILL ENDS IN THIS STATE]

## 🎯 EXACT IMPLEMENTATION FOR PERSPECTIVE SCALING

### **POSITION LOCKING** (Use final positions from Phase 2):
```javascript
// CRITICAL: Maintain dramatic spread positions from Phase 2
const maxSpreadX = screenWidth3D * 0.8;  // Same values as Phase 2
const maxSpreadY = screenHeight3D * 0.8;
const maxSpreadZ = 60;

// Lock positions at full spread
position = [
  cubeData.position[0] + cubeData.baseSpread[0] * maxSpreadX,
  cubeData.position[1] + cubeData.baseSpread[1] * maxSpreadY,
  cubeData.position[2] + cubeData.baseSpread[2] * maxSpreadZ
];
```

### **PERSPECTIVE SCALING FORMULA**:
```javascript
// Create 2D plane illusion with perspective scaling
const minY = -maxSpreadY; // Bottom of spread area
const maxY = maxSpreadY;  // Top of spread area

// Normalize Y position to 0-1 range
const normalizedY = (position[1] - minY) / (maxY - minY);

// Apply perspective scaling: bottom = large, top = small
const scale = 1.0 - (normalizedY * 0.75); // 1.0 to 0.25 range
const clampedScale = Math.max(0.25, Math.min(1.0, scale));

// Apply scale to cube
groupRef.current.scale.setScalar(clampedScale);
```

### **VISUAL BEHAVIOR**:
- **Position**: LOCKED at dramatic spread positions (NO MOVEMENT)
- **Scale Animation**: Gradual size changes based on Y position
- **Bottom Cubes**: Scale = 1.0 (full size, appear close) [ THE MOST BOTTOM IS 1.0, A SLIGHTLY LESS AT BOTTOM SHOULD BE SLIGHTLY LESS IN SCALE, THIS IS A GRADIENT SCALINE]
- **Top Cubes**: Scale = 0.25 (quarter size, appear distant)
- **Middle Cubes**: Scale = 0.625 (intermediate scaling)

### **EXPECTED VISUAL RESULT**:
- All cubes maintain their dramatic spread positions from Phase 2
- Cubes at bottom of screen appear large (scale 1.0)
- Cubes at top of screen appear small (scale 0.25)  
- Creates convincing 2D plane perspective illusion
- Smooth size transitions create depth perception
- Foundation set for upcoming rotation and transformation phases

---

### PHASE 4: PER-CUBE ROTATE (45% - 55% scroll)
**Duration**: 50vh of scroll (10% of total) 
**State**: 27 cubes rotating independently while maintaining spread positions

## 🌪️ EXACT IMPLEMENTATION FOR INDIVIDUAL ROTATIONS

### **ROTATION DATA GENERATION** (Initialize once per cube):
```javascript
// Generate unique rotation properties for each cube
const cubeRotationData = {
  rotationSpeed: (Math.random() * 0.015) + 0.005, // 0.005 to 0.02 rad/frame
  rotationAxis: new THREE.Vector3(
    Math.random() - 0.5,  // -0.5 to 0.5
    Math.random() - 0.5,  // -0.5 to 0.5  
    Math.random() - 0.5   // -0.5 to 0.5
  ).normalize(), // Normalize to unit vector
  accumulatedRotation: new THREE.Euler(0, 0, 0)
};
```

### **ROTATION CALCULATION** (Run every frame during Phase 4):
```javascript
const phaseProgress = (scrollProgress - 0.45) / 0.10; // 0 to 1 over Phase 4

if (scrollProgress >= 0.45 && scrollProgress < 0.55) {
  // Calculate rotation amount for this frame
  const rotationAmount = cubeRotationData.rotationSpeed * phaseProgress;
  
  // Apply rotation around the random axis
  const rotationMatrix = new THREE.Matrix4().makeRotationAxis(
    cubeRotationData.rotationAxis, 
    rotationAmount
  );
  
  // Accumulate rotation
  cubeRotationData.accumulatedRotation.x += cubeRotationData.rotationAxis.x * rotationAmount;
  cubeRotationData.accumulatedRotation.y += cubeRotationData.rotationAxis.y * rotationAmount;
  cubeRotationData.accumulatedRotation.z += cubeRotationData.rotationAxis.z * rotationAmount;
  
  // Apply to cube
  groupRef.current.rotation.copy(cubeRotationData.accumulatedRotation);
}
```

### **POSITION & SCALE MAINTENANCE**:
```javascript
// CRITICAL: Keep all Phase 3 positioning and scaling
position = [/* Same as Phase 3 - LOCKED */];
scale = /* Same as Phase 3 - perspective scaling maintained */;

// Apply position and scale (unchanged from Phase 3)
groupRef.current.position.set(...position);
groupRef.current.scale.setScalar(scale);
```

### **VISUAL BEHAVIOR**:
- **Position**: ABSOLUTELY LOCKED (no movement from Phase 3)
- **Scale**: MAINTAINED perspective scaling from Phase 3
- **Rotation**: NEW - Each cube spins around its own random axis
- **Rotation Speed**: Varies per cube (0.005 to 0.02 rad/frame)
- **Rotation Axis**: Random per cube, normalized to unit vector
- **Accumulation**: Rotation builds up over time during phase

### **EXPECTED VISUAL RESULT**:
- 27 cubes maintain their dramatic spread positions
- Each cube maintains its perspective scale (large at bottom, small at top)
- Each cube begins spinning around its own unique axis
- Different rotation speeds create varied spinning effects
- Creates mesmerizing field of independently rotating cubes
- Builds visual complexity while maintaining spatial distribution
- Sets stage for mini-cube transformation in Phase 5

---

### PHASE 5: MINI-CUBE TRANSFORM (55% - 65% scroll)
**Duration**: 50vh of scroll (10% of total)
**State**: Each cube splits into 27 mini-cubes = 729 total pieces

## 🧊 EXACT IMPLEMENTATION FOR 27→729 TRANSFORMATION

### **MINI-CUBE DATA STRUCTURE**:
```javascript
interface MiniCubeData {
  id: string;
  parentCubeIndex: number;
  localPosition: [number, number, number]; // Position relative to parent
  miniBaseSpread: [number, number, number]; // For additional spreading
  size: number; // 2.85 units (1/3 of original 8.55)
}
```

### **MINI-CUBE GENERATION** (Initialize once during Phase 5 start):
```javascript
const miniCubes: MiniCubeData[] = [];
let miniCubeId = 0;

// For each of the original 27 cubes
originalCubes.forEach((parentCube, parentIndex) => {
  // Generate 27 mini-cubes per parent (3x3x3 formation)
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        miniCubes.push({
          id: `mini_${parentIndex}_${x}_${y}_${z}`,
          parentCubeIndex: parentIndex,
          localPosition: [x * 2.85, y * 2.85, z * 2.85], // 2.85 = 8.55/3
          miniBaseSpread: [
            (Math.random() - 0.5) * 2, // -1 to +1 for additional spread
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ],
          size: 2.85
        });
        miniCubeId++;
      }
    }
  }
});
```

### **MINI-CUBE POSITION CALCULATION**:
```javascript
const transformProgress = (scrollProgress - 0.55) / 0.10; // 0 to 1 over Phase 5

miniCubes.forEach((miniCube) => {
  const parentCube = originalCubes[miniCube.parentCubeIndex];
  
  // Get parent cube's final position from Phase 4
  const parentPosition = [
    parentCube.position[0] + parentCube.baseSpread[0] * maxSpreadX,
    parentCube.position[1] + parentCube.baseSpread[1] * maxSpreadY,
    parentCube.position[2] + parentCube.baseSpread[2] * maxSpreadZ
  ];
  
  // Calculate mini-cube spread from parent position
  const miniSpreadRange = 15; // Additional spread range for mini-cubes
  
  const finalPosition = [
    parentPosition[0] + miniCube.localPosition[0] + 
    (miniCube.miniBaseSpread[0] * miniSpreadRange * transformProgress),
    
    parentPosition[1] + miniCube.localPosition[1] + 
    (miniCube.miniBaseSpread[1] * miniSpreadRange * transformProgress),
    
    parentPosition[2] + miniCube.localPosition[2] + 
    (miniCube.miniBaseSpread[2] * miniSpreadRange * transformProgress)
  ];
  
  // Inherit perspective scaling from parent cube
  const normalizedY = (finalPosition[1] - (-maxSpreadY)) / (2 * maxSpreadY);
  const perspectiveScale = 1.0 - (normalizedY * 0.75);
  const parentScale = Math.max(0.25, Math.min(1.0, perspectiveScale));
  
  // Mini-cube is 1/3 size of parent + perspective scaling
  const miniScale = (1/3) * parentScale;
  
  return {
    position: finalPosition,
    scale: miniScale
  };
});
```

### **VISUAL BEHAVIOR**:
- **Transformation**: Original 27 cubes disappear, 729 mini-cubes appear
- **Initial Position**: Mini-cubes start at parent cube positions in 3x3x3 formations
- **Spreading**: Mini-cubes spread outward from parent positions
- **Size**: Each mini-cube is 1/3 the size of original cubes (2.85 units)
[MATHEMATICALLY INCORRECT SINCE THE CUBES HAVE VARYING SIZES]
- **Perspective**: Mini-cubes inherit perspective scaling from parent positions
- **Distribution**: 729 pieces spread across 95% of screen area

### **EXPECTED VISUAL RESULT**:
- Dramatic transformation from 27 large cubes to 729 tiny cubes
[USER: THE 27 ARE NOT LARGE, THEY ARE SMALLER THAN THE FIRST CUBE AND LARGER THAN THE SMALLER CUBES]
- Each group of 27 mini-cubes originates from a parent cube position
- Mini-cubes spread outward creating incredible detail density
- Perspective scaling maintained (small at top, large at bottom)
- Screen filled with tiny neon blue cubes creating particle-like effect
- Foundation established for Phase 6 mini-cube rotations

---

### PHASE 6: MINI-CUBE ROTATE (65% - 75% scroll)
**Duration**: 50vh of scroll (10% of total)
**State**: 729 mini-cubes rotating independently

## 🌪️ EXACT IMPLEMENTATION FOR 729 INDIVIDUAL ROTATIONS

### **MINI-CUBE ROTATION DATA**:
```javascript
// Generate unique rotation for each of 729 mini-cubes
const miniCubeRotations = miniCubes.map(() => ({
  rotationSpeed: (Math.random() * 0.02) + 0.003, // 0.003 to 0.023 rad/frame
  rotationAxis: new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5, 
    Math.random() - 0.5
  ).normalize(),
  accumulatedRotation: new THREE.Euler(0, 0, 0)
}));
```

### **ROTATION APPLICATION**:
```javascript
const rotateProgress = (scrollProgress - 0.65) / 0.10; // 0 to 1 over Phase 6

miniCubes.forEach((miniCube, index) => {
  // Maintain position and scale from Phase 5
  const position = /* Same as Phase 5 final positions */;
  const scale = /* Same as Phase 5 perspective scaling */;
  
  // Apply individual rotation
  const rotData = miniCubeRotations[index];
  const rotationAmount = rotData.rotationSpeed * rotateProgress;
  
  rotData.accumulatedRotation.x += rotData.rotationAxis.x * rotationAmount;
  rotData.accumulatedRotation.y += rotData.rotationAxis.y * rotationAmount;
  rotData.accumulatedRotation.z += rotData.rotationAxis.z * rotationAmount;
  
  miniCubeRef.current.rotation.copy(rotData.accumulatedRotation);
});
```

---

### PHASE 7: SECOND DISMANTLE (75% - 85% scroll)
**Duration**: 50vh of scroll (10% of total)
**State**: 729 mini-cubes scatter further apart

## 💥 EXACT IMPLEMENTATION FOR MAXIMUM SCATTER

### **ADDITIONAL SCATTER CALCULATION**:
```javascript
const scatterProgress = (scrollProgress - 0.75) / 0.10; // 0 to 1 over Phase 7

// Additional scatter range (larger than Phase 5)
const additionalScatterRange = 25; // Larger scatter for maximum spread

miniCubes.forEach((miniCube) => {
  // Start from Phase 5 final positions
  const phase5Position = /* Final positions from Phase 5 */;
  
  // Apply additional scatter
  const scatteredPosition = [
    phase5Position[0] + (miniCube.miniBaseSpread[0] * additionalScatterRange * scatterProgress),
    phase5Position[1] + (miniCube.miniBaseSpread[1] * additionalScatterRange * scatterProgress),
    phase5Position[2] + (miniCube.miniBaseSpread[2] * additionalScatterRange * scatterProgress)
  ];
  
  return scatteredPosition;
});
```

---

### PHASE 8: INDEPENDENT ROTATION (43.86% - 52.63% scroll)
**Duration**: 87.7vh of scroll (8.77% of total)
**State**: 729 mini-cubes rotating independently with living movement

## 🌪️ EXACT IMPLEMENTATION FOR 729 INDEPENDENT ROTATIONS

### **LIVING MOVEMENT ANIMATION**:
```javascript
const rotationProgress = (scrollProgress - 0.4386) / 0.0877; // 0 to 1 over Phase 8

// Base position with hovering motion
const time = Date.now() * 0.001;
const hoverAmplitude = 1.5; // Gentle hovering
const hoverX = Math.sin(time + i * 0.1) * hoverAmplitude;
const hoverY = Math.cos(time * 0.7 + i * 0.15) * hoverAmplitude;
const hoverZ = Math.sin(time * 0.5 + i * 0.12) * hoverAmplitude;

// Enhanced rotation with multiple axes for variety
const continuousRotation = time * 0.5;
rotation.x = rotationData.rotationAxis.x * continuousRotation;
rotation.y = rotationData.rotationAxis.y * continuousRotation;
rotation.z = rotationData.rotationAxis.z * continuousRotation;
```

---

### PHASE 9: NEUROMORPHIC BRAIN TRANSFORM (52.63% - 70.18% scroll)
**Duration**: 175.5vh of scroll (17.55% of total)
**State**: POPCORN-STYLE morphing from cubes to brain pieces

## 🧠 EXACT IMPLEMENTATION FOR POPCORN BRAIN TRANSFORMATION

### **CRITICAL MORPHING RULES**:
1. **CONTINUITY**: Start from exact positions where Phase 8 ended
2. **POPCORN STYLE**: Individual pieces transform randomly like popcorn popping
3. **FADE TRANSITION**: Fade OUT cube, fade IN brain at same position
4. **NO SIZE CHANGE**: Maintain same overall size during morph
5. **WHITE EDGES**: Brain pieces must have WHITE edges for visibility

### **POPCORN MORPHING IMPLEMENTATION**:
```javascript
const transformProgress = (scrollProgress - 0.5263) / 0.1755; // 0 to 1 over Phase 9

// Wave-based transformation with large simultaneous groups
const waveSize = 100; // Transform 100 cubes at once (popcorn bursts)
const waveIndex = Math.floor(cubeIndex / waveSize);
const totalWaves = Math.ceil(729 / waveSize);

// Each wave starts with delay but transforms quickly
const waveStartDelay = (waveIndex / totalWaves) * 0.4;
const waveProgress = Math.max(0, (transformProgress - waveStartDelay) / (1 - waveStartDelay));
const individualTransform = Math.min(1, easeInOutCubic(waveProgress) * 1.5);

// CRITICAL: Fade out cube, fade in brain at SAME position
if (individualTransform > 0) {
  // Show cube form (fading out)
  dummy.position.set(position[0], position[1], position[2]);
  dummy.scale.setScalar(scale * (1 - individualTransform)); // Cube fades out
  mesh.setMatrixAt(i, dummy.matrix);

  // Show brain form (fading in) at SAME position
  dummy.scale.setScalar(scale * individualTransform); // Brain fades in
  sphereMesh.setMatrixAt(i, dummy.matrix);
}
```

---

### PHASE 10: ULTRA-REALISTIC BRAIN FORMATION (70.18% - 100% scroll)
**Duration**: 298.2vh of scroll (29.82% of total)
**State**: Two sub-phases for brain formation

## 🌊 EXACT IMPLEMENTATION FOR SPIRAL BRAIN FORMATION

### **PHASE 10A: 729 Pieces Spiral (70.18% - 90%)**:
```javascript
// CRITICAL: Start from exact Phase 9 end positions (no snapping!)
const spiralProgress = (scrollProgress - 0.7018) / 0.1982;
const startPosition = [phase9EndX, phase9EndY, phase9EndZ]; // From Phase 9

// Spiral parameters
const spiralRadius = 30 * (1 - spiralProgress);
const spiralAngle = spiralProgress * Math.PI * 4; // 2 full rotations
const spiralCenter = [0, 0, 0];

// Smooth interpolation from Phase 9 position to spiral to center
const spiralX = Math.cos(spiralAngle + i * 0.1) * spiralRadius;
const spiralY = Math.sin(spiralAngle + i * 0.05) * spiralRadius;
const spiralZ = Math.sin(spiralAngle + i * 0.08) * spiralRadius;

position = [
  startPosition[0] + (spiralX - startPosition[0]) * spiralProgress,
  startPosition[1] + (spiralY - startPosition[1]) * spiralProgress,
  startPosition[2] + (spiralZ - startPosition[2]) * spiralProgress
];
```

### **PHASE 10B: 3000 Smaller Pieces Appear (90% - 100%)**:
```javascript
// 729 pieces fade out, 3000 smaller pieces appear
const finalProgress = (scrollProgress - 0.90) / 0.10;

// 3000 pieces are 50% smaller than smallest 729 piece
const smallest729Size = 0.25 * 2.1 * 0.7; // Minimum perspective * cube size * brain factor
const piece3000Size = smallest729Size * 0.5; // 50% smaller

// CRITICAL: Final brain must be MOUSE ROTATABLE
// Apply mouse rotation to entire brain formation
if (scrollProgress >= 0.90) {
  // Enable mouse control for final brain (like Phase 1)
  const rotationX = (mousePos.y * Math.PI) / 6;
  const rotationY = (mousePos.x * Math.PI) / 6;
  brainGroupRef.current.rotation.x = rotationX;
  brainGroupRef.current.rotation.y = rotationY;
}
```

### **EXPECTED FINAL RESULT**:
Spectacular finale where 729 scattered brain pieces spiral smoothly toward center, then 3000 smaller pieces form the ultra-realistic final brain that responds to mouse rotation, completing the journey from mechanical cube to organic consciousness.

---

## 🔧 CRITICAL IMPLEMENTATION NOTES

### **IMMEDIATE FIXES REQUIRED**:
1. **RESTORE DRAMATIC SPREADING** - Current `maxSpreadX=35, maxSpreadY=20` is TOO SMALL
   - Use dynamic screen-based calculation: `screenWidth3D * 0.8`
   - Remove over-constraining that breaks the explosion effect

2. **EXACT POSITION FORMULAS** - Follow the specific calculations above
   - Phase 2: `position + baseSpread * dismantleProgress * maxSpread`
   - Phase 3+: Lock positions, add perspective scaling
   - Phase 4: Add rotation while maintaining position/scale

3. **PERFORMANCE OPTIMIZATION**:
   - Pre-calculate baseSpread values (don't regenerate each frame)
   - Use `useRef` for rotation accumulation
   - Batch position updates in `useFrame`

4. **VISUAL CONSISTENCY**:
   - Neon blue cubes: `#00ffff` with emissive `#0088aa`
   - White wireframe edges: `#ffffff`
   - Dark atmospheric scene with colored lights

### **SCREEN ADAPTATION**:
```javascript
// Use these exact calculations for screen responsiveness
const fov = 75;
const fovRad = (fov * Math.PI) / 180;
const screenWidth3D = 2 * Math.tan(fovRad / 2) * 50;
const screenHeight3D = screenWidth3D / (window.innerWidth / window.innerHeight);
const maxSpreadX = screenWidth3D * 0.8; // 80% screen coverage
const maxSpreadY = screenHeight3D * 0.8;
```

### **PHASE TRANSITION RULES**:
- **Phase 1→2**: Disable mouse control, enable spreading
- **Phase 2→3**: Lock positions, enable perspective scaling  
- **Phase 3→4**: Add rotations, maintain position/scale
- **Phase 4→5**: Replace 27 cubes with 729 mini-cubes
- **Phase 5→6**: Add mini-cube rotations
- **Phase 6→7**: Additional scattering
- **Phase 7→8**: Brain transformation and spiral convergence

## ✅ APPROVAL REQUIRED
This ultra-detailed specification must be explicitly approved before any code implementation begins.

**CRITICAL**: The current code is broken due to over-constraining. This specification provides exact formulas to restore the dramatic effect while maintaining screen responsiveness.

**User Approval**: [ ] APPROVED / [ ] NEEDS CHANGES

---

*Document Version: 2.0 - ULTRA-DETAILED*  
*Updated: With exact implementation formulas and screen adaptation*
*Problem Diagnosis: Identified over-constraining causing animation failure*