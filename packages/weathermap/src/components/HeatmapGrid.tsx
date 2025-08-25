import React, { useRef } from 'react';
import type { CapabilityData, CapabilityCellData, DynamicOverlayOption, TooltipType } from './types';
import Cell from './Cell';
import WeatherHeatmapOverlay from './WeatherHeatmapOverlay';

interface HeatmapGridProps {
  capabilities: CapabilityData;
  selectedOverlays: string[];
  onCellClick: (cellData: CapabilityCellData) => void;
  overlayConfig: DynamicOverlayOption[];
  tooltipType: TooltipType;
}

const HeatmapGrid: React.FC<HeatmapGridProps> = ({ capabilities, selectedOverlays, onCellClick, overlayConfig, tooltipType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  if (!capabilities.length) {
    return null;
  }
  const maxL3Count = Math.max(
    0,
    ...capabilities.flatMap(l1 => (l1.l2Capabilities.length > 0 ? l1.l2Capabilities.map(l2 => l2.l3Capabilities.length) : [0]))
  );
  const totalCols = 2 + maxL3Count;
  const totalRows = capabilities.reduce((sum, l1) => sum + Math.max(1, l1.l2Capabilities.length), 0);
  const cellsToRender: Array<{ key: string; data: any; style: React.CSSProperties }> = [];
  let currentRow = 1;
  capabilities.forEach(l1 => {
    const l1RowStart = currentRow;
    const l1RowSpan = Math.max(1, l1.l2Capabilities.length);
    cellsToRender.push({
      key: l1.id,
      data: l1,
      style: { gridColumn: '1 / 2', gridRow: `${l1RowStart} / span ${l1RowSpan}` },
    });
    if (l1.l2Capabilities.length === 0) {
      currentRow++;
    } else {
      l1.l2Capabilities.forEach(l2 => {
        cellsToRender.push({
          key: l2.id,
          data: l2,
          style: { gridColumn: '2 / 3', gridRow: `${currentRow} / span 1` },
        });
        l2.l3Capabilities.forEach((l3, l3Index) => {
          cellsToRender.push({
            key: l3.id,
            data: l3,
            style: { gridColumn: `${3 + l3Index} / span 1`, gridRow: `${currentRow} / span 1` },
          });
        });
        currentRow++;
      });
    }
  });
  return (
    <div ref={containerRef} className="relative bg-[var(--heatmap-bg-secondary)]/30 p-4 rounded-lg border border-[var(--heatmap-border-primary)] h-full w-full overflow-auto">
      <WeatherHeatmapOverlay capabilities={capabilities} selectedOverlays={selectedOverlays} containerRef={containerRef} />
      <div
        className="grid relative h-full"
        style={{
          gridTemplateColumns: `repeat(${totalCols}, minmax(120px, 1fr))`,
          gridTemplateRows: `repeat(${totalRows}, minmax(80px, auto))`,
          gap: '8px',
        }}
      >
        {cellsToRender.map(({ key, data, style }) => (
          <div key={key} style={style}>
            <Cell data={data} onCellClick={onCellClick} overlayConfig={overlayConfig} tooltipType={tooltipType} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(HeatmapGrid);