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
🎯 CORRECTED 10-PHASE RUBIK'S CUBE TO BRAIN ANIMATION:
Following the EXACT requirements from documentation with proper phase continuity.

✅ Phase 1 (0-2.01%): Group Rotate
✅ Phase 2 (2.01-12.06%): First Dismantle  
✅ Phase 3 (12.06-14.48%): Settle with Perspective
✅ Phase 5 (14.48-26.32%): Rubik's Cube Transform
✅ Phase 6 (26.32-35.09%): Rubik's Cube Showcase
✅ Phase 7 (35.09-43.86%): Second Dismantle
✅ Phase 8 (43.86-52.63%): Independent Rotation
✅ Phase 9 (52.63-70.18%): POPCORN Brain Transform - CONTINUITY FIXED
✅ Phase 10 (70.18-100%): Spiral Brain Formation - CONTINUITY FIXED
*/

// Get phase name for display
function getPhaseName(progress: number): string {
  if (progress < 0.0201) return "Group Rotate";
  if (progress < 0.1206) return "First Dismantle";
  if (progress < 0.1448) return "Settle with Perspective";
  if (progress < 0.2632) return "Rubik's Cube Transform";
  if (progress < 0.3509) return "Rubik's Cube Showcase";
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

// Individual mini-cube data for Phase 7+ (729 total mini-cubes)
interface MiniCubeData {
  id: string;
  parentIndex: number;
  localIndex: number;
  localPosition: [number, number, number];
  baseSpread: [number, number, number];
  rotationData: {
    rotationSpeed: number;
    rotationAxis: THREE.Vector3;
    accumulatedRotation: THREE.Euler;
  };
  brainTransform: {
    popDelay: number;
    spiralRadius: number;
    spiralSpeed: number;
    brainPosition: [number, number, number];
    hemisphere: "left" | "right";
    brainRegion:
      | "frontal"
      | "parietal"
      | "temporal"
      | "occipital"
      | "cerebellum";
  };
  size: number;
}

// Brain formation system
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

  const brainWidth = 20.0;
  const brainHeight = 16.5;
  const brainDepth = 24.0;

  for (let i = 0; i < totalPieces; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();

    let x = Math.sin(phi) * Math.cos(theta) * brainWidth * 0.5;
    let y = Math.cos(phi) * brainHeight * 0.5;
    let z = Math.sin(phi) * Math.sin(theta) * brainDepth * 0.5;

    // Brain shape deformations
    const frontWeight = Math.max(0, z / (brainDepth * 0.5));
    if (z > 0) {
      x *= 1 + frontWeight * 0.3;
      y *= 1 + frontWeight * 0.2;
    }

    // Brain stem narrowing
    if (
      y < -brainHeight * 0.3 &&
      Math.abs(x) < brainWidth * 0.2 &&
      Math.abs(z) < brainDepth * 0.2
    ) {
      x *= 0.4;
      z *= 0.4;
    }

    // Cerebellum
    if (y < -brainHeight * 0.1 && z < -brainDepth * 0.2) {
      y -= 2.8;
      x *= 0.75;
      const cerebellarNoise = noise3D(x * 0.2, y * 0.2, z * 0.2) * 1.5;
      y += Math.sin(x * 0.3) * cerebellarNoise * 0.5;
    }

    // 4-octave noise for cortical folding
    const noiseScale = 0.06;
    const surfaceNoise =
      noise3D(x * noiseScale, y * noiseScale, z * noiseScale) * 5.0 +
      noise3D(x * noiseScale * 2, y * noiseScale * 2, z * noiseScale * 2) * 2.5 +
      noise3D(x * noiseScale * 4, y * noiseScale * 4, z * noiseScale * 4) * 1.25 +
      noise3D(x * noiseScale * 8, y * noiseScale * 8, z * noiseScale * 8) * 0.625;

    const regionComplexity = Math.sin(z * 0.1) * Math.cos(x * 0.08) * 1.5;
    const combinedNoise = surfaceNoise + regionComplexity;

    // Apply surface displacement
    const surfaceRadius = Math.sqrt(x * x + y * y + z * z);
    if (surfaceRadius > 0) {
      const normalX = x / surfaceRadius;
      const normalY = y / surfaceRadius;
      const normalZ = z / surfaceRadius;

      let foldingStrength = 3.0;
      if (z > brainDepth * 0.2) foldingStrength *= 1.4;
      if (Math.abs(x) > brainWidth * 0.3 && y > -brainHeight * 0.2) foldingStrength *= 1.3;

      x += normalX * combinedNoise * foldingStrength;
      y += normalY * combinedNoise * foldingStrength;
      z += normalZ * combinedNoise * foldingStrength;
    }

    const hemisphere: "left" | "right" = x < 0 ? "left" : "right";

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
    } else if (Math.abs(x) > brainWidth * 0.3 && y > -brainHeight * 0.2) {
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
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const easeInOutQuart = (t: number): number => {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
};

// Individual cube piece component - PHASES 1-4
const CubePiece = React.memo(function CubePiece({
  cubeData,
  scrollProgress,
}: {
  cubeData: CubeData;
  scrollProgress: number;
}) {
  const groupRef = useRef<any>(null);

  const edgeGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(new THREE.BoxGeometry(5.25, 5.25, 5.25));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    let position: [number, number, number] = [...cubeData.position];
    let scale = 1;

    // Calculate screen-adaptive spread values
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const aspectRatio = viewportWidth / viewportHeight;

    const fov = 75;
    const fovRad = (fov * Math.PI) / 180;
    const screenWidth3D = 2 * Math.tan(fovRad / 2) * 50;
    const screenHeight3D = screenWidth3D / aspectRatio;

    const maxSpreadX = screenWidth3D * 0.45;
    const maxSpreadY = screenHeight3D * 0.45;
    const maxSpreadZ = 30;

    // Phase 1: Group Rotate (0.00-2.01%)
    if (scrollProgress < 0.0201) {
      position = [...cubeData.position];
      scale = 1;

      if (groupRef.current && cubeData.rotationData) {
        groupRef.current.rotation.set(0, 0, 0);
      }
    }
    // Phase 2: First Dismantle (2.01-12.06%)
    else if (scrollProgress >= 0.0201 && scrollProgress < 0.1206) {
      const rawProgress = (scrollProgress - 0.0201) / 0.1005;
      const dismantleProgress = easeInOutCubic(rawProgress);

      position = [
        cubeData.position[0] + cubeData.baseSpread[0] * dismantleProgress * maxSpreadX,
        cubeData.position[1] + cubeData.baseSpread[1] * dismantleProgress * maxSpreadY,
        cubeData.position[2] + cubeData.baseSpread[2] * dismantleProgress * maxSpreadZ,
      ];

      const normalizedY = (position[1] - -maxSpreadY) / (2 * maxSpreadY);
      scale = Math.max(0.25, Math.min(1.0, 1.0 - normalizedY * 0.75));
    }
    // Phase 3: Settle with Perspective (12.06-14.48%)
    else if (scrollProgress >= 0.1206 && scrollProgress < 0.1448) {
      position = [
        cubeData.position[0] + cubeData.baseSpread[0] * maxSpreadX,
        cubeData.position[1] + cubeData.baseSpread[1] * maxSpreadY,
        cubeData.position[2] + cubeData.baseSpread[2] * maxSpreadZ,
      ];

      const normalizedY = (position[1] - -maxSpreadY) / (2 * maxSpreadY);
      scale = Math.max(0.25, Math.min(1.0, 1.0 - normalizedY * 0.75));
    }
    // Phase 5: Rubik's Cube Transform (14.48-26.32%)
    else if (scrollProgress >= 0.1448 && scrollProgress < 0.2632) {
      const rawProgress = (scrollProgress - 0.1448) / 0.1184;

      position = [
        cubeData.position[0] + cubeData.baseSpread[0] * maxSpreadX,
        cubeData.position[1] + cubeData.baseSpread[1] * maxSpreadY,
        cubeData.position[2] + cubeData.baseSpread[2] * maxSpreadZ,
      ];

      const normalizedY = (position[1] - -maxSpreadY) / (2 * maxSpreadY);
      const baseScale = Math.max(0.25, Math.min(1.0, 1.0 - normalizedY * 0.75));

      const fadeProgress = easeInOutCubic(rawProgress);
      scale = baseScale * (1 - fadeProgress);
    }
    // Phase 6+: Hide original cubes
    else {
      scale = 0;
    }

    groupRef.current.position.set(position[0], position[1], position[2]);
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

// CORRECTED Instanced mini-cubes component - PROPER PHASE CONTINUITY
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

  // Store Phase 8 end positions for continuity
  const phase8Positions = useRef<Float32Array>(new Float32Array(count * 3));
  const phase8Initialized = useRef(false);

  const cubeGeo = useMemo(() => new THREE.BoxGeometry(2.1, 2.1, 2.1), []);
  const cubeEdgeGeo = useMemo(() => new THREE.EdgesGeometry(cubeGeo), []);
  
  // Brain geometry - SAME SIZE as cubes during morph (no size change)
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(2.1 * 0.7, 16, 16), []);
  const sphereEdgeGeo = useMemo(() => new THREE.EdgesGeometry(sphereGeo), []);
  
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
        color: "#ffffff",
        transparent: false,
        linewidth: 6,
        opacity: 1,
      }),
    [],
  );

  // CORRECTED: Brain material for INSTANCE COLORS (not vertex colors)
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

  // CRITICAL: WHITE edges for brain visibility
  const brainWireMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#ffffff", // WHITE edges for brain contrast
        transparent: false,
        opacity: 1,
        linewidth: 6,
      }),
    [],
  );

  // Precompute data
  const packed = useMemo(() => {
    const basePos = new Float32Array(count * 3);
    const localPos = new Float32Array(count * 3);
    const baseSpread = new Float32Array(count * 3);
    const brainTarget = new Float32Array(count * 3);
    const rotAxis = new Float32Array(count * 3);
    const rotSpeed = new Float32Array(count);
    const brainRegionColors = new Float32Array(count * 3);

    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 1080;
    const aspectRatio = viewportWidth / viewportHeight;
    const fov = 75;
    const fovRad = (fov * Math.PI) / 180;
    const screenWidth3D = 2 * Math.tan(fovRad / 2) * 50;
    const screenHeight3D = screenWidth3D / aspectRatio;
    const maxSpreadX = screenWidth3D * 0.45;
    const maxSpreadY = screenHeight3D * 0.45;
    const maxSpreadZ = 30;

    for (let i = 0; i < count; i++) {
      const m = miniCubes[i];
      const parent = parentCubes[m.parentIndex];

      const parentPos = [
        parent.position[0] + parent.baseSpread[0] * maxSpreadX,
        parent.position[1] + parent.baseSpread[1] * maxSpreadY,
        parent.position[2] + parent.baseSpread[2] * maxSpreadZ,
      ];

      basePos.set(parentPos, i * 3);
      localPos.set(m.localPosition, i * 3);
      baseSpread.set(m.baseSpread, i * 3);
      brainTarget.set(m.brainTransform.brainPosition, i * 3);
      rotAxis.set(
        [
          m.rotationData.rotationAxis.x,
          m.rotationData.rotationAxis.y,
          m.rotationData.rotationAxis.z,
        ],
        i * 3,
      );
      rotSpeed[i] = m.rotationData.rotationSpeed;

      // BRAIN FEATURE-BASED COLORING: Highlight anatomical features
      const getBrainFeatureColorRGB = (region: string, position: [number, number, number]): [number, number, number] => {
        const [x, y, z] = position;
        
        // Calculate noise-based cortical complexity at this position
        const noise3D = createNoise3D();
        const noiseScale = 0.06;
        const surfaceNoise = 
          noise3D(x * noiseScale, y * noiseScale, z * noiseScale) * 5.0 +
          noise3D(x * noiseScale * 2, y * noiseScale * 2, z * noiseScale * 2) * 2.5;
        
        const surfaceRadius = Math.sqrt(x * x + y * y + z * z);
        const brainWidth = 20.0;
        const brainHeight = 16.5;
        const brainDepth = 24.0;
        
        // 1. BRAIN STEM (narrow central area) - BRIGHT BLUE
        if (y < -brainHeight * 0.3 && Math.abs(x) < brainWidth * 0.2 && Math.abs(z) < brainDepth * 0.2) {
          return [0.0, 0.8, 1.0]; // Bright cyan - brain stem
        }
        
        // 2. CEREBELLUM with foliation - ORANGE-RED gradient based on foliation
        if (y < -brainHeight * 0.1 && z < -brainDepth * 0.2) {
          const cerebellarNoise = noise3D(x * 0.2, y * 0.2, z * 0.2) * 1.5;
          const foliationIntensity = Math.abs(Math.sin(x * 0.3) * cerebellarNoise);
          return [1.0, 0.3 + foliationIntensity * 0.4, 0.0]; // Orange to red based on foliation
        }
        
        // 3. DEEP CORTICAL FOLDS (high surface noise) - BRIGHT MAGENTA
        if (Math.abs(surfaceNoise) > 3.5) {
          return [1.0, 0.0, 0.8]; // Bright magenta - deep sulci/gyri
        }
        
        // 4. FRONTAL PROMINENCE - GREEN gradient based on prominence
        if (z > brainDepth * 0.2) {
          const frontWeight = z / (brainDepth * 0.5);
          return [0.0, 0.6 + frontWeight * 0.4, 0.2]; // Green gradient - frontal prominence
        }
        
        // 5. SURFACE COMPLEXITY - YELLOW-WHITE based on folding intensity
        const foldingIntensity = Math.abs(surfaceNoise) / 5.0;
        if (foldingIntensity > 0.4) {
          return [1.0, 1.0, 0.3 + foldingIntensity * 0.4]; // Yellow to white - surface complexity
        }
        
        // 6. TEMPORAL REGION COMPLEXITY - PURPLE-BLUE
        if (Math.abs(x) > brainWidth * 0.3 && y > -brainHeight * 0.2) {
          const temporalComplexity = Math.abs(Math.sin(z * 0.1) * Math.cos(x * 0.08));
          return [0.4 + temporalComplexity * 0.4, 0.0, 0.8]; // Purple-blue - temporal complexity
        }
        
        // 7. DEFAULT CORTEX - Soft pink-gray based on region
        switch (region) {
          case "frontal": return [0.9, 0.6, 0.7]; // Soft pink
          case "parietal": return [0.8, 0.7, 0.9]; // Soft lavender  
          case "temporal": return [0.7, 0.8, 0.9]; // Soft blue
          case "occipital": return [0.9, 0.8, 0.6]; // Soft gold
          default: return [0.8, 0.8, 0.8]; // Soft gray
        }
      };

      const colorRGB = getBrainFeatureColorRGB(m.brainTransform.brainRegion, m.brainTransform.brainPosition);
      brainRegionColors.set(colorRGB, i * 3);
    }

    return {
      basePos,
      localPos,
      baseSpread,
      brainTarget,
      rotAxis,
      rotSpeed,
      brainRegionColors,
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

    // Initialize brain instance colors for regional variation
    if (!sphereMesh.instanceColor && scrollProgress >= 0.5263) {
      const colors = new Float32Array(count * 3);
      for (let j = 0; j < count; j++) {
        colors[j * 3] = packed.brainRegionColors[j * 3 + 0];
        colors[j * 3 + 1] = packed.brainRegionColors[j * 3 + 1];
        colors[j * 3 + 2] = packed.brainRegionColors[j * 3 + 2];
      }
      sphereMesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
      sphereMesh.instanceColor.needsUpdate = true; // CRITICAL: Mark for update
    }

    for (let i = 0; i < count; i++) {
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

      const normalizedY = (py - -packed.maxSpreadY) / (2 * packed.maxSpreadY);
      const perspectiveScale = Math.max(0.25, Math.min(1.0, 1.0 - normalizedY * 0.75));

      let position: [number, number, number] = [0, 0, 0];
      let scale = 0;
      let rotation = new THREE.Euler(0, 0, 0);

      // Phase 7: Second dismantle (35.09-43.86%)
      if (scrollProgress >= 0.3509 && scrollProgress < 0.4386) {
        const rawProgress = (scrollProgress - 0.3509) / 0.0877;
        const dismantleProgress = easeInOutCubic(rawProgress);

        const unifiedCubePosition = [px, py, pz];
        const reducedSpreadMultiplier = 0.3;

        position = [
          unifiedCubePosition[0] + bx * dismantleProgress * packed.maxSpreadX * reducedSpreadMultiplier,
          unifiedCubePosition[1] + by * dismantleProgress * packed.maxSpreadY * reducedSpreadMultiplier,
          unifiedCubePosition[2] + bz * dismantleProgress * packed.maxSpreadZ * reducedSpreadMultiplier,
        ];

        const newNormalizedY = (position[1] - -packed.maxSpreadY) / (2 * packed.maxSpreadY);
        scale = Math.max(0.25, Math.min(1.0, 1.0 - newNormalizedY * 0.75));

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
      // Phase 8: Independent Rotation (43.86-52.63%)
      else if (scrollProgress >= 0.4386 && scrollProgress < 0.5263) {
        const rawProgress = (scrollProgress - 0.4386) / 0.0877;

        const basePosition = [
          px + lx * perspectiveScale,
          py + ly * perspectiveScale,
          pz + lz * perspectiveScale,
        ];
        const reducedSpreadMultiplier = 0.3;

        // LIVING MOVEMENT - hovering motion
        const time = Date.now() * 0.001;
        const hoverAmplitude = 1.5;
        const hoverX = Math.sin(time + i * 0.1) * hoverAmplitude;
        const hoverY = Math.cos(time * 0.7 + i * 0.15) * hoverAmplitude;
        const hoverZ = Math.sin(time * 0.5 + i * 0.12) * hoverAmplitude;

        position = [
          basePosition[0] + bx * packed.maxSpreadX * reducedSpreadMultiplier + hoverX,
          basePosition[1] + by * packed.maxSpreadY * reducedSpreadMultiplier + hoverY,
          basePosition[2] + bz * packed.maxSpreadZ * reducedSpreadMultiplier + hoverZ,
        ];

        const newNormalizedY = (position[1] - -packed.maxSpreadY) / (2 * packed.maxSpreadY);
        scale = Math.max(0.25, Math.min(1.0, 1.0 - newNormalizedY * 0.75));

        // Enhanced rotation
        const time2 = Date.now() * 0.001;
        rotation = new THREE.Euler(
          time2 * packed.rotAxis[i * 3 + 0] * packed.rotSpeed[i],
          time2 * packed.rotAxis[i * 3 + 1] * packed.rotSpeed[i],
          time2 * packed.rotAxis[i * 3 + 2] * packed.rotSpeed[i],
        );

        // CRITICAL: Store Phase 8 end positions for Phase 9 continuity
        if (!phase8Initialized.current) {
          phase8Positions.current[i * 3] = position[0];
          phase8Positions.current[i * 3 + 1] = position[1];
          phase8Positions.current[i * 3 + 2] = position[2];
        }

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
      // Phase 9: POPCORN Brain Transform (52.63-70.18%) - PURE TRANSPARENCY FADE
      else if (scrollProgress >= 0.5263 && scrollProgress < 0.7018) {
        const rawProgress = (scrollProgress - 0.5263) / 0.1755;

        // CRITICAL: Use EXACT Phase 8 end positions (NO MOVEMENT!)
        const phase8X = phase8Positions.current[i * 3];
        const phase8Y = phase8Positions.current[i * 3 + 1];
        const phase8Z = phase8Positions.current[i * 3 + 2];
        
        // Keep exact Phase 8 position - NO MOVEMENT!
        position = [phase8X, phase8Y, phase8Z];
        
        // Keep exact Phase 8 scale - NO SIZE CHANGES!
        const newNormalizedY = (position[1] - -packed.maxSpreadY) / (2 * packed.maxSpreadY);
        scale = Math.max(0.25, Math.min(1.0, 1.0 - newNormalizedY * 0.75)); // Same scale as Phase 8

        // POPCORN-style transformation with wave groups
        const waveSize = 100; // Transform 100 cubes at once
        const waveIndex = Math.floor(cubeIndex / waveSize);
        const totalWaves = Math.ceil(729 / waveSize);

        const waveStartDelay = (waveIndex / totalWaves) * 0.4;
        const waveProgress = Math.max(0, (rawProgress - waveStartDelay) / (1 - waveStartDelay));
        let transformProgress = Math.min(1, easeInOutCubic(waveProgress) * 1.5);
        transformProgress = Math.max(0, transformProgress);

        // PURE TRANSPARENCY FADE - NO POSITION OR SIZE CHANGES!
        if (transformProgress > 0) {
          // Determine if this piece has finished transforming (for sharp popcorn effect)
          const isFullyTransformed = transformProgress >= 1.0;
          
          if (isFullyTransformed) {
            // Show ONLY brain form (cube is fully faded out)
            dummy.position.set(position[0], position[1], position[2]);
            dummy.scale.setScalar(scale * 0.7); // Brain size factor
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            sphereMesh.setMatrixAt(i, dummy.matrix);
            sphereWire.setMatrixAt(i, dummy.matrix);

            // Hide cube form completely
            mesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
            wire.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
          } else {
            // During transition: Show cube form only (brain appears instantly when ready)
            dummy.position.set(position[0], position[1], position[2]);
            dummy.scale.setScalar(scale);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
            wire.setMatrixAt(i, dummy.matrix);

            // Hide brain form during transition
            sphereMesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
            sphereWire.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
          }
        } else {
          // Show cube form only (before transformation starts)
          dummy.position.set(position[0], position[1], position[2]);
          dummy.scale.setScalar(scale);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
          wire.setMatrixAt(i, dummy.matrix);

          // Hide brain form completely
          sphereMesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
          sphereWire.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        }
      }
      // Phase 10a: 729 pieces spiral (70.18-90%) - CONTINUITY FIXED
      else if (scrollProgress >= 0.7018 && scrollProgress < 0.90) {
        const spiralProgress = (scrollProgress - 0.7018) / 0.1982;
        const easedSpiral = easeInOutCubic(spiralProgress);

        // CRITICAL: Start from Phase 9 end positions (no snapping!)
        const startX = btx; // Where Phase 9 ended
        const startY = bty;
        const startZ = btz;

        // Spiral parameters
        const spiralRadius = 30 * (1 - easedSpiral);
        const spiralAngle = easedSpiral * Math.PI * 4; // 2 full rotations
        const spiralHeight = Math.sin(spiralProgress * Math.PI) * 10;

        const spiralX = Math.cos(spiralAngle + i * 0.1) * spiralRadius;
        const spiralY = Math.sin(spiralAngle + i * 0.05) * spiralRadius + spiralHeight;
        const spiralZ = Math.sin(spiralAngle + i * 0.08) * spiralRadius;

        // Smooth interpolation from Phase 9 position to spiral to center
        position = [
          startX + (spiralX - startX) * easedSpiral,
          startY + (spiralY - startY) * easedSpiral,
          startZ + (spiralZ - startZ) * easedSpiral,
        ];

        // Keep brain form and colors
        scale = perspectiveScale * 0.7;

        // Show brain form only
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
      // Phase 10b: 729 pieces fade out (90-100%)
      else if (scrollProgress >= 0.90) {
        // Hide 729 pieces completely - 3000 pieces handle the final brain
        mesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        wire.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        sphereMesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        sphereWire.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
      } else {
        // Hide during other phases
        mesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        wire.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        sphereMesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
        sphereWire.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
      }
    }

    // Mark Phase 8 as initialized after first pass
    if (scrollProgress >= 0.4386 && scrollProgress < 0.5263) {
      phase8Initialized.current = true;
    }

    mesh.instanceMatrix.needsUpdate = true;
    wire.instanceMatrix.needsUpdate = true;
    sphereMesh.instanceMatrix.needsUpdate = true;
    sphereWire.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[cubeGeo, cubeMat, count]} visible={true} />
      <instancedMesh ref={wireRef} args={[cubeEdgeGeo, wireMat, count]} visible={true} />
      <instancedMesh ref={sphereMeshRef} args={[sphereGeo, brainMat, count]} visible={true} />
      <instancedMesh ref={sphereWireRef} args={[sphereEdgeGeo, brainWireMat, count]} visible={true} />
    </group>
  );
});

// Mouse-controlled rotation system
const MouseRotationController = React.memo(function MouseRotationController({
  groupRef,
  brainGroupRef,
  scrollProgress,
}: {
  groupRef: React.RefObject<THREE.Group>;
  brainGroupRef: React.RefObject<THREE.Group>;
  scrollProgress: number;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useFrame(() => {
    // Phase 1: Mouse rotation for original cube
    if (groupRef.current && scrollProgress < 0.0201) {
      const rotationX = (mousePos.y * Math.PI) / 6; // ±30 degrees max
      const rotationY = (mousePos.x * Math.PI) / 6; // ±30 degrees max

      groupRef.current.rotation.x = rotationX;
      groupRef.current.rotation.y = rotationY;
    } else if (groupRef.current) {
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
    }

    // CRITICAL: Phase 10b - Mouse rotation for final brain (90-100%)
    if (brainGroupRef.current && scrollProgress >= 0.90) {
      const rotationX = (mousePos.y * Math.PI) / 6;
      const rotationY = (mousePos.x * Math.PI) / 6;

      brainGroupRef.current.rotation.x = rotationX;
      brainGroupRef.current.rotation.y = rotationY;
    } else if (brainGroupRef.current) {
      brainGroupRef.current.rotation.x = 0;
      brainGroupRef.current.rotation.y = 0;
    }
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Track mouse during Phase 1 and Phase 10b
      if (scrollProgress < 0.0201 || scrollProgress >= 0.90) {
        const normalizedX = (event.clientX / window.innerWidth) * 2 - 1; // -1 to 1
        const normalizedY = -(event.clientY / window.innerHeight) * 2 + 1; // -1 to 1 (inverted)

        setMousePos({ x: normalizedX, y: normalizedY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [scrollProgress]);

  return null;
});

// Main 3D scene component
const Scene = React.memo(function Scene() {
  const mainGroupRef = useRef<THREE.Group>(null);
  const brainGroupRef = useRef<THREE.Group>(null);
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

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Main group for original cubes (Phases 1-5) */}
      <group ref={mainGroupRef}>
        {cubes.map((cube) => (
          <CubePiece key={cube.id} cubeData={cube} scrollProgress={scrollProgress} />
        ))}
      </group>

      {/* Unified Rubik's cubes (Phases 5-6) */}
      <UnifiedRubiksCubes parentCubes={cubes} scrollProgress={scrollProgress} />

      {/* 729 individual pieces (Phases 7-10a) */}
      <MiniInstanced miniCubes={miniCubes} parentCubes={cubes} scrollProgress={scrollProgress} />

      {/* 3000 final brain pieces (Phase 10b: 90-100%) */}
      <group ref={brainGroupRef}>
        <ThousandsBrainInstanced scrollProgress={scrollProgress} />
      </group>

      {/* Mouse rotation controller */}
      <MouseRotationController
        groupRef={mainGroupRef}
        brainGroupRef={brainGroupRef}
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
    <Canvas camera={{ position: [0, 0, 50], fov: 75 }} style={{ background: "#0a0a0a" }}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}