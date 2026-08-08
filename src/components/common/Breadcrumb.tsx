import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';
import type { BreadcrumbItem } from '../../types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-reverse space-x-2 text-xs sm:text-sm text-slate-400 overflow-x-auto py-2 whitespace-nowrap scrollbar-none ${className}`}>
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-blue-400 transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>الرئيسية</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            {isLast || !item.path ? (
              <span className="font-semibold text-blue-300 truncate max-w-[200px] sm:max-w-[300px]">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-blue-400 transition-colors truncate max-w-[150px] sm:max-w-[200px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
