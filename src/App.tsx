import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { LessonViewPage } from './pages/LessonViewPage';
import { ExamsPage } from './pages/ExamsPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { FaqPage } from './pages/FaqPage';
import { Preloader } from './components/common/Preloader';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Preloader />
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/lesson/:lessonId" element={<LessonViewPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/dashboard" element={<StudentDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;
