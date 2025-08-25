// Shared types for lessons and courses
declare interface Lesson {
  id: string;
  title: string;
  file: string;
}

declare interface Course {
  title: string;
  description: string;
  modules: Array<{
    id: string;
    title: string;
    lessons: Lesson[];
  }>;
}
