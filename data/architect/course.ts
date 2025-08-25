import { Course } from '../../types';

export const course: Course = {
  title: 'Think Like an Architect',
  description: 'A comprehensive course to develop an architect’s mindset, toolkit, and practice.',
  modules: [
    {
      id: 'chapter-1',
      title: 'CHAPTER 1: THE MECHANICS OF TRANSFORMATION',
      lessons: [
        { id: 'episode-1-1', title: 'Episode 1.1: What is an Organizational Transformation?', file: 'Episode 1.1.md' },
        { id: 'episode-1-2', title: 'Episode 1.2: What is a Sector Transformation?', file: 'Episode 1.2.md' },
        { id: 'episode-1-3', title: 'Episode 1.3: The People Transformation', file: 'Episode 1.3.md' },
        { id: 'episode-1-4', title: 'Episode 1.4: The Entangled Transformation', file: 'Episode 1.4.md' },
      ],
    },
    {
      id: 'chapter-2',
      title: 'CHAPTER 2: THE ARCHITECTURAL BLUEPRINT IN PRACTICE',
      lessons: [
        { id: 'episode-2-1', title: 'Episode 2.1: Strategic Performance (KPIs)', file: 'Episode 2.1.md' },
        { id: 'episode-2-2', title: 'Episode 2.2: Portfolios & Initiatives', file: 'Episode 2.2.md' },
        { id: 'episode-2-3', title: 'Episode 2.3: Process Architecture', file: 'Episode 2.3.md' },
        { id: 'episode-2-4', title: 'Episode 2.4: Organizational Design', file: 'Episode 2.4.md' },
      ],
    },
    {
      id: 'chapter-3',
      title: 'CHAPTER 3: THE MANAGEMENT OPERATING SYSTEM',
      lessons: [
        { id: 'episode-3-1', title: 'Episode 3.1: The Integrated Governance', file: 'Episode 3.1.md' },
        { id: 'episode-3-2', title: 'Episode 3.2: The Delivery Engine', file: 'Episode 3.2.md' },
        { id: 'episode-3-3', title: 'Episode 3.3: Change Architecture', file: 'Episode 3.3.md' },
        { id: 'episode-3-4', title: 'Episode 3.4: The Enablers', file: 'Episode 3.4.md' },
      ],
    },
    {
      id: 'chapter-4',
      title: 'CHAPTER 4: AN OPEN-SOURCE TOOLKIT FOR YOUR FIRST 90 DAYS',
      lessons: [
        { id: 'episode-4-1', title: 'Day 1-15: Diagnose Your Starting Point', file: 'Episode 4.1.md' },
        { id: 'episode-4-2', title: 'Day 16-60: Architect Your First "Golden Thread"', file: 'Episode 4.2.md' },
        { id: 'episode-4-3', title: 'Day 61-90: Launch Your First Integrated Governance Forum', file: 'Episode 4.3.md' },
      ],
    },
  ],
};
