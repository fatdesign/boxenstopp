import React from 'react';
import type { StatusType } from '../utils/timeUtils';

interface StatusGaugeProps {
  status: StatusType;
  size?: number;
}

const NEEDLE_ANGLE: Record<StatusType, number> = {
  closed: -60,
  'closing-soon': 0,
  open: 60,
};

const NEEDLE_COLOR: Record<StatusType, string> = {
  closed: '#ef4444',
  'closing-soon': '#F0A500',
  open: '#22c55e',
};

export const StatusGauge: React.FC<StatusGaugeProps> = ({ status, size = 28 }) => {
  const angle = NEEDLE_ANGLE[status];
  const color = NEEDLE_COLOR[status];

  return (
    <svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 100 62"
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path d="M10 50 A40 40 0 0 1 30 15.4" stroke="#ef4444" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
      <path d="M30 15.4 A40 40 0 0 1 70 15.4" stroke="#F0A500" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
      <path d="M70 15.4 A40 40 0 0 1 90 50" stroke="#22c55e" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
      <g
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: '50px 50px',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <line x1="50" y1="50" x2="50" y2="20" stroke={color} strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="50" cy="50" r="6" fill={color} stroke="white" strokeWidth="1.5" />
    </svg>
  );
};
