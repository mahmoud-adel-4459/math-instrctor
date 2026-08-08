import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center border border-blue-900/30 flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-600/30 flex items-center justify-center text-blue-400 glow-blue">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed max-w-md">{description}</p>

      {actionText && onAction && (
        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
