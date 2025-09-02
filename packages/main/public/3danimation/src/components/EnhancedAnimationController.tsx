import React, { useOptimistic, useTransition, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * React 19 Enhanced Animation Controller
 * Leverages React Compiler optimization and concurrent features
 */

interface AnimationState {
  phase: number;
  progress: number;
  morphingActive: boolean;
  brainActivity: number;
}

export const useEnhancedAnimation = (scrollProgress: number) => {
  const [isPending, startTransition] = useTransition();
  
  // React 19: useOptimistic for instant visual feedback
  const [optimisticState, setOptimisticState] = useOptimistic<AnimationState>(
    {
      phase: getCurrentPhase(scrollProgress),
      progress: scrollProgress,
      morphingActive: false,
      brainActivity: 0,
    },
    (state, newState: Partial<AnimationState>) => ({
      ...state,
      ...newState,
    })
  );

  // React Compiler automatically optimizes this calculation
  const enhancedPhaseData = useMemo(() => {
    return calculateEnhancedPhaseData(scrollProgress);
  }, [scrollProgress]);

  // Three.js 0.172.0: Enhanced easing with concurrent scheduling
  const smoothTransition = (from: number, to: number, t: number) => {
    // Enhanced easing function optimized by React Compiler
    const easeInOutQuint = (x: number): number => {
      return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    };
    
    return from + (to - from) * easeInOutQuint(t);
  };

  // Update optimistic state for instant feedback
  const updateAnimationState = (newState: Partial<AnimationState>) => {
    startTransition(() => {
      setOptimisticState(newState);
    });
  };

  return {
    optimisticState,
    enhancedPhaseData,
    smoothTransition,
    updateAnimationState,
    isPending,
  };
};

function getCurrentPhase(progress: number): number {
  if (progress < 0.0201) return 1;
  if (progress < 0.1206) return 2;
  if (progress < 0.1448) return 3;
  if (progress < 0.3138) return 5;
  if (progress < 0.4103) return 6;
  if (progress < 0.5069) return 7;
  if (progress < 0.7) return 8;
  return 9;
}

function calculateEnhancedPhaseData(scrollProgress: number) {
  // React Compiler automatically optimizes this complex calculation
  return {
    currentPhase: getCurrentPhase(scrollProgress),
    transitionSmoothing: calculateTransitionSmoothing(scrollProgress),
    morphingIntensity: calculateMorphingIntensity(scrollProgress),
    brainActivityLevel: calculateBrainActivity(scrollProgress),
  };
}

function calculateTransitionSmoothing(progress: number): number {
  // Enhanced smoothing algorithm for React 19
  const phaseTransitions = [0.0201, 0.1206, 0.1448, 0.3138, 0.4103, 0.5069, 0.7];
  
  for (let i = 0; i < phaseTransitions.length; i++) {
    const current = phaseTransitions[i];
    const next = phaseTransitions[i + 1] || 1.0;
    
    if (progress >= current && progress < next) {
      const localProgress = (progress - current) / (next - current);
      // Smooth transition curve
      return 1 - Math.abs(localProgress - 0.5) * 2;
    }
  }
  
  return 1;
}

function calculateMorphingIntensity(progress: number): number {
  // Brain transformation phases have higher morphing intensity
  if (progress >= 0.5069 && progress < 0.7) {
    return 1.0; // Maximum morphing during brain popcorn
  }
  if (progress >= 0.7) {
    return 0.8; // Sustained morphing during brain formation
  }
  return 0.2; // Minimal morphing in other phases
}

function calculateBrainActivity(progress: number): number {
  // Simulate neural activity increasing as brain forms
  if (progress < 0.5069) return 0;
  if (progress >= 0.7) {
    // Full brain activity with realistic neural firing patterns
    const time = Date.now() * 0.001;
    return 0.7 + 0.3 * Math.sin(time * 2) * Math.cos(time * 3);
  }
  
  // Gradual activity increase during transformation
  const transformProgress = (progress - 0.5069) / (0.7 - 0.5069);
  return transformProgress * 0.5;
}

export default useEnhancedAnimation;