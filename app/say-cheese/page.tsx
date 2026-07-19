import type {Metadata} from 'next';
import Image from 'next/image';
import {SiteFooter} from '../components/layout/SiteFooter';
import {SiteNav} from '../components/layout/SiteNav';
import {SideBySideContent, SideBySideHero, SideBySideLayout} from '../components/layout/SideBySideLayout';
import {SponsorSmileWall} from '../components/sponsorship/SponsorSmileWall';

const HERO_IMAGE = '/cheese-hero.png';
const HERO_ALT =
  'Ugnė holding a smiley tennis ball and racket — CODE. TEST. TENNIS. REPEAT.';

export const metadata: Metadata = {
  title: 'Say Cheese - Ugnė',
  description: 'Real smiles donated. Leave one if you dare.',
};

export default function SayCheesePage() {
  return (
    <>
      <SiteNav currentPage="say-cheese" />

      <main className="pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 page-main-gradient">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-12">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-8 font-label text-xs uppercase tracking-widest text-primary">
            <span>Not sponsored by dairy</span>
            <span className="text-on-surface-variant">(Yet)</span>
          </div>

          <div className="tennis-gradient p-6 sm:p-10 md:p-16 rounded-xl text-center text-on-primary shadow-xl mb-6">
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black mb-3">Say Cheese</h1>
            <p className="font-headline text-lg sm:text-xl md:text-2xl font-bold opacity-90 mb-2">
              THE SMILE WALL
            </p>
            <p className="text-lg opacity-90 font-light italic max-w-xl mx-auto">
              Because smiles deserve a place to live.
            </p>
          </div>

          <blockquote className="bg-surface-container-low rounded-xl p-4 sm:p-6 border-l-2 border-primary italic text-on-surface-variant text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-12 max-w-3xl">
            &ldquo;I came for five seconds. I stayed because everyone was smiling.&rdquo;
          </blockquote>

          <SideBySideLayout>
            <SideBySideContent className="max-w-2xl">
              <SponsorSmileWall />
            </SideBySideContent>

            <SideBySideHero>
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-surface-container-lowest ring-1 ring-outline-variant/20">
                <Image
                  src={HERO_IMAGE}
                  alt={HERO_ALT}
                  width={818}
                  height={1024}
                  className="w-full h-auto"
                  sizes="(max-width: 1024px) 100vw, 560px"
                  priority
                />
              </div>
            </SideBySideHero>
          </SideBySideLayout>

          <div className="mt-10 min-[900px]:hidden">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-surface-container-lowest ring-1 ring-outline-variant/20 max-w-2xl mx-auto">
              <Image
                src={HERO_IMAGE}
                alt={HERO_ALT}
                width={818}
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
