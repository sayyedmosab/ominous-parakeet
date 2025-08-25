import { useState, useEffect, useMemo, useCallback } from 'react';
import { Course, Lesson } from '../types';
import { course as courseData } from '../data/architect/course';

const COMPLETION_STORAGE_KEY = 'architectCourseCompletion';

export const useArchitectCourse = () => {
  const [course] = useState<Course>(courseData);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentLessonContent, setCurrentLessonContent] = useState('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const allLessonsFlat = useMemo(() => course?.modules.flatMap(m => m.lessons) || [], [course]);

  useEffect(() => {
    try {
      const storedCompletion = localStorage.getItem(COMPLETION_STORAGE_KEY);
      if (storedCompletion) {
        setCompletedLessons(new Set(JSON.parse(storedCompletion)));
      }
    } catch (error) {
      setCompletedLessons(new Set());
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(COMPLETION_STORAGE_KEY, JSON.stringify(Array.from(completedLessons)));
    } catch (error) {}
  }, [completedLessons]);

  useEffect(() => {
    if (currentLesson) {
      setIsLoadingContent(true);
      setCurrentLessonContent('');
  const url = `/architect/lessons/${currentLesson.file}`;
      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.text().then(text => setCurrentLessonContent(text));
        })
        .catch(() => {
          setCurrentLessonContent(`## Error\n\nCould not load lesson content from \`/public/lessons/${currentLesson.file}\`.`);
        })
        .finally(() => setIsLoadingContent(false));
    } else {
      setCurrentLessonContent('');
    }
  }, [currentLesson]);

  const findLessonById = useCallback((id: string) => allLessonsFlat.find(l => l.id === id) || null, [allLessonsFlat]);
  const setCurrentLessonById = useCallback((id: string) => setCurrentLesson(findLessonById(id)), [findLessonById]);
  const toggleLessonComplete = useCallback((id: string) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (!newSet.has(id)) newSet.add(id);
      return newSet;
    });
  }, []);
  const navigateLesson = useCallback((direction: 'next' | 'prev') => {
    if (!currentLesson) return;
    const currentIndex = allLessonsFlat.findIndex(l => l.id === currentLesson.id);
    if (currentIndex === -1) return;
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < allLessonsFlat.length) setCurrentLesson(allLessonsFlat[newIndex]);
  }, [currentLesson, allLessonsFlat]);
  const currentLessonIndex = useMemo(() => currentLesson ? allLessonsFlat.findIndex(l => l.id === currentLesson.id) : -1, [currentLesson, allLessonsFlat]);

  return {
    modules: course?.modules || [],
    courseTitle: course?.title || '',
    courseDescription: course?.description || '',
    currentLesson,
    setCurrentLessonById,
    completedLessons,
    toggleLessonComplete,
    navigateLesson,
    isFirstLesson: currentLessonIndex === 0,
    isLastLesson: allLessonsFlat.length > 0 && currentLessonIndex === allLessonsFlat.length - 1,
    currentLessonContent,
    isLoadingContent,
  };
};
