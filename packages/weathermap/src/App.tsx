import React, { useState } from 'react';
import CapabilityHeatmapContainer from './components/CapabilityHeatmapContainer';
import type { CapabilityData, OverlayConfig, TooltipType } from './components/types';
import { fetchCapabilityData } from './services/fetchData';
import config from './config.json';
import { HEATMAP_GRADIENT_CSS } from './components/constants';

/*
 * The main application component orchestrates data fetching, overlay
 * selection and presentation of the capability heatmap.  Users can
 * choose which overlays to display, toggle the tooltip view between
 * list and chart, and specify the year for which capability data
 * should be fetched.  On initial load the canvas remains empty
 * until the user clicks "Fetch Data".
 */

const App: React.FC = () => {
  const [capabilities, setCapabilities] = useState<CapabilityData>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOverlays, setSelectedOverlays] = useState<string[]>([]);
  const [tooltipType, setTooltipType] = useState<TooltipType>('list');
  const [year, setYear] = useState<number>(2025);

  const overlayConfig: OverlayConfig[] = (config as any).overlays;

  const handleOverlayChange = (overlayId: string) => {
    setSelectedOverlays((prev) =>
      prev.includes(overlayId) ? prev.filter((o) => o !== overlayId) : [...prev, overlayId],
    );
  };

  const handleFetch = async () => {
    setLoading(true);
    try {
      const data = await fetchCapabilityData(year);
      setCapabilities(data);
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--heatmap-bg-page)]" style={{color: 'rgba(0, 0, 0, 1)'}}>
      {/* Control panel */}
      <aside className="md:w-72 w-full p-4 space-y-6 border-r border-[var(--heatmap-border-primary)]" style={{color: 'rgba(255, 255, 255, 1)', backgroundColor: 'rgba(117, 117, 117, 1)'}}>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold" style={{color: 'rgba(255, 255, 255, 1)'}}>Data Source</h2>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-[var(--heatmap-text-secondary)]">
              Year
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value) || 2025)}
              className="mt-1 block w-full bg-[var(--heatmap-bg-tertiary)] border-[var(--heatmap-border-secondary)] rounded-md shadow-sm py-2 px-3 text-[var(--heatmap-text-primary)] focus:outline-none focus:ring-[var(--heatmap-accent-focus-ring)] focus:border-[var(--heatmap-accent-focus-ring)] sm:text-sm"
            />
          </div>
          <button
            onClick={handleFetch}
            disabled={loading}
            className="w-full bg-[var(--heatmap-accent-primary)] text-[var(--heatmap-text-button)] font-bold py-2 px-4 rounded-md hover:bg-[var(--heatmap-accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--heatmap-bg-secondary)] focus:ring-[var(--heatmap-accent-focus-ring)] transition-colors duration-200 disabled:bg-[var(--heatmap-accent-disabled)] disabled:cursor-not-allowed"
            style={{color: 'rgba(255, 255, 255, 1)'}}
          >
            {loading ? 'Fetching...' : 'Fetch Data'}
          </button>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tooltip View</h2>
          <div className="flex items-center justify-between p-2 rounded-md bg-[var(--heatmap-bg-tertiary)]/50">
            <span className="font-medium text-[var(--heatmap-text-secondary)]">Display Mode</span>
            <div className="relative inline-flex items-center cursor-pointer">
              <button
                onClick={() => setTooltipType('list')}
                className={`px-3 py-1 text-sm rounded-l-md transition-colors ${
                  tooltipType === 'list'
                    ? 'bg-[var(--heatmap-accent-primary)] text-[var(--heatmap-text-button)]'
                    : 'bg-[var(--heatmap-bg-tertiary)] hover:bg-opacity-75'
                }`}
                style={{border: '1px solid rgba(214, 227, 19, 0)'}}
                aria-pressed={tooltipType === 'list'}
              >
                List
              </button>
              <button
                onClick={() => setTooltipType('chart')}
                className={`px-3 py-1 text-sm rounded-r-md transition-colors ${
                  tooltipType === 'chart'
                    ? 'bg-[var(--heatmap-accent-primary)] text-[var(--heatmap-text-button)]'
                    : 'bg-[var(--heatmap-bg-tertiary)] hover:bg-opacity-75'
                }`}
                aria-pressed={tooltipType === 'chart'}
              >
                Chart
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Heatmap Overlays</h2>
          {overlayConfig.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-[var(--heatmap-bg-tertiary)]/50 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedOverlays.includes(opt.id)}
                onChange={() => handleOverlayChange(opt.id)}
                className="h-5 w-5 rounded bg-[var(--heatmap-bg-tertiary)] border-[var(--heatmap-border-secondary)] text-[var(--heatmap-accent-primary)] focus:ring-[var(--heatmap-accent-focus-ring)] focus:ring-offset-[var(--heatmap-bg-secondary)]"
              />
              <span className="text-[var(--heatmap-text-secondary)] font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold">Legend</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 border-l-4" style={{ borderColor: 'var(--heatmap-rag-green)' }}></span>
              <span className="text-xs text-[var(--heatmap-text-muted)]">Green</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 border-l-4" style={{ borderColor: 'var(--heatmap-rag-amber)' }}></span>
              <span className="text-xs text-[var(--heatmap-text-muted)]">Amber</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 border-l-4" style={{ borderColor: 'var(--heatmap-rag-red)' }}></span>
              <span className="text-xs text-[var(--heatmap-text-muted)]">Red</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-[var(--heatmap-text-secondary)] mb-2">Heatmap Scale:</div>
            <div className="w-full h-4 rounded-full" style={{ background: HEATMAP_GRADIENT_CSS }}></div>
            <div className="flex justify-between text-xs text-[var(--heatmap-text-muted)] mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </aside>
      {/* Heatmap area */}
      <main className="flex-grow p-4" style={{backgroundColor: 'rgba(255, 255, 255, 1)'}}>
        <div className="h-full w-full">
          <CapabilityHeatmapContainer
            capabilities={capabilities}
            overlayConfig={overlayConfig}
            selectedOverlays={selectedOverlays}
            tooltipType={tooltipType}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
