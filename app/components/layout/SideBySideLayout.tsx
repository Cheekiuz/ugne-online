'use client';

import {createContext, useContext, useLayoutEffect, useRef, type ReactNode, type RefObject} from 'react';

const STICKY_TOP_PX = 144;
const DESKTOP_MEDIA = '(min-width: 900px)';

type SideBySideRefs = {
  rootRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  railRef: RefObject<HTMLElement | null>;
  heroRef: RefObject<HTMLDivElement | null>;
};

const SideBySideContext = createContext<SideBySideRefs | null>(null);

type SideBySideLayoutProps = {
  children: ReactNode;
  className?: string;
};

function resetHeroStyles(hero: HTMLDivElement, rail: HTMLElement) {
  hero.style.position = '';
  hero.style.top = '';
  hero.style.left = '';
  hero.style.width = '';
  rail.style.minHeight = '';
}

export function SideBySideLayout({children, className = ''}: SideBySideLayoutProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);

  useLayoutEffect(() => {
    const update = () => {
      const root = rootRef.current;
      const content = contentRef.current;
      const rail = railRef.current;
      const hero = heroRef.current;
      if (!root || !content || !rail || !hero) return;

      if (!window.matchMedia(DESKTOP_MEDIA).matches) {
        resetHeroStyles(hero, rail);
        return;
      }

      const contentHeight = content.offsetHeight;
      rail.style.minHeight = `${contentHeight}px`;

      const scrollY = window.scrollY;
      const sectionTop = root.getBoundingClientRect().top + scrollY;
      const sectionBottom = sectionTop + contentHeight;
      const heroHeight = hero.offsetHeight;
      const railRect = rail.getBoundingClientRect();

      if (scrollY + STICKY_TOP_PX < sectionTop) {
        resetHeroStyles(hero, rail);
        rail.style.minHeight = `${contentHeight}px`;
        return;
      }

      if (scrollY + STICKY_TOP_PX + heroHeight > sectionBottom) {
        hero.style.position = 'absolute';
        hero.style.top = `${contentHeight - heroHeight}px`;
        hero.style.left = '0';
        hero.style.width = '100%';
        return;
      }

      hero.style.position = 'fixed';
      hero.style.top = `${STICKY_TOP_PX}px`;
      hero.style.left = `${railRect.left}px`;
      hero.style.width = `${railRect.width}px`;
    };

    const schedule = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(update);
    };

    schedule();

    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);

    const desktopQuery = window.matchMedia(DESKTOP_MEDIA);
    desktopQuery.addEventListener('change', schedule);

    const content = contentRef.current;
    if (content) {
      const resizeObserver = new ResizeObserver(schedule);
      resizeObserver.observe(content);
      return () => {
        cancelAnimationFrame(frameRef.current);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        desktopQuery.removeEventListener('change', schedule);
        resizeObserver.disconnect();
      };
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      desktopQuery.removeEventListener('change', schedule);
    };
  }, []);

  return (
    <SideBySideContext.Provider value={{rootRef, contentRef, railRef, heroRef}}>
      <div ref={rootRef} className={`side-by-side-layout min-[900px]:gap-8 xl:gap-12 ${className}`.trim()}>
        {children}
      </div>
    </SideBySideContext.Provider>
  );
}

export function SideBySideContent({children, className = ''}: SideBySideLayoutProps) {
  const context = useContext(SideBySideContext);

  return (
    <div ref={context?.contentRef} className={`side-by-side-layout__content min-w-0 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function SideBySideHero({children}: {children: ReactNode}) {
  const context = useContext(SideBySideContext);

  return (
    <aside ref={context?.railRef} className="side-by-side-layout__hero hidden min-[900px]:block">
      <div ref={context?.heroRef} className="side-by-side-layout__hero-sticky">
        {children}
      </div>
    </aside>
  );
}
