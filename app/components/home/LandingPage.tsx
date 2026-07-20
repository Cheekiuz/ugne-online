'use client';

import {useRouter} from 'next/navigation';
import {useRef} from 'react';
import {DoorClosed, DoorOpen} from 'lucide-react';
import {prepareWelcomeAfterDoorEntry} from './FirstVisitWelcome';

const PAGE_LOAD_SOUND = '/audio/211976__qubodup__boom2.flac';

const DOOR_ICON_CLASS =
  'door-entry-blink size-[clamp(2.25rem,8vmin,3.5rem)] text-primary transition-[color,filter,opacity] duration-200 group-active:animate-none group-active:text-red-700 group-active:opacity-100 group-active:drop-shadow-[0_0_16px_rgba(220,38,38,0.55)] dark:group-active:text-white dark:group-active:drop-shadow-[0_0_24px_rgba(255,237,213,0.95)]';

export function LandingPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const handleEnter = () => {
    const audio = audioRef.current;
    if (audio) {
      void audio.play().catch(() => {
        // FLAC may be unsupported in some browsers.
      });
    }

    prepareWelcomeAfterDoorEntry();

    router.push('/home/');
  };

  return (
    <>
      <audio ref={audioRef} preload="none" onError={() => undefined}>
        <source src={PAGE_LOAD_SOUND} type="audio/flac" />
      </audio>

      <div
        className="fixed inset-0 z-[200] flex h-dvh w-full items-center justify-center bg-background pointer-events-auto"
        style={{position: 'fixed', inset: 0, zIndex: 200}}
      >
        <button
          type="button"
          onClick={handleEnter}
          className="group flex min-h-16 min-w-16 cursor-pointer items-center justify-center rounded-2xl p-4 transition-all duration-200 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:scale-[0.98]"
          aria-label="Enter site"
        >
          <DoorClosed
            className={`${DOOR_ICON_CLASS} group-active:hidden`}
            strokeWidth={1.25}
            aria-hidden
          />
          <DoorOpen
            className={`${DOOR_ICON_CLASS} hidden group-active:block`}
            strokeWidth={1.25}
            aria-hidden
          />
        </button>
      </div>
    </>
  );
}
