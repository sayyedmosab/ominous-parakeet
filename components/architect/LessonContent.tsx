import React, { useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Lesson } from '../../types';
import './LessonContent.css';

interface LessonContentProps {
  lesson: Lesson;
  content: string;
  isLoading: boolean;
  onNavigate: (dir: 'next' | 'prev') => void;
  onMarkComplete: (id: string) => void;
  isCompleted: boolean;
  isFirstLesson: boolean;
  isLastLesson: boolean;
  isAiTutorReady: boolean;
}

const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  content,
  isLoading,
  onNavigate,
  onMarkComplete,
  isCompleted,
  isFirstLesson,
  isLastLesson,
  isAiTutorReady,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const handleMouseUp = useCallback(() => {
    // Placeholder for text selection handling when AI tutor is ready
  }, [isAiTutorReady]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [lesson.id]);

  return (
    <div className="lesson-content" ref={contentRef} onMouseUp={handleMouseUp}>
      <div className="lesson-toolbar">
        <button className="lesson-nav-btn left" onClick={() => onNavigate('prev')} disabled={isFirstLesson}>Previous</button>
        <button className="lesson-complete-btn" onClick={() => onMarkComplete(lesson.id)}>{isCompleted ? 'Completed' : 'Mark Complete'}</button>
        <button className="lesson-nav-btn right" onClick={() => onNavigate('next')} disabled={isLastLesson}>Next</button>
      </div>
      {isLoading ? (
        <div className="loading-spinner" />
      ) : (
        <>
          {/* Explanation popover disabled until AI tutor integration */}
          <article className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </article>
        </>
      )}
    </div>
  );
};
export default LessonContent;
