'use client';

import {useEffect, useState} from 'react';
import './scroll-peek-character.css';

const SCROLL_THRESHOLD_PX = 160;
const HIDE_AFTER_SCROLL_MS = 450;

export function ScrollPeekCharacter() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      if (window.scrollY <= SCROLL_THRESHOLD_PX) {
        setVisible(false);
        return;
      }

      setVisible(true);
      window.clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        setVisible(false);
      }, HIDE_AFTER_SCROLL_MS);
    };

    window.addEventListener('scroll', onScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <div
      className={`scroll-peek-character${visible ? ' scroll-peek-character--visible' : ''}`}
      aria-hidden
    >
      <img
        src="/scroll-peek-character.png"
        alt=""
        className="scroll-peek-character__image"
        width={512}
        height={512}
        decoding="async"
      />
    </div>
  );
}
