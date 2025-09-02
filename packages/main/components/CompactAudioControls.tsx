import React from 'react';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2, Mic } from 'lucide-react';

interface CompactAudioControlsProps {
  audioState: 'playing' | 'paused' | 'stopped';
  audioProgress: number;
  audioDuration: number;
  handleAudioControl: (action: 'play' | 'pause' | 'stop' | 'forward' | 'backward') => void;
  handleNotebookOpen: () => void;
  formatTime: (seconds: number) => string;
}

const CompactAudioControls: React.FC<CompactAudioControlsProps> = ({
  audioState,
  audioProgress,
  audioDuration,
  handleAudioControl,
  handleNotebookOpen,
  formatTime
}) => {
  return (
    <div className="flex items-center space-x-3 bg-gray-100 px-3 py-2 border-l-2 border-gray-900">
      <div className="flex items-center space-x-1">
        <button onClick={() => handleAudioControl('backward')} className="text-gray-900 hover:text-gray-700">
          <SkipBack className="w-4 h-4" />
        </button>
        <button onClick={() => handleAudioControl(audioState === 'playing' ? 'pause' : 'play')} className="text-gray-900 hover:text-gray-700">
          {audioState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => handleAudioControl('stop')} className="text-gray-900 hover:text-gray-700">
          <Square className="w-4 h-4" />
        </button>
        <button onClick={() => handleAudioControl('forward')} className="text-gray-900 hover:text-gray-700">
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <Volume2 className="w-4 h-4 text-gray-900 flex-shrink-0" />
        <div className="flex-1 bg-gray-300 h-1 min-w-[60px]">
          <div
            className="bg-gray-900 h-1"
            style={{ width: `${(audioProgress / audioDuration) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-900 flex-shrink-0 min-w-[60px]">
          {formatTime(audioProgress)}/{formatTime(audioDuration)}
        </span>
      </div>
      <button
        onClick={handleNotebookOpen}
        className="bg-gray-900 text-white px-2 py-1 text-xs hover:bg-gray-800 flex items-center gap-1 border-0 transition-colors flex-shrink-0"
      >
        <Mic className="w-3 h-3" />
        ASK
      </button>
    </div>
  );
};

export default CompactAudioControls;
