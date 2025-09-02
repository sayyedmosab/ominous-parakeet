import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Smooth easing functions
const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Individual unified mini-Rubik's cube component (behaves like the original big cube)
const UnifiedMiniRubiksCube = React.memo(function UnifiedMiniRubiksCube({
  cubeIndex,
  parentPosition,
  perspectiveScale,
  scrollProgress,
}: {
  cubeIndex: number;
  parentPosition: [number, number, number];
  perspectiveScale: number;
  scrollProgress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate 27 sub-pieces for this unified Rubik's cube
  const subPieces = useMemo(() => {
    const pieces = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          pieces.push({
            position: [
              (x - 1) * 1.75, // Adjusted spacing to match original cube size
              (y - 1) * 1.75,
              (z - 1) * 1.75,
            ] as [number, number, number],
            key: `${x}-${y}-${z}`,
          });
        }
      }
    }
    return pieces;
  }, []);

  // Create edge geometry for the sub-pieces
  const edgeGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(new THREE.BoxGeometry(1.75, 1.75, 1.75));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    let position = [...parentPosition] as [number, number, number];
    let scale = 0;
    let rotation = new THREE.Euler(0, 0, 0);

    // Phase 5: Rubik's cube formation (14.48-26.32%) - Appear
    if (scrollProgress >= 0.1448 && scrollProgress < 0.2632) {
      const rawProgress = (scrollProgress - 0.1448) / 0.1184;
      const appearProgress = easeInOutCubic(rawProgress);
      scale = perspectiveScale * appearProgress;
    }
    // Phase 6: Rubik's Cube Showcase (26.32-35.09%) - Unified rotation
    else if (scrollProgress >= 0.2632 && scrollProgress < 0.3509) {
      const rawProgress = (scrollProgress - 0.2632) / 0.0877;
      scale = perspectiveScale;
      
      // Add subtle breathing animation
      const breathingCycle = Math.sin(rawProgress * Math.PI * 12) * 0.08 + 1;
      scale *= breathingCycle;
      
      // Unified rotation for the entire mini-cube (like original big cube)
      const time = Date.now() * 0.001;
      const rotationSpeed = 0.3 + cubeIndex * 0.05; // Slight variation per cube
      rotation.x = Math.sin(time * rotationSpeed) * 0.3;
      rotation.y = Math.cos(time * rotationSpeed * 0.8) * 0.4;
      rotation.z = Math.sin(time * rotationSpeed * 1.2) * 0.2;
    }
    // Phase 7: Hide as individual pieces take over
    else if (scrollProgress >= 0.3509) {
      scale = 0;
    }

    // Apply transformations
    groupRef.current.position.set(position[0], position[1], position[2]);
    groupRef.current.scale.setScalar(scale);
    groupRef.current.rotation.copy(rotation);
  });

  return (
    <group ref={groupRef}>
      {subPieces.map((piece) => (
        <group key={piece.key} position={piece.position}>
          <mesh>
            <boxGeometry args={[1.75, 1.75, 1.75]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#0088aa"
              emissiveIntensity={0.4}
              metalness={0.1}
              roughness={0.2}
            />
          </mesh>
          <lineSegments geometry={edgeGeometry}>
            <lineBasicMaterial color="#ffffff" linewidth={6} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
});

// Container for all 27 unified Rubik's cubes
const UnifiedRubiksCubes = React.memo(function UnifiedRubiksCubes({
  parentCubes,
  scrollProgress,
}: {
  parentCubes: Array<{
    id: string;
    index: number;
    position: [number, number, number];
    baseSpread: [number, number, number];
  }>;
  scrollProgress: number;
}) {
  // Calculate screen-adaptive spread values
  const screenData = useMemo(() => {
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

    return { maxSpreadX, maxSpreadY, maxSpreadZ };
  }, []);

  return (
    <group>
      {parentCubes.map((parent) => {
        // Calculate parent position in spread formation
        const parentPosition: [number, number, number] = [
          parent.position[0] + parent.baseSpread[0] * screenData.maxSpreadX,
          parent.position[1] + parent.baseSpread[1] * screenData.maxSpreadY,
          parent.position[2] + parent.baseSpread[2] * screenData.maxSpreadZ,
        ];

        // Calculate perspective scale
        const normalizedY = (parentPosition[1] - -screenData.maxSpreadY) / (2 * screenData.maxSpreadY);
        const perspectiveScale = Math.max(0.25, Math.min(1.0, 1.0 - normalizedY * 0.75));

        return (
          <UnifiedMiniRubiksCube
            key={parent.id}
            cubeIndex={parent.index}
            parentPosition={parentPosition}
            perspectiveScale={perspectiveScale}
            scrollProgress={scrollProgress}
          />
        );
      })}
    </group>
  );
});

export default UnifiedRubiksCubes;