import React, { useEffect, useState } from 'react';
import type { CapabilityData, OverlayConfig, DynamicOverlayOption, TooltipType } from './types';
import CapabilityHeatmap from './CapabilityHeatmap';
import { ICONS } from './constants';

/*
 * Container component that converts a static overlay configuration
 * (imported from ``config.json``) into a dynamic configuration that
 * includes rendered icon components.  It simply forwards all props
 * down to the ``CapabilityHeatmap`` while performing this processing.
 *
 * The parent component (usually ``App.tsx``) is responsible for
 * supplying the overlay selections and managing fetch operations.
 */

interface Props {
  capabilities: CapabilityData;
  overlayConfig: OverlayConfig[];
  selectedOverlays: string[];
  tooltipType: TooltipType;
}

const CapabilityHeatmapContainer: React.FC<Props> = ({ capabilities, overlayConfig, selectedOverlays, tooltipType }) => {
  const [processedOverlayConfig, setProcessedOverlayConfig] = useState<DynamicOverlayOption[]>([]);

  useEffect(() => {
    // Convert the plain overlay config into one that contains actual
    // React icon components.  Icons are resolved from the ICONS map.
    const dynamicOptions: DynamicOverlayOption[] = overlayConfig.map((o) => ({
      ...o,
      iconComponent: ICONS[o.icon] ? React.createElement(ICONS[o.icon]) : null,
    }));
    setProcessedOverlayConfig(dynamicOptions);
  }, [overlayConfig]);

  return (
    <CapabilityHeatmap
      capabilities={capabilities}
      selectedOverlays={selectedOverlays}
      overlayConfig={processedOverlayConfig}
      tooltipType={tooltipType}
    />
  );
};

export default CapabilityHeatmapContainer;