import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(() =>
    items.filter((i) => i.defaultOpen).map((i) => i.id)
  );

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="glass-panel rounded-2xl border border-blue-900/30 overflow-hidden transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-right font-bold text-white hover:bg-slate-900/50 transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <ChevronDown
                  className={`w-5 h-5 text-blue-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
                <span className="text-sm sm:text-base leading-snug">{item.title}</span>
              </div>
              {item.badge && <div className="mr-2 shrink-0">{item.badge}</div>}
            </button>

            {isOpen && (
              <div className="p-4 sm:p-5 pt-0 border-t border-blue-900/20 text-slate-300 text-sm leading-relaxed animate-fadeIn">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
