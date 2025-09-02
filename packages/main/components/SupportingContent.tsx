import React from 'react';
import { Play, Video, FileText, Download } from 'lucide-react';
import CompactAudioControls from './CompactAudioControls';

interface Episode {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  contentPath: string;
  audioPath?: string;
  videoPath?: string;
  studyGuidePath?: string;
  briefPath?: string;
  images?: string[];
  isReleased: boolean;
  languages?: string[];
}

interface SupportingContentProps {
  selectedEpisode: Episode;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  audioState: 'playing' | 'paused' | 'stopped';
  audioProgress: number;
  audioDuration: number;
  handleAudioControl: (action: 'play' | 'pause' | 'stop' | 'forward' | 'backward') => void;
  handleVideoPlay: () => void;
  handleSupportingContentClick: (url: string, isDownload?: boolean) => void;
  handleNotebookOpen: () => void;
  formatTime: (seconds: number) => string;
}

const SupportingContent: React.FC<SupportingContentProps> = ({
  selectedEpisode,
  selectedLanguage,
  setSelectedLanguage,
  audioState,
  audioProgress,
  audioDuration,
  handleAudioControl,
  handleVideoPlay,
  handleSupportingContentClick,
  handleNotebookOpen,
  formatTime
}) => {
  return (
    <div className="w-full p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">SUPPORTING CONTENT</h3>

      {/* 4 equally-stretched supporting content elements */}
      <div className="grid grid-cols-4 gap-2 w-full mb-4">
        {/* Audio Podcast */}
        <button
          onClick={() => selectedEpisode.audioPath && handleAudioControl('play')}
          disabled={!selectedEpisode.audioPath}
          className={`flex items-center justify-center space-x-2 px-3 py-2 text-xs border-0 transition-colors ${
            selectedEpisode.audioPath
              ? 'bg-gray-900 hover:bg-gray-800 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Play className="w-3 h-3" />
          <span>PODCAST</span>
        </button>

        {/* Video */}
        <button
          onClick={() => selectedEpisode.videoPath && handleVideoPlay()}
          disabled={!selectedEpisode.videoPath}
          className={`flex items-center justify-center space-x-2 px-3 py-2 text-xs border-0 transition-colors ${
            selectedEpisode.videoPath
              ? 'bg-gray-900 hover:bg-gray-800 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Video className="w-3 h-3" />
          <span>VIDEO</span>
        </button>

        {/* Study Guide */}
        <button
          onClick={() => selectedEpisode.studyGuidePath && handleSupportingContentClick(`/lessons/${selectedEpisode.id}/${selectedEpisode.id}studyguide.pdf`, true)}
          disabled={!selectedEpisode.studyGuidePath}
          className={`flex items-center justify-center space-x-2 px-3 py-2 text-xs border-0 transition-colors ${
            selectedEpisode.studyGuidePath
              ? 'bg-gray-900 hover:bg-gray-800 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FileText className="w-3 h-3" />
          <span>STUDY GUIDE</span>
        </button>

        {/* Brief */}
        <button
          onClick={() => selectedEpisode.briefPath && handleSupportingContentClick(`/lessons/${selectedEpisode.id}/${selectedEpisode.id}brief.pdf`, true)}
          disabled={!selectedEpisode.briefPath}
          className={`flex items-center justify-center space-x-2 px-3 py-2 text-xs border-0 transition-colors ${
            selectedEpisode.briefPath
              ? 'bg-gray-900 hover:bg-gray-800 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Download className="w-3 h-3" />
          <span>BRIEF</span>
        </button>
      </div>

      {/* Compact Audio Controls */}
      {selectedEpisode.audioPath && audioState !== 'stopped' && (
        <CompactAudioControls
          audioState={audioState}
          audioProgress={audioProgress}
          audioDuration={audioDuration}
          handleAudioControl={handleAudioControl}
          handleNotebookOpen={handleNotebookOpen}
          formatTime={formatTime}
        />
      )}
    </div>
  );
};

export default SupportingContent;
