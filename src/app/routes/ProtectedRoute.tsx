import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isStudentAccount } from '../../lib/auth';
import { useAuthStore } from '../../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAuthenticated, bootstrapped, loading } = useAuthStore();
  const location = useLocation();

  if (!bootstrapped || loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400 text-sm">
        جاري التحقق من الجلسة...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isStudentAccount(user)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
