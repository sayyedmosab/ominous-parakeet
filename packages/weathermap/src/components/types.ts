import type React from 'react';

// Enumerates the possible RAG (Red, Amber, Green) status values used
// throughout the heatmap.  These values map directly onto CSS
// classes defined in constants.tsx for colouring borders.
export enum RagStatus {
  Red = 'Red',
  Amber = 'Amber',
  Green = 'Green',
}

// Defines a bag of arbitrary overlay attributes attached to a
// capability.  Each key corresponds to the `id` property of an
// overlay defined in config.json.  Values are usually numbers
// representing percentages or counts used by the weather overlay.
export interface CellAttributes {
  [key: string]: number | string | undefined;
  popupUrl?: string;
  popupWidth?: string;
  popupHeight?: string;
}

// Base interface for a capability cell at any level.  It includes
// identification, display name, RAG status and associated overlay
// attributes.
export interface CapabilityCellData {
  id: string;
  name: string;
  status: RagStatus;
  attributes: CellAttributes;
}

export interface L3Capability extends CapabilityCellData {}

export interface L2Capability extends CapabilityCellData {
  l3Capabilities: L3Capability[];
}

export interface L1Capability extends CapabilityCellData {
  l2Capabilities: L2Capability[];
}

export type CapabilityData = L1Capability[];

export interface OverlayConfig {
  id: string;
  label: string;
  unit: string;
  icon: string;
}

export interface DynamicOverlayOption extends OverlayConfig {
  iconComponent: React.ReactNode;
}

export type TooltipType = 'list' | 'chart';