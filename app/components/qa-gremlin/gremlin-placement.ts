import type {GremlinAnchor, GremlinScript, PeekEdge} from './types';

export const GREMLIN_SIZE = 48;
const VIEWPORT_MARGIN = 16;
const NAV_CLEARANCE = 88;
const SCROLL_PEEK_RESERVE = {width: 200, height: 220};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] ?? items[0]!;
}

export function getVisibleCards(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.card-lift')).filter((el) => {
    const rect = el.getBoundingClientRect();
    return rect.bottom > NAV_CLEARANCE && rect.top < window.innerHeight - 24 && rect.width > 80 && rect.height > 80;
  });
}

export function pickCard(): HTMLElement | null {
  const cards = getVisibleCards();
  if (cards.length === 0) return null;
  return cards[Math.floor(Math.random() * cards.length)] ?? null;
}

function overlapsScrollPeek(x: number, y: number): boolean {
  const reserveLeft = window.innerWidth - SCROLL_PEEK_RESERVE.width;
  const reserveTop = window.innerHeight - SCROLL_PEEK_RESERVE.height;
  return x + GREMLIN_SIZE > reserveLeft && y + GREMLIN_SIZE > reserveTop;
}

function clampPosition(x: number, y: number): {x: number; y: number} {
  let nextX = clamp(x, VIEWPORT_MARGIN, window.innerWidth - GREMLIN_SIZE - VIEWPORT_MARGIN);
  let nextY = clamp(y, NAV_CLEARANCE, window.innerHeight - GREMLIN_SIZE - VIEWPORT_MARGIN);

  if (overlapsScrollPeek(nextX, nextY)) {
    nextX = Math.min(nextX, window.innerWidth - SCROLL_PEEK_RESERVE.width - GREMLIN_SIZE - 8);
    nextY = Math.min(nextY, window.innerHeight - SCROLL_PEEK_RESERVE.height - GREMLIN_SIZE - 8);
  }

  return {x: nextX, y: nextY};
}

function anchorPeekFromCard(card: HTMLElement): GremlinAnchor {
  const rect = card.getBoundingClientRect();
  const peekEdge = randomItem<PeekEdge>(['top', 'left', 'right']);

  switch (peekEdge) {
    case 'left': {
      const {x, y} = clampPosition(rect.left - GREMLIN_SIZE * 0.4, rect.top + rect.height * 0.28);
      return {x, y, peekEdge, card, clip: true};
    }
    case 'right': {
      const {x, y} = clampPosition(rect.right - GREMLIN_SIZE * 0.6, rect.top + rect.height * 0.28);
      return {x, y, peekEdge, card, clip: true};
    }
    default: {
      const {x, y} = clampPosition(rect.left + rect.width / 2 - GREMLIN_SIZE / 2, rect.bottom - GREMLIN_SIZE * 0.5);
      return {x, y, peekEdge: 'top', card, clip: true};
    }
  }
}

function anchorBesideCard(card: HTMLElement): GremlinAnchor {
  const rect = card.getBoundingClientRect();
  const preferLeft = rect.left > window.innerWidth / 2 || overlapsScrollPeek(rect.right - GREMLIN_SIZE, rect.top);

  if (preferLeft) {
    const {x, y} = clampPosition(rect.left - GREMLIN_SIZE + 8, rect.top + rect.height / 2 - GREMLIN_SIZE / 2);
    return {x, y, peekEdge: 'left', card, clip: false};
  }

  const {x, y} = clampPosition(rect.right - 8, rect.top + rect.height / 2 - GREMLIN_SIZE / 2);
  return {x, y, peekEdge: 'right', card, clip: false};
}

function anchorOnCardTop(card: HTMLElement): GremlinAnchor {
  const rect = card.getBoundingClientRect();
  const {x, y} = clampPosition(
    rect.left + rect.width * (0.2 + Math.random() * 0.6) - GREMLIN_SIZE / 2,
    rect.top - GREMLIN_SIZE * 0.15,
  );
  return {x, y, peekEdge: 'top', card, clip: false};
}

function anchorInspectCard(card: HTMLElement): GremlinAnchor {
  const rect = card.getBoundingClientRect();
  const {x, y} = clampPosition(
    rect.left + rect.width * 0.65 - GREMLIN_SIZE / 2,
    rect.top + rect.height * 0.55 - GREMLIN_SIZE / 2,
  );
  return {x, y, peekEdge: 'top', card, clip: false};
}

function anchorViewportSlot(script: GremlinScript): GremlinAnchor {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const safeRight = w - SCROLL_PEEK_RESERVE.width - GREMLIN_SIZE - 12;
  const safeBottom = h - SCROLL_PEEK_RESERVE.height - GREMLIN_SIZE - 12;

  const slots: Array<{x: number; y: number; peekEdge: PeekEdge}> = [
    {x: VIEWPORT_MARGIN, y: NAV_CLEARANCE + 24, peekEdge: 'left'},
    {x: VIEWPORT_MARGIN, y: h * 0.38, peekEdge: 'left'},
    {x: VIEWPORT_MARGIN, y: Math.min(safeBottom, h * 0.62), peekEdge: 'left'},
    {x: w * 0.28, y: NAV_CLEARANCE + 40, peekEdge: 'top'},
    {x: w * 0.5 - GREMLIN_SIZE / 2, y: h * 0.32, peekEdge: 'top'},
    {x: Math.min(safeRight, w * 0.62), y: h * 0.42, peekEdge: 'right'},
    {x: Math.min(safeRight, w * 0.38), y: Math.min(safeBottom, h * 0.58), peekEdge: 'left'},
  ];

  if (script === 'trip') {
    const {x, y} = clampPosition(w * (0.15 + Math.random() * 0.35), Math.min(safeBottom, h * 0.7));
    return {x, y, peekEdge: 'left', card: null, clip: false};
  }

  const slot = randomItem(slots);
  const {x, y} = clampPosition(slot.x, slot.y);
  return {x, y, peekEdge: slot.peekEdge, card: null, clip: false};
}

export function pickScript(hasCards: boolean): GremlinScript {
  const roll = Math.random();

  if (hasCards) {
    if (roll < 0.28) return 'peekCard';
    if (roll < 0.46) return 'watchVisitor';
    if (roll < 0.58) return 'wave';
    if (roll < 0.76) return 'inspect';
    if (roll < 0.9) return 'coffee';
    return 'trip';
  }

  if (roll < 0.35) return 'watchVisitor';
  if (roll < 0.55) return 'wave';
  if (roll < 0.75) return 'coffee';
  return 'trip';
}

export function pickPlacement(script: GremlinScript, card: HTMLElement | null): GremlinAnchor {
  if (card) {
    switch (script) {
      case 'peekCard':
        return anchorPeekFromCard(card);
      case 'watchVisitor':
      case 'wave':
        return anchorBesideCard(card);
      case 'inspect':
        return anchorInspectCard(card);
      case 'coffee':
        return anchorOnCardTop(card);
      case 'trip': {
        const beside = anchorBesideCard(card);
        return {...beside, y: beside.y + GREMLIN_SIZE * 0.35, clip: false};
      }
    }
  }

  return anchorViewportSlot(script);
}
