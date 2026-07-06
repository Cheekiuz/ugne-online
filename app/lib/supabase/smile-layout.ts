import type {SponsorSmile} from './smiles';

export type LayoutSmile = SponsorSmile & {
  display_x: number;
  display_y: number;
  rotation: number;
  colorWall: string;
  colorCounter: string;
};

const SMILE_COLOR_WALL = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-tertiary)',
  'var(--color-error)',
  'var(--color-tertiary-dim)',
] as const;

const SMILE_COLOR_COUNTER = [
  'var(--color-on-primary)',
  'var(--color-secondary-container)',
  'var(--color-tertiary-container)',
  'var(--color-primary-container)',
  'var(--color-on-secondary)',
] as const;

export function smileColorFromId(id: number, variant: 'wall' | 'counter'): string {
  const palette = variant === 'wall' ? SMILE_COLOR_WALL : SMILE_COLOR_COUNTER;
  return palette[Math.abs(id) % palette.length];
}

const MIN_DISTANCE = 10;
const BOUNDS_MIN = 8;
const BOUNDS_MAX = 92;
const SPIRAL_STEP = 4;
const SPIRAL_ANGLES = 8;
const COUNTER_DEAD_MIN = 35;
const COUNTER_DEAD_MAX = 65;

function positionFromId(id: number): {x: number; y: number} {
  return {
    x: 10 + ((id * 47) % 80),
    y: 10 + ((id * 83) % 80),
  };
}

function rotationFromId(id: number): number {
  return ((id * 17) % 17) - 8;
}

function startPosition(smile: SponsorSmile): {x: number; y: number} {
  if (smile.pos_x != null && smile.pos_y != null) {
    return {x: smile.pos_x, y: smile.pos_y};
  }
  return positionFromId(smile.id);
}

function clamp(value: number, min = BOUNDS_MIN, max = BOUNDS_MAX): number {
  return Math.min(max, Math.max(min, value));
}

function collides(
  x: number,
  y: number,
  placed: Array<{display_x: number; display_y: number}>,
  minDistance = MIN_DISTANCE,
): boolean {
  return placed.some((other) => {
    const dx = x - other.display_x;
    const dy = y - other.display_y;
    return Math.hypot(dx, dy) < minDistance;
  });
}

function resolvePosition(
  start: {x: number; y: number},
  placed: Array<{display_x: number; display_y: number}>,
  id: number,
  minDistance = MIN_DISTANCE,
): {x: number; y: number} {
  const baseX = clamp(start.x);
  const baseY = clamp(start.y);

  if (!collides(baseX, baseY, placed, minDistance)) {
    return {x: baseX, y: baseY};
  }

  for (let ring = 1; ring <= 20; ring++) {
    const radius = ring * SPIRAL_STEP;
    for (let angleIndex = 0; angleIndex < SPIRAL_ANGLES; angleIndex++) {
      const angle = ((angleIndex / SPIRAL_ANGLES) * Math.PI * 2) + (id * 0.31);
      const x = clamp(baseX + Math.cos(angle) * radius);
      const y = clamp(baseY + Math.sin(angle) * radius);
      if (!collides(x, y, placed, minDistance)) {
        return {x, y};
      }
    }
  }

  const fallback = positionFromId(id + placed.length * 13);
  return {x: clamp(fallback.x), y: clamp(fallback.y)};
}

function avoidCenterDeadZone(x: number, y: number): {x: number; y: number} {
  const inDeadX = x >= COUNTER_DEAD_MIN && x <= COUNTER_DEAD_MAX;
  const inDeadY = y >= COUNTER_DEAD_MIN && y <= COUNTER_DEAD_MAX;

  if (!inDeadX || !inDeadY) {
    return {x, y};
  }

  const toLeft = x - COUNTER_DEAD_MIN;
  const toRight = COUNTER_DEAD_MAX - x;
  const toTop = y - COUNTER_DEAD_MIN;
  const toBottom = COUNTER_DEAD_MAX - y;
  const min = Math.min(toLeft, toRight, toTop, toBottom);

  if (min === toLeft) {
    return {x: COUNTER_DEAD_MIN - 6, y};
  }
  if (min === toRight) {
    return {x: COUNTER_DEAD_MAX + 6, y};
  }
  if (min === toTop) {
    return {x, y: COUNTER_DEAD_MIN - 6};
  }
  return {x, y: COUNTER_DEAD_MAX + 6};
}

function buildLayoutSmiles(
  smiles: SponsorSmile[],
  adjustPosition?: (x: number, y: number) => {x: number; y: number},
  minDistance = MIN_DISTANCE,
): LayoutSmile[] {
  const sorted = [...smiles].sort((a, b) => a.id - b.id);
  const placed: LayoutSmile[] = [];

  for (const smile of sorted) {
    const start = startPosition(smile);
    let {x, y} = resolvePosition(start, placed, smile.id, minDistance);

    if (adjustPosition) {
      ({x, y} = adjustPosition(x, y));
      x = clamp(x);
      y = clamp(y);
    }

    placed.push({
      ...smile,
      display_x: x,
      display_y: y,
      rotation: rotationFromId(smile.id),
      colorWall: smileColorFromId(smile.id, 'wall'),
      colorCounter: smileColorFromId(smile.id, 'counter'),
    });
  }

  return placed;
}

export function layoutScatteredSmiles(smiles: SponsorSmile[]): LayoutSmile[] {
  return buildLayoutSmiles(smiles);
}

export function layoutCounterSmiles(smiles: SponsorSmile[]): LayoutSmile[] {
  return buildLayoutSmiles(smiles, avoidCenterDeadZone, 8);
}
