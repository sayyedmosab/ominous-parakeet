// Shared types for lessons and courses
export interface Lesson {
  id: string;
  title: string;
  file: string;
}

export interface Course {
  title: string;
  description: string;
  modules: Array<{
    id: string;
    title: string;
    lessons: Lesson[];
  }>;
}
