import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) { return twMerge(clsx(inputs)); }

export const Startlights: React.FC = () => {
  const [litCount, setLitCount] = useState(0);
  const [isGo, setIsGo] = useState(false);
  useEffect(() => {
    if (litCount < 5 && !isGo) {
      const timer = setTimeout(() => setLitCount(prev => prev + 1), 500);
      return () => clearTimeout(timer);
    } 
    if (litCount === 5 && !isGo) {
      const timer = setTimeout(() => setIsGo(true), Math.random() * 1000 + 500);
      return () => clearTimeout(timer);
    }
    if (isGo) {
      const timer = setTimeout(() => { setLitCount(0); setIsGo(false); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [litCount, isGo]);

  return (
    <div className={cn("flex gap-2 p-3 rounded-xl bg-ink/80 backdrop-blur-md border border-white/10 shadow-2xl")}>
      {[0, 1, 2, 3, 4].map((index) => {
        const isLit = litCount > index;
        return (
          <div key={index} className={cn("w-8 h-8 rounded-full transition-all duration-150 ease-in-out border-2",
              !isLit && !isGo && "bg-white/5 border-white/10 shadow-inner",
              isLit && !isGo && "bg-race border-race-700 shadow-[0_0_15px_rgba(224,30,38,0.8)]",
              isGo && "bg-green-500 border-green-600 shadow-[0_0_20px_rgba(34,197,94,0.8)]"
            )} />
        );
      })}
    </div>
  );
};