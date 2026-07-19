'use client';

import {useLayoutEffect, useRef, type ComponentPropsWithoutRef, type ReactNode} from 'react';

type SideBySideLayoutProps = {
  children: ReactNode;
  className?: string;
};

const DESKTOP_MQ = '(min-width: 768px)';

function stickyTopPx(): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) * 9;
}

function clearStickyStyles(hero: HTMLElement, sticky: HTMLElement) {
  sticky.style.position = '';
  sticky.style.top = '';
  sticky.style.left = '';
  sticky.style.width = '';
  sticky.style.transform = '';
  sticky.style.zIndex = '';
  hero.style.minHeight = '';
}

export function SideBySideLayout({children, className = ''}: SideBySideLayoutProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const content = root.querySelector<HTMLElement>('.side-by-side-layout__content');
    const hero = root.querySelector<HTMLElement>('.side-by-side-layout__hero');
    const sticky = root.querySelector<HTMLElement>('.side-by-side-layout__hero-sticky');
    if (!content || !hero || !sticky) return;

    const mediaQuery = window.matchMedia(DESKTOP_MQ);
    let frame = 0;

    const update = () => {
      if (!mediaQuery.matches) {
        clearStickyStyles(hero, sticky);
        return;
      }

      const end = content.matches('[data-side-by-side-end]')
        ? content
        : content.querySelector<HTMLElement>('[data-side-by-side-end]');
      if (!end) return;

      const top = stickyTopPx();
      const scrollY = window.scrollY;
      const heroRect = hero.getBoundingClientRect();
      const endRect = end.getBoundingClientRect();
      const stickyHeight = sticky.getBoundingClientRect().height;

      const trackHeight = Math.ceil(endRect.bottom - heroRect.top);
      hero.style.minHeight = `${trackHeight}px`;

      const heroTop = scrollY + heroRect.top;
      const endBottom = scrollY + endRect.bottom;
      const startScroll = heroTop - top;
      const endScroll = endBottom - top - stickyHeight;

      if (scrollY < startScroll) {
        sticky.style.position = '';
        sticky.style.top = '';
        sticky.style.left = '';
        sticky.style.width = '';
        sticky.style.transform = '';
        sticky.style.zIndex = '';
        return;
      }

      if (scrollY > endScroll) {
        sticky.style.position = '';
        sticky.style.top = '';
        sticky.style.left = '';
        sticky.style.width = '';
        sticky.style.zIndex = '';
        sticky.style.transform = `translateY(${Math.max(0, trackHeight - stickyHeight)}px)`;
        return;
      }

      sticky.style.position = 'fixed';
      sticky.style.top = `${top}px`;
      sticky.style.left = `${heroRect.left}px`;
      sticky.style.width = `${heroRect.width}px`;
      sticky.style.transform = '';
      sticky.style.zIndex = '10';
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    schedule();

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(content);
    resizeObserver.observe(sticky);

    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);
    mediaQuery.addEventListener('change', schedule);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      mediaQuery.removeEventListener('change', schedule);
      clearStickyStyles(hero, sticky);
    };
  }, []);

  return (
    <div ref={rootRef} className={`md:flex md:items-stretch md:gap-8 xl:gap-12 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function SideBySideContent({
  children,
  className = '',
  ...props
}: SideBySideLayoutProps & ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={`side-by-side-layout__content min-w-0 flex-1 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function SideBySideHero({children}: {children: ReactNode}) {
  return (
    <aside className="side-by-side-layout__hero hidden md:block md:w-[min(560px,48%)] md:shrink-0">
      <div className="side-by-side-layout__hero-sticky">{children}</div>
    </aside>
  );
}
