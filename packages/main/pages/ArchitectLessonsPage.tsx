import React from 'react';
import { useArchitectCourse } from '../../../hooks/useArchitectCourse';
import { LessonContent } from '../../../components/architect';

const ArchitectLessonsPage: React.FC = () => {
  const {
    modules,
    courseTitle,
    courseDescription,
    currentLesson,
    setCurrentLessonById,
    completedLessons,
    toggleLessonComplete,
    navigateLesson,
    isFirstLesson,
    isLastLesson,
    currentLessonContent,
    isLoadingContent,
  } = useArchitectCourse();

  return (
    <div>
      <h1>{courseTitle}</h1>
      <p>{courseDescription}</p>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <nav style={{ minWidth: 250 }}>
          {modules.map((mod) => (
            <div key={mod.id}>
              <h3>{mod.title}</h3>
              <ul>
                {mod.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <button onClick={() => setCurrentLessonById(lesson.id)} style={{ fontWeight: currentLesson?.id === lesson.id ? 'bold' : 'normal' }}>
                      {lesson.title} {completedLessons.has(lesson.id) ? '✓' : ''}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <main style={{ flex: 1 }}>
          {currentLesson ? (
            <LessonContent
              lesson={currentLesson}
              content={currentLessonContent}
              isLoading={isLoadingContent}
              onNavigate={navigateLesson}
              onMarkComplete={toggleLessonComplete}
              isCompleted={completedLessons.has(currentLesson.id)}
              isFirstLesson={isFirstLesson}
              isLastLesson={isLastLesson}
              isAiTutorReady={false}
            />
          ) : (
            <div>Select a lesson to begin.</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ArchitectLessonsPage;
