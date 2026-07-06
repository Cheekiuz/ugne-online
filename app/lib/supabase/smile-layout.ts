import type {SponsorSmile} from './smiles';

export type LayoutSmile = SponsorSmile & {
  display_x: number;
  display_y: number;
  rotation: number;
  colorWall: string;
  colorCounter: string;
};

const SMILE_COLOR_WALL = [
  '#c2e91c',
  '#edc600',
  '#ff6b4a',
  '#ff4d8d',
  '#b06cff',
  '#6eb5ff',
  '#3dd6c8',
  '#ffb347',
  '#7fff7f',
  '#ff85c0',
  '#ffd700',
  '#00e5c0',
  '#ff5252',
  '#b388ff',
  '#40c4ff',
  '#69f0ae',
  '#ffab40',
  '#ea80fc',
  '#82b1ff',
  '#f48fb1',
  '#aed581',
  '#4dd0e1',
  '#ff8a80',
  '#ce93d8',
] as const;

const SMILE_COLOR_COUNTER = [
  '#d4f05a',
  '#f5d420',
  '#ff8f70',
  '#ff6fa8',
  '#c490ff',
  '#8ec8ff',
  '#5ce8d8',
  '#ffc870',
  '#9fff9f',
  '#ffa8d0',
  '#ffe44d',
  '#33edd0',
  '#ff7575',
  '#c9a0ff',
  '#66d4ff',
  '#85f5c0',
  '#ffc060',
  '#f0a0ff',
  '#9ec8ff',
  '#f8b0c8',
  '#c5e090',
  '#70e0ec',
  '#ffa898',
  '#ddb8e8',
] as const;

const MIN_DISTANCE = 10;
const COLOR_MIN_DISTANCE = 18;
const BOUNDS_MIN = 8;
const BOUNDS_MAX = 92;
const SPIRAL_STEP = 4;
const SPIRAL_ANGLES = 8;
const COUNTER_DEAD_MIN = 35;
const COUNTER_DEAD_MAX = 65;

function seedFromIds(ids: number[]): number {
  return ids.reduce((acc, id) => acc ^ (id * 2654435761), 0);
}

function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  let s = Math.abs(seed) || 1;

  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

type PlacedForColor = {id: number; display_x: number; display_y: number};

function assignSpreadColors(
  placed: PlacedForColor[],
  palette: readonly string[],
  seed: number,
): Map<number, string> {
  const shuffled = seededShuffle(palette, seed);
  const assignments = new Map<number, string>();
  const sorted = [...placed].sort((a, b) => a.id - b.id);

  for (const smile of sorted) {
    const blocked = new Set<string>();

    for (const other of sorted) {
      if (other.id === smile.id || !assignments.has(other.id)) {
        continue;
      }

      const dist = Math.hypot(smile.display_x - other.display_x, smile.display_y - other.display_y);
      if (dist < COLOR_MIN_DISTANCE) {
        blocked.add(assignments.get(other.id)!);
      }
    }

    const usedGlobally = new Set(assignments.values());
    const unused = shuffled.find((color) => !blocked.has(color) && !usedGlobally.has(color));
    if (unused) {
      assignments.set(smile.id, unused);
      continue;
    }

    const available = shuffled.find((color) => !blocked.has(color));
    if (available) {
      assignments.set(smile.id, available);
      continue;
    }

    let bestColor = shuffled[0];
    let bestScore = Infinity;

    for (const color of shuffled) {
      let conflicts = 0;

      for (const other of sorted) {
        if (other.id === smile.id || !assignments.has(other.id)) {
          continue;
        }
        if (assignments.get(other.id) !== color) {
          continue;
        }

        const dist = Math.hypot(smile.display_x - other.display_x, smile.display_y - other.display_y);
        if (dist < COLOR_MIN_DISTANCE * 1.5) {
          conflicts++;
        }
      }

      if (conflicts < bestScore) {
        bestScore = conflicts;
        bestColor = color;
      }
    }

    assignments.set(smile.id, bestColor);
  }

  return assignments;
}

function positionFromId(id: number): {x: number; y: number} {
  return {
    x: 10 + ((id * 47) % 80),
    y: 10 + ((id * 83) % 80),
  };
}

function jitterFromId(id: number): {x: number; y: number} {
  const hashX = ((id * 7919) % 1000) / 1000;
  const hashY = ((id * 7927) % 1000) / 1000;
  return {
    x: (hashX - 0.5) * 12,
    y: (hashY - 0.5) * 12,
  };
}

function applyJitter(pos: {x: number; y: number}, id: number): {x: number; y: number} {
  const jitter = jitterFromId(id);
  return {
    x: pos.x + jitter.x,
    y: pos.y + jitter.y,
  };
}

function rotationFromId(id: number): number {
  return ((id * 17) % 17) - 8;
}

function startPosition(smile: SponsorSmile): {x: number; y: number} {
  const base =
    smile.pos_x != null && smile.pos_y != null
      ? {x: smile.pos_x, y: smile.pos_y}
      : positionFromId(smile.id);

  return applyJitter(base, smile.id);
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

  const fallback = applyJitter(positionFromId(id + placed.length * 13), id);
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
  const positioned: Array<SponsorSmile & {display_x: number; display_y: number}> = [];

  for (const smile of sorted) {
    const start = startPosition(smile);
    let {x, y} = resolvePosition(start, positioned, smile.id, minDistance);

    if (adjustPosition) {
      ({x, y} = adjustPosition(x, y));
      x = clamp(x);
      y = clamp(y);
    }

    positioned.push({
      ...smile,
      display_x: x,
      display_y: y,
    });
  }

  const baseSeed = seedFromIds(positioned.map((smile) => smile.id));
  const wallColors = assignSpreadColors(positioned, SMILE_COLOR_WALL, baseSeed);
  const counterColors = assignSpreadColors(positioned, SMILE_COLOR_COUNTER, baseSeed ^ 0x9e3779b9);

  return positioned.map((smile) => ({
    ...smile,
    rotation: rotationFromId(smile.id),
    colorWall: wallColors.get(smile.id) ?? SMILE_COLOR_WALL[0],
    colorCounter: counterColors.get(smile.id) ?? SMILE_COLOR_COUNTER[0],
  }));
}

export function layoutScatteredSmiles(smiles: SponsorSmile[]): LayoutSmile[] {
  return buildLayoutSmiles(smiles);
}

export function layoutCounterSmiles(smiles: SponsorSmile[]): LayoutSmile[] {
  return buildLayoutSmiles(smiles, avoidCenterDeadZone, 8);
}
