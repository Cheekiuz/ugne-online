export const EXIT_SOUNDS = [
  '/audio/637071__SergeQuadrado__dad-says-bye-bye.mp3',
  '/audio/242669__Reitanna__snake-bye.mp3',
  '/audio/417197__theliongirl10__me-saying-bye.mp3',
  '/audio/343893__Reitanna__mmbye.mp3',
] as const;

export const SAY_CHEESE_SOUND = '/audio/93921__tim.kahn__cheese.mp3';

let lastExitSoundIndex = -1;

export function playNavClickSound(src: string | readonly string[]) {
  const sources = Array.isArray(src) ? src : [src];
  if (sources.length === 0) return;

  let index = Math.floor(Math.random() * sources.length);
  if (sources.length > 1) {
    while (index === lastExitSoundIndex) {
      index = Math.floor(Math.random() * sources.length);
    }
    lastExitSoundIndex = index;
  }

  const audio = new Audio(sources[index]);
  void audio.play().catch(() => {
    // Ignore autoplay restrictions or missing audio support.
  });
}
