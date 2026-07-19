'use client';

import {useCallback, useState, type CSSProperties} from 'react';

const ESCAPE_RANGE_MIN = 28;
const ESCAPE_RANGE_MAX = 72;
const MAX_OFFSET = 96;
const FOLLOW_UP_LABELS = ['Nice try 😄', 'Still trying?', 'I\'m quick.', 'Okay, okay!'] as const;

type Offset = {x: number; y: number};

function randomNearbyOffset(distanceMin: number, distanceMax: number): Offset {
  const angle = Math.random() * Math.PI * 2;
  const distance = distanceMin + Math.random() * (distanceMax - distanceMin);

  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance),
  };
}

function clampOffset(offset: Offset): Offset {
  return {
    x: Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offset.x)),
    y: Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offset.y)),
  };
}

type ThinkAgainButtonProps = {
  onClick?: () => void;
};

export function ThinkAgainButton({onClick}: ThinkAgainButtonProps) {
  const [clickCount, setClickCount] = useState(0);
  const [offset, setOffset] = useState<Offset>({x: 0, y: 0});
  const [isShaking, setIsShaking] = useState(false);

  const handleClick = useCallback(() => {
    onClick?.();

    setClickCount((count) => {
      const nextCount = count + 1;

      if (nextCount === 1) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
          setOffset(clampOffset(randomNearbyOffset(ESCAPE_RANGE_MIN, ESCAPE_RANGE_MAX)));
          setIsShaking(true);
          window.setTimeout(() => setIsShaking(false), 520);
        }
      } else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const nudge = randomNearbyOffset(12, 36);
        setOffset((current) =>
          clampOffset({
            x: current.x + nudge.x * 0.45,
            y: current.y + nudge.y * 0.45,
          }),
        );
      }

      return nextCount;
    });
  }, [onClick]);

  const label =
    clickCount === 0
      ? 'Think again'
      : FOLLOW_UP_LABELS[Math.min(clickCount - 1, FOLLOW_UP_LABELS.length - 1)];

  return (
    <div className="think-again-button-stage w-full sm:w-auto shrink-0">
      <button
        type="button"
        onClick={handleClick}
        className={[
          'think-again-button px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-black text-base sm:text-lg w-full sm:w-auto',
          clickCount > 0 ? 'think-again-button--escaped' : '',
          isShaking ? 'think-again-button--shake' : '',
        ].join(' ')}
        style={
          {
            '--escape-x': `${offset.x}px`,
            '--escape-y': `${offset.y}px`,
          } as CSSProperties
        }
      >
        {label}
      </button>
    </div>
  );
}
