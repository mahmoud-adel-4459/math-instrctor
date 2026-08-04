import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: 'student' | 'instructor') => void;
  logout: () => void;
  enrollInCourse: (courseId: string) => void;
}

const mockStudentUser: User = {
  id: 'stu_101',
  name: 'أحمد محمود',
  email: 'ahmed@example.com',
  phone: '01012345678',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  gradeLevel: 'sec_3',
  enrolledCourseIds: ['course_sec3_calc', 'course_sec3_algebra'],
  joinedAt: '2026-01-15',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: mockStudentUser, // Pre-authenticated with mock student for seamless demo
  isAuthenticated: true,

  login: (email: string, role = 'student') => {
    set({
      user: {
        ...mockStudentUser,
        email,
        role,
      },
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  enrollInCourse: (courseId: string) => {
    set((state) => {
      if (!state.user) return state;
      if (state.user.enrolledCourseIds.includes(courseId)) return state;
      return {
        user: {
          ...state.user,
          enrolledCourseIds: [...state.user.enrolledCourseIds, courseId],
        },
      };
    });
  },
}));
