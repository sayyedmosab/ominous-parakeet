import React, { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { createNoise3D } from "simplex-noise"

// ULTRA-REALISTIC Brain formation system - Creates thousands of equal-sized brain pieces
const createBrainFormation = (
  totalPieces: number,
): Array<{
  position: [number, number, number];
  hemisphere: "left" | "right";
  region:
    | "frontal"
    | "parietal"
    | "temporal"
    | "occipital"
    | "cerebellum";
}> => {
  const noise3D = createNoise3D();
  const brainFormation: Array<{
    position: [number, number, number];
    hemisphere: "left" | "right";
    region:
      | "frontal"
      | "parietal"
      | "temporal"
      | "occipital"
      | "cerebellum";
  }> = [];

  // ENHANCED: Neuroanatomically accurate brain proportions based on human brain MRI data
  const brainWidth = 20.0; // Slightly wider for realism
  const brainHeight = 16.5; // More accurate height ratio  
  const brainDepth = 24.0; // Enhanced front-to-back depth for frontal lobe prominence

  for (let i = 0; i < totalPieces; i++) {
    // Create layered brain distribution
    const layerProgress = i / totalPieces;

    // Use spherical coordinates with brain-like deformation
    const phi = Math.acos(2 * Math.random() - 1); // 0 to π (vertical angle)
    const theta = 2 * Math.PI * Math.random(); // 0 to 2π (horizontal angle)

    // Base brain-shaped ellipsoid
    let x = Math.sin(phi) * Math.cos(theta) * brainWidth * 0.5;
    let y = Math.cos(phi) * brainHeight * 0.5;
    let z = Math.sin(phi) * Math.sin(theta) * brainDepth * 0.5;

    // Add realistic brain shape deformations
    const frontWeight = Math.max(0, z / (brainDepth * 0.5)); // Frontal lobe prominence
    const backWeight = Math.max(0, -z / (brainDepth * 0.5)); // Occipital lobe

    // Frontal lobe expansion (front of brain is larger)
    if (z > 0) {
      x *= 1 + frontWeight * 0.3;
      y *= 1 + frontWeight * 0.2;
    }

    // Brain stem narrowing (bottom center)
    if (
      y < -brainHeight * 0.3 &&
      Math.abs(x) < brainWidth * 0.2 &&
      Math.abs(z) < brainDepth * 0.2
    ) {
      x *= 0.4; // Narrow brain stem
      z *= 0.4;
    }

    // ENHANCED: Neuroanatomically accurate cerebellum with characteristic foliation
    if (y < -brainHeight * 0.1 && z < -brainDepth * 0.2) {
      y -= 2.8; // More prominent cerebellum positioning
      x *= 0.75; // Narrower for anatomical accuracy
      
      // Add characteristic cerebellar foliation pattern
      const cerebellarNoise = noise3D(x * 0.2, y * 0.2, z * 0.2) * 1.5;
      y += Math.sin(x * 0.3) * cerebellarNoise * 0.5; // Horizontal foliation
    }

    // ULTRA-ENHANCED: 4-octave noise for neuromorphic cortical folding (React 19 + Three.js 0.172.0)
    const noiseScale = 0.06; // Finer scale for ultra-realistic brain surface detail
    
    // 4-octave fractal noise for complex cortical patterns
    const surfaceNoise =
      noise3D(x * noiseScale, y * noiseScale, z * noiseScale) * 5.0 +      // Primary cortical folds
      noise3D(x * noiseScale * 2, y * noiseScale * 2, z * noiseScale * 2) * 2.5 +  // Secondary gyri
      noise3D(x * noiseScale * 4, y * noiseScale * 4, z * noiseScale * 4) * 1.25 + // Tertiary sulci
      noise3D(x * noiseScale * 8, y * noiseScale * 8, z * noiseScale * 8) * 0.625; // Micro-texture

    // Additional layer for region-specific cortical complexity
    const regionComplexity = Math.sin(z * 0.1) * Math.cos(x * 0.08) * 1.5;
    const combinedNoise = surfaceNoise + regionComplexity;

    // Apply neuromorphic surface displacement with anatomically accurate folding
    const surfaceRadius = Math.sqrt(x * x + y * y + z * z);
    if (surfaceRadius > 0) {
      const normalX = x / surfaceRadius;
      const normalY = y / surfaceRadius;
      const normalZ = z / surfaceRadius;

      // Enhanced cortical folding with region-specific intensity
      let foldingStrength = 3.0; // Base neuromorphic folding strength
      
      // Frontal cortex has deeper sulci
      if (z > brainDepth * 0.2) {
        foldingStrength *= 1.4;
      }
      
      // Temporal lobes have complex folding patterns
      if (Math.abs(x) > brainWidth * 0.3 && y > -brainHeight * 0.2) {
        foldingStrength *= 1.3;
      }

      // Apply the enhanced surface displacement
      x += normalX * combinedNoise * foldingStrength;
      y += normalY * combinedNoise * foldingStrength;
      z += normalZ * combinedNoise * foldingStrength;
    }

    // Determine hemisphere
    const hemisphere: "left" | "right" =
      x < 0 ? "left" : "right";

    // Determine brain region based on position
    let region:
      | "frontal"
      | "parietal"
      | "temporal"
      | "occipital"
      | "cerebellum";

    if (y < -brainHeight * 0.1 && z < -brainDepth * 0.2) {
      region = "cerebellum";
    } else if (z > brainDepth * 0.2) {
      region = "frontal";
    } else if (z < -brainDepth * 0.2) {
      region = "occipital";
    } else if (
      Math.abs(x) > brainWidth * 0.3 &&
      y > -brainHeight * 0.2
    ) {
      region = "temporal";
    } else {
      region = "parietal";
    }

    brainFormation.push({
      position: [x, y, z],
      hemisphere,
      region,
    });
  }

  return brainFormation;
};

// Smooth easing functions
const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Thousands of brain pieces component for ultra-realistic final brain
const ThousandsBrainInstanced = React.memo(function ThousandsBrainInstanced({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  const BRAIN_PIECES_COUNT = 3000; // 3000 pieces for ultra-realistic detail
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const wireRef = useRef<THREE.InstancedMesh | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // BRAIN FEATURE-BASED COLORING: Highlight anatomical features
  const getBrainFeatureColor = (region: string, position: [number, number, number]): THREE.Color => {
    const [x, y, z] = position;
    
    // Calculate noise-based cortical complexity at this position
    const noise3D = createNoise3D();
    const noiseScale = 0.06;
    const surfaceNoise = 
      noise3D(x * noiseScale, y * noiseScale, z * noiseScale) * 5.0 +
      noise3D(x * noiseScale * 2, y * noiseScale * 2, z * noiseScale * 2) * 2.5;
    
    const brainWidth = 20.0;
    const brainHeight = 16.5;
    const brainDepth = 24.0;
    
    // 1. BRAIN STEM (narrow central area) - BRIGHT BLUE
    if (y < -brainHeight * 0.3 && Math.abs(x) < brainWidth * 0.2 && Math.abs(z) < brainDepth * 0.2) {
      return new THREE.Color(0.0, 0.8, 1.0); // Bright cyan - brain stem
    }
    
    // 2. CEREBELLUM with foliation - ORANGE-RED gradient based on foliation
    if (y < -brainHeight * 0.1 && z < -brainDepth * 0.2) {
      const cerebellarNoise = noise3D(x * 0.2, y * 0.2, z * 0.2) * 1.5;
      const foliationIntensity = Math.abs(Math.sin(x * 0.3) * cerebellarNoise);
      return new THREE.Color(1.0, 0.3 + foliationIntensity * 0.4, 0.0); // Orange to red based on foliation
    }
    
    // 3. DEEP CORTICAL FOLDS (high surface noise) - BRIGHT MAGENTA
    if (Math.abs(surfaceNoise) > 3.5) {
      return new THREE.Color(1.0, 0.0, 0.8); // Bright magenta - deep sulci/gyri
    }
    
    // 4. FRONTAL PROMINENCE - GREEN gradient based on prominence
    if (z > brainDepth * 0.2) {
      const frontWeight = z / (brainDepth * 0.5);
      return new THREE.Color(0.0, 0.6 + frontWeight * 0.4, 0.2); // Green gradient - frontal prominence
    }
    
    // 5. SURFACE COMPLEXITY - YELLOW-WHITE based on folding intensity
    const foldingIntensity = Math.abs(surfaceNoise) / 5.0;
    if (foldingIntensity > 0.4) {
      return new THREE.Color(1.0, 1.0, 0.3 + foldingIntensity * 0.4); // Yellow to white - surface complexity
    }
    
    // 6. TEMPORAL REGION COMPLEXITY - PURPLE-BLUE
    if (Math.abs(x) > brainWidth * 0.3 && y > -brainHeight * 0.2) {
      const temporalComplexity = Math.abs(Math.sin(z * 0.1) * Math.cos(x * 0.08));
      return new THREE.Color(0.4 + temporalComplexity * 0.4, 0.0, 0.8); // Purple-blue - temporal complexity
    }
    
    // 7. DEFAULT CORTEX - Soft pink-gray based on region
    switch (region) {
      case "frontal": return new THREE.Color(0.9, 0.6, 0.7); // Soft pink
      case "parietal": return new THREE.Color(0.8, 0.7, 0.9); // Soft lavender  
      case "temporal": return new THREE.Color(0.7, 0.8, 0.9); // Soft blue
      case "occipital": return new THREE.Color(0.9, 0.8, 0.6); // Soft gold
      default: return new THREE.Color(0.8, 0.8, 0.8); // Soft gray
    }
  };

  // Create thousands of brain positions
  const brainFormation = useMemo(() => {
    return createBrainFormation(BRAIN_PIECES_COUNT);
  }, []);

  // CORRECTED: 50% smaller than smallest 729 piece
  const sphereGeo = useMemo(
    () => {
      // Smallest 729 piece: perspective scale 0.25 * cube size 2.1 * brain factor 0.7 = 0.3675
      // 3000 pieces: 50% smaller = 0.3675 * 0.5 = 0.18375
      return new THREE.SphereGeometry(0.18375, 12, 12);
    },
    [],
  );
  const sphereEdgeGeo = useMemo(
    () => new THREE.EdgesGeometry(sphereGeo),
    [],
  );
  
  // ENHANCED: Ultra-realistic brain material for INSTANCE COLORS (not vertex colors)
  const brainMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff", // Base white - will be multiplied by instance colors
        emissive: "#222222", // Minimal emissive for visibility
        emissiveIntensity: 0.2, // Low but visible
        metalness: 0.1,
        roughness: 0.8,
        transparent: true,
        opacity: 0.95,
        // NO vertexColors for InstancedMesh - use instanceColor instead
      }),
    [],
  );
  
  // WHITE edges for contrast against pink brain material
  const brainWireMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#ffffff", // WHITE edges for maximum contrast
        transparent: false,
        opacity: 1,
        linewidth: 6,
      }),
    [],
  );

  useFrame(() => {
    if (!meshRef.current || !wireRef.current) return;

    const mesh = meshRef.current;
    const wire = wireRef.current;

    // Only show at the very END of Phase 10: Ultra-Realistic Brain Formation (90-100%)
    if (scrollProgress >= 0.90) {
      const brainFormationProgress = (scrollProgress - 0.90) / 0.10;
      
      // Initialize instance colors if not done yet
      if (!mesh.instanceColor) {
        const colors = new Float32Array(BRAIN_PIECES_COUNT * 3);
        for (let i = 0; i < BRAIN_PIECES_COUNT; i++) {
          const brainPiece = brainFormation[i];
          const featureColor = getBrainFeatureColor(brainPiece.region, brainPiece.position);
          colors[i * 3] = featureColor.r;
          colors[i * 3 + 1] = featureColor.g;
          colors[i * 3 + 2] = featureColor.b;
        }
        mesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
        mesh.instanceColor.needsUpdate = true; // CRITICAL: Mark for update
      }
      
      // Update all thousands of brain pieces
      for (let i = 0; i < BRAIN_PIECES_COUNT; i++) {
        const brainPiece = brainFormation[i];
        
        // Ultra-slow spiral formation
        const spiralProgress = Math.min(brainFormationProgress * 1.5, 1);
        const spiralRadius = 40 * (1 - spiralProgress);
        const spiralAngle = spiralProgress * Math.PI * 4; // 2 full rotations
        
        // Start from spiral position and move to final brain position
        const startX = Math.cos(spiralAngle + i * 0.1) * spiralRadius;
        const startY = Math.sin(spiralAngle + i * 0.05) * spiralRadius;
        const startZ = Math.sin(spiralAngle + i * 0.08) * spiralRadius;
        
        // Use the DETAILED neuromorphic positions (with 4-octave noise folding!)
        const finalX = brainPiece.position[0];
        const finalY = brainPiece.position[1];
        const finalZ = brainPiece.position[2];
        
        // Smooth interpolation from spiral to final position
        const smoothProgress = easeInOutCubic(spiralProgress);
        const currentX = startX + (finalX - startX) * smoothProgress;
        const currentY = startY + (finalY - startY) * smoothProgress;
        const currentZ = startZ + (finalZ - startZ) * smoothProgress;
        
        // Set position and scale - small equal-sized pieces for final brain detail
        dummy.position.set(currentX, currentY, currentZ);
        dummy.scale.setScalar(1.0); // All pieces equal size, 50% smaller than 729 pieces
        
        // Gentle rotation for organic feel
        const time = Date.now() * 0.001;
        dummy.rotation.set(
          time * 0.1 + i * 0.01,
          time * 0.08 + i * 0.008,
          time * 0.12 + i * 0.012
        );
        
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        wire.setMatrixAt(i, dummy.matrix);
      }
      
      mesh.instanceMatrix.needsUpdate = true;
      wire.instanceMatrix.needsUpdate = true;
      mesh.visible = true;
      wire.visible = true;
    } else {
      // Hide during other phases
      mesh.visible = false;
      wire.visible = false;
    }
  });

  return (
    <group>
      {/* Brain mesh instances */}
      <instancedMesh
        ref={meshRef}
        args={[sphereGeo, brainMat, BRAIN_PIECES_COUNT]}
        visible={false}
      />
      {/* Brain wireframe instances for contrast */}
      <instancedMesh
        ref={wireRef}
        args={[sphereEdgeGeo, brainWireMat, BRAIN_PIECES_COUNT]}
        visible={false}
      />
    </group>
  );
});

export default ThousandsBrainInstanced;