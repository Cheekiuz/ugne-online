import type {CSSProperties} from 'react';
import './animated-tennis-racket.css';

type RacketMotion = 'bounce' | 'float' | 'sway';

type RacketFloater = {
  id: number;
  motion: RacketMotion;
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
  rotate: number;
  opacity: number;
};

const FLOATERS: RacketFloater[] = [
  {id: 1, motion: 'bounce', left: '10%', top: '16%', size: '2.35rem', delay: '0s', duration: '1.75s', rotate: -24, opacity: 0.9},
  {id: 2, motion: 'float', left: '72%', top: '58%', size: '2.05rem', delay: '-1.4s', duration: '2.2s', rotate: 16, opacity: 0.82},
  {id: 3, motion: 'sway', left: '38%', top: '70%', size: '2.5rem', delay: '-2.2s', duration: '2s', rotate: -10, opacity: 0.88},
  {id: 4, motion: 'bounce', left: '80%', top: '20%', size: '2.15rem', delay: '-0.7s', duration: '1.9s', rotate: 26, opacity: 0.8},
];

type Props = {
  className?: string;
};

function StringLines({clipId}: {clipId: string}) {
  const mains = Array.from({length: 13}, (_, index) => 18 + index * 3);
  const crosses = Array.from({length: 15}, (_, index) => 16 + index * 3.2);

  return (
    <g clipPath={`url(#${clipId})`}>
      {mains.map((x) => (
        <line
          key={`main-${x}`}
          x1={x}
          y1={14}
          x2={x}
          y2={62}
          stroke="#ddd7cb"
          strokeWidth="0.55"
          opacity="0.95"
        />
      ))}
      {crosses.map((y) => (
        <line
          key={`cross-${y}`}
          x1={14}
          y1={y}
          x2={58}
          y2={y}
          stroke="#cfc8bc"
          strokeWidth="0.5"
          opacity="0.9"
        />
      ))}
    </g>
  );
}

function TennisRacketIcon({id}: {id: number}) {
  const frameId = `racket-frame-${id}`;
  const edgeId = `racket-frame-edge-${id}`;
  const shaftId = `racket-shaft-${id}`;
  const gripId = `racket-grip-${id}`;
  const clipId = `racket-string-bed-${id}`;

  return (
    <svg viewBox="0 0 72 196" fill="none" xmlns="http://www.w3.org/2000/svg" className="tennis-racket-icon">
      <defs>
        <linearGradient id={frameId} x1="20" y1="8" x2="52" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="45%" stopColor="#1f1f1f" />
          <stop offset="100%" stopColor="#0f0f0f" />
        </linearGradient>
        <linearGradient id={edgeId} x1="36" y1="8" x2="36" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7a7a7a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#111111" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={shaftId} x1="34" y1="68" x2="38" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#121212" />
        </linearGradient>
        <linearGradient id={gripId} x1="30" y1="118" x2="42" y2="188" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d3557" />
          <stop offset="55%" stopColor="#274c77" />
          <stop offset="100%" stopColor="#1b263b" />
        </linearGradient>
        <clipPath id={clipId}>
          <ellipse cx="36" cy="38" rx="20.5" ry="24.5" />
        </clipPath>
      </defs>

      <ellipse cx="36" cy="38" rx="24" ry="28" fill={`url(#${frameId})`} />
      <ellipse cx="36" cy="38" rx="24" ry="28" fill={`url(#${edgeId})`} />
      <ellipse cx="36" cy="38" rx="20.5" ry="24.5" fill="#101010" />

      <StringLines clipId={clipId} />

      <ellipse cx="36" cy="38" rx="24" ry="28" stroke="#5f5f5f" strokeWidth="1.2" fill="none" opacity="0.65" />
      <ellipse cx="36" cy="38" rx="20.5" ry="24.5" stroke="#8a8a8a" strokeWidth="0.8" fill="none" opacity="0.45" />

      <path
        d="M31 62c0 2 2 4 5 4s5-2 5-4v-1c-2.2 1.4-4.8 2.2-5 2.2s-2.8-.8-5-2.2v1Z"
        fill="#1a1a1a"
      />
      <path d="M33 66h6v10c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2V66Z" fill={`url(#${shaftId})`} />
      <path
        d="M31.5 76h9c1.2 0 2.2 1 2.2 2.2v39.6c0 1.2-1 2.2-2.2 2.2h-9c-1.2 0-2.2-1-2.2-2.2V78.2c0-1.2 1-2.2 2.2-2.2Z"
        fill={`url(#${gripId})`}
      />
      <path
        d="M33 82v34M36 80v38M39 82v34"
        stroke="#9bb7d4"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.35"
      />
      <rect x="31" y="182" width="10" height="4" rx="1.5" fill="#0a0a0a" />
      <rect x="32" y="183" width="8" height="2" rx="1" fill="#2b2b2b" />

      <ellipse cx="28" cy="22" rx="4.5" ry="7" fill="#ffffff" opacity="0.12" />
    </svg>
  );
}

export function AnimatedTennisRacket({className = ''}: Props) {
  return (
    <div className={`tennis-racket-floaters ${className}`.trim()} aria-hidden>
      {FLOATERS.map((floater) => (
        <span
          key={floater.id}
          className={`tennis-racket-floater tennis-racket-floater--${floater.motion}`}
          style={
            {
              left: floater.left,
              top: floater.top,
              '--racket-size': floater.size,
              '--racket-delay': floater.delay,
              '--racket-duration': floater.duration,
              '--racket-rotate': `${floater.rotate}deg`,
              '--racket-opacity': floater.opacity,
            } as CSSProperties
          }
        >
          <TennisRacketIcon id={floater.id} />
        </span>
      ))}
    </div>
  );
}
