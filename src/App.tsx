import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { StudentLayout } from './components/layout/StudentLayout';

// Common
import { Preloader } from './components/common/Preloader';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Route Guards
import { ProtectedRoute } from './app/routes/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailsPage } from './pages/public/CourseDetailsPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/public/TermsOfServicePage';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Student Pages
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { MyCoursesPage } from './pages/student/MyCoursesPage';
import { CourseLearningPage } from './pages/student/CourseLearningPage';
import { LessonPage } from './pages/student/LessonPage';
import { QuizPage } from './pages/student/QuizPage';
import { ExamPage } from './pages/student/ExamPage';
import { ResultsPage } from './pages/student/ResultsPage';
import { CertificatesPage } from './pages/student/CertificatesPage';
import { OrdersPage } from './pages/student/OrdersPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { NotificationsPage } from './pages/student/NotificationsPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <Preloader />
          <Routes>
            {/* PUBLIC WEBSITE ROUTES (Wrapped in MainLayout) */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <HomePage />
                </MainLayout>
              }
            />
            <Route
              path="/courses"
              element={
                <MainLayout>
                  <CoursesPage />
                </MainLayout>
              }
            />
            <Route
              path="/courses/:slug"
              element={
                <MainLayout>
                  <CourseDetailsPage />
                </MainLayout>
              }
            />
            <Route
              path="/about"
              element={
                <MainLayout>
                  <AboutUsPage />
                </MainLayout>
              }
            />
            <Route
              path="/faq"
              element={
                <MainLayout>
                  <FaqPage />
                </MainLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <MainLayout>
                  <ContactPage />
                </MainLayout>
              }
            />
            <Route
              path="/privacy"
              element={
                <MainLayout>
                  <PrivacyPolicyPage />
                </MainLayout>
              }
            />
            <Route
              path="/terms"
              element={
                <MainLayout>
                  <TermsOfServicePage />
                </MainLayout>
              }
            />

            {/* AUTH ROUTES */}
            <Route
              path="/login"
              element={
                <MainLayout>
                  <LoginPage />
                </MainLayout>
              }
            />
            <Route
              path="/register"
              element={
                <MainLayout>
                  <RegisterPage />
                </MainLayout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <MainLayout>
                  <ForgotPasswordPage />
                </MainLayout>
              }
            />

            {/* PROTECTED STUDENT PLATFORM ROUTES (Wrapped in StudentLayout) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <StudentDashboardPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <MyCoursesPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-courses/:courseSlug"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <CourseLearningPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-courses/:courseSlug/lesson/:lessonId"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <LessonPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-courses/:courseSlug/quiz/:quizId"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <QuizPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-courses/:courseSlug/exam/:examId"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <ExamPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <ResultsPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <CertificatesPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <OrdersPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <ProfilePage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <NotificationsPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            {/* Legacy route compatibility fallback */}
            <Route
              path="/lesson/:lessonId"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <LessonPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exams"
              element={
                <ProtectedRoute>
                  <StudentLayout>
                    <ResultsPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
