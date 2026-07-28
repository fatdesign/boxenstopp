import React, { useEffect, useState } from 'react';

const SESSION_KEY = 'boxenstopp-loading-shown';
const LIGHT_COUNT = 5;
const LIGHT_STAGGER_MS = 180;
const FADE_START_MS = 1400;
const UNMOUNT_MS = 1800;

export const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(() => {
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true;
    }
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore (private browsing / storage disabled) */
    }

    const fadeTimer = setTimeout(() => setFading(true), FADE_START_MS);
    const unmountTimer = setTimeout(() => setVisible(false), UNMOUNT_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-ink flex flex-col items-center justify-center transition-opacity duration-400 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      aria-hidden="true"
    >
      <div className="flex gap-3 sm:gap-4 mb-6">
        {Array.from({ length: LIGHT_COUNT }).map((_, i) => (
          <span
            key={i}
            className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-race/15 border border-white/10 animate-light-on"
            style={{ animationDelay: `${i * LIGHT_STAGGER_MS}ms` }}
          />
        ))}
      </div>
      <p className="text-white/50 font-display uppercase tracking-[0.2em] text-xs sm:text-sm">
        Boxenstopp wird vorbereitet
      </p>
    </div>
  );
};
