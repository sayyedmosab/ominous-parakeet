import React from 'react';

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

interface EpisodeItemProps {
  episode: Episode;
  isSelected: boolean;
  onSelect: (episode: Episode) => void;
  formatDate: (dateString: string) => string;
}

const EpisodeItem: React.FC<EpisodeItemProps> = ({
  episode,
  isSelected,
  onSelect,
  formatDate
}) => {
  return (
    <div
      className={`p-3 mx-2 rounded-lg transition-all duration-200 ${
        isSelected
          ? 'bg-blue-50 border border-blue-200'
          : episode.isReleased
          ? 'bg-gray-50 hover:bg-gray-100 border border-transparent cursor-pointer'
          : 'bg-gray-100 border border-gray-200 opacity-50 cursor-not-allowed'
      }`}
      onClick={() => episode.isReleased && onSelect(episode)}
    >
      <h4 className="font-medium text-gray-900 text-xs mb-2">{episode.title}</h4>
      <p className="text-xs text-gray-600 mb-2 leading-relaxed">{episode.description}</p>
      <div className="text-xs text-gray-500">
        {episode.isReleased ? `Released: ${formatDate(episode.releaseDate)}` : `Coming: ${formatDate(episode.releaseDate)}`}
      </div>
    </div>
  );
};

export default EpisodeItem;
