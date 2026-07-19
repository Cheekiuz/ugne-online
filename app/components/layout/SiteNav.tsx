'use client';

import Image from 'next/image';
import Link from 'next/link';
import type {LucideIcon} from 'lucide-react';
import {BarChart3, ChevronRight, Coffee, DoorOpen, Home, Mail, Menu, Moon, Smile, Sun, X} from 'lucide-react';
import {useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject} from 'react';
import {EXIT_SOUNDS, SAY_CHEESE_SOUND, playNavClickSound} from '../../lib/nav-click-sound';
import {ThemeToggle} from '../theme-toggle/ThemeToggle';

const PERSONA_IMAGE = '/cc34d4a1-65a9-47d8-82e2-ce055bec3b13.jpeg';
const CHALLENGE_ME_URL = 'https://www.instagram.com/ugne_le_';
const EMAIL = 'crycocacola@gmail.com';

type SiteNavProps = {
  currentPage?: 'home' | 'statistics' | 'sponsorship' | 'say-cheese' | 'enter';
};

type NavPage = SiteNavProps['currentPage'];

const NAV_LINKS: {
  page: NavPage;
  href: string;
  label: string;
  icon?: LucideIcon;
  iconOnly?: boolean;
  iconFlip?: boolean;
  clickSound?: string | readonly string[];
}[] = [
  {page: 'home', href: '/home/', label: 'Home', icon: Home, iconOnly: true},
  {page: 'statistics', href: '/statistics/', label: 'Statistics', icon: BarChart3, iconOnly: true},
  {page: 'sponsorship', href: '/sponsorship/', label: 'Sponsorship', icon: Coffee, iconOnly: true},
  {page: 'say-cheese', href: '/say-cheese/', label: 'Say Cheese', icon: Smile, iconOnly: true, iconFlip: true, clickSound: SAY_CHEESE_SOUND},
  {page: 'enter', href: '/', label: 'Exit', icon: DoorOpen, iconOnly: true, clickSound: EXIT_SOUNDS},
];

function useThemeMode(): 'light' | 'dark' {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const read = () => {
      setMode(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
    return () => observer.disconnect();
  }, []);

  return mode;
}

function MobileMenuSection({title, children, bordered}: {title: string; children: ReactNode; bordered?: boolean}) {
  return (
    <section className={bordered ? 'pt-4 border-t border-outline-variant/15' : undefined}>
      <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 px-1">{title}</p>
      <div className="flex flex-col gap-1">{children}</div>
    </section>
  );
}

type MobileNavRowProps = {
  href: string;
  label: string;
  secondary?: string;
  icon?: LucideIcon;
  iconOnly?: boolean;
  iconFlip?: boolean;
  active?: boolean;
  external?: boolean;
  clickSound?: string | readonly string[];
  onNavigate?: () => void;
  trailing?: ReactNode;
};

function MobileNavRow({
  href,
  label,
  secondary,
  icon: Icon,
  iconOnly = false,
  iconFlip = false,
  active = false,
  external = false,
  clickSound,
  onNavigate,
  trailing,
}: MobileNavRowProps) {
  const rowClassName = [
    'group flex items-center gap-3 w-full min-h-[48px] px-3 py-2.5 rounded-xl transition-colors font-headline',
    active
      ? 'bg-primary/12 font-bold border-l-2 border-primary'
      : 'text-on-surface-variant hover:bg-primary/8',
  ].join(' ');

  const pillClassName = [
    active ? 'nav-link-pill-active' : 'nav-link-pill-inactive',
    iconOnly ? 'nav-link-pill--icon h-11 w-11' : 'nav-link-pill--text',
  ].join(' ');

  const content = (
    <>
      {iconOnly && Icon ? (
        <span className={['inline-flex shrink-0 items-center justify-center', pillClassName].join(' ')}>
          <Icon
            className={[
              'nav-link-icon',
              active ? 'h-5 w-5 nav-link-icon-active' : 'h-5 w-5 nav-link-icon-inactive',
              iconFlip ? 'nav-link-icon--flipped' : '',
            ].join(' ')}
            strokeWidth={active ? 2.5 : 2}
            aria-hidden
          />
        </span>
      ) : Icon ? (
        <span
          className={[
            'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            active ? 'bg-primary/15 text-primary' : 'bg-surface-container-low text-on-surface-variant',
          ].join(' ')}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      ) : (
        <span className={['inline-flex shrink-0 items-center justify-center', pillClassName].join(' ')}>
          <span className={active ? 'nav-link-text-active text-sm leading-tight' : 'nav-link-text-inactive text-sm leading-tight'}>
            {label}
          </span>
        </span>
      )}
      {iconOnly ? (
        <>
          <span className="sr-only">{label}</span>
          <span className="flex-1" aria-hidden />
        </>
      ) : (
        <span className="flex flex-col min-w-0 flex-1 text-left">
          {Icon ? <span className="text-sm leading-tight">{label}</span> : <span className="sr-only">{label}</span>}
          {secondary ? (
            <span className="font-body text-xs text-on-surface-variant truncate mt-0.5">{secondary}</span>
          ) : null}
        </span>
      )}
      {trailing ?? (external || href ? <ChevronRight className="h-4 w-4 shrink-0 opacity-40" aria-hidden /> : null)}
    </>
  );

  const handleNavigate = () => {
    if (clickSound) playNavClickSound(clickSound);
    onNavigate?.();
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={rowClassName}
        onClick={handleNavigate}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={rowClassName} onClick={handleNavigate}>
      {content}
    </Link>
  );
}

const NAV_SCROLL_RANGE_MOBILE = 72;
const NAV_SCROLL_RANGE_DESKTOP = 56;
const DESKTOP_MQ = '(min-width: 768px)';

function useNavScrollShell(
  shellRef: RefObject<HTMLElement | null>,
  barRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const desktopMq = window.matchMedia(DESKTOP_MQ);
    let floating = false;
    let frame = 0;

    const update = () => {
      const range = desktopMq.matches ? NAV_SCROLL_RANGE_DESKTOP : NAV_SCROLL_RANGE_MOBILE;
      const progress = Math.min(1, Math.max(0, window.scrollY / range));
      shellRef.current?.style.setProperty('--nav-scroll', progress.toFixed(3));

      const shouldFloat = progress > 0.85;
      if (shouldFloat !== floating) {
        floating = shouldFloat;
        barRef.current?.classList.toggle('is-floating', shouldFloat);
      }

      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    desktopMq.addEventListener('change', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      desktopMq.removeEventListener('change', update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [shellRef, barRef]);
}

export function SiteNav({currentPage = 'home'}: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const shellRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  useNavScrollShell(shellRef, barRef);
  const themeMode = useThemeMode();
  const ThemeIcon = themeMode === 'dark' ? Sun : Moon;

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav ref={shellRef} className="site-nav-shell" style={{'--nav-scroll': 0} as CSSProperties}>
      <div ref={barRef} className="site-nav-bar">
        <div className="site-nav-inner relative z-50 flex justify-between items-center gap-2 sm:gap-3 font-headline tracking-tight min-w-0 mx-auto px-4 sm:px-6 md:px-8">
        <Link href="/home/" className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0" onClick={closeMenu}>
          <div className="tennis-gradient p-0.5 rounded-full shrink-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
              <Image
                src={PERSONA_IMAGE}
                alt="Ugnė"
                fill
                className="object-cover object-top"
                sizes="40px"
                priority
              />
            </div>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-black tennis-gradient-text truncate">Ugnė.</div>
        </Link>

        <div className="hidden lg:flex flex-1 justify-center gap-6 lg:gap-10 items-center min-w-0 px-4">
          {NAV_LINKS.map((link) => {
            const active = currentPage === link.page;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'group inline-flex items-center justify-center font-bold transition-all whitespace-nowrap',
                  active ? 'opacity-100' : 'opacity-80 hover:opacity-100',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
                aria-label={link.iconOnly ? link.label : undefined}
                onClick={
                  link.clickSound
                    ? () => {
                        playNavClickSound(link.clickSound!);
                      }
                    : undefined
                }
              >
                <span
                  className={[
                    active ? 'nav-link-pill-active' : 'nav-link-pill-inactive',
                    link.iconOnly ? 'nav-link-pill--icon' : 'nav-link-pill--text',
                  ].join(' ')}
                >
                  {link.iconOnly && Icon ? (
                    <Icon
                      className={[
                        'nav-link-icon',
                        active ? 'h-5 w-5 nav-link-icon-active' : 'h-6 w-6 nav-link-icon-inactive',
                        link.iconFlip ? 'nav-link-icon--flipped' : '',
                      ].join(' ')}
                      strokeWidth={active ? 2.5 : 2}
                      aria-hidden
                    />
                  ) : (
                    <span className={active ? 'nav-link-text-active' : 'nav-link-text-inactive'}>{link.label}</span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-4 lg:gap-6 shrink-0">
          <a
            href={`mailto:${EMAIL}`}
            className="text-primary inline-flex hover:scale-110 transition-transform"
            aria-label={`Email ${EMAIL}`}
          >
            <Mail className="h-6 w-6" aria-hidden />
          </a>
          {currentPage === 'home' ? (
            <a
              href={CHALLENGE_ME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="tennis-gradient text-on-primary px-6 py-2 rounded-xl font-bold scale-95 active:scale-90 transition-transform whitespace-nowrap"
            >
              Challenge me
            </a>
          ) : (
            <Link
              href="/home/"
              className="tennis-gradient text-on-primary px-6 py-2 rounded-xl font-bold scale-95 active:scale-90 transition-transform whitespace-nowrap"
            >
              Back to Reality
            </Link>
          )}
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-primary text-primary transition-all hover:bg-primary/10 active:scale-95 shrink-0"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="site-nav-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {menuOpen ? (
        <>
          <div
            className="mobile-nav-backdrop fixed inset-0 z-40 bg-on-surface/30 backdrop-blur-sm lg:hidden"
            aria-hidden
            onClick={closeMenu}
          />
          <div
            id="site-nav-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="mobile-nav-panel relative z-50 glass-nav border-t border-outline-variant/20 bg-surface-container-lowest/95 backdrop-blur-xl rounded-b-2xl px-4 py-5 shadow-lg lg:hidden"
          >
            <div className="max-w-7xl mx-auto flex flex-col gap-4">
              <MobileMenuSection title="Navigation">
                {NAV_LINKS.map((link) => (
                  <MobileNavRow
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    icon={link.icon}
                    iconOnly={link.iconOnly}
                    iconFlip={link.iconFlip}
                    active={currentPage === link.page}
                    clickSound={link.clickSound}
                    onNavigate={closeMenu}
                  />
                ))}
              </MobileMenuSection>

              <MobileMenuSection title="Contact" bordered>
                <MobileNavRow
                  href={`mailto:${EMAIL}`}
                  label="Email"
                  secondary={EMAIL}
                  icon={Mail}
                  onNavigate={closeMenu}
                />
              </MobileMenuSection>

              <MobileMenuSection title="Actions" bordered>
                <div className="flex items-center gap-3 w-full min-h-[48px] px-3 py-2.5 rounded-xl text-on-surface hover:bg-surface-container-low transition-colors">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant">
                    <ThemeIcon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="font-headline text-sm leading-tight">Appearance</span>
                    <span className="font-body text-xs text-on-surface-variant mt-0.5 capitalize">{themeMode} mode</span>
                  </span>
                  <ThemeToggle />
                </div>

                {currentPage === 'home' ? (
                  <a
                    href={CHALLENGE_ME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block w-full tennis-gradient text-on-primary px-6 py-3 rounded-xl font-headline font-bold text-center active:scale-[0.98] transition-transform"
                    onClick={closeMenu}
                  >
                    Challenge me
                  </a>
                ) : (
                  <Link
                    href="/home/"
                    className="mt-2 block w-full tennis-gradient text-on-primary px-6 py-3 rounded-xl font-headline font-bold text-center active:scale-[0.98] transition-transform"
                    onClick={closeMenu}
                  >
                    Back to Reality
                  </Link>
                )}
              </MobileMenuSection>
            </div>
          </div>
        </>
      ) : null}
      </div>
    </nav>
  );
}
