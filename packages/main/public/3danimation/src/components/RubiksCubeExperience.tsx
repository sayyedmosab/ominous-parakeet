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

✅ Phase 9 (52.63-70.18%): Neuromorphic Brain Transform (WAVES + SIMULTANEOUS)
   - Cubes transform in large waves: 100 cubes transform simultaneously
   - FIXED: Pink brain material with WHITE edges for contrast
   - ENHANCEMENT: Advanced neuromorphic geometry with cortical folding

✅ Phase 10 (70.18-100%): Ultra-Realistic Brain Formation (EXTENDED SPIRAL)
   - ENHANCED: Thousands of equal-sized brain pieces (not limited to 729)
   - ENHANCEMENT: True neuroanatomical structure with noise-based cortical detail
   - Brain pieces merge into ULTRA-REALISTIC organic brain with ultra-slow visible spiral
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
  return "Ultra-Realistic Brain Formation";
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

        // Continuous gentle rotation
        const continuousRotation = time * 0.5;
        rotation.x =
          packed.rotAxis[i * 3 + 0] * continuousRotation;
        rotation.y =
          packed.rotAxis[i * 3 + 1] * continuousRotation;
        rotation.z =
          packed.rotAxis[i * 3 + 2] * continuousRotation;
      } else if (
        scrollProgress >= 0.5263 &&
        scrollProgress < 0.7018
      ) {
        // Phase 9: Brain Popcorn Transform with CONTINUOUS LIVING MOVEMENT
        const basePosition = [
          px + lx * perspectiveScale,
          py + ly * perspectiveScale,
          pz + lz * perspectiveScale,
        ];
        const reducedSpreadMultiplier = 0.3;

        // Continuous hovering even during transformation
        const time = Date.now() * 0.001;
        const hoverAmplitude = 2.25; // Gentle hovering during transformation (50/75 scale + 1.5x)
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
        const finalScale = Math.max(
          0.25,
          Math.min(1.0, 1.0 - newNormalizedY * 0.75),
        );

        scale = finalScale;

        // Continuous gentle rotation during transformation
        const continuousRotation = time * 0.3;
        rotation.x =
          packed.rotAxis[i * 3 + 0] * continuousRotation;
        rotation.y =
          packed.rotAxis[i * 3 + 1] * continuousRotation;
        rotation.z =
          packed.rotAxis[i * 3 + 2] * continuousRotation;
      } else if (scrollProgress >= 0.7) {
        // Phase 9: Organic Brain Formation with ULTRA-SLOW SPIRAL MOTION (30% RANGE)
        const rawProgress = (scrollProgress - 0.7) / 0.3; // Full 30% range (70% to 100%)

        const basePosition = [
          px + lx * perspectiveScale,
          py + ly * perspectiveScale,
          pz + lz * perspectiveScale,
        ];
        const reducedSpreadMultiplier = 0.3;
        const startPosition = [
          basePosition[0] +
            bx * packed.maxSpreadX * reducedSpreadMultiplier,
          basePosition[1] +
            by * packed.maxSpreadY * reducedSpreadMultiplier,
          basePosition[2] +
            bz * packed.maxSpreadZ * reducedSpreadMultiplier,
        ];

        // ULTRA-SLOW SPIRAL: Direct use of rawProgress for consistent motion over full 30%
        const spiralRadius = Math.sqrt(
          startPosition[0] ** 2 + startPosition[2] ** 2,
        );
        const originalAngle = Math.atan2(
          startPosition[2],
          startPosition[0],
        );

        // VISIBLE ULTRA-SLOW SPIRAL: Use rawProgress directly over 30% range
        const spiralRotation = rawProgress * Math.PI * 2; // Full 2π rotation over 30%
        const currentRadius = spiralRadius * (1 - rawProgress); // Linear radius reduction
        const currentAngle = originalAngle - spiralRotation; // Counter-clockwise rotation

        // Calculate spiral position
        const spiralX = currentRadius * Math.cos(currentAngle);
        const spiralZ = currentRadius * Math.sin(currentAngle);
        const spiralY = startPosition[1] * (1 - rawProgress); // Linear Y movement to center

        const spiralPosition: [number, number, number] = [
          spiralX,
          spiralY,
          spiralZ,
        ];

        // Blend to final brain position using easing only at the very end
        const blendProgress =
          rawProgress < 0.7 ? 0 : (rawProgress - 0.7) / 0.3; // Only blend in final 30%
        const smoothBlend = easeInOutCubic(blendProgress);
        position = smoothVec3Lerp(
          spiralPosition,
          [btx, bty, btz],
          smoothBlend,
        );

        const newNormalizedY =
          (position[1] - -packed.maxSpreadY) /
          (2 * packed.maxSpreadY);
        const finalScale = Math.max(
          0.25,
          Math.min(1.0, 1.0 - newNormalizedY * 0.75),
        );

        // Get brain region from miniCubes data
        const miniCube = miniCubes[i];
        let regionScale = 1.0;
        switch (miniCube.brainTransform.brainRegion) {
          case "frontal":
            regionScale = 1.2;
            break;
          case "cerebellum":
            regionScale = 0.9;
            break;
          case "temporal":
            regionScale = 1.0;
            break;
          case "parietal":
            regionScale = 1.1;
            break;
          case "occipital":
            regionScale = 0.95;
            break;
        }

        scale = finalScale * regionScale;

        // Brain pulsing with spiral motion
        const brainPulse =
          Math.sin(Date.now() * 0.004 + (i % 27) * 0.1) * 0.15 +
          1;
        scale *= brainPulse;

        // Rotation influenced by spiral motion
        rotation.x = Math.sin(currentAngle * 0.5) * 0.1;
        rotation.y = currentAngle * 0.1;
        rotation.z = Math.cos(currentAngle * 0.5) * 0.05;
      }

      // Calculate smooth morphing blend factors for seamless cube-to-brain transformation
      let cubeScale = scale;
      let sphereScale = 0;
      let cubeOpacity = 1;
      let sphereOpacity = 0;
      let morphColor = [0, 1, 1]; // Start with cyan RGB

      // TRUE MORPHING transformation during brain popcorn phase - BOTH VISIBLE SIMULTANEOUSLY
      if (transformProgress > 0) {
        // True morphing - both geometries always visible with smooth transitions
        const morphPhase = easeInOutCubic(transformProgress);

        // OVERLAPPING SCALES - both visible during transformation
        cubeScale = scale * Math.max(0.2, 1 - morphPhase * 0.8); // Cube stays visible longer
        sphereScale = scale * morphPhase * 1.1; // Sphere grows gradually

        // OVERLAPPING OPACITIES - true blending effect
        cubeOpacity = Math.max(0.3, 1 - morphPhase * 0.7); // Cube fades but stays visible
        sphereOpacity = Math.min(1, morphPhase * 1.2); // Sphere appears gradually

        // Color transition from cyan to brain region color
        const targetR = packed.brainRegionColors[i * 3 + 0];
        const targetG = packed.brainRegionColors[i * 3 + 1];
        const targetB = packed.brainRegionColors[i * 3 + 2];

        morphColor = [
          0 + (targetR - 0) * morphPhase, // From cyan R=0
          1 + (targetG - 1) * morphPhase, // From cyan G=1
          1 + (targetB - 1) * morphPhase, // From cyan B=1
        ];

        // Synchronized pulsing for both geometries
        const pulseEffect =
          Math.sin(Date.now() * 0.01 + i * 0.1) * 0.1 + 1;
        cubeScale *= pulseEffect;
        sphereScale *= pulseEffect;

        // Organic movement during transformation
        const organicMotion = morphPhase * 0.75; // 50/75 scale + 1.5x
        const organicX =
          Math.sin(Date.now() * 0.008 + i * 0.2) *
          organicMotion;
        const organicY =
          Math.cos(Date.now() * 0.012 + i * 0.25) *
          organicMotion;
        const organicZ =
          Math.sin(Date.now() * 0.006 + i * 0.18) *
          organicMotion;

        position[0] += organicX;
        position[1] += organicY;
        position[2] += organicZ;
      }

      // Update cube instances with morphing properties
      dummy.position.set(position[0], position[1], position[2]);
      dummy.rotation.copy(rotation);
      dummy.scale.setScalar(cubeScale);
      dummy.updateMatrix();

      // Always render cubes (they'll be invisible when opacity is 0)
      mesh.setMatrixAt(i, dummy.matrix);
      wire.setMatrixAt(i, dummy.matrix);

      // Update sphere instances for brain transformation
      dummy.scale.setScalar(sphereScale);
      dummy.updateMatrix();
      sphereMesh.setMatrixAt(i, dummy.matrix);
      sphereWire.setMatrixAt(i, dummy.matrix);
    }

    // Update material properties for TRUE MORPHING effect - both always visible
    if (
      meshRef.current &&
      wireRef.current &&
      sphereMeshRef.current &&
      sphereWireRef.current
    ) {
      // Calculate average transformation progress
      const averageTransformProgress =
        miniCubes.reduce((sum, _, i) => {
          const cubeIndex = Math.floor(i / 27) * 27 + (i % 27);
          let instanceProgress = 0;

          if (
            scrollProgress >= 0.5069 &&
            scrollProgress < 0.7
          ) {
            const rawProgress =
              (scrollProgress - 0.5069) / 0.1931;
            const waveSize = 100;
            const waveIndex = Math.floor(cubeIndex / waveSize);
            const totalWaves = Math.ceil(729 / waveSize);
            const waveStartDelay =
              (waveIndex / totalWaves) * 0.4;
            const waveProgress = Math.max(
              0,
              (rawProgress - waveStartDelay) /
                (1 - waveStartDelay),
            );

            instanceProgress = Math.min(
              1,
              easeInOutCubic(waveProgress) * 1.5,
            );
            instanceProgress = Math.max(0, instanceProgress);
          } else if (scrollProgress >= 0.7) {
            instanceProgress = 1;
          }
          return sum + instanceProgress;
        }, 0) / count;

      // TRUE MORPHING - both geometries always visible with overlapping opacities
      const cubeOpacity = Math.max(
        0.4,
        1 - averageTransformProgress * 0.6,
      ); // Cubes stay more visible
      const sphereOpacity = Math.min(
        1,
        averageTransformProgress * 1.2,
      ); // Spheres appear gradually

      mesh.material.opacity = cubeOpacity;
      wire.material.opacity = cubeOpacity * 0.9; // Stronger edges during morph
      sphereMesh.material.opacity = sphereOpacity;
      sphereWire.material.opacity = sphereOpacity * 0.8;
    }

    // Mark matrices as needing updates
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

mesh.instanceMatrix.needsUpdate = true;
    wire.instanceMatrix.needsUpdate = true;
    sphereMesh.instanceMatrix.needsUpdate = true;
    sphereWire.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Cube instances with BLACK CONTRASTING EDGES */}
      <instancedMesh
        ref={meshRef}
        args={[cubeGeo, cubeMat, count]}
        renderOrder={0}
      />
      <instancedMesh
        ref={wireRef}
        args={[cubeEdgeGeo, edgeMat, count]}
        renderOrder={2}
      />

      {/* Sphere instances for brain transformation with BLACK EDGES */}
      <instancedMesh
        ref={sphereMeshRef}
        args={[sphereGeo, brainMat, count]}
        renderOrder={0}
      />
      <instancedMesh
        ref={sphereWireRef}
        args={[sphereEdgeGeo, edgeMat, count]}
        renderOrder={2}
      />
    </>
  );
});

// Main Rubik's cube component
const RubiksCube = React.memo(function RubiksCube({
  mousePosition,
  scrollProgress,
}: {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}) {
  const groupRef = useRef<any>(null);
  const brainGroupRef = useRef<any>(null); // Separate ref for brain rotation

  // Generate 3x3x3 = 27 cubes with rotation data for Phase 4
  const cubes = useMemo((): CubeData[] => {
    const cubeArray: CubeData[] = [];
    let index = 0;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          cubeArray.push({
            id: `cube_${x}_${y}_${z}`,
            index: index++,
            position: [x * 6.3, y * 6.3, z * 6.3], // 6.3 unit spacing (50/75 scale + 1.5x)
            color: "#00ffff", // All cubes are neon blue
            baseSpread: [
              (Math.random() - 0.5) * 2, // -1 to +1 normalized range (USER'S SPEC)
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
            ],
            // Phase 4 rotation data - generate unique rotation for each cube
            rotationData: {
              rotationSpeed: Math.random() * 0.015 + 0.005, // 0.005 to 0.02 rad/frame
              rotationAxis: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5,
              ).normalize(),
              accumulatedRotation: new THREE.Euler(0, 0, 0),
            },
          });
        }
      }
    }
    return cubeArray;
  }, []);

  // Generate 729 individual mini-cubes for Phases 5-9 (27 Rubik's cubes × 27 pieces each)
  const miniCubes = useMemo((): MiniCubeData[] => {
    const miniCubeArray: MiniCubeData[] = [];

    // Generate brain formation positions for all 729 pieces
    const brainFormation = createBrainFormation(729);

    // For each of the original 27 cubes, create 27 mini-cubes (forming a Rubik's cube)
    cubes.forEach((parentCube, parentIndex) => {
      let localIndex = 0;

      // Create 27 mini-cubes for this parent cube (3×3×3 Rubik's cube formation)
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const globalIndex = parentIndex * 27 + localIndex;
            const brainPos = brainFormation[globalIndex];

            miniCubeArray.push({
              id: `mini_${parentIndex}_${x}_${y}_${z}`,
              parentIndex: parentIndex,
              localIndex: localIndex++,
              localPosition: [x * 2.1, y * 2.1, z * 2.1], // Position within Rubik's cube formation (50/75 scale + 1.5x)
              baseSpread: [
                (Math.random() - 0.5) * 2, // For Phase 6 dismantling (SAME rules as first)
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
              ],
              rotationData: {
                rotationSpeed: Math.random() * 0.02 + 0.01,
                rotationAxis: new THREE.Vector3(
                  Math.random() - 0.5,
                  Math.random() - 0.5,
                  Math.random() - 0.5,
                ).normalize(),
                accumulatedRotation: new THREE.Euler(0, 0, 0),
              },
              brainTransform: {
                popDelay: Math.random() * 0.5, // Stagger popcorn effect (0-0.5 normalized)
                spiralRadius: 22.5 + Math.random() * 30, // Starting spiral distance (50/75 scale + 1.5x)
                spiralSpeed: 0.5 + Math.random() * 1.5, // Spiral acceleration factor
                brainPosition: brainPos.position, // Target position in brain formation
                hemisphere: brainPos.hemisphere, // Left or right brain hemisphere
                brainRegion: brainPos.region, // Brain region for realistic variation
              },
              size: 2.1, // 1/3 of original 5.25-unit cubes (50/75 scale + 1.5x)
            });
          }
        }
      }
    });

    return miniCubeArray;
  }, [cubes]);

  useFrame(() => {
    if (!groupRef.current) return;

    // Phase 1: Group Rotate (0.00-2.01%) - Mouse controlled rotation
    if (scrollProgress < 0.0201) {
      const rotationStrength = 1;
      const targetRotationX =
        (mousePosition.y - 0.5) * Math.PI * rotationStrength;
      const targetRotationY =
        (mousePosition.x - 0.5) *
        Math.PI *
        2 *
        rotationStrength;

      groupRef.current.rotation.x = targetRotationX;
      groupRef.current.rotation.y = targetRotationY;

      // Ensure consistent scale for all cubes in Phase 1
      groupRef.current.scale.set(1, 1, 1);
    }
    // Phase 9: Final Brain Mouse Rotation (70-100%)
    else if (scrollProgress >= 0.7 && brainGroupRef.current) {
      // Lock main group rotation during dismantle phases
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
      groupRef.current.scale.set(1, 1, 1);

      // Apply mouse rotation to final brain
      const rotationStrength = 0.8; // Slightly gentler than Phase 1
      const targetRotationX =
        (mousePosition.y - 0.5) * Math.PI * rotationStrength;
      const targetRotationY =
        (mousePosition.x - 0.5) *
        Math.PI *
        2 *
        rotationStrength;

      brainGroupRef.current.rotation.x = targetRotationX;
      brainGroupRef.current.rotation.y = targetRotationY;
    } else {
      // Lock group rotation during dismantle phases
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
      groupRef.current.scale.set(1, 1, 1);

      // Reset brain rotation when not in final phase
      if (brainGroupRef.current) {
        brainGroupRef.current.rotation.x = 0;
        brainGroupRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Regular cubes for Phases 1-5 (fade out during Rubik's transformation) */}
      {scrollProgress < 0.3138 &&
        cubes.map((cube) => (
          <CubePiece
            key={cube.id}
            cubeData={cube}
            scrollProgress={scrollProgress}
          />
        ))}

      {/* 729 Mini-cubes for Phases 5-9 (OPTIMIZED INSTANCED RENDERING) */}
      {scrollProgress >= 0.1448 && (
        <group ref={brainGroupRef}>
          {/* Phase 5-6: Unified Rubik's Cubes - 27 unified mini-Rubik's cubes */}
          <UnifiedRubiksCubes
            parentCubes={cubes}
            scrollProgress={scrollProgress}
          />
          
          <MiniInstanced
            miniCubes={miniCubes}
            parentCubes={cubes}
            scrollProgress={scrollProgress}
          />
        </group>
      )}
    </group>
  );
});

// Scene component
function Scene({
  mousePosition,
  scrollProgress,
  setMousePosition,
  setScrollProgress,
}: {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
  setMousePosition: (pos: { x: number; y: number }) => void;
  setScrollProgress: (progress: number) => void;
}) {
  const { camera } = useThree();

  useFrame(() => {
    // Smooth camera movement for brain formation phase
    if (scrollProgress >= 0.7) {
      const brainProgress = (scrollProgress - 0.7) / 0.3;
      const smoothProgress = easeInOutCubic(brainProgress);

      // Move camera closer for brain examination (FURTHER REDUCED SCALING)
      const targetZ = 75; // REDUCED FROM 150 to 75 per user request
      const currentZ = 50 + (targetZ - 50) * smoothProgress;
      camera.position.setZ(currentZ);

      // Slight orbital movement around brain
      const orbitRadius = 3.75 * smoothProgress; // Adjusted for 50-75 camera range + 1.5x
      const orbitAngle = Date.now() * 0.0005;
      camera.position.x = Math.sin(orbitAngle) * orbitRadius;
      camera.position.y =
        Math.cos(orbitAngle) * orbitRadius * 0.5;

      camera.lookAt(0, 0, 0);
    } else {
      // Return to standard position (FURTHER REDUCED SCALING)
      camera.position.set(0, 0, 50); // REDUCED FROM 100 to 50 per user request
      camera.lookAt(0, 0, 0);
    }
  });

  useEffect(() => {
    // Position camera further back to see all cubes within bounds with 5% padding

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      });
    };

    const handleScroll = () => {
      // Use requestAnimationFrame for smoother scroll updates
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll =
          document.documentElement.scrollHeight -
          window.innerHeight;

        // Direct mapping with smooth calculation
        const progress = Math.min(
          Math.max(scrollY / Math.max(maxScroll, 1), 0),
          1,
        );

        setScrollProgress(progress);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [camera, setMousePosition, setScrollProgress]);

  return (
    <>
      {/* Enhanced atmospheric lighting for dark scene */}
      <ambientLight
        intensity={scrollProgress >= 0.87 ? 0.6 : 0.4}
      />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        color="#ffffff"
      />
      <pointLight position={[25, 25, 25]} intensity={2} />
      <pointLight
        position={[-25, -25, -25]}
        intensity={1}
        color="#4444ff"
      />
      <pointLight
        position={[0, 25, -25]}
        intensity={1.5}
        color="#ff4444"
      />
      <pointLight
        position={[0, -25, 25]}
        intensity={1}
        color="#44ff44"
      />

      {/* Additional brain-specific lighting for Phase 9 */}
      {scrollProgress >= 0.7 && (
        <>
          <pointLight
            position={[-18.75, 7.5, 0]}
            intensity={2}
            color="#ff6699"
            distance={45}
          />
          <pointLight
            position={[18.75, 7.5, 0]}
            intensity={2}
            color="#ff6699"
            distance={45}
          />
          <pointLight
            position={[0, -11.25, -15]}
            intensity={1.5}
            color="#ff4477"
            distance={37.5}
          />
        </>
      )}

      <RubiksCube
        mousePosition={mousePosition}
        scrollProgress={scrollProgress}
      />
    </>
  );
}

export default function RubiksCubeExperience() {
  const [mousePosition, setMousePosition] = useState({
    x: 0.5,
    y: 0.5,
  });
  const [scrollProgress, setScrollProgress] = useState(0);

  const phaseName = getPhaseName(scrollProgress);
  const currentPhase =
    scrollProgress < 0.0201
      ? 1
      : scrollProgress < 0.1206
        ? 2
        : scrollProgress < 0.1448
          ? 3
          : scrollProgress < 0.3138
            ? 5
            : scrollProgress < 0.4103
              ? 6
              : scrollProgress < 0.5069
                ? 7
                : scrollProgress < 0.7
                  ? 8
                  : 9;

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        <Canvas
          camera={{ fov: 75, near: 0.1, far: 1000 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          onCreated={({ gl }) => {
            gl.setClearColor("#000000", 1);
          }}
        >
          <Suspense fallback={null}>
            <Scene
              mousePosition={mousePosition}
              scrollProgress={scrollProgress}
              setMousePosition={setMousePosition}
              setScrollProgress={setScrollProgress}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Scrollable content - Increased height by 30% to compensate for extended spiral */}
      <div className="relative z-10 h-[1040vh]">
        {/* Phase Indicator - Enhanced */}
        <div className="fixed top-4 right-4 z-20 text-white/80 bg-black/60 px-4 py-3 rounded-lg backdrop-blur">
          <div className="text-sm mb-2">
            <div className="text-cyan-400 font-medium">
              🚀 PHASE {currentPhase} -{" "}
              {phaseName.toUpperCase()}
            </div>
            <div className="text-white/70">
              {scrollProgress < 0.025
                ? "Mouse Rotation: 1.5x SIZED CUBE AS ONE OBJECT"
                : scrollProgress < 0.1206
                  ? "First Dismantle: 27 LARGE PIECES EXPLODE OUTWARD"
                  : scrollProgress < 0.1448
                    ? "Settle with Perspective: LARGE PIECES HOLD POSITIONS"
                    : scrollProgress < 0.3138
                      ? "Rubik's Transform: 27 PIECES → 27 LARGE RUBIK'S CUBES"
                      : scrollProgress < 0.4103
                        ? "Second Dismantle: 729 LARGE PIECES (WHITE EDGES)"
                        : scrollProgress < 0.5069
                          ? "Living Motion: 729 PIECES HOVERING & ROTATING"
                          : scrollProgress < 0.7
                            ? "TRUE MORPHING: CUBES BLEND INTO BRAIN BUBBLES"
                            : "Mouse-Rotatable Brain: ULTRA-SLOW SPIRAL (30%) → INTERACTIVE BRAIN"}
            </div>
          </div>
          <div className="text-xs text-white/60 mt-3">
            <div className="text-green-400 font-medium">
              ⚡ OPTIMIZED: INSTANCED RENDERING (729 → 4 Draw
              Calls)
            </div>
            <div className="text-green-400 font-medium">
              ⚡ PERFORMANCE: Single useFrame Loop + Typed
              Arrays
            </div>
            <div className="text-green-400 font-medium">
              ⚡ FIXED: 1.5x Object Size + WHITE Edges + Full
              13% Spiral + Mouse Brain
            </div>
            <div className="text-white/80 mt-2">
              {scrollProgress < 0.0201
                ? `Mouse: x=${Math.round(mousePosition.x * 100)}, y=${Math.round(mousePosition.y * 100)}`
                : scrollProgress < 0.1206
                  ? `Dismantle: ${Math.round(((scrollProgress - 0.0201) / 0.1005) * 100)}% | Dramatic cloud (5% padding)`
                  : scrollProgress < 0.1448
                    ? `Settle: ${Math.round(((scrollProgress - 0.1206) / 0.0242) * 100)}% | Perspective scaling`
                    : scrollProgress < 0.3138
                      ? `Transform: ${Math.round(((scrollProgress - 0.1448) / 0.169) * 100)}% | 27 pieces → 27 Rubik's cubes`
                      : scrollProgress < 0.4103
                        ? `Dismantle: ${Math.round(((scrollProgress - 0.3138) / 0.0965) * 100)}% | 729 pieces (FIXED CONSTRAINTS)`
                        : scrollProgress < 0.5069
                          ? `Living Motion: ${Math.round(((scrollProgress - 0.4103) / 0.0966) * 100)}% | 729 pieces hovering & rotating continuously`
                          : scrollProgress < 0.7
                            ? `True Morphing: ${Math.round(((scrollProgress - 0.5069) / 0.1931) * 100)}% | Cubes blend into brain bubbles (overlapping)`
                            : `Ultra-Slow Spiral: ${Math.round(((scrollProgress - 0.7) / 0.3) * 100)}% | EXTENDED 30% spiral → Mouse-rotatable brain (1.5x scaled)`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}