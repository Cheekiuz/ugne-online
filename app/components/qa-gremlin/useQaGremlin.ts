'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {playGremlinLaugh} from './gremlin-sounds';
import {GREMLIN_SIZE, pickCard, pickPlacement, pickScript} from './gremlin-placement';
import type {GremlinAccessory, GremlinAnchor, GremlinPhase, GremlinPose} from './types';

const SPAWN_MIN_MS = process.env.NODE_ENV === 'development' ? 8_000 : 22_000;
const SPAWN_MAX_MS = process.env.NODE_ENV === 'development' ? 16_000 : 50_000;
const INITIAL_SPAWN_MS = process.env.NODE_ENV === 'development' ? 3_000 : 8_000;
const FLEE_RADIUS_PX = 90;
const SLOW_APPROACH_SPEED = 48;
const SPAWN_GRACE_MS = 2_500;

function randomSpawnDelay(): number {
  return SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function poseForPhase(phase: GremlinPhase): GremlinPose {
  switch (phase) {
    case 'peeking':
      return 'smirk';
    case 'watching':
      return 'watching';
    case 'waving':
      return 'happy';
    case 'inspecting':
      return 'watching';
    case 'coffee':
      return 'thinking';
    case 'tripping':
      return 'surprised';
    case 'laughing':
      return 'laughing';
    case 'fleeing':
      return 'running';
    default:
      return 'happy';
  }
}

function accessoryForPhase(phase: GremlinPhase): GremlinAccessory {
  if (phase === 'inspecting' || phase === 'watching') return 'magnifier';
  if (phase === 'coffee') return 'coffee';
  return 'none';
}

function wait(ms: number, signal: {cancelled: boolean}): Promise<void> {
  return new Promise((resolve) => {
    if (signal.cancelled) {
      resolve();
      return;
    }

    const timer = window.setTimeout(() => {
      window.clearInterval(check);
      resolve();
    }, ms);

    const check = window.setInterval(() => {
      if (signal.cancelled) {
        window.clearTimeout(timer);
        window.clearInterval(check);
        resolve();
      }
    }, 40);
  });
}

export function useQaGremlin() {
  const [enabled, setEnabled] = useState(false);
  const [phase, setPhase] = useState<GremlinPhase>('hidden');
  const [anchor, setAnchor] = useState<GremlinAnchor | null>(null);
  const [look, setLook] = useState({x: 0, y: 0});
  const [blink, setBlink] = useState(false);
  const [appearanceId, setAppearanceId] = useState(0);
  const [fleeDirection, setFleeDirection] = useState<1 | -1>(1);

  const signalRef = useRef({cancelled: false});
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gremlinPosRef = useRef({x: 0, y: 0});
  const lastMouseRef = useRef({x: 0, y: 0, t: 0});
  const clickStartRef = useRef<number | null>(null);
  const spawnGraceUntilRef = useRef(0);
  const slowApproachCountRef = useRef(0);

  const clearSpawnTimer = useCallback(() => {
    if (spawnTimerRef.current) {
      clearTimeout(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }
  }, []);

  const cancelRun = useCallback(() => {
    signalRef.current.cancelled = true;
  }, []);

  const scheduleSpawn = useCallback((delay = randomSpawnDelay()) => {
    clearSpawnTimer();
    spawnTimerRef.current = setTimeout(() => {
      setAppearanceId((id) => id + 1);
    }, delay);
  }, [clearSpawnTimer]);

  const hide = useCallback(() => {
    setPhase('hidden');
    setAnchor(null);
    scheduleSpawn();
  }, [scheduleSpawn]);

  const flee = useCallback(
    async (signal: {cancelled: boolean}) => {
      setPhase('fleeing');
      setFleeDirection(gremlinPosRef.current.x < window.innerWidth / 2 ? -1 : 1);
      await wait(900, signal);
      if (!signal.cancelled) hide();
    },
    [hide],
  );

  const laugh = useCallback(
    async (signal: {cancelled: boolean}) => {
      setPhase('laughing');
      await Promise.race([playGremlinLaugh(), wait(3500, signal)]);
      if (!signal.cancelled) hide();
    },
    [hide],
  );

  const runScript = useCallback(
    async (signal: {cancelled: boolean}) => {
      const card = pickCard();
      const script = pickScript(card !== null);
      const nextAnchor = pickPlacement(script, card);

      switch (script) {
        case 'peekCard':
          setPhase('peeking');
          break;
        case 'watchVisitor':
          setPhase('watching');
          break;
        case 'wave':
          setPhase('waving');
          break;
        case 'inspect':
          setPhase('inspecting');
          break;
        case 'coffee':
          setPhase('coffee');
          break;
        case 'trip':
          setPhase('tripping');
          break;
      }

      setAnchor(nextAnchor);
      gremlinPosRef.current = {x: nextAnchor.x, y: nextAnchor.y};
      spawnGraceUntilRef.current = performance.now() + SPAWN_GRACE_MS;
      slowApproachCountRef.current = 0;

      const duration =
        script === 'peekCard'
          ? 4200
          : script === 'watchVisitor'
            ? 5000
            : script === 'wave'
              ? 2600
              : script === 'inspect'
                ? 3800
                : script === 'coffee'
                  ? 2800
                  : 2200;

      await wait(duration, signal);
      if (signal.cancelled) return;

      if (script === 'trip') {
        await wait(800, signal);
        if (signal.cancelled) return;
      }

      hide();
    },
    [hide],
  );

  const handlePointerDown = useCallback(() => {
    if (phase === 'hidden' || phase === 'laughing' || phase === 'fleeing') return;
    clickStartRef.current = performance.now();
  }, [phase]);

  const handleClick = useCallback(async () => {
    if (phase === 'hidden' || phase === 'laughing' || phase === 'fleeing') return;

    const started = clickStartRef.current ?? performance.now();
    const elapsed = performance.now() - started;

    cancelRun();
    const signal = signalRef.current;
    signal.cancelled = true;

    if (elapsed > 420) {
      signal.cancelled = false;
      await flee({cancelled: false});
      return;
    }

    signal.cancelled = false;
    await laugh({cancelled: false});
  }, [cancelRun, flee, laugh, phase]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    setEnabled(!reduced);
    if (reduced) return;

    scheduleSpawn(INITIAL_SPAWN_MS);
    return () => {
      clearSpawnTimer();
      cancelRun();
    };
  }, [cancelRun, clearSpawnTimer, scheduleSpawn]);

  useEffect(() => {
    if (!enabled || appearanceId === 0) return;

    const signal = {cancelled: false};
    signalRef.current = signal;
    void runScript(signal);

    return () => {
      signal.cancelled = true;
    };
  }, [appearanceId, enabled, runScript]);

  useEffect(() => {
    if (phase === 'hidden' || phase === 'laughing' || phase === 'fleeing') return;

    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      const prev = lastMouseRef.current;
      const dt = Math.max(16, now - prev.t);
      const dx = event.clientX - prev.x;
      const dy = event.clientY - prev.y;
      const speed = Math.hypot(dx, dy) / (dt / 1000);

      lastMouseRef.current = {x: event.clientX, y: event.clientY, t: now};

      const pos = gremlinPosRef.current;
      const dist = Math.hypot(event.clientX - (pos.x + GREMLIN_SIZE / 2), event.clientY - (pos.y + GREMLIN_SIZE / 2));
      const toward =
        (event.clientX - prev.x) * (pos.x + GREMLIN_SIZE / 2 - prev.x) +
        (event.clientY - prev.y) * (pos.y + GREMLIN_SIZE / 2 - prev.y);

      const inGrace = now < spawnGraceUntilRef.current;
      const slowApproach =
        !inGrace &&
        dist < FLEE_RADIUS_PX &&
        toward > 0 &&
        speed > 2 &&
        speed < SLOW_APPROACH_SPEED;

      if (slowApproach) {
        slowApproachCountRef.current += 1;
      } else {
        slowApproachCountRef.current = 0;
      }

      if (slowApproachCountRef.current >= 4) {
        cancelRun();
        signalRef.current.cancelled = true;
        slowApproachCountRef.current = 0;
        const fleeSignal = {cancelled: false};
        void flee(fleeSignal);
        return;
      }

      const lookX = (event.clientX - (pos.x + GREMLIN_SIZE / 2)) / 80;
      const lookY = (event.clientY - (pos.y + GREMLIN_SIZE / 2)) / 80;
      setLook({x: Math.max(-1, Math.min(1, lookX)), y: Math.max(-1, Math.min(1, lookY))});
    };

    window.addEventListener('pointermove', onMove, {passive: true});
    return () => window.removeEventListener('pointermove', onMove);
  }, [cancelRun, flee, phase]);

  useEffect(() => {
    if (phase === 'hidden') return;

    const blinkTimer = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 140);
    }, 2800 + Math.random() * 2000);

    return () => clearInterval(blinkTimer);
  }, [phase]);

  useEffect(() => {
    if (!anchor) return;
    gremlinPosRef.current = {x: anchor.x, y: anchor.y};
  }, [anchor]);

  return {
    enabled,
    visible: phase !== 'hidden',
    phase,
    pose: poseForPhase(phase),
    accessory: accessoryForPhase(phase),
    anchor,
    look,
    blink,
    fleeDirection,
    size: GREMLIN_SIZE,
    handlePointerDown,
    handleClick,
  };
}
