import React from 'react';
import EpisodeItem from './EpisodeItem';

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

interface Chapter {
  id: string;
  title: string;
  episodes: Episode[];
}

interface ChapterSectionProps {
  chapter: Chapter;
  selectedEpisode: Episode | null;
  onEpisodeSelect: (episode: Episode) => void;
  formatDate: (dateString: string) => string;
}

const ChapterSection: React.FC<ChapterSectionProps> = ({
  chapter,
  selectedEpisode,
  onEpisodeSelect,
  formatDate
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-gray-800 mb-3 px-2">{chapter.title}</h3>
      <div className="space-y-2">
        {chapter.episodes.map((episode) => (
          <EpisodeItem
            key={episode.id}
            episode={episode}
            isSelected={selectedEpisode?.id === episode.id}
            onSelect={onEpisodeSelect}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  );
};

export default ChapterSection;
