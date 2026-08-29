import { create } from 'zustand';
import type { Course, GradeLevel, SubjectBranch, VideoLesson } from '../types';
import { CoursesService } from '../services/courses.service';

const COURSES_STORAGE_KEY = 'app_cached_courses';

function getStoredCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Course[]) : [];
  } catch {
    return [];
  }
}

function setStoredCourses(courses: Course[]): void {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  } catch {
    // Ignore localStorage errors
  }
}

interface CourseState {
  courses: Course[];
  loading: boolean;
  selectedGrade: GradeLevel | 'all';
  selectedBranch: SubjectBranch | 'all';
  searchQuery: string;
  activeCourse: Course | null;
  activeLesson: VideoLesson | null;
  setSelectedGrade: (grade: GradeLevel | 'all') => void;
  setSelectedBranch: (branch: SubjectBranch | 'all') => void;
  setSearchQuery: (query: string) => void;
  setActiveCourse: (course: Course | null) => void;
  setActiveLesson: (lesson: VideoLesson | null) => void;
  setCourses: (courses: Course[]) => void;
  fetchCourses: (force?: boolean) => Promise<void>;
}

const initialCourses = getStoredCourses();

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: initialCourses,
  loading: initialCourses.length === 0,
  selectedGrade: 'all',
  selectedBranch: 'all',
  searchQuery: '',
  activeCourse: null,
  activeLesson: null,

  setSelectedGrade: (grade) => set({ selectedGrade: grade }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveCourse: (course) => set({ activeCourse: course }),
  setActiveLesson: (lesson) => set({ activeLesson: lesson }),
  setCourses: (courses) => {
    setStoredCourses(courses);
    set({ courses });
  },

  fetchCourses: async () => {
    // If we have no cached courses, indicate loading state
    if (get().courses.length === 0) {
      set({ loading: true });
    }
    try {
      const res = await CoursesService.getAllCourses({ per_page: 50 });
      if (res.data && Array.isArray(res.data)) {
        setStoredCourses(res.data);
        set({ courses: res.data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },
}));
