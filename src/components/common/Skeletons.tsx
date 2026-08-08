import React from 'react';

export const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-slate-800/60 animate-pulse rounded-xl ${className}`} />
);

export const CourseCardSkeleton: React.FC = () => (
  <div className="glass-panel rounded-3xl overflow-hidden border border-blue-900/30 p-4 space-y-4">
    <SkeletonBox className="aspect-video w-full rounded-2xl" />
    <div className="space-y-2">
      <SkeletonBox className="h-4 w-1/3" />
      <SkeletonBox className="h-6 w-3/4" />
      <SkeletonBox className="h-4 w-full" />
    </div>
    <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
      <SkeletonBox className="h-6 w-1/4" />
      <SkeletonBox className="h-9 w-28 rounded-xl" />
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8 animate-pulse">
    <SkeletonBox className="h-32 w-full rounded-3xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SkeletonBox className="h-28 rounded-2xl" />
      <SkeletonBox className="h-28 rounded-2xl" />
      <SkeletonBox className="h-28 rounded-2xl" />
    </div>
    <SkeletonBox className="h-64 w-full rounded-3xl" />
  </div>
);

export const LessonSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-4">
      <SkeletonBox className="aspect-video w-full rounded-3xl" />
      <SkeletonBox className="h-8 w-1/2" />
      <SkeletonBox className="h-20 w-full rounded-2xl" />
    </div>
    <div className="space-y-4">
      <SkeletonBox className="h-96 w-full rounded-3xl" />
    </div>
  </div>
);
