import React from 'react';
import type { CapabilityCellData, DynamicOverlayOption } from './types';

/*
 * Renders a radial spider (radar) chart inside the tooltip.  Each
 * axis corresponds to an overlay option and scales from 0 to 100.
 * The polygon connecting the data points visualises the relative
 * intensity of each overlay.  When fewer than three numeric data
 * points exist, the component falls back to a message indicating
 * that a chart cannot be rendered.
 */

interface SpiderChartProps {
  data: CapabilityCellData;
  overlayConfig: DynamicOverlayOption[];
}

const SpiderChart: React.FC<SpiderChartProps> = ({ data, overlayConfig }) => {
  const size = 250;
  const center = size / 2;
  const levels = 5;
  const radius = center * 0.8;

  const relevantAxes = overlayConfig.filter((opt) => typeof data.attributes[opt.id] === 'number');
  if (relevantAxes.length < 3) {
    return (
      <p className="text-sm text-center text-[var(--heatmap-text-muted)] italic">
        Need at least 3 data points for a chart.
      </p>
    );
  }
  const angleSlice = (Math.PI * 2) / relevantAxes.length;

  // Coordinates for the data polygon
  const dataPoints = relevantAxes
    .map((axis, i) => {
      const value = ((data.attributes[axis.id] as number) ?? 0) / 100;
      const x = center + radius * value * Math.cos(angleSlice * i - Math.PI / 2);
      const y = center + radius * value * Math.sin(angleSlice * i - Math.PI / 2);
      return `${x},${y}`;
    })
    .join(' ');

  // Precompute lines for web grid and axis labels
  const webLines: string[] = [];
  const axisLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const labels: { x: number; y: number; text: string }[] = [];

  for (let i = 0; i < relevantAxes.length; i++) {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    axisLines.push({ x1: center, y1: center, x2: x, y2: y });

    // Label positions slightly outside the outermost ring
    const labelX = center + radius * 1.2 * Math.cos(angle);
    const labelY = center + radius * 1.2 * Math.sin(angle);
    labels.push({ x: labelX, y: labelY, text: relevantAxes[i].label });
  }

  // Generate concentric polygon rings for the radar grid
  for (let level = 1; level <= levels; level++) {
    const levelRadius = (radius / levels) * level;
    const levelPoints = relevantAxes
      .map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const x = center + levelRadius * Math.cos(angle);
        const y = center + levelRadius * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
    webLines.push(levelPoints);
  }

  return (
    <div className="flex justify-center items-center h-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        <g>
          {webLines.map((points, i) => (
            <polygon
              key={`web-${i}`}
              points={points}
              className="stroke-[var(--heatmap-spider-web-color)] fill-none"
              strokeWidth="1"
            />
          ))}
        </g>
        <g>
          {axisLines.map((line, i) => (
            <line
              key={`axis-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              className="stroke-[var(--heatmap-spider-axis-color)]"
              strokeWidth="1"
            />
          ))}
        </g>
        <g>
          <polygon
            points={dataPoints}
            className="stroke-[var(--heatmap-spider-shape-stroke)] fill-[var(--heatmap-spider-shape-fill)]"
            strokeWidth="2"
          />
        </g>
        <g>
          {labels.map((label, i) => (
            <text
              key={`label-${i}`}
              x={label.x}
              y={label.y}
              dy="0.35em"
              className="text-[10px] fill-[var(--heatmap-spider-label-color)]"
              textAnchor={Math.abs(label.x - center) < 1 ? 'middle' : label.x > center ? 'start' : 'end'}
            >
              {label.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default SpiderChart;