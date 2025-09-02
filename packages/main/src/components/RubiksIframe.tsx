import React, { useEffect, useMemo, useRef } from 'react';

interface RubiksIframeProps {
  height?: string;
  progress?: number | null; // 0..1 to externally drive the animation; null to let iframe use its own scroll
  onReady?: () => void;
  onProgress?: (value: number) => void;
  onPhaseChange?: (id: number, label: string) => void;
}

const RubiksIframe: React.FC<RubiksIframeProps> = ({ height = '100vh', progress = null, onReady, onProgress, onPhaseChange }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const targetOrigin = useMemo(() => '*', []);

  // Listen to messages from the iframe
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      const data = e && (e.data as any);
      if (!data || typeof data !== 'object') return;
      if (data.type === 'RUBIKS_READY') {
        onReady && onReady();
      } else if (data.type === 'RUBIKS_PROGRESS') {
        const v = Number(data.value);
        if (!Number.isNaN(v)) onProgress && onProgress(v);
      } else if (data.type === 'RUBIKS_PHASE') {
        const id = Number(data.id);
        const label = String(data.label ?? '');
        if (!Number.isNaN(id)) onPhaseChange && onPhaseChange(id, label);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onReady, onProgress, onPhaseChange]);

  // Push progress to the iframe when provided
  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    if (progress === null || typeof progress === 'undefined') {
      win.postMessage({ type: 'RUBIKS_CLEAR_EXTERNAL' }, targetOrigin);
    } else {
      const v = Math.max(0, Math.min(1, Number(progress)));
      if (!Number.isNaN(v)) {
        win.postMessage({ type: 'RUBIKS_SET_PROGRESS', value: v }, targetOrigin);
      }
    }
  }, [progress, targetOrigin]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <iframe
        ref={iframeRef}
        src="/rubiks-cdn.html?v=26"
        title="Rubiks Animation"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        allow="autoplay"
      />
    </div>
  );
};

export default RubiksIframe;
