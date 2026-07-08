'use client';

import {useEffect, useState} from 'react';

type Snowflake = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
};

const FLAKE_COUNT = 64;

function createSnowflakes(count: number): Snowflake[] {
  return Array.from({length: count}, (_, id) => ({
    id,
    left: Math.random() * 100,
    size: 2 + Math.random() * 5,
    duration: 10 + Math.random() * 14,
    delay: Math.random() * -20,
    opacity: 0.35 + Math.random() * 0.55,
    drift: 12 + Math.random() * 28,
  }));
}

export function Snowfall() {
  const [flakes, setFlakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    setFlakes(createSnowflakes(FLAKE_COUNT));
  }, []);

  if (flakes.length === 0) {
    return null;
  }

  return (
    <div className="snowfall pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            ['--snow-drift' as string]: `${flake.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
