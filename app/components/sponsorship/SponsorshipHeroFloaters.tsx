import type {CSSProperties} from 'react';
import './sponsorship-hero-floaters.css';

type FloaterKind = 'tennis' | 'money' | 'coffee';
type FloaterMotion = 'bounce' | 'float' | 'sway';

type Floater = {
  id: number;
  kind: FloaterKind;
  motion: FloaterMotion;
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
  opacity: number;
  glyph?: string;
};

const FLOATERS: Floater[] = [
  {id: 1, kind: 'tennis', motion: 'bounce', left: '4%', top: '10%', size: '2rem', delay: '0s', duration: '2.8s', opacity: 0.82},
  {id: 2, kind: 'money', motion: 'float', left: '12%', top: '68%', size: '1.9rem', delay: '-1.2s', duration: '4.6s', opacity: 0.78, glyph: '💰'},
  {id: 3, kind: 'coffee', motion: 'sway', left: '8%', top: '38%', size: '1.75rem', delay: '-2.4s', duration: '5.1s', opacity: 0.74},
  {id: 4, kind: 'tennis', motion: 'bounce', left: '18%', top: '18%', size: '1.5rem', delay: '-0.6s', duration: '2.4s', opacity: 0.7},
  {id: 5, kind: 'money', motion: 'sway', left: '22%', top: '78%', size: '1.65rem', delay: '-3.1s', duration: '4.9s', opacity: 0.68, glyph: '💵'},
  {id: 6, kind: 'coffee', motion: 'float', left: '16%', top: '52%', size: '1.55rem', delay: '-1.8s', duration: '4.2s', opacity: 0.72},
  {id: 7, kind: 'tennis', motion: 'bounce', left: '28%', top: '8%', size: '1.35rem', delay: '-1.4s', duration: '2.2s', opacity: 0.65},
  {id: 8, kind: 'money', motion: 'bounce', left: '34%', top: '84%', size: '1.45rem', delay: '-2.7s', duration: '3.4s', opacity: 0.66, glyph: '🪙'},
  {id: 9, kind: 'coffee', motion: 'sway', left: '38%', top: '14%', size: '1.4rem', delay: '-0.9s', duration: '5.4s', opacity: 0.64},
  {id: 10, kind: 'tennis', motion: 'bounce', left: '76%', top: '12%', size: '2.1rem', delay: '-0.3s', duration: '2.9s', opacity: 0.84},
  {id: 11, kind: 'money', motion: 'float', left: '88%', top: '22%', size: '1.85rem', delay: '-2.1s', duration: '4.4s', opacity: 0.8, glyph: '💸'},
  {id: 12, kind: 'coffee', motion: 'float', left: '92%', top: '48%', size: '1.7rem', delay: '-3.6s', duration: '4.8s', opacity: 0.76},
  {id: 13, kind: 'tennis', motion: 'bounce', left: '84%', top: '70%', size: '1.6rem', delay: '-1.1s', duration: '2.5s', opacity: 0.72},
  {id: 14, kind: 'money', motion: 'sway', left: '72%', top: '82%', size: '2rem', delay: '-4.2s', duration: '5.2s', opacity: 0.78, glyph: '💰'},
  {id: 15, kind: 'coffee', motion: 'sway', left: '68%', top: '18%', size: '1.5rem', delay: '-2.9s', duration: '5s', opacity: 0.7},
  {id: 16, kind: 'tennis', motion: 'bounce', left: '62%', top: '6%', size: '1.25rem', delay: '-1.7s', duration: '2.1s', opacity: 0.62},
  {id: 17, kind: 'money', motion: 'float', left: '56%', top: '88%', size: '1.35rem', delay: '-3.3s', duration: '4.1s', opacity: 0.64, glyph: '💵'},
  {id: 18, kind: 'coffee', motion: 'float', left: '48%', top: '6%', size: '1.3rem', delay: '-0.4s', duration: '4.7s', opacity: 0.6},
  {id: 19, kind: 'tennis', motion: 'bounce', left: '94%', top: '78%', size: '1.45rem', delay: '-2.5s', duration: '2.6s', opacity: 0.68},
  {id: 20, kind: 'money', motion: 'bounce', left: '6%', top: '86%', size: '1.55rem', delay: '-3.8s', duration: '3.2s', opacity: 0.7, glyph: '🪙'},
  {id: 21, kind: 'coffee', motion: 'sway', left: '80%', top: '58%', size: '1.6rem', delay: '-1.5s', duration: '5.6s', opacity: 0.74},
  {id: 22, kind: 'tennis', motion: 'bounce', left: '44%', top: '90%', size: '1.2rem', delay: '-4.5s', duration: '2.3s', opacity: 0.58},
  {id: 23, kind: 'money', motion: 'sway', left: '52%', top: '16%', size: '1.25rem', delay: '-2.2s', duration: '5.3s', opacity: 0.62, glyph: '💸'},
  {id: 24, kind: 'coffee', motion: 'float', left: '26%', top: '30%', size: '1.2rem', delay: '-3.9s', duration: '4.3s', opacity: 0.58},
  {id: 25, kind: 'tennis', motion: 'bounce', left: '58%', top: '74%', size: '1.85rem', delay: '-0.8s', duration: '2.7s', opacity: 0.76},
  {id: 26, kind: 'money', motion: 'float', left: '46%', top: '78%', size: '1.5rem', delay: '-4.8s', duration: '4.5s', opacity: 0.66, glyph: '💰'},
  {id: 27, kind: 'coffee', motion: 'sway', left: '90%', top: '8%', size: '1.35rem', delay: '-1.9s', duration: '5.1s', opacity: 0.66},
  {id: 28, kind: 'tennis', motion: 'bounce', left: '2%', top: '54%', size: '1.7rem', delay: '-3.4s', duration: '2.5s', opacity: 0.74},
];

function TennisBallIcon({gradientId}: {gradientId: string}) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="sponsorship-floater__ball" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#c8e62e" />
      <circle cx="24" cy="24" r="22" fill={`url(#${gradientId})`} />
      <path
        d="M8 24c0-8.8 7.2-16 16-16 4.2 0 8 1.6 10.9 4.3"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M40 24c0 8.8-7.2 16-16 16-4.2 0-8-1.6-10.9-4.3"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <defs>
        <radialGradient id={gradientId} cx="0.35" cy="0.3" r="0.65">
          <stop offset="0%" stopColor="#e8f56a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c8e62e" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function FloaterContent({floater}: {floater: Floater}) {
  if (floater.kind === 'tennis') {
    return <TennisBallIcon gradientId={`sponsor-tennis-shine-${floater.id}`} />;
  }

  if (floater.kind === 'money') {
    return <span aria-hidden>{floater.glyph ?? '💰'}</span>;
  }

  return <span aria-hidden>☕</span>;
}

export function SponsorshipHeroFloaters() {
  return (
    <div className="sponsorship-hero-floaters">
      {FLOATERS.map((floater) => (
        <span
          key={floater.id}
          className={`sponsorship-floater sponsorship-floater--${floater.motion}`}
          style={
            {
              left: floater.left,
              top: floater.top,
              '--floater-size': floater.size,
              '--floater-delay': floater.delay,
              '--floater-duration': floater.duration,
              '--floater-opacity': floater.opacity,
            } as CSSProperties
          }
        >
          <FloaterContent floater={floater} />
        </span>
      ))}
    </div>
  );
}
