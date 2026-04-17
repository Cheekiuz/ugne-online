interface Sheet {
  url: string;
}

type RoundButtonConfig = {
  sprite: string;
  width: number;
  height: number;
  totalFrames: number;
  columns: number;
  fps?: number;
  isActive: boolean;
  onClick?: () => void;
  onHoverStart?: () => void;
  onReverseComplete?: () => void;
};

class RoundButton {
  element: HTMLAnchorElement;

  width: number;
  height: number;
  totalFrames: number;
  columns: number;
  fps: number;
  cframe = 0;
  animId: number | null = null;
  hovering = false;
  reversing = false;

  onClick?: () => void;
  onHoverStart?: () => void;
  onReverseComplete?: () => void;

  constructor(container: HTMLElement, config: RoundButtonConfig) {
    // Create <a>
    this.element = document.createElement("a");
    this.element.className = "button";
    this.element.href = "#";
    this.element.setAttribute("role", "button");
    if (config.isActive) this.element.classList.add("active");

    // Sprite setup
    this.width = config.width;
    this.height = config.height;
    this.totalFrames = config.totalFrames;
    this.columns = config.columns;
    this.fps = config.fps ?? 30;

    this.onClick = config.onClick;
    this.onHoverStart = config.onHoverStart;
    this.onReverseComplete = config.onReverseComplete;

    Object.assign(this.element.style, {
      width: `${this.width}px`,
      height: `${this.height}px`,
      display: "inline-block",
      backgroundImage: `url(${config.sprite})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "0px 0px",
      cursor: "pointer"
    });

    container.appendChild(this.element);

    // Bind
    this.animate = this.animate.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleClick = this.handleClick.bind(this);

    // Events
    this.element.addEventListener("mouseover", this.handleMouseOver);
    this.element.addEventListener("mouseout", this.handleMouseOut);
    this.element.addEventListener("click", this.handleClick);

    this.renderFrame();
  }

  handleClick(e: MouseEvent) {
    e.preventDefault();
    const clickedEl = e.currentTarget as HTMLElement;

    document.querySelectorAll(".button").forEach((btn) => {
      btn.classList.remove("active");
    });

    clickedEl.classList.add("active");
    this.onClick?.();
  }

  handleMouseOver() {
    this.hovering = true;
    this.reversing = false;
    this.onHoverStart?.();

    if (!this.animId) {
      this.animate();
    }
  }

  handleMouseOut() {
    this.hovering = false;
    this.reversing = true;

    if (!this.animId) {
      this.animate();
    }
  }

  animate() {
    this.renderFrame();

    if (this.hovering) {
      this.cframe = (this.cframe + 1) % this.totalFrames;
    } else if (this.reversing) {
      this.cframe--;
      if (this.cframe <= 0) {
        this.cframe = 0;
        this.reversing = false;
        this.animId = null;
        this.onReverseComplete?.();
        return;
      }
    } else {
      this.animId = null;
      return;
    }

    setTimeout(() => {
      this.animId = requestAnimationFrame(this.animate);
    }, 1000 / this.fps);
  }

  renderFrame() {
    const col = this.cframe % this.columns;
    const row = Math.floor(this.cframe / this.columns);

    this.element.style.backgroundPosition = `${-col * this.width}px ${
      -row * this.height
    }px`;
  }
}

class SpriteAnimator {
  private element: HTMLElement;
  private preloadElement: HTMLElement;
  private allSpriteSheets: Sheet[][];
  private spriteSheets: Sheet[];
  private frameWidth: number;
  private frameHeight: number;
  private columns: number;
  private totalFrames: number;
  private currentFrame: number = 0;
  private currentSpriteIndex: number = 0;
  private nextIdleIndex: number = 0;
  private nextClickIndex: number = 0;
  private fps: number;
  private intervalId: number | null = null;
  private preloaded: Set<string> = new Set();
  private containerEl: HTMLElement;
  private messageEl: HTMLElement;
  private questionEl: HTMLElement;
  private queuedClick: boolean = false;
  private playingClick: boolean = false;

  constructor(
    spriteSheets: Sheet[][],
    sheetIndex: number,
    frameWidth: number,
    frameHeight: number,
    columns: number,
    fps: number = 24,
    totalFrames: number = 121,
    classString?: string
  ) {
    this.allSpriteSheets = spriteSheets;
    this.currentSpriteIndex = sheetIndex;
    this.spriteSheets = this.allSpriteSheets[this.currentSpriteIndex];

    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.columns = columns;
    this.fps = fps;
    this.totalFrames = totalFrames;
    // Container setup
    this.containerEl = document.createElement("div");
    this.containerEl.classList.add("container");
    this.containerEl.classList.add("waiting");
    if (classString) this.containerEl.classList.add(classString);
    this.containerEl.title = "";

    this.messageEl = document.createElement("div");
    this.messageEl.classList.add("message");
    this.messageEl.innerHTML = "";
    this.containerEl.appendChild(this.messageEl);

    this.questionEl = document.createElement("div");
    this.questionEl.classList.add("question");
    this.questionEl.innerHTML = "";
    this.containerEl.appendChild(this.questionEl);

    this.element = document.createElement("div");
    this.element.classList.add("sprite");
    this.containerEl.appendChild(this.element);
    document.body.appendChild(this.containerEl);

    this.preloadElement = document.createElement("div");
    this.preloadElement.classList.add("preload");
    this.containerEl.appendChild(this.preloadElement);

    this.setSpriteSheet(this.pickRandomIndex(11, 37));

    this.nextIdleIndex = this.pickRandomIndex(11, 37);
    this.nextClickIndex = this.pickRandomIndex(0, 10);
    this.preload(this.nextIdleIndex);
    this.preload(this.nextClickIndex);

    this.containerEl.addEventListener("click", () => {
      this.containerEl.classList.add("clicked");
      this.queuedClick = true;
    });
  }

  public setSpriteGroup(index: number) {
    if (this.currentSpriteIndex === index) return;
    this.currentSpriteIndex = index;
    this.spriteSheets = this.allSpriteSheets[this.currentSpriteIndex];
    this.nextIdleIndex = this.pickRandomIndex(11, 37);
    this.setSpriteSheet(this.nextIdleIndex);
  }

  private pickRandomIndex(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private preload(index: number) {
    const sheet = this.spriteSheets[index];
    if (this.preloaded.has(sheet.url)) return;

    const img = new Image();
    img.src = sheet.url;
    img.onload = () => {
      this.preloaded.add(sheet.url);
      if (this.preloaded.size === this.spriteSheets.length) {
        this.preloadElement.remove();
      }
    };
    this.preloadElement.appendChild(img);
  }

  private setSpriteSheet(index: number) {
    const sheet = this.spriteSheets[index];
    this.element.style.backgroundImage = `url(${sheet.url})`;
    this.currentFrame = 0;
  }

  private updateSprite() {
    const col = this.currentFrame % this.columns;
    const row = Math.floor(this.currentFrame / this.columns);
    const xOffset = -(col * this.frameWidth);
    const yOffset = -(row * this.frameHeight);
    this.element.style.backgroundPosition = `${xOffset}px ${yOffset}px`;
    this.currentFrame++;

    if (this.currentFrame === 2) {
      if (this.playingClick) {
        this.nextIdleIndex = this.pickRandomIndex(11, 37);
        this.nextClickIndex = this.pickRandomIndex(0, 10);
        this.preload(this.nextIdleIndex);
        this.preload(this.nextClickIndex);
      } else {
        this.nextIdleIndex = this.pickRandomIndex(11, 37);
        this.nextClickIndex = this.pickRandomIndex(0, 10);
        this.preload(this.nextIdleIndex);
        this.preload(this.nextClickIndex);
      }
    }

    if (this.currentFrame >= this.totalFrames) {
      this.stop();

      if (this.playingClick) {
        // Click animation just finished
        this.playingClick = false;
        this.containerEl.classList.add("waiting"); // show waiting message again
        this.setSpriteSheet(this.nextIdleIndex);
        this.start();
      } else if (this.queuedClick) {
        // User just clicked — start click animation
        this.queuedClick = false;
        this.playingClick = true;
        this.containerEl.classList.remove("waiting"); // hide waiting message
        this.containerEl.classList.remove("clicked");

        this.setSpriteSheet(this.nextClickIndex);
        this.start();
      } else {
        // Normal idle transition
        this.containerEl.classList.add("waiting");
        this.setSpriteSheet(this.nextIdleIndex);
        this.start();
      }
    }
  }

  public start() {
    if (this.intervalId !== null) return;
    this.intervalId = window.setInterval(
      () => this.updateSprite(),
      1000 / this.fps
    );
  }

  public stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

import type { Sheet } from "./sheet";

const SPRITE_BASE = "./executive-decision-sprites";

const charSheet: Sheet[][] = [
  [
    {
      url: `${SPRITE_BASE}/ex01-yes-01-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-yes-02-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-maybe-02-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-ask-01-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-ask-02-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-yes-03-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-yes-04-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-maybe-01-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-no-01-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-no-02-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-no-03-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-01-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-02-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-03-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-04-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-05-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-06-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-07-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-08-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-09-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-10-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-11-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-12-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-13-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-14-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-12-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-15-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-16-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-17-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-18-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-19-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-20-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-21-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-22-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-23-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-24-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-25-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex01-26-sprite.png`
    }
  ],

  [
    {
      url: `${SPRITE_BASE}/ex02-yes-01-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-yes-02-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-no-04-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-maybe-01-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-maybe-02-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-yes-03-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-no-01-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-no-02-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-no-03-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-ask-01-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-ask-02-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-01-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-02-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-03-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-04-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-05-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-06-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-07-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-24-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-09-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-10-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-11-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-12-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-13-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-14-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-12-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-25-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-16-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-17-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-18-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-19-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-20-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-21-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-22-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-23-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-24-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-25-sprite.png`
    },
    {
      url: `${SPRITE_BASE}/ex02-26-sprite.png`
    }
  ]
];

const indexSheet: Sheet[] = [
  {
    url: `${SPRITE_BASE}/ex01-00-sprite.png`
  },
  {
    url: `${SPRITE_BASE}/ex02-00-sprite.png`
  }
];

window.addEventListener("DOMContentLoaded", () => {
  const sheetIndex = 0;
  const man1 = new SpriteAnimator(charSheet, sheetIndex, 320, 320, 5, 24);
  man1.start();

  const container = document.getElementById("charSelect");
  const classes = ["blue", "red"];

  document.body.classList.add(`${classes[sheetIndex]}`);
  for (let i = 0; i < indexSheet.length; i++) {
    new RoundButton(container, {
      sprite: indexSheet[i].url,
      width: 75,
      height: 75,
      totalFrames: 121,
      columns: 5,
      onClick: () => {
        document.body.className = "";
        document.body.classList.add(`${classes[i]}`);
        man1.setSpriteGroup(i);
      },
      fps: 120,
      isActive: i == sheetIndex
    });
  }
});
