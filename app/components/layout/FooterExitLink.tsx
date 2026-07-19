'use client';

import Link from 'next/link';
import {DoorOpen} from 'lucide-react';
import {EXIT_SOUNDS, playNavClickSound} from '../../lib/nav-click-sound';

type FooterExitLinkProps = {
  className: string;
};

export function FooterExitLink({className}: FooterExitLinkProps) {
  return (
    <Link
      className={className}
      href="/"
      aria-label="Exit"
      onClick={() => playNavClickSound(EXIT_SOUNDS)}
    >
      <DoorOpen className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
    </Link>
  );
}
