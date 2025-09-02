import { Builder } from '@builder.io/react';
import RubiksCubeExperience from './RubiksCubeExperience';
import { FramedRubiksCube } from './FramedRubiksCube';
import { BuilderRubiksCubeContent } from './BuilderRubiksCubeContent';

// Register the framed version for content sections
Builder.registerComponent(FramedRubiksCube, {
  name: 'RubiksCubeFramed',
  friendlyName: '3D Rubik\'s Cube (Framed)',
  description: 'Interactive 3D Rubik\'s cube in a contained frame - perfect for content sections',
  image: 'https://cdn.builder.io/api/v1/image/assets%2Fplaceholder-image',
  inputs: [
    {
      name: 'height',
      type: 'string',
      defaultValue: '600px',
      helperText: 'Height of the animation frame (e.g., 400px, 60vh)'
    },
    {
      name: 'width', 
      type: 'string',
      defaultValue: '100%',
      helperText: 'Width of the animation frame (e.g., 800px, 100%)'
    },
    {
      name: 'enableDebug',
      type: 'boolean',
      defaultValue: false,
      helperText: 'Show debug information and phase tracker'
    },
    {
      name: 'autoPlay',
      type: 'boolean',
      defaultValue: true,
      helperText: 'Auto-scroll demo within frame'
    },
    {
      name: 'containerStyle',
      type: 'string',
      defaultValue: 'rounded',
      enum: ['rounded', 'sharp', 'bordered'],
      helperText: 'Visual style of the frame container'
    },
    {
      name: 'showScrollHint',
      type: 'boolean',
      defaultValue: true,
      helperText: 'Show scroll hint at bottom of frame'
    }
  ],
  canHaveChildren: false,
  noWrap: true,
});

// Register full-screen version for hero sections
Builder.registerComponent(RubiksCubeExperience, {
  name: 'RubiksCubeFullscreen',
  friendlyName: '3D Rubik\'s Cube (Fullscreen)',
  description: 'Full-screen 3D Rubik\'s cube - perfect for hero sections',
  image: 'https://cdn.builder.io/api/v1/image/assets%2Fplaceholder-image',
  inputs: [
    {
      name: 'height',
      type: 'string',
      defaultValue: '100vh',
      helperText: 'Height of the 3D canvas container'
    },
    {
      name: 'enableDebug',
      type: 'boolean', 
      defaultValue: false,
      helperText: 'Show debug information and phase tracker'
    }
  ],
  canHaveChildren: false,
  noWrap: true,
});

// Register the sophisticated content frame component for three-row layout
Builder.registerComponent(BuilderRubiksCubeContent, {
  name: 'RubiksCubeContent',
  friendlyName: '3D Rubik\'s Cube (Content Frame)',
  description: 'Full sophisticated 9-phase animation - perfect for the main content area of three-row websites',
  image: 'https://cdn.builder.io/api/v1/image/assets%2Fplaceholder-image',
  inputs: [
    {
      name: 'height',
      type: 'string',
      defaultValue: '100vh',
      helperText: 'Height of the content frame (e.g., 80vh, 600px). Use 100vh to fill entire content area.'
    },
    {
      name: 'width', 
      type: 'string',
      defaultValue: '100%',
      helperText: 'Width of the content frame. 100% recommended for full content width.'
    },
    {
      name: 'showPhaseInfo',
      type: 'boolean',
      defaultValue: true,
      helperText: 'Show phase information overlay in bottom-left corner'
    },
    {
      name: 'enableMouseRotation',
      type: 'boolean',
      defaultValue: true,
      helperText: 'Enable mouse rotation in phases 1 and 9'
    },
    {
      name: 'startingPhase',
      type: 'number',
      defaultValue: 1,
      enum: [1, 2, 3, 5, 6, 7, 8, 9],
      helperText: 'Starting animation phase (1=Group Rotate, 9=Brain Formation)'
    }
  ],
  canHaveChildren: false,
  noWrap: true,
});

// Wrapper for the fullscreen version
export const BuilderRubiksCubeFullscreen = ({ 
  height = '100vh', 
  enableDebug = false
}: {
  height?: string;
  enableDebug?: boolean;
}) => {
  return (
    <div style={{ height }} className="relative bg-black">
      <RubiksCubeExperience />
      {!enableDebug && (
        <style jsx>{`
          .fixed.top-4.right-4 {
            display: none;
          }
        `}</style>
      )}
    </div>
  );
};