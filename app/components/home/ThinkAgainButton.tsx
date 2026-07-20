'use client';

import {useCallback, useRef, useState, type CSSProperties} from 'react';

const BOUNDS_PADDING = 12;
const FOLLOW_UP_LABELS = ['Nice try', 'Still trying?', 'I\'m quick.', 'Okay, okay!'] as const;

type Position = {left: number; top: number};
type Size = {width: number; height: number};

function escapeDurationForClick(clickNumber: number): number {
  return Math.max(0.12, 0.42 - (clickNumber - 1) * 0.08);
}

function getArena(stage: HTMLElement): HTMLElement | null {
  return stage.closest('[data-think-again-arena]');
}

function measurePositionInArena(arena: HTMLElement, button: HTMLElement): Position {
  const arenaRect = arena.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();

  return {
    left: buttonRect.left - arenaRect.left,
    top: buttonRect.top - arenaRect.top,
  };
}

function randomPositionInArena(arena: HTMLElement, button: HTMLElement): Position {
  const maxLeft = arena.clientWidth - button.offsetWidth - BOUNDS_PADDING * 2;
  const maxTop = arena.clientHeight - button.offsetHeight - BOUNDS_PADDING * 2;

  return {
    left: BOUNDS_PADDING + Math.random() * Math.max(0, maxLeft),
    top: BOUNDS_PADDING + Math.random() * Math.max(0, maxTop),
  };
}

function clampPosition(arena: HTMLElement, button: HTMLElement, position: Position): Position {
  const maxLeft = arena.clientWidth - button.offsetWidth - BOUNDS_PADDING;
  const maxTop = arena.clientHeight - button.offsetHeight - BOUNDS_PADDING;

  return {
    left: Math.max(BOUNDS_PADDING, Math.min(maxLeft, position.left)),
    top: Math.max(BOUNDS_PADDING, Math.min(maxTop, position.top)),
  };
}

type ThinkAgainButtonProps = {
  onClick?: () => void;
};

export function ThinkAgainButton({onClick}: ThinkAgainButtonProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [clickCount, setClickCount] = useState(0);
  const [isEscaped, setIsEscaped] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [placeholderSize, setPlaceholderSize] = useState<Size | null>(null);
  const [escapeDuration, setEscapeDuration] = useState(0.42);
  const [isShaking, setIsShaking] = useState(false);

  const handleClick = useCallback(() => {
    onClick?.();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stage = stageRef.current;
    const button = buttonRef.current;

    if (!prefersReducedMotion && stage && button) {
      const arena = getArena(stage);

      if (arena) {
        setClickCount((count) => {
          const nextCount = count + 1;

          setEscapeDuration(escapeDurationForClick(nextCount));

          if (nextCount === 1) {
            const start = measurePositionInArena(arena, button);

            setPlaceholderSize({
              width: button.offsetWidth,
              height: button.offsetHeight,
            });
            setPosition(start);
            setIsEscaped(true);
            setIsShaking(true);
            window.setTimeout(() => setIsShaking(false), 520);

            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(() => {
                setPosition(clampPosition(arena, button, randomPositionInArena(arena, button)));
              });
            });
          } else {
            setPosition(clampPosition(arena, button, randomPositionInArena(arena, button)));
          }

          return nextCount;
        });

        return;
      }
    }

    setClickCount((count) => count + 1);
  }, [onClick]);

  const label =
    clickCount === 0
      ? 'Think again'
      : FOLLOW_UP_LABELS[Math.min(clickCount - 1, FOLLOW_UP_LABELS.length - 1)];

  return (
    <>
      {isEscaped && placeholderSize ? (
        <div
          className="shrink-0"
          style={{width: placeholderSize.width, height: placeholderSize.height}}
          aria-hidden
        />
      ) : null}

      <div
        ref={stageRef}
        className={[
          'think-again-button-stage',
          isEscaped ? 'think-again-button-stage--escaped' : '',
        ].join(' ')}
        style={
          isEscaped && position
            ? ({
                '--escape-duration': `${escapeDuration}s`,
                left: `${position.left}px`,
                top: `${position.top}px`,
              } as CSSProperties)
            : undefined
        }
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={handleClick}
          className={[
            'think-again-button px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-black text-base sm:text-lg w-auto max-w-full',
            isEscaped ? 'think-again-button--escaped' : '',
            isShaking ? 'think-again-button--shake' : '',
          ].join(' ')}
        >
          {label}
        </button>
      </div>
    </>
  );
}
