import React from 'react';
import type { CapabilityCellData, DynamicOverlayOption } from './types';

/*
 * Simple component used by the tooltip to render a list of overlay
 * attribute values.  Each row includes the overlay's icon, label and
 * numeric value (with unit).  Attributes that are undefined or not
 * numeric are skipped.
 */

interface AttributeListContentProps {
  data: CapabilityCellData;
  overlayConfig: DynamicOverlayOption[];
}

const AttributeListContent: React.FC<AttributeListContentProps> = ({ data, overlayConfig }) => {
  return (
    <div className="space-y-2 text-sm">
      {overlayConfig.map((opt) => {
        const value = data.attributes[opt.id];
        if (value === undefined || typeof value !== 'number') return null;

        return (
          <div key={opt.id} className="flex justify-between items-center text-[var(--heatmap-text-secondary)]">
            <div className="flex items-center space-x-2">
              {opt.iconComponent}
              <span>{opt.label}</span>
            </div>
            <span className="font-semibold text-[var(--heatmap-text-primary)]">
              {value}
              {opt.unit}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AttributeListContent;