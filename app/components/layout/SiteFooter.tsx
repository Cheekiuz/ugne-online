import Link from 'next/link';
import {Coffee, Instagram} from 'lucide-react';
import {FooterExitLink} from './FooterExitLink';

const INSTAGRAM_URL = 'https://www.instagram.com/ugne_le_';
const SPONSORSHIP_URL = '/sponsorship/';

const footerIconLinkClass =
  'text-on-surface opacity-60 hover:text-primary hover:scale-110 transition-all inline-flex shrink-0';

export function SiteFooter() {
  return (
    <footer className="w-full bg-surface-container-low mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6 lg:gap-8">
          <div className="flex items-center justify-between md:contents">
            <div className="font-headline text-base sm:text-lg font-bold text-on-surface shrink-0 md:order-1">
              Ugnė.
            </div>
            <div className="flex items-center gap-3 sm:gap-4 md:order-3">
              <a
                className={footerIconLinkClass}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
              </a>
              <Link className={footerIconLinkClass} href={SPONSORSHIP_URL} aria-label="Sponsorship">
                <Coffee className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
              </Link>
              <FooterExitLink className={footerIconLinkClass} />
            </div>
          </div>
          <p className="font-body text-xs uppercase tracking-wide text-on-surface/60 text-center leading-relaxed text-balance max-w-sm mx-auto md:order-2 md:flex-1 md:min-w-0 md:max-w-none md:mx-0 md:px-4 md:leading-snug md:whitespace-normal lg:whitespace-nowrap lg:tracking-widest">
            ©2026 Ugnė. Engineered with Precision. Played with Passion. Seriousness not required.
          </p>
        </div>
      </div>
    </footer>
  );
}
