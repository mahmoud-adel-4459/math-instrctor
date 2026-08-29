import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { SEOHead } from '../../seo/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead title="الصفحة غير موجودة" description="الصفحة المطلوبة غير متاحة." noindex />

      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <p className="text-sm font-black text-cyan-400">404</p>
        <h1 className="text-3xl font-extrabold text-white">الصفحة غير موجودة</h1>
        <p className="text-sm text-slate-400">الرابط غير صحيح أو الصفحة لم تعد متاحة للزوار.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="sm" icon={Home}>
              الرئيسية
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant="outline" size="sm" icon={BookOpen}>
              تصفح الكورسات
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
