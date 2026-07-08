import type {Metadata} from 'next';
import Image from 'next/image';
import {SiteFooter} from '../components/layout/SiteFooter';
import {SiteNav} from '../components/layout/SiteNav';
import {SponsorSmileWall} from '../components/sponsorship/SponsorSmileWall';

const HERO_IMAGE = '/sponsorship-hero.png';

export const metadata: Metadata = {
  title: 'Cheese - Ugnė',
  description: 'Real smiles donated. Leave one if you dare.',
};

export default function CheesePage() {
  return (
    <>
      <SiteNav currentPage="cheese" />

      <main className="pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-12">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-8 font-label text-xs uppercase tracking-widest text-primary">
            <span>Not sponsored by dairy</span>
            <span className="text-on-surface-variant">(Yet)</span>
          </div>

          <div className="tennis-gradient p-6 sm:p-10 md:p-16 rounded-xl text-center text-on-primary shadow-xl mb-8 sm:mb-12">
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black mb-3">Cheese</h1>
            <p className="font-headline text-lg sm:text-xl md:text-2xl font-bold opacity-90 mb-2">
              THE SMILE WALL
            </p>
            <p className="text-lg opacity-90 font-light italic max-w-xl mx-auto">
              Because smiles deserve a place to live.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_min(560px,48%)] gap-8 xl:gap-12 items-start">
            <div className="max-w-2xl">
              <SponsorSmileWall />
            </div>

            <aside className="hidden lg:block lg:sticky lg:top-36">
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-surface-container-lowest ring-1 ring-outline-variant/20">
                <Image
                  src={HERO_IMAGE}
                  alt="Ugnė holding an iced latte and tennis racket — CODE. TEST. TENNIS. REPEAT."
                  width={920}
                  height={1024}
                  className="w-full h-auto"
                  sizes="(max-width: 1024px) 100vw, 560px"
                  priority
                />
              </div>
            </aside>
          </div>

          <div className="mt-10 lg:hidden">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-surface-container-lowest ring-1 ring-outline-variant/20 max-w-2xl mx-auto">
              <Image
                src={HERO_IMAGE}
                alt="Ugnė holding an iced latte and tennis racket — CODE. TEST. TENNIS. REPEAT."
                width={920}
                height={1024}
                className="w-full h-auto"
                sizes="100vw"
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
