import React, { useState } from 'react';
import type { CapabilityData, CapabilityCellData, DynamicOverlayOption, TooltipType } from './types';
import HeatmapGrid from './HeatmapGrid';
import Popup from './Popup';

/*
 * Top level wrapper around the heatmap grid.  It manages the state
 * for a modal popup when a capability cell with a ``popupUrl`` is
 * clicked.  If no capability data is provided the component
 * displays a placeholder waiting state.
 */

interface CapabilityHeatmapProps {
  capabilities: CapabilityData;
  selectedOverlays: string[];
  overlayConfig: DynamicOverlayOption[];
  tooltipType: TooltipType;
}

const CapabilityHeatmap: React.FC<CapabilityHeatmapProps> = ({ capabilities, selectedOverlays, overlayConfig, tooltipType }) => {
  const [popupData, setPopupData] = useState<CapabilityCellData | null>(null);

  const handleCellClick = (cellData: CapabilityCellData) => {
    if (cellData.attributes.popupUrl) {
      setPopupData(cellData);
    }
  };

  const handleClosePopup = () => {
    setPopupData(null);
  };

  if (!capabilities || capabilities.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-[var(--heatmap-bg-secondary)]/30 p-4 rounded-lg border border-dashed border-[var(--heatmap-border-dashed)]">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-[var(--heatmap-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-[var(--heatmap-text-secondary)]">No data</h3>
          <p className="mt-1 text-sm text-[var(--heatmap-text-muted)]">Waiting for capability data to be provided...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <HeatmapGrid
        capabilities={capabilities}
        selectedOverlays={selectedOverlays}
        onCellClick={handleCellClick}
        overlayConfig={overlayConfig}
        tooltipType={tooltipType}
      />
      {popupData && (
        <Popup
          url={popupData.attributes.popupUrl!}
          title={popupData.name}
          width={popupData.attributes.popupWidth as string | undefined}
          height={popupData.attributes.popupHeight as string | undefined}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default CapabilityHeatmap;