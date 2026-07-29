import React, { useEffect, useState } from 'react';

const SESSION_KEY = 'boxenstopp-loading-shown';
const LIGHT_COUNT = 5;
const STAGGER_MS = 150;

const BUILD_DONE_MS = (LIGHT_COUNT - 1) * STAGGER_MS + 350;
const AMBER_AT_MS = BUILD_DONE_MS + 150;
const GREEN_AT_MS = AMBER_AT_MS + 350;
const WIPE_AT_MS = GREEN_AT_MS + 300;
const WIPE_DURATION_MS = 700;
const UNMOUNT_AT_MS = WIPE_AT_MS + WIPE_DURATION_MS;

type Phase = 'building' | 'amber' | 'green' | 'wiping';

const PHASE_COLOR: Record<'building' | 'amber' | 'green', { bg: string; glow: string }> = {
  building: { bg: '#E31837', glow: 'rgba(227, 24, 55, 0.65)' },
  amber: { bg: '#F0A500', glow: 'rgba(240, 165, 0, 0.65)' },
  green: { bg: '#22c55e', glow: 'rgba(34, 197, 94, 0.65)' },
};

export const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(() => {
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true;
    }
  });
  const [phase, setPhase] = useState<Phase>('building');
  const [litCount, setLitCount] = useState(0);

  useEffect(() => {
    if (!visible) return;

    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore (private browsing / storage disabled) */
    }

    const timers: number[] = [];
    for (let i = 0; i < LIGHT_COUNT; i++) {
      timers.push(window.setTimeout(() => setLitCount((c) => c + 1), i * STAGGER_MS));
    }
    timers.push(window.setTimeout(() => setPhase('amber'), AMBER_AT_MS));
    timers.push(window.setTimeout(() => setPhase('green'), GREEN_AT_MS));
    timers.push(window.setTimeout(() => setPhase('wiping'), WIPE_AT_MS));
    timers.push(window.setTimeout(() => setVisible(false), UNMOUNT_AT_MS));

    return () => timers.forEach((t) => clearTimeout(t));
  }, [visible]);

  if (!visible) return null;

  const colorPhase: 'building' | 'amber' | 'green' =
    phase === 'amber' ? 'amber' : phase === 'green' || phase === 'wiping' ? 'green' : 'building';
  const colors = PHASE_COLOR[colorPhase];

  return (
    <div className="fixed inset-0 z-[200]" aria-hidden="true">
      {phase !== 'wiping' ? (
        <div className="absolute inset-0 bg-ink flex flex-col items-center justify-center">
          <div className="flex gap-3 sm:gap-4 mb-6">
            {Array.from({ length: LIGHT_COUNT }).map((_, i) => {
              const isLit = i < litCount || phase !== 'building';
              return (
                <span
                  key={i}
                  className="w-5 h-5 sm:w-7 sm:h-7 rounded-full border border-white/10 transition-colors duration-300"
                  style={{
                    backgroundColor: isLit ? colors.bg : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isLit ? `0 0 18px 5px ${colors.glow}` : 'none',
                  }}
                />
              );
            })}
          </div>
          <p className="text-white/50 font-display uppercase tracking-[0.2em] text-xs sm:text-sm">
            {colorPhase === 'green' ? "Los geht's!" : 'Boxenstopp wird vorbereitet'}
          </p>
        </div>
      ) : (
        <div
          className="checkered-flag animate-flag-wipe absolute inset-0"
          style={{ backgroundSize: '48px 48px' }}
        />
      )}
    </div>
  );
};
