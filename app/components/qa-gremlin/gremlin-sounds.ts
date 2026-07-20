export const GREMLIN_LAUGH_SOUND = '/audio/evil-laugh.mp3';

export function playGremlinLaugh(): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio(GREMLIN_LAUGH_SOUND);
    const finish = () => resolve();

    audio.addEventListener('ended', finish, {once: true});
    audio.addEventListener('error', finish, {once: true});

    void audio.play().catch(finish);
  });
}
