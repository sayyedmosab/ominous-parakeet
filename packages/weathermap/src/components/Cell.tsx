import React, { useRef, useState, useEffect } from 'react';
import type { CapabilityCellData, DynamicOverlayOption, TooltipType } from './types';
import { RAG_COLORS } from './constants';
import Tooltip from './Tooltip';

/*
 * A single cell within the heatmap grid.  Each cell corresponds to a
 * capability at a given level (L1, L2 or L3) and displays its name
 * alongside a coloured left border representing the capability's
 * current RAG status.  When overlay data is available, hovering
 * over the cell reveals a tooltip with either a list of attribute
 * values or a spider chart.  If the capability defines a
 * ``popupUrl`` attribute, clicking the cell will open the URL in
 * a modal popup.
 */

interface CellProps {
  data: CapabilityCellData;
  onCellClick: (cellData: CapabilityCellData) => void;
  overlayConfig: DynamicOverlayOption[];
  tooltipType: TooltipType;
}

const Cell: React.FC<CellProps> = ({ data, onCellClick, overlayConfig, tooltipType }) => {
  const cellRef = useRef<HTMLDivElement>(null);
  const [showTooltipBelow, setShowTooltipBelow] = useState(false);

  // A capability is considered clickable only if it exposes a popup URL.
  const isClickable = !!data.attributes.popupUrl;

  useEffect(() => {
    if (cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      // Display the tooltip below the cell when there isn't enough
      // vertical space above the cell (simple heuristic).
      if (rect.top < 300) {
        setShowTooltipBelow(true);
      } else {
        setShowTooltipBelow(false);
      }
    }
  }, [data]);

  // Determine the appropriate border colour class from the RAG status.
  const borderClass = RAG_COLORS[data.status];
  const clickableClasses = isClickable ? 'cursor-pointer' : 'cursor-default';

  const handleClick = () => {
    if (isClickable) {
      onCellClick(data);
    }
  };

  return (
    <div
      ref={cellRef}
      className="relative group h-full w-full"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
      role={isClickable ? 'button' : 'gridcell'}
      tabIndex={isClickable ? 0 : -1}
      aria-label={`Capability ${data.name}`}
    >
      <div
        className={`relative h-full w-full border-l-4 ${borderClass} ${clickableClasses} flex items-center justify-center p-2 text-center rounded-md bg-[var(--heatmap-bg-tertiary)]/20 hover:bg-[var(--heatmap-bg-hover)] transition-all duration-200`}
      >
        <span className="text-[var(--heatmap-text-primary)] text-xs sm:text-sm font-medium break-words drop-shadow-md">
          {data.name}
        </span>
      </div>

      <Tooltip data={data} showBelow={showTooltipBelow} overlayConfig={overlayConfig} tooltipType={tooltipType} />
    </div>
  );
};

export default React.memo(Cell);