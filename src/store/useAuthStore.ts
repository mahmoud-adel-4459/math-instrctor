import { create } from 'zustand';
import type { User } from '../types';
import { AuthService } from '../services/auth.service';
import { CoursesService } from '../services/courses.service';
import { ApiClientError, getAccessToken, setAccessToken } from '../services/apiClient';

const USER_STORAGE_KEY = 'app_student_user';

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch {
    // Ignore localStorage errors
  }
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  bootstrapped: boolean;
  error: string | null;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  enrollInCourse: (courseId: string) => void;
  clearError: () => void;
  clearSession: () => void;
}

async function withEnrollments(user: User): Promise<User> {
  try {
    const courses = await CoursesService.getMyCourses();
    return { ...user, enrolledCourseIds: courses.data.map((course) => course.id) };
  } catch {
    return { ...user, enrolledCourseIds: user.enrolledCourseIds || [] };
  }
}

let bootstrapPromise: Promise<void> | null = null;

// Synchronous initial hydration from localStorage for 0ms UI render
const initialUser = getStoredUser();
const hasInitialToken = !!getAccessToken();
const isInitiallyAuthenticated = hasInitialToken && !!initialUser;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: isInitiallyAuthenticated ? initialUser : null,
  isAuthenticated: isInitiallyAuthenticated,
  loading: false,
  bootstrapped: isInitiallyAuthenticated,
  error: null,

  setUser: (user) => {
    setStoredUser(user);
    set({ user, isAuthenticated: !!user });
  },

  clearError: () => set({ error: null }),

  clearSession: () => {
    setAccessToken(null);
    setStoredUser(null);
    set({ user: null, isAuthenticated: false, loading: false, bootstrapped: true, error: null });
  },

  bootstrap: async () => {
    const token = getAccessToken();
    if (!token) {
      setStoredUser(null);
      set({ user: null, isAuthenticated: false, loading: false, bootstrapped: true });
      return;
    }

    if (bootstrapPromise) return bootstrapPromise;

    bootstrapPromise = (async () => {
      // If we don't have a cached user yet, show loading
      if (!get().user) {
        set({ loading: true });
      }

      try {
        const res = await AuthService.getCurrentUser();
        if (res.data) {
          const user = res.data;
          // Set user immediately so UI is responsive
          setStoredUser(user);
          set({ user, isAuthenticated: true, loading: false, bootstrapped: true, error: null });

          // Asynchronously fetch enrollments without blocking UI
          withEnrollments(user).then((fullUser) => {
            setStoredUser(fullUser);
            set({ user: fullUser });
          });
        } else {
          setStoredUser(null);
          setAccessToken(null);
          set({ user: null, isAuthenticated: false, loading: false, bootstrapped: true });
        }
      } catch (err: any) {
        if (err?.status === 401 || err?.statusCode === 401) {
          setAccessToken(null);
          setStoredUser(null);
          set({ user: null, isAuthenticated: false, loading: false, bootstrapped: true });
        }
      } finally {
        bootstrapPromise = null;
      }
    })();

    return bootstrapPromise;
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await AuthService.login({ emailOrPhone: email, password });
      const user = res.data.user;
      
      // Save and set user immediately
      setStoredUser(user);
      set({ user, isAuthenticated: true, loading: false, bootstrapped: true, error: null });

      // Fetch enrollments in background
      withEnrollments(user).then((fullUser) => {
        setStoredUser(fullUser);
        set({ user: fullUser });
      });
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.errors
            ? Object.values(error.errors).flat()[0] || error.message
            : error.message
          : 'تعذر تسجيل الدخول. تحقق من البيانات وحاول مرة أخرى.';
      set({ loading: false, error: message, isAuthenticated: false, user: null });
      throw error;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await AuthService.register(payload);
      const user = res.data.user;
      setStoredUser(user);
      set({ user, isAuthenticated: true, loading: false, bootstrapped: true, error: null });

      withEnrollments(user).then((fullUser) => {
        setStoredUser(fullUser);
        set({ user: fullUser });
      });
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.errors
            ? Object.values(error.errors).flat()[0] || error.message
            : error.message
          : 'حدث خطأ أثناء إنشاء الحساب.';
      set({ loading: false, error: message });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AuthService.logout();
    } finally {
      setAccessToken(null);
      setStoredUser(null);
      set({ user: null, isAuthenticated: false, loading: false, error: null, bootstrapped: true });
    }
  },

  enrollInCourse: (courseId) => {
    set((state) => {
      if (!state.user) return state;
      if (state.user.enrolledCourseIds?.includes(courseId)) return state;
      const updatedUser: User = {
        ...state.user,
        enrolledCourseIds: [...(state.user.enrolledCourseIds || []), courseId],
      };
      setStoredUser(updatedUser);
      return { user: updatedUser };
    });
  },
}));
