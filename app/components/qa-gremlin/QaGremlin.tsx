'use client';

import {GremlinFigure} from './GremlinFigure';
import './qa-gremlin.css';
import {useQaGremlin} from './useQaGremlin';

export function QaGremlin() {
  const {
    enabled,
    visible,
    phase,
    pose,
    accessory,
    anchor,
    look,
    blink,
    fleeDirection,
    size,
    handlePointerDown,
    handleClick,
  } = useQaGremlin();

  if (!enabled || !visible || !anchor) return null;

  const phaseClass =
    phase === 'peeking' && anchor.clip
      ? `qa-gremlin--peek qa-gremlin--peek-${anchor.peekEdge}`
      : phase === 'waving'
        ? 'qa-gremlin--wave'
        : phase === 'laughing'
          ? 'qa-gremlin--laugh'
          : phase === 'fleeing'
            ? `qa-gremlin--flee qa-gremlin--flee-${fleeDirection > 0 ? 'right' : 'left'}`
            : phase === 'tripping'
              ? 'qa-gremlin--trip'
              : phase === 'watching' || phase === 'inspecting'
                ? 'qa-gremlin--watch'
                : '';

  return (
    <div className="qa-gremlin-layer" aria-live="polite">
      {phase === 'tripping' ? (
        <div
          className="qa-gremlin__trip-ball"
          style={{left: anchor.x + size * 0.55, top: anchor.y + size * 0.75}}
          aria-hidden
        />
      ) : null}

      <button
        type="button"
        className={`qa-gremlin ${phaseClass}`.trim()}
        style={{left: anchor.x, top: anchor.y, width: size, height: size}}
        onPointerDown={handlePointerDown}
        onClick={() => void handleClick()}
        aria-label="Tiny QA gremlin"
      >
        <GremlinFigure
          pose={pose}
          lookX={look.x}
          lookY={look.y}
          blink={blink}
          accessory={accessory}
          waving={phase === 'waving'}
        />
      </button>
    </div>
  );
}
