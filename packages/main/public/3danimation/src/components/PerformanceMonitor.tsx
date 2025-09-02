import React, { useEffect, useState, useRef } from 'react';

/**
 * React 19 + Three.js 0.172.0 Performance Monitor
 * Tracks 60fps performance and optimization metrics
 */

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderCalls: number;
  geometryCount: number;
  textureCount: number;
  isOptimized: boolean;
}

export const PerformanceMonitor: React.FC<{ enabled?: boolean }> = ({ 
  enabled = false 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    renderCalls: 0,
    geometryCount: 0,
    textureCount: 0,
    isOptimized: true,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameTimesRef = useRef<number[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let animationFrame: number;

    const measurePerformance = () => {
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      
      frameCountRef.current++;
      frameTimesRef.current.push(deltaTime);
      
      // Keep only last 60 frame times
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Calculate metrics every 60 frames
      if (frameCountRef.current % 60 === 0) {
        const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
        const fps = Math.round(1000 / avgFrameTime);
        
        // Get memory usage if available
        const memoryInfo = (performance as any).memory;
        const memoryUsage = memoryInfo ? Math.round(memoryInfo.usedJSHeapSize / 1048576) : 0;

        setMetrics(prev => ({
          ...prev,
          fps,
          frameTime: Math.round(avgFrameTime * 100) / 100,
          memoryUsage,
          isOptimized: fps >= 55, // Consider optimized if above 55fps
        }));
      }

      lastTimeRef.current = now;
      animationFrame = requestAnimationFrame(measurePerformance);
    };

    animationFrame = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg font-mono text-sm">
      <div className="space-y-1">
        <div className={`flex justify-between ${metrics.fps >= 55 ? 'text-green-400' : 'text-red-400'}`}>
          <span>FPS:</span>
          <span>{metrics.fps}</span>
        </div>
        <div className="flex justify-between text-cyan-400">
          <span>Frame:</span>
          <span>{metrics.frameTime}ms</span>
        </div>
        <div className="flex justify-between text-purple-400">
          <span>Memory:</span>
          <span>{metrics.memoryUsage}MB</span>
        </div>
        <div className={`flex justify-between ${metrics.isOptimized ? 'text-green-400' : 'text-yellow-400'}`}>
          <span>Status:</span>
          <span>{metrics.isOptimized ? 'Optimized' : 'Optimizing...'}</span>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          React 19 + Three.js 0.172.0
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;