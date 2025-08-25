import React, { useEffect } from 'react';

/*
 * A generic modal popup used to display arbitrary content in an
 * iframe.  When the user clicks outside the modal or presses the
 * Escape key the popup closes.  The caller controls the URL, title
 * and optional width/height for the iframe.
 */

interface PopupProps {
  url: string;
  title: string;
  width?: string;
  height?: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ url, title, width = '80vw', height = '80vh', onClose }) => {
  // Listen for Escape key to close the modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-[var(--heatmap-bg-popup-overlay)] flex items-center justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-[var(--heatmap-bg-secondary)] rounded-lg shadow-2xl flex flex-col relative overflow-hidden border border-[var(--heatmap-border-secondary)]"
        style={{ width, height }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 bg-[var(--heatmap-bg-popup-header)] flex-shrink-0">
          <h2 className="text-lg font-semibold text-[var(--heatmap-text-primary)] truncate" title={title}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--heatmap-text-muted)] hover:text-[var(--heatmap-text-primary)] transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="flex-grow bg-[var(--heatmap-bg-popup-body)] overflow-auto">
          <iframe src={url} title={title} className="w-full h-full border-0" />
        </div>
      </div>
    </div>
  );
};

export default Popup;