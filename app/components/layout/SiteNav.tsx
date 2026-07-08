'use client';

import Image from 'next/image';
import Link from 'next/link';
import type {LucideIcon} from 'lucide-react';
import {ChevronRight, Mail, Menu, Moon, Sun, X} from 'lucide-react';
import {useEffect, useState, type ReactNode} from 'react';
import {ThemeToggle} from '../theme-toggle/ThemeToggle';

const PERSONA_IMAGE = '/cc34d4a1-65a9-47d8-82e2-ce055bec3b13.jpeg';
const CHALLENGE_ME_URL = 'https://www.instagram.com/ugne_le_';
const EMAIL = 'crycocacola@gmail.com';

type SiteNavProps = {
  currentPage?: 'home' | 'statistics' | 'sponsorship' | 'cheese';
};

type NavPage = SiteNavProps['currentPage'];

const NAV_LINKS: {page: NavPage; href: string; label: string}[] = [
  {page: 'home', href: '/', label: 'Home'},
  {page: 'statistics', href: '/statistics/', label: 'Statistics'},
  {page: 'sponsorship', href: '/sponsorship/', label: 'Sponsorship'},
  {page: 'cheese', href: '/cheese/', label: 'Cheese'},
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
  active?: boolean;
  external?: boolean;
  onNavigate?: () => void;
  trailing?: ReactNode;
};

function MobileNavRow({
  href,
  label,
  secondary,
  icon: Icon,
  active = false,
  external = false,
  onNavigate,
  trailing,
}: MobileNavRowProps) {
  const rowClassName = [
    'flex items-center gap-3 w-full min-h-[48px] px-3 py-2.5 rounded-xl transition-colors font-headline',
    active
      ? 'bg-primary/10 text-primary font-bold border-l-2 border-primary'
      : 'text-on-surface hover:bg-surface-container-low',
  ].join(' ');

  const content = (
    <>
      {Icon ? (
        <span
          className={[
            'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            active ? 'bg-primary/15 text-primary' : 'bg-surface-container-low text-on-surface-variant',
          ].join(' ')}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      ) : null}
      <span className="flex flex-col min-w-0 flex-1 text-left">
        <span className="text-sm leading-tight">{label}</span>
        {secondary ? (
          <span className="font-body text-xs text-on-surface-variant truncate mt-0.5">{secondary}</span>
        ) : null}
      </span>
      {trailing ?? (external || href ? <ChevronRight className="h-4 w-4 shrink-0 opacity-40" aria-hidden /> : null)}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={rowClassName}
        onClick={onNavigate}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={rowClassName} onClick={onNavigate}>
      {content}
    </Link>
  );
}

export function SiteNav({currentPage = 'home'}: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
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
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="relative z-50 flex justify-between items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4 md:px-8 md:py-6 max-w-7xl mx-auto font-headline tracking-tight min-w-0">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 shrink" onClick={closeMenu}>
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-primary shrink-0">
            <Image
              src={PERSONA_IMAGE}
              alt="Ugnė"
              fill
              className="object-cover object-top"
              sizes="40px"
              priority
            />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-primary truncate">Ugnė.</div>
        </Link>

        <div className="hidden md:flex gap-6 lg:gap-10 items-center">
          {NAV_LINKS.map((link) => {
            const active = currentPage === link.page;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'font-bold pb-1 transition-colors whitespace-nowrap',
                  active
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
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
              className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold scale-95 active:scale-90 transition-transform whitespace-nowrap"
            >
              Challenge me
            </a>
          ) : (
            <Link
              href="/"
              className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold scale-95 active:scale-90 transition-transform whitespace-nowrap"
            >
              Back to Reality
            </Link>
          )}
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-primary text-primary transition-all hover:bg-primary/10 active:scale-95 shrink-0"
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
            className="mobile-nav-backdrop fixed inset-0 z-40 bg-on-surface/30 backdrop-blur-sm md:hidden"
            aria-hidden
            onClick={closeMenu}
          />
          <div
            id="site-nav-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="mobile-nav-panel relative z-50 glass-nav border-t border-outline-variant/20 bg-surface-container-lowest/95 backdrop-blur-xl rounded-b-2xl px-4 py-5 shadow-lg md:hidden"
          >
            <div className="max-w-7xl mx-auto flex flex-col gap-4">
              <MobileMenuSection title="Navigation">
                {NAV_LINKS.map((link) => (
                  <MobileNavRow
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={currentPage === link.page}
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
                    className="mt-2 block w-full bg-primary text-on-primary px-6 py-3 rounded-xl font-headline font-bold text-center active:scale-[0.98] transition-transform"
                    onClick={closeMenu}
                  >
                    Challenge me
                  </a>
                ) : (
                  <Link
                    href="/"
                    className="mt-2 block w-full bg-primary text-on-primary px-6 py-3 rounded-xl font-headline font-bold text-center active:scale-[0.98] transition-transform"
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
    </nav>
  );
}
