import React, { useEffect, useState } from 'react';
import type { User } from '../../types';

interface VideoWatermarkProps {
  user?: User | null;
  className?: string;
}

interface WatermarkPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

const POSITIONS: WatermarkPosition[] = [
  { top: '8%', left: '8%' },
  { top: '8%', right: '8%' },
  { bottom: '15%', left: '8%' },
  { bottom: '15%', right: '8%' },
  { top: '45%', left: '25%' },
  { top: '35%', right: '25%' },
];

function formatTimestamp(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, '0');

  return `${day} ${month} ${year} ${strHours}:${minutes} ${ampm}`;
}

export const VideoWatermark: React.FC<VideoWatermarkProps> = ({ user, className = '' }) => {
  const [posIndex, setPosIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => formatTimestamp(new Date()));

  // 1. Update dynamic timestamp every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTimestamp(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Change position randomly every 6 seconds to prevent static cropping/masking
  useEffect(() => {
    const posTimer = setInterval(() => {
      setPosIndex((prev) => {
        let next = Math.floor(Math.random() * POSITIONS.length);
        if (next === prev) next = (prev + 1) % POSITIONS.length;
        return next;
      });
    }, 6000);

    return () => clearInterval(posTimer);
  }, []);

  if (!user) return null;

  const currentPos = POSITIONS[posIndex];

  return (
    <div
      className={`absolute z-30 pointer-events-none select-none transition-all duration-1000 ease-in-out ${className}`}
      style={{
        ...currentPos,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      aria-hidden="true"
    >
      <div className="bg-black/30 backdrop-blur-[2px] border border-white/10 text-white/40 px-3 py-1.5 rounded-md font-mono text-xs shadow-sm flex flex-col items-start leading-tight tracking-wider">
        <span className="font-semibold text-white/50">{user.name}</span>
        <span className="text-[10px] text-white/35">ID: {user.id}</span>
        <span className="text-[9px] text-white/30 mt-0.5">{currentTime}</span>
      </div>
    </div>
  );
};
