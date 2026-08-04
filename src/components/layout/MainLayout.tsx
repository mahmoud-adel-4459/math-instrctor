import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export interface MainLayoutProps {
  children?: React.ReactNode;
  showFooter?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-cairo selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full relative">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};
