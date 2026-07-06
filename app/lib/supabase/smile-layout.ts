import type {SponsorSmile} from './smiles';

export type LayoutSmile = SponsorSmile & {
  display_x: number;
  display_y: number;
  rotation: number;
  colorClassWall: string;
  colorClassCounter: string;
};

const SMILE_COLOR_WALL = [
  'text-primary',
  'text-secondary',
  'text-tertiary',
  'text-error',
  'text-tertiary-dim',
] as const;

const SMILE_COLOR_COUNTER = [
  'text-on-primary',
  'text-secondary-container',
  'text-tertiary-container',
  'text-primary-container',
  'text-on-secondary',
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

function clamp(value: number): number {
  return Math.min(BOUNDS_MAX, Math.max(BOUNDS_MIN, value));
}

function collides(
  x: number,
  y: number,
  placed: Array<{display_x: number; display_y: number}>,
): boolean {
  return placed.some((other) => {
    const dx = x - other.display_x;
    const dy = y - other.display_y;
    return Math.hypot(dx, dy) < MIN_DISTANCE;
  });
}

function resolvePosition(
  start: {x: number; y: number},
  placed: Array<{display_x: number; display_y: number}>,
  id: number,
): {x: number; y: number} {
  const baseX = clamp(start.x);
  const baseY = clamp(start.y);

  if (!collides(baseX, baseY, placed)) {
    return {x: baseX, y: baseY};
  }

  for (let ring = 1; ring <= 20; ring++) {
    const radius = ring * SPIRAL_STEP;
    for (let angleIndex = 0; angleIndex < SPIRAL_ANGLES; angleIndex++) {
      const angle = ((angleIndex / SPIRAL_ANGLES) * Math.PI * 2) + (id * 0.31);
      const x = clamp(baseX + Math.cos(angle) * radius);
      const y = clamp(baseY + Math.sin(angle) * radius);
      if (!collides(x, y, placed)) {
        return {x, y};
      }
    }
  }

  const fallback = positionFromId(id + placed.length * 13);
  return {x: clamp(fallback.x), y: clamp(fallback.y)};
}

export function layoutScatteredSmiles(smiles: SponsorSmile[]): LayoutSmile[] {
  const sorted = [...smiles].sort((a, b) => a.id - b.id);
  const placed: LayoutSmile[] = [];

  for (const smile of sorted) {
    const start = startPosition(smile);
    const {x, y} = resolvePosition(start, placed, smile.id);
    placed.push({
      ...smile,
      display_x: x,
      display_y: y,
      rotation: rotationFromId(smile.id),
      colorClassWall: smileColorFromId(smile.id, 'wall'),
      colorClassCounter: smileColorFromId(smile.id, 'counter'),
    });
  }

  return placed;
}
