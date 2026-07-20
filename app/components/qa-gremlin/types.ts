export const GREMLIN_POSES = [
  'happy',
  'smirk',
  'watching',
  'thinking',
  'surprised',
  'laughing',
  'sleeping',
  'running',
] as const;

export type GremlinPose = (typeof GREMLIN_POSES)[number];

export type GremlinAccessory = 'none' | 'magnifier' | 'coffee';

export type GremlinPhase =
  | 'hidden'
  | 'peeking'
  | 'watching'
  | 'waving'
  | 'inspecting'
  | 'coffee'
  | 'tripping'
  | 'laughing'
  | 'fleeing';

export type GremlinScript = 'peekCard' | 'watchVisitor' | 'wave' | 'inspect' | 'coffee' | 'trip';

export type PeekEdge = 'top' | 'left' | 'right';

export type GremlinAnchor = {
  x: number;
  y: number;
  peekEdge: PeekEdge;
  card: HTMLElement | null;
  clip: boolean;
};
