import React from 'react';
import { Navigate } from 'react-router-dom';
import { isStudentAccount } from '../../lib/auth';
import { useAuthStore } from '../../store/useAuthStore';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { user, isAuthenticated, bootstrapped } = useAuthStore();

  if (!bootstrapped) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400 text-sm">
        جاري التحميل...
      </div>
    );
  }

  if (isAuthenticated && isStudentAccount(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
