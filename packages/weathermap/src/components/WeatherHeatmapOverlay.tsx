import React, { useRef, useEffect } from 'react';
import type { CapabilityData } from './types';

interface WeatherHeatmapOverlayProps {
  capabilities: CapabilityData;
  selectedOverlays: string[];
  containerRef: React.RefObject<HTMLDivElement>;
}

// Helper for linear interpolation between two values.  Used in
// colour interpolation.
const lerp = (a: number, b: number, t: number) => a + t * (b - a);

// Calculates a colour on the green→yellow→red gradient for a given
// intensity.  Intensities are clamped between 0 and 1.
const calculateGradientColor = (intensity: number): { r: number; g: number; b: number } => {
  const t = Math.max(0, Math.min(1, intensity));
  const green = { r: 0, g: 255, b: 0 };
  const yellow = { r: 255, g: 255, b: 0 };
  const red = { r: 255, g: 0, b: 0 };
  if (t < 0.5) {
    const scaledT = t * 2;
    return {
      r: Math.round(lerp(green.r, yellow.r, scaledT)),
      g: Math.round(lerp(green.g, yellow.g, scaledT)),
      b: Math.round(lerp(green.b, yellow.b, scaledT)),
    };
  }
  const scaledT = (t - 0.5) * 2;
  return {
    r: Math.round(lerp(yellow.r, red.r, scaledT)),
    g: Math.round(lerp(yellow.g, red.g, scaledT)),
    b: Math.round(lerp(yellow.b, red.b, scaledT)),
  };
};

const WeatherHeatmapOverlay: React.FC<WeatherHeatmapOverlayProps> = ({ capabilities, selectedOverlays, containerRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || capabilities.length === 0) return;
    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    if (selectedOverlays.length === 0) return;
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    const offscreenCtx = offscreenCanvas.getContext('2d');
    if (!offscreenCtx) return;
    const padding = 16;
    const gap = 8;
    const gridWidth = width - padding * 2;
    const gridHeight = height - padding * 2;
    const maxL3Count = Math.max(0, ...capabilities.flatMap(l1 => (l1.l2Capabilities.length > 0 ? l1.l2Capabilities.map(l2 => l2.l3Capabilities.length) : [0])));
    const totalCols = 2 + maxL3Count;
    const totalRows = capabilities.reduce((sum, l1) => sum + Math.max(1, l1.l2Capabilities.length), 0);
    if (totalCols <= 2 || totalRows === 0) return;
    const cellWidth = (gridWidth - (totalCols - 1) * gap) / totalCols;
    const cellHeight = (gridHeight - (totalRows - 1) * gap) / totalRows;
    const drawBlob = (cell: any, cx: number, cy: number, radius: number) => {
      const totalValue = selectedOverlays.reduce((acc, key) => acc + (Number(cell.attributes[key]) || 0), 0);
      const averageValue = selectedOverlays.length > 0 ? totalValue / selectedOverlays.length : 0;
      const normalizedValue = averageValue / 100;
      if (normalizedValue > 0.1) {
        const gradient = offscreenCtx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, `rgba(0, 0, 0, ${normalizedValue * 0.8})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        offscreenCtx.fillStyle = gradient;
        offscreenCtx.beginPath();
        offscreenCtx.arc(cx, cy, radius, 0, 2 * Math.PI);
        offscreenCtx.fill();
      }
    };
    let currentRowIndex = 0;
    capabilities.forEach(l1 => {
      const l1RowSpan = Math.max(1, l1.l2Capabilities.length);
      const l1Height = l1RowSpan * cellHeight + (l1RowSpan - 1) * gap;
      const l1cx = padding + cellWidth / 2;
      const l1cy = padding + currentRowIndex * (cellHeight + gap) + l1Height / 2;
      const l1Radius = Math.max(cellWidth, l1Height) * 0.7;
      drawBlob(l1, l1cx, l1cy, l1Radius);
      l1.l2Capabilities.forEach(l2 => {
        const l2cx = padding + (cellWidth + gap) + cellWidth / 2;
        const l2cy = padding + currentRowIndex * (cellHeight + gap) + cellHeight / 2;
        const l2Radius = Math.max(cellWidth, cellHeight) * 0.7;
        drawBlob(l2, l2cx, l2cy, l2Radius);
        l2.l3Capabilities.forEach((l3, l3Index) => {
          const l3cx = padding + (2 + l3Index) * (cellWidth + gap) + cellWidth / 2;
          const l3cy = padding + currentRowIndex * (cellHeight + gap) + cellHeight / 2;
          const l3Radius = Math.max(cellWidth, cellHeight) * 0.7;
          drawBlob(l3, l3cx, l3cy, l3Radius);
        });
        currentRowIndex++;
      });
      if (l1.l2Capabilities.length === 0) {
        currentRowIndex++;
      }
    });
    const blurAmount = Math.max(cellWidth, cellHeight) / 2.5;
    ctx.filter = `blur(${blurAmount}px)`;
    ctx.drawImage(offscreenCanvas, 0, 0);
    ctx.filter = 'none';
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const intensity = pixels[i + 3] / 255;
      if (intensity > 0.15) {
        const colour = calculateGradientColor(intensity);
        pixels[i] = colour.r;
        pixels[i + 1] = colour.g;
        pixels[i + 2] = colour.b;
        pixels[i + 3] = 230;
      } else {
        pixels[i + 3] = 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [capabilities, selectedOverlays, containerRef]);
  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden="true" />;
};

export default React.memo(WeatherHeatmapOverlay);