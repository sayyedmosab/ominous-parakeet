import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import ThousandsBrainInstanced from "./ThousandsBrainInstanced";
import UnifiedRubiksCubes from "./UnifiedRubiksCubes";

/*
🎯 ENHANCED 10-PHASE RUBIK'S CUBE TO BRAIN ANIMATION:

✅ Phase 1 (0-2.01%): Group Rotate
   - Mouse-controlled rotation of entire cube as one object

✅ Phase 2 (2.01-12.06%): First Dismantle  
   - 27 pieces explode outward into dramatic cloud filling screen

✅ Phase 3 (12.06-14.48%): Settle with Perspective
   - Pieces hold positions with perspective scaling (larger at bottom)

❌ Phase 4: CANCELLED - Time redistributed to Phases 5-10

✅ Phase 5 (14.48-26.32%): Rubik's Cube Transform
   - Each of 27 pieces transforms into its own Rubik's cube

🆕 Phase 6 (26.32-35.09%): Rubik's Cube Showcase - NEW DEDICATED PHASE
   - Full display of 27 perfect Rubik's cubes with crystal-clear white edges
   - Individual rotations, breathing animations, living movement

✅ Phase 7 (35.09-43.86%): Second Dismantle (FIXED CONSTRAINTS)
   - 27 Rubik's cubes split into 729 pieces (proper 5% padding)

✅ Phase 8 (43.86-52.63%): Independent Rotation
   - 729 pieces settle and rotate independently, all visible

✅ Phase 9 (52.63-70.18%): Neuromorphic Brain Transform - BRIGHT COLORS FOR TESTING
   - Cubes transform in large waves: 100 cubes transform simultaneously
   - RED, GREEN, BLUE, YELLOW, ORANGE brain regions for testing
   - Size back to *0.7 as requested

✅ Phase 10 (70.18-100%): Spiral Brain Formation - RESTRUCTURED
   - Phase 10a (70.18-90%): 729 pieces from Phase 9 do spiral merge
   - Phase 10b (90-100%): 3000 NEW smaller pieces appear for final detail
*/

// Get phase name for display (NEW 10-PHASE STRUCTURE)
function getPhaseName(progress: number): string {
  if (progress < 0.0201) return "Group Rotate";
  if (progress < 0.1206) return "First Dismantle";
  if (progress < 0.1448) return "Settle with Perspective";
  if (progress < 0.2632) return "Rubik's Cube Transform";
  if (progress < 0.3509) return "🆕 Rubik's Cube Showcase";
  if (progress < 0.4386) return "Second Dismantle";
  if (progress < 0.5263) return "Independent Rotation";
  if (progress < 0.7018) return "Neuromorphic Brain Transform";
  if (progress < 0.90) return "Brain Spiral Formation (729 pieces)";
  return "Ultra-Realistic Brain (3000 pieces)";
}

// Cube data interface
interface CubeData {
  id: string;
  index: number;
  position: [number, number, number];
  color: string;
  baseSpread: [number, number, number];
  rotationData?: {
    rotationSpeed: number;
    rotationAxis: THREE.Vector3;
    accumulatedRotation: THREE.Euler;
  };
}

// Individual mini-cube data for Phase 5+ (729 total mini-cubes)
interface MiniCubeData {
  id: string;
  parentIndex: number; // Which of the 27 original cubes this came from
  localIndex: number; // Which of the 27 pieces within that parent cube
  localPosition: [number, number, number]; // Position within the parent Rubik's cube formation
  baseSpread: [number, number, number]; // For Phase 6 dismantling (SAME as first dismantle)
  rotationData: {
    rotationSpeed: number;
    rotationAxis: THREE.Vector3;
    accumulatedRotation: THREE.Euler;
  };
  brainTransform: {
    popDelay: number; // For popcorn effect timing
    spiralRadius: number; // Starting spiral radius
    spiralSpeed: number; // Spiral acceleration factor
    brainPosition: [number, number, number]; // Target position in final brain formation
    hemisphere: "left" | "right"; // Brain hemisphere assignment
    brainRegion:
      | "frontal"
      | "parietal"
      | "temporal"
      | "occipital"
      | "cerebellum"; // Brain region
  };
  size: number;
}

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

// Smooth easing functions for butter-smooth animations
const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const easeOutElastic = (t: number): number => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return (
    Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1
  );
};

const easeInOutQuart = (t: number): number => {
  return t < 0.5
    ? 8 * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 4) / 2;
};

const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Smooth interpolation utility
const smoothLerp = (
  a: number,
  b: number,
  t: number,
): number => {
  return a + (b - a) * easeInOutQuart(t);
};

const smoothVec3Lerp = (
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] => {
  return [
    smoothLerp(a[0], b[0], t),
    smoothLerp(a[1], b[1], t),
    smoothLerp(a[2], b[2], t),
  ];
};

// Individual cube piece component - PHASES 1-4 WITH BUTTER-SMOOTH TRANSITIONS
const CubePiece = React.memo(function CubePiece({
  cubeData,
  scrollProgress,
}: {
  cubeData: CubeData;
  scrollProgress: number;
}) {
  const groupRef = useRef<any>(null);

  // Create edge geometry for black wireframe edges (1.5x SIZE)
  const edgeGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(new THREE.BoxGeometry(5.25, 5.25, 5.25));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    let position: [number, number, number] = [
      ...cubeData.position,
    ];
    let scale = 1;
    let shakeOffset = [0, 0, 0];

    // Calculate screen-adaptive spread values (FURTHER REDUCED SCALING)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const aspectRatio = viewportWidth / viewportHeight;

    const fov = 75;
    const fovRad = (fov * Math.PI) / 180;
    const screenWidth3D = 2 * Math.tan(fovRad / 2) * 50; // FURTHER REDUCED SCALING for camera at 50
    const screenHeight3D = screenWidth3D / aspectRatio;

    // 5% padding around border - constrain to 90% of screen with 5% padding on each side
    const maxSpreadX = screenWidth3D * 0.45; // 45% to each side (90% total with 5% padding)
    const maxSpreadY = screenHeight3D * 0.45; // 45% to each side (90% total with 5% padding)
    const maxSpreadZ = 30; // FURTHER REDUCED SCALING: 60 -> 30

    // Phase 1: Group Rotate (0.00-2.01%)
    if (scrollProgress < 0.0201) {
      position = [...cubeData.position];
      scale = 1;

      if (groupRef.current && cubeData.rotationData) {
        groupRef.current.rotation.set(0, 0, 0);
      }
    }
    // Phase 2: First Dismantle (2.01-12.06%) - Dramatic cloud filling screen
    else if (
      scrollProgress >= 0.0201 &&
      scrollProgress < 0.1206
    ) {
      const rawProgress = (scrollProgress - 0.0201) / 0.1005;
      const dismantleProgress = easeInOutCubic(rawProgress);

      position = [
        cubeData.position[0] +
          cubeData.baseSpread[0] *
            dismantleProgress *
            maxSpreadX,
        cubeData.position[1] +
          cubeData.baseSpread[1] *
            dismantleProgress *
            maxSpreadY,
        cubeData.position[2] +
          cubeData.baseSpread[2] *
            dismantleProgress *
            maxSpreadZ,
      ];

      const normalizedY =
        (position[1] - -maxSpreadY) / (2 * maxSpreadY);
      scale = Math.max(
        0.25,
        Math.min(1.0, 1.0 - normalizedY * 0.75),
      );
    }
    // Phase 3: Settle with Perspective (12.06-14.48%)
    else if (
      scrollProgress >= 0.1206 &&
      scrollProgress < 0.1448
    ) {
      position = [
        cubeData.position[0] +
          cubeData.baseSpread[0] * maxSpreadX,
        cubeData.position[1] +
          cubeData.baseSpread[1] * maxSpreadY,
        cubeData.position[2] +
          cubeData.baseSpread[2] * maxSpreadZ,
      ];

      const normalizedY =
        (position[1] - -maxSpreadY) / (2 * maxSpreadY);
      scale = Math.max(
        0.25,
        Math.min(1.0, 1.0 - normalizedY * 0.75),
      );
    }
    // Phase 5: Rubik's Cube Transform (14.48-26.32%)
    else if (
      scrollProgress >= 0.1448 &&
      scrollProgress < 0.2632
    ) {
      const rawProgress = (scrollProgress - 0.1448) / 0.1184;

      position = [
        cubeData.position[0] +
          cubeData.baseSpread[0] * maxSpreadX,
        cubeData.position[1] +
          cubeData.baseSpread[1] * maxSpreadY,
        cubeData.position[2] +
          cubeData.baseSpread[2] * maxSpreadZ,
      ];

      const normalizedY =
        (position[1] - -maxSpreadY) / (2 * maxSpreadY);
      const baseScale = Math.max(
        0.25,
        Math.min(1.0, 1.0 - normalizedY * 0.75),
      );

      // Fade out as Rubik's cubes appear
      const fadeProgress = easeInOutCubic(rawProgress);
      scale = baseScale * (1 - fadeProgress);
    }
    // Phase 6: Rubik's Cube Showcase (26.32-35.09%) - COMPLETELY HIDDEN
    else if (
      scrollProgress >= 0.2632 &&
      scrollProgress < 0.3509
    ) {
      // Original cubes are completely hidden during showcase
      scale = 0;
    }
    // Phase 7+: Hide original cubes (Rubik's cubes and mini-cubes take over)
    else {
      scale = 0;
    }

    // Apply position with shake, scale, and immediate response
    groupRef.current.position.set(
      position[0] + shakeOffset[0],
      position[1] + shakeOffset[1],
      position[2] + shakeOffset[2],
    );
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[5.25, 5.25, 5.25]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#0088aa"
          emissiveIntensity={0.3}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color="#ffffff" linewidth={6} />
      </lineSegments>
    </group>
  );
});

// Instanced mini-cubes component for efficient rendering of 729 pieces
const MiniInstanced = React.memo(function MiniInstanced({
  miniCubes,
  parentCubes,
  scrollProgress,
}: {
  miniCubes: MiniCubeData[];
  parentCubes: CubeData[];
  scrollProgress: number;
}) {
  const count = miniCubes.length;
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const wireRef = useRef<THREE.InstancedMesh | null>(null);
  const sphereMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const sphereWireRef = useRef<THREE.InstancedMesh | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Shared geometries and materials (50/75 SCALE + 1.5x SIZE)
  const cubeGeo = useMemo(
    () => new THREE.BoxGeometry(2.1, 2.1, 2.1),
    [],
  );
  const cubeEdgeGeo = useMemo(
    () => new THREE.EdgesGeometry(cubeGeo),
    [],
  ); // WHITE EDGES for cubes (during brain phases)
  // ENHANCED: Higher resolution sphere geometry for ultra-realistic brain morphing
  const sphereGeo = useMemo(
    () => new THREE.SphereGeometry(2.1 * 0.7, 16, 16), // Back to original size *0.7 as requested
    [],
  );
  const sphereEdgeGeo = useMemo(
    () => new THREE.EdgesGeometry(sphereGeo),
    [],
  ); // WHITE EDGES for spheres (brain contrast)
  const cubeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#00ffff",
        emissive: "#0088aa",
        emissiveIntensity: 0.4,
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 1,
      }),
    [],
  );
  const wireMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#ffffff", // FIXED: WHITE edges for brain cubes for contrast against pink
        transparent: false, // Make edges fully opaque
        linewidth: 6, // WebGL linewidth limitation
        opacity: 1,
      }),
    [],
  );

  // Enhanced edge material for maximum visibility - WHITE EDGES for better contrast
  const edgeMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#ffffff", // WHITE edges for maximum contrast against blue cubes
        transparent: false,
        opacity: 1,
        linewidth: 6, // Same thickness as original cubes
      }),
    [],
  );
  // ENHANCED: Ultra-realistic brain material with vertex colors for regional variation
  const brainMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff", // White base - let vertex colors control the final color
        emissive: "#ff2266",
        emissiveIntensity: 0.6,
        metalness: 0.15, // Reduced for more biological appearance
        roughness: 0.7, // Increased for realistic brain tissue texture
        transparent: true,
        opacity: 0.95, // Slightly transparent for organic feel
        vertexColors: true, // Enable per-instance vertex colors for brain regions
      }),
    [],
  );

  // Precompute and pack per-instance data into typed arrays
  const packed = useMemo(() => {
    const basePos = new Float32Array(count * 3);
    const localPos = new Float32Array(count * 3);
    const baseSpread = new Float32Array(count * 3);
    const brainTarget = new Float32Array(count * 3);
    const popDelay = new Float32Array(count);
    const rotAxis = new Float32Array(count * 3);
    const rotSpeed = new Float32Array(count);
    const sizes = new Float32Array(count);
    const brainRegionColors = new Float32Array(count * 3); // RGB colors
    const isInFirstWave = new Float32Array(count); // Boolean as float

    // Calculate screen-adaptive spread values once
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1920;
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 1080;
    const aspectRatio = viewportWidth / viewportHeight;
    const fov = 75;
    const fovRad = (fov * Math.PI) / 180;
    const screenWidth3D = 2 * Math.tan(fovRad / 2) * 50; // FURTHER REDUCED SCALING for camera at 50
    const screenHeight3D = screenWidth3D / aspectRatio;
    const maxSpreadX = screenWidth3D * 0.45;
    const maxSpreadY = screenHeight3D * 0.45;
    const maxSpreadZ = 30; // FURTHER REDUCED SCALING: 60 -> 30

    for (let i = 0; i < count; i++) {
      const m = miniCubes[i];
      const parent = parentCubes[m.parentIndex];

      // Precompute parent position (Phase 4 final position)
      const parentPos = [
        parent.position[0] + parent.baseSpread[0] * maxSpreadX,
        parent.position[1] + parent.baseSpread[1] * maxSpreadY,
        parent.position[2] + parent.baseSpread[2] * maxSpreadZ,
      ];

      basePos.set(parentPos, i * 3);
      localPos.set(m.localPosition, i * 3);
      baseSpread.set(m.baseSpread, i * 3);
      brainTarget.set(m.brainTransform.brainPosition, i * 3);
      popDelay[i] = m.brainTransform.popDelay ?? 0;
      rotAxis.set(
        [
          m.rotationData.rotationAxis.x,
          m.rotationData.rotationAxis.y,
          m.rotationData.rotationAxis.z,
        ],
        i * 3,
      );
      rotSpeed[i] = m.rotationData.rotationSpeed;
      sizes[i] = m.size;

      // Precompute brain region colors - TESTING: Completely different colors (no pink)
      const getBrainRegionColorRGB = (
        region: string,
      ): [number, number, number] => {
        switch (region) {
          case "frontal":
            return [1.0, 0.0, 0.0]; // RED - frontal cortex
          case "parietal":
            return [0.0, 1.0, 0.0]; // GREEN - parietal lobe
          case "temporal":
            return [0.0, 0.0, 1.0]; // BLUE - temporal lobe
          case "occipital":
            return [1.0, 1.0, 0.0]; // YELLOW - occipital lobe
          case "cerebellum":
            return [1.0, 0.5, 0.0]; // ORANGE - cerebellum
          default:
            return [0.5, 0.0, 1.0]; // PURPLE - default
        }
      };

      const colorRGB = getBrainRegionColorRGB(
        m.brainTransform.brainRegion,
      );
      brainRegionColors.set(colorRGB, i * 3);

      // Check if in first wave (first 100 cubes for larger simultaneous groups)
      const cubeIndex = m.parentIndex * 27 + m.localIndex;
      isInFirstWave[i] = cubeIndex < 100 ? 1 : 0;
    }

    return {
      basePos,
      localPos,
      baseSpread,
      brainTarget,
      popDelay,
      rotAxis,
      rotSpeed,
      sizes,
      brainRegionColors,
      isInFirstWave,
      maxSpreadX,
      maxSpreadY,
      maxSpreadZ,
    };
  }, [miniCubes, parentCubes]);

  useFrame(() => {
    if (
      !meshRef.current ||
      !wireRef.current ||
      !sphereMeshRef.current ||
      !sphereWireRef.current
    )
      return;

    const mesh = meshRef.current;
    const wire = wireRef.current;
    const sphereMesh = sphereMeshRef.current;
    const sphereWire = sphereWireRef.current;

    // Initialize brain instance colors if not done yet (for regional color variation) 
    if (!sphereMesh.instanceColor && scrollProgress >= 0.5263) {
      const colors = new Float32Array(count * 3);
      for (let j = 0; j < count; j++) {
        const regionColorR = packed.brainRegionColors[j * 3 + 0];
        const regionColorG = packed.brainRegionColors[j * 3 + 1]; 
        const regionColorB = packed.brainRegionColors[j * 3 + 2];
        colors[j * 3] = regionColorR;
        colors[j * 3 + 1] = regionColorG;
        colors[j * 3 + 2] = regionColorB;
      }
      sphereMesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
    }

    // Update all 729 instances in a single loop
    for (let i = 0; i < count; i++) {
      // Read packed data for this instance
      const px = packed.basePos[i * 3 + 0];
      const py = packed.basePos[i * 3 + 1];
      const pz = packed.basePos[i * 3 + 2];
      const lx = packed.localPos[i * 3 + 0];
      const ly = packed.localPos[i * 3 + 1];
      const lz = packed.localPos[i * 3 + 2];
      const bx = packed.baseSpread[i * 3 + 0];
      const by = packed.baseSpread[i * 3 + 1];
      const bz = packed.baseSpread[i * 3 + 2];
      const btx = packed.brainTarget[i * 3 + 0];
      const bty = packed.brainTarget[i * 3 + 1];
      const btz = packed.brainTarget[i * 3 + 2];
      const cubeIndex = Math.floor(i / 27) * 27 + (i % 27);
      const isFirstWave = packed.isInFirstWave[i] === 1;

      // Calculate transformation progress with SIMULTANEOUS WAVES
      let transformProgress = 0;
      let isInBrainFormation = false;

      if (scrollProgress >= 0.5263 && scrollProgress < 0.7018) {
        const rawProgress = (scrollProgress - 0.5263) / 0.1755;

        // More simultaneous transformation with wave groups
        const waveSize = 100; // Transform 100 cubes at once
        const waveIndex = Math.floor(cubeIndex / waveSize);
        const totalWaves = Math.ceil(729 / waveSize);

        // Each wave starts with a small delay but transforms quickly
        const waveStartDelay = (waveIndex / totalWaves) * 0.4; // Only 40% of phase for staggering
        const waveProgress = Math.max(
          0,
          (rawProgress - waveStartDelay) / (1 - waveStartDelay),
        );

        // Fast transformation once wave starts
        transformProgress = Math.min(
          1,
          easeInOutCubic(waveProgress) * 1.5,
        );
        transformProgress = Math.max(0, transformProgress);
      } else if (scrollProgress >= 0.7018) {
        transformProgress = 1;
        isInBrainFormation = true;
      }

      // Calculate parent's perspective scale
      const normalizedY =
        (py - -packed.maxSpreadY) / (2 * packed.maxSpreadY);
      const perspectiveScale = Math.max(
        0.25,
        Math.min(1.0, 1.0 - normalizedY * 0.75),
      );

      let position: [number, number, number] = [0, 0, 0];
      let scale = 0;
      let rotation = new THREE.Euler(0, 0, 0);

      // UPDATED PHASE 10 LOGIC: 729 pieces continue through spiral (70.18-90%), then hide (90-100%)
      if (scrollProgress >= 0.7018 && scrollProgress < 0.90) {
        // Phase 10a: 729 pieces spiral to center (70.18-90%)
        const spiralProgress = (scrollProgress - 0.7018) / 0.1982;
        const easedSpiral = easeInOutCubic(spiralProgress);
        
        // Calculate spiral parameters
        const spiralRadius = 30 * (1 - easedSpiral);
        const spiralAngle = easedSpiral * Math.PI * 4; // 2 full rotations
        const spiralHeight = Math.sin(spiralProgress * Math.PI) * 10;
        
        // Start from current brain position and spiral to center
        const startX = btx;
        const startY = bty;
        const startZ = btz;
        
        const spiralX = Math.cos(spiralAngle + i * 0.1) * spiralRadius;
        const spiralY = Math.sin(spiralAngle + i * 0.05) * spiralRadius + spiralHeight;
        const spiralZ = Math.sin(spiralAngle + i * 0.08) * spiralRadius;
        
        // Move from brain position to spiral to center
        position = [
          startX + (spiralX - startX) * (1 - easedSpiral),
          startY + (spiralY - startY) * (1 - easedSpiral),
          startZ + (spiralZ - startZ) * (1 - easedSpiral)
        ];
        
        // Keep brain form and colors
        scale = perspectiveScale * 0.7; // Same as Phase 9 brain size
        
        // Set visibility for brain form
        dummy.position.set(position[0], position[1], position[2]);
        dummy.scale.setScalar(scale);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        sphereMesh.setMatrixAt(i, dummy.matrix);
        sphereWire.setMatrixAt(i, dummy.matrix);
        
        // Hide cube form
        mesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        wire.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        
        continue;
      }
      // Phase 10b: 729 pieces fade out as 3000 take over (90-100%)
      else if (scrollProgress >= 0.90) {
        // Hide 729 pieces completely - 3000 pieces handle the final brain
        mesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        wire.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        sphereMesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        sphereWire.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        continue;
      }

      // Phase logic - UPDATED: MiniInstanced starts from Phase 7 (individual pieces)
      // Phases 5-6 are handled by UnifiedRubiksCubes component
      if (
        scrollProgress >= 0.3509 &&
        scrollProgress < 0.4386
      ) {
        // Phase 7: Second dismantle (from unified Rubik's cubes to individual pieces)
        const rawProgress = (scrollProgress - 0.3509) / 0.0877;
        const dismantleProgress = easeInOutCubic(rawProgress);

        // Start from the unified Rubik's cube position (same as Phase 3 spread position)
        const unifiedCubePosition = [
          px, // Use parent position directly
          py,
          pz,
        ];
        const reducedSpreadMultiplier = 0.3;

        position = [
          unifiedCubePosition[0] +
            bx *
              dismantleProgress *
              packed.maxSpreadX *
              reducedSpreadMultiplier,
          unifiedCubePosition[1] +
            by *
              dismantleProgress *
              packed.maxSpreadY *
              reducedSpreadMultiplier,
          unifiedCubePosition[2] +
            bz *
              dismantleProgress *
              packed.maxSpreadZ *
              reducedSpreadMultiplier,
        ];

        const newNormalizedY =
          (position[1] - -packed.maxSpreadY) /
          (2 * packed.maxSpreadY);
        scale = Math.max(
          0.25,
          Math.min(1.0, 1.0 - newNormalizedY * 0.75),
        );
      } else if (
        scrollProgress >= 0.4386 &&
        scrollProgress < 0.5263
      ) {
        // Phase 8: Independent Rotation with LIVING MOVEMENT
        const rawProgress = (scrollProgress - 0.4386) / 0.0877;
        const rotationProgress = easeInOutCubic(rawProgress);

        const basePosition = [
          px + lx * perspectiveScale,
          py + ly * perspectiveScale,
          pz + lz * perspectiveScale,
        ];
        const reducedSpreadMultiplier = 0.3;

        // Base position with hovering motion
        const time = Date.now() * 0.001;
        const hoverAmplitude = 1.5; // Gentle hovering (50/75 scale + 1.5x)
        const hoverX =
          Math.sin(time + i * 0.1) * hoverAmplitude;
        const hoverY =
          Math.cos(time * 0.7 + i * 0.15) * hoverAmplitude;
        const hoverZ =
          Math.sin(time * 0.5 + i * 0.12) * hoverAmplitude;

        position = [
          basePosition[0] +
            bx * packed.maxSpreadX * reducedSpreadMultiplier +
            hoverX,
          basePosition[1] +
            by * packed.maxSpreadY * reducedSpreadMultiplier +
            hoverY,
          basePosition[2] +
            bz * packed.maxSpreadZ * reducedSpreadMultiplier +
            hoverZ,
        ];

        const newNormalizedY =
          (position[1] - -packed.maxSpreadY) /
          (2 * packed.maxSpreadY);
        scale = Math.max(
          0.25,
          Math.min(1.0, 1.0 - newNormalizedY * 0.75),
        );

        // Enhanced rotation with multiple axes for variety
        const time2 = Date.now() * 0.001;
        rotation = new THREE.Euler(
          time2 * packed.rotAxis[i * 3 + 0] * packed.rotSpeed[i],
          time2 * packed.rotAxis[i * 3 + 1] * packed.rotSpeed[i],
          time2 * packed.rotAxis[i * 3 + 2] * packed.rotSpeed[i],
        );
      }

      // Apply transformation based on transform progress (Phase 9)
      if (transformProgress > 0) {
        // Morphing from cube to brain shape
        
        const basePosition = [
          px + lx * perspectiveScale,
          py + ly * perspectiveScale,
          pz + lz * perspectiveScale,
        ];
        const reducedSpreadMultiplier = 0.3;

        // Base position with slight hovering
        const time = Date.now() * 0.001;
        const hoverAmplitude = 0.8; // Reduced hovering during transformation
        const hoverX =
          Math.sin(time + i * 0.1) * hoverAmplitude * (1 - transformProgress);
        const hoverY =
          Math.cos(time * 0.7 + i * 0.15) * hoverAmplitude * (1 - transformProgress);
        const hoverZ =
          Math.sin(time * 0.5 + i * 0.12) * hoverAmplitude * (1 - transformProgress);

        const cubePosition = [
          basePosition[0] +
            bx * packed.maxSpreadX * reducedSpreadMultiplier +
            hoverX,
          basePosition[1] +
            by * packed.maxSpreadY * reducedSpreadMultiplier +
            hoverY,
          basePosition[2] +
            bz * packed.maxSpreadZ * reducedSpreadMultiplier +
            hoverZ,
        ];

        // Brain position
        const brainPosition = [btx, bty, btz];

        // Smooth interpolation between cube and brain positions
        position = [
          cubePosition[0] + (brainPosition[0] - cubePosition[0]) * transformProgress,
          cubePosition[1] + (brainPosition[1] - cubePosition[1]) * transformProgress,
          cubePosition[2] + (brainPosition[2] - cubePosition[2]) * transformProgress,
        ];

        const cubeScale = Math.max(
          0.25,
          Math.min(1.0, 1.0 - normalizedY * 0.75),
        );
        const brainScale = perspectiveScale * 0.7; // Brain pieces are smaller

        // Smooth scale transition
        scale = cubeScale + (brainScale - cubeScale) * transformProgress;

        // Show both cube (fading out) and brain (fading in) during transformation
        if (transformProgress < 1) {
          // Show cube form (fading out)
          dummy.position.set(position[0], position[1], position[2]);
          dummy.scale.setScalar(scale * (1 - transformProgress));
          dummy.rotation.copy(rotation);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
          wire.setMatrixAt(i, dummy.matrix);

          // Show brain form (fading in)
          dummy.scale.setScalar(scale * transformProgress);
          dummy.updateMatrix();
          sphereMesh.setMatrixAt(i, dummy.matrix);
          sphereWire.setMatrixAt(i, dummy.matrix);
        } else {
          // Fully transformed - show only brain form
          dummy.position.set(position[0], position[1], position[2]);
          dummy.scale.setScalar(scale);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          sphereMesh.setMatrixAt(i, dummy.matrix);
          sphereWire.setMatrixAt(i, dummy.matrix);

          // Hide cube form
          mesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
          wire.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        }
      } else {
        // Show cube form only
        dummy.position.set(position[0], position[1], position[2]);
        dummy.scale.setScalar(scale);
        dummy.rotation.copy(rotation);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        wire.setMatrixAt(i, dummy.matrix);

        // Hide brain form
        sphereMesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        sphereWire.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
    wire.instanceMatrix.needsUpdate = true;
    sphereMesh.instanceMatrix.needsUpdate = true;
    sphereWire.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Cube instances */}
      <instancedMesh
        ref={meshRef}
        args={[cubeGeo, cubeMat, count]}
        visible={true}
      />
      {/* Cube wireframe instances */}
      <instancedMesh
        ref={wireRef}
        args={[cubeEdgeGeo, edgeMat, count]}
        visible={true}
      />
      {/* Brain sphere instances */}
      <instancedMesh
        ref={sphereMeshRef}
        args={[sphereGeo, brainMat, count]}
        visible={true}
      />
      {/* Brain wireframe instances */}
      <instancedMesh
        ref={sphereWireRef}
        args={[sphereEdgeGeo, wireMat, count]}
        visible={true}
      />
    </group>
  );
});

// Mouse-controlled rotation system
const MouseRotationController = React.memo(function MouseRotationController({
  groupRef,
  scrollProgress,
}: {
  groupRef: React.RefObject<THREE.Group>;
  scrollProgress: number;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useFrame(() => {
    if (!groupRef.current) return;

    // Only apply mouse rotation during Phase 1 (0-2.01%)
    if (scrollProgress < 0.0201) {
      const rotationX = (mousePos.y * Math.PI) / 6; // ±30 degrees max
      const rotationY = (mousePos.x * Math.PI) / 6; // ±30 degrees max
      
      groupRef.current.rotation.x = rotationX;
      groupRef.current.rotation.y = rotationY;
    } else {
      // Reset rotation after Phase 1
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
    }
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Only track mouse during Phase 1
      if (scrollProgress >= 0.0201) return;
      
      const normalizedX = (event.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      const normalizedY = -(event.clientY / window.innerHeight) * 2 + 1; // -1 to 1 (inverted)
      
      setMousePos({ x: normalizedX, y: normalizedY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [scrollProgress]);

  return null;
});

// Main 3D scene component
const Scene = React.memo(function Scene() {
  const mainGroupRef = useRef<THREE.Group>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Generate initial cube data (27 pieces)
  const { cubes, miniCubes } = useMemo(() => {
    const cubes: CubeData[] = [];
    const miniCubes: MiniCubeData[] = [];
    const brainFormation = createBrainFormation(729);
    
    let brainIndex = 0;
    
    for (let i = 0; i < 27; i++) {
      const x = (i % 3) - 1;
      const y = Math.floor((i / 3) % 3) - 1;
      const z = Math.floor(i / 9) - 1;
      
      const position: [number, number, number] = [x * 6, y * 6, z * 6];
      
      // Generate spread pattern for this cube
      const baseSpread: [number, number, number] = [
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      ];
      
      const cube: CubeData = {
        id: `cube-${i}`,
        index: i,
        position,
        color: "#00ffff",
        baseSpread,
        rotationData: {
          rotationSpeed: 0.3 + Math.random() * 0.4,
          rotationAxis: new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5,
          ).normalize(),
          accumulatedRotation: new THREE.Euler(0, 0, 0),
        },
      };
      
      cubes.push(cube);
      
      // Generate 27 mini-cubes for each parent cube (total: 729)
      for (let j = 0; j < 27; j++) {
        const mx = (j % 3) - 1;
        const my = Math.floor((j / 3) % 3) - 1;
        const mz = Math.floor(j / 9) - 1;
        
        const localPosition: [number, number, number] = [mx * 2.5, my * 2.5, mz * 2.5];
        
        const miniCube: MiniCubeData = {
          id: `mini-${i}-${j}`,
          parentIndex: i,
          localIndex: j,
          localPosition,
          baseSpread: [
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
          ],
          rotationData: {
            rotationSpeed: 0.2 + Math.random() * 0.3,
            rotationAxis: new THREE.Vector3(
              Math.random() - 0.5,
              Math.random() - 0.5,
              Math.random() - 0.5,
            ).normalize(),
            accumulatedRotation: new THREE.Euler(0, 0, 0),
          },
          brainTransform: {
            popDelay: Math.random() * 2,
            spiralRadius: 20 + Math.random() * 30,
            spiralSpeed: 0.5 + Math.random() * 1.0,
            brainPosition: brainFormation[brainIndex].position,
            hemisphere: brainFormation[brainIndex].hemisphere,
            brainRegion: brainFormation[brainIndex].region,
          },
          size: 1.0,
        };
        
        miniCubes.push(miniCube);
        brainIndex++;
      }
    }
    
    return { cubes, miniCubes };
  }, []);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Main group containing all objects */}
      <group ref={mainGroupRef}>
        {/* Original 27 cubes (Phases 1-5) */}
        {cubes.map((cube) => (
          <CubePiece
            key={cube.id}
            cubeData={cube}
            scrollProgress={scrollProgress}
          />
        ))}
        
        {/* Unified Rubik's cubes (Phases 5-6) */}
        <UnifiedRubiksCubes
          parentCubes={cubes}
          scrollProgress={scrollProgress}
        />
        
        {/* 729 individual pieces (Phases 7-10a) */}
        <MiniInstanced
          miniCubes={miniCubes}
          parentCubes={cubes}
          scrollProgress={scrollProgress}
        />
        
        {/* 3000 final brain pieces (Phase 10b: 90-100%) */}
        <ThousandsBrainInstanced scrollProgress={scrollProgress} />
      </group>
      
      {/* Mouse rotation controller */}
      <MouseRotationController
        groupRef={mainGroupRef}
        scrollProgress={scrollProgress}
      />
      
      {/* Debug info */}
      <mesh position={[-45, 25, 0]}>
        <planeGeometry args={[20, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.7} />
      </mesh>
    </>
  );
});

// Main component export
export default function RubiksCubeExperience() {
  return (
    <Canvas
      camera={{ position: [0, 0, 50], fov: 75 }}
      style={{ background: '#0a0a0a' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}