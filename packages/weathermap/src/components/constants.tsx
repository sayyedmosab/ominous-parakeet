import React from 'react';
import { RagStatus } from './types';

/*
 * This file defines several constants used by the heatmap.  The
 * RAG_COLORS map associates a RAG status with a Tailwind CSS
 * class string used to colour the left border of cells.  The
 * ICONS registry exposes a set of SVG icons for use in overlay
 * controls.  Finally, HEATMAP_GRADIENT_CSS defines a smooth
 * gradient used in the legend to visualise overlay intensities.
 */
// Map RAG statuses to Tailwind utility classes.  We rely on
// Tailwind's arbitrary value syntax to set the left border colour
// using CSS variables.  The ``border-l-4`` class on cells in
// ``Cell.tsx`` sets the thickness and the following class sets
// the colour.  Note: ``border-[color]`` applies colour to all
// borders, but only the left border is visible due to ``border-l-4``.
export const RAG_COLORS: Record<RagStatus, string> = {
  [RagStatus.Green]: 'border-[var(--heatmap-rag-green)]',
  [RagStatus.Amber]: 'border-[var(--heatmap-rag-amber)]',
  [RagStatus.Red]: 'border-[var(--heatmap-rag-red)]',
};

const StaffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015.5-5h.058a5 5 0 014.9 6.454 6.97 6.97 0 00-3.454 4.545A5 5 0 011 16v1h5v-6z" />
  </svg>
);
const ToolsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106A1.532 1.532 0 0111.49 3.17zM10 13a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);
const DocsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
      clipRule="evenodd"
    />
  </svg>
);
const HealthIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
      clipRule="evenodd"
    />
  </svg>
);
const ResistanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 3.5a1.5 1.5 0 01.82 2.87l1.18.59a3.5 3.5 0 011.5 4.04l-1.03 2.06a1.5 1.5 0 01-2.73-.21l-.64-2.56a1.5 1.5 0 01.3-1.39l.74-1.48a1.5 1.5 0 01.1-1.68l-1.18-.59A1.5 1.5 0 0110 3.5z" />
    <path
      fillRule="evenodd"
      d="M8.42 3.454a1.5 1.5 0 012.98-.29l.34 1.35a3.5 3.5 0 01-2.23 4.5l-1.49.74a1.5 1.5 0 01-1.92-2.34l1.03-2.06a1.5 1.5 0 011.29-1.3zM5.5 12.06l1.03-2.06A1.5 1.5 0 018.8 8.1l1.49.75a3.5 3.5 0 012.23 4.5l.34 1.35a1.5 1.5 0 01-2.98.29l-.34-1.35a3.5 3.5 0 012.23-4.5l1.49-.75a1.5 1.5 0 011.92 2.34l-1.03 2.06a1.5 1.5 0 01-2.27 1.3l-1.49-.75a3.5 3.5 0 01-2.23-4.5L8.5 9.71a1.5 1.5 0 012.98-.29l.34 1.35a3.5 3.5 0 01-2.23 4.5l-1.49.74a1.5 1.5 0 01-1.92-2.34z"
      clipRule="evenodd"
    />
  </svg>
);
const BudgetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.134 0V7.418zM11.567 7.151c.22.07.412.164.567.267v1.698a2.5 2.5 0 01-1.134 0V7.151z" />
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.5 4.5 0 00-1.831.666l-.295-.295a1 1 0 00-1.414 1.414l.295.295A4.5 4.5 0 006 10c0 1.54.783 2.91 2 3.732V15a1 1 0 102 0v-1.268a4.5 4.5 0 002-3.732c0-1.54-.783-2.91-2-3.732V5z"
      clipRule="evenodd"
    />
  </svg>
);
const RiskIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

export const ICONS: Record<string, React.FC> = {
  StaffIcon,
  ToolsIcon,
  DocsIcon,
  HealthIcon,
  ResistanceIcon,
  BudgetIcon,
  RiskIcon,
};

export const HEATMAP_GRADIENT_CSS =
  'linear-gradient(to right, rgb(0, 255, 0), rgb(255, 255, 0), rgb(255, 0, 0))';