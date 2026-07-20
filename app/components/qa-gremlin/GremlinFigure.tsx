import type {GremlinAccessory, GremlinPose} from './types';

const GREEN = '#A3FF12';
const OUTLINE = '#1a2a22';
const EYE_WHITE = '#ffffff';

type Props = {
  pose: GremlinPose;
  lookX?: number;
  lookY?: number;
  blink?: boolean;
  accessory?: GremlinAccessory;
  waving?: boolean;
  className?: string;
};

function clampLook(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

function Eye({
  cx,
  cy,
  lookX,
  lookY,
  blink,
  closed = false,
}: {
  cx: number;
  cy: number;
  lookX: number;
  lookY: number;
  blink: boolean;
  closed?: boolean;
}) {
  const pupilX = cx + lookX * 1.6;
  const pupilY = cy + lookY * 1.2;

  if (closed || blink) {
    return (
      <path
        d={`M${cx - 4} ${cy} Q${cx} ${cy + 2.5} ${cx + 4} ${cy}`}
        stroke={OUTLINE}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    );
  }

  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="5.2" ry="6.2" fill={EYE_WHITE} stroke={OUTLINE} strokeWidth="1.4" />
      <circle cx={pupilX} cy={pupilY} r="2.1" fill={OUTLINE} />
      <circle cx={pupilX + 0.6} cy={pupilY - 0.6} r="0.7" fill={EYE_WHITE} />
    </g>
  );
}

function Mouth({pose}: {pose: GremlinPose}) {
  switch (pose) {
    case 'happy':
      return <path d="M18 30 Q24 36 30 30" stroke={OUTLINE} strokeWidth="1.8" strokeLinecap="round" fill="none" />;
    case 'smirk':
      return <path d="M19 31 Q25 34 31 29" stroke={OUTLINE} strokeWidth="1.8" strokeLinecap="round" fill="none" />;
    case 'surprised':
      return <ellipse cx="24" cy="31" rx="3.2" ry="4" fill={OUTLINE} />;
    case 'laughing':
      return (
        <g>
          <path d="M17 29 Q24 38 31 29" stroke={OUTLINE} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M20 33 Q24 35 28 33" fill="#ff8aa0" opacity="0.55" />
        </g>
      );
    case 'sleeping':
      return <path d="M19 31 Q24 33 29 31" stroke={OUTLINE} strokeWidth="1.6" strokeLinecap="round" fill="none" />;
    case 'thinking':
      return <path d="M20 31 Q24 33 28 31" stroke={OUTLINE} strokeWidth="1.6" strokeLinecap="round" fill="none" />;
    default:
      return <path d="M19 31 Q24 34 29 31" stroke={OUTLINE} strokeWidth="1.6" strokeLinecap="round" fill="none" />;
  }
}

function RacketOnBack() {
  return (
    <g transform="translate(8, 14) rotate(-18)">
      <ellipse cx="0" cy="0" rx="7" ry="9" fill="none" stroke={OUTLINE} strokeWidth="1.5" />
      <line x1="-5" y1="-3" x2="5" y2="3" stroke={OUTLINE} strokeWidth="0.8" opacity="0.55" />
      <line x1="-5" y1="3" x2="5" y2="-3" stroke={OUTLINE} strokeWidth="0.8" opacity="0.55" />
      <line x1="0" y1="-7" x2="0" y2="7" stroke={OUTLINE} strokeWidth="0.8" opacity="0.55" />
      <rect x="-1.2" y="8" width="2.4" height="9" rx="1" fill={OUTLINE} />
      <rect x="-1.2" y="8" width="2.4" height="3" rx="0.5" fill={GREEN} />
    </g>
  );
}

function Magnifier({x, y}: {x: number; y: number}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="5.5" fill="rgba(255,255,255,0.35)" stroke={OUTLINE} strokeWidth="1.5" />
      <line x1="4" y1="4" x2="9" y2="9" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function CoffeeCup({x, y}: {x: number; y: number}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M0 2 H8 V10 Q4 12 0 10 Z" fill="#fff" stroke={OUTLINE} strokeWidth="1.3" />
      <path d="M8 4 H10 Q12 6 10 8 H8" fill="none" stroke={OUTLINE} strokeWidth="1.2" />
      <path d="M2 0 Q4 -2 6 0" stroke={OUTLINE} strokeWidth="1" strokeLinecap="round" fill="none" />
      <path
        d="M3.5 6 C3.5 5 4.5 4.5 4.5 4.5 C4.5 4.5 5.5 5 5.5 6 C5.5 7 4.5 7.5 4.5 7.5 C4.5 7.5 3.5 7 3.5 6 Z"
        fill={GREEN}
      />
    </g>
  );
}

function Sneaker({x, y, flip}: {x: number; y: number; flip?: boolean}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${flip ? -1 : 1}, 1)`}>
      <ellipse cx="0" cy="0" rx="4.5" ry="2.4" fill="#fff" stroke={OUTLINE} strokeWidth="1.2" />
      <path d="M-4 0 H4" stroke={OUTLINE} strokeWidth="1" />
    </g>
  );
}

export function GremlinFigure({
  pose,
  lookX = 0,
  lookY = 0,
  blink = false,
  accessory = 'none',
  waving = false,
  className = '',
}: Props) {
  const lx = clampLook(lookX);
  const ly = clampLook(lookY);
  const eyesClosed = pose === 'laughing' || pose === 'sleeping';
  const runningLean = pose === 'running' ? -12 : 0;
  const showMagnifier = accessory === 'magnifier' || pose === 'watching';
  const showCoffee = accessory === 'coffee';

  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g transform={`rotate(${runningLean} 24 40)`}>
        {pose === 'running' ? (
          <g opacity="0.35">
            <line x1="6" y1="42" x2="14" y2="42" stroke={OUTLINE} strokeWidth="1.2" strokeLinecap="round" />
            <line x1="8" y1="46" x2="16" y2="46" stroke={OUTLINE} strokeWidth="1.2" strokeLinecap="round" />
          </g>
        ) : null}

        <RacketOnBack />

        {/* Body */}
        <ellipse cx="24" cy="38" rx="13" ry="14" fill={GREEN} stroke={OUTLINE} strokeWidth="1.8" />
        {/* Head */}
        <circle cx="24" cy="22" r="13" fill={GREEN} stroke={OUTLINE} strokeWidth="1.8" />

        {/* Hair strands */}
        <path d="M18 10 Q17 6 20 8" stroke={OUTLINE} strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M28 9 Q30 5 32 8" stroke={OUTLINE} strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* Arms */}
        {waving ? (
          <g>
            <path d="M12 36 Q8 30 10 24" stroke={OUTLINE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <circle cx="10" cy="23" r="2.4" fill={GREEN} stroke={OUTLINE} strokeWidth="1.2" />
            <path d="M36 36 Q40 40 38 44" stroke={OUTLINE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        ) : pose === 'laughing' ? (
          <g>
            <path d="M12 36 Q10 32 14 30" stroke={OUTLINE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M36 36 Q38 32 34 30" stroke={OUTLINE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        ) : pose === 'thinking' ? (
          <g>
            <path d="M34 28 Q38 24 36 20" stroke={OUTLINE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <circle cx="36" cy="19" r="2.2" fill={GREEN} stroke={OUTLINE} strokeWidth="1.2" />
            <path d="M14 38 Q10 40 12 44" stroke={OUTLINE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        ) : pose === 'running' ? (
          <g>
            <path d="M14 36 L8 30" stroke={OUTLINE} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M34 36 L40 32" stroke={OUTLINE} strokeWidth="2.2" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <path d="M12 36 Q10 40 12 44" stroke={OUTLINE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M36 36 Q38 40 36 44" stroke={OUTLINE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Legs */}
        {pose === 'running' ? (
          <g>
            <path d="M18 50 L14 54" stroke={OUTLINE} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M30 50 L36 53" stroke={OUTLINE} strokeWidth="2.4" strokeLinecap="round" />
            <Sneaker x={14} y={54} />
            <Sneaker x={36} y={53} flip />
          </g>
        ) : (
          <g>
            <path d="M19 50 L17 54" stroke={OUTLINE} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M29 50 L31 54" stroke={OUTLINE} strokeWidth="2.4" strokeLinecap="round" />
            <Sneaker x={17} y={54} />
            <Sneaker x={31} y={54} flip />
          </g>
        )}

        {/* Face */}
        <Eye cx={18} cy={21} lookX={lx} lookY={ly} blink={blink} closed={eyesClosed} />
        <Eye cx={30} cy={21} lookX={lx} lookY={ly} blink={blink} closed={eyesClosed} />
        <Mouth pose={pose} />

        {pose === 'sleeping' ? (
          <g fill={OUTLINE} opacity="0.7">
            <text x="32" y="12" fontSize="5" fontFamily="sans-serif">
              z
            </text>
            <text x="36" y="8" fontSize="4" fontFamily="sans-serif">
              z
            </text>
          </g>
        ) : null}

        {showMagnifier ? <Magnifier x={34} y={18} /> : null}
        {showCoffee ? <CoffeeCup x={30} y={30} /> : null}
      </g>
    </svg>
  );
}
