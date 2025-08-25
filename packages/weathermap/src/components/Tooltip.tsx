import React from 'react';
import type { CapabilityCellData, DynamicOverlayOption, TooltipType } from './types';
import AttributeListContent from './AttributeListContent';
import SpiderChart from './SpiderChart';

/*
 * Tooltip displayed when hovering over a capability cell.  Depending on
 * the configured ``tooltipType`` and the available overlay data, the
 * tooltip will either render a simple attribute list or a radial
 * spider chart.  The tooltip positioning automatically flips above
 * or below the target cell based on available vertical space.
 */

interface TooltipProps {
  data: CapabilityCellData;
  showBelow: boolean;
  overlayConfig: DynamicOverlayOption[];
  tooltipType: TooltipType;
}

const Tooltip: React.FC<TooltipProps> = ({ data, showBelow, overlayConfig, tooltipType }) => {
  const positionClasses = showBelow ? 'top-full mt-2' : 'bottom-full mb-2';
  const arrowClasses = showBelow
    ? 'top-[-8px] border-b-8 border-b-[var(--heatmap-border-secondary)]'
    : 'bottom-[-8px] border-t-8 border-t-[var(--heatmap-border-secondary)]';

  // Determine whether any overlay attributes exist for this cell.
  const hasAttributes = overlayConfig.some(
    (opt) => data.attributes[opt.id] !== undefined && typeof data.attributes[opt.id] === 'number',
  );

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 w-72 p-4 bg-[var(--heatmap-bg-primary)] border border-[var(--heatmap-border-secondary)] rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10 pointer-events-none ${positionClasses}`}
    >
      <h4 className="font-bold text-lg text-[var(--heatmap-text-primary)]">{data.name}</h4>
      <p className="text-sm text-[var(--heatmap-text-accent)] font-mono mb-3">ID: {data.id}</p>

      {hasAttributes ? (
        tooltipType === 'list' ? (
          <AttributeListContent data={data} overlayConfig={overlayConfig} />
        ) : (
          <SpiderChart data={data} overlayConfig={overlayConfig} />
        )
      ) : (
        <p className="text-sm text-[var(--heatmap-text-muted)] italic">No overlay data available.</p>
      )}

      <div
        className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent ${arrowClasses}`}
      ></div>
    </div>
  );
};

export default Tooltip;